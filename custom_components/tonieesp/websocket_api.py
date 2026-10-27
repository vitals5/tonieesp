"""WebSocket API for TonieESP side panel."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import (
    DOMAIN,
    WS_TYPE_BOXES_LIST,
    WS_TYPE_BOXES_UPDATE,
    WS_TYPE_DIAGNOSTICS,
    WS_TYPE_EVENTS_SUBSCRIBE,
    WS_TYPE_MEDIA_SEARCH,
    WS_TYPE_PLAYBACK_CONTROL,
    WS_TYPE_TAGS_DELETE,
    WS_TYPE_TAGS_EXPORT,
    WS_TYPE_TAGS_GET,
    WS_TYPE_TAGS_IMPORT,
    WS_TYPE_TAGS_LEARN_START,
    WS_TYPE_TAGS_LEARN_STOP,
    WS_TYPE_TAGS_LIST,
    WS_TYPE_TAGS_SAVE,
)
from .coordinator import TonieESPCoordinator

_LOGGER = logging.getLogger(__name__)


def get_coordinator(hass: HomeAssistant) -> TonieESPCoordinator:
    """Retrieve central TonieESP coordinator."""
    return hass.data[DOMAIN]["coordinator"]


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register all TonieESP WebSocket commands."""
    websocket_api.async_register_command(hass, ws_handle_boxes_list)
    websocket_api.async_register_command(hass, ws_handle_boxes_update)
    websocket_api.async_register_command(hass, ws_handle_tags_list)
    websocket_api.async_register_command(hass, ws_handle_tags_get)
    websocket_api.async_register_command(hass, ws_handle_tags_save)
    websocket_api.async_register_command(hass, ws_handle_tags_delete)
    websocket_api.async_register_command(hass, ws_handle_tags_import)
    websocket_api.async_register_command(hass, ws_handle_tags_export)
    websocket_api.async_register_command(hass, ws_handle_tags_learn_start)
    websocket_api.async_register_command(hass, ws_handle_tags_learn_stop)
    websocket_api.async_register_command(hass, ws_handle_media_search)
    websocket_api.async_register_command(hass, ws_handle_playback_control)
    websocket_api.async_register_command(hass, ws_handle_events_subscribe)
    websocket_api.async_register_command(hass, ws_handle_diagnostics)


