import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { NFCTag, TonieBox } from "../types";
import "../components/tag-card";

@customElement("tonieesp-tag-library-view")
export class TonieESPTagLibraryView extends LitElement {
  @property({ type: Array }) tags: NFCTag[] = [];
  @property({ type: Array }) boxes: TonieBox[] = [];
  @property({ type: String }) lang = "de";

  @state() private _searchQuery = "";
  @state() private _selectedType = "";

  static styles = css`
    :host {
      display: block;
    }

    .top-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .search-input {
      flex: 1;
      min-width: 240px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-primary {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .btn-secondary {
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, #222);
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .filter-chip {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #555);
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }

    .filter-chip:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .filter-chip.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .tags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
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
      font-size: 40px;
      margin-bottom: 8px;
    }
  `;

  private _filteredTags(): NFCTag[] {
    const q = this._searchQuery.toLowerCase().trim();
    return this.tags.filter((t) => {
      if (this._selectedType && t.media.media_type !== this._selectedType) {
        return false;
      }
      if (q) {
        const name = (t.name || "").toLowerCase();
        const desc = (t.description || "").toLowerCase();
        const uid = (t.uid || "").toLowerCase();
        const title = (t.media.title || "").toLowerCase();
        if (
          !name.includes(q) &&
          !desc.includes(q) &&
          !uid.includes(q) &&
          !title.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }

  render() {
    const filtered = this._filteredTags();
    const types = [
      { id: "", label: "Alle Typen" },
      { id: "playlist", label: "Playlists" },
      { id: "album", label: "Alben" },
      { id: "audiobook", label: "Hörbücher" },
      { id: "track", label: "Titel" },
      { id: "radio", label: "Radio" },
    ];

    return html`
      <div class="top-toolbar">
        <input
          class="search-input"
          type="search"
          placeholder="NFC-Figuren durchsuchen (Name, UID, Titel)..."
          .value=${this._searchQuery}
          @input=${(e: Event) =>
            (this._searchQuery = (e.target as HTMLInputElement).value)}
        />
        <div class="toolbar-actions">
          <button
            class="btn btn-secondary"
            @click=${() =>
              this.dispatchEvent(new CustomEvent("start-scan-learning", { bubbles: true, composed: true }))}
          >
            ⚡ Scan-Lernmodus
          </button>
          <button
            class="btn btn-primary"
            @click=${() =>
              this.dispatchEvent(new CustomEvent("add-new-tag", { bubbles: true, composed: true }))}
          >
            + Figur hinzufügen
          </button>
        </div>
      </div>

      <div class="filters-row">
        ${types.map(
          (t) => html`
            <div
              class="filter-chip ${this._selectedType === t.id ? "active" : ""}"
              @click=${() => (this._selectedType = t.id)}
            >
              ${t.label}
            </div>
          `
        )}
      </div>

      ${filtered.length === 0
        ? html`
            <div class="empty-state">
              <div class="empty-icon">🧸</div>
              <h3>Keine Figuren gefunden</h3>
              <p>
                Lege eine Figur auf deine Toniebox oder klicke auf "+ Figur
                hinzufügen".
              </p>
            </div>
          `
        : html`
            <div class="tags-grid">
              ${filtered.map(
                (tag) =>
                  html`<tonieesp-tag-card
                    .tag=${tag}
                    .boxes=${this.boxes}
                  ></tonieesp-tag-card>`
              )}
            </div>
          `}
    `;
  }
}
