import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MediaSearchResult } from "../types";
import { localize } from "../localize";
import "../components/media-item-card";

@customElement("tonieesp-media-browser-view")
export class TonieESPMediaBrowserView extends LitElement {
  @property({ type: Object }) api: any;
  @property({ type: String }) lang = "de";

  @state() private _query = "";
  @state() private _loading = false;
  @state() private _results: MediaSearchResult[] = [];
  @state() private _searched = false;
  @state() private _selectedType = "";

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
      margin-bottom: 16px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .subtitle {
      font-size: 13px;
      color: var(--secondary-text-color, #666);
      margin: 4px 0 0 0;
    }

    .search-row {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }

    .search-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .btn-search {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-search:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .results-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: var(--secondary-text-color, #777);
    }
  `;

  private async _onSearch(e?: Event) {
    if (e) e.preventDefault();
    if (!this._query.trim() || !this.api) return;

    this._loading = true;
    this._searched = true;
    try {
      const mediaTypes = this._selectedType ? [this._selectedType] : undefined;
      const res = await this.api.searchMedia(this._query.trim(), mediaTypes);
      this._results = res || [];
    } catch (err) {
      console.error("Error searching media:", err);
      this._results = [];
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="header-row">
          <h2 class="title">${localize("browser.title", this.lang)}</h2>
          <p class="subtitle">
            ${localize("browser.subtitle", this.lang)}
          </p>

          <form class="search-row" @submit=${this._onSearch}>
            <input
              class="search-input"
              type="search"
              placeholder=${localize("browser.search_placeholder", this.lang)}
              .value=${this._query}
              @input=${(e: Event) =>
                (this._query = (e.target as HTMLInputElement).value)}
            />
            <button
              class="btn-search"
              type="submit"
              ?disabled=${this._loading || !this._query.trim()}
            >
              ${this._loading ? localize("browser.searching", this.lang) : localize("browser.search_btn", this.lang)}
            </button>
          </form>
        </div>

        <div class="results-grid">
          ${this._results.map(
            (item) => html`<tonieesp-media-item-card .item=${item} .lang=${this.lang}></tonieesp-media-item-card>`
          )}
          ${this._searched && !this._loading && this._results.length === 0
            ? html`<div class="empty-state">
                ${localize("browser.no_results", this.lang)}
              </div>`
            : ""}
        </div>
      </div>
    `;
  }
}
