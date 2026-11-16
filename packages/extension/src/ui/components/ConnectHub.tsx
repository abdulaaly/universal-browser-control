import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, Terminal, Globe, Smartphone, Code } from 'lucide-react';

export const ConnectHub: React.FC = () => {
  const [token, setToken] = useState('ub_pat_live_89f0a8c2b7d41e9e03');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gemini' | 'claude' | 'cursor' | 'antigravity'>('gemini');

  const remoteMcpUrl = 'http://localhost:3000/sse';

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rotateToken = () => {
    const newToken = 'ub_pat_live_' + Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setToken(newToken);
  };

  const clientConfigs = {
    gemini: JSON.stringify({
      mcpServers: {
        "universal-browser": {
          url: remoteMcpUrl,
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    }, null, 2),
    claude: JSON.stringify({
      mcpServers: {
        "universal-browser": {
          url: remoteMcpUrl,
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    }, null, 2),
    cursor: JSON.stringify({
      name: "universal-browser",
      type: "sse",
      url: remoteMcpUrl
    }, null, 2),
    antigravity: `npx @universal-browser/mcp-server`
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100">Universal MCP Connect Hub</h2>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-medium">
          <Shield className="w-3 h-3" />
          <span>2FA Verified</span>
        </div>
      </div>

      {/* Remote MCP Endpoint */}
      <div className="mb-3">
        <label className="text-xs text-slate-400 block mb-1">Remote MCP SSE Stream URL</label>
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <span className="font-mono text-xs text-emerald-300 flex-1 truncate">{remoteMcpUrl}</span>
          <button
            onClick={() => copyToClipboard('url', remoteMcpUrl)}
            className="text-slate-400 hover:text-white p-1 ml-1 rounded hover:bg-slate-800"
            title="Copy URL"
          >
            {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bearer PAT Token */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-slate-400">Scoped Personal Access Token (PAT)</label>
          <button
            onClick={rotateToken}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Rotate</span>
          </button>
        </div>
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Key className="w-3.5 h-3.5 text-slate-500 mr-2" />
          <span className="font-mono text-xs text-slate-300 flex-1 truncate">{token}</span>
          <button
            onClick={() => copyToClipboard('token', token)}
            className="text-slate-400 hover:text-white p-1 ml-1 rounded hover:bg-slate-800"
            title="Copy Token"
          >
            {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Config Tabs */}
      <div>
        <div className="flex space-x-1 border-b border-slate-800 mb-2.5 pb-1">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-2 py-1 text-xs font-medium rounded-md flex items-center space-x-1 ${
              activeTab === 'gemini' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Gemini</span>
          </button>
          <button
            onClick={() => setActiveTab('claude')}
            className={`px-2 py-1 text-xs font-medium rounded-md flex items-center space-x-1 ${
              activeTab === 'claude' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Claude</span>
          </button>
          <button
            onClick={() => setActiveTab('cursor')}
            className={`px-2 py-1 text-xs font-medium rounded-md flex items-center space-x-1 ${
              activeTab === 'cursor' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Cursor</span>
          </button>
          <button
            onClick={() => setActiveTab('antigravity')}
            className={`px-2 py-1 text-xs font-medium rounded-md flex items-center space-x-1 ${
              activeTab === 'antigravity' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>CLI</span>
          </button>
        </div>

        <div className="relative">
          <pre className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-28">
            {clientConfigs[activeTab]}
          </pre>
          <button
            onClick={() => copyToClipboard(activeTab, clientConfigs[activeTab])}
            className="absolute top-2 right-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs flex items-center space-x-1"
          >
            {copiedKey === activeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
