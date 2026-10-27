import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DeviceOverride, MediaSearchResult, NFCTag, TonieBox } from "../types";
import { localize } from "../localize";

@customElement("tonieesp-tag-editor-view")
export class TonieESPTagEditorView extends LitElement {
  @property({ type: Object }) tag?: NFCTag;
  @property({ type: Array }) boxes: TonieBox[] = [];
  @property({ type: String }) initialUid = "";
  @property({ type: String }) lang = "de";
  @property({ type: Object }) api: any;

  @state() private _uid = "";
  @state() private _name = "";
  @state() private _description = "";
  @state() private _image = "";
  @state() private _mediaProvider = "music_assistant";
  @state() private _mediaType = "playlist";
  @state() private _mediaId = "";
  @state() private _mediaTitle = "";
  @state() private _mediaArtist = "";
  @state() private _resume = true;
  @state() private _shuffle = false;
  @state() private _repeat = "off";
  @state() private _volumeLimit: number | null = null;
  @state() private _overrides: Record<string, DeviceOverride> = {};
  @state() private _activeTab: "global" | "overrides" = "global";
  @state() private _selectedOverrideBoxId = "";

  // In-place Media Library Search Modal state
  @state() private _showMediaModal = false;
  @state() private _modalSearchQuery = "";
  @state() private _modalSearching = false;
  @state() private _modalResults: MediaSearchResult[] = [];
  @state() private _modalSearched = false;

