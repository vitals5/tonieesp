"""Device manager and instance tracking for TonieESP."""

from __future__ import annotations

import contextlib
import logging
from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    CONF_ESPHOME_DEVICE_ID,
    CONF_GESTURES_ENABLED,
    CONF_LEFT_TAP_ACTION,
    CONF_LEFT_TILT_ACTION,
    CONF_MAX_VOLUME,
    CONF_MEDIA_PLAYER_ENTITY,
    CONF_MUSIC_ASSISTANT_PLAYER,
    CONF_NAME,
    CONF_NFC_SENSOR_ENTITY,
    CONF_PAUSE_ON_REMOVAL,
    CONF_RESUME_ON_REPLACE,
    CONF_RIGHT_TAP_ACTION,
    CONF_RIGHT_TILT_ACTION,
    CONF_SEEK_STEP,
    DEFAULT_GESTURES_ENABLED,
    DEFAULT_LEFT_TAP_ACTION,
    DEFAULT_LEFT_TILT_ACTION,
    DEFAULT_MAX_VOLUME,
    DEFAULT_PAUSE_ON_REMOVAL,
    DEFAULT_RESUME_ON_REPLACE,
    DEFAULT_RIGHT_TAP_ACTION,
    DEFAULT_RIGHT_TILT_ACTION,
    DEFAULT_SEEK_STEP,
)
from .entity_resolver import TonieBoxEntityResolver
from .music_assistant import MusicAssistantAdapter
from .nfc_manager import NFCManager, is_valid_uid, normalize_uid
from .playback_manager import PlaybackManager

_LOGGER = logging.getLogger(__name__)


