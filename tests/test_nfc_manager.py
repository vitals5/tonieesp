"""Tests for the Central NFC Manager."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.tonieesp.nfc_manager import (
    NFCManager,
    is_valid_uid,
    normalize_uid,
)


@pytest.fixture
def mock_storage():
    """Mock storage fixture."""
    storage = MagicMock()
    storage.async_load_tags = AsyncMock(return_value={"schema_version": 1, "tags": {}})
    storage.async_save_tags = AsyncMock()
    return storage


def test_uid_normalization():
    """Test UID normalization strips punctuation and converts to uppercase."""
    assert normalize_uid("e0:04:01:50:23:aa:bb:cc") == "E004015023AABBCC"
    assert normalize_uid("e0-04-01-50-23-aa-bb-cc") == "E004015023AABBCC"
    assert normalize_uid(" e0 04 01 50 23 aa bb cc ") == "E004015023AABBCC"
    assert normalize_uid("E004015023AABBCC") == "E004015023AABBCC"
    assert normalize_uid("") == ""


def test_uid_validation():
    """Test hex UID validation."""
    assert is_valid_uid("E004015023AABBCC") is True
    assert is_valid_uid("0123456789ABCDEF") is True
    assert is_valid_uid("12345678") is True  # 8 hex chars
    assert is_valid_uid("ZZZZ") is False  # Non-hex
    assert is_valid_uid("1234") is False  # Too short
    assert is_valid_uid("123456789012345678901234567890123456") is False  # Too long


@pytest.mark.asyncio
async def test_tag_crud_and_overrides(hass, mock_storage):
    """Test creating, overriding, and deleting tags."""
    manager = NFCManager(hass, mock_storage)
    await manager.async_load()

    # 1. Save global tag
    tag_data = {
        "uid": "e004015023aabbcc",
        "name": "Die drei Fragezeichen",
        "description": "Folge 1",
        "image": "https://example.com/cover.jpg",
        "media": {
            "provider": "music_assistant",
            "media_type": "playlist",
            "media_id": "spotify://playlist/123",
            "title": "Folge 1",
        },
        "settings": {
            "resume": True,
            "shuffle": False,
            "repeat": "off",
        },
        "overrides": {
            "box_living_room": {
                "media": {
                    "provider": "music_assistant",
                    "media_type": "playlist",
                    "media_id": "spotify://playlist/living_room_special",
                }
            }
        },
    }

    saved = await manager.async_save_tag(tag_data)
    assert saved["uid"] == "E004015023AABBCC"
    assert manager.is_known_tag("e004015023aabbcc") is True
    assert mock_storage.async_save_tags.called

    # 2. Check effective media for normal box (Kinderzimmer) -> gets global playlist
    eff_kids = manager.get_effective_media_for_box("E004015023AABBCC", "box_kids_room")
    assert eff_kids is not None
    assert eff_kids["has_override"] is False
    assert eff_kids["media"]["media_id"] == "spotify://playlist/123"

    # 3. Check effective media for Wohnzimmer -> gets overridden playlist!
    eff_living = manager.get_effective_media_for_box("E004015023AABBCC", "box_living_room")
    assert eff_living is not None
    assert eff_living["has_override"] is True
    assert eff_living["media"]["media_id"] == "spotify://playlist/living_room_special"

    # 4. Search & Filter
    results = manager.list_tags(search="Fragezeichen")
    assert len(results) == 1
    assert results[0]["uid"] == "E004015023AABBCC"

    results_empty = manager.list_tags(search="Unbekannt")
    assert len(results_empty) == 0

    results_type = manager.list_tags(media_type="playlist")
    assert len(results_type) == 1

    results_wrong_type = manager.list_tags(media_type="radio")
    assert len(results_wrong_type) == 0

    # 5. Export and Import
    exported = manager.export_tags()
    assert len(exported) == 1
    assert exported[0]["name"] == "Die drei Fragezeichen"

    # 6. Delete
    deleted = await manager.async_delete_tag("E004015023AABBCC")
    assert deleted is True
    assert manager.is_known_tag("E004015023AABBCC") is False


@pytest.mark.asyncio
async def test_scan_learning_mode(hass, mock_storage):
    """Test scan learning mode captures tag and calls listeners."""
    manager = NFCManager(hass, mock_storage)
    await manager.async_load()

    captured = []

    def on_captured(uid: str, device_id: str):
        captured.append((uid, device_id))

    manager.start_learning_mode(device_id="box_1", timeout_seconds=10, callback=on_captured)
    assert manager.is_learning_active("box_1") is True
    assert manager.is_learning_active("box_2") is False

    # Scan on box_1 is captured
    consumed = manager.process_learned_tag("e004015011223344", "box_1")
    assert consumed is True
    assert len(captured) == 1
    assert captured[0] == ("E004015011223344", "box_1")

    # Stop learning
    manager.stop_learning_mode()
    assert manager.is_learning_active("box_1") is False
    consumed_after = manager.process_learned_tag("e004015011223344", "box_1")
    assert consumed_after is False
