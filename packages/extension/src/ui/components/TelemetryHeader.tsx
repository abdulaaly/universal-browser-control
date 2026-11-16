import React from 'react';
import { Activity, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface TelemetryHeaderProps {
  connected: boolean;
  activeClient: string;
  connectionMode: 'Local WS' | 'Cloud Relay';
  latencyMs: number;
}

export const TelemetryHeader: React.FC<TelemetryHeaderProps> = ({
  connected,
  activeClient,
  connectionMode,
  latencyMs,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 p-4 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Custom SVG Quantum Core Logo */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <svg viewBox="0 0 512 512" className="w-8 h-8 drop-shadow-md">
              <defs>
                <linearGradient id="headerBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0a0f1d" />
                  <stop offset="100%" stop-color="#030712" />
                </linearGradient>
                <linearGradient id="headerCore" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#34d399" />
                  <stop offset="100%" stop-color="#059669" />
                </linearGradient>
              </defs>
              <rect x="20" y="20" width="472" height="472" rx="96" fill="url(#headerBg)" stroke="#1e293b" strokeWidth="12" />
              <ellipse cx="256" cy="300" rx="140" ry="55" fill="none" stroke="#06b6d4" strokeWidth="10" opacity="0.8" />
              <circle cx="256" cy="300" r="70" fill="url(#headerCore)" stroke="#6ee7b7" strokeWidth="10" />
              <circle cx="256" cy="300" r="28" fill="#ffffff" />
            </svg>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-100">Universal AI Browser</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous MCP Session Bridge</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
            {connected ? <Wifi className="w-3 h-3 mr-1 text-emerald-400" /> : <WifiOff className="w-3 h-3 mr-1 text-rose-400" />}
            {connectionMode}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 text-[11px]">
            <Activity className="w-3 h-3 mr-1" />
            {connected ? `${latencyMs}ms` : 'Offline'}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <span className="text-slate-500 text-[11px]">Active AI:</span>
          <span className="font-semibold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
            {activeClient}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HITL Guardrails Active</span>
        </div>
      </div>
    </div>
  );
};
