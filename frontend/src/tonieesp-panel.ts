import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TonieESPWebSocketAPI } from "./api/websocket";
import { EventLogItem, NFCTag, TonieBox } from "./types";
import { localize } from "./localize";
import { TONIEESP_ICON } from "./icon-base64";

// Import Views
import "./views/dashboard-view";
import "./views/tag-library-view";
import "./views/tag-editor-view";
import "./views/box-detail-view";
import "./views/settings-view";
import "./views/logs-view";

@customElement("tonieesp-panel")
export class TonieESPPanel extends LitElement {
  @property({ attribute: false }) hass: any;
  @property({ type: Boolean }) narrow = false;
  @property({ type: Object }) panel: any;

  @state() private _lang = "de";

  @state() private _activeView:
    | "dashboard"
    | "tags"
    | "settings"
    | "logs"
    | "editor"
    | "detail" = "dashboard";

  @state() private _boxes: TonieBox[] = [];
  @state() private _tags: NFCTag[] = [];
  @state() private _logs: EventLogItem[] = [];

  // View navigation state
  @state() private _editingTag?: NFCTag;
  @state() private _initialUid = "";
  @state() private _selectedBox?: TonieBox;

  // Scan learning modal
  @state() private _isLearning = false;
  @state() private _learnedUid: string | null = null;

  private _api?: TonieESPWebSocketAPI;
  private _unsubEvents?: () => void;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font-family: var(
        --ha-font-family,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif
      );
      box-sizing: border-box;
      overflow-y: auto;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      padding: 12px 24px;
      background: var(--card-background-color, #ffffff);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.15s ease;
      flex-shrink: 0;
    }

