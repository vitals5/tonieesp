"""Tests for Entity Resolver."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from homeassistant.helpers import entity_registry as er

from custom_components.tonieesp.entity_resolver import TonieBoxEntityResolver


@pytest.mark.asyncio
async def test_entity_resolution_and_dynamic_update(hass):
    """Test resolution of entities and dynamic update when entity is renamed."""
    dev_id = "esphome_box_device_123"

    # Setup device registry mock
    mock_dev_reg = MagicMock()
    dev_entry = MagicMock()
    dev_entry.name = "toniebox-kinderzimmer"
    mock_dev_reg.async_get.return_value = dev_entry

    # Setup entity registry mock
    mock_ent_reg = MagicMock()
    speaker_entry = MagicMock()
    speaker_entry.domain = "media_player"
    speaker_entry.entity_id = "media_player.toniebox_kinderzimmer_speaker"
    speaker_entry.original_name = "Speaker"

    nfc_entry = MagicMock()
    nfc_entry.domain = "sensor"
    nfc_entry.entity_id = "sensor.toniebox_kinderzimmer_nfc_tag_uid"
    nfc_entry.original_name = "NFC Tag UID"
    nfc_entry.original_device_class = None

    bat_entry = MagicMock()
    bat_entry.domain = "sensor"
    bat_entry.entity_id = "sensor.toniebox_kinderzimmer_battery"
    bat_entry.original_name = "Battery"
    bat_entry.original_device_class = "battery"

    led_entry = MagicMock()
    led_entry.domain = "light"
    led_entry.entity_id = "light.toniebox_kinderzimmer_led"
    led_entry.original_name = "LED"

    entries = [speaker_entry, nfc_entry, bat_entry, led_entry]

    with (
        patch("homeassistant.helpers.device_registry.async_get", return_value=mock_dev_reg),
        patch("homeassistant.helpers.entity_registry.async_get", return_value=mock_ent_reg),
        patch(
            "homeassistant.helpers.entity_registry.async_entries_for_device", return_value=entries
        ),
    ):
        resolver = TonieBoxEntityResolver(hass, dev_id)
        resolver.async_setup()

        # Check resolved entities
        assert resolver.speaker == "media_player.toniebox_kinderzimmer_speaker"
        assert resolver.nfc_sensor == "sensor.toniebox_kinderzimmer_nfc_tag_uid"
        assert resolver.battery == "sensor.toniebox_kinderzimmer_battery"
        assert resolver.led == "light.toniebox_kinderzimmer_led"

        # Simulate user renaming speaker entity in Home Assistant
        speaker_entry.entity_id = "media_player.my_custom_renamed_speaker"

        # Fire registry updated event
        await hass.bus.async_fire(er.EVENT_ENTITY_REGISTRY_UPDATED, {"action": "update"})

        # Verify resolver dynamically adapted!
        assert resolver.speaker == "media_player.my_custom_renamed_speaker"

        resolver.async_unload()
