/**
 * WebSocket API client for TonieESP
 */

import {
  BrowseImagesResult,
  DiagnosticsData,
  MediaSearchResult,
  NFCTag,
  TonieBox,
} from "../types";

export class TonieESPWebSocketAPI {
  private hass: any;

  constructor(hass: any) {
    this.hass = hass;
  }

  public updateHass(hass: any): void {
    this.hass = hass;
  }

  // --- Boxes ---

  public async getBoxes(): Promise<TonieBox[]> {
    return this.hass.callWS({ type: "tonieesp/boxes/list" });
  }

  public async updateBoxSettings(boxId: string, settings: any): Promise<TonieBox> {
    return this.hass.callWS({
      type: "tonieesp/boxes/update",
      box_id: boxId,
      settings: settings,
    });
  }

  // --- Tags ---

  public async getTags(search?: string, mediaType?: string): Promise<NFCTag[]> {
    return this.hass.callWS({
      type: "tonieesp/tags/list",
      search: search || undefined,
      media_type: mediaType || undefined,
    });
  }

  public async getTag(uid: string): Promise<NFCTag> {
    return this.hass.callWS({
      type: "tonieesp/tags/get",
      uid: uid,
    });
  }

  public async saveTag(tag: Partial<NFCTag>): Promise<NFCTag> {
    return this.hass.callWS({
      type: "tonieesp/tags/save",
      tag: tag,
    });
  }

  public async deleteTag(uid: string): Promise<{ deleted: boolean }> {
    return this.hass.callWS({
      type: "tonieesp/tags/delete",
      uid: uid,
    });
  }

  public async importTags(tags: any[], overwrite = false): Promise<{ count: number }> {
    return this.hass.callWS({
      type: "tonieesp/tags/import",
      tags: tags,
      overwrite: overwrite,
    });
  }

  public async exportTags(): Promise<NFCTag[]> {
    return this.hass.callWS({
      type: "tonieesp/tags/export",
    });
  }

  // --- Learning Mode ---

  public async startLearning(deviceId?: string, timeout = 60): Promise<{ active: boolean }> {
    return this.hass.callWS({
      type: "tonieesp/tags/learn_start",
      device_id: deviceId || undefined,
      timeout: timeout,
    });
  }

  public async stopLearning(): Promise<{ active: boolean }> {
    return this.hass.callWS({
      type: "tonieesp/tags/learn_stop",
    });
  }

  // --- Media Search & Cover Browsing ---

  public async searchMedia(query: string, mediaTypes?: string[]): Promise<MediaSearchResult[]> {
    return this.hass.callWS({
      type: "tonieesp/media/search",
      query: query,
      media_types: mediaTypes,
    });
  }

  public async browseImages(mediaContentId = ""): Promise<BrowseImagesResult> {
    return this.hass.callWS({
      type: "tonieesp/media/browse_images",
      media_content_id: mediaContentId,
    });
  }

  // --- Playback Control ---

  public async controlPlayback(boxId: string, action: string, data?: any): Promise<void> {
    return this.hass.callWS({
      type: "tonieesp/playback/control",
      box_id: boxId,
      action: action,
      data: data,
    });
  }

  // --- Diagnostics ---

  public async getDiagnostics(): Promise<DiagnosticsData> {
    return this.hass.callWS({
      type: "tonieesp/diagnostics",
    });
  }

  // --- Realtime Event Subscription ---

  public async subscribeEvents(callback: (event: any) => void): Promise<() => void> {
    if (this.hass?.connection?.subscribeMessage) {
      return this.hass.connection.subscribeMessage(callback, {
        type: "tonieesp/events/subscribe",
      });
    }
    return () => {};
  }
}
