"""Event handling and gesture processing for TonieESP."""
from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, HomeAssistant

from .const import (
    ACTION_NEXT_TRACK,
    ACTION_NONE,
    ACTION_PLAY_PAUSE,
    ACTION_PREVIOUS_TRACK,
    ACTION_SEEK_BACKWARD,
    ACTION_SEEK_FORWARD,
    ACTION_VOLUME_DOWN,
    ACTION_VOLUME_UP,
    EVENT_ESPHOME_TAP,
    EVENT_ESPHOME_TILT,
    EVENT_TAG_SCANNED,
)
from .nfc_manager import normalize_uid

if TYPE_CHECKING:
    from .device_manager import TonieBoxDeviceManager

_LOGGER = logging.getLogger(__name__)


class TonieESPEventHandler:
    """Subscribes to hardware events and routes them to appropriate box managers."""

    def __init__(
        self,
        hass: HomeAssistant,
        device_manager: TonieBoxDeviceManager,
    ) -> None:
        """Initialize event handler."""
        self.hass = hass
        self.device_manager = device_manager
        self._unsub_listeners: list[Callable[[], None]] = []
        # Key: f"{box_id}_{gesture_type}" -> timestamp
        self._last_gesture_time: dict[str, float] = {}

    def _is_gesture_debounced(self, box: Any, gesture_type: str) -> bool:
        """Filter out acoustic vibrations and rapid duplicate triggers.

        When the speaker is actively playing audio, acoustic vibration causes
        accelerometer resonance. An elevated debounce window prevents speaker
        playback from triggering false commands.
        """
        now = time.time()
        key = f"{box.entry_id}_{gesture_type}"
        last = self._last_gesture_time.get(key, 0.0)

        # Check if box is currently playing
        active_player = box.get_active_player_entity() if hasattr(box, "get_active_player_entity") else None
        st = self.hass.states.get(active_player) if active_player else None
        is_playing = st is not None and st.state == "playing"

        # 0.85s debounce during active audio playback to suppress speaker vibrations, 0.5s otherwise
        debounce_window = 0.85 if is_playing else 0.50

        if (now - last) < debounce_window:
            _LOGGER.debug(
                "Debounced gesture '%s' on box '%s' (interval %.2fs < %.2fs, playing=%s)",
                gesture_type,
                box.name,
                now - last,
                debounce_window,
                is_playing,
            )
            return True

        self._last_gesture_time[key] = now
        return False

    def async_setup(self) -> None:
        """Register event listeners on Home Assistant event bus."""
        # 1. Listen for tag_scanned events
        self._unsub_listeners.append(
            self.hass.bus.async_listen(EVENT_TAG_SCANNED, self._handle_tag_scanned_event)
        )

        # 2. Listen for ESPHome tap events
        self._unsub_listeners.append(
            self.hass.bus.async_listen(EVENT_ESPHOME_TAP, self._handle_esphome_tap_event)
        )

        # 3. Listen for ESPHome tilt events
        self._unsub_listeners.append(
            self.hass.bus.async_listen(EVENT_ESPHOME_TILT, self._handle_esphome_tilt_event)
        )

        _LOGGER.debug("TonieESP event listeners registered successfully")

    def async_unload(self) -> None:
        """Unregister all event listeners."""
        for unsub in self._unsub_listeners:
            try:
                unsub()
            except Exception as err:
                _LOGGER.error("Error unregistering event listener: %s", err)
        self._unsub_listeners.clear()

    async def _handle_tag_scanned_event(self, event: Event) -> None:
        """Process incoming tag_scanned event."""
        data = event.data
        raw_tag_id = data.get("tag_id")
        device_id = data.get("device_id")

        if not raw_tag_id or not device_id:
            return

        box = self.device_manager.get_box_by_esphome_device_id(device_id)
        if not box:
            # Event does not belong to any configured Toniebox
            return

        uid = normalize_uid(str(raw_tag_id))
        _LOGGER.info("Toniebox '%s' scanned tag UID %s", box.name, uid)
        await box.async_handle_tag_scanned(uid)

    async def _handle_esphome_tap_event(self, event: Event) -> None:
        """Process incoming esphome.tonie_tap gesture event."""
        data = event.data
        device_id = data.get("device_id")
        axis = str(data.get("axis", "")).lower()
        side = str(data.get("side", "")).lower()  # pos = left, neg = right

        if not device_id:
            return

        box = self.device_manager.get_box_by_esphome_device_id(device_id)
        if not box or not box.gestures_enabled:
            return

        # Firmware tap filter: side taps land on y axis
        if axis and axis != "y":
            _LOGGER.debug("Ignoring tap on axis '%s' (only 'y' processed)", axis)
            return

        # Suppress vibration false triggers
        if self._is_gesture_debounced(box, "tap"):
            return

        is_left = side == "pos"
        action = box.left_tap_action if is_left else box.right_tap_action
        _LOGGER.debug("Tap on box '%s' (%s side) -> action: %s", box.name, "left" if is_left else "right", action)
        await self._execute_gesture_action(box, action)

    async def _handle_esphome_tilt_event(self, event: Event) -> None:
        """Process incoming esphome.tonie_tilt gesture event."""
        data = event.data
        device_id = data.get("device_id")
        side = str(data.get("side", "")).lower()  # pos = left (rewind), neg = right (forward)

        if not device_id:
            return

        box = self.device_manager.get_box_by_esphome_device_id(device_id)
        if not box or not box.gestures_enabled:
            return

        # Suppress vibration false triggers
        if self._is_gesture_debounced(box, "tilt"):
            return

        is_left = side == "pos"
        action = box.left_tilt_action if is_left else box.right_tilt_action
        _LOGGER.debug("Tilt on box '%s' (%s side) -> action: %s", box.name, "left" if is_left else "right", action)
        await self._execute_gesture_action(box, action)

    async def _execute_gesture_action(self, box: Any, action: str) -> None:
        """Execute the configured gesture action on the active Toniebox player."""
        active_player = box.get_active_player_entity() if hasattr(box, "get_active_player_entity") else box.ma_player_entity
        active_player = active_player or box.ma_player_entity or box.speaker_entity
        fallback_player = box.speaker_entity if active_player == box.ma_player_entity else box.ma_player_entity

        if not active_player or action == ACTION_NONE:
            return

        ma = self.device_manager.ma_adapter

        try:
            if action == ACTION_PREVIOUS_TRACK:
                await ma.async_previous(active_player, fallback_entity_id=fallback_player)
            elif action == ACTION_NEXT_TRACK:
                await ma.async_next(active_player, fallback_entity_id=fallback_player)
            elif action == ACTION_SEEK_BACKWARD:
                step = float(box.seek_step)
                await ma.async_seek_relative(active_player, -step, fallback_entity_id=fallback_player)
            elif action == ACTION_SEEK_FORWARD:
                step = float(box.seek_step)
                await ma.async_seek_relative(active_player, step, fallback_entity_id=fallback_player)
            elif action == ACTION_PLAY_PAUSE:
                await ma.async_play_pause(active_player, fallback_entity_id=fallback_player)
            elif action == ACTION_VOLUME_UP:
                state = self.hass.states.get(active_player)
                cur = float(state.attributes.get("volume_level", 0.5)) if state else 0.5
                await ma.async_set_volume(
                    active_player, min(1.0, cur + 0.05), max_volume=box.max_volume, fallback_entity_id=fallback_player
                )
            elif action == ACTION_VOLUME_DOWN:
                state = self.hass.states.get(active_player)
                cur = float(state.attributes.get("volume_level", 0.5)) if state else 0.5
                await ma.async_set_volume(
                    active_player, max(0.0, cur - 0.05), max_volume=box.max_volume, fallback_entity_id=fallback_player
                )
            else:
                _LOGGER.warning("Unknown gesture action '%s'", action)
        except Exception as err:
            _LOGGER.warning("Error executing gesture '%s' on %s: %s", action, active_player, err)
