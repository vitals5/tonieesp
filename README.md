<p align="center">
  <img src="images/logo.png" alt="TonieESP" width="460">
</p>

# TonieESP 📻

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![GitHub Release](https://img.shields.io/github/v/release/vitals5/tonieesp)](https://github.com/vitals5/tonieesp/releases)
[![CI Tests](https://github.com/vitals5/tonieesp/actions/workflows/test.yml/badge.svg)](https://github.com/vitals5/tonieesp/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**TonieESP** is an overarching Home Assistant custom integration featuring a dedicated sidepanel, global NFC figure management, and native [Music Assistant](https://music-assistant.io/) integration for ESPHome-based Tonieboxes (based on the firmware by [chunckus-aurelius/TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome)).

---

## 🎯 Motivation & Architecture

ESPHome manages hardware drivers (NFC transceiver, DAC/speaker, LIS3DH accelerometer, ear buttons, and battery monitoring). TonieESP is **not** a redundant ESPHome integration; it serves as the supervisory orchestration and management layer that seamlessly binds ESPHome, Home Assistant, and Music Assistant together:

```
                      ┌──────────────────────────────────────┐
                      │        Home Assistant Core           │
                      └──────────────────┬───────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │                                           │
       ┌───────────▼───────────┐                   ┌───────────▼───────────┐
       │   ESPHome Integration │                   │    Music Assistant    │
       │ (Hardware, Sensors,   │                   │ (Streaming, Queues,   │
       │  tag_scanned, Gestures│                   │  Catalog, Providers)  │
       └───────────▲───────────┘                   └───────────▲───────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                            ┌────────────▼────────────┐
                            │        TonieESP         │
                            │  (Central Management,   │
                            │   Global NFC Library,   │
                            │   Resume & Gestures,    │
                            │   Lit Web Sidepanel)    │
                            └─────────────────────────┘
```

### Key Architectural Separation

- **Device-Specific (`ConfigEntry`):** Each Toniebox has its own entry, volume ceiling, gesture mappings, and independent playback state.
- **Global NFC Management (`.storage/tonieesp.tags`):** All NFC figures (UID, friendly name, cover artwork, media item, and resume preferences) are stored integration-wide. A figure is configured once and works immediately across every Toniebox in your home.
- **Device-Specific Overrides:** Optionally assign custom playlists to specific boxes (e.g. playing bedtime lullabies in the nursery and energetic children's songs in the living room using the same physical figure).
- **Synchronized Playback Progress:** Audiobook progress is tracked persistently, allowing a child to pause a story in one room and continue at the exact second on a different Toniebox.

---

## ✨ Features

- 📻 **Multi-Box Fleet Management:** Manage multiple Tonieboxes independently with real-time status tracking.
- 🧸 **Centralized NFC Tag Library:** Comprehensive catalog with instant search, media type filters (playlists, albums, audiobooks, tracks, radio stations), and JSON backup export/import.
- ⏱ **Intelligent Resume Engine:**
  - *Short-term removal:* Removing a figure pauses playback instantly; placing it back resumes without delay.
  - *Long-term audiobook memory:* Persists playback position across days, restarts, and across different Tonieboxes.
- ⚡ **Scan Learning Mode:** Click "Scan to Learn", place any figure on any Toniebox, and the UID is automatically captured and opened in the tag editor.
- 🎛 **Gesture Controls:** Full mapping for side taps (left/right ear) and tilt gestures (smooth relative forward/rewind seeking).
- 🔍 **Integrated Media Browser:** Search Music Assistant directly from the sidepanel and assign albums or playlists with a single click.
- 🌐 **Multi-Language Support:** Fully localized in English and German with automatic language detection and a header toggle switch.
- 🛡 **Stable Registry Resolution:** Uses persistent Device Registry IDs rather than brittle entity naming conventions. Entities can be renamed freely in Home Assistant without breaking links.
- 🎨 **Responsive Lit Sidepanel:** Zero CDN dependencies, natively supports Home Assistant Light/Dark modes and mobile viewports.

---

## 🚀 Installation

### Option 1: HACS (Recommended)

Click the button below to add the repository directly to your Home Assistant instance:

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=vitals5&repository=tonieesp&category=integration)

Or add it manually in HACS:

1. Open **HACS** in your Home Assistant sidebar.
2. Click the three dots in the top right corner and select **Custom repositories**.
3. Enter repository URL: `https://github.com/vitals5/tonieesp`
4. Select category: **Integration**.
5. Click **Add**, find **TonieESP** in the list, and click **Download**.
6. Restart Home Assistant.

### Option 2: Manual Installation

1. Download the latest release from the [Releases](https://github.com/vitals5/tonieesp/releases) page.
2. Copy the `custom_components/tonieesp` folder into your Home Assistant directory under `<config>/custom_components/tonieesp`.
3. Restart Home Assistant.

---

## ⚙️ Initial Setup

1. Verify that your Toniebox is online and connected via the **ESPHome** integration in Home Assistant.
2. In Home Assistant, navigate to **Settings** ➔ **Devices & Services** ➔ **Add Integration**.
3. Search for **TonieESP**.
4. The setup dialog features **live search with pre-filtered ESPHome devices**. Select your Toniebox from the dropdown and click submit.
5. The **TonieESP** sidepanel will immediately appear in your Home Assistant sidebar!

---

## 📋 Firmware Compatibility

TonieESP is **100% plug-and-play compatible** with the open-source firmware by [chunckus-aurelius/TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome). **No modifications to your ESPHome configuration or box firmware are required**:

| Firmware Event / Entity | TonieESP Handling |
| :--- | :--- |
| `tag_scanned` | Identifies box and normalized 16-hex UID; starts mapped media via Music Assistant. |
| `sensor.*_nfc_tag_uid` ➔ `"none"` | Reliably detects figure removal and pauses playback with position snapshot. |
| `esphome.tonie_tap` | Filters axis `y`; `side: pos` (left ear) ➔ previous track, `side: neg` (right ear) ➔ next track. |
| `esphome.tonie_tilt` | Filters axis `x`; `side: pos` ➔ rewind (-10s), `side: neg` ➔ fast-forward (+10s). |

---

## 🖥️ Web Sidepanel Views

The custom Lit web component provides 7 dedicated management views:

1. **Dashboard:** Live cards for all configured Tonieboxes with battery level, charging indicators, placed figure artwork, now-playing title, and volume slider.
2. **NFC Tags:** Global library with search-as-you-type, filter chips, and "Play on Box" quick controls.
3. **Tag Editor:** Configure figure metadata, cover images, Music Assistant URI, resume behavior, and device-specific overrides.
4. **Scan Learning:** Modal dialog that captures new tags directly when placed onto any box.
5. **Media Library:** Direct catalog search against Music Assistant for quick assignment.
6. **Settings & Backup:** Download and upload JSON snapshots of your entire tag collection.
7. **Diagnostics & Logs:** Live event feed for scans, gestures, and playback changes.

---

## 🛠 Development & Testing

This project includes a comprehensive `pytest` test suite:

```bash
# Create and activate virtual environment
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install pytest pytest-asyncio pytest-cov ruff homeassistant

# Run tests
pytest tests -v --cov=custom_components.tonieesp

# Run code style checks
ruff check custom_components/tonieesp tests

# Build frontend
cd frontend
npm install
npm run typecheck
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Attribution: Built upon architectural insights and protocols from [TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome) by `@chunckus-aurelius`.
