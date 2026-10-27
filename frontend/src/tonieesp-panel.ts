import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TonieESPWebSocketAPI } from "./api/websocket";
import { EventLogItem, MediaSearchResult, NFCTag, TonieBox } from "./types";

// Import Views
import "./views/dashboard-view";
import "./views/tag-library-view";
import "./views/tag-editor-view";
import "./views/media-browser-view";
import "./views/box-detail-view";
import "./views/settings-view";
import "./views/logs-view";

@customElement("tonieesp-panel")
export class TonieESPPanel extends LitElement {
  @property({ attribute: false }) hass: any;
  @property({ type: Boolean }) narrow = false;
  @property({ type: Object }) panel: any;

  @state() private _activeView:
    | "dashboard"
    | "tags"
    | "browser"
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
      justify-content: space-between;
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
    }

    .logo {
      font-size: 26px;
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

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("hass") && this.hass) {
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
      this._addLog("playback", `Aktion '${action}' an Box gesendet`);
    } catch (err: any) {
      alert(`Wiedergabefehler: ${err?.message || err}`);
    }
  }

  private async _handlePlayTagOnBox(e: CustomEvent) {
    const { tag, boxId } = e.detail;
    if (!this._api) return;
    try {
      await this._api.controlPlayback(boxId, "play_tag", { uid: tag.uid });
      this._addLog("playback", `Tag ${tag.name} (${tag.uid}) auf Box gestartet`);
    } catch (err: any) {
      alert(`Fehler beim Abspielen: ${err?.message || err}`);
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
      alert("Einstellungen erfolgreich gespeichert!");
      this._activeView = "dashboard";
    } catch (err: any) {
      alert(`Fehler beim Speichern: ${err?.message || err}`);
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
    if (!confirm(`Soll die Figur '${tag.name}' (${tag.uid}) wirklich gelöscht werden?`)) {
      return;
    }
    if (!this._api) return;
    try {
      await this._api.deleteTag(tag.uid);
      this._tags = this._tags.filter((t) => t.uid !== tag.uid);
      this._addLog("tag", `Figur '${tag.name}' gelöscht`);
    } catch (err: any) {
      alert(`Fehler beim Löschen: ${err?.message || err}`);
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
      this._addLog("tag", `Figur '${saved.name}' gespeichert`);
    } catch (err: any) {
      alert(`Fehler beim Speichern der Figur: ${err?.message || err}`);
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

  private _handleMediaSelectedFromBrowser(e: CustomEvent) {
    const mediaItem: MediaSearchResult = e.detail;
    this._activeView = "editor";
    const editor = this.shadowRoot?.querySelector("tonieesp-tag-editor-view") as any;
    if (editor && editor.setMediaSelection) {
      editor.setMediaSelection(mediaItem);
    }
  }

  render() {
    return html`
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="brand" @click=${() => (this._activeView = "dashboard")}>
          <span class="logo">📻</span>
          <span class="brand-title">TonieESP</span>
          <span class="brand-badge">PRO</span>
        </div>

        <nav class="nav-tabs">
          <button
            class="nav-btn ${this._activeView === "dashboard" ? "active" : ""}"
            @click=${() => (this._activeView = "dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            class="nav-btn ${this._activeView === "tags" || this._activeView === "editor"
              ? "active"
              : ""}"
            @click=${() => (this._activeView = "tags")}
          >
            🧸 NFC-Figuren (${this._tags.length})
          </button>
          <button
            class="nav-btn ${this._activeView === "browser" ? "active" : ""}"
            @click=${() => (this._activeView = "browser")}
          >
            🎵 Mediathek
          </button>
          <button
            class="nav-btn ${this._activeView === "settings" ? "active" : ""}"
            @click=${() => (this._activeView = "settings")}
          >
            ⚙️ Einstellungen
          </button>
          <button
            class="nav-btn ${this._activeView === "logs" ? "active" : ""}"
            @click=${() => (this._activeView = "logs")}
          >
            📋 Logs
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
        @open-media-browser=${() => (this._activeView = "browser")}
        @media-selected=${this._handleMediaSelectedFromBrowser}
        @start-scan-learning=${this._handleStartScanLearning}
        @tags-imported=${() => this._api?.getTags().then((t) => (this._tags = t))}
        @clear-logs=${() => (this._logs = [])}
      >
        ${this._activeView === "dashboard"
          ? html`<tonieesp-dashboard-view
              .boxes=${this._boxes}
              .tags=${this._tags}
            ></tonieesp-dashboard-view>`
          : ""}
        ${this._activeView === "tags"
          ? html`<tonieesp-tag-library-view
              .tags=${this._tags}
              .boxes=${this._boxes}
            ></tonieesp-tag-library-view>`
          : ""}
        ${this._activeView === "editor"
          ? html`<tonieesp-tag-editor-view
              .tag=${this._editingTag}
              .boxes=${this._boxes}
              .initialUid=${this._initialUid}
            ></tonieesp-tag-editor-view>`
          : ""}
        ${this._activeView === "detail" && this._selectedBox
          ? html`<tonieesp-box-detail-view
              .box=${this._selectedBox}
            ></tonieesp-box-detail-view>`
          : ""}
        ${this._activeView === "browser"
          ? html`<tonieesp-media-browser-view
              .api=${this._api}
            ></tonieesp-media-browser-view>`
          : ""}
        ${this._activeView === "settings"
          ? html`<tonieesp-settings-view .api=${this._api}></tonieesp-settings-view>`
          : ""}
        ${this._activeView === "logs"
          ? html`<tonieesp-logs-view .logs=${this._logs}></tonieesp-logs-view>`
          : ""}
      </main>

      <!-- Scan Learning Modal Dialog -->
      ${this._isLearning
        ? html`
            <div class="modal-backdrop">
              <div class="modal-content">
                <div class="pulse-icon">📡</div>
                <h3 class="modal-title">Scan-Lernmodus aktiv</h3>
                <p class="modal-text">
                  Stelle jetzt eine NFC-Figur auf eine beliebige Toniebox. Die
                  UID wird direkt empfangen.
                </p>

                ${this._learnedUid
                  ? html`
                      <div class="captured-uid">UID: ${this._learnedUid}</div>
                      <div>
                        <button
                          class="btn-modal btn-modal-cancel"
                          @click=${this._handleStopScanLearning}
                        >
                          Schließen
                        </button>
                        <button
                          class="btn-modal btn-modal-use"
                          @click=${this._handleUseLearnedTag}
                        >
                          Figur einrichten →
                        </button>
                      </div>
                    `
                  : html`
                      <button
                        class="btn-modal btn-modal-cancel"
                        @click=${this._handleStopScanLearning}
                      >
                        Abbrechen
                      </button>
                    `}
              </div>
            </div>
          `
        : ""}
    `;
  }
}
