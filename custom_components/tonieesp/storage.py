"""Persistent storage handling for TonieESP."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    STORAGE_KEY_SESSIONS,
    STORAGE_KEY_TAGS,
    STORAGE_VERSION_SESSIONS,
    STORAGE_VERSION_TAGS,
)

_LOGGER = logging.getLogger(__name__)


class TonieESPStorage:
    """Manages persistent storage for TonieESP tags and sessions."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the storage manager."""
        self.hass = hass
        self._tag_store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION_TAGS, STORAGE_KEY_TAGS
        )
        self._session_store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION_SESSIONS, STORAGE_KEY_SESSIONS
        )

    async def async_load_tags(self) -> dict[str, Any]:
        """Load tags from storage."""
        data = await self._tag_store.async_load()
        if not data or not isinstance(data, dict):
            _LOGGER.debug("No existing tags store found, initializing empty")
            return {"schema_version": STORAGE_VERSION_TAGS, "tags": {}}

        # Handle future migration if schema_version changes
        schema_version = data.get("schema_version", 1)
        if schema_version != STORAGE_VERSION_TAGS:
            data = self._migrate_tags(data, schema_version)

        return data

    async def async_save_tags(self, tags_data: dict[str, Any]) -> None:
        """Save tags to storage."""
        tags_data["schema_version"] = STORAGE_VERSION_TAGS
        await self._tag_store.async_save(tags_data)

    async def async_load_sessions(self) -> dict[str, Any]:
        """Load playback sessions from storage."""
        data = await self._session_store.async_load()
        if not data or not isinstance(data, dict):
            return {"schema_version": STORAGE_VERSION_SESSIONS, "sessions": {}}

        schema_version = data.get("schema_version", 1)
        if schema_version != STORAGE_VERSION_SESSIONS:
            data = self._migrate_sessions(data, schema_version)

        return data

    async def async_save_sessions(self, sessions_data: dict[str, Any]) -> None:
        """Save playback sessions to storage."""
        sessions_data["schema_version"] = STORAGE_VERSION_SESSIONS
        await self._session_store.async_save(sessions_data)

    def _migrate_tags(self, data: dict[str, Any], current_version: int) -> dict[str, Any]:
        """Migrate tag storage data between schema versions."""
        _LOGGER.info("Migrating tag storage from version %s to %s", current_version, STORAGE_VERSION_TAGS)
        # Migration logic placeholder when schema version bumps in future
        data["schema_version"] = STORAGE_VERSION_TAGS
        return data

    def _migrate_sessions(self, data: dict[str, Any], current_version: int) -> dict[str, Any]:
        """Migrate session storage data between schema versions."""
        _LOGGER.info("Migrating session storage from version %s to %s", current_version, STORAGE_VERSION_SESSIONS)
        data["schema_version"] = STORAGE_VERSION_SESSIONS
        return data
