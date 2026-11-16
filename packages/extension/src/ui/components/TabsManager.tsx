import React, { useEffect, useState } from 'react';
import { Layers, ExternalLink, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TabItem {
  id: number;
  url: string;
  title: string;
  active: boolean;
  favIconUrl?: string;
  windowId: number;
}

export const TabsManager: React.FC = () => {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 101,
      title: 'Universal AI Browser Control - Side Panel',
      url: 'http://localhost:5173/sidepanel.html',
      active: true,
      windowId: 1
    },
    {
      id: 102,
      title: 'Google Gemini',
      url: 'https://gemini.google.com',
      active: false,
      windowId: 1
    },
    {
      id: 103,
      title: 'Anthropic Claude',
      url: 'https://claude.ai',
      active: false,
      windowId: 1
    }
  ]);
  const [loading, setLoading] = useState(false);

  const refreshTabs = () => {
    setLoading(true);
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({}, (result) => {
        const mapped = result.map(t => ({
          id: t.id || 0,
          url: t.url || '',
          title: t.title || 'Untitled',
          active: t.active || false,
          favIconUrl: t.favIconUrl,
          windowId: t.windowId || 0
        }));
        setTabs(mapped);
        setLoading(false);
      });
    } else {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    refreshTabs();
  }, []);

  const switchTab = (tabId: number) => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.update) {
      chrome.tabs.update(tabId, { active: true });
      refreshTabs();
    } else {
      setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
    }
  };

  const closeTab = (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof chrome !== 'undefined' && chrome.tabs?.remove) {
      chrome.tabs.remove(tabId);
      refreshTabs();
    } else {
      setTabs(prev => prev.filter(t => t.id !== tabId));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100">Live Browser Tabs ({tabs.length})</h2>
        </div>
        <button
          onClick={refreshTabs}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center space-x-1 p-1 rounded hover:bg-slate-800 transition"
          title="Refresh tabs list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
              tab.active
                ? 'bg-slate-800/90 border-emerald-500/60 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              {tab.favIconUrl ? (
                <img src={tab.favIconUrl} alt="" className="w-4 h-4 rounded flex-shrink-0" />
              ) : (
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tab.active ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-slate-600'}`} />
              )}
              <div className="min-w-0">
                <div className="font-medium text-slate-200 truncate flex items-center space-x-1.5">
                  <span className="truncate">{tab.title}</span>
                  {tab.active && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[10px] text-emerald-400 border border-emerald-800 font-mono">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-mono">
                  {tab.url}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                #{tab.id}
              </span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800/80 transition"
                title="Close tab"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
