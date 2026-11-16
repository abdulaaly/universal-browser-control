import React, { useState } from 'react';
import { Activity, ChevronRight, ChevronDown, Check, Clock, AlertTriangle } from 'lucide-react';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getCursorTag = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('dom') || lower.includes('tree') || lower.includes('index')) {
      return { label: 'Index', style: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' };
    }
    if (lower.includes('read') || lower.includes('markdown') || lower.includes('extract')) {
      return { label: 'Read', style: 'bg-blue-950/60 text-blue-300 border-blue-800/60' };
    }
    if (lower.includes('plan') || lower.includes('prompt') || lower.includes('thought')) {
      return { label: 'Plan', style: 'bg-orange-950/60 text-orange-300 border-orange-800/60' };
    }
    if (lower.includes('result') || lower.includes('completed')) {
      return { label: 'Done', style: 'bg-amber-950/60 text-amber-300 border-amber-800/60' };
    }
    return { label: 'Exec', style: 'bg-purple-950/60 text-purple-300 border-purple-800/60' };
  };

  return (
    <section className="space-y-1.5 flex-1 flex flex-col min-h-0">
      {/* Stream Header */}
      <div className="flex items-center justify-between px-0.5 pb-1">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="font-mono text-[10px] text-[#7a8296] uppercase tracking-wider font-semibold">
            AGENT ACTIVITY STREAM
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#14171f] px-1.5 py-0.5 rounded border border-[#232834]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-ping" />
          <span className="font-mono text-[9px] text-[#c0c1ff] font-medium">STREAMING</span>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="space-y-1.5 border-l border-[#232834] ml-2 pl-2 overflow-y-auto flex-1 max-h-60 scrollbar-thin">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#7a8296]">
            Awaiting incoming agent commands...
          </div>
        ) : (
          items
            .slice()
            .reverse()
            .map((item) => {
              const tag = getCursorTag(item.title);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="bg-[#0e1015] border border-[#232834] hover:border-[#3b4354] rounded p-2 text-xs transition cursor-pointer relative group"
                >
                  {/* Left timeline connecting dot */}
                  <span
                    className={`absolute -left-[13px] top-3 w-2 h-2 rounded-full border border-[#08090b] transition-colors ${
                      item.status === 'completed'
                        ? 'bg-[#10b981]'
                        : item.status === 'running'
                        ? 'bg-[#f59e0b] animate-ping'
                        : 'bg-[#f43f5e]'
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span
                        className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase border ${tag.style}`}
                      >
                        {tag.label}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#f4f4f6] truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 font-mono text-[10px]">
                      <span
                        className={`font-semibold ${
                          item.status === 'completed'
                            ? 'text-[#10b981]'
                            : item.status === 'running'
                            ? 'text-[#f59e0b]'
                            : 'text-[#f43f5e]'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-[#7a8296]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-[#7a8296]" />
                      )}
                    </div>
                  </div>

                  {/* Latency & Timestamp */}
                  <div className="flex items-center justify-between mt-1 text-[#7a8296] font-mono text-[10px]">
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    {item.durationMs !== undefined && (
                      <span className="text-[#10b981]">{item.durationMs}ms latency</span>
                    )}
                  </div>

                  {/* Expanded Detail */}
                  {item.detail && isExpanded && (
                    <div className="mt-1.5 pt-1.5 border-t border-[#232834] text-[11px] text-[#c4c8d4] font-mono leading-relaxed break-words bg-[#08090b] p-1.5 rounded">
                      {item.detail}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </section>
  );
};
