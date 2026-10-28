"""Tests for Config Flow and Options Flow."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResultType

from custom_components.tonieesp.config_flow import TonieESPConfigFlow, TonieESPOptionsFlowHandler
from custom_components.tonieesp.const import (
    CONF_ESPHOME_DEVICE_ID,
    CONF_MAX_VOLUME,
    CONF_NAME,
    CONF_PAUSE_ON_REMOVAL,
)


@pytest.mark.asyncio
async def test_config_flow_success(hass):
    """Test successful user step in config flow."""
    flow = TonieESPConfigFlow()
    flow.hass = hass

    mock_dev_reg = MagicMock()
    mock_dev = MagicMock()
    mock_dev.id = "dev_123"
    mock_dev.name = "Toniebox Kinderzimmer"
    mock_dev.name_by_user = None
    mock_dev.config_entries = ["esphome_entry_1"]
    mock_dev_reg.devices = {"dev_123": mock_dev}

    mock_esphome_entry = MagicMock()
    mock_esphome_entry.domain = "esphome"

    with (
        patch("homeassistant.helpers.device_registry.async_get", return_value=mock_dev_reg),
        patch.object(hass.config_entries, "async_get_entry", return_value=mock_esphome_entry),
        patch.object(flow, "_async_current_entries", return_value=[]),
        patch.object(flow, "async_set_unique_id") as mock_set_id,
    ):
        # 1. Show form
        result = await flow.async_step_user(user_input=None)
        assert result["type"] == FlowResultType.FORM
        assert result["step_id"] == "user"

        # 2. Submit form
        result2 = await flow.async_step_user(
            user_input={
                CONF_ESPHOME_DEVICE_ID: "dev_123",
                CONF_NAME: "Kinderzimmer Box",
            }
        )

        assert result2["type"] == FlowResultType.CREATE_ENTRY
        assert result2["title"] == "Kinderzimmer Box"
        assert result2["data"][CONF_ESPHOME_DEVICE_ID] == "dev_123"
        mock_set_id.assert_called_once_with("tonieesp_dev_123")


@pytest.mark.asyncio
async def test_options_flow(hass):
    """Test updating settings via options flow."""
    config_entry = MagicMock(spec=config_entries.ConfigEntry)
    config_entry.data = {CONF_ESPHOME_DEVICE_ID: "dev_123", CONF_NAME: "Box"}
    config_entry.options = {CONF_PAUSE_ON_REMOVAL: True, CONF_MAX_VOLUME: 0.8}

    flow = TonieESPOptionsFlowHandler(config_entry)
    flow.hass = hass

    # 1. Show options form
    res = await flow.async_step_init(user_input=None)
    assert res["type"] == FlowResultType.FORM

    # 2. Submit options
    res2 = await flow.async_step_init(
        user_input={
            CONF_PAUSE_ON_REMOVAL: False,
            CONF_MAX_VOLUME: 0.65,
        }
    )

    assert res2["type"] == FlowResultType.CREATE_ENTRY
    assert res2["data"][CONF_PAUSE_ON_REMOVAL] is False
    assert res2["data"][CONF_MAX_VOLUME] == 0.65


@pytest.mark.asyncio
async def test_options_flow_parameterless(hass):
    """Test options flow initialized without arguments (modern HA style)."""
    config_entry = MagicMock(spec=config_entries.ConfigEntry)
    config_entry.data = {CONF_ESPHOME_DEVICE_ID: "dev_456", CONF_NAME: "Modern Box"}
    config_entry.options = {}

    flow = TonieESPOptionsFlowHandler()
    flow.hass = hass
    flow.handler = "test_entry_id"

    with patch.object(hass.config_entries, "async_get_known_entry", return_value=config_entry):
        res = await flow.async_step_init(user_input=None)
        assert res["type"] == FlowResultType.FORM