  static styles = css`
    :host {
      display: block;
    }

    .editor-card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      margin: 0 auto;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .tabs-row {
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--divider-color, #eee);
      margin-bottom: 20px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }

    .tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      grid-column: span 2;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #333);
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .uid-group {
      display: flex;
      gap: 8px;
    }

    .uid-group input {
      flex: 1;
      font-family: monospace;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .btn-scan {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      padding: 0 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .media-search-group {
      display: flex;
      gap: 8px;
    }

    .media-search-group input {
      flex: 1;
    }

    .btn-search {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 0 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .checkbox-row input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    .preview-box {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--secondary-background-color, #f9f9f9);
      border-radius: 8px;
    }

    .preview-thumb {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
      background: #ddd;
    }

    /* Overrides section */
    .overrides-header {
      background: var(--secondary-background-color, #f8f9fa);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--secondary-text-color, #555);
    }

    .override-item {
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      background: var(--card-background-color, #fff);
    }

    .override-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .footer-actions {
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

    .btn-cancel {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    /* In-place Media Search Modal */
    .media-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .media-modal-content {
      background: var(--card-background-color, #ffffff);
      border-radius: 14px;
      width: 100%;
      max-width: 680px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .media-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #eee);
    }

    .media-modal-title {
      font-size: 17px;
      font-weight: 700;
      margin: 0;
    }

    .btn-close-modal {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--secondary-text-color, #666);
      line-height: 1;
      padding: 4px;
    }

    .media-modal-body {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
    }

    .modal-search-row {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }

    .modal-search-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .modal-results-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    }

    .media-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #eee);
      background: var(--card-background-color, #fff);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .media-result-item:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color, #03a9f4);
    }

    .media-thumb {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .media-result-info {
      flex: 1;
      min-width: 0;
    }

    .media-result-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-result-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-result-badge {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(3, 169, 244, 0.12);
      color: #0288d1;
      text-transform: capitalize;
    }

    .btn-take-media {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.tag) {
      this._uid = this.tag.uid;
      this._name = this.tag.name;
      this._description = this.tag.description || "";
      this._image = this.tag.image || "";
      this._mediaProvider = this.tag.media.provider || "music_assistant";
      this._mediaType = this.tag.media.media_type || "playlist";
      this._mediaId = this.tag.media.media_id || "";
      this._mediaTitle = this.tag.media.title || "";
      this._mediaArtist = this.tag.media.artist || "";
      this._resume = this.tag.settings.resume !== false;
      this._shuffle = !!this.tag.settings.shuffle;
      this._repeat = this.tag.settings.repeat || "off";
      this._volumeLimit = this.tag.settings.volume_limit || null;
      this._overrides = JSON.parse(JSON.stringify(this.tag.overrides || {}));
    } else if (this.initialUid) {
      this._uid = this.initialUid;
      this._name = `Tonie ${this.initialUid.slice(-4)}`;
    }
    if (this.boxes.length > 0) {
      this._selectedOverrideBoxId = this.boxes[0].id;
    }
  }

  private _openMediaSearchModal() {
    this._showMediaModal = true;
    if (!this._modalSearchQuery) {
      this._modalSearchQuery = this._mediaTitle || (this._name.startsWith("Tonie ") ? "" : this._name);
    }
    if (this._modalSearchQuery && this._modalResults.length === 0) {
      this._executeModalSearch();
    }
  }

  private _closeMediaSearchModal() {
    this._showMediaModal = false;
  }

  private async _executeModalSearch(e?: Event) {
    if (e) e.preventDefault();
    if (!this._modalSearchQuery.trim() || !this.api) return;

    this._modalSearching = true;
    this._modalSearched = true;
    try {
      const types = this._mediaType ? [this._mediaType] : undefined;
      const res = await this.api.searchMedia(this._modalSearchQuery.trim(), types);
      this._modalResults = res || [];
    } catch (err) {
      console.error("Error searching media:", err);
      this._modalResults = [];
    } finally {
      this._modalSearching = false;
    }
  }

  private _selectMediaItem(item: MediaSearchResult) {
    this._mediaId = item.media_id;
    this._mediaType = item.media_type;
    this._mediaTitle = item.title;
    this._mediaArtist = item.artist || "";
    if (item.image && !this._image) {
      this._image = item.image;
    }
    if (!this._name || this._name.startsWith("Tonie ")) {
      this._name = item.title;
    }
    this._showMediaModal = false;
  }

  public setMediaSelection(item: MediaSearchResult) {
    this._selectMediaItem(item);
  }

  private _onSave() {
    if (!this._uid.trim()) {
      alert(this.lang.startsWith("en") ? "Please provide a valid NFC UID." : "Bitte gib eine gültige NFC UID an.");
      return;
    }

    const tagRecord: Partial<NFCTag> = {
      uid: this._uid.trim().toUpperCase(),
      name: this._name.trim() || `Tonie ${this._uid.slice(-4)}`,
      description: this._description.trim(),
      image: this._image.trim(),
      media: {
        provider: this._mediaProvider,
        media_type: this._mediaType,
        media_id: this._mediaId.trim(),
        title: this._mediaTitle.trim(),
        artist: this._mediaArtist.trim(),
      },
      settings: {
        resume: this._resume,
        shuffle: this._shuffle,
        repeat: this._repeat,
        volume_limit: this._volumeLimit,
      },
      overrides: this._overrides,
    };

    this.dispatchEvent(
      new CustomEvent("save-tag-record", {
        detail: { tag: tagRecord },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onCancel() {
    this.dispatchEvent(
      new CustomEvent("cancel-tag-edit", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _addOverride() {
    if (!this._selectedOverrideBoxId) return;
    this._overrides = {
      ...this._overrides,
      [this._selectedOverrideBoxId]: {
        media: {
          provider: "music_assistant",
          media_type: "playlist",
          media_id: "",
          title: "",
        },
      },
    };
  }

  private _removeOverride(boxId: string) {
    const updated = { ...this._overrides };
    delete updated[boxId];
    this._overrides = updated;
  }

  render() {
    return html`
      <div class="editor-card">
        <div class="title-row">
          <h2 class="title">
            ${this.tag
              ? localize("editor.title_edit", this.lang)
              : localize("editor.title_new", this.lang)}
          </h2>
        </div>

        <div class="tabs-row">
          <button
            class="tab-btn ${this._activeTab === "global" ? "active" : ""}"
            @click=${() => (this._activeTab = "global")}
          >
            ${localize("editor.tab_global", this.lang)}
          </button>
          <button
            class="tab-btn ${this._activeTab === "overrides" ? "active" : ""}"
            @click=${() => (this._activeTab = "overrides")}
          >
            ${localize("editor.tab_overrides", this.lang)} (${Object.keys(this._overrides).length})
          </button>
        </div>

