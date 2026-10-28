"""Tests for Playback Session and Resume Manager."""

from __future__ import annotations

import time
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.tonieesp.playback_manager import PlaybackManager, PlaybackSession


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
async def test_box_isolated_playback_progress(hass, mock_storage, mock_ma_adapter):
    """Test playback progress is strictly isolated per box."""
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

    # Verify session saved in persistent store for box_kinderzimmer
    assert mock_storage.async_save_sessions.called
    saved_kz = pm.get_session_for_box_and_tag("box_kinderzimmer", "TAG_BOOK")
    assert saved_kz is not None
    assert saved_kz.position == 320.0

    # 3. Take figure to Box 2 (Wohnzimmer) - Belongs to second child, should start fresh
    await pm.async_handle_tag_placed(
        "box_wohnzimmer", "media_player.wz", "TAG_BOOK", media, settings
    )
    # Box 2 starts fresh, resume_position is None
    assert mock_ma_adapter.async_play_media.call_args[1].get("resume_position") is None

    # 4. Lift from Box 2 after playing to 45s
    mock_ma_adapter.get_player_state.return_value = {
        "state": "playing",
        "position": 45.0,
        "duration": 1800.0,
    }
    await pm.async_handle_tag_removed("box_wohnzimmer", "media_player.wz", pause_on_removal=True)

    # 5. Place figure back on Box 1 - Continues at its own 320s!
    pm._last_scan["box_kinderzimmer"] = ("TAG_BOOK", time.time() - 3.0)
    await pm.async_handle_tag_placed(
        "box_kinderzimmer", "media_player.kz", "TAG_BOOK", media, settings
    )
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] == 320.0


@pytest.mark.asyncio
async def test_playback_shuffle_passes_settings_and_starts_fresh(
    hass, mock_storage, mock_ma_adapter
):
    """Test tags with shuffle=True pass shuffle=True and start whole playlist fresh without saved track resume."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "playlist_hits", "media_type": "playlist"}
    settings = {"shuffle": True, "repeat": "all", "resume": True}

    # Simulate a prior persistent session
    pm._persistent_sessions["box_1_TAG_SHUFFLE"] = PlaybackSession(
        box_id="box_1",
        tag_uid="TAG_SHUFFLE",
        media_source="music_assistant",
        media_type="playlist",
        media_id="playlist_hits",
        queue_item_id=None,
        position=89.0,
        duration=3000.0,
        updated_at=time.time() - 500.0,
        was_paused_by_removal=False,
        completed=False,
        track_title="Old Single Track",
        track_uri="spotify://track/old_single_track",
    )

    # Place tag on box
    await pm.async_handle_tag_placed("box_1", "media_player.box_1", "TAG_SHUFFLE", media, settings)

    call_kwargs = mock_ma_adapter.async_play_media.call_args[1]
    # Shuffle & repeat passed
    assert call_kwargs["shuffle"] is True
    assert call_kwargs["repeat"] == "all"
    # Starting whole playlist fresh, not locked into the old track
    assert call_kwargs["resume_position"] is None
    assert call_kwargs["track_uri"] is None


@pytest.mark.asyncio
async def test_resume_disabled_starts_from_beginning_even_if_paused(
    hass, mock_storage, mock_ma_adapter
):
    """Test when resume=False, tag placement always starts from beginning and never unpauses or resumes."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "album_stories", "media_type": "album"}
    settings = {"resume": False, "shuffle": False}

    # 1. Place tag first time
    await pm.async_handle_tag_placed(
        "box_1", "media_player.box_1", "TAG_NO_RESUME", media, settings
    )
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] is None

    # 2. Tag is removed, player paused at 120s
    mock_ma_adapter.get_player_state.return_value = {
        "state": "paused",
        "position": 120.0,
        "duration": 500.0,
    }
    await pm.async_handle_tag_removed("box_1", "media_player.box_1", pause_on_removal=True)

    # 3. Tag placed back on box within short term window
    pm._last_scan["box_1"] = ("TAG_NO_RESUME", time.time() - 3.0)
    await pm.async_handle_tag_placed(
        "box_1", "media_player.box_1", "TAG_NO_RESUME", media, settings
    )

    # Must NOT call async_resume!
    assert not mock_ma_adapter.async_resume.called
    # Must call async_play_media with resume_position=None (start from beginning)
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] is None
    assert mock_ma_adapter.async_play_media.call_args[1]["track_uri"] is None


@pytest.mark.asyncio
async def test_shuffle_enabled_never_resumes_paused_player(hass, mock_storage, mock_ma_adapter):
    """Test when shuffle=True, tag placement always starts fresh random track and never unpauses."""
    pm = PlaybackManager(hass, mock_storage, mock_ma_adapter)
    await pm.async_load()

    media = {"media_id": "playlist_kids", "media_type": "playlist"}
    settings = {"resume": True, "shuffle": True}

    # 1. Place tag first time
    await pm.async_handle_tag_placed(
        "box_1", "media_player.box_1", "TAG_SHUFFLE_2", media, settings
    )
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] is None

    # 2. Tag is removed, player paused at 75s
    mock_ma_adapter.get_player_state.return_value = {
        "state": "paused",
        "position": 75.0,
        "duration": 200.0,
    }
    await pm.async_handle_tag_removed("box_1", "media_player.box_1", pause_on_removal=True)

    # 3. Tag placed back on box
    pm._last_scan["box_1"] = ("TAG_SHUFFLE_2", time.time() - 3.0)
    await pm.async_handle_tag_placed(
        "box_1", "media_player.box_1", "TAG_SHUFFLE_2", media, settings
    )

    # Must NOT unpause!
    assert not mock_ma_adapter.async_resume.called
    # Must call async_play_media fresh with shuffle=True
    assert mock_ma_adapter.async_play_media.call_args[1]["resume_position"] is None
    assert mock_ma_adapter.async_play_media.call_args[1]["shuffle"] is True