# --- Handlers ---


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_BOXES_LIST})
@websocket_api.async_response
async def ws_handle_boxes_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return all configured Toniebox instances with state."""
    coord = get_coordinator(hass)
    boxes = coord.device_manager.list_boxes()
    connection.send_result(msg["id"], boxes)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_BOXES_UPDATE,
        vol.Required("box_id"): str,
        vol.Required("settings"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_boxes_update(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Update settings on a Toniebox."""
    coord = get_coordinator(hass)
    box = coord.device_manager.get_box(msg["box_id"])
    if not box:
        connection.send_error(msg["id"], "not_found", f"Box {msg['box_id']} not found")
        return

    settings = msg["settings"]
    box.update_options(settings)

    # Persist in config entry options
    entry = box.entry
    new_options = {**entry.options, **settings}
    hass.config_entries.async_update_entry(entry, options=new_options)

    connection.send_result(msg["id"], box.get_state())


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_LIST,
        vol.Optional("search"): str,
        vol.Optional("media_type"): str,
    }
)
@websocket_api.async_response
async def ws_handle_tags_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """List NFC tags."""
    coord = get_coordinator(hass)
    tags = coord.nfc_manager.list_tags(
        search=msg.get("search"), media_type=msg.get("media_type")
    )
    connection.send_result(msg["id"], tags)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_GET,
        vol.Required("uid"): str,
    }
)
@websocket_api.async_response
async def ws_handle_tags_get(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Get tag details by UID."""
    coord = get_coordinator(hass)
    tag = coord.nfc_manager.get_tag(msg["uid"])
    if not tag:
        connection.send_error(msg["id"], "not_found", f"Tag {msg['uid']} not found")
        return
    connection.send_result(msg["id"], tag)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_SAVE,
        vol.Required("tag"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_tags_save(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save or update a tag."""
    coord = get_coordinator(hass)
    try:
        saved = await coord.nfc_manager.async_save_tag(msg["tag"])
        connection.send_result(msg["id"], saved)
    except Exception as err:
        connection.send_error(msg["id"], "save_failed", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_DELETE,
        vol.Required("uid"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_tags_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a tag by UID."""
    coord = get_coordinator(hass)
    deleted = await coord.nfc_manager.async_delete_tag(msg["uid"])
    connection.send_result(msg["id"], {"deleted": deleted})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_IMPORT,
        vol.Required("tags"): list,
        vol.Optional("overwrite", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_tags_import(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Import tags from JSON."""
    coord = get_coordinator(hass)
    count = await coord.nfc_manager.async_import_tags(
        tags_list=msg["tags"], overwrite=msg.get("overwrite", False)
    )
    connection.send_result(msg["id"], {"count": count})


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_TAGS_EXPORT})
@websocket_api.async_response
async def ws_handle_tags_export(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Export all tags."""
    coord = get_coordinator(hass)
    tags = coord.nfc_manager.export_tags()
    connection.send_result(msg["id"], tags)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_TAGS_LEARN_START,
        vol.Optional("device_id"): str,
        vol.Optional("timeout", default=60): int,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_tags_learn_start(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Activate scan learning mode."""
    coord = get_coordinator(hass)
    coord.nfc_manager.start_learning_mode(
        device_id=msg.get("device_id"),
        timeout_seconds=msg.get("timeout", 60),
    )
    connection.send_result(msg["id"], {"active": True})


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_TAGS_LEARN_STOP})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_handle_tags_learn_stop(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Deactivate scan learning mode."""
    coord = get_coordinator(hass)
    coord.nfc_manager.stop_learning_mode()
    connection.send_result(msg["id"], {"active": False})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_MEDIA_SEARCH,
        vol.Required("query"): str,
        vol.Optional("media_types"): list,
    }
)
@websocket_api.async_response
async def ws_handle_media_search(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Search Music Assistant catalog."""
    coord = get_coordinator(hass)
    results = await coord.ma_adapter.async_search_media(
        query=msg["query"], media_types=msg.get("media_types")
    )
    connection.send_result(msg["id"], results)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_PLAYBACK_CONTROL,
        vol.Required("box_id"): str,
        vol.Required("action"): str,
        vol.Optional("data"): dict,
    }
)
@websocket_api.async_response
async def ws_handle_playback_control(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Control playback on a Toniebox."""
    coord = get_coordinator(hass)
    box = coord.device_manager.get_box(msg["box_id"])
    if not box:
        connection.send_error(msg["id"], "not_found", f"Box {msg['box_id']} not found")
        return

    player = box.ma_player_entity
    if not player:
        connection.send_error(msg["id"], "no_player", "No media player resolved for this box")
        return

    action = msg["action"]
    data = msg.get("data") or {}
    ma = coord.ma_adapter

    if action == "play":
        await ma.async_resume(player)
    elif action == "pause":
        await ma.async_pause(player)
    elif action == "stop":
        await ma.async_stop(player)
    elif action == "next":
        await ma.async_next(player)
    elif action == "previous":
        await ma.async_previous(player)
    elif action == "seek":
        pos = float(data.get("position", 0.0))
        await ma.async_seek(player, pos)
    elif action == "volume":
        vol_level = float(data.get("volume", 0.5))
        await ma.async_set_volume(player, vol_level, max_volume=box.max_volume)
    elif action == "play_tag":
        uid = data.get("uid")
        if uid:
            await box.async_handle_tag_scanned(uid)
    else:
        connection.send_error(msg["id"], "invalid_action", f"Unknown action {action}")
        return

    connection.send_result(msg["id"], {"status": "ok"})


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_EVENTS_SUBSCRIBE})
@websocket_api.async_response
async def ws_handle_events_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Subscribe to real-time TonieESP events (box states, scans, learning, tag edits)."""
    coord = get_coordinator(hass)
    sub_id = msg["id"]

    def _on_box_event(action: str, data: dict[str, Any]) -> None:
        connection.send_event(sub_id, {"event_type": f"box_{action}", "data": data})

    def _on_tag_event(action: str, data: dict[str, Any]) -> None:
        connection.send_event(sub_id, {"event_type": f"tag_{action}", "data": data})

    def _on_tag_learned(uid: str, device_id: str) -> None:
        connection.send_event(
            sub_id,
            {"event_type": "tag_learned", "data": {"uid": uid, "device_id": device_id}},
        )

    unsub_box = coord.device_manager.register_listener(_on_box_event)
    unsub_tag = coord.nfc_manager.register_listener(_on_tag_event)
    coord.nfc_manager._learning_callbacks.append(_on_tag_learned)

    @callback
    def _unsubscribe() -> None:
        unsub_box()
        unsub_tag()
        if _on_tag_learned in coord.nfc_manager._learning_callbacks:
            coord.nfc_manager._learning_callbacks.remove(_on_tag_learned)

    connection.subscriptions[sub_id] = _unsubscribe
    connection.send_result(sub_id)


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_DIAGNOSTICS})
@websocket_api.async_response
async def ws_handle_diagnostics(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return diagnostic telemetry for troubleshooting."""
    coord = get_coordinator(hass)
    boxes = coord.device_manager.list_boxes()
    diag = {
        "box_count": len(boxes),
        "tag_count": len(coord.nfc_manager._tags),
        "music_assistant_available": coord.ma_adapter.is_ma_available(),
        "boxes": boxes,
    }
    connection.send_result(msg["id"], diag)
