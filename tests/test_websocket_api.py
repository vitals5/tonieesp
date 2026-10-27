"""Tests for WebSocket API endpoints."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.tonieesp.const import DOMAIN
from custom_components.tonieesp.coordinator import TonieESPCoordinator
from custom_components.tonieesp.websocket_api import (
    ws_handle_boxes_list,
    ws_handle_boxes_update,
    ws_handle_playback_control,
    ws_handle_tags_delete,
    ws_handle_tags_learn_start,
    ws_handle_tags_learn_stop,
    ws_handle_tags_list,
    ws_handle_tags_save,
)


def unwrap(fn):
    """Unwrap decorators to get the underlying async function."""
    while hasattr(fn, "__wrapped__"):
        fn = fn.__wrapped__
    return fn


@pytest.fixture
def mock_coordinator():
    """Mock coordinator fixture."""
    coord = MagicMock(spec=TonieESPCoordinator)
    coord.device_manager = MagicMock()
    coord.nfc_manager = MagicMock()
    coord.playback_manager = MagicMock()
    coord.ma_adapter = MagicMock()
    return coord


@pytest.fixture
def mock_connection():
    """Mock WebSocket active connection."""
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_event = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock()
    conn.user.is_admin = True
    return conn


@pytest.mark.asyncio
async def test_ws_boxes_list_and_update(hass, mock_coordinator, mock_connection):
    """Test listing boxes and updating settings over WebSocket."""
    hass.data[DOMAIN]["coordinator"] = mock_coordinator
    mock_coordinator.device_manager.list_boxes.return_value = [{"id": "box_1", "name": "Box 1"}]

    box_mock = MagicMock()
    box_mock.entry = MagicMock()
    box_mock.entry.options = {}
    box_mock.get_state.return_value = {"id": "box_1", "name": "Box 1", "max_volume": 0.65}
    mock_coordinator.device_manager.get_box.return_value = box_mock

    # 1. List
    await unwrap(ws_handle_boxes_list)(
        hass, mock_connection, {"id": 1, "type": "tonieesp/boxes/list"}
    )
    mock_connection.send_result.assert_called_once_with(1, [{"id": "box_1", "name": "Box 1"}])

    # 2. Update
    mock_connection.send_result.reset_mock()
    await unwrap(ws_handle_boxes_update)(
        hass,
        mock_connection,
        {
            "id": 2,
            "type": "tonieesp/boxes/update",
            "box_id": "box_1",
            "settings": {"max_volume": 0.65},
        },
    )
    box_mock.update_options.assert_called_once_with({"max_volume": 0.65})
    assert mock_connection.send_result.called


@pytest.mark.asyncio
async def test_ws_tags_crud(hass, mock_coordinator, mock_connection):
    """Test tag CRUD over WebSocket."""
    hass.data[DOMAIN]["coordinator"] = mock_coordinator

    mock_coordinator.nfc_manager.list_tags.return_value = [{"uid": "TAG_1", "name": "Tonie 1"}]
    mock_coordinator.nfc_manager.async_save_tag = AsyncMock(
        return_value={"uid": "TAG_1", "name": "Tonie 1"}
    )
    mock_coordinator.nfc_manager.async_delete_tag = AsyncMock(return_value=True)

    # 1. List
    await unwrap(ws_handle_tags_list)(
        hass, mock_connection, {"id": 1, "type": "tonieesp/tags/list"}
    )
    mock_connection.send_result.assert_called_once_with(1, [{"uid": "TAG_1", "name": "Tonie 1"}])

    # 2. Save
    mock_connection.send_result.reset_mock()
    tag_data = {"uid": "TAG_1", "name": "Tonie 1"}
    await unwrap(ws_handle_tags_save)(
        hass,
        mock_connection,
        {"id": 2, "type": "tonieesp/tags/save", "tag": tag_data},
    )
    mock_coordinator.nfc_manager.async_save_tag.assert_called_once_with(tag_data)
    assert mock_connection.send_result.called

    # 3. Delete
    mock_connection.send_result.reset_mock()
    await unwrap(ws_handle_tags_delete)(
        hass,
        mock_connection,
        {"id": 3, "type": "tonieesp/tags/delete", "uid": "TAG_1"},
    )
    mock_coordinator.nfc_manager.async_delete_tag.assert_called_once_with("TAG_1")
    mock_connection.send_result.assert_called_once_with(3, {"deleted": True})


@pytest.mark.asyncio
async def test_ws_learning_mode_control(hass, mock_coordinator, mock_connection):
    """Test starting and stopping scan learning mode."""
    hass.data[DOMAIN]["coordinator"] = mock_coordinator

    # Start
    await unwrap(ws_handle_tags_learn_start)(
        hass,
        mock_connection,
        {"id": 1, "type": "tonieesp/tags/learn_start", "device_id": "box_1", "timeout": 45},
    )
    mock_coordinator.nfc_manager.start_learning_mode.assert_called_once_with(
        device_id="box_1", timeout_seconds=45
    )
    mock_connection.send_result.assert_called_once_with(1, {"active": True})

    # Stop
    mock_connection.send_result.reset_mock()
    await unwrap(ws_handle_tags_learn_stop)(
        hass, mock_connection, {"id": 2, "type": "tonieesp/tags/learn_stop"}
    )
    mock_coordinator.nfc_manager.stop_learning_mode.assert_called_once()
    mock_connection.send_result.assert_called_once_with(2, {"active": False})


@pytest.mark.asyncio
async def test_ws_playback_control(hass, mock_coordinator, mock_connection):
    """Test controlling playback over WebSocket."""
    hass.data[DOMAIN]["coordinator"] = mock_coordinator

    box_mock = MagicMock()
    box_mock.ma_player_entity = "media_player.box_player"
    box_mock.max_volume = 0.8
    mock_coordinator.device_manager.get_box.return_value = box_mock
    mock_coordinator.ma_adapter.async_resume = AsyncMock()
    mock_coordinator.ma_adapter.async_pause = AsyncMock()

    # Play
    await unwrap(ws_handle_playback_control)(
        hass,
        mock_connection,
        {"id": 1, "type": "tonieesp/playback/control", "box_id": "box_1", "action": "play"},
    )
    mock_coordinator.ma_adapter.async_resume.assert_called_once_with("media_player.box_player")
    mock_connection.send_result.assert_called_once_with(1, {"status": "ok"})

    # Pause
    mock_connection.send_result.reset_mock()
    await unwrap(ws_handle_playback_control)(
        hass,
        mock_connection,
        {"id": 2, "type": "tonieesp/playback/control", "box_id": "box_1", "action": "pause"},
    )
    mock_coordinator.ma_adapter.async_pause.assert_called_once_with("media_player.box_player")
    mock_connection.send_result.assert_called_once_with(2, {"status": "ok"})