        ${this._activeTab === "global"
          ? html`
              <div class="form-grid">
                <!-- UID -->
                <div class="form-group full-width">
                  <label>${localize("editor.uid", this.lang)}</label>
                  <div class="uid-group">
                    <input
                      type="text"
                      placeholder=${localize("editor.uid_hint", this.lang)}
                      .value=${this._uid}
                      @input=${(e: Event) =>
                        (this._uid = (e.target as HTMLInputElement).value)}
                    />
                    <button
                      class="btn-scan"
                      @click=${() =>
                        this.dispatchEvent(
                          new CustomEvent("start-scan-learning", {
                            bubbles: true,
                            composed: true,
                          })
                        )}
                    >
                      ${localize("tags.scan_learn", this.lang)}
                    </button>
                  </div>
                </div>

                <!-- Name & Description -->
                <div class="form-group">
                  <label>${localize("editor.name", this.lang)}</label>
                  <input
                    type="text"
                    placeholder="z.B. Die drei ???"
                    .value=${this._name}
                    @input=${(e: Event) =>
                      (this._name = (e.target as HTMLInputElement).value)}
                  />
                </div>

                <div class="form-group">
                  <label>${localize("editor.image", this.lang)}</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    .value=${this._image}
                    @input=${(e: Event) =>
                      (this._image = (e.target as HTMLInputElement).value)}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${localize("editor.desc", this.lang)}</label>
                  <textarea
                    rows="2"
                    placeholder="Notizen..."
                    .value=${this._description}
                    @input=${(e: Event) =>
                      (this._description = (e.target as HTMLInputElement).value)}
                  ></textarea>
                </div>

                <!-- Media Selection -->
                <div class="form-group">
                  <label>${localize("editor.media_type", this.lang)}</label>
                  <select
                    .value=${this._mediaType}
                    @change=${(e: Event) =>
                      (this._mediaType = (e.target as HTMLSelectElement).value)}
                  >
                    <option value="playlist">${localize("tags.filter_playlist", this.lang)}</option>
                    <option value="album">${localize("tags.filter_album", this.lang)}</option>
                    <option value="audiobook">${localize("tags.filter_audiobook", this.lang)}</option>
                    <option value="track">${localize("tags.filter_track", this.lang)}</option>
                    <option value="radio">${localize("tags.filter_radio", this.lang)}</option>
                    <option value="podcast">${localize("tags.filter_podcast", this.lang)}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>${localize("editor.media_title", this.lang)}</label>
                  <input
                    type="text"
                    placeholder="Titel..."
                    .value=${this._mediaTitle}
                    @input=${(e: Event) =>
                      (this._mediaTitle = (e.target as HTMLInputElement).value)}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${localize("editor.media_id", this.lang)}</label>
                  <div class="media-search-group">
                    <input
                      type="text"
                      placeholder="spotify://playlist/..."
                      .value=${this._mediaId}
                      @input=${(e: Event) =>
                        (this._mediaId = (e.target as HTMLInputElement).value)}
                    />
                    <button
                      class="btn-search"
                      type="button"
                      @click=${this._openMediaSearchModal}
                    >
                      ${localize("editor.browse_ma", this.lang)}
                    </button>
                  </div>
                </div>

                <!-- Playback Settings -->
                <div class="form-group">
                  <label>${localize("editor.settings", this.lang)}</label>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-resume"
                      .checked=${this._resume}
                      @change=${(e: Event) =>
                        (this._resume = (e.target as HTMLInputElement).checked)}
                    />
                    <label for="cb-resume"
                      >${localize("editor.resume", this.lang)}</label
                    >
                  </div>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-shuffle"
                      .checked=${this._shuffle}
                      @change=${(e: Event) =>
                        (this._shuffle = (e.target as HTMLInputElement).checked)}
                    />
                    <label for="cb-shuffle">${localize("editor.shuffle", this.lang)}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>${localize("editor.repeat", this.lang)}</label>
                  <select
                    .value=${this._repeat}
                    @change=${(e: Event) =>
                      (this._repeat = (e.target as HTMLSelectElement).value)}
                  >
                    <option value="off">${localize("editor.repeat_off", this.lang)}</option>
                    <option value="one">${localize("editor.repeat_one", this.lang)}</option>
                    <option value="all">${localize("editor.repeat_all", this.lang)}</option>
                  </select>
                </div>
              </div>
            `
          : html`
              <!-- Overrides Tab -->
              <div class="overrides-header">
                ${localize("editor.overrides_hint", this.lang)}
              </div>

              <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <select
                  style="flex: 1;"
                  .value=${this._selectedOverrideBoxId}
                  @change=${(e: Event) =>
                    (this._selectedOverrideBoxId = (
                      e.target as HTMLSelectElement
                    ).value)}
                >
                  ${this.boxes.map(
                    (b) => html`<option value="${b.id}">${b.name}</option>`
                  )}
                </select>
                <button
                  class="btn btn-save"
                  style="white-space: nowrap;"
                  @click=${this._addOverride}
                >
                  ${localize("editor.add_override", this.lang)}
                </button>
              </div>

              ${Object.keys(this._overrides).length === 0
                ? html`<div style="text-align: center; color: #888; padding: 20px;">
                    ${this.lang.startsWith("en")
                      ? "No overrides configured. This figure behaves the same on all boxes."
                      : "Keine Overrides konfiguriert. Diese Figur verhält sich auf allen Boxen gleich."}
                  </div>`
                : Object.entries(this._overrides).map(([boxId, override]) => {
                    const box = this.boxes.find((b) => b.id === boxId);
                    return html`
                      <div class="override-item">
                        <div class="override-top">
                          <span>📻 ${box ? box.name : boxId}</span>
                          <button
                            style="background: transparent; border: none; color: #d32f2f; cursor: pointer;"
                            @click=${() => this._removeOverride(boxId)}
                          >
                            ${localize("editor.delete_override", this.lang)} ✕
                          </button>
                        </div>
                        <div class="form-group">
                          <label>${localize("editor.media_id", this.lang)}</label>
                          <input
                            type="text"
                            placeholder="playlist-id"
                            .value=${override.media?.media_id || ""}
                            @input=${(e: Event) => {
                              const val = (e.target as HTMLInputElement).value;
                              this._overrides[boxId] = {
                                ...this._overrides[boxId],
                                media: {
                                  ...(this._overrides[boxId].media || {}),
                                  media_id: val,
                                },
                              };
                            }}
                          />
                        </div>
                      </div>
                    `;
                  })}
            `}

