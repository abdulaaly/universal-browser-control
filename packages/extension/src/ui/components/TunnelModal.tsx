import React, { useState } from 'react';
import { Copy, Check, Key, Network, ShieldCheck, RefreshCw, X, Smartphone, Globe, ExternalLink } from 'lucide-react';

interface TunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onRotateToken: () => void;
  publicTunnelUrl: string;
  localUrl: string;
}

export const TunnelModal: React.FC<TunnelModalProps> = ({
  isOpen,
  onClose,
  token,
  onRotateToken,
  publicTunnelUrl,
  localUrl,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tunnel' | 'guide'>('tunnel');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#0e1015] border border-[#232834] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#f4f4f6]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#232834] bg-[#08090b]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#14171f] border border-[#232834] flex items-center justify-center text-[#10b981]">
              <Network className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-semibold tracking-tight font-mono">
              MCP Remote & Tunnel Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#7a8296] hover:text-white p-1 rounded hover:bg-[#14171f] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Tab */}
        <div className="flex border-b border-[#232834] bg-[#08090b] px-3.5 py-1.5 gap-2 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('tunnel')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'tunnel'
                ? 'bg-[#191d27] text-[#c0c1ff] font-semibold border-b-2 border-[#6366f1]'
                : 'text-[#7a8296] hover:text-[#f4f4f6]'
            }`}
          >
            Connection Endpoints
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'guide'
                ? 'bg-[#191d27] text-[#c0c1ff] font-semibold border-b-2 border-[#6366f1]'
                : 'text-[#7a8296] hover:text-[#f4f4f6]'
            }`}
          >
            Mobile / Claude Setup
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 space-y-3 max-h-96 overflow-y-auto text-xs">
          {activeTab === 'tunnel' ? (
            <>
              {/* Local SSE Endpoint */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[#7a8296] text-[11px] font-mono">
                  <span>Local SSE Endpoint</span>
                  <span className="text-[#10b981] text-[10px]">Desktop AI / CLI</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#08090b] border border-[#232834] rounded px-2.5 py-1.5 font-mono text-[11px] text-[#c0c1ff]">
                  <span className="truncate flex-1">{localUrl}</span>
                  <button
                    onClick={() => handleCopy(localUrl, 'local')}
                    className="text-[#7a8296] hover:text-white transition p-1"
                    title="Copy local SSE endpoint"
                  >
                    {copiedKey === 'local' ? (
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Public HTTPS Tunnel */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[#7a8296] text-[11px] font-mono">
                  <span>Public HTTPS Tunnel</span>
                  <span className="text-[#10b981] bg-[#10b981]/10 px-1 rounded text-[10px] border border-[#10b981]/30">
                    Live Tunnel
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#08090b] border border-[#232834] rounded px-2.5 py-1.5 font-mono text-[11px] text-[#c0c1ff]">
                  <span className="truncate flex-1">{publicTunnelUrl}</span>
                  <button
                    onClick={() => handleCopy(publicTunnelUrl, 'tunnel')}
                    className="text-[#7a8296] hover:text-white transition p-1"
                    title="Copy public tunnel URL"
                  >
                    {copiedKey === 'tunnel' ? (
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-[#7a8296] font-mono">
                  Forwarded via <code className="text-[#c0c1ff]">localtunnel</code> / ngrok bridge to localhost:3000.
                </p>
              </div>

              {/* Personal Access Token (PAT) */}
              <div className="space-y-1 pt-1 border-t border-[#232834]">
                <div className="flex items-center justify-between text-[#7a8296] text-[11px] font-mono">
                  <span>Bearer Access Token (PAT)</span>
                  <button
                    onClick={onRotateToken}
                    className="text-[#f59e0b] hover:underline flex items-center gap-1 text-[10px]"
                    title="Generate new scoped token"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Rotate Token
                  </button>
                </div>
                <div className="flex items-center gap-1.5 bg-[#08090b] border border-[#232834] rounded px-2.5 py-1.5 font-mono text-[11px] text-[#e3e2e5]">
                  <Key className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
                  <span className="truncate flex-1">{token}</span>
                  <button
                    onClick={() => handleCopy(token, 'token')}
                    className="text-[#7a8296] hover:text-white transition p-1"
                    title="Copy Access Token"
                  >
                    {copiedKey === 'token' ? (
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2.5 font-mono text-[11px] leading-relaxed text-[#c4c8d4]">
              <div className="bg-[#08090b] p-2.5 rounded border border-[#232834] space-y-1.5">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>ChatGPT Mobile App</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[#7a8296] text-[10px]">
                  <li>Open ChatGPT App → Settings → Connected Apps.</li>
                  <li>Paste the <strong>Public Tunnel URL</strong> above.</li>
                  <li>Select Auth: <code>Bearer Token</code> and paste your PAT.</li>
                </ol>
              </div>

              <div className="bg-[#08090b] p-2.5 rounded border border-[#232834] space-y-1.5">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>Claude Web / Desktop</span>
                </div>
                <p className="text-[#7a8296] text-[10px]">
                  Add to <code>claude_desktop_config.json</code> under <code>mcpServers</code>:
                </p>
                <pre className="p-1.5 bg-[#14171f] text-[9px] rounded text-[#c0c1ff] overflow-x-auto">
{`"universal-browser": {
  "command": "npx",
  "args": ["@universal-browser/cli", "start"]
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#08090b] border-t border-[#232834] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#14171f] hover:bg-[#191d27] border border-[#232834] text-xs font-mono text-[#f4f4f6] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
