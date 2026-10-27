"""Music Assistant Adapter for TonieESP."""
from __future__ import annotations

import asyncio
import logging
from datetime import UTC, datetime
from typing import Any

from homeassistant.components.media_player import (
    ATTR_ENTITY_PICTURE,
    ATTR_MEDIA_ALBUM_NAME,
    ATTR_MEDIA_ARTIST,
    ATTR_MEDIA_CONTENT_ID,
    ATTR_MEDIA_CONTENT_TYPE,
    ATTR_MEDIA_DURATION,
    ATTR_MEDIA_POSITION,
    ATTR_MEDIA_POSITION_UPDATED_AT,
    ATTR_MEDIA_TITLE,
    SERVICE_MEDIA_NEXT_TRACK,
    SERVICE_MEDIA_PAUSE,
    SERVICE_MEDIA_PLAY,
    SERVICE_MEDIA_PLAY_PAUSE,
    SERVICE_MEDIA_PREVIOUS_TRACK,
    SERVICE_MEDIA_SEEK,
    SERVICE_MEDIA_STOP,
    SERVICE_PLAY_MEDIA,
    SERVICE_VOLUME_SET,
)
from homeassistant.components.media_player import (
    DOMAIN as MEDIA_PLAYER_DOMAIN,
)
from homeassistant.core import HomeAssistant

from .const import (
    MEDIA_TYPE_PLAYLIST,
    PROVIDER_MUSIC_ASSISTANT,
)

_LOGGER = logging.getLogger(__name__)


