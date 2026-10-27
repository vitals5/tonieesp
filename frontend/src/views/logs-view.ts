import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EventLogItem } from "../types";

@customElement("tonieesp-logs-view")
export class TonieESPLogsView extends LitElement {
  @property({ type: Array }) logs: EventLogItem[] = [];
  @property({ type: String }) lang = "de";

  static styles = css`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .btn-clear {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .log-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 550px;
      overflow-y: auto;
    }

    .log-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      background: var(--secondary-background-color, #f9f9f9);
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
    }

    .log-time {
      color: var(--secondary-text-color, #888);
      white-space: nowrap;
      font-size: 11px;
      margin-top: 2px;
    }

    .log-type {
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(3, 169, 244, 0.15);
      color: #0288d1;
      font-size: 11px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .log-type-tag {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .log-type-gesture {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
    }

    .log-summary {
      flex: 1;
      color: var(--primary-text-color, #222);
      word-break: break-all;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--secondary-text-color, #888);
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="header-row">
          <h2 class="title">Ereignisprotokoll & Live-Diagnose</h2>
          <button
            class="btn-clear"
            @click=${() =>
              this.dispatchEvent(new CustomEvent("clear-logs", { bubbles: true, composed: true }))}
          >
            Protokoll leeren
          </button>
        </div>

        <div class="log-list">
          ${this.logs.length === 0
            ? html`<div class="empty-state">
                Noch keine Ereignisse erfasst. Stelle eine Figur auf oder tippe
                auf eine Toniebox, um Gesten und Scans live zu sehen.
              </div>`
            : this.logs.map((item) => {
                let badgeClass = "";
                if (item.type.includes("tag")) badgeClass = "log-type-tag";
                if (item.type.includes("gesture") || item.type.includes("tap") || item.type.includes("tilt")) {
                  badgeClass = "log-type-gesture";
                }
                return html`
                  <div class="log-item">
                    <span class="log-time">${item.timestamp}</span>
                    <span class="log-type ${badgeClass}">${item.type}</span>
                    <span class="log-summary">${item.summary}</span>
                  </div>
                `;
              })}
        </div>
      </div>
    `;
  }
}
