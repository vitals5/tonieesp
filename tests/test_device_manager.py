"""Tests for Multi-Instance Device Manager."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntry

from custom_components.tonieesp.const import (
    CONF_ESPHOME_DEVICE_ID,
    CONF_NAME,
    DEFAULT_MAX_VOLUME,
)
from custom_components.tonieesp.device_manager import TonieBoxDeviceManager


@pytest.fixture
def mock_nfc_manager():
    """Mock NFC manager."""
    mgr = MagicMock()
    mgr.is_learning_active.return_value = False
    mgr.get_effective_media_for_box.return_value = {
        "uid": "TAG_1",
        "media": {"media_id": "test_playlist", "media_type": "playlist"},
        "settings": {"resume": True},
    }
    mgr.get_tag.return_value = {"uid": "TAG_1", "name": "Test Figure"}
    return mgr


@pytest.fixture
def mock_playback_manager():
    """Mock playback manager."""
    mgr = MagicMock()
    mgr.async_handle_tag_placed = AsyncMock()
    mgr.async_handle_tag_removed = AsyncMock()
    return mgr


@pytest.fixture
def mock_ma_adapter():
    """Mock MA adapter."""
    mgr = MagicMock()
    mgr.get_player_state.return_value = {"state": "idle", "volume_level": 0.5}
    return mgr


@pytest.mark.asyncio
async def test_multi_box_management_and_isolation(
    hass, mock_nfc_manager, mock_playback_manager, mock_ma_adapter
):
    """Test managing two distinct Tonieboxes with complete isolation."""
    dm = TonieBoxDeviceManager(hass, mock_nfc_manager, mock_playback_manager, mock_ma_adapter)

    # 1. Setup Box 1 (Kinderzimmer)
    entry_1 = MagicMock(spec=ConfigEntry)
    entry_1.entry_id = "entry_kz"
    entry_1.data = {
        CONF_ESPHOME_DEVICE_ID: "esphome_kz",
        CONF_NAME: "Kinderzimmer",
    }
    entry_1.options = {}

    # 2. Setup Box 2 (Wohnzimmer)
    entry_2 = MagicMock(spec=ConfigEntry)
    entry_2.entry_id = "entry_wz"
    entry_2.data = {
        CONF_ESPHOME_DEVICE_ID: "esphome_wz",
        CONF_NAME: "Wohnzimmer",
    }
    entry_2.options = {}

    with (
        patch("custom_components.tonieesp.entity_resolver.TonieBoxEntityResolver.async_setup"),
        patch("custom_components.tonieesp.entity_resolver.TonieBoxEntityResolver.resolve_entities"),
    ):
        box_1 = await dm.async_add_box(entry_1)
        box_2 = await dm.async_add_box(entry_2)

        assert len(dm.list_boxes()) == 2
        assert dm.get_box("entry_kz") == box_1
        assert dm.get_box("entry_wz") == box_2
        assert dm.get_box_by_esphome_device_id("esphome_kz") == box_1
        assert dm.get_box_by_esphome_device_id("esphome_wz") == box_2

        # 3. Simulate scan on Box 1
        await box_1.async_handle_tag_scanned("TAG_1")

        # Verify Box 1 state updated, Box 2 state untouched!
        assert box_1.current_tag == "TAG_1"
        assert box_2.current_tag is None

        # 4. Update options dynamically on Box 2
        box_2.update_options({"max_volume": 0.50, "pause_on_removal": False})
        assert box_2.max_volume == 0.50
        assert box_2.pause_on_removal is False
        assert box_1.max_volume == DEFAULT_MAX_VOLUME  # Box 1 unchanged

        # 5. Remove Box 1
        await dm.async_remove_box("entry_kz")
        assert len(dm.list_boxes()) == 1
        assert dm.get_box("entry_kz") is None
