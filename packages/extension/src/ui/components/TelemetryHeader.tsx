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
    <div className="bg-slate-900 border-b border-slate-800 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {connected && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            )}
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center space-x-1.5">
              <span>Universal AI Browser</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous MCP Session Bridge</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {connected ? <Wifi className="w-3 h-3 mr-1 text-emerald-400" /> : <WifiOff className="w-3 h-3 mr-1 text-rose-400" />}
            {connectionMode}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono border border-slate-700">
            <Activity className="w-3 h-3 mr-1" />
            {connected ? `${latencyMs}ms` : 'Offline'}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <span className="text-slate-500">Active AI:</span>
          <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {activeClient}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HITL Guardrails Active</span>
        </div>
      </div>
    </div>
  );
};
