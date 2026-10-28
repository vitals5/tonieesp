"""Playback Session and Resume Manager for TonieESP."""

from __future__ import annotations

import logging
import time
from dataclasses import asdict, dataclass
from typing import Any

from homeassistant.core import HomeAssistant

from .music_assistant import MusicAssistantAdapter
from .storage import TonieESPStorage

_LOGGER = logging.getLogger(__name__)

DEBOUNCE_SCAN_INTERVAL = 2.0  # seconds to ignore duplicate scans for same tag
SHORT_TERM_RESUME_MAX_AGE = 7200  # 2 hours for short-term removal pause


def make_session_key(box_id: str, tag_uid: str) -> str:
    """Generate unique session key scoped per Toniebox and tag."""
    return f"{box_id}_{tag_uid}"


@dataclass
class PlaybackSession:
    """Represents an active or persisted playback session for a tag."""

    box_id: str
    tag_uid: str
    media_source: str
    media_type: str
    media_id: str
    queue_item_id: str | None
    position: float
    duration: float
    updated_at: float
    was_paused_by_removal: bool
    completed: bool = False
    track_title: str | None = None
    track_uri: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Convert session to dictionary."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> PlaybackSession:
        """Create session from dictionary."""
        return cls(
            box_id=data.get("box_id", ""),
            tag_uid=data.get("tag_uid", ""),
            media_source=data.get("media_source", "music_assistant"),
            media_type=data.get("media_type", "playlist"),
            media_id=data.get("media_id", ""),
            queue_item_id=data.get("queue_item_id"),
            position=float(data.get("position", 0.0)),
            duration=float(data.get("duration", 0.0)),
            updated_at=float(data.get("updated_at", 0.0)),
            was_paused_by_removal=bool(data.get("was_paused_by_removal", False)),
            completed=bool(data.get("completed", False)),
            track_title=data.get("track_title"),
            track_uri=data.get("track_uri"),
        )


