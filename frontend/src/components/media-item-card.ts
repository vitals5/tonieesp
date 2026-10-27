import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MediaSearchResult } from "../types";
import { localize } from "../localize";

@customElement("tonieesp-media-item-card")
export class TonieESPMediaItemCard extends LitElement {
  @property({ type: Object }) item!: MediaSearchResult;
  @property({ type: String }) lang = "de";

  static styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 8px;
      background: var(--card-background-color, #ffffff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      transition: background 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    }

    .card:hover {
      background: var(--secondary-background-color, #f9f9f9);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .thumbnail {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subtitle {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .type-badge {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(33, 150, 243, 0.1);
      color: #1976d2;
      text-transform: capitalize;
    }

    .btn-select {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .btn-select:hover {
      opacity: 0.9;
    }
  `;

  private _onSelect(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("media-selected", {
        detail: this.item,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.item) return html``;

    return html`
      <div class="card" @click=${this._onSelect}>
        ${this.item.image
          ? html`<img class="thumbnail" src="${this.item.image}" alt="Cover" />`
          : html`<div class="thumbnail">🎵</div>`}
        <div class="info">
          <div class="title">${this.item.title}</div>
          <div class="subtitle">
            <span class="type-badge">${this.item.media_type}</span>
            ${this.item.artist ? ` • ${this.item.artist}` : ""}
          </div>
        </div>
        <button class="btn-select" @click=${this._onSelect}>${localize("browser.select_btn", this.lang)}</button>
      </div>
    `;
  }
}
