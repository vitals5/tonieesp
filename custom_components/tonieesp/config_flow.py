"""Config flow for TonieESP integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.selector import (
    DeviceSelector,
    DeviceSelectorConfig,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from .const import (
    ACTION_NEXT_TRACK,
    ACTION_NONE,
    ACTION_PLAY_PAUSE,
    ACTION_PREVIOUS_TRACK,
    ACTION_SEEK_BACKWARD,
    ACTION_SEEK_FORWARD,
    ACTION_VOLUME_DOWN,
    ACTION_VOLUME_UP,
    CONF_ESPHOME_DEVICE_ID,
    CONF_GESTURES_ENABLED,
    CONF_LEFT_TAP_ACTION,
    CONF_LEFT_TILT_ACTION,
    CONF_MAX_VOLUME,
    CONF_MUSIC_ASSISTANT_PLAYER,
    CONF_NAME,
    CONF_PAUSE_ON_REMOVAL,
    CONF_PING_BINARY_SENSOR,
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
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)

TAP_ACTIONS = [
    SelectOptionDict(value=ACTION_PREVIOUS_TRACK, label="Vorheriger Titel (Standard links)"),
    SelectOptionDict(value=ACTION_NEXT_TRACK, label="Nächster Titel (Standard rechts)"),
    SelectOptionDict(value=ACTION_PLAY_PAUSE, label="Wiedergabe / Pause"),
    SelectOptionDict(value=ACTION_VOLUME_UP, label="Lauter (+5%)"),
    SelectOptionDict(value=ACTION_VOLUME_DOWN, label="Leiser (-5%)"),
    SelectOptionDict(value=ACTION_NONE, label="Keine Aktion"),
]

TILT_ACTIONS = [
    SelectOptionDict(value=ACTION_SEEK_BACKWARD, label="Zurückspulen (Standard links)"),
    SelectOptionDict(value=ACTION_SEEK_FORWARD, label="Vorspulen (Standard rechts)"),
    SelectOptionDict(value=ACTION_NONE, label="Keine Aktion"),
]


class TonieESPConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for TonieESP."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle the initial setup step with live-search and ESPHome device filter."""
        errors: dict[str, str] = {}

        if user_input is not None:
            dev_id = user_input[CONF_ESPHOME_DEVICE_ID]

            await self.async_set_unique_id(f"tonieesp_{dev_id}")
            self._abort_if_unique_id_configured()

            dev_reg = dr.async_get(self.hass)
            device_entry = dev_reg.async_get(dev_id)
            default_name = (
                (device_entry.name_by_user or device_entry.name) if device_entry else "Toniebox"
            )
            name = user_input.get(CONF_NAME) or default_name

            return self.async_create_entry(
                title=name,
                data={
                    CONF_ESPHOME_DEVICE_ID: dev_id,
                    CONF_NAME: name,
                    CONF_MUSIC_ASSISTANT_PLAYER: user_input.get(CONF_MUSIC_ASSISTANT_PLAYER),
                    CONF_PING_BINARY_SENSOR: user_input.get(CONF_PING_BINARY_SENSOR),
                },
            )

        schema = vol.Schema(
            {
                vol.Required(CONF_ESPHOME_DEVICE_ID): DeviceSelector(
                    DeviceSelectorConfig(integration="esphome")
                ),
                vol.Optional(CONF_NAME): str,
                vol.Optional(CONF_MUSIC_ASSISTANT_PLAYER): EntitySelector(
                    EntitySelectorConfig(domain="media_player")
                ),
                vol.Optional(CONF_PING_BINARY_SENSOR): EntitySelector(
                    EntitySelectorConfig(domain="binary_sensor")
                ),
            }
        )

        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> TonieESPOptionsFlowHandler:
        """Get the options flow handler."""
        return TonieESPOptionsFlowHandler(config_entry)


OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_MUSIC_ASSISTANT_PLAYER): EntitySelector(
            EntitySelectorConfig(domain="media_player")
        ),
        vol.Optional(CONF_PING_BINARY_SENSOR): EntitySelector(
            EntitySelectorConfig(domain="binary_sensor")
        ),
        vol.Optional(CONF_PAUSE_ON_REMOVAL): bool,
        vol.Optional(CONF_RESUME_ON_REPLACE): bool,
        vol.Optional(CONF_MAX_VOLUME): NumberSelector(
            NumberSelectorConfig(min=0.1, max=1.0, step=0.05, mode=NumberSelectorMode.SLIDER)
        ),
        vol.Optional(CONF_SEEK_STEP): NumberSelector(
            NumberSelectorConfig(min=5, max=60, step=5, mode=NumberSelectorMode.BOX)
        ),
        vol.Optional(CONF_GESTURES_ENABLED): bool,
        vol.Optional(CONF_LEFT_TAP_ACTION): SelectSelector(
            SelectSelectorConfig(options=TAP_ACTIONS, mode=SelectSelectorMode.DROPDOWN)
        ),
        vol.Optional(CONF_RIGHT_TAP_ACTION): SelectSelector(
            SelectSelectorConfig(options=TAP_ACTIONS, mode=SelectSelectorMode.DROPDOWN)
        ),
        vol.Optional(CONF_LEFT_TILT_ACTION): SelectSelector(
            SelectSelectorConfig(options=TILT_ACTIONS, mode=SelectSelectorMode.DROPDOWN)
        ),
        vol.Optional(CONF_RIGHT_TILT_ACTION): SelectSelector(
            SelectSelectorConfig(options=TILT_ACTIONS, mode=SelectSelectorMode.DROPDOWN)
        ),
    }
)


class TonieESPOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for an existing Toniebox."""

    def __init__(self, config_entry: config_entries.ConfigEntry | None = None) -> None:
        """Initialize options flow."""
        if config_entry is not None:
            self._config_entry = config_entry

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Manage Toniebox options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        entry = self.config_entry
        options = dict(entry.options)

        suggested_values: dict[str, Any] = {
            CONF_MUSIC_ASSISTANT_PLAYER: options.get(
                CONF_MUSIC_ASSISTANT_PLAYER,
                entry.data.get(CONF_MUSIC_ASSISTANT_PLAYER),
            ),
            CONF_PING_BINARY_SENSOR: options.get(
                CONF_PING_BINARY_SENSOR,
                entry.data.get(CONF_PING_BINARY_SENSOR),
            ),
            CONF_PAUSE_ON_REMOVAL: options.get(CONF_PAUSE_ON_REMOVAL, DEFAULT_PAUSE_ON_REMOVAL),
            CONF_RESUME_ON_REPLACE: options.get(CONF_RESUME_ON_REPLACE, DEFAULT_RESUME_ON_REPLACE),
            CONF_MAX_VOLUME: options.get(CONF_MAX_VOLUME, DEFAULT_MAX_VOLUME),
            CONF_SEEK_STEP: options.get(CONF_SEEK_STEP, DEFAULT_SEEK_STEP),
            CONF_GESTURES_ENABLED: options.get(CONF_GESTURES_ENABLED, DEFAULT_GESTURES_ENABLED),
            CONF_LEFT_TAP_ACTION: options.get(CONF_LEFT_TAP_ACTION, DEFAULT_LEFT_TAP_ACTION),
            CONF_RIGHT_TAP_ACTION: options.get(CONF_RIGHT_TAP_ACTION, DEFAULT_RIGHT_TAP_ACTION),
            CONF_LEFT_TILT_ACTION: options.get(CONF_LEFT_TILT_ACTION, DEFAULT_LEFT_TILT_ACTION),
            CONF_RIGHT_TILT_ACTION: options.get(CONF_RIGHT_TILT_ACTION, DEFAULT_RIGHT_TILT_ACTION),
        }

        # Remove None values so selectors are clean
        clean_suggested_values = {k: v for k, v in suggested_values.items() if v is not None}

        schema = self.add_suggested_values_to_schema(
            OPTIONS_SCHEMA,
            clean_suggested_values,
        )

        return self.async_show_form(step_id="init", data_schema=schema)