    .brand:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }

    .logo-img {
      width: 34px;
      height: 34px;
      object-fit: contain;
      border-radius: 6px;
      display: block;
      cursor: pointer;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: var(--primary-text-color, #111);
    }

    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      background: var(--primary-color, #03a9f4);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .nav-tabs {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }

    .nav-btn {
      background: transparent;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .nav-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--primary-text-color, #111);
    }

    .nav-btn.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .content-area {
      flex: 1;
      padding: 24px;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    @media (max-width: 768px), (max-width: 900px) and (orientation: portrait) {
      .top-bar {
        padding: 8px 12px;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }

      .brand {
        align-self: flex-start;
        justify-content: flex-start;
      }

      .nav-tabs {
        margin-left: 0;
        overflow-x: auto;
        padding-bottom: 4px;
        justify-content: flex-start;
        -webkit-overflow-scrolling: touch;
      }

      .nav-btn {
        padding: 6px 10px;
        font-size: 13px;
        flex-shrink: 0;
      }

      .content-area {
        padding: 12px;
      }
    }

    /* Learning Modal */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--card-background-color, #ffffff);
      border-radius: 14px;
      padding: 28px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .pulse-icon {
      font-size: 50px;
      margin-bottom: 14px;
      display: inline-block;
      animation: pulse 1.6s infinite ease-in-out;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(0.95);
        opacity: 0.8;
      }
    }

    .modal-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .modal-text {
      font-size: 14px;
      color: var(--secondary-text-color, #555);
      margin: 0 0 20px 0;
      line-height: 1.4;
    }

    .captured-uid {
      font-family: monospace;
      font-size: 16px;
      font-weight: 700;
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
      padding: 6px 14px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 16px;
    }

    .btn-modal {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-modal-cancel {
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, #222);
    }

    .btn-modal-use {
      background: var(--primary-color, #03a9f4);
      color: white;
      margin-left: 8px;
    }

    @media (max-width: 768px) {
      .top-bar {
        flex-direction: column;
        gap: 10px;
        padding: 12px 14px;
      }
      .nav-tabs {
        overflow-x: auto;
        width: 100%;
        padding-bottom: 4px;
      }
      .content-area {
        padding: 14px;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._updateLanguageFromHass();
  }

  private _updateLanguageFromHass() {
    const haLang = (this.hass?.locale?.language || this.hass?.language || "de").toLowerCase();
    this._lang = haLang.startsWith("de") ? "de" : "en";
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("hass") && this.hass) {
      this._updateLanguageFromHass();
      if (!this._api) {
        this._api = new TonieESPWebSocketAPI(this.hass);
        this._initData();
        this._subscribeToEvents();
      } else {
        this._api.updateHass(this.hass);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubEvents) {
      this._unsubEvents();
      this._unsubEvents = undefined;
    }
  }

  private async _initData() {
    if (!this._api) return;
    try {
      const [boxes, tags] = await Promise.all([
        this._api.getBoxes(),
        this._api.getTags(),
      ]);
      this._boxes = boxes || [];
      this._tags = tags || [];
      this._addLog("init", `TonieESP geladen: ${this._boxes.length} Boxen, ${this._tags.length} Tags`);
    } catch (err) {
      console.error("Error loading TonieESP initial data:", err);
    }
  }

  private async _subscribeToEvents() {
    if (!this._api) return;
    try {
      this._unsubEvents = await this._api.subscribeEvents((event: any) => {
        this._handleIncomingEvent(event);
      });
    } catch (err) {
      console.error("Error subscribing to TonieESP events:", err);
    }
  }

  private _handleIncomingEvent(event: any) {
    const { event_type, data } = event;

    if (event_type === "box_box_updated" || event_type === "box_box_added") {
      const updatedBox: TonieBox = data;
      this._boxes = this._boxes.map((b) => (b.id === updatedBox.id ? updatedBox : b));
      if (!this._boxes.find((b) => b.id === updatedBox.id)) {
        this._boxes = [...this._boxes, updatedBox];
      }
      this._addLog("box", `Toniebox '${updatedBox.name}' aktualisiert (Online: ${updatedBox.online})`);
    } else if (event_type === "box_box_removed") {
      this._boxes = this._boxes.filter((b) => b.id !== data.id);
      this._addLog("box", `Toniebox '${data.name}' entfernt`);
    } else if (event_type === "tag_create" || event_type === "tag_update" || event_type === "tag_delete") {
      // Refresh tags
      this._api?.getTags().then((tags) => (this._tags = tags));
      this._addLog("tag", `NFC-Bibliothek aktualisiert (${event_type})`);
    } else if (event_type === "tag_learned") {
      this._learnedUid = data.uid;
      this._addLog("learn", `Figur erfasst im Lernmodus: ${data.uid}`);
    } else {
      this._addLog("event", `${event_type}: ${JSON.stringify(data)}`);
    }
  }

  private _addLog(type: string, summary: string, details?: any) {
    const item: EventLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      summary,
      details,
    };
    this._logs = [item, ...this._logs.slice(0, 99)];
  }

  // --- Handlers for Custom Events from Child Views ---

  private async _handleBoxControl(e: CustomEvent) {
    const { boxId, action, data } = e.detail;
    if (!this._api) return;
    try {
      await this._api.controlPlayback(boxId, action, data);
      this._addLog("playback", `Action '${action}' sent to box`);
    } catch (err: any) {
      alert(localize("common.error", this._lang, { error: err?.message || err }));
    }
  }

  private async _handlePlayTagOnBox(e: CustomEvent) {
    const { tag, boxId } = e.detail;
    if (!this._api) return;
    try {
      await this._api.controlPlayback(boxId, "play_tag", { uid: tag.uid });
      this._addLog("playback", `Tag ${tag.name} (${tag.uid}) started on box`);
    } catch (err: any) {
      alert(localize("common.error", this._lang, { error: err?.message || err }));
    }
  }

  private _handleSetupUnknownTag(e: CustomEvent) {
    const { uid } = e.detail;
    this._editingTag = undefined;
    this._initialUid = uid;
    this._activeView = "editor";
  }

  private _handleOpenBoxDetails(e: CustomEvent) {
    this._selectedBox = e.detail.box;
    this._activeView = "detail";
  }

  private async _handleSaveBoxSettings(e: CustomEvent) {
    const { boxId, settings } = e.detail;
    if (!this._api) return;
    try {
      const updated = await this._api.updateBoxSettings(boxId, settings);
      this._boxes = this._boxes.map((b) => (b.id === updated.id ? updated : b));
      alert(localize("box.save_success", this._lang));
      this._activeView = "dashboard";
    } catch (err: any) {
      alert(localize("common.error", this._lang, { error: err?.message || err }));
    }
  }

  private _handleAddNewTag() {
    this._editingTag = undefined;
    this._initialUid = "";
    this._activeView = "editor";
  }

  private _handleEditTag(e: CustomEvent) {
    this._editingTag = e.detail.tag;
    this._initialUid = "";
    this._activeView = "editor";
  }

  private async _handleDeleteTag(e: CustomEvent) {
    const { tag } = e.detail;
    if (!confirm(localize("tags.confirm_delete", this._lang, { name: tag.name, uid: tag.uid }))) {
      return;
    }
    if (!this._api) return;
    try {
      await this._api.deleteTag(tag.uid);
      this._tags = this._tags.filter((t) => t.uid !== tag.uid);
      this._addLog("tag", `Tag '${tag.name}' deleted`);
    } catch (err: any) {
      alert(localize("common.error", this._lang, { error: err?.message || err }));
    }
  }

  private async _handleSaveTagRecord(e: CustomEvent) {
    const { tag } = e.detail;
    if (!this._api) return;
    try {
      const saved = await this._api.saveTag(tag);
      const existingIdx = this._tags.findIndex((t) => t.uid === saved.uid);
      if (existingIdx >= 0) {
        this._tags[existingIdx] = saved;
      } else {
        this._tags = [saved, ...this._tags];
      }
      this._tags = [...this._tags];
      this._activeView = "tags";
      this._addLog("tag", `Tag '${saved.name}' saved`);
    } catch (err: any) {
      alert(localize("common.error", this._lang, { error: err?.message || err }));
    }
  }

  private async _handleStartScanLearning() {
    this._isLearning = true;
    this._learnedUid = null;
    if (this._api) {
      await this._api.startLearning();
    }
  }

  private async _handleStopScanLearning() {
    this._isLearning = false;
    this._learnedUid = null;
    if (this._api) {
      await this._api.stopLearning();
    }
  }

  private _handleUseLearnedTag() {
    if (!this._learnedUid) return;
    const uid = this._learnedUid;
    this._handleStopScanLearning();
    this._editingTag = undefined;
    this._initialUid = uid;
    this._activeView = "editor";
  }

  private _handleBrandClick(e: MouseEvent) {
    // Clicking the logo or brand always dispatches the HA sidebar toggle event
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("hass-toggle-menu", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="brand" @click=${this._handleBrandClick} title="TonieESP (Klick auf Logo öffnet HA-Seitenleiste)">
          <img class="logo-img" src="${TONIEESP_ICON}" alt="TonieESP" />
          <span class="brand-title">TonieESP</span>
          <span class="brand-badge">PRO</span>
        </div>

        <nav class="nav-tabs">
          <button
            class="nav-btn ${this._activeView === "dashboard" ? "active" : ""}"
            @click=${() => (this._activeView = "dashboard")}
          >
            📊 ${localize("nav.dashboard", this._lang)}
          </button>
          <button
            class="nav-btn ${this._activeView === "tags" || this._activeView === "editor"
              ? "active"
              : ""}"
            @click=${() => (this._activeView = "tags")}
          >
            🧸 ${localize("nav.tags", this._lang)} (${this._tags.length})
          </button>
          <button
            class="nav-btn ${this._activeView === "settings" ? "active" : ""}"
            @click=${() => (this._activeView = "settings")}
          >
            ⚙️ ${localize("nav.settings", this._lang)}
          </button>
          <button
            class="nav-btn ${this._activeView === "logs" ? "active" : ""}"
            @click=${() => (this._activeView = "logs")}
          >
            📋 ${localize("nav.logs", this._lang)}
          </button>
        </nav>
      </header>

      <!-- Main View Area -->
      <main
        class="content-area"
        @box-control=${this._handleBoxControl}
        @play-tag-on-box=${this._handlePlayTagOnBox}
        @setup-unknown-tag=${this._handleSetupUnknownTag}
        @open-box-details=${this._handleOpenBoxDetails}
        @save-box-settings=${this._handleSaveBoxSettings}
        @back-to-dashboard=${() => (this._activeView = "dashboard")}
        @add-new-tag=${this._handleAddNewTag}
        @edit-tag=${this._handleEditTag}
        @delete-tag=${this._handleDeleteTag}
        @save-tag-record=${this._handleSaveTagRecord}
        @cancel-tag-edit=${() => (this._activeView = "tags")}
        @start-scan-learning=${this._handleStartScanLearning}
        @tags-imported=${() => this._api?.getTags().then((t) => (this._tags = t))}
        @clear-logs=${() => (this._logs = [])}
      >
        ${this._activeView === "dashboard"
          ? html`<tonieesp-dashboard-view
              .boxes=${this._boxes}
              .tags=${this._tags}
              .lang=${this._lang}
            ></tonieesp-dashboard-view>`
          : ""}
        ${this._activeView === "tags"
          ? html`<tonieesp-tag-library-view
              .tags=${this._tags}
              .boxes=${this._boxes}
              .lang=${this._lang}
            ></tonieesp-tag-library-view>`
          : ""}
        ${this._activeView === "editor"
          ? html`<tonieesp-tag-editor-view
              .tag=${this._editingTag}
              .boxes=${this._boxes}
              .initialUid=${this._initialUid}
              .lang=${this._lang}
              .api=${this._api}
            ></tonieesp-tag-editor-view>`
          : ""}
        ${this._activeView === "detail" && this._selectedBox
          ? html`<tonieesp-box-detail-view
              .box=${this._selectedBox}
              .lang=${this._lang}
            ></tonieesp-box-detail-view>`
          : ""}
        ${this._activeView === "settings"
          ? html`<tonieesp-settings-view
              .api=${this._api}
              .lang=${this._lang}
            ></tonieesp-settings-view>`
          : ""}
        ${this._activeView === "logs"
          ? html`<tonieesp-logs-view
              .logs=${this._logs}
              .lang=${this._lang}
            ></tonieesp-logs-view>`
          : ""}
      </main>

      <!-- Scan Learning Modal Dialog -->
      ${this._isLearning
        ? html`
            <div class="modal-backdrop">
              <div class="modal-content">
                <div class="pulse-icon">📡</div>
                <h3 class="modal-title">${localize("learn.title", this._lang)}</h3>
                <p class="modal-text">
                  ${localize("learn.instructions", this._lang)}
                </p>

                ${this._learnedUid
                  ? html`
                      <div class="captured-uid">UID: ${this._learnedUid}</div>
                      <div>
                        <button
                          class="btn-modal btn-modal-cancel"
                          @click=${this._handleStopScanLearning}
                        >
                          ${localize("learn.close", this._lang)}
                        </button>
                        <button
                          class="btn-modal btn-modal-use"
                          @click=${this._handleUseLearnedTag}
                        >
                          ${localize("learn.use_btn", this._lang)}
                        </button>
                      </div>
                    `
                  : html`
                      <button
                        class="btn-modal btn-modal-cancel"
                        @click=${this._handleStopScanLearning}
                      >
                        ${localize("learn.cancel", this._lang)}
                      </button>
                    `}
              </div>
            </div>
          `
        : ""}
    `;
  }
}
