import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { NFCTag, TonieBox } from "../types";
import { localize } from "../localize";

@customElement("tonieesp-tag-card")
export class TonieESPTagCard extends LitElement {
  @property({ type: Object }) tag!: NFCTag;
  @property({ type: Array }) boxes: TonieBox[] = [];
  @property({ type: String }) lang = "de";

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 14px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.06));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    }

    .top-row {
      display: flex;
      gap: 12px;
    }

    .cover {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .uid-pill {
      font-family: monospace;
      font-size: 11px;
      background: var(--secondary-background-color, #f0f0f0);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--secondary-text-color, #555);
      display: inline-block;
      margin-top: 3px;
    }

    .media-info {
      margin-top: 4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 6px;
      background: var(--secondary-background-color, #f4f4f4);
      color: var(--primary-text-color, #444);
    }

    .badge-override {
      background: rgba(255, 152, 0, 0.15);
      color: #e65100;
    }

    .actions-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .play-select-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }

    select {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 12px;
      flex: 1;
      max-width: 140px;
    }

    .btn-play-action {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-icon {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: var(--secondary-text-color, #555);
    }

    .btn-icon:hover {
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color, #111);
    }

    .btn-delete:hover {
      color: #d32f2f;
      background: rgba(244, 67, 54, 0.1);
    }
  `;

  private _onPlayOnBox() {
    const select = this.shadowRoot?.querySelector("select") as HTMLSelectElement;
    const boxId = select ? select.value : this.boxes[0]?.id;
    if (!boxId) return;

    this.dispatchEvent(
      new CustomEvent("play-tag-on-box", {
        detail: { tag: this.tag, boxId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onEdit() {
    this.dispatchEvent(
      new CustomEvent("edit-tag", {
        detail: { tag: this.tag },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onDelete() {
    this.dispatchEvent(
      new CustomEvent("delete-tag", {
        detail: { tag: this.tag },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.tag) return html``;

    const overrideCount = Object.keys(this.tag.overrides || {}).length;

    return html`
      <div class="card">
        <div class="top-row">
          ${this.tag.image
            ? html`<img class="cover" src="${this.tag.image}" alt="Cover" />`
            : html`<div class="cover">🧸</div>`}
          <div class="info">
            <div class="name">${this.tag.name}</div>
            <span class="uid-pill">${this.tag.uid}</span>
            <div class="media-info">
              🎵 ${this.tag.media.title || this.tag.media.media_id || localize("tags.no_media", this.lang)}
            </div>
          </div>
        </div>

        <div class="badges-row">
          <span class="badge">${this.tag.media.media_type || "playlist"}</span>
          ${this.tag.settings.resume ? html`<span class="badge">${localize("tags.resume_badge", this.lang)}</span>` : ""}
          ${this.tag.settings.shuffle ? html`<span class="badge">${localize("tags.shuffle_badge", this.lang)}</span>` : ""}
          ${overrideCount > 0
            ? html`<span class="badge badge-override">${localize("tags.overrides_badge", this.lang, { count: overrideCount })}</span>`
            : ""}
        </div>

        <div class="actions-row">
          <div class="play-select-group">
            <select>
              ${this.boxes.map(
                (b) => html`<option value="${b.id}">${b.name}</option>`
              )}
            </select>
            <button class="btn-play-action" @click=${this._onPlayOnBox}>${localize("tags.play_on", this.lang)}</button>
          </div>

          <div>
            <button class="btn-icon" title=${localize("tags.edit", this.lang)} @click=${this._onEdit}>✏️</button>
            <button class="btn-icon btn-delete" title=${localize("tags.delete", this.lang)} @click=${this._onDelete}>🗑️</button>
          </div>
        </div>
      </div>
    `;
  }
}
