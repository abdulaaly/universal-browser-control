import React from 'react';
import { Camera, Eye, FileText, MousePointer, Sparkles } from 'lucide-react';

interface PageContextBarProps {
  pageTitle: string;
  pageUrl: string;
  elementsCount: number;
  onTrigger: (action: string) => void;
  isRunning: string | null;
}

export const PageContextBar: React.FC<PageContextBarProps> = ({
  pageTitle,
  pageUrl,
  elementsCount,
  onTrigger,
  isRunning,
}) => {
  let hostname = '';
  try {
    hostname = new URL(pageUrl).hostname;
  } catch {
    hostname = pageUrl;
  }

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0 pr-2">
          <div className="text-xs font-semibold text-zinc-100 truncate flex items-center space-x-1.5">
            <span className="truncate">{pageTitle || 'Active Browser Tab'}</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono truncate">
            {hostname}
          </div>
        </div>

        <div className="flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700/80">
          {elementsCount} nodes
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-800/60">
        <button
          onClick={() => onTrigger('dom')}
          disabled={isRunning !== null}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-800/80 text-[10px] text-zinc-300 hover:text-white transition"
        >
          <Eye className="w-3.5 h-3.5 mb-1 text-emerald-400" />
          <span className="truncate">{isRunning === 'dom' ? 'Indexing' : 'Index DOM'}</span>
        </button>

        <button
          onClick={() => onTrigger('screenshot')}
          disabled={isRunning !== null}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-800/80 text-[10px] text-zinc-300 hover:text-white transition"
        >
          <Camera className="w-3.5 h-3.5 mb-1 text-cyan-400" />
          <span className="truncate">{isRunning === 'screenshot' ? 'Capturing' : 'Capture'}</span>
        </button>

        <button
          onClick={() => onTrigger('extract')}
          disabled={isRunning !== null}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-800/80 text-[10px] text-zinc-300 hover:text-white transition"
        >
          <FileText className="w-3.5 h-3.5 mb-1 text-amber-400" />
          <span className="truncate">{isRunning === 'extract' ? 'Reading' : 'Markdown'}</span>
        </button>

        <button
          onClick={() => onTrigger('cursor')}
          disabled={isRunning !== null}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-800/80 text-[10px] text-zinc-300 hover:text-white transition"
        >
          <MousePointer className="w-3.5 h-3.5 mb-1 text-purple-400" />
          <span className="truncate">{isRunning === 'cursor' ? 'Dispatching' : 'Pointer'}</span>
        </button>
      </div>
    </div>
  );
};
