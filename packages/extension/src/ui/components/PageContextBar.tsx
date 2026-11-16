import React from 'react';
import { Globe, GitFork, Camera, FileText, Navigation, CheckCircle2 } from 'lucide-react';

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
    <section className="bg-[#0e1015] border border-[#232834] rounded-lg p-2.5 space-y-2">
      {/* Target Tab Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <div className="w-6 h-6 rounded bg-[#14171f] border border-[#232834] flex items-center justify-center text-[#c0c1ff] flex-shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#f4f4f6] truncate leading-tight">
              {pageTitle || 'Active Browser Tab'}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[11px] text-[#7a8296] truncate max-w-[140px]">
                {hostname || 'localhost:5173'}
              </span>
              <span className="text-[#232834] text-[10px]">•</span>
              <span className="font-mono text-[10px] text-[#10b981] bg-[#14171f] px-1.5 py-0.2 rounded border border-[#232834]">
                {elementsCount} nodes indexed
              </span>
            </div>
          </div>
        </div>

        <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-[#10b981]/20 mt-1 flex-shrink-0" />
      </div>

      {/* 4 Quick-Action Buttons in compact 2x2 grid */}
      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        <button
          onClick={() => onTrigger('dom')}
          disabled={isRunning !== null}
          className="flex items-center justify-center gap-1.5 h-7 px-2 bg-[#14171f] border border-[#232834] hover:border-[#3b4354] hover:bg-[#191d27] text-[#e3e2e5] rounded text-[11px] font-mono transition-colors disabled:opacity-50"
        >
          <GitFork className="w-3 h-3 text-[#c0c1ff]" />
          <span>{isRunning === 'dom' ? 'Indexing...' : 'Index DOM'}</span>
        </button>

        <button
          onClick={() => onTrigger('screenshot')}
          disabled={isRunning !== null}
          className="flex items-center justify-center gap-1.5 h-7 px-2 bg-[#14171f] border border-[#232834] hover:border-[#3b4354] hover:bg-[#191d27] text-[#e3e2e5] rounded text-[11px] font-mono transition-colors disabled:opacity-50"
        >
          <Camera className="w-3 h-3 text-[#c0c1ff]" />
          <span>{isRunning === 'screenshot' ? 'Capturing...' : 'Capture Viewport'}</span>
        </button>

        <button
          onClick={() => onTrigger('extract')}
          disabled={isRunning !== null}
          className="flex items-center justify-center gap-1.5 h-7 px-2 bg-[#14171f] border border-[#232834] hover:border-[#3b4354] hover:bg-[#191d27] text-[#e3e2e5] rounded text-[11px] font-mono transition-colors disabled:opacity-50"
        >
          <FileText className="w-3 h-3 text-[#c0c1ff]" />
          <span>{isRunning === 'extract' ? 'Reading...' : 'Extract Markdown'}</span>
        </button>

        <button
          onClick={() => onTrigger('cursor')}
          disabled={isRunning !== null}
          className="flex items-center justify-center gap-1.5 h-7 px-2 bg-[#14171f] border border-[#232834] hover:border-[#3b4354] hover:bg-[#191d27] text-[#e3e2e5] rounded text-[11px] font-mono transition-colors disabled:opacity-50"
        >
          <Navigation className="w-3 h-3 text-[#10b981]" />
          <span>{isRunning === 'cursor' ? 'Dispatching...' : 'Agent Pointer'}</span>
        </button>
      </div>
    </section>
  );
};
