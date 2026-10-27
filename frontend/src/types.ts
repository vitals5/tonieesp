/**
 * Data structures for TonieESP frontend
 */

export interface BatteryInfo {
  level: number | null;
  voltage: number | null;
  charging: boolean;
}

export interface PlaybackState {
  entity_id: string;
  state: "playing" | "paused" | "idle" | "off" | "offline" | string;
  volume_level: number;
  title: string;
  artist: string;
  album: string;
  image: string;
  position: number;
  duration: number;
}

export interface BoxSettings {
  pause_on_removal: boolean;
  resume_on_replace: boolean;
  max_volume: number;
  seek_step: number;
  gestures_enabled: boolean;
  left_tap_action: string;
  right_tap_action: string;
  left_tilt_action: string;
  right_tilt_action: string;
}

export interface TagShortInfo {
  uid: string;
  name?: string;
  image?: string;
  media_title?: string;
}

export interface TonieBox {
  id: string;
  name: string;
  esphome_device_id: string;
  online: boolean;
  battery: BatteryInfo;
  current_tag: string | null;
  current_tag_info: TagShortInfo | null;
  unknown_tag: string | null;
  entities: Record<string, string | null>;
  playback: PlaybackState;
  settings: BoxSettings;
  hardware_tuning?: {
    tap_threshold: number | null;
    tap_time_limit: number | null;
  };
}

export interface MediaSettings {
  provider: "music_assistant" | "media_source" | string;
  media_type: "playlist" | "album" | "track" | "audiobook" | "radio" | string;
  media_id: string;
  title?: string;
  artist?: string;
}

export interface TagSettings {
  shuffle: boolean;
  repeat: "off" | "one" | "all" | string;
  resume: boolean;
  volume_limit?: number | null;
}

export interface DeviceOverride {
  media?: Partial<MediaSettings>;
  media_id?: string;
  media_type?: string;
  settings?: Partial<TagSettings>;
}

export interface NFCTag {
  uid: string;
  name: string;
  description?: string;
  image?: string;
  media: MediaSettings;
  settings: TagSettings;
  overrides?: Record<string, DeviceOverride>;
  created_at?: string;
  updated_at?: string;
}

export interface MediaSearchResult {
  provider: string;
  media_type: string;
  media_id: string;
  title: string;
  artist?: string;
  image?: string;
}

export interface DiagnosticsData {
  box_count: number;
  tag_count: number;
  music_assistant_available: boolean;
  boxes: TonieBox[];
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  type: string;
  summary: string;
  details?: any;
}
