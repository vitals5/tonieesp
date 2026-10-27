# TonieESP 📻

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![GitHub Release](https://img.shields.io/github/v/release/vitals5/tonieesp)](https://github.com/vitals5/tonieesp/releases)
[![CI Tests](https://github.com/vitals5/tonieesp/actions/workflows/test.yml/badge.svg)](https://github.com/vitals5/tonieesp/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**TonieESP** ist eine übergeordnete Home-Assistant-Custom-Integration mit eigenem grafischen Seitenpanel, zentraler NFC-Figurenverwaltung und nativer Music-Assistant-Anbindung für ESPHome-basierte Tonieboxen (basierend auf der Firmware von [chunckus-aurelius/TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome)).

---

## 🎯 Motivation & Architektur

ESPHome steuert die Hardware (NFC-Transceiver, DAC/Lautsprecher, LIS3DH-Beschleunigungssensor, Tasten, Akku). TonieESP ist **keine** zweite ESPHome-Integration, sondern die übergeordnete Verwaltungsschicht:

```
                      ┌──────────────────────────────────────┐
                      │        Home Assistant Core           │
                      └──────────────────┬───────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │                                           │
       ┌───────────▼───────────┐                   ┌───────────▼───────────┐
       │   ESPHome Integration │                   │    Music Assistant    │
       │ (Hardware, Sensoren,  │                   │  (Streaming, Queues,  │
       │  tag_scanned, Gesten) │                   │   Katalog, Provider)  │
       └───────────▲───────────┘                   └───────────▲───────────┘
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                            ┌────────────▼────────────┐
                            │        TonieESP         │
                            │  (Zentrale Verwaltung,  │
                            │   NFC-Bibliothek,       │
                            │   Resume & Gesten,      │
                            │   Lit-Seitenpanel)      │
                            └─────────────────────────┘
```

### Die wesentliche Trennung
- **Gerätebezogen (Config Entry):** Jede Toniebox besitzt eine eigene Instanz, eigene Lautstärkebegrenzung, Gestenzuordnung und Wiedergabestatus.
- **Global zentral (`.storage/tonieesp.tags`):** Alle NFC-Figuren (UID, Name, Bild, Playlist, Resume-Optionen) werden integrationsweit gespeichert. Eine Figur muss nur **einmal** eingerichtet werden und funktioniert sofort auf allen Boxen im Haushalt.
- **Geräte-Overrides:** Optional kann dieselbe Figur im Kinderzimmer ein Hörspiel und im Wohnzimmer eine Musik-Playlist starten.
- **Zentraler Wiedergabefortschritt:** Ein Hörbuch kann im Kinderzimmer pausiert und später im Wohnzimmer an derselben Stelle fortgesetzt werden.

---

## ✨ Hauptfunktionen

- 📻 **Multi-Box-Unterstützung:** Verwalte beliebig viele Tonieboxen unabhängig voneinander.
- 🧸 **Zentrale NFC-Bibliothek:** Globale Verwaltung aller Figuren mit Suche, Filterung, Cover-Bildern und JSON-Import/Export.
- ⏱ **Intelligente Resume-Logik:**
  - *Kurzzeit-Pause:* Figur wird abgenommen ➔ Toniebox pausiert. Figur wird wieder aufgesetzt ➔ Wiedergabe setzt nahtlos fort.
  - *Hörbuch-Fortschritt:* Merkt sich die Position langfristig im persistenten Speicher – auch über mehrere Tage und boxübergreifend.
- ⚡ **Scan-Lernmodus:** Klicke im Panel auf „Figur scannen“, stelle eine Figur auf eine beliebige Toniebox und die UID wird automatisch übernommen.
- 🎛 **Gesten-Steuerung:** Konfigurierbare Aktionen für Klopfer (links/rechts) und Neigen (Vorspulen/Zurückspulen mit relativer Zeitkorrektur).
- 🔍 **Music-Assistant-Browser:** Durchsuche Playlists, Alben, Hörbücher, Titel und Radiosender direkt im Panel.
- 🛡 **Robuste Entitätsauflösung:** Arbeitet mit stabilen Geräte-IDs der Device & Entity Registry. Benutzer können Entitäten in HA jederzeit umbenennen, ohne dass Verknüpfungen abbrechen.
- 🎨 **Reaktives Lit-Webpanel:** Vollständig lokal ohne externe CDN-Abhängigkeiten, unterstützt Home-Assistant-Themes (Dark/Light Mode) und mobile Bildschirme.

---

## 🚀 Installation

### Option 1: HACS (Empfohlen)

1. Öffne **HACS** in Home Assistant.
2. Gehe auf **Integrationen** ➔ Drei Punkte oben rechts ➔ **Benutzerdefinierte Repositories**.
3. Gib die URL ein: `https://github.com/vitals5/tonieesp`
4. Kategorie: **Integration**.
5. Klicke auf **Installieren** und starte Home Assistant neu.

### Option 2: Manuell

1. Lade das Release-Archiv `tonieesp.zip` herunter.
2. Entpacke den Ordner `custom_components/tonieesp` in dein Home-Assistant-Verzeichnis unter `<config>/custom_components/tonieesp`.
3. Starte Home Assistant neu.

---

## ⚙️ Einrichtung

1. Stelle sicher, dass deine Toniebox über ESPHome in Home Assistant eingebunden ist.
2. Gehe in Home Assistant zu **Einstellungen** ➔ **Geräte & Dienste** ➔ **Integration hinzufügen**.
3. Suche nach **TonieESP**.
4. Wähle deine ESPHome-Toniebox aus der Liste aus und vergib optional einen benutzerfreundlichen Namen.
5. In der linken Home-Assistant-Seitenleiste erscheint sofort das **TonieESP**-Panel!

---

## 📋 Kompatibilität mit der Firmware

TonieESP ist zu **100% kompatibel** mit der Firmware von [chunckus-aurelius/TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome). Es sind **keine Änderungen am ESPHome-YAML oder am Code der Box notwendig**:

| Firmware-Ereignis | TonieESP-Verarbeitung |
| :--- | :--- |
| `tag_scanned` | Identifiziert Box und normalisierte UID (16 Hex-Zeichen), startet zugeordnetes Medium. |
| `sensor.*_nfc_tag_uid` ➔ `"none"` | Erkennt das Abheben der Figur und pausiert die Wiedergabe mit Positions-Snapshot. |
| `esphome.tonie_tap` | Filtert Achse `y` (Seitenschlag); `side: pos` (links) ➔ Zurück, `side: neg` (rechts) ➔ Weiter. |
| `esphome.tonie_tilt` | `side: pos` ➔ Zurückspulen (-10s), `side: neg` ➔ Vorspulen (+10s). |

---

## 🖥️ Web-Seitenpanel

Das Panel bietet sieben dedizierte Ansichten:

1. **Dashboard:** Live-Kacheln aller Boxen mit Online-Status, Batterie %, Ladeanzeige, aktueller Figur, Cover-Art, Titel und Lautstärkeregler.
2. **NFC-Figuren:** Bibliotheksansicht aller Tags mit Suchleiste, Typ-Filtern (Playlist, Album, Hörbuch, Radio) und „Auf Box abspielen“-Schnellstart.
3. **Figuren-Editor:** Bearbeite Namen, Cover-URLs, Medien-IDs, Resume- und Shuffle-Optionen sowie gerätespezifische Overrides.
4. **Scan-Lernmodus:** Erkennt neu aufgesetzte Figuren live und öffnet direkt das Einrichtungsformular.
5. **Music-Assistant-Mediathek:** Durchsuche den Music-Assistant-Katalog und übernimm Alben oder Playlists mit einem Klick.
6. **Einstellungen & Backups:** JSON-Export und Import deiner gesamten Figurensammlung.
7. **Diagnose & Logs:** Echtzeit-Ereignisstrom für Scans, Gesten und Statusänderungen.

---

## 🛠 Entwicklung & Tests

Das Repository enthält eine vollständige Test-Suite mit `pytest`:

```bash
# Virtuelle Umgebung erstellen
uv venv
source .venv/bin/activate

# Abhängigkeiten installieren
uv pip install pytest pytest-asyncio pytest-cov ruff homeassistant

# Tests ausführen
pytest tests -v --cov=custom_components.tonieesp

# Frontend bauen
cd frontend
npm install
npm run build
```

---

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.
Attribution: Basiert auf Erkenntnissen und Schnittstellen des Projekts [TonieBox-ESPhome](https://github.com/chunckus-aurelius/TonieBox-ESPhome) von `@chunckus-aurelius`.
