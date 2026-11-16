import React from 'react';
import { Check, Clock, AlertTriangle, ArrowRight, Activity, Terminal } from 'lucide-react';

export interface TimelineItem {
  id: string;
  type: 'action' | 'thought' | 'result' | 'error';
  title: string;
  detail?: string;
  status: 'completed' | 'running' | 'failed';
  durationMs?: number;
  timestamp: number;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 text-white flex-1 flex flex-col min-h-0 shadow-sm">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-800/60 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <h2 className="text-xs font-semibold text-zinc-200">Agent Activity Stream</h2>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          {items.length} events
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-64 scrollbar-thin">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            Awaiting incoming agent commands...
          </div>
        ) : (
          items.slice().reverse().map((item) => (
            <div
              key={item.id}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5 text-xs transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  {item.status === 'completed' && (
                    <div className="w-4 h-4 rounded-full bg-emerald-950 flex items-center justify-center flex-shrink-0 border border-emerald-800">
                      <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                    </div>
                  )}
                  {item.status === 'running' && (
                    <div className="w-4 h-4 rounded-full bg-amber-950 flex items-center justify-center flex-shrink-0 border border-amber-800">
                      <Clock className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                    </div>
                  )}
                  {item.status === 'failed' && (
                    <div className="w-4 h-4 rounded-full bg-rose-950 flex items-center justify-center flex-shrink-0 border border-rose-800">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    </div>
                  )}

                  <span className="font-medium text-zinc-200 truncate">{item.title}</span>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0 text-[10px] font-mono text-zinc-500">
                  {item.durationMs !== undefined && (
                    <span className="text-emerald-400">{item.durationMs}ms</span>
                  )}
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>

              {item.detail && (
                <div className="mt-1.5 pt-1.5 border-t border-zinc-900 text-[11px] text-zinc-400 font-mono leading-relaxed break-words">
                  {item.detail}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
