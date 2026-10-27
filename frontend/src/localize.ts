/**
 * Translation helper for TonieESP UI
 */

const translations: Record<string, Record<string, string>> = {
  de: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.tags": "NFC-Figuren",
    "nav.browser": "Mediathek",
    "nav.settings": "Einstellungen",
    "nav.logs": "Diagnose & Logs",

    // Dashboard
    "dashboard.title": "TonieESP Übersicht",
    "dashboard.subtitle": "Zentrale Verwaltung aller Tonieboxen",
    "dashboard.boxes_online": "{count} Box(en) online",
    "dashboard.no_boxes": "Keine Tonieboxen eingerichtet.",
    "dashboard.add_box_hint": "Füge in Home Assistant unter Einstellungen > Geräte eine Toniebox hinzu.",
    "dashboard.current_tag": "Aktuelle Figur:",
    "dashboard.no_tag": "Keine Figur aufgesetzt",
    "dashboard.unknown_tag_alert": "Unbekannte Figur erkannt!",
    "dashboard.setup_tag_btn": "Jetzt konfigurieren",
    "dashboard.volume": "Lautstärke",
    "dashboard.battery": "Batterie",
    "dashboard.charging": "Wird geladen",

    // Controls
    "control.play": "Abspielen",
    "control.pause": "Pausieren",
    "control.stop": "Stoppen",
    "control.prev": "Zurück",
    "control.next": "Weiter",
    "control.details": "Details & Einstellungen",

    // Tag Library
    "tags.title": "Globale NFC-Figuren-Bibliothek",
    "tags.search_placeholder": "Suche nach Name, UID oder Album...",
    "tags.filter_all": "Alle Typen",
    "tags.filter_playlist": "Playlists",
    "tags.filter_album": "Alben",
    "tags.filter_audiobook": "Hörbücher",
    "tags.filter_track": "Titel",
    "tags.filter_radio": "Radio",
    "tags.add_new": "+ Neue Figur",
    "tags.scan_learn": "Figur einscannen",
    "tags.play_on": "Abspielen auf...",
    "tags.edit": "Bearbeiten",
    "tags.delete": "Löschen",
    "tags.confirm_delete": "Soll diese Figur wirklich gelöscht werden?",
    "tags.empty": "Keine NFC-Figuren gefunden.",

    // Tag Editor
    "editor.title_new": "Neue NFC-Figur anlegen",
    "editor.title_edit": "NFC-Figur bearbeiten",
    "editor.uid": "NFC UID (16 Hex-Zeichen)",
    "editor.uid_hint": "Z.B. E004015023AABBCC",
    "editor.name": "Name der Figur",
    "editor.desc": "Beschreibung (optional)",
    "editor.image": "Cover-Bild URL (optional)",
    "editor.media_type": "Medientyp",
    "editor.media_id": "Music Assistant Medien-ID / URI",
    "editor.media_title": "Titel / Playlist-Name",
    "editor.browse_ma": "In Mediathek suchen...",
    "editor.settings": "Wiedergabeeinstellungen",
    "editor.resume": "Wiedergabefortschritt merken (Resume)",
    "editor.shuffle": "Zufallswiedergabe (Shuffle)",
    "editor.repeat": "Wiederholen",
    "editor.repeat_off": "Aus",
    "editor.repeat_one": "Aktuellen Titel wiederholen",
    "editor.repeat_all": "Ganze Playlist wiederholen",
    "editor.vol_limit": "Lautstärkebegrenzung (optional)",
    "editor.overrides_tab": "Gerätespezifische Overrides",
    "editor.overrides_hint": "Definiere abweichende Playlists für einzelne Tonieboxen.",
    "editor.save": "Speichern",
    "editor.cancel": "Abbrechen",

    // Scan Learning Modal
    "learn.title": "Scan-Lernmodus aktiv",
    "learn.instructions": "Stelle jetzt eine Figur auf eine deiner Tonieboxen. Die UID wird automatisch erfasst.",
    "learn.waiting": "Warte auf NFC-Scan...",
    "learn.captured": "Figur erkannt: {uid}!",
    "learn.cancel": "Abbrechen",

    // Settings
    "settings.title": "TonieESP Einstellungen",
    "settings.export": "NFC-Bibliothek exportieren (JSON)",
    "settings.export_desc": "Lade alle Figuren und Zuordnungen als Sicherung herunter.",
    "settings.export_btn": "Herunterladen",
    "settings.import": "NFC-Bibliothek importieren (JSON)",
    "settings.import_desc": "Stelle eine zuvor gesicherte Figuren-Bibliothek wieder her.",
    "settings.import_btn": "JSON hochladen",
    "settings.overwrite": "Vorhandene UIDs überschreiben",

    // Common
    "common.online": "Online",
    "common.offline": "Offline",
    "common.save_success": "Erfolgreich gespeichert!",
    "common.error": "Fehler aufgetreten: {error}",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.tags": "NFC Tags",
    "nav.browser": "Media Browser",
    "nav.settings": "Settings",
    "nav.logs": "Diagnostics & Logs",

    // Dashboard
    "dashboard.title": "TonieESP Overview",
    "dashboard.subtitle": "Central management for all Tonieboxes",
    "dashboard.boxes_online": "{count} box(es) online",
    "dashboard.no_boxes": "No Tonieboxes configured yet.",
    "dashboard.add_box_hint": "Go to Home Assistant Settings > Devices to add a Toniebox.",
    "dashboard.current_tag": "Current Tag:",
    "dashboard.no_tag": "No figure placed",
    "dashboard.unknown_tag_alert": "Unknown figure scanned!",
    "dashboard.setup_tag_btn": "Set up now",
    "dashboard.volume": "Volume",
    "dashboard.battery": "Battery",
    "dashboard.charging": "Charging",

    // Controls
    "control.play": "Play",
    "control.pause": "Pause",
    "control.stop": "Stop",
    "control.prev": "Previous",
    "control.next": "Next",
    "control.details": "Details & Settings",

    // Tag Library
    "tags.title": "Global NFC Tag Library",
    "tags.search_placeholder": "Search by name, UID or album...",
    "tags.filter_all": "All types",
    "tags.filter_playlist": "Playlists",
    "tags.filter_album": "Albums",
    "tags.filter_audiobook": "Audiobooks",
    "tags.filter_track": "Tracks",
    "tags.filter_radio": "Radio",
    "tags.add_new": "+ Add Tag",
    "tags.scan_learn": "Scan to Learn",
    "tags.play_on": "Play on...",
    "tags.edit": "Edit",
    "tags.delete": "Delete",
    "tags.confirm_delete": "Are you sure you want to delete this tag?",
    "tags.empty": "No NFC tags found.",

    // Tag Editor
    "editor.title_new": "Add New NFC Tag",
    "editor.title_edit": "Edit NFC Tag",
    "editor.uid": "NFC UID (16 Hex characters)",
    "editor.uid_hint": "E.g. E004015023AABBCC",
    "editor.name": "Tag Name",
    "editor.desc": "Description (optional)",
    "editor.image": "Cover Image URL (optional)",
    "editor.media_type": "Media Type",
    "editor.media_id": "Music Assistant Media ID / URI",
    "editor.media_title": "Title / Playlist Name",
    "editor.browse_ma": "Search in Library...",
    "editor.settings": "Playback Settings",
    "editor.resume": "Remember playback progress (Resume)",
    "editor.shuffle": "Shuffle playback",
    "editor.repeat": "Repeat",
    "editor.repeat_off": "Off",
    "editor.repeat_one": "Repeat Track",
    "editor.repeat_all": "Repeat All",
    "editor.vol_limit": "Volume limit (optional)",
    "editor.overrides_tab": "Device-Specific Overrides",
    "editor.overrides_hint": "Define different playlists or settings for specific Tonieboxes.",
    "editor.save": "Save Tag",
    "editor.cancel": "Cancel",

    // Scan Learning Modal
    "learn.title": "Scan Learning Mode Active",
    "learn.instructions": "Place a figure onto any of your Tonieboxes now. The UID will be automatically captured.",
    "learn.waiting": "Waiting for NFC scan...",
    "learn.captured": "Captured UID: {uid}!",
    "learn.cancel": "Cancel",

    // Settings
    "settings.title": "TonieESP Settings",
    "settings.export": "Export Tag Library (JSON)",
    "settings.export_desc": "Download all tags and configurations as a backup file.",
    "settings.export_btn": "Download Backup",
    "settings.import": "Import Tag Library (JSON)",
    "settings.import_desc": "Restore a previously backed up tag library.",
    "settings.import_btn": "Upload JSON",
    "settings.overwrite": "Overwrite existing UIDs",

    // Common
    "common.online": "Online",
    "common.offline": "Offline",
    "common.save_success": "Saved successfully!",
    "common.error": "An error occurred: {error}",
  },
};

export function localize(key: string, lang = "de", params?: Record<string, string | number>): string {
  const chosenLang = lang.startsWith("en") ? "en" : "de";
  let text = translations[chosenLang]?.[key] || translations["de"]?.[key] || key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return text;
}
