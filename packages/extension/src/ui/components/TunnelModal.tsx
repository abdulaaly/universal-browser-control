import React, { useState } from 'react';
import { X, Copy, Check, Globe, RefreshCw, Key, ShieldCheck, Smartphone, ExternalLink } from 'lucide-react';

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

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 text-white shadow-2xl animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Remote Tunnel & Access Hub</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 my-3.5 text-xs">
          {/* Public Tunnel Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400">Public HTTPS Tunnel URL (Mobile/Remote):</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                Live Tunnel
              </span>
            </div>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono">
              <span className="text-emerald-300 truncate flex-1 text-[11px]">{publicTunnelUrl}</span>
              <button
                onClick={() => copyToClipboard('tunnel', publicTunnelUrl)}
                className="text-zinc-400 hover:text-white ml-2 p-1"
                title="Copy Tunnel URL"
              >
                {copiedKey === 'tunnel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Localhost URL */}
          <div>
            <span className="text-zinc-400 block mb-1">Localhost URL (Local Agents / CLI):</span>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono">
              <span className="text-zinc-300 truncate flex-1 text-[11px]">{localUrl}</span>
              <button
                onClick={() => copyToClipboard('local', localUrl)}
                className="text-zinc-400 hover:text-white ml-2 p-1"
                title="Copy Local URL"
              >
                {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Scoped Bearer Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400">Bearer Access Token (PAT):</span>
              <button
                onClick={onRotateToken}
                className="text-emerald-400 hover:underline flex items-center space-x-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Rotate</span>
              </button>
            </div>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono">
              <Key className="w-3 h-3 text-zinc-500 mr-1.5 flex-shrink-0" />
              <span className="text-zinc-300 truncate flex-1 text-[11px]">{token}</span>
              <button
                onClick={() => copyToClipboard('token', token)}
                className="text-zinc-400 hover:text-white ml-2 p-1"
                title="Copy Token"
              >
                {copiedKey === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Usage Note */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5 text-[11px] text-zinc-400 leading-relaxed">
            <div className="flex items-center space-x-1.5 text-zinc-200 font-semibold mb-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>ChatGPT Mobile & Remote AI Setup</span>
            </div>
            In your remote AI client settings, enter the Public HTTPS Tunnel URL and use the Bearer Access Token in the authorization header.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};
