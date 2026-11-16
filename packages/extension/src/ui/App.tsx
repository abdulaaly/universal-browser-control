import React, { useEffect, useState } from 'react';
import { TelemetryHeader } from './components/TelemetryHeader.js';
import { ConnectHub } from './components/ConnectHub.js';
import { TabsManager } from './components/TabsManager.js';
import { Playground } from './components/Playground.js';
import { HitlApprovalCards, HitlItem } from './components/HitlApprovalCards.js';
import { ActionFeed, ActionLog } from './components/ActionFeed.js';
import { Globe, Layers, Activity, Play } from 'lucide-react';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<'connect' | 'tabs' | 'feed' | 'playground'>('connect');
  const [connected, setConnected] = useState(true);
  const [latencyMs, setLatencyMs] = useState(12);
  const [activeClient] = useState('Gemini / Claude / Cursor');
  const [pendingApprovals, setPendingApprovals] = useState<HitlItem[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: 'demo_1',
      tool: 'list_tabs',
      status: 'completed',
      durationMs: 14,
      timestamp: Date.now() - 5000
    },
    {
      id: 'demo_2',
      tool: 'get_dom_tree',
      tabId: 101,
      status: 'completed',
      durationMs: 38,
      timestamp: Date.now() - 2000
    }
  ]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
        if (res && res.ok) {
          setConnected(res.bridge?.connected ?? false);
          if (res.pendingApprovals) setPendingApprovals(res.pendingApprovals);
          if (res.actionLogs && res.actionLogs.length > 0) setActionLogs(res.actionLogs);
        }
      });

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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Header */}
      <TelemetryHeader
        connected={connected}
        activeClient={activeClient}
        connectionMode="Local WS"
        latencyMs={latencyMs}
      />

      {/* 2. Navigation Switcher Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-20 backdrop-blur-md">
        <button
          onClick={() => setActiveNav('connect')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
            activeNav === 'connect'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Connect Hub</span>
        </button>

        <button
          onClick={() => setActiveNav('tabs')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
            activeNav === 'tabs'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tabs</span>
        </button>

        <button
          onClick={() => setActiveNav('feed')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
            activeNav === 'feed'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Feed ({actionLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveNav('playground')}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
            activeNav === 'playground'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Playground</span>
        </button>
      </div>

      {/* 3. Main Body */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <HitlApprovalCards requests={pendingApprovals} onDecision={handleDecision} />

        {activeNav === 'connect' && <ConnectHub />}
        {activeNav === 'tabs' && <TabsManager />}
        {activeNav === 'feed' && <ActionFeed logs={actionLogs} />}
        {activeNav === 'playground' && <Playground />}
      </div>

      {/* 4. Footer */}
      <footer className="p-3 bg-slate-900/90 border-t border-slate-800/80 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Universal AI Browser Control • Open Source MIT • 100xdigitizer@gmail.com</span>
      </footer>
    </div>
  );
};
