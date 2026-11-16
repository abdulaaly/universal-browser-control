import React, { useState, useEffect } from 'react';
import {
  Terminal,
  ExternalLink,
  Settings,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Camera,
  Layers,
  FileText,
  MousePointer2,
  Columns,
  Globe
} from 'lucide-react';
import { TunnelModal } from './components/TunnelModal.js';

export const PopupApp: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<'local' | 'tunnel'>('local');
  const [token, setToken] = useState('ub_pat_live_89f0a8c2b7d41e9e03');
  const [localUrl] = useState('http://localhost:3000/sse');
  const [tunnelUrl] = useState('https://universal-browser-control.vercel.app/api/mcp/sse');
  const [pageDomain, setPageDomain] = useState('localhost:5173');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.url) {
          try {
            const parsed = new URL(tab.url);
            setPageDomain(parsed.host || tab.url);
          } catch {
            setPageDomain(tab.url.slice(0, 24));
          }
        }
      });
    }
  }, []);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rotateToken = () => {
    const raw = 'ub_pat_live_' + Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setToken(raw);
    setActionFeedback('PAT rotated successfully');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleOpenSidepanel = async () => {
    if (typeof chrome !== 'undefined' && chrome.sidePanel?.open && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          chrome.sidePanel.open({ tabId: tab.id });
          window.close();
        }
      });
    } else {
      window.open('sidepanel.html', '_blank');
    }
  };

  const triggerTabAction = (type: string, label: string) => {
    setActionFeedback(`Triggered: ${label}`);
    setTimeout(() => setActionFeedback(null), 2000);

    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.id) return;

        if (type === 'dom') {
          chrome.tabs.sendMessage(tab.id, { type: 'INDEX_DOM' });
        } else if (type === 'screenshot') {
          chrome.tabs.captureVisibleTab(undefined, { format: 'png' });
        } else if (type === 'cursor') {
          chrome.tabs.sendMessage(tab.id, { type: 'HIGHLIGHT_ELEMENT', index: 1 });
        }
      });
    }
  };

  return (
    <div className="w-[360px] min-h-[520px] bg-[#08090b] text-[#f4f4f6] flex flex-col font-sans select-none border border-[#232834]">
      {/* 1. Header */}
      <header className="w-full h-11 px-3 flex items-center justify-between border-b border-[#232834] bg-[#08090b] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#c0c1ff]">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[13px] tracking-tight text-[#f4f4f6]">
            Universal AI Bridge
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981]"></span>
            </span>
            <span className="font-mono text-[10px] text-[#10b981] font-semibold">3000</span>
          </div>

          <button
            onClick={handleOpenSidepanel}
            className="w-7 h-7 flex items-center justify-center rounded text-[#7a8296] hover:bg-[#14171f] hover:text-[#f4f4f6] transition-colors"
            title="Open Full Sidepanel"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded text-[#7a8296] hover:bg-[#14171f] hover:text-[#f4f4f6] transition-colors"
            title="Settings & Configs"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto">
        {/* Active Tab & CDP Attachment Card */}
        <section className="rounded-lg border border-[#232834] bg-[#0e1015] p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe className="w-3.5 h-3.5 text-[#7a8296] shrink-0" />
              <span className="font-mono text-[11px] text-[#f4f4f6] font-semibold truncate hover:text-[#6366f1] cursor-pointer">
                {pageDomain}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0"></span>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#f59e0b]">
              <Shield className="w-3 h-3" />
              <span className="font-mono text-[9px] tracking-tight font-medium">CDP Attached</span>
            </div>
          </div>

          {/* Segmented Switcher */}
          <div className="grid grid-cols-2 p-0.5 rounded-md bg-[#08090b] border border-[#232834]">
            <button
              onClick={() => setProtocol('local')}
              className={`py-1 px-2 rounded font-mono text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                protocol === 'local'
                  ? 'bg-[#191d27] text-[#c0c1ff] shadow-sm'
                  : 'text-[#7a8296] hover:text-[#f4f4f6]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${protocol === 'local' ? 'bg-[#10b981]' : 'bg-[#7a8296]'}`} />
              Local WS
            </button>
            <button
              onClick={() => setProtocol('tunnel')}
              className={`py-1 px-2 rounded font-mono text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                protocol === 'tunnel'
                  ? 'bg-[#191d27] text-[#c0c1ff] shadow-sm'
                  : 'text-[#7a8296] hover:text-[#f4f4f6]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${protocol === 'tunnel' ? 'bg-[#10b981]' : 'bg-[#7a8296]'}`} />
              Public Tunnel
            </button>
          </div>
        </section>

        {/* Remote MCP Endpoints */}
        <section className="rounded-lg border border-[#232834] bg-[#0e1015] p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a8296]">
              MCP Server Endpoint
            </span>
            <span className="font-mono text-[10px] text-[#6366f1] font-semibold">v1.0.0</span>
          </div>

          {/* Endpoint Row */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#7a8296] font-mono text-[10px]">
              <span>{protocol === 'local' ? 'Local SSE Transport' : 'Encrypted Cloud Relay'}</span>
              <span className="text-[#10b981] font-medium">Ready</span>
            </div>
            <div className="flex items-center gap-1 bg-[#08090b] border border-[#232834] rounded px-2 py-1">
              <span className="font-mono text-[11px] text-[#c4c8d4] flex-1 truncate select-all">
                {protocol === 'local' ? localUrl : tunnelUrl}
              </span>
              <button
                onClick={() => copyToClipboard('url', protocol === 'local' ? localUrl : tunnelUrl)}
                className="p-1 rounded text-[#7a8296] hover:text-[#f4f4f6] hover:bg-[#14171f] transition-colors shrink-0"
                title="Copy endpoint URL"
              >
                {copiedKey === 'url' ? (
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Scoped PAT Row */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#7a8296] font-mono text-[10px]">
              <span>Session Auth PAT</span>
              <span className="text-[#7a8296]">TTL 03:59:59</span>
            </div>
            <div className="flex items-center gap-1 bg-[#08090b] border border-[#232834] rounded px-2 py-1">
              <span className="font-mono text-[11px] text-[#c4c8d4] flex-1 truncate select-all">
                {token.slice(0, 18)}...
              </span>
              <button
                onClick={() => copyToClipboard('pat', token)}
                className="p-1 rounded text-[#7a8296] hover:text-[#f4f4f6] hover:bg-[#14171f] transition-colors shrink-0"
                title="Copy full PAT token"
              >
                {copiedKey === 'pat' ? (
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={rotateToken}
                className="p-1 rounded text-[#7a8296] hover:text-[#f4f4f6] hover:bg-[#14171f] transition-colors shrink-0"
                title="Rotate PAT token"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 2x2 Tactile Micro-Action Grid */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a8296]">
              Tactile Actions
            </span>
            <span className="font-mono text-[10px] text-[#10b981]">Engine Online</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => triggerTabAction('dom', 'Index DOM')}
              className="h-8 px-2 rounded border border-[#232834] bg-[#0e1015] hover:bg-[#14171f] text-[#f4f4f6] text-[11px] font-medium flex items-center gap-2 transition-colors active:scale-[0.98]"
            >
              <Layers className="w-3.5 h-3.5 text-[#9fc9a2]" />
              <span>Index DOM</span>
            </button>
            <button
              onClick={() => triggerTabAction('screenshot', 'Capture Viewport')}
              className="h-8 px-2 rounded border border-[#232834] bg-[#0e1015] hover:bg-[#14171f] text-[#f4f4f6] text-[11px] font-medium flex items-center gap-2 transition-colors active:scale-[0.98]"
            >
              <Camera className="w-3.5 h-3.5 text-[#9fbbe0]" />
              <span>Capture Viewport</span>
            </button>
            <button
              onClick={() => triggerTabAction('extract', 'Extract Text')}
              className="h-8 px-2 rounded border border-[#232834] bg-[#0e1015] hover:bg-[#14171f] text-[#f4f4f6] text-[11px] font-medium flex items-center gap-2 transition-colors active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-[#dfa88f]" />
              <span>Extract Text</span>
            </button>
            <button
              onClick={() => triggerTabAction('cursor', 'Agent Pointer')}
              className="h-8 px-2 rounded border border-[#232834] bg-[#0e1015] hover:bg-[#14171f] text-[#f4f4f6] text-[11px] font-medium flex items-center gap-2 transition-colors active:scale-[0.98]"
            >
              <MousePointer2 className="w-3.5 h-3.5 text-[#c0a8dd]" />
              <span>Agent Pointer</span>
            </button>
          </div>
        </section>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 rounded px-2.5 py-1 text-center animate-fade-in">
            {actionFeedback}
          </div>
        )}

        {/* Primary Launch Action */}
        <div className="pt-1 flex flex-col gap-1.5">
          <button
            onClick={handleOpenSidepanel}
            className="w-full h-8 bg-[#6366f1] hover:bg-[#5e6ad2] text-white font-medium text-[12px] rounded flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.99]"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Launch Agent Sidepanel</span>
            <span className="keycap bg-[#494bd6] text-white/90 border-transparent">⌘U</span>
          </button>

          <a
            href="https://universal-browser-control.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="w-full h-7 bg-[#0e1015] hover:bg-[#14171f] border border-[#232834] text-[#7a8296] hover:text-[#f4f4f6] font-mono text-[10px] rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Web Companion Portal</span>
          </a>
        </div>
      </main>

      {/* Settings Modal Drawer */}
      <TunnelModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        token={token}
        onRotateToken={rotateToken}
        publicTunnelUrl={tunnelUrl}
        localUrl={localUrl}
      />

      {/* Footer */}
      <footer className="px-3 py-1.5 bg-[#08090b] border-t border-[#232834] text-[#7a8296] flex items-center justify-between text-[10px] font-mono select-none">
        <span>CDP v1.3 • Ready</span>
        <span className="text-[#10b981]">Live Authenticated</span>
      </footer>
    </div>
  );
};
