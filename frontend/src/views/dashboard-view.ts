import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { NFCTag, TonieBox } from "../types";
import { localize } from "../localize";
import "../components/toniebox-card";

@customElement("tonieesp-dashboard-view")
export class TonieESPDashboardView extends LitElement {
  @property({ type: Array }) boxes: TonieBox[] = [];
  @property({ type: Array }) tags: NFCTag[] = [];
  @property({ type: String }) lang = "de";

  static styles = css`
    :host {
      display: block;
    }

    .header-section {
      margin-bottom: 20px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color, #666);
      margin: 4px 0 0 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin: 16px 0 24px 0;
    }

    .stat-card {
      background: var(--card-background-color, #ffffff);
      border-radius: 10px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-color, #03a9f4);
    }

    .stat-label {
      font-size: 12px;
      color: var(--secondary-text-color, #777);
      margin-top: 2px;
    }

    .boxes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }

    .empty-state {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      border: 1px dashed var(--divider-color, #ccc);
      color: var(--secondary-text-color, #666);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
  `;

  render() {
    const onlineCount = this.boxes.filter((b) => b.online).length;
    const playingCount = this.boxes.filter(
      (b) => b.playback?.state === "playing"
    ).length;

    return html`
      <div class="header-section">
        <h1 class="title">${localize("dashboard.title", this.lang)}</h1>
        <p class="subtitle">
          ${localize("dashboard.subtitle", this.lang)}
        </p>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-value">${this.boxes.length}</span>
            <span class="stat-label">${localize("dashboard.total_boxes", this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${onlineCount}</span>
            <span class="stat-label">${localize("dashboard.online", this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${playingCount}</span>
            <span class="stat-label">${localize("dashboard.active_playbacks", this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${this.tags.length}</span>
            <span class="stat-label">${localize("dashboard.tags_in_library", this.lang)}</span>
          </div>
        </div>
      </div>

      ${this.boxes.length === 0
        ? html`
            <div class="empty-state">
              <div class="empty-icon">📻</div>
              <h3>${localize("dashboard.no_boxes", this.lang)}</h3>
              <p>
                ${localize("dashboard.add_box_hint", this.lang)}
              </p>
            </div>
          `
        : html`
            <div class="boxes-grid">
              ${this.boxes.map(
                (box) =>
                  html`<tonieesp-box-card
                    .box=${box}
                    .lang=${this.lang}
                  ></tonieesp-box-card>`
              )}
            </div>
          `}
    `;
  }
}
