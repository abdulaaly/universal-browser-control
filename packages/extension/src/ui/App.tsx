import React, { useEffect, useState } from 'react';
import { TelemetryHeader } from './components/TelemetryHeader.js';
import { ConnectHub } from './components/ConnectHub.js';
import { HitlApprovalCards, HitlItem } from './components/HitlApprovalCards.js';
import { ActionFeed, ActionLog } from './components/ActionFeed.js';

export const App: React.FC = () => {
  const [connected, setConnected] = useState(true);
  const [latencyMs, setLatencyMs] = useState(14);
  const [activeClient] = useState('Gemini / Claude / Cursor');
  const [pendingApprovals, setPendingApprovals] = useState<HitlItem[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: 'demo_1',
      tool: 'list_tabs',
      status: 'completed',
      durationMs: 18,
      timestamp: Date.now() - 4000
    },
    {
      id: 'demo_2',
      tool: 'get_dom_tree',
      tabId: 101,
      status: 'completed',
      durationMs: 42,
      timestamp: Date.now() - 1500
    }
  ]);

  useEffect(() => {
    // Initial fetch from background worker
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
        if (res && res.ok) {
          setConnected(res.bridge?.connected ?? false);
          if (res.pendingApprovals) setPendingApprovals(res.pendingApprovals);
          if (res.actionLogs && res.actionLogs.length > 0) setActionLogs(res.actionLogs);
        }
      });

      // Listen for updates from background worker
      const listener = (msg: any) => {
        if (msg.type === 'BRIDGE_STATUS_UPDATED') {
          setConnected(msg.status.connected);
        } else if (msg.type === 'HITL_REQUEST_PENDING') {
          setPendingApprovals(prev => [...prev.filter(p => p.id !== msg.request.id), msg.request]);
        } else if (msg.type === 'HITL_REQUEST_RESOLVED') {
          setPendingApprovals(prev => prev.filter(p => p.id !== msg.id));
        } else if (msg.type === 'ACTION_LOG_UPDATED') {
          setActionLogs(msg.logs);
        }
      };

      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    }
  }, []);

  const handleDecision = (id: string, decision: 'allow_once' | 'allow_domain' | 'deny') => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'RESOLVE_HITL', id, decision });
    }
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TelemetryHeader
        connected={connected}
        activeClient={activeClient}
        connectionMode="Local WS"
        latencyMs={latencyMs}
      />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <HitlApprovalCards requests={pendingApprovals} onDecision={handleDecision} />
        <ConnectHub />
        <ActionFeed logs={actionLogs} />
      </div>

      <footer className="p-3 bg-slate-900 border-t border-slate-800 text-center text-[11px] text-slate-500">
        Universal AI Browser Control • Open Source MIT • 100xdigitizer@gmail.com
      </footer>
    </div>
  );
};
