import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TonieBox } from "../types";
import { localize } from "../localize";
import "./status-badge";

@customElement("tonieesp-box-card")
export class TonieESPBoxCard extends LitElement {
  @property({ type: Object }) box!: TonieBox;
  @property({ type: String }) lang = "de";

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-box {
      font-size: 22px;
    }

    .box-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-text-color, #222);
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Current Tag Section */
    .tag-container {
      background: var(--secondary-background-color, #f8f9fa);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tag-cover {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .tag-details {
      flex: 1;
      min-width: 0;
    }

    .tag-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #777);
    }

    .tag-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tag-media {
      font-size: 12px;
      color: var(--secondary-text-color, #555);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Unknown Tag Alert */
    .unknown-banner {
      background: rgba(255, 152, 0, 0.12);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #e65100;
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .unknown-text {
      font-size: 12px;
      font-weight: 600;
    }

    .btn-setup {
      background: #f57c00;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    /* Player Controls */
    .player-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .playback-info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 13px;
    }

    .playback-title {
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70%;
    }

    .playback-status {
      font-size: 11px;
      font-weight: 500;
      color: var(--secondary-text-color, #888);
      text-transform: uppercase;
    }

    .controls-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .playback-buttons {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-ctrl {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-ctrl:hover {
      background: rgba(0, 0, 0, 0.12);
    }

    .btn-play {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      width: 38px;
      height: 38px;
      font-size: 16px;
    }

    .btn-play:hover {
      opacity: 0.9;
    }

    .volume-slider {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .volume-slider input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 4px;
    }

    .btn-link {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 6px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }
  `;

  private _onControl(action: string, data?: any) {
    this.dispatchEvent(
      new CustomEvent("box-control", {
        detail: { boxId: this.box.id, action, data },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onSetupUnknown() {
    this.dispatchEvent(
      new CustomEvent("setup-unknown-tag", {
        detail: { uid: this.box.unknown_tag, boxId: this.box.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onOpenDetails() {
    this.dispatchEvent(
      new CustomEvent("open-box-details", {
        detail: { box: this.box },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onVolumeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const vol = parseFloat(input.value);
    this._onControl("volume", { volume: vol });
  }

  render() {
    if (!this.box) return html``;

    const pb = this.box.playback || {};
    const isPlaying = pb.state === "playing";

    return html`
      <div class="card">
        <!-- Header -->
        <div class="header">
          <div class="title-group">
            <span class="icon-box">📻</span>
            <span class="box-name">${this.box.name}</span>
          </div>
          <div class="badges">
            <tonieesp-status-badge
              type="online"
              .online=${this.box.online}
            ></tonieesp-status-badge>
            ${this.box.battery?.level !== null
              ? html`
                  <tonieesp-status-badge
                    type="battery"
                    .batteryLevel=${this.box.battery.level}
                    .charging=${this.box.battery.charging}
                  ></tonieesp-status-badge>
                `
              : ""}
          </div>
        </div>

        <!-- Tag Notification / Current Tag -->
        ${this.box.unknown_tag
          ? html`
              <div class="unknown-banner">
                <span class="unknown-text"
                  >⚡ ${localize("dashboard.unknown_tag_alert", this.lang)} ${this.box.unknown_tag}</span
                >
                <button class="btn-setup" @click=${this._onSetupUnknown}>
                  ${localize("dashboard.setup_tag_btn", this.lang)}
                </button>
              </div>
            `
          : html`
              <div class="tag-container">
                ${this.box.current_tag_info?.image
                  ? html`<img
                      class="tag-cover"
                      src="${this.box.current_tag_info.image}"
                      alt="Tag"
                    />`
                  : html`<div class="tag-cover">🧸</div>`}
                <div class="tag-details">
                  <div class="tag-label">${localize("dashboard.current_tag", this.lang)}</div>
                  <div class="tag-name">
                    ${this.box.current_tag_info?.name ||
                    (this.box.current_tag ? `UID: ${this.box.current_tag}` : localize("dashboard.no_tag", this.lang))}
                  </div>
                  ${this.box.current_tag_info?.media_title
                    ? html`<div class="tag-media">
                        ${this.box.current_tag_info.media_title}
                      </div>`
                    : ""}
                </div>
              </div>
            `}

        <!-- Playback Controls -->
        <div class="player-section">
          <div class="playback-info">
            <span class="playback-title">${pb.title || (this.lang.startsWith("en") ? "No playback" : "Keine Wiedergabe")}</span>
            <span class="playback-status">${pb.state || (this.lang.startsWith("en") ? "Ready" : "Bereit")}</span>
          </div>

          <div class="controls-row">
            <div class="playback-buttons">
              <button
                class="btn-ctrl"
                title=${localize("control.prev", this.lang)}
                @click=${() => this._onControl("previous")}
              >
                ⏮
              </button>
              <button
                class="btn-ctrl btn-play"
                title=${isPlaying ? localize("control.pause", this.lang) : localize("control.play", this.lang)}
                @click=${() => this._onControl(isPlaying ? "pause" : "play")}
              >
                ${isPlaying ? "⏸" : "▶"}
              </button>
              <button
                class="btn-ctrl"
                title=${localize("control.next", this.lang)}
                @click=${() => this._onControl("next")}
              >
                ⏭
              </button>
            </div>

            <div class="volume-slider">
              <span>🔈</span>
              <input
                type="range"
                min="0"
                max="${this.box.settings.max_volume || 1.0}"
                step="0.05"
                .value=${String(pb.volume_level || 0.4)}
                @change=${this._onVolumeChange}
                title=${localize("dashboard.volume", this.lang)}
              />
              <span>🔊</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button class="btn-link" @click=${this._onOpenDetails}>
            ${localize("control.details", this.lang)} →
          </button>
        </div>
      </div>
    `;
  }
}