class TonieBoxInstance:
    """Manages an individual Toniebox device instance."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        nfc_manager: NFCManager,
        playback_manager: PlaybackManager,
        ma_adapter: MusicAssistantAdapter,
        on_state_change: Callable[[TonieBoxInstance], None],
    ) -> None:
        """Initialize the Toniebox instance."""
        self.hass = hass
        self.entry = entry
        self.nfc_manager = nfc_manager
        self.playback_manager = playback_manager
        self.ma_adapter = ma_adapter
        self.on_state_change = on_state_change

        self.entry_id: str = entry.entry_id
        self.name: str = entry.data.get(CONF_NAME, "Toniebox")
        self.esphome_device_id: str = entry.data[CONF_ESPHOME_DEVICE_ID]

        # Entity resolver
        self.resolver = TonieBoxEntityResolver(
            hass=hass,
            esphome_device_id=self.esphome_device_id,
            configured_ma_player=entry.options.get(CONF_MUSIC_ASSISTANT_PLAYER)
            or entry.data.get(CONF_MUSIC_ASSISTANT_PLAYER),
            configured_speaker=entry.options.get(CONF_MEDIA_PLAYER_ENTITY)
            or entry.data.get(CONF_MEDIA_PLAYER_ENTITY),
            configured_nfc_sensor=entry.options.get(CONF_NFC_SENSOR_ENTITY)
            or entry.data.get(CONF_NFC_SENSOR_ENTITY),
        )

        # Settings
        self.pause_on_removal: bool = entry.options.get(
            CONF_PAUSE_ON_REMOVAL, DEFAULT_PAUSE_ON_REMOVAL
        )
        self.resume_on_replace: bool = entry.options.get(
            CONF_RESUME_ON_REPLACE, DEFAULT_RESUME_ON_REPLACE
        )
        self.max_volume: float = float(entry.options.get(CONF_MAX_VOLUME, DEFAULT_MAX_VOLUME))
        self.seek_step: int = int(entry.options.get(CONF_SEEK_STEP, DEFAULT_SEEK_STEP))
        self.gestures_enabled: bool = entry.options.get(
            CONF_GESTURES_ENABLED, DEFAULT_GESTURES_ENABLED
        )
        self.left_tap_action: str = entry.options.get(CONF_LEFT_TAP_ACTION, DEFAULT_LEFT_TAP_ACTION)
        self.right_tap_action: str = entry.options.get(
            CONF_RIGHT_TAP_ACTION, DEFAULT_RIGHT_TAP_ACTION
        )
        self.left_tilt_action: str = entry.options.get(
            CONF_LEFT_TILT_ACTION, DEFAULT_LEFT_TILT_ACTION
        )
        self.right_tilt_action: str = entry.options.get(
            CONF_RIGHT_TILT_ACTION, DEFAULT_RIGHT_TILT_ACTION
        )

        # State tracking
        self.current_tag: str | None = None
        self.unknown_tag: str | None = None
        self._unsub_trackers: list[Callable[[], None]] = []

    @property
    def speaker_entity(self) -> str | None:
        """ESPHome speaker entity."""
        return self.resolver.speaker

    @property
    def ma_player_entity(self) -> str | None:
        """Music Assistant player entity."""
        return self.resolver.ma_player

    @property
    def tap_threshold_entity(self) -> str | None:
        """ESPHome tap threshold number entity."""
        return self.resolver.tap_threshold

    @property
    def tap_time_limit_entity(self) -> str | None:
        """ESPHome tap time limit number entity."""
        return self.resolver.tap_time_limit

    def get_active_player_entity(self) -> str | None:
        """Determine the currently active media player (MA player or ESPHome speaker).

        Prefers whichever entity is actively 'playing' or 'paused'. If both are
        idle or none is playing, prefers the Music Assistant player if available,
        else the ESPHome speaker.
        """
        ma = self.ma_player_entity
        spk = self.speaker_entity

        # 1. Check if one is actively playing
        if ma:
            st = self.hass.states.get(ma)
            if st and st.state == "playing":
                return ma
        if spk:
            st = self.hass.states.get(spk)
            if st and st.state == "playing":
                return spk

        # 2. Check if one is paused
        if ma:
            st = self.hass.states.get(ma)
            if st and st.state == "paused":
                return ma
        if spk:
            st = self.hass.states.get(spk)
            if st and st.state == "paused":
                return spk

        # 3. Default to MA player if available, else speaker
        return ma or spk

    def _get_number_entity_value(self, entity_id: str | None) -> float | None:
        """Read float value of a number entity."""
        if not entity_id:
            return None
        st = self.hass.states.get(entity_id)
        if st and st.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            with contextlib.suppress(ValueError):
                return float(st.state)
        return None

    @property
    def nfc_sensor_entity(self) -> str | None:
        """NFC text sensor entity."""
        return self.resolver.nfc_sensor

    def is_online(self) -> bool:
        """Check if Toniebox is online based on entities."""
        speaker = self.speaker_entity
        if not speaker:
            return False
        state = self.hass.states.get(speaker)
        return state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)

    def get_battery_info(self) -> dict[str, Any]:
        """Fetch battery status and voltage."""
        bat_ent = self.resolver.battery
        volt_ent = self.resolver.battery_voltage
        charge_ent = self.resolver.charging

        level = None
        voltage = None
        charging = False

        if bat_ent:
            st = self.hass.states.get(bat_ent)
            if st and st.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                with contextlib.suppress(ValueError):
                    level = int(float(st.state))

        if volt_ent:
            st = self.hass.states.get(volt_ent)
            if st and st.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                with contextlib.suppress(ValueError):
                    voltage = round(float(st.state), 2)

        if charge_ent:
            st = self.hass.states.get(charge_ent)
            if st:
                charging = st.state.lower() in ("on", "true", "charging")

        return {
            "level": level,
            "voltage": voltage,
            "charging": charging,
        }

    def get_state(self) -> dict[str, Any]:
        """Generate comprehensive status dictionary for this box."""
        player = self.get_active_player_entity() or self.ma_player_entity or self.speaker_entity
        playback = self.ma_adapter.get_player_state(player) if player else {}

        # If active player is MA and reporting 0 volume, check speaker volume
        if self.speaker_entity and self.speaker_entity != player:
            spk_state = self.hass.states.get(self.speaker_entity)
            if spk_state and (playback.get("volume_level") in (None, 0.0)):
                spk_vol = spk_state.attributes.get("volume_level")
                if spk_vol is not None:
                    playback["volume_level"] = spk_vol

        battery = self.get_battery_info()

        hardware_tuning = {
            "tap_threshold": self._get_number_entity_value(self.tap_threshold_entity),
            "tap_time_limit": self._get_number_entity_value(self.tap_time_limit_entity),
        }

        current_tag_info = None
        if self.current_tag:
            tag = self.nfc_manager.get_tag(self.current_tag)
            if tag:
                current_tag_info = {
                    "uid": tag["uid"],
                    "name": tag.get("name"),
                    "image": tag.get("image"),
                    "media_title": tag.get("media", {}).get("title"),
                }

        return {
            "id": self.entry_id,
            "name": self.name,
            "esphome_device_id": self.esphome_device_id,
            "online": self.is_online(),
            "battery": battery,
            "current_tag": self.current_tag,
            "current_tag_info": current_tag_info,
            "unknown_tag": self.unknown_tag,
            "entities": self.resolver.all_resolved,
            "playback": playback,
            "hardware_tuning": hardware_tuning,
            "settings": {
                "pause_on_removal": self.pause_on_removal,
                "resume_on_replace": self.resume_on_replace,
                "max_volume": self.max_volume,
                "seek_step": self.seek_step,
                "gestures_enabled": self.gestures_enabled,
                "left_tap_action": self.left_tap_action,
                "right_tap_action": self.right_tap_action,
                "left_tilt_action": self.left_tilt_action,
                "right_tilt_action": self.right_tilt_action,
            },
        }

    async def async_setup(self) -> None:
        """Setup entity tracking and listeners for this box."""
        self.resolver.async_setup()
        self.resolver.register_update_callback(self._on_entities_resolved)
        self._setup_nfc_sensor_tracking()

    def _on_entities_resolved(self) -> None:
        """Re-bind sensor tracking when entities change."""
        self._setup_nfc_sensor_tracking()
        self.on_state_change(self)

    def _setup_nfc_sensor_tracking(self) -> None:
        """Subscribe to NFC sensor state changes to detect removal and replacement."""
        for unsub in self._unsub_trackers:
            unsub()
        self._unsub_trackers.clear()

        nfc_sensor = self.nfc_sensor_entity
        if not nfc_sensor:
            return

        @callback
        def _nfc_state_listener(event: Event) -> None:
            new_state = event.data.get("new_state")
            if not new_state:
                return
            state_val = str(new_state.state).strip().lower()

            if state_val == "none":
                # Tag removed
                self.hass.async_create_task(self.async_handle_tag_removed())
            elif is_valid_uid(normalize_uid(state_val)):
                # Tag placed (detected via sensor state update)
                uid = normalize_uid(state_val)
                self.hass.async_create_task(self.async_handle_tag_scanned(uid))

        self._unsub_trackers.append(
            async_track_state_change_event(self.hass, [nfc_sensor], _nfc_state_listener)
        )

    async def async_handle_tag_scanned(self, uid: str) -> None:
        """Process tag placed on this box."""
        # 1. Check if scan learning mode is active
        if self.nfc_manager.is_learning_active(self.esphome_device_id):
            self.nfc_manager.process_learned_tag(uid, self.esphome_device_id)
            self.unknown_tag = None
            self.on_state_change(self)
            return

        # 2. Check if known tag
        effective = self.nfc_manager.get_effective_media_for_box(uid, self.entry_id)
        if effective:
            self.current_tag = uid
            self.unknown_tag = None
            self.on_state_change(self)

            player = self.ma_player_entity
            if player:
                await self.playback_manager.async_handle_tag_placed(
                    box_id=self.entry_id,
                    player_entity_id=player,
                    tag_uid=uid,
                    media_info=effective.get("media", {}),
                    tag_settings=effective.get("settings", {}),
                )
        else:
            # Unknown tag
            _LOGGER.info("Unknown NFC tag %s placed on Toniebox '%s'", uid, self.name)
            self.current_tag = None
            self.unknown_tag = uid
            self.on_state_change(self)

    async def async_handle_tag_removed(self) -> None:
        """Process tag lifted off this box."""
        if not self.current_tag and not self.unknown_tag:
            return

        _LOGGER.debug("Tag lifted from Toniebox '%s'", self.name)
        self.current_tag = None
        self.unknown_tag = None
        self.on_state_change(self)

        player = self.ma_player_entity
        if player:
            await self.playback_manager.async_handle_tag_removed(
                box_id=self.entry_id,
                player_entity_id=player,
                pause_on_removal=self.pause_on_removal,
            )

    def update_options(self, options: dict[str, Any]) -> None:
        """Update instance settings dynamically."""
        if CONF_PAUSE_ON_REMOVAL in options:
            self.pause_on_removal = bool(options[CONF_PAUSE_ON_REMOVAL])
        if CONF_RESUME_ON_REPLACE in options:
            self.resume_on_replace = bool(options[CONF_RESUME_ON_REPLACE])
        if CONF_MAX_VOLUME in options:
            self.max_volume = float(options[CONF_MAX_VOLUME])
        if CONF_SEEK_STEP in options:
            self.seek_step = int(options[CONF_SEEK_STEP])
        if CONF_GESTURES_ENABLED in options:
            self.gestures_enabled = bool(options[CONF_GESTURES_ENABLED])
        if CONF_LEFT_TAP_ACTION in options:
            self.left_tap_action = str(options[CONF_LEFT_TAP_ACTION])
        if CONF_RIGHT_TAP_ACTION in options:
            self.right_tap_action = str(options[CONF_RIGHT_TAP_ACTION])
        if CONF_LEFT_TILT_ACTION in options:
            self.left_tilt_action = str(options[CONF_LEFT_TILT_ACTION])
        if CONF_RIGHT_TILT_ACTION in options:
            self.right_tilt_action = str(options[CONF_RIGHT_TILT_ACTION])
        if CONF_MUSIC_ASSISTANT_PLAYER in options:
            self.resolver.configured_ma_player = options[CONF_MUSIC_ASSISTANT_PLAYER]
            self.resolver.resolve_entities()

        self.on_state_change(self)

    async def async_set_hardware_tuning(
        self,
        tap_threshold: float | None = None,
        tap_time_limit: float | None = None,
    ) -> None:
        """Set tap threshold and tap time limit on ESPHome number entities."""
        if tap_threshold is not None and self.tap_threshold_entity:
            try:
                await self.hass.services.async_call(
                    "number",
                    "set_value",
                    {"value": float(tap_threshold)},
                    target={"entity_id": self.tap_threshold_entity},
                    blocking=True,
                )
                _LOGGER.info(
                    "Set tap_threshold on %s to %s", self.tap_threshold_entity, tap_threshold
                )
            except Exception as err:
                _LOGGER.warning("Could not set tap_threshold: %s", err)

        if tap_time_limit is not None and self.tap_time_limit_entity:
            try:
                await self.hass.services.async_call(
                    "number",
                    "set_value",
                    {"value": float(tap_time_limit)},
                    target={"entity_id": self.tap_time_limit_entity},
                    blocking=True,
                )
                _LOGGER.info(
                    "Set tap_time_limit on %s to %s", self.tap_time_limit_entity, tap_time_limit
                )
            except Exception as err:
                _LOGGER.warning("Could not set tap_time_limit: %s", err)

        self.on_state_change(self)

    def async_unload(self) -> None:
        """Clean up instance listeners."""
        for unsub in self._unsub_trackers:
            unsub()
        self._unsub_trackers.clear()
        self.resolver.async_unload()


class TonieBoxDeviceManager:
    """Manages all Toniebox instances within the integration."""

    def __init__(
        self,
        hass: HomeAssistant,
        nfc_manager: NFCManager,
        playback_manager: PlaybackManager,
        ma_adapter: MusicAssistantAdapter,
    ) -> None:
        """Initialize the device manager."""
        self.hass = hass
        self.nfc_manager = nfc_manager
        self.playback_manager = playback_manager
        self.ma_adapter = ma_adapter
        self._boxes: dict[str, TonieBoxInstance] = {}
        self._listeners: list[Callable[[str, dict[str, Any]], None]] = []

    def register_listener(
        self, callback_func: Callable[[str, dict[str, Any]], None]
    ) -> Callable[[], None]:
        """Register a callback for box state changes."""
        self._listeners.append(callback_func)

        def unsub() -> None:
            if callback_func in self._listeners:
                self._listeners.remove(callback_func)

        return unsub

    def _notify(self, action: str, data: dict[str, Any]) -> None:
        for cb in list(self._listeners):
            try:
                cb(action, data)
            except Exception as err:
                _LOGGER.error("Error notifying box listener: %s", err)

    def _on_box_state_changed(self, box: TonieBoxInstance) -> None:
        self._notify("box_updated", box.get_state())

    def get_box(self, entry_id: str) -> TonieBoxInstance | None:
        """Get Toniebox instance by Config Entry ID."""
        return self._boxes.get(entry_id)

    def get_box_by_esphome_device_id(self, esphome_device_id: str) -> TonieBoxInstance | None:
        """Get Toniebox instance by ESPHome device registry ID."""
        for box in self._boxes.values():
            if box.esphome_device_id == esphome_device_id:
                return box
        return None

    def list_boxes(self) -> list[dict[str, Any]]:
        """Return list of all box state dicts."""
        return [box.get_state() for box in self._boxes.values()]

    async def async_add_box(self, entry: ConfigEntry) -> TonieBoxInstance:
        """Create and register a new Toniebox instance."""
        box = TonieBoxInstance(
            hass=self.hass,
            entry=entry,
            nfc_manager=self.nfc_manager,
            playback_manager=self.playback_manager,
            ma_adapter=self.ma_adapter,
            on_state_change=self._on_box_state_changed,
        )
        await box.async_setup()
        self._boxes[entry.entry_id] = box
        self._notify("box_added", box.get_state())
        _LOGGER.info("Registered Toniebox instance '%s' (%s)", box.name, entry.entry_id)
        return box

    async def async_remove_box(self, entry_id: str) -> None:
        """Unload and remove a Toniebox instance."""
        if entry_id in self._boxes:
            box = self._boxes.pop(entry_id)
            box.async_unload()
            self._notify("box_removed", {"id": entry_id, "name": box.name})
            _LOGGER.info("Unloaded Toniebox instance '%s'", box.name)
