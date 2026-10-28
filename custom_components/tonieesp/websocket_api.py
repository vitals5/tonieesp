"""WebSocket API for TonieESP side panel."""

from __future__ import annotations

import logging
import urllib.parse
from pathlib import Path
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
    WS_TYPE_MEDIA_BROWSE_IMAGES,
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
    websocket_api.async_register_command(hass, ws_handle_media_browse_images)
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

    settings = dict(msg["settings"])

    # If hardware tuning settings are provided, update ESPHome number entities
    tap_threshold = settings.pop("tap_threshold", None)
    tap_time_limit = settings.pop("tap_time_limit", None)
    if tap_threshold is not None or tap_time_limit is not None:
        await box.async_set_hardware_tuning(
            tap_threshold=tap_threshold, tap_time_limit=tap_time_limit
        )

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
    tags = coord.nfc_manager.list_tags(search=msg.get("search"), media_type=msg.get("media_type"))
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


TONIE_PRESETS = [
    {
        "id": "preset_kreativ_rot",
        "title": "Kreativ-Tonie (Rot)",
        "color": "#e53935",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_blau",
        "title": "Kreativ-Tonie (Blau)",
        "color": "#1e88e5",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_gruen",
        "title": "Kreativ-Tonie (Grün)",
        "color": "#43a047",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_pink",
        "title": "Kreativ-Tonie (Pink)",
        "color": "#d81b60",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_anthrazit",
        "title": "Kreativ-Tonie (Anthrazit)",
        "color": "#37474f",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_orange",
        "title": "Kreativ-Tonie (Orange)",
        "color": "#fb8c00",
        "category": "kreativ",
    },
    {
        "id": "preset_kreativ_tuerkis",
        "title": "Kreativ-Tonie (Türkis)",
        "color": "#00acc1",
        "category": "kreativ",
    },
    {
        "id": "preset_hoerspiel",
        "title": "Hörspiel / Geschichte",
        "color": "#8e24aa",
        "category": "audio",
    },
    {
        "id": "preset_musik",
        "title": "Kinderlieder / Musik",
        "color": "#3949ab",
        "category": "audio",
    },
    {
        "id": "preset_schlaf",
        "title": "Schlaflieder & Entspannung",
        "color": "#5c6bc0",
        "category": "audio",
    },
]


