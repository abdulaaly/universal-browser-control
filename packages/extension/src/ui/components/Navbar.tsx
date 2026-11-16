import React from 'react';
import { Cpu, RefreshCw, Terminal, Sliders, Radio } from 'lucide-react';

interface NavbarProps {
  connected: boolean;
  latencyMs: number;
  onOpenSettings: () => void;
  onRefresh?: () => void;
  tunnelActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  connected,
  latencyMs,
  onOpenSettings,
  onRefresh,
  tunnelActive,
}) => {
  return (
    <header className="bg-[#08090b] text-[#f4f4f6] border-b border-[#232834] flex justify-between items-center px-3.5 py-2 w-full h-11 select-none sticky top-0 z-30 backdrop-blur-md">
      {/* Brand & Connection Badge */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-[#14171f] border border-[#232834] flex items-center justify-center text-[#6366f1]">
          <Cpu className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono text-xs font-semibold text-[#f4f4f6] tracking-tight flex items-center gap-1.5">
          MCP Browser Bridge
        </span>
        <div className="flex items-center gap-1 bg-[#14171f] px-1.5 py-0.5 rounded border border-[#232834]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? 'bg-[#10b981] animate-pulse' : 'bg-[#f43f5e]'
            }`}
          />
          <span className="font-mono text-[10px] text-[#10b981] font-medium">
            {connected ? `${latencyMs}ms · ${tunnelActive ? 'TUNNEL' : 'LOCAL'}` : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-[#7a8296] hover:bg-[#14171f] hover:text-[#f4f4f6] p-1.5 rounded transition-colors active:scale-95 flex items-center justify-center"
            title="Refresh State"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onOpenSettings}
          className="text-[#7a8296] hover:bg-[#14171f] hover:text-[#f4f4f6] p-1.5 rounded transition-colors active:scale-95 flex items-center justify-center"
          title="Terminal & Tunnel Hub"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="text-[#7a8296] hover:bg-[#14171f] hover:text-[#f4f4f6] p-1.5 rounded transition-colors active:scale-95 flex items-center justify-center"
          title="Bridge Settings & Token"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
