"""Tests for Integration Setup and Unload."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntry

from custom_components.tonieesp import (
    async_reload_entry,
    async_setup,
    async_setup_entry,
    async_unload_entry,
)
from custom_components.tonieesp.const import (
    CONF_ESPHOME_DEVICE_ID,
    CONF_NAME,
    DOMAIN,
    FRONTEND_URL_PATH,
)


@pytest.mark.asyncio
async def test_setup_and_unload_lifecycle(hass):
    """Test setting up integration entry, registering panel, and clean unloading."""
    # 1. async_setup
    res = await async_setup(hass, {})
    assert res is True
    assert DOMAIN in hass.data

    # 2. async_setup_entry
    entry = MagicMock(spec=ConfigEntry)
    entry.entry_id = "test_entry_1"
    entry.data = {
        CONF_ESPHOME_DEVICE_ID: "esphome_dev_1",
        CONF_NAME: "Kinderzimmer",
    }
    entry.options = {}
    entry.async_on_unload = MagicMock()
    entry.add_update_listener = MagicMock()

    with (
        patch(
            "custom_components.tonieesp.coordinator.TonieESPCoordinator.async_setup",
            new_callable=AsyncMock,
        ),
        patch(
            "custom_components.tonieesp.device_manager.TonieBoxDeviceManager.async_add_box",
            new_callable=AsyncMock,
        ) as mock_add_box,
        patch("homeassistant.components.frontend.async_register_built_in_panel") as mock_reg_panel,
    ):
        setup_result = await async_setup_entry(hass, entry)
        assert setup_result is True
        assert mock_add_box.called
        assert mock_reg_panel.called

    # 3. async_reload_entry
    with patch.object(hass.config_entries, "async_reload", new_callable=AsyncMock) as mock_reload:
        await async_reload_entry(hass, entry)
        mock_reload.assert_called_once_with("test_entry_1")

    # 4. async_unload_entry
    with (
        patch(
            "custom_components.tonieesp.coordinator.TonieESPCoordinator.async_unload",
            new_callable=AsyncMock,
        ) as mock_coord_unload,
        patch(
            "custom_components.tonieesp.device_manager.TonieBoxDeviceManager.async_remove_box",
            new_callable=AsyncMock,
        ) as mock_rem_box,
        patch("homeassistant.components.frontend.async_remove_panel") as mock_rem_panel,
        patch.object(hass.config_entries, "async_entries", return_value=[entry]),
    ):
        unload_result = await async_unload_entry(hass, entry)
        assert unload_result is True
        assert mock_rem_box.called
        assert mock_coord_unload.called
        mock_rem_panel.assert_called_with(hass, FRONTEND_URL_PATH, warn_if_unknown=False)
        assert DOMAIN not in hass.data