def _build_preset_svg_url(color: str, title: str) -> str:
    """Build an inline SVG data URI for a Tonie figurine preset."""
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">'
        f'<rect width="100" height="100" rx="20" fill="{color}"/>'
        f'<circle cx="50" cy="42" r="22" fill="white" opacity="0.9"/>'
        f'<path d="M38 25 L34 10 L44 20 Z" fill="white" opacity="0.9"/>'
        f'<path d="M62 25 L66 10 L56 20 Z" fill="white" opacity="0.9"/>'
        f'<circle cx="44" cy="40" r="2.5" fill="{color}"/>'
        f'<circle cx="56" cy="40" r="2.5" fill="{color}"/>'
        f'<path d="M45 47 Q50 51 55 47" stroke="{color}" stroke-width="2" fill="none" stroke-linecap="round"/>'
        f'<rect x="35" y="62" width="30" height="22" rx="6" fill="white" opacity="0.9"/>'
        f"</svg>"
    )
    return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_MEDIA_BROWSE_IMAGES,
        vol.Optional("media_content_id", default=""): str,
    }
)
@websocket_api.async_response
async def ws_handle_media_browse_images(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Browse cover images from Home Assistant media source, local /config/www, and built-in presets."""
    media_content_id = (msg.get("media_content_id") or "").strip()

    directories: list[dict[str, Any]] = []
    images: list[dict[str, Any]] = []
    parents: list[dict[str, Any]] = []
    current_title = "Medienauswahl"

    presets = [
        {
            "id": p["id"],
            "title": p["title"],
            "url": _build_preset_svg_url(p["color"], p["title"]),
            "category": p["category"],
        }
        for p in TONIE_PRESETS
    ]

    image_exts = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"}
    www_dir = Path(hass.config.path("www"))

    if media_content_id.startswith("tonieesp_www://"):
        rel_str = media_content_id[len("tonieesp_www://") :].lstrip("/")
        target_dir = www_dir / rel_str if rel_str else www_dir
        current_title = target_dir.name if rel_str else "Lokale Dateien (/local/)"
        parents.append({"title": "Medien-Startseite", "media_content_id": ""})
        if rel_str:
            parent_rel = str(Path(rel_str).parent)
            if parent_rel == ".":
                parents.append(
                    {"title": "Lokale Dateien (/local/)", "media_content_id": "tonieesp_www://"}
                )
            else:
                parents.append(
                    {
                        "title": Path(parent_rel).name,
                        "media_content_id": f"tonieesp_www://{parent_rel}",
                    }
                )

        if www_dir.exists() and target_dir.exists() and target_dir.is_dir():
            try:
                resolved_target = target_dir.resolve()
                if resolved_target.is_relative_to(www_dir.resolve()):
                    for item in sorted(resolved_target.iterdir()):
                        if item.name.startswith("."):
                            continue
                        if item.is_dir():
                            sub_rel = item.relative_to(www_dir.resolve()).as_posix()
                            directories.append(
                                {
                                    "title": item.name,
                                    "media_content_id": f"tonieesp_www://{sub_rel}",
                                    "can_expand": True,
                                }
                            )
                        elif item.is_file() and item.suffix.lower() in image_exts:
                            sub_rel = item.relative_to(www_dir.resolve()).as_posix()
                            img_url = f"/local/{sub_rel}"
                            images.append(
                                {
                                    "title": item.name,
                                    "url": img_url,
                                    "thumbnail": img_url,
                                    "media_content_id": f"tonieesp_www://{sub_rel}",
                                }
                            )
            except Exception as err:
                _LOGGER.debug("Error reading local www directory %s: %s", target_dir, err)

    elif media_content_id.startswith("media-source://"):
        parents.append({"title": "Medien-Startseite", "media_content_id": ""})
        current_title = "Home Assistant Medien"
        if "media_source" in hass.config.components:
            try:
                from homeassistant.components import media_source

                browse_item = await media_source.async_browse_media(hass, media_content_id)
                current_title = browse_item.title or current_title
                for child in browse_item.children or []:
                    if child.can_expand:
                        directories.append(
                            {
                                "title": child.title,
                                "media_content_id": child.media_content_id,
                                "can_expand": True,
                            }
                        )
                    elif child.media_class == "image" or any(
                        child.title.lower().endswith(ext) for ext in image_exts
                    ):
                        resolved_url = child.thumbnail or ""
                        try:
                            resolved = await media_source.async_resolve_media(
                                hass, child.media_content_id, None
                            )
                            resolved_url = media_source.async_process_play_media_url(
                                hass, resolved.url, allow_relative_url=True
                            )
                        except Exception:
                            pass
                        if not resolved_url:
                            resolved_url = child.thumbnail or child.media_content_id
                        images.append(
                            {
                                "title": child.title,
                                "url": resolved_url,
                                "thumbnail": child.thumbnail or resolved_url,
                                "media_content_id": child.media_content_id,
                            }
                        )
            except Exception as err:
                _LOGGER.debug("Error browsing media_source %s: %s", media_content_id, err)

    else:
        # ROOT VIEW
        current_title = "Medien-Startseite"

        if www_dir.exists() and www_dir.is_dir():
            has_subdirs = any(p.is_dir() and not p.name.startswith(".") for p in www_dir.iterdir())
            has_images = any(
                p.is_file() and p.suffix.lower() in image_exts for p in www_dir.iterdir()
            )
            if has_subdirs or has_images:
                directories.append(
                    {
                        "title": "📁 Lokale Dateien (/local/)",
                        "media_content_id": "tonieesp_www://",
                        "can_expand": True,
                    }
                )
                for item in sorted(www_dir.iterdir()):
                    if (
                        item.is_file()
                        and item.suffix.lower() in image_exts
                        and not item.name.startswith(".")
                    ):
                        img_url = f"/local/{item.name}"
                        images.append(
                            {
                                "title": item.name,
                                "url": img_url,
                                "thumbnail": img_url,
                                "media_content_id": f"tonieesp_www://{item.name}",
                            }
                        )

        if "media_source" in hass.config.components:
            try:
                from homeassistant.components import media_source

                browse_root = await media_source.async_browse_media(hass, None)
                for child in browse_root.children or []:
                    if child.can_expand:
                        directories.append(
                            {
                                "title": f"📁 {child.title}",
                                "media_content_id": child.media_content_id,
                                "can_expand": True,
                            }
                        )
                    elif child.media_class == "image" or any(
                        child.title.lower().endswith(ext) for ext in image_exts
                    ):
                        img_url = child.thumbnail or child.media_content_id
                        images.append(
                            {
                                "title": child.title,
                                "url": img_url,
                                "thumbnail": img_url,
                                "media_content_id": child.media_content_id,
                            }
                        )
            except Exception as err:
                _LOGGER.debug("Error browsing media_source root: %s", err)

    connection.send_result(
        msg["id"],
        {
            "current": {"title": current_title, "media_content_id": media_content_id},
            "parents": parents,
            "directories": directories,
            "images": images,
            "presets": presets,
        },
    )


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

    active_player = box.get_active_player_entity() or box.ma_player_entity or box.speaker_entity
    fallback_player = (
        box.speaker_entity if active_player == box.ma_player_entity else box.ma_player_entity
    )

    if not active_player:
        connection.send_error(msg["id"], "no_player", "No media player resolved for this box")
        return

    action = msg["action"]
    data = msg.get("data") or {}
    ma = coord.ma_adapter

    try:
        if action in ("play_pause", "toggle"):
            await ma.async_play_pause(active_player, fallback_entity_id=fallback_player)
        elif action == "play":
            st = hass.states.get(active_player)
            if st and st.state in ("idle", "off") and box.current_tag:
                await box.async_handle_tag_scanned(box.current_tag)
            else:
                await ma.async_resume(active_player, fallback_entity_id=fallback_player)
        elif action == "pause":
            await ma.async_pause(active_player, fallback_entity_id=fallback_player)
        elif action == "stop":
            await ma.async_stop(active_player, fallback_entity_id=fallback_player)
        elif action == "next":
            await ma.async_next(active_player, fallback_entity_id=fallback_player)
        elif action == "previous":
            await ma.async_previous(active_player, fallback_entity_id=fallback_player)
        elif action == "seek":
            pos = float(data.get("position", 0.0))
            await ma.async_seek(active_player, pos, fallback_entity_id=fallback_player)
        elif action == "volume":
            vol_level = float(data.get("volume", 0.5))
            await ma.async_set_volume(
                active_player,
                vol_level,
                max_volume=box.max_volume,
                fallback_entity_id=fallback_player,
            )
        elif action == "play_tag":
            uid = data.get("uid")
            if uid:
                await box.async_handle_tag_scanned(uid)
        elif action == "shuffle":
            shuffle_val = bool(data.get("shuffle", True))
            await ma.async_set_shuffle(
                active_player, shuffle_val, fallback_entity_id=fallback_player
            )
        elif action == "repeat":
            repeat_val = str(data.get("repeat", "off"))
            await ma.async_set_repeat(active_player, repeat_val, fallback_entity_id=fallback_player)
        else:
            connection.send_error(msg["id"], "invalid_action", f"Unknown action {action}")
            return
        connection.send_result(msg["id"], {"status": "ok"})
    except Exception as err:
        _LOGGER.error("Playback control error for action '%s': %s", action, err)
        connection.send_error(msg["id"], "playback_error", str(err))


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
