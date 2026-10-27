import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("tonieesp-status-badge")
export class TonieESPStatusBadge extends LitElement {
  @property({ type: Boolean }) online = false;
  @property({ type: Number }) batteryLevel: number | null = null;
  @property({ type: Boolean }) charging = false;
  @property({ type: String }) type = "";
  @property({ type: String }) text = "";

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 12px;
      padding: 3px 8px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    .badge-online {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .badge-offline {
      background: rgba(244, 67, 54, 0.15);
      color: #c62828;
    }

    .badge-battery {
      background: rgba(33, 150, 243, 0.15);
      color: #1565c0;
    }

    .badge-type {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
      text-transform: capitalize;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `;

  render() {
    if (this.type === "online") {
      return html`
        <span class="${this.online ? "badge-online" : "badge-offline"}">
          <span class="dot"></span>
          ${this.online ? "Online" : "Offline"}
        </span>
      `;
    }

    if (this.type === "battery" && this.batteryLevel !== null) {
      return html`
        <span class="badge-battery">
          ${this.charging ? "⚡" : "🔋"} ${this.batteryLevel}%
        </span>
      `;
    }

    if (this.type === "media_type") {
      return html`<span class="badge-type">${this.text}</span>`;
    }

    return html`<span>${this.text}</span>`;
  }
}