class PlaybackManager:
    """Manages playback sessions, resume logic, and duplicate event filtering."""

    def __init__(
        self,
        hass: HomeAssistant,
        storage: TonieESPStorage,
        ma_adapter: MusicAssistantAdapter,
    ) -> None:
        """Initialize playback manager."""
        self.hass = hass
        self.storage = storage
        self.ma_adapter = ma_adapter

        # Active in-memory sessions per box
        self._active_sessions: dict[str, PlaybackSession] = {}
        # Persistent sessions per tag UID (central progress across boxes)
        self._persistent_sessions: dict[str, PlaybackSession] = {}

        # Anti-bounce scan tracking: box_id -> (uid, timestamp)
        self._last_scan: dict[str, tuple[str, float]] = {}

    async def async_load(self) -> None:
        """Load persistent sessions from storage."""
        data = await self.storage.async_load_sessions()
        sessions = data.get("sessions", {})
        for key, sess_dict in sessions.items():
            try:
                sess = PlaybackSession.from_dict(sess_dict)
                effective_key = (
                    key
                    if "_" in key
                    else (make_session_key(sess.box_id, sess.tag_uid) if sess.box_id else key)
                )
                self._persistent_sessions[effective_key] = sess
            except Exception as err:
                _LOGGER.warning("Could not load session for key %s: %s", key, err)
        _LOGGER.debug("Loaded %d persistent playback sessions", len(self._persistent_sessions))

    async def async_save(self) -> None:
        """Save persistent sessions to storage."""
        data = {
            "sessions": {key: sess.to_dict() for key, sess in self._persistent_sessions.items()}
        }
        await self.storage.async_save_sessions(data)

    def is_duplicate_scan(self, box_id: str, uid: str) -> bool:
        """Check if scan event is a duplicate bounce within the debounce interval."""
        now = time.time()
        last = self._last_scan.get(box_id)
        if last:
            last_uid, last_time = last
            if last_uid == uid and (now - last_time) < DEBOUNCE_SCAN_INTERVAL:
                _LOGGER.debug(
                    "Debouncing duplicate scan on box %s for tag %s (elapsed %.2fs)",
                    box_id,
                    uid,
                    now - last_time,
                )
                return True

        self._last_scan[box_id] = (uid, now)
        return False

    async def async_handle_tag_placed(
        self,
        box_id: str,
        player_entity_id: str,
        tag_uid: str,
        media_info: dict[str, Any],
        tag_settings: dict[str, Any],
        fallback_player_id: str | None = None,
    ) -> None:
        """Handle tag placed on a Toniebox."""
        if self.is_duplicate_scan(box_id, tag_uid):
            return

        media_id = media_info.get("media_id", "")
        media_type = media_info.get("media_type", "playlist")
        media_source = media_info.get("provider", "music_assistant")
        volume_limit = tag_settings.get("volume_limit")
        resume_enabled = tag_settings.get("resume", True)
        shuffle_enabled = bool(tag_settings.get("shuffle", False))
        repeat_mode = str(tag_settings.get("repeat", "off"))

        if not media_id:
            _LOGGER.warning("Tag %s has no media assigned, cannot start playback", tag_uid)
            return

        now = time.time()
        resume_position: float | None = None
        resume_track_uri: str | None = None
        resume_track_title: str | None = None

        # Check resume options if resume is enabled (supports both sequential and shuffle resume)
        if resume_enabled:
            # 1. Check active short-term session on this box
            active = self._active_sessions.get(box_id)
            if active and active.tag_uid == tag_uid and active.was_paused_by_removal:
                if (now - active.updated_at) < SHORT_TERM_RESUME_MAX_AGE:
                    # If player is currently paused, seamlessly resume playback without reloading
                    player_state = self.ma_adapter.get_player_state(player_entity_id)
                    if player_state.get("state") == "paused":
                        _LOGGER.info(
                            "Resuming paused playback for tag %s on box %s (shuffle=%s)",
                            tag_uid,
                            box_id,
                            shuffle_enabled,
                        )
                        active.was_paused_by_removal = False
                        active.updated_at = now
                        if shuffle_enabled:
                            await self.ma_adapter.async_set_shuffle(
                                player_entity_id, True, fallback_entity_id=fallback_player_id
                            )
                        await self.ma_adapter.async_resume(
                            player_entity_id, fallback_entity_id=fallback_player_id
                        )
                        return

                    # Same tag returned to same box after pause
                    _LOGGER.info(
                        "Resuming short-term paused tag %s on box %s at position %.1fs (track: %s)",
                        tag_uid,
                        box_id,
                        active.position,
                        active.track_title,
                    )
                    resume_position = active.position
                    resume_track_uri = active.track_uri
                    resume_track_title = active.track_title
                    active.was_paused_by_removal = False
                    active.updated_at = now

            # 2. Check persistent progress for this tag on THIS SPECIFIC BOX (independent child/box progress)
            if resume_position is None:
                box_tag_key = make_session_key(box_id, tag_uid)
                saved_sess = self._persistent_sessions.get(box_tag_key)
                if saved_sess and not saved_sess.completed:
                    if saved_sess.media_id == media_id and (
                        saved_sess.position > 5.0 or saved_sess.track_uri or saved_sess.track_title
                    ):
                        _LOGGER.info(
                            "Found persistent progress for tag %s on box %s: resuming at %.1fs (track: %s, uri: %s)",
                            tag_uid,
                            box_id,
                            saved_sess.position,
                            saved_sess.track_title,
                            saved_sess.track_uri,
                        )
                        resume_position = saved_sess.position
                        resume_track_uri = saved_sess.track_uri
                        resume_track_title = saved_sess.track_title

        # Start playback with enqueue="replace" to ensure no previous queue tracks leak
        await self.ma_adapter.async_play_media(
            player_entity_id=player_entity_id,
            media_type=media_type,
            media_id=media_id,
            resume_position=resume_position,
            enqueue="replace",
            volume_limit=volume_limit,
            track_uri=resume_track_uri,
            track_title=resume_track_title,
            shuffle=shuffle_enabled,
            repeat=repeat_mode,
            fallback_player_id=fallback_player_id,
        )

        # Update active session
        session = PlaybackSession(
            box_id=box_id,
            tag_uid=tag_uid,
            media_source=media_source,
            media_type=media_type,
            media_id=media_id,
            queue_item_id=None,
            position=resume_position or 0.0,
            duration=0.0,
            updated_at=now,
            was_paused_by_removal=False,
            completed=False,
            track_title=resume_track_title,
            track_uri=resume_track_uri,
        )
        self._active_sessions[box_id] = session

    async def async_handle_tag_removed(
        self,
        box_id: str,
        player_entity_id: str,
        pause_on_removal: bool = True,
    ) -> None:
        """Handle tag removed from a Toniebox."""
        active = self._active_sessions.get(box_id)
        if not active:
            _LOGGER.debug("Tag removed on box %s but no active session tracked", box_id)
            if pause_on_removal:
                await self.ma_adapter.async_pause(player_entity_id)
            return

        # Snapshot current position from player before pausing
        player_state = self.ma_adapter.get_player_state(player_entity_id)
        current_pos = player_state.get("position", active.position)
        duration = player_state.get("duration", active.duration)
        track_title = player_state.get("title") or active.track_title
        raw_content_id = player_state.get("content_id")

        # Distinguish between container URI (e.g. playlist) and individual track URI
        if raw_content_id and raw_content_id != active.media_id:
            track_uri = raw_content_id
        else:
            track_uri = (
                active.track_uri
                if (active.track_uri and active.track_uri != active.media_id)
                else None
            )

        now = time.time()
        active.position = current_pos
        active.duration = duration
        active.track_title = track_title
        active.track_uri = track_uri
        active.updated_at = now
        active.was_paused_by_removal = True

        # Check if playback was essentially finished (e.g. within last 10 seconds)
        if duration > 0 and current_pos >= (duration - 10.0):
            active.completed = True
            active.position = 0.0

        # Persist session progress specifically for this box and tag (isolated per child/box)
        box_tag_key = make_session_key(box_id, active.tag_uid)
        self._persistent_sessions[box_tag_key] = PlaybackSession(
            box_id=box_id,
            tag_uid=active.tag_uid,
            media_source=active.media_source,
            media_type=active.media_type,
            media_id=active.media_id,
            queue_item_id=active.queue_item_id,
            position=active.position,
            duration=active.duration,
            updated_at=now,
            was_paused_by_removal=True,
            completed=active.completed,
            track_title=active.track_title,
            track_uri=active.track_uri,
        )
        await self.async_save()

        if pause_on_removal:
            _LOGGER.info(
                "Pausing box %s after tag removal (saved position: %.1fs)",
                box_id,
                current_pos,
            )
            await self.ma_adapter.async_pause(player_entity_id)

    def get_session_for_box_and_tag(self, box_id: str, tag_uid: str) -> PlaybackSession | None:
        """Get saved playback session for a specific box and tag."""
        return self._persistent_sessions.get(make_session_key(box_id, tag_uid))

    def get_session_for_tag(
        self, tag_uid: str, box_id: str | None = None
    ) -> PlaybackSession | None:
        """Get saved playback session for a tag, optionally for a specific box."""
        if box_id:
            return self.get_session_for_box_and_tag(box_id, tag_uid)
        for sess in self._persistent_sessions.values():
            if sess.tag_uid == tag_uid:
                return sess
        return None

    def get_active_session_for_box(self, box_id: str) -> PlaybackSession | None:
        """Get active session for a specific box."""
        return self._active_sessions.get(box_id)

    async def async_clear_session(self, tag_uid: str, box_id: str | None = None) -> None:
        """Reset saved session for a tag on a specific box or all boxes."""
        if box_id:
            key = make_session_key(box_id, tag_uid)
            self._persistent_sessions.pop(key, None)
        else:
            to_remove = [k for k, s in self._persistent_sessions.items() if s.tag_uid == tag_uid]
            for k in to_remove:
                self._persistent_sessions.pop(k, None)
        await self.async_save()
