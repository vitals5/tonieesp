"""Tests for Event Handler (NFC Scans, Removal, Tap, Tilt)."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.tonieesp.const import (
    EVENT_ESPHOME_TAP,
    EVENT_ESPHOME_TILT,
    EVENT_TAG_SCANNED,
)
from custom_components.tonieesp.event_handler import TonieESPEventHandler


@pytest.fixture
def mock_device_manager():
    """Mock device manager."""
    dm = MagicMock()
    dm.ma_adapter = MagicMock()
    dm.ma_adapter.async_previous = AsyncMock()
    dm.ma_adapter.async_next = AsyncMock()
    dm.ma_adapter.async_seek_relative = AsyncMock()
    return dm


@pytest.fixture
def mock_box():
    """Mock TonieBox instance."""
    box = MagicMock()
    box.name = "Kinderzimmer"
    box.esphome_device_id = "device_kz"
    box.ma_player_entity = "media_player.kz_player"
    box.gestures_enabled = True
    box.left_tap_action = "previous_track"
    box.right_tap_action = "next_track"
    box.left_tilt_action = "seek_backward"
    box.right_tilt_action = "seek_forward"
    box.seek_step = 10
    box.max_volume = 0.8
    box.async_handle_tag_scanned = AsyncMock()
    return box


@pytest.mark.asyncio
async def test_tag_scanned_event_routing(hass, mock_device_manager, mock_box):
    """Test tag_scanned event is routed to the matching Toniebox."""
    mock_device_manager.get_box_by_esphome_device_id.return_value = mock_box

    handler = TonieESPEventHandler(hass, mock_device_manager)
    handler.async_setup()

    # 1. Fire tag_scanned event for our box
    await hass.bus.async_fire(
        EVENT_TAG_SCANNED,
        {"tag_id": "e004015023aabbcc", "device_id": "device_kz"},
    )

    # Box received normalized UID
    mock_box.async_handle_tag_scanned.assert_called_once_with("E004015023AABBCC")

    # 2. Fire tag_scanned for unknown device
    mock_device_manager.get_box_by_esphome_device_id.return_value = None
    mock_box.async_handle_tag_scanned.reset_mock()

    await hass.bus.async_fire(
        EVENT_TAG_SCANNED,
        {"tag_id": "e004015023aabbcc", "device_id": "device_other"},
    )
    assert not mock_box.async_handle_tag_scanned.called

    handler.async_unload()


@pytest.mark.asyncio
async def test_tap_gestures(hass, mock_device_manager, mock_box):
    """Test tap gestures with axis filter and left/right side mapping."""
    mock_device_manager.get_box_by_esphome_device_id.return_value = mock_box
    handler = TonieESPEventHandler(hass, mock_device_manager)
    handler.async_setup()

    # 1. Tap on axis 'z' -> ignored
    await hass.bus.async_fire(
        EVENT_ESPHOME_TAP,
        {"device_id": "device_kz", "axis": "z", "side": "pos"},
    )
    assert not mock_device_manager.ma_adapter.async_previous.called

    # 2. Left tap (axis 'y', side 'pos') -> previous_track
    await hass.bus.async_fire(
        EVENT_ESPHOME_TAP,
        {"device_id": "device_kz", "axis": "y", "side": "pos"},
    )
    mock_device_manager.ma_adapter.async_previous.assert_called_once_with("media_player.kz_player")

    # 3. Right tap (axis 'y', side 'neg') -> next_track
    await hass.bus.async_fire(
        EVENT_ESPHOME_TAP,
        {"device_id": "device_kz", "axis": "y", "side": "neg"},
    )
    mock_device_manager.ma_adapter.async_next.assert_called_once_with("media_player.kz_player")

    handler.async_unload()


@pytest.mark.asyncio
async def test_tilt_gestures(hass, mock_device_manager, mock_box):
    """Test tilt gestures with left/right side mapping."""
    mock_device_manager.get_box_by_esphome_device_id.return_value = mock_box
    handler = TonieESPEventHandler(hass, mock_device_manager)
    handler.async_setup()

    # 1. Left tilt (side 'pos') -> seek backward (-10s)
    await hass.bus.async_fire(
        EVENT_ESPHOME_TILT,
        {"device_id": "device_kz", "side": "pos"},
    )
    mock_device_manager.ma_adapter.async_seek_relative.assert_called_once_with(
        "media_player.kz_player", -10.0
    )

    # 2. Right tilt (side 'neg') -> seek forward (+10s)
    mock_device_manager.ma_adapter.async_seek_relative.reset_mock()
    await hass.bus.async_fire(
        EVENT_ESPHOME_TILT,
        {"device_id": "device_kz", "side": "neg"},
    )
    mock_device_manager.ma_adapter.async_seek_relative.assert_called_once_with(
        "media_player.kz_player", 10.0
    )

    handler.async_unload()
