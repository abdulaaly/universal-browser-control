// Universal AI Browser Control - Extension Bridge Connection & Action Router

import { CdpEngine } from './cdp-engine.js';
import { GuardrailsManager } from './guardrails.js';

export interface ActionLogItem {
  id: string;
  tool: string;
  tabId?: number;
  url?: string;
  status: 'executing' | 'completed' | 'failed' | 'denied';
  durationMs?: number;
  timestamp: number;
}

export class ExtensionBridgeManager {
  private ws: WebSocket | null = null;
  private wsUrl: string;
  private cdp: CdpEngine;
  private guardrails: GuardrailsManager;
  private isConnected = false;
  private reconnectInterval = 3000;
  private actionLogs: ActionLogItem[] = [];

  constructor(cdp: CdpEngine, guardrails: GuardrailsManager, wsUrl = 'ws://127.0.0.1:8765') {
    this.cdp = cdp;
    this.guardrails = guardrails;
    this.wsUrl = wsUrl;
    this.connect();
  }

  public connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[UniversalBrowserExtension] Connected to bridge at', this.wsUrl);
        this.broadcastStatus();
      };

      this.ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'action' && msg.id && msg.action) {
            await this.handleActionMessage(msg);
          }
        } catch (err) {
          console.error('[UniversalBrowserExtension] Error processing bridge message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.broadcastStatus();
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      wsUrl: this.wsUrl,
      actionLogsCount: this.actionLogs.length
    };
  }

  public getActionLogs() {
    return this.actionLogs.slice(-50);
  }

  private broadcastStatus() {
    chrome.runtime.sendMessage({
      type: 'BRIDGE_STATUS_UPDATED',
      status: this.getStatus()
    }).catch(() => {});
  }

  private async handleActionMessage(msg: { id: string; action: string; params?: any }) {
    const startTime = Date.now();
    const logItem: ActionLogItem = {
      id: msg.id,
      tool: msg.action,
      tabId: msg.params?.tabId,
      status: 'executing',
      timestamp: startTime
    };
    this.actionLogs.push(logItem);

    try {
      const result = await this.executeTool(msg.action, msg.params);
      logItem.status = 'completed';
      logItem.durationMs = Date.now() - startTime;

      this.sendResponse({
        id: msg.id,
        type: 'action_response',
        result,
        timestamp: Date.now()
      });
    } catch (err: any) {
      logItem.status = 'failed';
      logItem.durationMs = Date.now() - startTime;

      this.sendResponse({
        id: msg.id,
        type: 'action_response',
        error: err.message || 'Tool execution failed',
        timestamp: Date.now()
      });
    }

    // Broadcast log update to UI
    chrome.runtime.sendMessage({
      type: 'ACTION_LOG_UPDATED',
      logs: this.getActionLogs()
    }).catch(() => {});
  }

  private sendResponse(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private async executeTool(action: string, params: any = {}): Promise<any> {
    switch (action) {
      case 'list_tabs': {
        const tabs = await chrome.tabs.query({});
        return tabs.map(t => ({
          id: t.id,
          url: t.url,
          title: t.title,
          active: t.active,
          windowId: t.windowId,
          groupId: t.groupId !== -1 ? t.groupId : undefined,
          favIconUrl: t.favIconUrl
        }));
      }

      case 'open_tab': {
        const url = params.url;
        const blockCheck = this.guardrails.isDomainBlocked(url);
        if (blockCheck.blocked) {
          throw new Error(`Domain ${blockCheck.domain} is protected by sensitive security policies.`);
        }

        const tab = await chrome.tabs.create({
          url,
          active: params.active ?? false
        });

        if (params.groupTitle && tab.id) {
          const group = await chrome.tabs.group({ tabIds: tab.id });
          await chrome.tabGroups.update(group, { title: params.groupTitle, color: 'green' });
        }

        return { tabId: tab.id, url: tab.url, active: tab.active };
      }

      case 'close_tab': {
        if (!params.tabId) throw new Error('tabId is required');
        await chrome.tabs.remove(params.tabId);
        return { success: true, tabId: params.tabId };
      }

      case 'switch_tab': {
        if (!params.tabId) throw new Error('tabId is required');
        const tab = await chrome.tabs.update(params.tabId, { active: true });
        if (tab.windowId) {
          await chrome.windows.update(tab.windowId, { focused: true });
        }
        return { success: true, tabId: tab.id };
      }

      case 'get_dom_tree': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No active tab found');

        // Check guardrails
        const tab = await chrome.tabs.get(targetTabId);
        if (tab.url && this.guardrails.isDomainBlocked(tab.url).blocked) {
          throw new Error('Target tab is on a protected sensitive domain.');
        }

        // Send message to content script
        const response = await this.sendTabMessage(targetTabId, { type: 'INDEX_DOM' });
        return {
          tabId: targetTabId,
          url: tab.url,
          title: tab.title,
          markdown: response?.data?.markdown || '',
          interactiveElements: response?.data?.elements || [],
          totalElements: response?.data?.elements?.length || 0
        };
      }

      case 'click_element': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');

        // First index or find coordinates
        const domResult = await this.executeTool('get_dom_tree', { tabId: targetTabId });
        let targetEl = null;

        if (typeof params.elementIndex === 'number') {
          targetEl = domResult.interactiveElements.find((el: any) => el.index === params.elementIndex);
        }

        if (!targetEl) {
          throw new Error(`Element with index ${params.elementIndex} not found`);
        }

        const clickX = targetEl.bounds.x + Math.floor(targetEl.bounds.width / 2);
        const clickY = targetEl.bounds.y + Math.floor(targetEl.bounds.height / 2);

        // Visual feedback cursor
        if (params.showCursorTrail !== false) {
          await this.sendTabMessage(targetTabId, {
            type: 'CURSOR_CLICK',
            x: clickX,
            y: clickY,
            bounds: targetEl.bounds
          }).catch(() => {});
        }

        // CDP synthetic click
        await this.cdp.clickAt(targetTabId, clickX, clickY);

        return {
          success: true,
          elementIndex: params.elementIndex,
          clickedAt: { x: clickX, y: clickY },
          tag: targetEl.tagName,
          text: targetEl.text
        };
      }

      case 'type_text': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');

        // Click element first to focus
        if (params.elementIndex !== undefined) {
          await this.executeTool('click_element', { tabId: targetTabId, elementIndex: params.elementIndex });
          await new Promise(r => setTimeout(r, 100));
        }

        // Type string via CDP
        await this.cdp.typeString(targetTabId, params.text);

        if (params.pressEnter) {
          await this.cdp.pressKey(targetTabId, 'Enter');
        }

        return { success: true, typedTextLength: params.text.length };
      }

      case 'press_key': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');
        await this.cdp.pressKey(targetTabId, params.key);
        return { success: true, key: params.key };
      }

      case 'scroll': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');
        await this.cdp.scroll(targetTabId, 100, 100, params.deltaX || 0, params.deltaY || 400);
        return { success: true, deltaY: params.deltaY || 400 };
      }

      case 'capture_screenshot': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');
        const dataUrl = await this.cdp.captureScreenshot(targetTabId);
        return { dataUrl };
      }

      case 'navigate': {
        const targetTabId = params.tabId ?? (await this.getActiveTabId());
        if (!targetTabId) throw new Error('No target tab found');
        const blockCheck = this.guardrails.isDomainBlocked(params.url);
        if (blockCheck.blocked) {
          throw new Error(`Domain ${blockCheck.domain} is blocked by sensitive security policies.`);
        }
        await chrome.tabs.update(targetTabId, { url: params.url });
        return { success: true, tabId: targetTabId, url: params.url };
      }

      case 'download_file': {
        // HITL Gate
        const approved = await this.guardrails.requestApproval({
          tool: 'download_file',
          params,
          url: params.url,
          domain: new URL(params.url).hostname,
          description: `AI requested to download file from ${params.url}`
        });

        if (!approved) {
          throw new Error('User denied file download permission via HITL guardrail.');
        }

        const downloadId = await chrome.downloads.download({
          url: params.url,
          filename: params.filename
        });

        return { success: true, downloadId };
      }

      case 'get_history': {
        // HITL Gate
        const approved = await this.guardrails.requestApproval({
          tool: 'get_history',
          params,
          description: `AI requested access to browser history matching "${params.query}"`
        });

        if (!approved) {
          throw new Error('User denied history access permission via HITL guardrail.');
        }

        const items = await chrome.history.search({
          text: params.query,
          maxResults: params.maxResults || 10
        });

        return { items };
      }

      case 'manage_tab_groups': {
        const group = await chrome.tabs.group({ tabIds: params.tabIds });
        await chrome.tabGroups.update(group, {
          title: params.title,
          color: params.color || 'green',
          collapsed: params.collapsed || false
        });
        return { success: true, groupId: group };
      }

      default:
        throw new Error(`Unknown tool action: ${action}`);
    }
  }

  private async getActiveTabId(): Promise<number | undefined> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0]?.id;
  }

  private sendTabMessage(tabId: number, message: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
}