class MusicAssistantAdapter:
    """Adapter for interacting with Music Assistant and Home Assistant media players."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the Music Assistant adapter."""
        self.hass = hass

    def is_ma_available(self) -> bool:
        """Check if Music Assistant integration is installed and loaded."""
        # Check domain in config entries or loaded components
        if "music_assistant" in self.hass.config.components:
            return True
        return "mass" in self.hass.config.components

    async def async_play_media(
        self,
        player_entity_id: str,
        media_type: str,
        media_id: str,
        resume_position: float | None = None,
        enqueue: str = "play",
        volume_limit: float | None = None,
    ) -> None:
        """Start playing media on the targeted player."""
        if not player_entity_id:
            _LOGGER.warning("Cannot play media: player_entity_id is missing")
            return

        # 1. Enforce volume limit if player is currently above ceiling
        if volume_limit is not None:
            state = self.hass.states.get(player_entity_id)
            if state:
                cur_vol = state.attributes.get("volume_level")
                if cur_vol is not None and cur_vol > volume_limit:
                    await self.async_set_volume(player_entity_id, volume_limit)
                    await asyncio.sleep(0.15)

        # 2. Prefer music_assistant.play_media service if registered
        has_ma_action = (
            self.hass.services.has_service("music_assistant", "play_media")
            or self.hass.services.has_service("mass", "play_media")
        )

        domain = "music_assistant" if self.hass.services.has_service("music_assistant", "play_media") else "mass"

        if has_ma_action:
            _LOGGER.debug(
                "Calling %s.play_media on %s (media_id=%s, media_type=%s)",
                domain,
                player_entity_id,
                media_id,
                media_type,
            )
            data: dict[str, Any] = {
                "media_id": media_id,
                "media_type": media_type or MEDIA_TYPE_PLAYLIST,
                "enqueue": enqueue,
            }
            await self.hass.services.async_call(
                domain,
                "play_media",
                service_data=data,
                target={"entity_id": player_entity_id},
                blocking=True,
            )
        else:
            # Fallback to standard media_player.play_media
            _LOGGER.debug(
                "Calling media_player.play_media on %s (content_id=%s, type=%s)",
                player_entity_id,
                media_id,
                media_type,
            )
            data = {
                ATTR_MEDIA_CONTENT_ID: media_id,
                ATTR_MEDIA_CONTENT_TYPE: media_type or MEDIA_TYPE_PLAYLIST,
            }
            await self.hass.services.async_call(
                MEDIA_PLAYER_DOMAIN,
                SERVICE_PLAY_MEDIA,
                service_data=data,
                target={"entity_id": player_entity_id},
                blocking=True,
            )

        # 3. Handle resume position if requested
        if resume_position and resume_position > 2.0:
            async def _delayed_seek() -> None:
                # Wait briefly for track to begin loading
                await asyncio.sleep(1.0)
                await self.async_seek(player_entity_id, resume_position)

            self.hass.async_create_task(_delayed_seek())

    async def async_play_pause(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Toggle play/pause on player, trying primary then fallback entity."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_PLAY_PAUSE,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("play_pause failed on %s: %s", ent, err)

        # Fallback based on state
        for ent in entities:
            st = self.hass.states.get(ent)
            if st:
                svc = SERVICE_MEDIA_PAUSE if st.state == "playing" else SERVICE_MEDIA_PLAY
                try:
                    await self.hass.services.async_call(
                        MEDIA_PLAYER_DOMAIN,
                        svc,
                        target={"entity_id": ent},
                        blocking=True,
                    )
                    return
                except Exception as err:
                    _LOGGER.warning("Could not execute %s on %s: %s", svc, ent, err)

    async def async_pause(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Pause playback on player."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_PAUSE,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("pause failed on %s: %s", ent, err)

    async def async_resume(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Resume playback on player."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_PLAY,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception:
                # Try play_pause as alternative
                try:
                    await self.hass.services.async_call(
                        MEDIA_PLAYER_DOMAIN,
                        SERVICE_MEDIA_PLAY_PAUSE,
                        target={"entity_id": ent},
                        blocking=True,
                    )
                    return
                except Exception as err:
                    _LOGGER.debug("resume failed on %s: %s", ent, err)

    async def async_stop(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Stop playback on player."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_STOP,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("stop failed on %s: %s", ent, err)

    async def async_next(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Skip to next track."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_NEXT_TRACK,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("next_track failed on %s: %s", ent, err)
        _LOGGER.warning("Could not execute next track on any player (%s)", entities)

    async def async_previous(
        self, player_entity_id: str, fallback_entity_id: str | None = None
    ) -> None:
        """Skip to previous track or restart current."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_PREVIOUS_TRACK,
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("previous_track failed on %s: %s", ent, err)
        _LOGGER.warning("Could not execute previous track on any player (%s)", entities)

    async def async_seek(
        self,
        player_entity_id: str,
        position: float,
        fallback_entity_id: str | None = None,
    ) -> None:
        """Seek to specific position in seconds."""
        entities = [e for e in (player_entity_id, fallback_entity_id) if e]
        seek_pos = max(0.0, float(position))
        state = self.hass.states.get(entities[0]) if entities else None
        if state:
            duration = state.attributes.get(ATTR_MEDIA_DURATION)
            if duration and duration > 0:
                seek_pos = min(seek_pos, max(0.0, float(duration) - 1.0))

        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_MEDIA_SEEK,
                    service_data={"seek_position": seek_pos},
                    target={"entity_id": ent},
                    blocking=True,
                )
                return
            except Exception as err:
                _LOGGER.debug("seek failed on %s: %s", ent, err)

    async def async_seek_relative(
        self,
        player_entity_id: str,
        delta_seconds: float,
        fallback_entity_id: str | None = None,
    ) -> None:
        """Seek relative to current position with snapshot elapsed-time correction."""
        ent = player_entity_id or fallback_entity_id
        if not ent:
            return
        state = self.hass.states.get(ent)
        if not state or state.state not in ("playing", "paused"):
            return

        base_pos = float(state.attributes.get(ATTR_MEDIA_POSITION, 0.0) or 0.0)
        updated_at = state.attributes.get(ATTR_MEDIA_POSITION_UPDATED_AT)

        # Elapsed time correction
        elapsed = 0.0
        if state.state == "playing" and updated_at:
            if isinstance(updated_at, datetime):
                elapsed = (datetime.now(UTC) - updated_at).total_seconds()
            elif isinstance(updated_at, str):
                try:
                    dt = datetime.fromisoformat(updated_at)
                    elapsed = (datetime.now(UTC) - dt).total_seconds()
                except Exception:
                    pass

        current = base_pos + max(0.0, elapsed)
        target = current + delta_seconds
        await self.async_seek(ent, target, fallback_entity_id=fallback_entity_id)

    async def async_set_volume(
        self,
        player_entity_id: str,
        volume: float,
        max_volume: float | None = None,
        fallback_entity_id: str | None = None,
    ) -> None:
        """Set volume level clamped to max_volume across active and fallback player."""
        target_vol = max(0.0, min(1.0, float(volume)))
        if max_volume is not None:
            target_vol = min(target_vol, float(max_volume))

        entities = list(dict.fromkeys([e for e in (player_entity_id, fallback_entity_id) if e]))
        for ent in entities:
            try:
                await self.hass.services.async_call(
                    MEDIA_PLAYER_DOMAIN,
                    SERVICE_VOLUME_SET,
                    service_data={"volume_level": target_vol},
                    target={"entity_id": ent},
                    blocking=True,
                )
            except Exception as err:
                _LOGGER.debug("set_volume failed on %s: %s", ent, err)

    def get_player_state(self, player_entity_id: str) -> dict[str, Any]:
        """Fetch current playback snapshot from player state."""
        state = self.hass.states.get(player_entity_id) if player_entity_id else None
        if not state:
            return {
                "entity_id": player_entity_id,
                "state": "offline",
                "volume_level": 0.0,
                "title": "",
                "artist": "",
                "album": "",
                "image": "",
                "position": 0.0,
                "duration": 0.0,
            }

        base_pos = float(state.attributes.get(ATTR_MEDIA_POSITION, 0.0) or 0.0)
        updated_at = state.attributes.get(ATTR_MEDIA_POSITION_UPDATED_AT)
        elapsed = 0.0
        if state.state == "playing" and updated_at:
            if isinstance(updated_at, datetime):
                elapsed = (datetime.now(UTC) - updated_at).total_seconds()
            elif isinstance(updated_at, str):
                try:
                    dt = datetime.fromisoformat(updated_at)
                    elapsed = (datetime.now(UTC) - dt).total_seconds()
                except Exception:
                    pass

        return {
            "entity_id": player_entity_id,
            "state": state.state,
            "volume_level": state.attributes.get("volume_level", 0.0),
            "title": state.attributes.get(ATTR_MEDIA_TITLE, ""),
            "artist": state.attributes.get(ATTR_MEDIA_ARTIST, ""),
            "album": state.attributes.get(ATTR_MEDIA_ALBUM_NAME, ""),
            "image": state.attributes.get(ATTR_ENTITY_PICTURE, ""),
            "position": round(base_pos + max(0.0, elapsed), 1),
            "duration": float(state.attributes.get(ATTR_MEDIA_DURATION, 0.0) or 0.0),
        }

    async def async_search_media(
        self, query: str, media_types: list[str] | None = None
    ) -> list[dict[str, Any]]:
        """Search media catalog in Music Assistant."""
        results: list[dict[str, Any]] = []

        # Try client instance if available in runtime data
        mass_client = self._get_mass_client()
        if mass_client:
            try:
                # Use MusicAssistantClient library search if available
                res = await mass_client.music.search(query, media_types=media_types or ["playlist", "album", "track", "audiobook", "radio"])
                # Extract results from mass models
                for cat in ("playlists", "albums", "tracks", "audiobooks", "radios"):
                    items = getattr(res, cat, [])
                    for item in items:
                        results.append({
                            "provider": PROVIDER_MUSIC_ASSISTANT,
                            "media_type": getattr(item, "media_type", cat.rstrip("s")),
                            "media_id": getattr(item, "uri", getattr(item, "item_id", "")),
                            "title": getattr(item, "name", str(item)),
                            "artist": getattr(getattr(item, "artist", None), "name", ""),
                            "image": getattr(getattr(item, "image", None), "path", ""),
                        })
                return results
            except Exception as err:
                _LOGGER.debug("Direct mass_client search failed: %s, falling back", err)

        # Fallback: Query via media_source if available
        try:
            if "media_source" in self.hass.config.components:
                from homeassistant.components import media_source
                browse = await media_source.async_browse_media(
                    self.hass, "media-source://mass"
                )
                if browse and browse.children:
                    for child in browse.children:
                        if query.lower() in child.title.lower():
                            results.append({
                                "provider": PROVIDER_MUSIC_ASSISTANT,
                                "media_type": child.media_class or "playlist",
                                "media_id": child.media_content_id,
                                "title": child.title,
                                "artist": "",
                                "image": child.thumbnail or "",
                            })
        except Exception as err:
            _LOGGER.debug("Media source browse fallback encountered: %s", err)

        return results

    def _get_mass_client(self) -> Any | None:
        """Attempt to locate active MusicAssistantClient instance in Home Assistant."""
        # 1. Check entries in music_assistant domain
        for domain in ("music_assistant", "mass"):
            entries = self.hass.config_entries.async_entries(domain)
            for entry in entries:
                if hasattr(entry, "runtime_data") and entry.runtime_data:
                    data = entry.runtime_data
                    if hasattr(data, "mass"):
                        return data.mass
                    if hasattr(data, "client"):
                        return data.client
                    return data
            # 2. Check hass.data
            if domain in self.hass.data:
                val = self.hass.data[domain]
                if hasattr(val, "music"):
                    return val
                if isinstance(val, dict):
                    for v in val.values():
                        if hasattr(v, "mass"):
                            return v.mass
                        if hasattr(v, "music"):
                            return v
        return None
