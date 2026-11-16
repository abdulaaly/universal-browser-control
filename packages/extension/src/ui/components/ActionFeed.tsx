import React from 'react';
import { Activity, Check, Clock, X, AlertCircle } from 'lucide-react';

export interface ActionLog {
  id: string;
  tool: string;
  tabId?: number;
  status: 'executing' | 'completed' | 'failed' | 'denied';
  durationMs?: number;
  timestamp: number;
}

interface ActionFeedProps {
  logs: ActionLog[];
}

export const ActionFeed: React.FC<ActionFeedProps> = ({ logs }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100">Live Browser Action Audit Feed</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {logs.length} operations
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No agent browser actions executed yet. Ready for incoming MCP commands.
          </div>
        ) : (
          logs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-xs"
            >
              <div className="flex items-center space-x-2 truncate">
                {log.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                {log.status === 'executing' && <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin flex-shrink-0" />}
                {log.status === 'failed' && <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                {log.status === 'denied' && <AlertCircle className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />}

                <span className="font-mono font-medium text-slate-200 truncate">{log.tool}</span>
                {log.tabId && (
                  <span className="text-slate-500 text-[10px]">tab:{log.tabId}</span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                {log.durationMs !== undefined && (
                  <span className="text-emerald-400">{log.durationMs}ms</span>
                )}
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