        <div class="footer-actions">
          <button class="btn btn-cancel" @click=${this._onCancel}>
            ${localize("common.cancel", this.lang)}
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            ${localize("common.save", this.lang)}
          </button>
        </div>
      </div>

      <!-- In-place Media Search Modal -->
      ${this._showMediaModal
        ? html`
            <div class="media-modal-backdrop" @click=${this._closeMediaSearchModal}>
              <div class="media-modal-content" @click=${(e: Event) => e.stopPropagation()}>
                <div class="media-modal-header">
                  <h3 class="media-modal-title">🎵 ${localize("browser.title", this.lang)}</h3>
                  <button class="btn-close-modal" @click=${this._closeMediaSearchModal} title="Schließen">✕</button>
                </div>
                <div class="media-modal-body">
                  <form class="modal-search-row" @submit=${this._executeModalSearch}>
                    <input
                      class="modal-search-input"
                      type="search"
                      placeholder=${localize("browser.search_placeholder", this.lang)}
                      .value=${this._modalSearchQuery}
                      @input=${(e: Event) =>
                        (this._modalSearchQuery = (e.target as HTMLInputElement).value)}
                    />
                    <button
                      class="btn btn-save"
                      type="submit"
                      ?disabled=${this._modalSearching || !this._modalSearchQuery.trim()}
                    >
                      ${this._modalSearching
                        ? localize("browser.searching", this.lang)
                        : localize("browser.search_btn", this.lang)}
                    </button>
                  </form>

                  <div class="modal-results-list">
                    ${this._modalResults.map(
                      (item) => html`
                        <div class="media-result-item" @click=${() => this._selectMediaItem(item)}>
                          ${item.image
                            ? html`<img class="media-thumb" src="${item.image}" alt="Cover" />`
                            : html`<div class="media-thumb">🎵</div>`}
                          <div class="media-result-info">
                            <div class="media-result-title">${item.title}</div>
                            <div class="media-result-sub">
                              <span class="media-result-badge">${item.media_type}</span>
                              ${item.artist ? ` • ${item.artist}` : ""}
                            </div>
                          </div>
                          <button
                            class="btn-take-media"
                            type="button"
                            @click=${(e: Event) => {
                              e.stopPropagation();
                              this._selectMediaItem(item);
                            }}
                          >
                            ${localize("browser.select_btn", this.lang)}
                          </button>
                        </div>
                      `
                    )}
                    ${this._modalSearched && !this._modalSearching && this._modalResults.length === 0
                      ? html`<div style="text-align: center; color: #888; padding: 30px;">
                          ${localize("browser.no_results", this.lang)}
                        </div>`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          `
        : ""}
    `;
  }
}
