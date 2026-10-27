"""Tests for Playback Session and Resume Manager."""

from __future__ import annotations

import time
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.tonieesp.playback_manager import PlaybackManager


@pytest.fixture
def mock_storage():
    """Mock storage fixture."""
    storage = MagicMock()
    storage.async_load_sessions = AsyncMock(return_value={"schema_version": 1, "sessions": {}})
    storage.async_save_sessions = AsyncMock()
    return storage


@pytest.fixture
def mock_ma_adapter():
    """Mock Music Assistant adapter fixture."""
    adapter = MagicMock()
    adapter.async_play_media = AsyncMock()
    adapter.async_pause = AsyncMock()
    adapter.get_player_state = MagicMock(
        return_value={
            "state": "playing",
            "position": 145.0,
            "duration": 600.0,
        }
    )
    return adapter


@pytest.mark.asyncio
async def test_playback_debounce(hass, mock_storage, mock_ma_adapter):
    """Test duplicate scans within debounce interval are suppressed."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "test_playlist", "media_type": "playlist"}
    settings = {"resume": True}

    # First scan
    await pm.async_handle_tag_placed("box_1", "media_player.box_1", "TAG_1", media, settings)
    assert mock_ma_adapter.async_play_media.call_count == 1

    # Second scan immediately afterwards (same tag, same box)
    await pm.async_handle_tag_placed("box_1", "media_player.box_1", "TAG_1", media, settings)
    # Still 1 call!
    assert mock_ma_adapter.async_play_media.call_count == 1


@pytest.mark.asyncio
async def test_short_term_resume_on_same_box(hass, mock_storage, mock_ma_adapter):
    """Test lifting a tag pauses and placing it back resumes at position."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "audiobook_1", "media_type": "audiobook"}
    settings = {"resume": True}

    # 1. Place tag
    await pm.async_handle_tag_placed("box_1", "media_player.box_1", "TAG_A", media, settings)
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] is None

    # 2. Lift tag (player reports position 145.0)
    mock_ma_adapter.get_player_state.return_value = {
        "state": "playing",
        "position": 145.0,
        "duration": 600.0,
    }
    await pm.async_handle_tag_removed("box_1", "media_player.box_1", pause_on_removal=True)
    assert mock_ma_adapter.async_pause.called

    # 3. Place tag back on box_1 (force elapsed time past debounce interval)
    pm._last_scan["box_1"] = ("TAG_A", time.time() - 3.0)
    await pm.async_handle_tag_placed("box_1", "media_player.box_1", "TAG_A", media, settings)

    # Resumed at 145.0s!
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] == 145.0


@pytest.mark.asyncio
async def test_central_audiobook_progress_across_boxes(hass, mock_storage, mock_ma_adapter):
    """Test central playback progress allows continuing an audiobook on another box."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "audiobook_long", "media_type": "audiobook"}
    settings = {"resume": True}

    # 1. Start on Box 1 (Kinderzimmer)
    await pm.async_handle_tag_placed(
        "box_kinderzimmer", "media_player.kz", "TAG_BOOK", media, settings
    )

    # 2. Lift from Box 1 after playing to 320s
    mock_ma_adapter.get_player_state.return_value = {
        "state": "playing",
        "position": 320.0,
        "duration": 1800.0,
    }
    await pm.async_handle_tag_removed("box_kinderzimmer", "media_player.kz", pause_on_removal=True)

    # Verify session saved in persistent store
    assert mock_storage.async_save_sessions.called
    saved = pm.get_session_for_tag("TAG_BOOK")
    assert saved is not None
    assert saved.position == 320.0

    # 3. Take figure to Box 2 (Wohnzimmer)
    await pm.async_handle_tag_placed(
        "box_wohnzimmer", "media_player.wz", "TAG_BOOK", media, settings
    )

    # Box 2 resumes at 320.0s!
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] == 320.0
