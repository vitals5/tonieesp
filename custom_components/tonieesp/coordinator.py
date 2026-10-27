"""Central Coordinator and Runtime Container for TonieESP."""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

from .device_manager import TonieBoxDeviceManager
from .event_handler import TonieESPEventHandler
from .music_assistant import MusicAssistantAdapter
from .nfc_manager import NFCManager
from .playback_manager import PlaybackManager
from .storage import TonieESPStorage

_LOGGER = logging.getLogger(__name__)


class TonieESPCoordinator:
    """Coordinates integration-wide managers and shared state."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the central coordinator."""
        self.hass = hass
        self.storage = TonieESPStorage(hass)
        self.ma_adapter = MusicAssistantAdapter(hass)
        self.nfc_manager = NFCManager(hass, self.storage)
        self.playback_manager = PlaybackManager(hass, self.storage, self.ma_adapter)
        self.device_manager = TonieBoxDeviceManager(
            hass=hass,
            nfc_manager=self.nfc_manager,
            playback_manager=self.playback_manager,
            ma_adapter=self.ma_adapter,
        )
        self.event_handler = TonieESPEventHandler(
            hass=hass,
            device_manager=self.device_manager,
        )

    async def async_setup(self) -> None:
        """Initialize stores and register event bus handlers."""
        _LOGGER.debug("Setting up central TonieESP coordinator")
        await self.nfc_manager.async_load()
        await self.playback_manager.async_load()
        self.event_handler.async_setup()

    async def async_unload(self) -> None:
        """Unload and clean up integration-wide resources."""
        _LOGGER.debug("Unloading central TonieESP coordinator")
        self.event_handler.async_unload()
        self.nfc_manager.stop_learning_mode()
