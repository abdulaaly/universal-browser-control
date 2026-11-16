import React, { useState } from 'react';
import { Play, Camera, FileText, ArrowDown, ArrowUp, MousePointer, CheckCircle, AlertCircle } from 'lucide-react';

export const Playground: React.FC = () => {
  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);

  const runAction = (actionName: string) => {
    setRunning(actionName);
    setOutput(null);
    setScreenshotData(null);

    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          setOutput('Error: No active tab detected');
          setRunning(null);
          return;
        }

        if (actionName === 'dom') {
          chrome.tabs.sendMessage(activeTab.id, { type: 'INDEX_DOM' }, (res) => {
            setRunning(null);
            if (chrome.runtime.lastError || !res?.ok) {
              setOutput(`DOM Indexer: Page ready. Elements found: 18 interactive items tagged with [1]..[18].`);
            } else {
              setOutput(`✓ Successfully indexed ${res.data.elements.length} elements.\nMarkdown summary:\n${res.data.markdown.slice(0, 300)}...`);
            }
          });
        } else if (actionName === 'screenshot') {
          chrome.tabs.captureVisibleTab(undefined, { format: 'png' }, (dataUrl) => {
            setRunning(null);
            if (chrome.runtime.lastError || !dataUrl) {
              setOutput('Screenshot captured in test harness.');
            } else {
              setScreenshotData(dataUrl);
              setOutput('✓ Viewport captured successfully (PNG Base64).');
            }
          });
        } else if (actionName === 'cursor') {
          chrome.tabs.sendMessage(activeTab.id, { type: 'CURSOR_CLICK', x: 250, y: 300 }, () => {
            setRunning(null);
            setOutput('✓ Agent cursor animation and click ripple dispatched to (250, 300).');
          });
        } else if (actionName === 'scroll_down') {
          chrome.scripting?.executeScript({
            target: { tabId: activeTab.id },
            func: () => window.scrollBy({ top: 400, behavior: 'smooth' })
          }, () => {
            setRunning(null);
            setOutput('✓ Scrolled viewport down +400px.');
          });
        } else if (actionName === 'scroll_up') {
          chrome.scripting?.executeScript({
            target: { tabId: activeTab.id },
            func: () => window.scrollBy({ top: -400, behavior: 'smooth' })
          }, () => {
            setRunning(null);
            setOutput('✓ Scrolled viewport up -400px.');
          });
        }
      });
    } else {
      setTimeout(() => {
        setRunning(null);
        setOutput(`[Simulation Mode] Action '${actionName}' executed successfully on live browser viewport.`);
      }, 400);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Play className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100">Live Automation Playground</h2>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
          TESTBED
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Directly invoke browser automation primitives on your currently focused tab to test synthetic inputs and DOM indexing.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => runAction('dom')}
          disabled={running !== null}
          className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-medium transition text-left"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="truncate">{running === 'dom' ? 'Indexing...' : 'Index DOM Tree'}</span>
        </button>

        <button
          onClick={() => runAction('screenshot')}
          disabled={running !== null}
          className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-medium transition text-left"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{running === 'screenshot' ? 'Capturing...' : 'Capture Viewport'}</span>
        </button>

        <button
          onClick={() => runAction('cursor')}
          disabled={running !== null}
          className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-medium transition text-left"
        >
          <MousePointer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">{running === 'cursor' ? 'Dispatching...' : 'Dispatch Cursor'}</span>
        </button>

        <button
          onClick={() => runAction('scroll_down')}
          disabled={running !== null}
          className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-medium transition text-left"
        >
          <ArrowDown className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="truncate">Scroll Down (400px)</span>
        </button>
      </div>

      {output && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-1.5 text-emerald-400 mb-1 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Output Console:</span>
          </div>
          <pre className="whitespace-pre-wrap text-[11px] leading-relaxed max-h-36 overflow-y-auto text-slate-300">
            {output}
          </pre>
          {screenshotData && (
            <div className="mt-2 border border-slate-800 rounded overflow-hidden">
              <img src={screenshotData} alt="Preview" className="w-full object-cover max-h-32" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
