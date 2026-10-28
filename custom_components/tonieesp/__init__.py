"""The TonieESP integration."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from aiohttp import web
from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_ICON,
    FRONTEND_PANEL_JS,
    FRONTEND_STATIC_PATH,
    FRONTEND_TITLE,
    FRONTEND_URL_PATH,
    FRONTEND_VERSION,
)
from .coordinator import TonieESPCoordinator
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)


class TonieESPFrontendView(HomeAssistantView):
    """View to serve compiled TonieESP frontend JavaScript file directly with correct MIME type."""

    url = f"{FRONTEND_STATIC_PATH}/{FRONTEND_PANEL_JS}"
    name = f"{DOMAIN}:frontend_js"
    requires_auth = False
    cors_allowed = True

    def __init__(self, js_path: Path) -> None:
        """Initialize view."""
        self._js_path = js_path

    async def get(self, request: web.Request) -> web.Response:
        """Serve JavaScript bundle."""
        if not self._js_path.exists():
            return web.Response(status=404, text="Frontend file not found")

        return web.FileResponse(
            self._js_path,
            headers={
                "Content-Type": "application/javascript",
                "Cache-Control": (
                    "public, max-age=31536000" if "v=" in request.query_string else "no-cache"
                ),
            },
        )


class TonieESPLegacyFrontendView(HomeAssistantView):
    """Dedicated view to serve legacy frontend.js URL for backwards compatibility."""

    url = "/tonieesp/frontend.js"
    name = f"{DOMAIN}:legacy_frontend_js"
    requires_auth = False
    cors_allowed = True

    def __init__(self, js_path: Path) -> None:
        """Initialize view."""
        self._js_path = js_path

    async def get(self, request: web.Request) -> web.Response:
        """Serve JavaScript bundle for legacy panel URL."""
        if not self._js_path.exists():
            return web.Response(status=404, text="Frontend file not found")

        return web.FileResponse(
            self._js_path,
            headers={
                "Content-Type": "application/javascript",
                "Cache-Control": "no-cache",
            },
        )


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up the TonieESP component."""
    hass.data.setdefault(DOMAIN, {})
    await _async_register_frontend(hass)
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

        # Register frontend static path and custom side panel
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
                frontend.async_remove_panel(hass, FRONTEND_URL_PATH, warn_if_unknown=False)
            except Exception as err:
                _LOGGER.debug("Could not remove frontend panel: %s", err)
            hass.data.pop(DOMAIN, None)

    return True


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Register frontend JavaScript resource and Home Assistant sidebar panel."""
    frontend_dir = Path(__file__).parent / "frontend"
    frontend_js = frontend_dir / FRONTEND_PANEL_JS

    if not frontend_js.exists():
        _LOGGER.error("TonieESP frontend file not found at %s", frontend_js)
        return

    # 1. Register explicit HTTP views for static URL and legacy fallback URL
    if hasattr(hass, "http") and hasattr(hass.http, "register_view"):
        if not hass.data[DOMAIN].get("frontend_view_registered"):
            try:
                hass.http.register_view(TonieESPFrontendView(frontend_js))
                hass.http.register_view(TonieESPLegacyFrontendView(frontend_js))
                hass.data[DOMAIN]["frontend_view_registered"] = True
                _LOGGER.debug(
                    "Registered TonieESP frontend HTTP views at %s and %s",
                    TonieESPFrontendView.url,
                    TonieESPLegacyFrontendView.url,
                )
            except Exception as err:
                _LOGGER.debug("Could not register frontend view: %s", err)

    # 2. Register static path in HTTP server (serves the whole frontend directory)
    if hasattr(hass, "http"):
        if not hass.data[DOMAIN].get("static_path_registered"):
            if hasattr(hass.http, "async_register_static_paths"):
                try:
                    await hass.http.async_register_static_paths(
                        [
                            StaticPathConfig(
                                url_path=FRONTEND_STATIC_PATH,
                                path=str(frontend_dir),
                                cache_headers=False,
                            )
                        ]
                    )
                    hass.data[DOMAIN]["static_path_registered"] = True
                    _LOGGER.debug(
                        "Registered static directory %s -> %s",
                        FRONTEND_STATIC_PATH,
                        frontend_dir,
                    )
                except Exception as err:
                    _LOGGER.debug(
                        "Could not register static path via async_register_static_paths: %s",
                        err,
                    )
            elif hasattr(hass.http, "register_static_path"):
                try:
                    hass.http.register_static_path(
                        FRONTEND_STATIC_PATH,
                        str(frontend_dir),
                        cache_headers=False,
                    )
                    hass.data[DOMAIN]["static_path_registered"] = True
                except Exception as err:
                    _LOGGER.debug("Static path registration result: %s", err)

    # 3. Register custom panel using panel_custom
    # Always ensure stale or previously registered panel is updated to the latest module_url
    if frontend.DATA_PANELS in hass.data and FRONTEND_URL_PATH in hass.data[frontend.DATA_PANELS]:
        try:
            frontend.async_remove_panel(hass, FRONTEND_URL_PATH, warn_if_unknown=False)
        except Exception as err:
            _LOGGER.debug("Removing existing panel for refresh: %s", err)

    try:
        await panel_custom.async_register_panel(
            hass=hass,
            frontend_url_path=FRONTEND_URL_PATH,
            webcomponent_name="tonieesp-panel",
            sidebar_title=FRONTEND_TITLE,
            sidebar_icon=FRONTEND_ICON,
            module_url=f"{FRONTEND_STATIC_PATH}/{FRONTEND_PANEL_JS}?v={FRONTEND_VERSION}",
            require_admin=False,
        )
        hass.data[DOMAIN]["frontend_registered"] = True
        _LOGGER.info(
            "Registered TonieESP sidebar custom panel at /%s (module: %s/%s)",
            FRONTEND_URL_PATH,
            FRONTEND_STATIC_PATH,
            FRONTEND_PANEL_JS,
        )
    except Exception as err:
        _LOGGER.error("Failed to register TonieESP sidebar panel via panel_custom: %s", err)
