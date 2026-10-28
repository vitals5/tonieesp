import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  BrowseImagesResult,
  DeviceOverride,
  MediaSearchResult,
  NFCTag,
  TonieBox,
} from "../types";
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

  // Cover Image Media Explorer Modal state
  @state() private _showImageModal = false;
  @state() private _imageModalTab: "local" | "presets" | "media" = "local";
  @state() private _imageModalLoading = false;
  @state() private _imageModalData?: BrowseImagesResult;
  @state() private _imageFilterQuery = "";
  @state() private _imageMediaSearchQuery = "";
  @state() private _imageMediaSearching = false;
  @state() private _imageMediaResults: MediaSearchResult[] = [];

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

    .editor-card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 16px 12px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
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
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
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
      white-space: nowrap;
      flex-shrink: 0;
    }

    .tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    /* DEFAULT (MOBILE FIRST): Single-column, full width */
    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      min-width: 0;
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
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .uid-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .uid-group input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      font-family: monospace;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .btn-scan {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      white-space: nowrap;
    }

    .media-search-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .media-search-group input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .btn-search {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }

    .image-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .image-input-group input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .btn-image-browse {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-image-browse:hover {
      background: rgba(0, 0, 0, 0.08);
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
      flex-shrink: 0;
    }

    .preview-box {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--secondary-background-color, #f9f9f9);
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .preview-thumb {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      object-fit: cover;
      background: #e0e0e0;
      flex-shrink: 0;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .preview-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preview-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .btn-clear-image {
      background: transparent;
      border: none;
      color: #e53935;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 0;
      text-align: left;
      width: fit-content;
    }

    .btn-clear-image:hover {
      text-decoration: underline;
    }

    /* Overrides section */
    .overrides-header {
      background: var(--secondary-background-color, #f8f9fa);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--secondary-text-color, #555);
      box-sizing: border-box;
    }

    .override-item {
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      background: var(--card-background-color, #fff);
      box-sizing: border-box;
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
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
      width: 100%;
    }

    .btn {
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }

    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .btn-cancel {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    /* DESKTOP & TABLET: Screen width >= 768px */
    @media (min-width: 768px) {
      .editor-card {
        padding: 24px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .full-width {
        grid-column: span 2;
      }

      .uid-group {
        flex-direction: row;
      }

      .uid-group input {
        flex: 1;
        width: auto;
      }

      .btn-scan {
        width: auto;
        padding: 0 16px;
      }

      .image-input-group {
        flex-direction: row;
      }

      .image-input-group input {
        flex: 1;
        width: auto;
      }

      .btn-image-browse {
        width: auto;
        padding: 0 16px;
      }

      .media-search-group {
        flex-direction: row;
      }

      .media-search-group input {
        flex: 1;
        width: auto;
      }

      .btn-search {
        width: auto;
        padding: 0 16px;
      }

      .footer-actions {
        flex-direction: row;
        justify-content: flex-end;
      }

      .footer-actions .btn {
        width: auto;
        padding: 10px 20px;
      }
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
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;
      width: 100%;
    }

    .modal-search-input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    @media (min-width: 480px) {
      .modal-search-row {
        flex-direction: row;
      }
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

    /* Cover Image Explorer Modal Styles */
    .image-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 12px;
      box-sizing: border-box;
    }

    .image-modal-content {
      background: var(--card-background-color, #ffffff);
      border-radius: 14px;
      width: 100%;
      max-width: 720px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
      overflow: hidden;
      box-sizing: border-box;
    }

    .image-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #eee);
    }

    .image-modal-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      color: var(--primary-text-color, #111);
    }

    .image-modal-tabs {
      display: flex;
      gap: 8px;
      padding: 10px 16px;
      background: var(--secondary-background-color, #f8f9fa);
      border-bottom: 1px solid var(--divider-color, #eee);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
    }

    .img-tab-btn {
      background: transparent;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .img-tab-btn.active {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .image-modal-body {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-sizing: border-box;
    }

    .explorer-nav-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    @media (min-width: 540px) {
      .explorer-nav-row {
        flex-direction: row;
        align-items: center;
      }
    }

    .breadcrumbs-bar {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 13px;
      padding: 8px 12px;
      background: var(--secondary-background-color, #f4f5f7);
      border-radius: 8px;
      min-width: 0;
    }

    .breadcrumb-item {
      cursor: pointer;
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
      white-space: nowrap;
    }

    .breadcrumb-item:hover {
      text-decoration: underline;
    }

    .breadcrumb-sep {
      color: var(--secondary-text-color, #999);
    }

    .breadcrumb-current {
      color: var(--primary-text-color, #333);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .explorer-filter-input {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      font-size: 13px;
      min-width: 160px;
      box-sizing: border-box;
    }

    .section-label {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-text-color, #444);
      margin-top: 4px;
    }

    .folders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr));
      gap: 10px;
      width: 100%;
    }

    .folder-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--card-background-color, #ffffff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      min-width: 0;
    }

    .folder-card:hover {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(3, 169, 244, 0.04);
    }

    .folder-icon {
      font-size: 18px;
    }

    .folder-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 125px), 1fr));
      gap: 12px;
      width: 100%;
    }

    .image-card {
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, #ffffff);
      border: 1px solid var(--divider-color, #e2e8f0);
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }

    .image-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      border-color: var(--primary-color, #03a9f4);
    }

    .image-card-thumb {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background: #f0f0f0;
      display: block;
    }

    .image-card-title {
      padding: 8px;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color, #333);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    .presets-intro {
      font-size: 13px;
      color: var(--secondary-text-color, #666);
    }

    .presets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 110px), 1fr));
      gap: 12px;
      width: 100%;
    }

    .preset-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      background: var(--card-background-color, #ffffff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }

    .preset-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-color, #03a9f4);
    }

    .preset-img {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .preset-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      line-height: 1.2;
    }

    .explorer-empty-box {
      text-align: center;
      padding: 30px 16px;
      color: var(--secondary-text-color, #666);
      background: var(--secondary-background-color, #f9f9f9);
      border-radius: 8px;
      border: 1px dashed var(--divider-color, #ccc);
    }

    .explorer-empty-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .explorer-empty-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-text-color, #222);
      margin-bottom: 6px;
    }

    .explorer-empty-hint {
      font-size: 12px;
      line-height: 1.4;
      max-width: 440px;
      margin: 0 auto;
    }

    .current-media-art-box {
      background: var(--secondary-background-color, #f9f9f9);
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #eee);
    }

    .current-media-art-card {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .current-media-thumb {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      object-fit: cover;
      background: #e0e0e0;
    }

    .current-media-info {
      flex: 1;
      min-width: 0;
    }

    .current-media-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
    }

    .current-media-sub {
      font-size: 11px;
      color: var(--secondary-text-color, #777);
      text-transform: capitalize;
    }

    .modal-loading-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 40px;
      color: var(--secondary-text-color, #666);
      font-size: 14px;
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

  // --- Cover Image Explorer Methods ---
  private async _openImageExplorerModal() {
    this._showImageModal = true;
    this._imageFilterQuery = "";
    if (!this._imageModalData) {
      await this._loadImageFolder("");
    }
  }

  private _closeImageExplorerModal() {
    this._showImageModal = false;
  }

  private async _loadImageFolder(mediaContentId = "") {
    if (!this.api) return;
    this._imageModalLoading = true;
    try {
      this._imageModalData = await this.api.browseImages(mediaContentId);
    } catch (err) {
      console.error("Error browsing images:", err);
    } finally {
      this._imageModalLoading = false;
    }
  }

  private _selectCoverImage(url: string) {
    this._image = url;
    this._showImageModal = false;
  }

  private async _searchImageMedia(e?: Event) {
    if (e) e.preventDefault();
    if (!this._imageMediaSearchQuery.trim() || !this.api) return;
    this._imageMediaSearching = true;
    try {
      const res = await this.api.searchMedia(
        this._imageMediaSearchQuery.trim(),
        ["album", "playlist", "track"]
      );
      this._imageMediaResults = (res || []).filter(
        (item: MediaSearchResult) => !!item.image
      );
    } catch (err) {
      console.error("Error searching media images:", err);
      this._imageMediaResults = [];
    } finally {
      this._imageMediaSearching = false;
    }
  }

  private _renderLocalMediaTab() {
    if (this._imageModalLoading) {
      return html`
        <div class="modal-loading-box">
          <span>⏳ ${localize("image_modal.loading", this.lang)}</span>
        </div>
      `;
    }

    const data = this._imageModalData;
    if (!data) return html``;

    const filter = this._imageFilterQuery.trim().toLowerCase();
    const directories = (data.directories || []).filter(
      (d) => !filter || d.title.toLowerCase().includes(filter)
    );
    const images = (data.images || []).filter(
      (img) => !filter || img.title.toLowerCase().includes(filter)
    );

    const parents = data.parents || [];
    const parentFolder = parents.length > 0 ? parents[parents.length - 1] : null;

    return html`
      <!-- Breadcrumb Bar -->
      <div class="explorer-breadcrumbs">
        <button
          class="crumb-btn ${!data.current?.media_content_id ? "active" : ""}"
          type="button"
          @click=${() => this._loadImageFolder("")}
        >
          🏠 ${localize("image_modal.root", this.lang)}
        </button>
        ${parents.map(
          (b) => html`
            <span class="crumb-separator">/</span>
            <button
              class="crumb-btn"
              type="button"
              @click=${() => this._loadImageFolder(b.media_content_id)}
            >
              ${b.title}
            </button>
          `
        )}
        ${data.current?.media_content_id
          ? html`
              <span class="crumb-separator">/</span>
              <span class="crumb-btn active">${data.current.title}</span>
            `
          : ""}
      </div>

      <!-- Filter Query Input -->
      <div style="margin-bottom: 12px; width: 100%;">
        <input
          class="modal-search-input"
          type="search"
          placeholder=${localize("image_modal.filter_placeholder", this.lang)}
          .value=${this._imageFilterQuery}
          @input=${(e: Event) =>
            (this._imageFilterQuery = (e.target as HTMLInputElement).value)}
        />
      </div>

      <!-- Directories & Parent Navigation -->
      ${parentFolder
        ? html`
            <div style="margin-bottom: 10px;">
              <button
                class="folder-card"
                type="button"
                style="width: 100%;"
                @click=${() => this._loadImageFolder(parentFolder.media_content_id)}
              >
                <span class="folder-icon">⬆️</span>
                <span class="folder-name">.. (${parentFolder.title})</span>
              </button>
            </div>
          `
        : ""}

      ${directories.length > 0
        ? html`
            <div class="folders-grid" style="margin-bottom: 16px;">
              ${directories.map(
                (dir) => html`
                  <div
                    class="folder-card"
                    @click=${() => this._loadImageFolder(dir.media_content_id)}
                  >
                    <span class="folder-icon">📁</span>
                    <span class="folder-name" title="${dir.title}">${dir.title}</span>
                  </div>
                `
              )}
            </div>
          `
        : ""}

      <!-- Images Grid -->
      ${images.length > 0
        ? html`
            <div class="images-grid">
              ${images.map(
                (img) => html`
                  <div
                    class="image-card"
                    @click=${() => this._selectCoverImage(img.url)}
                  >
                    <img
                      class="image-card-thumb"
                      src="${img.thumbnail || img.url}"
                      alt="${img.title}"
                      loading="lazy"
                    />
                    <div class="image-card-title" title="${img.title}">
                      ${img.title}
                    </div>
                  </div>
                `
              )}
            </div>
          `
        : directories.length === 0
          ? html`
              <div class="explorer-empty-box">
                <div class="explorer-empty-icon">🖼️</div>
                <div class="explorer-empty-title">
                  ${localize("image_modal.no_images", this.lang)}
                </div>
                <div class="explorer-empty-hint">
                  ${localize("image_modal.no_images_hint", this.lang)}
                </div>
              </div>
            `
          : ""}
    `;
  }

  private _renderPresetsTab() {
    const presets = this._imageModalData?.presets || [];
    return html`
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="presets-intro">
          ${this.lang.startsWith("en")
            ? "Choose a colorful Tonie figurine icon for your tag. These icons work offline without any external hosting."
            : "Wähle eine farbige Tonie-Figur als Icon für diesen Tag. Die Icons funktionieren sofort offline ohne externen Speicher."}
        </div>
        <div class="presets-grid">
          ${presets.map(
            (p) => html`
              <div
                class="preset-card"
                @click=${() => this._selectCoverImage(p.url)}
              >
                <img class="preset-img" src="${p.url}" alt="${p.title}" />
                <span class="preset-name">${p.title}</span>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private _renderMediaCoverTab() {
    return html`
      <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
        <!-- Option to use current media item's cover if available -->
        ${this._image
          ? html`
              <div class="current-media-art-box">
                <div style="font-size: 12px; font-weight: 600; color: #555;">
                  ${localize("image_modal.use_current_media_art", this.lang)}
                </div>
                <div class="current-media-art-card">
                  <img class="current-media-thumb" src="${this._image}" alt="Cover" />
                  <div class="current-media-info">
                    <div class="current-media-title">${this._mediaTitle || "Aktuelles Medium"}</div>
                    <div class="current-media-sub">${this._mediaType}</div>
                  </div>
                </div>
              </div>
            `
          : ""}

        <!-- Search Music Assistant for artwork -->
        <form class="modal-search-row" @submit=${this._searchImageMedia}>
          <input
            class="modal-search-input"
            type="search"
            placeholder=${localize("image_modal.search_ma_placeholder", this.lang)}
            .value=${this._imageMediaSearchQuery}
            @input=${(e: Event) =>
              (this._imageMediaSearchQuery = (e.target as HTMLInputElement).value)}
          />
          <button
            class="btn btn-save"
            type="submit"
            ?disabled=${this._imageMediaSearching || !this._imageMediaSearchQuery.trim()}
          >
            ${this._imageMediaSearching
              ? localize("browser.searching", this.lang)
              : localize("browser.search_btn", this.lang)}
          </button>
        </form>

        ${this._imageMediaResults.length > 0
          ? html`
              <div class="images-grid">
                ${this._imageMediaResults.map(
                  (item) => html`
                    <div
                      class="image-card"
                      @click=${() => this._selectCoverImage(item.image!)}
                    >
                      <img
                        class="image-card-thumb"
                        src="${item.image}"
                        alt="${item.title}"
                        loading="lazy"
                      />
                      <div class="image-card-title" title="${item.title}">
                        ${item.title}
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }

  private _renderImageExplorerModal() {
    return html`
      <div class="image-modal-backdrop" @click=${this._closeImageExplorerModal}>
        <div class="image-modal-content" @click=${(e: Event) => e.stopPropagation()}>
          <div class="image-modal-header">
            <h3 class="image-modal-title">🖼️ ${localize("image_modal.title", this.lang)}</h3>
            <button
              class="btn-close-modal"
              type="button"
              @click=${this._closeImageExplorerModal}
              title="Schließen"
            >
              ✕
            </button>
          </div>

          <div class="image-modal-tabs">
            <button
              class="image-modal-tab-btn ${this._imageModalTab === "local" ? "active" : ""}"
              type="button"
              @click=${() => {
                this._imageModalTab = "local";
                if (!this._imageModalData) this._loadImageFolder("");
              }}
            >
              ${localize("image_modal.tab_local", this.lang)}
            </button>
            <button
              class="image-modal-tab-btn ${this._imageModalTab === "presets" ? "active" : ""}"
              type="button"
              @click=${() => {
                this._imageModalTab = "presets";
                if (!this._imageModalData) this._loadImageFolder("");
              }}
            >
              ${localize("image_modal.tab_presets", this.lang)}
            </button>
            <button
              class="image-modal-tab-btn ${this._imageModalTab === "media" ? "active" : ""}"
              type="button"
              @click=${() => (this._imageModalTab = "media")}
            >
              ${localize("image_modal.tab_media", this.lang)}
            </button>
          </div>

          <div class="image-modal-body">
            ${this._imageModalTab === "local"
              ? this._renderLocalMediaTab()
              : this._imageModalTab === "presets"
                ? this._renderPresetsTab()
                : this._renderMediaCoverTab()}
          </div>
        </div>
      </div>
    `;
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

                <div class="form-group full-width">
                  <label>${localize("editor.image", this.lang)}</label>
                  <div class="image-input-group">
                    <input
                      type="text"
                      placeholder="https://... oder /local/..."
                      .value=${this._image}
                      @input=${(e: Event) =>
                        (this._image = (e.target as HTMLInputElement).value)}
                    />
                    <button
                      class="btn-image-browse"
                      type="button"
                      @click=${this._openImageExplorerModal}
                    >
                      🖼️ ${localize("editor.browse_image", this.lang)}
                    </button>
                  </div>
                  ${this._image
                    ? html`
                        <div class="preview-box">
                          <img
                            class="preview-thumb"
                            src="${this._image}"
                            alt="Cover"
                            @error=${(e: Event) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div class="preview-info">
                            <div class="preview-label">${this._image}</div>
                            <button
                              class="btn-clear-image"
                              type="button"
                              @click=${() => (this._image = "")}
                            >
                              ✕ ${localize("editor.clear_image", this.lang)}
                            </button>
                          </div>
                        </div>
                      `
                    : ""}
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

      <!-- Cover Image Explorer Modal -->
      ${this._showImageModal ? this._renderImageExplorerModal() : ""}
    `;
  }
}
