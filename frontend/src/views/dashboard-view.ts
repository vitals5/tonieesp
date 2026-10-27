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
      margin-bottom: 24px;
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
    return html`
      <div class="header-section">
        <h1 class="title">${localize("dashboard.title", this.lang)}</h1>
        <p class="subtitle">
          ${localize("dashboard.subtitle", this.lang)}
        </p>
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
