"""Pytest fixtures for TonieESP testing."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant, State

from custom_components.tonieesp.const import (
    DOMAIN,
)


class MockDeviceRegistry:
    """Mock Device Registry."""

    def __init__(self) -> None:
        self.devices: dict[str, Any] = {}

    def async_get(self, device_id: str) -> Any | None:
        return self.devices.get(device_id)


class MockEntityRegistry:
    """Mock Entity Registry."""

    def __init__(self) -> None:
        self.entities: dict[str, Any] = {}

    def async_get(self, entity_id: str) -> Any | None:
        return self.entities.get(entity_id)


@pytest.fixture
def hass() -> HomeAssistant:
    """Create a mock Home Assistant instance."""
    mock_hass = MagicMock(spec=HomeAssistant)
    mock_hass.data = {DOMAIN: {}}
    mock_hass.config = MagicMock()
    mock_hass.config.components = ["frontend", "http", "media_player"]
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    mock_hass.loop = loop

    # States
    _states: dict[str, State] = {}

    def get_state(entity_id: str) -> State | None:
        return _states.get(entity_id)

    def set_state(entity_id: str, state: str, attributes: dict | None = None) -> None:
        _states[entity_id] = State(
            entity_id=entity_id,
            state=state,
            attributes=attributes or {},
            last_updated=datetime.now(UTC),
        )

    def async_all_states(domain: str | None = None) -> list[State]:
        if domain:
            return [s for s in _states.values() if s.entity_id.startswith(f"{domain}.")]
        return list(_states.values())

    mock_hass.states = MagicMock()
    mock_hass.states.get = MagicMock(side_effect=get_state)
    mock_hass.states.set = MagicMock(side_effect=set_state)
    mock_hass.states.async_all = MagicMock(side_effect=async_all_states)

    # Bus & Listeners
    _listeners: dict[str, list[Any]] = {}

    def async_listen(event_type: str, action: Any) -> Any:
        _listeners.setdefault(event_type, []).append(action)

        def unsub() -> None:
            if action in _listeners.get(event_type, []):
                _listeners[event_type].remove(action)

        return unsub

    async def async_fire(event_type: str, event_data: dict[str, Any] | None = None) -> None:
        event = MagicMock()
        event.event_type = event_type
        event.data = event_data or {}
        for listener in list(_listeners.get(event_type, [])):
            if asyncio.iscoroutinefunction(listener):
                await listener(event)
            else:
                listener(event)

    mock_hass.bus = MagicMock()
    mock_hass.bus.async_listen = MagicMock(side_effect=async_listen)
    mock_hass.bus.async_fire = MagicMock(side_effect=async_fire)

    # Services
    mock_hass.services = MagicMock()
    mock_hass.services._services = {}

    def has_service(domain: str, service: str) -> bool:
        return service in mock_hass.services._services.get(domain, {})

    async def async_call(
        domain: str,
        service: str,
        service_data: dict[str, Any] | None = None,
        target: dict[str, Any] | None = None,
        blocking: bool = True,
    ) -> None:
        handler = mock_hass.services._services.get(domain, {}).get(service)
        if handler:
            if asyncio.iscoroutinefunction(handler):
                await handler(domain, service, service_data, target)
            else:
                handler(domain, service, service_data, target)

    mock_hass.services.has_service = MagicMock(side_effect=has_service)
    mock_hass.services.async_call = MagicMock(side_effect=async_call)

    # async_create_task helper
    def async_create_task(coro: Any) -> asyncio.Task:
        return asyncio.create_task(coro)

    mock_hass.async_create_task = MagicMock(side_effect=async_create_task)

    return mock_hass


@pytest.fixture
def mock_device_reg() -> MockDeviceRegistry:
    """Mock device registry fixture."""
    return MockDeviceRegistry()


@pytest.fixture
def mock_entity_reg() -> MockEntityRegistry:
    """Mock entity registry fixture."""
    return MockEntityRegistry()
