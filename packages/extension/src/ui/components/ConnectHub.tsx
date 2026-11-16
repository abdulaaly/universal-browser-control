import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, Terminal, Globe, Smartphone, Code2, Sparkles, Monitor } from 'lucide-react';

interface ConnectHubProps {
  token?: string;
  onRotateToken?: () => void;
  localUrl?: string;
  publicTunnelUrl?: string;
}

export const ConnectHub: React.FC<ConnectHubProps> = ({
  token: initialToken = 'ub_pat_live_89f0a8c2b7d41e9e03',
  onRotateToken,
  localUrl = 'http://localhost:3000/sse',
  publicTunnelUrl = 'https://universal-browser-control.vercel.app/api/mcp/sse',
}) => {
  const [token, setToken] = useState(initialToken);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'claude' | 'gemini' | 'cursor' | 'antigravity' | 'perplexity'>('claude');
  const [transportMode, setTransportMode] = useState<'tunnel' | 'local'>('tunnel');

  const activeUrl = transportMode === 'tunnel' ? publicTunnelUrl : localUrl;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRotate = () => {
    if (onRotateToken) {
      onRotateToken();
    } else {
      const newToken = 'ub_pat_live_' + Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      setToken(newToken);
    }
  };

  const clientConfigs = {
    claude: JSON.stringify({
      mcpServers: {
        "universal-browser": {
          url: activeUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    }, null, 2),
    gemini: JSON.stringify({
      mcpServers: {
        "universal-browser": {
          url: activeUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    }, null, 2),
    cursor: JSON.stringify({
      name: "universal-browser",
      type: "sse",
      url: activeUrl,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, null, 2),
    perplexity: JSON.stringify({
      mcpServer: {
        name: "universal-browser",
        transport: "sse",
        endpoint: activeUrl,
        bearerToken: token
      }
    }, null, 2),
    antigravity: `npx @universal-browser/cli connect --url ${activeUrl} --token ${token}`
  };

  return (
    <div className="bg-[#0e1015] border border-[#232834] rounded-lg p-3.5 text-[#f4f4f6] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[#232834] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#c0c1ff]">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold text-[#f4f4f6]">Universal MCP Client Hub</h2>
            <p className="text-[10px] text-[#7a8296] font-mono">Connect any AI model to this live browser</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[10px] font-mono font-medium">
          <Shield className="w-3 h-3" />
          <span>2FA & HITL Verified</span>
        </div>
      </div>

      {/* Transport Switcher */}
      <div className="grid grid-cols-2 p-0.5 rounded-md bg-[#08090b] border border-[#232834] mb-3">
        <button
          onClick={() => setTransportMode('tunnel')}
          className={`py-1 px-2 rounded font-mono text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all ${
            transportMode === 'tunnel'
              ? 'bg-[#191d27] text-[#c0c1ff] shadow-sm'
              : 'text-[#7a8296] hover:text-[#f4f4f6]'
          }`}
        >
          <Globe className="w-3 h-3 text-[#6366f1]" />
          <span>Cloud Relay (Web / Mobile)</span>
        </button>
        <button
          onClick={() => setTransportMode('local')}
          className={`py-1 px-2 rounded font-mono text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all ${
            transportMode === 'local'
              ? 'bg-[#191d27] text-[#c0c1ff] shadow-sm'
              : 'text-[#7a8296] hover:text-[#f4f4f6]'
          }`}
        >
          <Monitor className="w-3 h-3 text-[#10b981]" />
          <span>Local SSE (Port 3000)</span>
        </button>
      </div>

      {/* Remote MCP Endpoint */}
      <div className="mb-2.5">
        <label className="text-[10px] font-mono text-[#7a8296] block mb-1">
          {transportMode === 'tunnel' ? 'Public HTTPS Relay SSE Stream' : 'Local Host SSE Stream'}
        </label>
        <div className="flex items-center bg-[#08090b] border border-[#232834] rounded px-2.5 py-1.5">
          <span className="font-mono text-[11px] text-[#10b981] flex-1 truncate select-all">{activeUrl}</span>
          <button
            onClick={() => copyToClipboard('url', activeUrl)}
            className="text-[#7a8296] hover:text-[#f4f4f6] p-1 ml-1 rounded hover:bg-[#14171f] transition-colors"
            title="Copy URL"
          >
            {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bearer PAT Token */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-mono text-[#7a8296]">Scoped Personal Access Token (PAT)</label>
          <button
            onClick={handleRotate}
            className="text-[10px] font-mono text-[#10b981] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Rotate Token</span>
          </button>
        </div>
        <div className="flex items-center bg-[#08090b] border border-[#232834] rounded px-2.5 py-1.5">
          <Key className="w-3.5 h-3.5 text-[#7a8296] mr-2 shrink-0" />
          <span className="font-mono text-[11px] text-[#c4c8d4] flex-1 truncate select-all">{token}</span>
          <button
            onClick={() => copyToClipboard('token', token)}
            className="text-[#7a8296] hover:text-[#f4f4f6] p-1 ml-1 rounded hover:bg-[#14171f] transition-colors"
            title="Copy Token"
          >
            {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Client Presets Selector */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#7a8296]">
            Instant 1-Click Client Configuration
          </label>
          <span className="font-mono text-[10px] text-[#c0c1ff]">
            {activeTab.toUpperCase()}
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'claude', label: 'Claude (Web/Mobile)', icon: <Smartphone className="w-3 h-3" /> },
            { id: 'gemini', label: 'Gemini API', icon: <Sparkles className="w-3 h-3" /> },
            { id: 'cursor', label: 'Cursor IDE', icon: <Code2 className="w-3 h-3" /> },
            { id: 'perplexity', label: 'Perplexity', icon: <Globe className="w-3 h-3" /> },
            { id: 'antigravity', label: 'Antigravity CLI', icon: <Terminal className="w-3 h-3" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#191d27] text-[#c0c1ff] border border-[#6366f1]/40'
                  : 'bg-[#08090b] text-[#7a8296] hover:text-[#f4f4f6] border border-[#232834]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Snippet Display */}
      <div className="relative bg-[#08090b] border border-[#232834] rounded p-2.5 font-mono text-[11px] overflow-hidden">
        <button
          onClick={() => copyToClipboard('snippet', clientConfigs[activeTab])}
          className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#14171f] hover:bg-[#1f2430] border border-[#232834] text-[10px] text-[#c4c8d4] hover:text-[#f4f4f6] flex items-center gap-1 transition-colors"
        >
          {copiedKey === 'snippet' ? (
            <>
              <Check className="w-3 h-3 text-[#10b981]" />
              <span className="text-[#10b981]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Config</span>
            </>
          )}
        </button>
        <pre className="text-[#c4c8d4] overflow-x-auto custom-scrollbar pr-14 leading-relaxed">
          {clientConfigs[activeTab]}
        </pre>
      </div>
    </div>
  );
};
