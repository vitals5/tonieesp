"""Central NFC Tag Manager for TonieESP."""

from __future__ import annotations

import asyncio
import logging
import re
from collections.abc import Callable
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant

from .const import (
    MEDIA_TYPE_PLAYLIST,
    PROVIDER_MUSIC_ASSISTANT,
)
from .storage import TonieESPStorage

_LOGGER = logging.getLogger(__name__)

HEX_UID_REGEX = re.compile(r"^[0-9A-F]{8,32}$")


def normalize_uid(raw_uid: str) -> str:
    """Normalize NFC UID to standard uppercase string without delimiters.

    Preserves original byte order as sent by ESPHome firmware.
    """
    if not raw_uid:
        return ""
    cleaned = re.sub(r"[\s\-_:]", "", raw_uid).upper()
    return cleaned


def is_valid_uid(uid: str) -> bool:
    """Validate normalized UID."""
    return bool(HEX_UID_REGEX.match(uid))


class NFCManager:
    """Central manager for all TonieESP NFC tags and scan learning."""

    def __init__(self, hass: HomeAssistant, storage: TonieESPStorage) -> None:
        """Initialize the NFC Manager."""
        self.hass = hass
        self.storage = storage
        self._tags: dict[str, dict[str, Any]] = {}
        self._listeners: list[Callable[[str, dict[str, Any]], None]] = []

        # Scan learning mode state
        self._learning_active: bool = False
        self._learning_device_id: str | None = None
        self._learning_timeout_task: asyncio.Task | None = None
        self._learning_callbacks: list[Callable[[str, str], None]] = []

    async def async_load(self) -> None:
        """Load tags from storage."""
        data = await self.storage.async_load_tags()
        raw_tags = data.get("tags", {})
        self._tags = {}
        for uid, tag in raw_tags.items():
            norm_uid = normalize_uid(uid)
            if norm_uid:
                tag["uid"] = norm_uid
                self._tags[norm_uid] = tag
        _LOGGER.debug("Loaded %d TonieESP NFC tags", len(self._tags))

    def register_listener(
        self, callback: Callable[[str, dict[str, Any]], None]
    ) -> Callable[[], None]:
        """Register a callback for tag library mutations."""
        self._listeners.append(callback)

        def unsubscribe() -> None:
            if callback in self._listeners:
                self._listeners.remove(callback)

        return unsubscribe

    def _notify_listeners(self, action: str, data: dict[str, Any]) -> None:
        """Notify all registered listeners about tag mutations."""
        for callback in list(self._listeners):
            try:
                callback(action, data)
            except Exception as err:
                _LOGGER.error("Error notifying tag listener: %s", err)

    def get_tag(self, raw_uid: str) -> dict[str, Any] | None:
        """Get tag by UID."""
        uid = normalize_uid(raw_uid)
        return self._tags.get(uid)

    def is_known_tag(self, raw_uid: str) -> bool:
        """Check if tag is configured and known."""
        uid = normalize_uid(raw_uid)
        return uid in self._tags

    def list_tags(
        self,
        search: str | None = None,
        media_type: str | None = None,
    ) -> list[dict[str, Any]]:
        """List tags with optional search query and type filter."""
        results: list[dict[str, Any]] = []
        search_lower = search.lower() if search else None

        for tag in self._tags.values():
            if media_type:
                tag_media = tag.get("media", {})
                if tag_media.get("media_type") != media_type:
                    continue

            if search_lower:
                name = str(tag.get("name", "")).lower()
                desc = str(tag.get("description", "")).lower()
                uid = tag.get("uid", "").lower()
                media_id = str(tag.get("media", {}).get("media_id", "")).lower()
                if (
                    search_lower not in name
                    and search_lower not in desc
                    and search_lower not in uid
                    and search_lower not in media_id
                ):
                    continue

            results.append(tag)

        # Sort alphabetically by name
        results.sort(key=lambda x: str(x.get("name", "")).lower())
        return results

    async def async_save_tag(self, tag_data: dict[str, Any]) -> dict[str, Any]:
        """Create or update a tag in the library."""
        raw_uid = tag_data.get("uid", "")
        uid = normalize_uid(raw_uid)
        if not is_valid_uid(uid):
            raise ValueError(f"Invalid NFC UID: '{raw_uid}'. Must be 8-32 hex characters.")

        now_iso = datetime.now(UTC).isoformat()
        existing = self._tags.get(uid)

        # Construct sanitized tag record
        media_info = tag_data.get("media") or {}
        settings = tag_data.get("settings") or {}
        overrides = tag_data.get("overrides") or {}

        record: dict[str, Any] = {
            "uid": uid,
            "name": tag_data.get("name", f"Tonie {uid[-4:]}"),
            "description": tag_data.get("description", ""),
            "image": tag_data.get("image", ""),
            "media": {
                "provider": media_info.get("provider", PROVIDER_MUSIC_ASSISTANT),
                "media_type": media_info.get("media_type", MEDIA_TYPE_PLAYLIST),
                "media_id": media_info.get("media_id", ""),
                "title": media_info.get("title", ""),
                "artist": media_info.get("artist", ""),
            },
            "settings": {
                "shuffle": bool(settings.get("shuffle", False)),
                "repeat": settings.get("repeat", "off"),
                "resume": bool(settings.get("resume", True)),
                "volume_limit": settings.get("volume_limit"),
            },
            "overrides": overrides,
            "created_at": existing.get("created_at", now_iso) if existing else now_iso,
            "updated_at": now_iso,
        }

        self._tags[uid] = record
        await self.storage.async_save_tags({"tags": self._tags})

        action = "update" if existing else "create"
        self._notify_listeners(action, record)
        return record

    async def async_delete_tag(self, raw_uid: str) -> bool:
        """Delete tag by UID."""
        uid = normalize_uid(raw_uid)
        if uid in self._tags:
            deleted_tag = self._tags.pop(uid)
            await self.storage.async_save_tags({"tags": self._tags})
            self._notify_listeners("delete", {"uid": uid, "tag": deleted_tag})
            return True
        return False

    async def async_import_tags(
        self, tags_list: list[dict[str, Any]], overwrite: bool = False
    ) -> int:
        """Import a list of tags. Returns number of tags added/updated."""
        count = 0
        for item in tags_list:
            uid = normalize_uid(item.get("uid", ""))
            if not is_valid_uid(uid):
                continue
            if uid in self._tags and not overwrite:
                continue
            await self.async_save_tag(item)
            count += 1
        return count

    def export_tags(self) -> list[dict[str, Any]]:
        """Export tags as a list for backup or JSON download."""
        return list(self._tags.values())

    def get_effective_media_for_box(self, raw_uid: str, device_id: str) -> dict[str, Any] | None:
        """Retrieve effective media settings for a tag on a specific Toniebox.

        Merges device-specific overrides with the global tag settings.
        """
        tag = self.get_tag(raw_uid)
        if not tag:
            return None

        # Base global media and settings
        media = dict(tag.get("media", {}))
        settings = dict(tag.get("settings", {}))

        # Check for device-specific override
        overrides = tag.get("overrides", {})
        device_override = overrides.get(device_id)

        if device_override and isinstance(device_override, dict):
            # Override media fields if present
            if "media" in device_override and isinstance(device_override["media"], dict):
                media.update(device_override["media"])
            elif "media_id" in device_override:
                media["media_id"] = device_override["media_id"]
                if "media_type" in device_override:
                    media["media_type"] = device_override["media_type"]

            # Override settings if present
            if "settings" in device_override and isinstance(device_override["settings"], dict):
                settings.update(device_override["settings"])

        return {
            "uid": tag["uid"],
            "name": tag.get("name"),
            "image": tag.get("image"),
            "media": media,
            "settings": settings,
            "has_override": bool(device_override),
        }

    # --- Scan Learning Mode ---

    def start_learning_mode(
        self,
        device_id: str | None = None,
        timeout_seconds: int = 60,
        callback: Callable[[str, str], None] | None = None,
    ) -> None:
        """Activate tag scan learning mode."""
        self._learning_active = True
        self._learning_device_id = device_id
        if callback:
            self._learning_callbacks.append(callback)

        if self._learning_timeout_task and not self._learning_timeout_task.done():
            self._learning_timeout_task.cancel()

        async def _timeout_handler() -> None:
            await asyncio.sleep(timeout_seconds)
            _LOGGER.debug("Scan learning mode timed out after %ds", timeout_seconds)
            self.stop_learning_mode()

        self._learning_timeout_task = self.hass.async_create_task(_timeout_handler())
        _LOGGER.info(
            "Scan learning mode started for device %s (timeout: %ds)", device_id, timeout_seconds
        )

    def stop_learning_mode(self) -> None:
        """Deactivate tag scan learning mode."""
        self._learning_active = False
        self._learning_device_id = None
        self._learning_callbacks.clear()
        if self._learning_timeout_task and not self._learning_timeout_task.done():
            self._learning_timeout_task.cancel()
            self._learning_timeout_task = None
        _LOGGER.debug("Scan learning mode stopped")

    def is_learning_active(self, device_id: str | None = None) -> bool:
        """Check if learning mode is currently active."""
        if not self._learning_active:
            return False
        return not (
            self._learning_device_id and device_id and self._learning_device_id != device_id
        )

    def process_learned_tag(self, raw_uid: str, device_id: str) -> bool:
        """Process a scanned tag when learning mode is active.

        Returns True if the scan was consumed by learning mode.
        """
        if not self.is_learning_active(device_id):
            return False

        uid = normalize_uid(raw_uid)
        _LOGGER.info("Captured tag %s in learning mode on device %s", uid, device_id)

        callbacks = list(self._learning_callbacks)
        for cb in callbacks:
            try:
                cb(uid, device_id)
            except Exception as err:
                _LOGGER.error("Error invoking learning callback: %s", err)

        return True
