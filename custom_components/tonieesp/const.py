"""Constants for the TonieESP integration."""

from __future__ import annotations

DOMAIN = "tonieesp"

# Storage
STORAGE_KEY_TAGS = "tonieesp.tags"
STORAGE_VERSION_TAGS = 1
STORAGE_KEY_SESSIONS = "tonieesp.sessions"
STORAGE_VERSION_SESSIONS = 1

# Configuration keys
CONF_ESPHOME_DEVICE_ID = "esphome_device_id"
CONF_NAME = "name"
CONF_MEDIA_PLAYER_ENTITY = "media_player_entity"
CONF_MUSIC_ASSISTANT_PLAYER = "music_assistant_player"
CONF_NFC_SENSOR_ENTITY = "nfc_sensor_entity"
CONF_PING_BINARY_SENSOR = "ping_binary_sensor"
CONF_PAUSE_ON_REMOVAL = "pause_on_removal"
CONF_RESUME_ON_REPLACE = "resume_on_replace"
CONF_MAX_VOLUME = "max_volume"
CONF_SEEK_STEP = "seek_step"
CONF_GESTURES_ENABLED = "gestures_enabled"
CONF_LEFT_TAP_ACTION = "left_tap_action"
CONF_RIGHT_TAP_ACTION = "right_tap_action"
CONF_LEFT_TILT_ACTION = "left_tilt_action"
CONF_RIGHT_TILT_ACTION = "right_tilt_action"

# Gesture actions
ACTION_PREVIOUS_TRACK = "previous_track"
ACTION_NEXT_TRACK = "next_track"
ACTION_SEEK_BACKWARD = "seek_backward"
ACTION_SEEK_FORWARD = "seek_forward"
ACTION_PLAY_PAUSE = "play_pause"
ACTION_VOLUME_UP = "volume_up"
ACTION_VOLUME_DOWN = "volume_down"
ACTION_NONE = "none"

# Default configuration values
DEFAULT_PAUSE_ON_REMOVAL = True
DEFAULT_RESUME_ON_REPLACE = True
DEFAULT_MAX_VOLUME = 0.80
DEFAULT_SEEK_STEP = 10  # seconds
DEFAULT_GESTURES_ENABLED = True
DEFAULT_LEFT_TAP_ACTION = ACTION_PREVIOUS_TRACK
DEFAULT_RIGHT_TAP_ACTION = ACTION_NEXT_TRACK
DEFAULT_LEFT_TILT_ACTION = ACTION_SEEK_BACKWARD
DEFAULT_RIGHT_TILT_ACTION = ACTION_SEEK_FORWARD

# Events from ESPHome / Home Assistant
EVENT_TAG_SCANNED = "tag_scanned"
EVENT_ESPHOME_TAP = "esphome.tonie_tap"
EVENT_ESPHOME_TILT = "esphome.tonie_tilt"

# Media providers & types
PROVIDER_MUSIC_ASSISTANT = "music_assistant"
PROVIDER_MEDIA_SOURCE = "media_source"

MEDIA_TYPE_PLAYLIST = "playlist"
MEDIA_TYPE_ALBUM = "album"
MEDIA_TYPE_TRACK = "track"
MEDIA_TYPE_AUDIOBOOK = "audiobook"
MEDIA_TYPE_RADIO = "radio"
MEDIA_TYPE_PODCAST = "podcast"

SUPPORTED_MEDIA_TYPES = [
    MEDIA_TYPE_PLAYLIST,
    MEDIA_TYPE_ALBUM,
    MEDIA_TYPE_TRACK,
    MEDIA_TYPE_AUDIOBOOK,
    MEDIA_TYPE_RADIO,
    MEDIA_TYPE_PODCAST,
]

# Frontend panel
FRONTEND_URL_PATH = "tonieesp"
FRONTEND_TITLE = "TonieESP"
FRONTEND_ICON = "mdi:music-box"
FRONTEND_STATIC_PATH = "/tonieesp_static"
FRONTEND_PANEL_JS = "tonieesp-panel.js"
FRONTEND_VERSION = "1.0.4"

# WebSocket API Types
WS_TYPE_BOXES_LIST = "tonieesp/boxes/list"
WS_TYPE_BOXES_UPDATE = "tonieesp/boxes/update"
WS_TYPE_TAGS_LIST = "tonieesp/tags/list"
WS_TYPE_TAGS_GET = "tonieesp/tags/get"
WS_TYPE_TAGS_SAVE = "tonieesp/tags/save"
WS_TYPE_TAGS_DELETE = "tonieesp/tags/delete"
WS_TYPE_TAGS_IMPORT = "tonieesp/tags/import"
WS_TYPE_TAGS_EXPORT = "tonieesp/tags/export"
WS_TYPE_TAGS_LEARN_START = "tonieesp/tags/learn_start"
WS_TYPE_TAGS_LEARN_STOP = "tonieesp/tags/learn_stop"
WS_TYPE_MEDIA_SEARCH = "tonieesp/media/search"
WS_TYPE_PLAYBACK_CONTROL = "tonieesp/playback/control"
WS_TYPE_EVENTS_SUBSCRIBE = "tonieesp/events/subscribe"
WS_TYPE_DIAGNOSTICS = "tonieesp/diagnostics"

# Internal event signals
SIGNAL_TONIEESP_EVENT = "tonieesp_event"
