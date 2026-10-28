import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DiagnosticsData } from "../types";
import { localize } from "../localize";

@customElement("tonieesp-settings-view")
export class TonieESPSettingsView extends LitElement {
  @property({ type: Object }) api: any;
  @property({ type: String }) lang = "de";

  @state() private _diagnostics: DiagnosticsData | null = null;
  @state() private _overwrite = false;
  @state() private _message = "";
  @state() private _isError = false;

  static styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 16px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    @media (min-width: 640px) {
      .container {
        padding: 24px;
      }
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color, #666);
      margin-bottom: 24px;
    }

    .card-block {
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .block-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin: 0 0 6px 0;
    }

    .block-desc {
      font-size: 13px;
      color: var(--secondary-text-color, #555);
      margin: 0 0 14px 0;
    }

    .btn {
      padding: 10px 18px;
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
      color: white;
    }

    .btn-secondary {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      font-size: 13px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .alert-success {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .alert-error {
      background: rgba(244, 67, 54, 0.15);
      color: #c62828;
    }

    input[type="file"] {
      display: none;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadDiagnostics();
  }

  private async _loadDiagnostics() {
    if (!this.api) return;
    try {
      this._diagnostics = await this.api.getDiagnostics();
    } catch (err) {
      console.error("Error loading diagnostics:", err);
    }
  }

  private async _exportTags() {
    if (!this.api) return;
    try {
      const tags = await this.api.exportTags();
      const blob = new Blob([JSON.stringify(tags, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tonieesp-tags-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this._showMessage(localize("common.save_success", this.lang), false);
    } catch (err: any) {
      this._showMessage(localize("common.error", this.lang, { error: err?.message || err }), true);
    }
  }

  private _triggerFileInput() {
    const input = this.shadowRoot?.querySelector("#file-input") as HTMLInputElement;
    if (input) input.click();
  }

  private async _onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (!Array.isArray(json)) {
          throw new Error("Invalid format. Expected a JSON array.");
        }
        const res = await this.api.importTags(json, this._overwrite);
        this._showMessage(
          this.lang.startsWith("en")
            ? `Successfully imported: ${res.count} tags added / updated.`
            : `Erfolgreich importiert: ${res.count} Figuren hinzugefügt / aktualisiert.`,
          false
        );
        this.dispatchEvent(new CustomEvent("tags-imported", { bubbles: true, composed: true }));
      } catch (err: any) {
        this._showMessage(localize("common.error", this.lang, { error: err?.message || err }), true);
      }
    };
    reader.readAsText(file);
    input.value = "";
  }

  private _showMessage(msg: string, isErr: boolean) {
    this._message = msg;
    this._isError = isErr;
    setTimeout(() => {
      this._message = "";
    }, 5000);
  }

  render() {
    return html`
      <div class="container">
        <h2 class="title">${localize("settings.title", this.lang)}</h2>
        <p class="subtitle">
          ${localize("settings.subtitle", this.lang)}
        </p>

        ${this._message
          ? html`
              <div
                class="alert ${this._isError ? "alert-error" : "alert-success"}"
              >
                ${this._message}
              </div>
            `
          : ""}

        <!-- Export -->
        <div class="card-block">
          <h3 class="block-title">${localize("settings.export", this.lang)}</h3>
          <p class="block-desc">
            ${localize("settings.export_desc", this.lang)}
          </p>
          <button class="btn btn-secondary" @click=${this._exportTags}>
            📥 ${localize("settings.export_btn", this.lang)}
          </button>
        </div>

        <!-- Import -->
        <div class="card-block">
          <h3 class="block-title">${localize("settings.import", this.lang)}</h3>
          <p class="block-desc">
            ${localize("settings.import_desc", this.lang)}
          </p>
          <div class="checkbox-row">
            <input
              type="checkbox"
              id="cb-overwrite"
              .checked=${this._overwrite}
              @change=${(e: Event) =>
                (this._overwrite = (e.target as HTMLInputElement).checked)}
            />
            <label for="cb-overwrite"
              >${localize("settings.overwrite", this.lang)}</label
            >
          </div>
          <input
            type="file"
            id="file-input"
            accept=".json"
            @change=${this._onFileSelected}
          />
          <button class="btn btn-primary" @click=${this._triggerFileInput}>
            📤 ${localize("settings.import_btn", this.lang)}
          </button>
        </div>

        <!-- Diagnostics -->
        ${this._diagnostics
          ? html`
              <div class="card-block">
                <h3 class="block-title">${localize("settings.diagnostics", this.lang)}</h3>
                <p class="block-desc">
                  Tonieboxes: <strong>${this._diagnostics.box_count}</strong> |
                  Tags: <strong>${this._diagnostics.tag_count}</strong> |
                  Music Assistant:
                  <strong
                    style="color: ${this._diagnostics.music_assistant_available
                      ? "#2e7d32"
                      : "#c62828"};"
                  >
                    ${this._diagnostics.music_assistant_available
                      ? (this.lang.startsWith("en") ? "Connected" : "Verbunden")
                      : (this.lang.startsWith("en") ? "Unavailable" : "Nicht verfügbar")}
                  </strong>
                </p>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
