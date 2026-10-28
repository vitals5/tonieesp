"""Dynamic Entity Resolver for TonieESP.

Resolves ESPHome and Music Assistant entities via Device and Entity Registry,
adapting automatically when entities are renamed.
"""

from __future__ import annotations

import logging
from collections.abc import Callable

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)


class TonieBoxEntityResolver:
    """Resolves and tracks Home Assistant entities associated with a Toniebox."""

    def __init__(
        self,
        hass: HomeAssistant,
        esphome_device_id: str,
        configured_ma_player: str | None = None,
        configured_speaker: str | None = None,
        configured_nfc_sensor: str | None = None,
        configured_ping_binary_sensor: str | None = None,
    ) -> None:
        """Initialize the entity resolver."""
        self.hass = hass
        self.esphome_device_id = esphome_device_id
        self.configured_ma_player = configured_ma_player
        self.configured_speaker = configured_speaker
        self.configured_nfc_sensor = configured_nfc_sensor
        self.configured_ping_binary_sensor = configured_ping_binary_sensor

        self._resolved: dict[str, str | None] = {
            "speaker": configured_speaker,
            "ma_player": configured_ma_player,
            "nfc_sensor": configured_nfc_sensor,
            "ping_sensor": configured_ping_binary_sensor,
            "battery": None,
            "battery_voltage": None,
            "charging": None,
            "led": None,
            "status_led": None,
            "max_volume": None,
            "sleep_timeout": None,
            "last_wake_cause": None,
        }

        self._unsub_registry: Callable[[], None] | None = None
        self._on_update_callbacks: list[Callable[[], None]] = []

    @property
    def speaker(self) -> str | None:
        """ESPHome speaker media player entity ID."""
        return self._resolved.get("speaker")

    @property
    def ma_player(self) -> str | None:
        """Music Assistant media player entity ID."""
        return self._resolved.get("ma_player") or self.speaker

    @property
    def nfc_sensor(self) -> str | None:
        """NFC Tag UID sensor entity ID."""
        return self._resolved.get("nfc_sensor")

    @property
    def ping_sensor(self) -> str | None:
        """Ping binary sensor entity ID for box online/offline state."""
        return self._resolved.get("ping_sensor")

    @property
    def battery(self) -> str | None:
        """Battery percentage sensor entity ID."""
        return self._resolved.get("battery")

    @property
    def battery_voltage(self) -> str | None:
        """Battery voltage sensor entity ID."""
        return self._resolved.get("battery_voltage")

    @property
    def charging(self) -> str | None:
        """Charging binary sensor / sensor entity ID."""
        return self._resolved.get("charging")

    @property
    def led(self) -> str | None:
        """LED light entity ID."""
        return self._resolved.get("led")

    @property
    def status_led(self) -> str | None:
        """Status LED switch entity ID."""
        return self._resolved.get("status_led")

    @property
    def max_volume(self) -> str | None:
        """Max volume number entity ID."""
        return self._resolved.get("max_volume")

    @property
    def tap_threshold(self) -> str | None:
        """Tap threshold number entity ID."""
        return self._resolved.get("tap_threshold")

    @property
    def tap_time_limit(self) -> str | None:
        """Tap time limit number entity ID."""
        return self._resolved.get("tap_time_limit")

    @property
    def all_resolved(self) -> dict[str, str | None]:
        """Dictionary of all resolved entities."""
        return dict(self._resolved)

    def register_update_callback(self, cb: Callable[[], None]) -> Callable[[], None]:
        """Register a callback when entity resolution changes."""
        self._on_update_callbacks.append(cb)

        def unsub() -> None:
            if cb in self._on_update_callbacks:
                self._on_update_callbacks.remove(cb)

        return unsub

    def _notify_update(self) -> None:
        for cb in list(self._on_update_callbacks):
            try:
                cb()
            except Exception as err:
                _LOGGER.error("Error in entity resolver update callback: %s", err)

    def async_setup(self) -> None:
        """Resolve initial entities and subscribe to registry changes."""
        self.resolve_entities()

        # Listen for entity registry changes
        @callback
        def _handle_registry_update(event: Event) -> None:
            action = event.data.get("action")
            if action in ("update", "remove"):
                _LOGGER.debug(
                    "Entity registry modified (%s), re-resolving entities for device %s",
                    action,
                    self.esphome_device_id,
                )
                self.resolve_entities()
                self._notify_update()

        self._unsub_registry = self.hass.bus.async_listen(
            er.EVENT_ENTITY_REGISTRY_UPDATED, _handle_registry_update
        )

    def async_unload(self) -> None:
        """Unsubscribe registry listeners."""
        if self._unsub_registry:
            self._unsub_registry()
            self._unsub_registry = None
        self._on_update_callbacks.clear()

    def resolve_entities(self) -> None:
        """Inspect Entity Registry and Home Assistant states to resolve box entities."""
        ent_reg = er.async_get(self.hass)
        dev_reg = dr.async_get(self.hass)

        device_entry = dev_reg.async_get(self.esphome_device_id)
        device_name = device_entry.name if device_entry else ""

        # Find all entities belonging to the ESPHome device
        entries = er.async_entries_for_device(ent_reg, self.esphome_device_id)

        found_speaker: str | None = self.configured_speaker
        found_nfc: str | None = self.configured_nfc_sensor
        found_battery: str | None = None
        found_battery_voltage: str | None = None
        found_charging: str | None = None
        found_led: str | None = None
        found_status_led: str | None = None
        found_max_volume: str | None = None
        found_sleep_timeout: str | None = None
        found_wake_cause: str | None = None
        found_tap_threshold: str | None = None
        found_tap_time_limit: str | None = None

        for entry in entries:
            orig = (entry.original_name or "").lower()
            ent_id = entry.entity_id.lower()
            domain = entry.domain

            # Speaker (ESPHome media_player)
            if domain == "media_player" and not found_speaker:
                found_speaker = entry.entity_id

            # NFC Tag UID sensor
            if domain in ("sensor", "text_sensor") and not found_nfc:
                if "nfc" in orig or "tag_uid" in orig or "nfc_tag" in ent_id:
                    found_nfc = entry.entity_id

            # Battery percentage
            if domain == "sensor" and not found_battery:
                if entry.original_device_class == "battery" or (
                    "battery" in orig
                    and "voltage" not in orig
                    and "level" in orig
                    or orig == "battery"
                ):
                    found_battery = entry.entity_id

            # Battery voltage
            if domain == "sensor" and not found_battery_voltage:
                if "voltage" in orig or "voltage" in ent_id:
                    found_battery_voltage = entry.entity_id

            # Charging status
            if domain in ("binary_sensor", "sensor") and not found_charging:
                if "charge" in orig or "charging" in orig:
                    found_charging = entry.entity_id

            # LED Light
            if domain == "light" and not found_led:
                if "led" in orig or "led" in ent_id:
                    found_led = entry.entity_id

            # Status LED switch
            if domain == "switch" and not found_status_led:
                if "status_led" in orig or "status_led" in ent_id or "status led" in orig:
                    found_status_led = entry.entity_id

            # Max Volume number
            if domain == "number" and not found_max_volume:
                if "max_volume" in orig or "max volume" in orig or "max_volume" in ent_id:
                    found_max_volume = entry.entity_id

            # Sleep timeout number
            if domain == "number" and not found_sleep_timeout:
                if "sleep_timeout" in orig or "sleep timeout" in orig:
                    found_sleep_timeout = entry.entity_id

            # Tap threshold number
            if domain == "number" and not found_tap_threshold:
                if "tap_threshold" in orig or "tap threshold" in orig or "tap_threshold" in ent_id:
                    found_tap_threshold = entry.entity_id

            # Tap time limit number
            if domain == "number" and not found_tap_time_limit:
                if (
                    "tap_time_limit" in orig
                    or "tap time limit" in orig
                    or "tap_time_limit" in ent_id
                ):
                    found_tap_time_limit = entry.entity_id

            # Last wake cause
            if domain in ("sensor", "text_sensor") and not found_wake_cause:
                if "wake_cause" in orig or "wake cause" in orig:
                    found_wake_cause = entry.entity_id

        # Resolve Music Assistant player
        found_ma_player = self._resolve_ma_player(device_name, found_speaker)

        # Resolve ping binary sensor if configured or auto-detected by matching box name
        found_ping = self.configured_ping_binary_sensor or self._resolve_ping_sensor(device_name)

        self._resolved["speaker"] = found_speaker
        self._resolved["ma_player"] = found_ma_player or found_speaker
        self._resolved["nfc_sensor"] = found_nfc
        self._resolved["ping_sensor"] = found_ping
        self._resolved["battery"] = found_battery
        self._resolved["battery_voltage"] = found_battery_voltage
        self._resolved["charging"] = found_charging
        self._resolved["led"] = found_led
        self._resolved["status_led"] = found_status_led
        self._resolved["max_volume"] = found_max_volume
        self._resolved["sleep_timeout"] = found_sleep_timeout
        self._resolved["last_wake_cause"] = found_wake_cause
        self._resolved["tap_threshold"] = found_tap_threshold
        self._resolved["tap_time_limit"] = found_tap_time_limit

        _LOGGER.debug(
            "Resolved entities for device '%s': speaker=%s, ma_player=%s, nfc=%s",
            self.esphome_device_id,
            found_speaker,
            self._resolved["ma_player"],
            found_nfc,
        )

    def _resolve_ma_player(self, device_name: str, esphome_speaker: str | None) -> str | None:
        """Identify corresponding Music Assistant media player."""
        # 1. If explicitly configured by user, verify or use it
        if self.configured_ma_player:
            return self.configured_ma_player

        ent_reg = er.async_get(self.hass)

        # 2. Look for an entity from 'mass' or 'music_assistant' platform
        for state in self.hass.states.async_all("media_player"):
            entity_id = state.entity_id
            reg_entry = ent_reg.async_get(entity_id)

            is_ma = False
            if (
                reg_entry
                and reg_entry.platform in ("mass", "music_assistant")
                or "mass" in entity_id
                or "music_assistant" in entity_id
            ):
                is_ma = True

            if is_ma:
                # Check if name correlates to box
                friendly_name = state.attributes.get("friendly_name", "").lower()
                dev_lower = device_name.lower() if device_name else ""
                speaker_suffix = (esphome_speaker or "").replace("media_player.", "").lower()

                if dev_lower and dev_lower in friendly_name:
                    return entity_id
                if speaker_suffix and speaker_suffix in entity_id:
                    return entity_id

        # 3. Check common ESPHome + MA naming convention: e.g. <speaker>_2
        if esphome_speaker:
            candidate_suffix_2 = f"{esphome_speaker}_2"
            if self.hass.states.get(candidate_suffix_2):
                return candidate_suffix_2

        return None

    def _resolve_ping_sensor(self, device_name: str) -> str | None:
        """Auto-detect ping binary sensor correlated with this Toniebox."""
        clean_dev = device_name.lower().replace("-", "_").replace(" ", "_") if device_name else ""
        # Also clean parts: e.g. "kinderzimmer_benjamin" from "Kinderzimmer Benjamin Toniebox"
        keywords = [k for k in clean_dev.split("_") if len(k) >= 3 and k != "box"]
        for state in self.hass.states.async_all("binary_sensor"):
            ent_id = state.entity_id.lower()
            # If entity contains "tonie" or contains the clean device name
            if "tonie" in ent_id or (clean_dev and clean_dev in ent_id):
                return state.entity_id
            # Or if it matches multiple keywords from the device name and has "ping" in it
            if "ping" in ent_id and any(kw in ent_id for kw in keywords):
                return state.entity_id
        return None
