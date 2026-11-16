// Universal AI Browser Control - Background Service Worker

import { CdpEngine } from './cdp-engine.js';
import { GuardrailsManager } from './guardrails.js';
import { ExtensionBridgeManager } from './bridge-connection.js';

const cdpEngine = new CdpEngine();
const guardrailsManager = new GuardrailsManager();
const bridgeManager = new ExtensionBridgeManager(cdpEngine, guardrailsManager);

// Clean up CDP state when debugger detaches
chrome.debugger.onDetach.addListener((source) => {
  if (source.tabId) {
    cdpEngine.handleDetach(source.tabId);
  }
});

// Configure Side Panel behavior
chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {});

// Listen for messages from popup / sidepanel UI
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATUS':
      sendResponse({
        ok: true,
        bridge: bridgeManager.getStatus(),
        pendingApprovals: guardrailsManager.getPendingApprovals(),
        actionLogs: bridgeManager.getActionLogs()
      });
      break;

    case 'RESOLVE_HITL':
      const resolved = guardrailsManager.resolveApproval(message.id, message.decision);
      sendResponse({ ok: resolved });
      break;

    case 'RECONNECT_BRIDGE':
      bridgeManager.connect();
      sendResponse({ ok: true });
      break;

    default:
      sendResponse({ ok: false, error: 'Unknown message type' });
      break;
  }
  return true;
});

console.log('[UniversalBrowserExtension] Background service worker initialized.');
