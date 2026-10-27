"""Tests for Music Assistant Adapter."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest

from custom_components.tonieesp.music_assistant import MusicAssistantAdapter


@pytest.mark.asyncio
async def test_play_media_with_ma_service(hass):
    """Test play_media calls music_assistant.play_media when available."""
    adapter = MusicAssistantAdapter(hass)

    called_services = []

    def mock_service_handler(domain, service, data, target):
        called_services.append((domain, service, data, target))

    hass.services._services = {"music_assistant": {"play_media": mock_service_handler}}

    await adapter.async_play_media(
        player_entity_id="media_player.toniebox_2",
        media_type="playlist",
        media_id="spotify://playlist/123",
    )

    assert len(called_services) == 1
    domain, service, data, target = called_services[0]
    assert domain == "music_assistant"
    assert service == "play_media"
    assert data["media_id"] == "spotify://playlist/123"
    assert target["entity_id"] == "media_player.toniebox_2"


@pytest.mark.asyncio
async def test_play_media_fallback_when_ma_unavailable(hass):
    """Test fallback to standard media_player.play_media when MA is not installed."""
    adapter = MusicAssistantAdapter(hass)

    called_services = []

    def mock_service_handler(domain, service, data, target):
        called_services.append((domain, service, data, target))

    hass.services._services = {"media_player": {"play_media": mock_service_handler}}

    await adapter.async_play_media(
        player_entity_id="media_player.toniebox_speaker",
        media_type="playlist",
        media_id="radio://station/123",
    )

    assert len(called_services) == 1
    domain, service, data, target = called_services[0]
    assert domain == "media_player"
    assert service == "play_media"
    assert data["media_content_id"] == "radio://station/123"


@pytest.mark.asyncio
async def test_seek_relative_with_elapsed_time_correction(hass):
    """Test relative seek calculates live position from media_position and media_position_updated_at."""
    adapter = MusicAssistantAdapter(hass)

    # Set up player state: 50s at 10 seconds ago -> current is ~60s
    updated_at = datetime.now(UTC)
    hass.states.set(
        "media_player.box",
        "playing",
        {
            "media_position": 50.0,
            "media_position_updated_at": updated_at,
            "media_duration": 300.0,
        },
    )

    called_seeks = []

    def mock_seek(domain, service, data, target):
        called_seeks.append(data["seek_position"])

    hass.services._services = {"media_player": {"media_seek": mock_seek}}

    # Seek forward 15 seconds
    await adapter.async_seek_relative("media_player.box", 15.0)

    assert len(called_seeks) == 1
    seek_target = called_seeks[0]
    # Expected: 50 + elapsed (~0) + 15 ≈ 65.0
    assert 64.0 <= seek_target <= 66.0


@pytest.mark.asyncio
async def test_volume_clamping(hass):
    """Test setting volume is clamped by max_volume ceiling."""
    adapter = MusicAssistantAdapter(hass)

    called_volumes = []

    def mock_vol(domain, service, data, target):
        called_volumes.append(data["volume_level"])

    hass.services._services = {"media_player": {"volume_set": mock_vol}}

    # Request 0.95 with max volume capped at 0.70
    await adapter.async_set_volume("media_player.box", 0.95, max_volume=0.70)

    assert len(called_volumes) == 1
    assert called_volumes[0] == 0.70
