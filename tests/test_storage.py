"""Tests for Storage Migration and Persistence."""

from __future__ import annotations

from unittest.mock import patch

import pytest

from custom_components.tonieesp.storage import TonieESPStorage


@pytest.mark.asyncio
async def test_storage_load_and_save(hass):
    """Test loading and saving tags and sessions."""
    with (
        patch("homeassistant.helpers.storage.Store.async_load") as mock_load,
        patch("homeassistant.helpers.storage.Store.async_save") as mock_save,
    ):
        # 1. First run, empty store
        mock_load.return_value = None
        storage = TonieESPStorage(hass)

        tags_data = await storage.async_load_tags()
        assert tags_data["schema_version"] == 1
        assert tags_data["tags"] == {}

        sessions_data = await storage.async_load_sessions()
        assert sessions_data["schema_version"] == 1
        assert sessions_data["sessions"] == {}

        # 2. Save data
        await storage.async_save_tags({"tags": {"TAG_1": {"name": "Test"}}})
        assert mock_save.called
