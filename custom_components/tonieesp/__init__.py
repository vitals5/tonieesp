"""The TonieESP integration."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_ICON,
    FRONTEND_STATIC_PATH,
    FRONTEND_TITLE,
    FRONTEND_URL_PATH,
)
from .coordinator import TonieESPCoordinator
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up the TonieESP component."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up a TonieESP config entry."""
    hass.data.setdefault(DOMAIN, {})

    coordinator: TonieESPCoordinator | None = hass.data[DOMAIN].get("coordinator")
    if coordinator is None:
        coordinator = TonieESPCoordinator(hass)
        hass.data[DOMAIN]["coordinator"] = coordinator
        await coordinator.async_setup()

        # Register WebSocket API
        async_register_websocket_api(hass)

        # Register frontend static path and side panel
        await _async_register_frontend(hass)

    # Register this Toniebox instance
    box = await coordinator.device_manager.async_add_box(entry)
    entry.runtime_data = box

    # Listen for options updates
    entry.async_on_unload(entry.add_update_listener(async_reload_entry))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a TonieESP config entry."""
    coordinator: TonieESPCoordinator | None = hass.data[DOMAIN].get("coordinator")
    if coordinator:
        await coordinator.device_manager.async_remove_box(entry.entry_id)

        # If this was the last Toniebox entry, clean up central coordinator and panel
        current_entries = hass.config_entries.async_entries(DOMAIN)
        if len(current_entries) <= 1:
            _LOGGER.info("Last Toniebox removed, cleaning up TonieESP panel and resources")
            await coordinator.async_unload()
            try:
                frontend.async_remove_panel(hass, FRONTEND_URL_PATH)
            except Exception as err:
                _LOGGER.debug("Could not remove frontend panel: %s", err)
            hass.data.pop(DOMAIN, None)

    return True


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Register frontend JavaScript resource and Home Assistant sidebar panel."""
    # Look for compiled frontend in custom_components/tonieesp/frontend/tonieesp-panel.js
    frontend_dir = Path(__file__).parent / "frontend"
    frontend_js = frontend_dir / "tonieesp-panel.js"

    # Register static path in HTTP server
    if hasattr(hass, "http") and hasattr(hass.http, "register_static_path"):
        try:
            hass.http.register_static_path(
                FRONTEND_STATIC_PATH,
                str(frontend_js),
                cache_headers=False,
            )
        except Exception as err:
            _LOGGER.debug("Static path registration result: %s", err)

    # Register sidebar panel
    try:
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title=FRONTEND_TITLE,
            sidebar_icon=FRONTEND_ICON,
            frontend_url_path=FRONTEND_URL_PATH,
            config={
                "_panel_custom": {
                    "name": "tonieesp-panel",
                    "module_url": FRONTEND_STATIC_PATH,
                }
            },
            require_admin=False,
        )
        _LOGGER.info("Registered TonieESP sidebar panel at /%s", FRONTEND_URL_PATH)
    except Exception as err:
        _LOGGER.error("Failed to register TonieESP sidebar panel: %s", err)
