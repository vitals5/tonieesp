import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TonieBox } from "../types";

@customElement("tonieesp-box-detail-view")
export class TonieESPBoxDetailView extends LitElement {
  @property({ type: Object }) box!: TonieBox;
  @property({ type: String }) lang = "de";

  @state() private _pauseOnRemoval = true;
  @state() private _resumeOnReplace = true;
  @state() private _maxVolume = 0.8;
  @state() private _seekStep = 10;
  @state() private _gesturesEnabled = true;
  @state() private _leftTapAction = "previous_track";
  @state() private _rightTapAction = "next_track";
  @state() private _leftTiltAction = "seek_backward";
  @state() private _rightTiltAction = "seek_forward";

  static styles = css`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      margin: 0 auto;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .section {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-bottom: 14px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .setting-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .checkbox-setting {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
    }

    .checkbox-setting input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #333);
    }

    select,
    input[type="number"] {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .slider-row input[type="range"] {
      flex: 1;
      accent-color: var(--primary-color, #03a9f4);
    }

    .entities-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }

    .entities-table th,
    .entities-table td {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid var(--divider-color, #eee);
    }

    .entities-table th {
      color: var(--secondary-text-color, #666);
      font-weight: 600;
    }

    .entities-table code {
      font-family: monospace;
      background: var(--secondary-background-color, #f0f0f0);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .btn-back {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.box?.settings) {
      const s = this.box.settings;
      this._pauseOnRemoval = s.pause_on_removal !== false;
      this._resumeOnReplace = s.resume_on_replace !== false;
      this._maxVolume = s.max_volume || 0.8;
      this._seekStep = s.seek_step || 10;
      this._gesturesEnabled = s.gestures_enabled !== false;
      this._leftTapAction = s.left_tap_action || "previous_track";
      this._rightTapAction = s.right_tap_action || "next_track";
      this._leftTiltAction = s.left_tilt_action || "seek_backward";
      this._rightTiltAction = s.right_tilt_action || "seek_forward";
    }
  }

  private _onSave() {
    const updatedSettings = {
      pause_on_removal: this._pauseOnRemoval,
      resume_on_replace: this._resumeOnReplace,
      max_volume: this._maxVolume,
      seek_step: this._seekStep,
      gestures_enabled: this._gesturesEnabled,
      left_tap_action: this._leftTapAction,
      right_tap_action: this._rightTapAction,
      left_tilt_action: this._leftTiltAction,
      right_tilt_action: this._rightTiltAction,
    };

    this.dispatchEvent(
      new CustomEvent("save-box-settings", {
        detail: { boxId: this.box.id, settings: updatedSettings },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onBack() {
    this.dispatchEvent(
      new CustomEvent("back-to-dashboard", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.box) return html``;

    return html`
      <div class="container">
        <div class="header-row">
          <h2 class="title">📻 ${this.box.name} – Geräteeinstellungen</h2>
          <button class="btn btn-back" @click=${this._onBack}>
            ← Zurück
          </button>
        </div>

        <!-- Automation & Playback Behavior -->
        <div class="section" style="border: none; padding-top: 0;">
          <h3 class="section-title">Wiedergabeverhalten</h3>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="pause_rem"
              .checked=${this._pauseOnRemoval}
              @change=${(e: Event) =>
                (this._pauseOnRemoval = (e.target as HTMLInputElement).checked)}
            />
            <label for="pause_rem"
              >Wiedergabe beim Abnehmen der Figur pausieren</label
            >
          </div>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="resume_rep"
              .checked=${this._resumeOnReplace}
              @change=${(e: Event) =>
                (this._resumeOnReplace = (e.target as HTMLInputElement).checked)}
            />
            <label for="resume_rep"
              >Wiedergabe beim erneuten Aufsetzen fortsetzen</label
            >
          </div>

          <div class="setting-group" style="margin-top: 12px;">
            <label>Maximale Lautstärkebegrenzung (${Math.round(this._maxVolume * 100)}%)</label>
            <div class="slider-row">
              <span>0%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                .value=${String(this._maxVolume)}
                @input=${(e: Event) =>
                  (this._maxVolume = parseFloat(
                    (e.target as HTMLInputElement).value
                  ))}
              />
              <span>100%</span>
            </div>
          </div>
        </div>

        <!-- Gestures -->
        <div class="section">
          <h3 class="section-title">Gestensteuerung (Beschleunigungssensor)</h3>
          <div class="checkbox-setting" style="margin-bottom: 12px;">
            <input
              type="checkbox"
              id="gest_en"
              .checked=${this._gesturesEnabled}
              @change=${(e: Event) =>
                (this._gesturesEnabled = (e.target as HTMLInputElement).checked)}
            />
            <label for="gest_en">Gesten aktivieren (Klopfen & Neigen)</label>
          </div>

          <div class="grid-2">
            <div class="setting-group">
              <label>Aktion: Linker Klopfer</label>
              <select
                .value=${this._leftTapAction}
                @change=${(e: Event) =>
                  (this._leftTapAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="previous_track">Vorheriger Titel (Standard)</option>
                <option value="next_track">Nächster Titel</option>
                <option value="play_pause">Play / Pause</option>
                <option value="volume_down">Leiser</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Rechter Klopfer</label>
              <select
                .value=${this._rightTapAction}
                @change=${(e: Event) =>
                  (this._rightTapAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="next_track">Nächster Titel (Standard)</option>
                <option value="previous_track">Vorheriger Titel</option>
                <option value="play_pause">Play / Pause</option>
                <option value="volume_up">Lauter</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Nach links geneigt</label>
              <select
                .value=${this._leftTiltAction}
                @change=${(e: Event) =>
                  (this._leftTiltAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="seek_backward">Zurückspulen (Standard)</option>
                <option value="seek_forward">Vorspulen</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Nach rechts geneigt</label>
              <select
                .value=${this._rightTiltAction}
                @change=${(e: Event) =>
                  (this._rightTiltAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="seek_forward">Vorspulen (Standard)</option>
                <option value="seek_backward">Zurückspulen</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Spulschrittweite (Sekunden je Neigungsintervall)</label>
              <input
                type="number"
                min="5"
                max="60"
                step="5"
                .value=${String(this._seekStep)}
                @change=${(e: Event) =>
                  (this._seekStep = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  ))}
              />
            </div>
          </div>
        </div>

        <!-- Entity Mapping Table -->
        <div class="section">
          <h3 class="section-title">Zugeordnete Home-Assistant-Entitäten</h3>
          <table class="entities-table">
            <thead>
              <tr>
                <th>Funktion</th>
                <th>Entität</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ESPHome Speaker</td>
                <td><code>${this.box.entities.speaker || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Music Assistant Player</td>
                <td><code>${this.box.entities.ma_player || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>NFC Tag UID Sensor</td>
                <td><code>${this.box.entities.nfc_sensor || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Batterie</td>
                <td><code>${this.box.entities.battery || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Ladezustand</td>
                <td><code>${this.box.entities.charging || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>LED Beleuchtung</td>
                <td><code>${this.box.entities.led || "Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Status-LED Schalter</td>
                <td><code>${this.box.entities.status_led || "Nicht gefunden"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions-row">
          <button class="btn btn-back" @click=${this._onBack}>
            Abbrechen
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            Einstellungen speichern
          </button>
        </div>
      </div>
    `;
  }
}
