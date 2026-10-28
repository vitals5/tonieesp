import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TonieBox } from "../types";
import { localize } from "../localize";

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
  @state() private _tapThreshold: number | null = null;
  @state() private _tapTimeLimit: number | null = null;

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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    @media (max-width: 640px) {
      .container {
        padding: 16px;
      }

      .grid-2 {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .header-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-row .btn-back {
        width: 100%;
        text-align: center;
      }

      .actions-row {
        flex-direction: column-reverse;
      }

      .actions-row .btn {
        width: 100%;
        text-align: center;
      }
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
    if (this.box?.hardware_tuning) {
      this._tapThreshold = this.box.hardware_tuning.tap_threshold ?? 20;
      this._tapTimeLimit = this.box.hardware_tuning.tap_time_limit ?? 10;
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
      tap_threshold: this._tapThreshold,
      tap_time_limit: this._tapTimeLimit,
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
          <h2 class="title">📻 ${localize("box.detail_title", this.lang, { name: this.box.name })}</h2>
          <button class="btn btn-back" @click=${this._onBack}>
            ${localize("box.back", this.lang)}
          </button>
        </div>

        <!-- Automation & Playback Behavior -->
        <div class="section" style="border: none; padding-top: 0;">
          <h3 class="section-title">${localize("box.section_playback", this.lang)}</h3>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="pause_rem"
              .checked=${this._pauseOnRemoval}
              @change=${(e: Event) =>
                (this._pauseOnRemoval = (e.target as HTMLInputElement).checked)}
            />
            <label for="pause_rem"
              >${localize("box.pause_removal", this.lang)}</label
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
              >${localize("box.resume_replace", this.lang)}</label
            >
          </div>

          <div class="setting-group" style="margin-top: 12px;">
            <label>${localize("box.max_volume", this.lang)} (${Math.round(this._maxVolume * 100)}%)</label>
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
          <h3 class="section-title">${localize("box.section_gestures", this.lang)}</h3>
          <div class="checkbox-setting" style="margin-bottom: 12px;">
            <input
              type="checkbox"
              id="gest_en"
              .checked=${this._gesturesEnabled}
              @change=${(e: Event) =>
                (this._gesturesEnabled = (e.target as HTMLInputElement).checked)}
            />
            <label for="gest_en">${localize("box.gestures_enabled", this.lang)}</label>
          </div>

          <div class="grid-2">
            <div class="setting-group">
              <label>${localize("box.left_tap", this.lang)}</label>
              <select
                .value=${this._leftTapAction}
                @change=${(e: Event) =>
                  (this._leftTapAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="previous_track">${localize("action.previous_track", this.lang)}</option>
                <option value="next_track">${localize("action.next_track", this.lang)}</option>
                <option value="play_pause">${localize("action.play_pause", this.lang)}</option>
                <option value="volume_down">${localize("action.volume_down", this.lang)}</option>
                <option value="none">${localize("action.none", this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${localize("box.right_tap", this.lang)}</label>
              <select
                .value=${this._rightTapAction}
                @change=${(e: Event) =>
                  (this._rightTapAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="next_track">${localize("action.next_track", this.lang)}</option>
                <option value="previous_track">${localize("action.previous_track", this.lang)}</option>
                <option value="play_pause">${localize("action.play_pause", this.lang)}</option>
                <option value="volume_up">${localize("action.volume_up", this.lang)}</option>
                <option value="none">${localize("action.none", this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${localize("box.left_tilt", this.lang)}</label>
              <select
                .value=${this._leftTiltAction}
                @change=${(e: Event) =>
                  (this._leftTiltAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="seek_backward">${localize("action.seek_backward", this.lang)}</option>
                <option value="seek_forward">${localize("action.seek_forward", this.lang)}</option>
                <option value="none">${localize("action.none", this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${localize("box.right_tilt", this.lang)}</label>
              <select
                .value=${this._rightTiltAction}
                @change=${(e: Event) =>
                  (this._rightTiltAction = (e.target as HTMLSelectElement).value)}
              >
                <option value="seek_forward">${localize("action.seek_forward", this.lang)}</option>
                <option value="seek_backward">${localize("action.seek_backward", this.lang)}</option>
                <option value="none">${localize("action.none", this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${localize("box.seek_step", this.lang)}</label>
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

        <!-- Sensor Fine-Tuning (Vibration Filter) -->
        <div class="section">
          <h3 class="section-title">${localize("box.section_tuning", this.lang)}</h3>
          <p style="font-size: 13px; color: var(--secondary-text-color, #666); margin: -4px 0 16px 0;">
            ${localize("box.tuning_hint", this.lang)}
          </p>
          <div class="grid-2">
            <div class="setting-group">
              <label>${localize("box.tap_threshold", this.lang)}</label>
              <input
                type="number"
                min="1"
                max="127"
                step="1"
                .value=${this._tapThreshold !== null ? String(this._tapThreshold) : "20"}
                @change=${(e: Event) =>
                  (this._tapThreshold = parseFloat(
                    (e.target as HTMLInputElement).value
                  ))}
              />
              <span style="font-size: 12px; color: var(--secondary-text-color, #777); margin-top: 4px;">
                ${localize("box.tap_threshold_hint", this.lang)}
              </span>
            </div>

            <div class="setting-group">
              <label>${localize("box.tap_time_limit", this.lang)}</label>
              <input
                type="number"
                min="1"
                max="255"
                step="1"
                .value=${this._tapTimeLimit !== null ? String(this._tapTimeLimit) : "10"}
                @change=${(e: Event) =>
                  (this._tapTimeLimit = parseFloat(
                    (e.target as HTMLInputElement).value
                  ))}
              />
              <span style="font-size: 12px; color: var(--secondary-text-color, #777); margin-top: 4px;">
                ${localize("box.tap_time_limit_hint", this.lang)}
              </span>
            </div>
          </div>
        </div>

        <!-- Entity Mapping Table -->
        <div class="section">
          <h3 class="section-title">Home Assistant Entities</h3>
          <table class="entities-table">
            <thead>
              <tr>
                <th>Function</th>
                <th>Entity ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ESPHome Speaker</td>
                <td><code>${this.box.entities.speaker || "—"}</code></td>
              </tr>
              <tr>
                <td>Music Assistant Player</td>
                <td><code>${this.box.entities.ma_player || "—"}</code></td>
              </tr>
              <tr>
                <td>NFC Tag UID Sensor</td>
                <td><code>${this.box.entities.nfc_sensor || "—"}</code></td>
              </tr>
              <tr>
                <td>Battery</td>
                <td><code>${this.box.entities.battery || "—"}</code></td>
              </tr>
              <tr>
                <td>Charging</td>
                <td><code>${this.box.entities.charging || "—"}</code></td>
              </tr>
              <tr>
                <td>LED Light</td>
                <td><code>${this.box.entities.led || "—"}</code></td>
              </tr>
              <tr>
                <td>Status LED Switch</td>
                <td><code>${this.box.entities.status_led || "—"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions-row">
          <button class="btn btn-back" @click=${this._onBack}>
            ${localize("common.cancel", this.lang)}
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            ${localize("common.save", this.lang)}
          </button>
        </div>
      </div>
    `;
  }
}
