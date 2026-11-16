import React from 'react';
import { Radio, Settings2, ShieldCheck, Zap } from 'lucide-react';

interface NavbarProps {
  connected: boolean;
  latencyMs: number;
  onOpenSettings: () => void;
  tunnelActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  connected,
  latencyMs,
  onOpenSettings,
  tunnelActive,
}) => {
  return (
    <header className="bg-zinc-950/90 border-b border-zinc-800/80 px-4 py-3 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
          <Zap className="w-4 h-4 text-zinc-950 fill-zinc-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-100">Browser AI</span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              MCP
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Status Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-zinc-300 font-medium">{connected ? `${latencyMs}ms` : 'Offline'}</span>
          {tunnelActive && (
            <span className="text-emerald-400 text-[10px] bg-emerald-950/80 px-1 rounded ml-1 border border-emerald-800/60">
              TUNNEL
            </span>
          )}
        </div>

        {/* Remote Settings / Tunnel trigger */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          title="Remote Tunnel & Token Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
