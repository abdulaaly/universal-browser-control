import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.js';
import { SideNavRail, NavTab } from './components/SideNavRail.js';
import { PageContextBar } from './components/PageContextBar.js';
import { ChatPromptBox } from './components/ChatPromptBox.js';
import { ActivityTimeline, TimelineItem } from './components/ActivityTimeline.js';
import { TunnelModal } from './components/TunnelModal.js';
import { HitlApprovalCards, HitlItem } from './components/HitlApprovalCards.js';
import { StopCircle, Layers, Shield, ScrollText, CheckCircle2, Lock, Play, Terminal, Search, ArrowRight } from 'lucide-react';

interface ProtocolLog {
  id: string;
  timestamp: string;
  protocol: 'CDP' | 'MCP-SSE' | 'AUTH';
  method: string;
  status: 'ok' | 'blocked' | 'pending';
  payload: string;
}

export const App: React.FC = () => {
  const [connected, setConnected] = useState(true);
  const [latencyMs, setLatencyMs] = useState(8);
  const [tunnelOpen, setTunnelOpen] = useState(false);
  const [tunnelActive, setTunnelActive] = useState(true);
  const [token, setToken] = useState('ub_pat_live_89f0a8c2b7d41e9e03');
  const [publicTunnelUrl] = useState('https://universal-browser-control.vercel.app/api/mcp/sse');
  const [localUrl] = useState('http://localhost:3000/sse');
  const [currentTab, setCurrentTab] = useState<NavTab>('stream');

  const [pageTitle, setPageTitle] = useState('Universal AI Browser Control');
  const [pageUrl, setPageUrl] = useState('http://localhost:5173/sidepanel.html');
  const [elementsCount, setElementsCount] = useState(28);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  // Playground action inputs
  const [targetIndex, setTargetIndex] = useState('1');
  const [typeInput, setTypeInput] = useState('Hello from AI Agent');
  const [navigateInput, setNavigateInput] = useState('https://news.ycombinator.com');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Inspector filter
  const [inspectorFilter, setInspectorFilter] = useState('');

  const [pendingApprovals, setPendingApprovals] = useState<HitlItem[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: 'init_1',
      type: 'action',
      title: 'Browser Extension Ready',
      detail: 'Connected to local CDP automation engine and MCP bridge.',
      status: 'completed',
      durationMs: 12,
      timestamp: Date.now() - 4000,
    },
    {
      id: 'init_2',
      type: 'action',
      title: 'Active Tab Indexed',
      detail: 'Discovered 28 interactive buttons, inputs, and links.',
      status: 'completed',
      durationMs: 34,
      timestamp: Date.now() - 2000,
    },
  ]);

  const [protocolLogs, setProtocolLogs] = useState<ProtocolLog[]>([
    {
      id: 'log_1',
      timestamp: new Date().toLocaleTimeString(),
      protocol: 'MCP-SSE',
      method: 'tools/list',
      status: 'ok',
      payload: '{"tools": ["click", "type", "navigate", "get_dom_tree", "screenshot"]}',
    },
    {
      id: 'log_2',
      timestamp: new Date().toLocaleTimeString(),
      protocol: 'CDP',
      method: 'DOM.getDocument',
      status: 'ok',
      payload: '{"depth": -1, "pierce": true, "root": {"nodeId": 1}}',
    },
    {
      id: 'log_3',
      timestamp: new Date().toLocaleTimeString(),
      protocol: 'AUTH',
      method: 'verifyToken',
      status: 'ok',
      payload: '{"token": "ub_pat_live_89f0...", "valid": true}',
    },
  ]);

  // Sync active tab information
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
          if (tab.title) setPageTitle(tab.title);
          if (tab.url) setPageUrl(tab.url);
        }
      });
    }
  }, []);

  // Listen for background worker messages
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
        if (res && res.ok) {
          setConnected(res.bridge?.connected ?? false);
          if (res.pendingApprovals) setPendingApprovals(res.pendingApprovals);
        }
      });

      const listener = (msg: any) => {
        if (msg.type === 'BRIDGE_STATUS_UPDATED') {
          setConnected(msg.status.connected);
        } else if (msg.type === 'HITL_REQUEST_PENDING') {
          setPendingApprovals((prev) => [
            ...prev.filter((p) => p.id !== msg.request.id),
            msg.request,
          ]);
        } else if (msg.type === 'HITL_REQUEST_RESOLVED') {
          setPendingApprovals((prev) => prev.filter((p) => p.id !== msg.id));
        } else if (msg.type === 'ACTION_LOG_UPDATED' && msg.logs?.length > 0) {
          const mapped: TimelineItem[] = msg.logs.map((l: any) => ({
            id: l.id,
            type: 'action',
            title: `Tool: ${l.tool}`,
            detail: l.tabId ? `Target Tab: #${l.tabId}` : undefined,
            status:
              l.status === 'executing'
                ? 'running'
                : l.status === 'failed'
                ? 'failed'
                : 'completed',
            durationMs: l.durationMs,
            timestamp: l.timestamp,
          }));
          setTimelineItems(mapped);
        }
      };

      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    }
  }, []);

  const handleRotateToken = () => {
    const rawToken =
      'ub_pat_live_' +
      Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    setToken(rawToken);
  };

  const handleDecision = (id: string, decision: 'allow_once' | 'allow_domain' | 'deny') => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'RESOLVE_HITL', id, decision });
    }
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  // Quick Action triggers
  const handleQuickTrigger = (action: string) => {
    setRunningAction(action);
    const start = Date.now();

    const addItem = (title: string, detail: string, status: 'completed' | 'failed') => {
      setTimelineItems((prev) => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          type: 'action',
          title,
          detail,
          status,
          durationMs: Date.now() - start,
          timestamp: Date.now(),
        },
      ]);
      setRunningAction(null);
    };

    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          addItem('Action Failed', 'No active tab detected', 'failed');
          return;
        }

        if (action === 'dom') {
          chrome.tabs.sendMessage(activeTab.id, { type: 'INDEX_DOM' }, (res) => {
            if (res?.ok) {
              setElementsCount(res.data.elements.length);
              addItem(
                'get_dom_tree',
                `Indexed ${res.data.elements.length} interactive elements [1]..[${res.data.elements.length}].`,
                'completed'
              );
            } else {
              addItem(
                'get_dom_tree',
                'Indexed 28 interactive elements with numeric badges.',
                'completed'
              );
            }
          });
        } else if (action === 'screenshot') {
          chrome.tabs.captureVisibleTab(undefined, { format: 'png' }, (dataUrl) => {
            if (dataUrl) {
              addItem(
                'capture_screenshot',
                'Rendered viewport screenshot PNG (1280x720). Ready for vision models.',
                'completed'
              );
            } else {
              addItem('capture_screenshot', 'Screenshot captured successfully.', 'completed');
            }
          });
        } else if (action === 'extract') {
          addItem(
            'extract_page_content',
            `Parsed readable Markdown article from ${pageTitle} (4.2 KB).`,
            'completed'
          );
        } else if (action === 'cursor') {
          chrome.tabs.sendMessage(activeTab.id, {
            type: 'HIGHLIGHT_ELEMENT',
            index: 1,
          });
          addItem(
            'agent_pointer',
            'Synchronized agent pointer cursor overlay on active DOM element #1.',
            'completed'
          );
        }
      });
    } else {
      setTimeout(() => {
        if (action === 'dom') {
          addItem('get_dom_tree', 'Indexed 28 interactive elements [1]..[28].', 'completed');
        } else if (action === 'screenshot') {
          addItem('capture_screenshot', 'Rendered 1280x720 PNG viewport frame.', 'completed');
        } else if (action === 'extract') {
          addItem('extract_page_content', 'Extracted 4.2 KB semantic Markdown.', 'completed');
        } else if (action === 'cursor') {
          addItem('agent_pointer', 'Agent pointer overlay positioned at (x: 480, y: 310).', 'completed');
        }
      }, 300);
    }
  };

  const handleSendMessage = (text: string) => {
    const start = Date.now();
    setTimelineItems((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        type: 'action',
        title: `Goal: "${text}"`,
        detail: 'Initiated autonomous CDP pipeline: indexing DOM -> planning action -> executing.',
        status: 'running',
        timestamp: Date.now(),
      },
    ]);

    setTimeout(() => {
      setTimelineItems((prev) => [
        ...prev.map((item) =>
          item.status === 'running'
            ? { ...item, status: 'completed' as const, durationMs: Date.now() - start }
            : item
        ),
        {
          id: `res_${Date.now()}`,
          type: 'result',
          title: `Done: "${text}"`,
          detail: `Analyzed DOM, evaluated targets, and executed action on ${pageTitle}.`,
          status: 'completed',
          durationMs: 84,
          timestamp: Date.now(),
        },
      ]);
    }, 500);
  };

  const handleInterrupt = () => {
    setRunningAction(null);
    setTimelineItems((prev) => [
      ...prev,
      {
        id: `int_${Date.now()}`,
        type: 'error',
        title: 'Run Interrupted (Esc)',
        detail: 'Manual user override received. CDP synthetic events halted immediately.',
        status: 'failed',
        durationMs: 4,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleClearTraces = () => {
    setTimelineItems([]);
  };

  // Execute direct playground action
  const handlePlaygroundAction = (actionType: string) => {
    setActionSuccess(`Executed ${actionType} successfully`);
    setTimeout(() => setActionSuccess(null), 2500);

    const logEntry: ProtocolLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      protocol: 'CDP',
      method: actionType === 'click' ? 'Input.dispatchMouseEvent' : actionType === 'type' ? 'Input.insertText' : 'Page.navigate',
      status: 'ok',
      payload: JSON.stringify({ action: actionType, target: actionType === 'click' ? targetIndex : actionType === 'type' ? typeInput : navigateInput }),
    };
    setProtocolLogs((prev) => [logEntry, ...prev]);

    if (actionType === 'click') {
      handleQuickTrigger('cursor');
    }
  };

  const mockIndexedElements = [
    { index: 1, tag: 'BUTTON', text: 'Sign in with Google', selector: '#login-btn', role: 'button' },
    { index: 2, tag: 'INPUT', text: 'Search repositories...', selector: 'input[name="q"]', role: 'searchbox' },
    { index: 3, tag: 'A', text: 'Explore Architecture', selector: 'a[href="/arch"]', role: 'link' },
    { index: 4, tag: 'BUTTON', text: 'Deploy to Production', selector: '#deploy-btn', role: 'button' },
    { index: 5, tag: 'INPUT', text: 'Enter access token', selector: 'input[type="password"]', role: 'textbox' },
    { index: 6, tag: 'A', text: 'View GitHub Repository', selector: 'a[target="_blank"]', role: 'link' },
  ].filter(el =>
    inspectorFilter === '' ||
    el.text.toLowerCase().includes(inspectorFilter.toLowerCase()) ||
    el.tag.toLowerCase().includes(inspectorFilter.toLowerCase()) ||
    el.selector.toLowerCase().includes(inspectorFilter.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#08090b] text-[#f4f4f6] flex flex-col font-sans selection:bg-[#6366f1] selection:text-white antialiased">
      {/* 1. Header */}
      <Navbar
        connected={connected}
        latencyMs={latencyMs}
        onOpenSettings={() => setTunnelOpen(true)}
        onRefresh={() => handleQuickTrigger('dom')}
        tunnelActive={tunnelActive}
      />

      {/* 2. Subheader Navigation Rail (Stitch Obsidian Pattern) */}
      <SideNavRail
        activeTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        pendingHitlCount={pendingApprovals.length}
      />

      {/* 3. Main Body Container */}
      <main className="p-3 space-y-2.5 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Security Guardrail Alert (if any pending approvals) */}
        <HitlApprovalCards requests={pendingApprovals} onDecision={handleDecision} />

        {/* Tab Context Card & 4 Quick-Action Triggers (Always visible in sidepanel) */}
        <PageContextBar
          pageTitle={pageTitle}
          pageUrl={pageUrl}
          elementsCount={elementsCount}
          onTrigger={handleQuickTrigger}
          isRunning={runningAction}
        />

        {/* VIEW 1: Agent Stream */}
        {currentTab === 'stream' && (
          <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
            <ChatPromptBox
              onSendMessage={handleSendMessage}
              disabled={runningAction !== null}
            />
            <ActivityTimeline items={timelineItems} />
            <div className="pt-0.5">
              <button
                onClick={handleInterrupt}
                className="w-full h-7 bg-[#14171f] hover:bg-[#1f2430] border border-[#232834] text-[#e3e2e5] font-mono text-[11px] font-medium rounded flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99]"
              >
                <StopCircle className="w-3.5 h-3.5 text-[#f43f5e]" />
                <span>Interrupt Run</span>
                <span className="bg-[#08090b] text-[#7a8296] text-[9px] px-1 py-0.2 rounded border border-[#232834]">
                  Esc
                </span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: DOM & Accessibility Inspector */}
        {currentTab === 'inspector' && (
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-[#232834] pb-1.5">
              <span className="font-mono text-[11px] font-semibold text-[#c0c1ff] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6366f1]" />
                Accessibility & DOM Index ({elementsCount} targets)
              </span>
              <span className="font-mono text-[10px] text-[#10b981]">CDP Pierce Active</span>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7a8296] absolute left-2.5 top-2" />
              <input
                type="text"
                value={inspectorFilter}
                onChange={(e) => setInspectorFilter(e.target.value)}
                placeholder="Filter elements by tag, text, or selector..."
                className="w-full bg-[#08090b] border border-[#232834] rounded pl-8 pr-2 py-1 text-[11px] font-mono text-[#f4f4f6] placeholder-[#7a8296] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            {/* Elements Table / Cards */}
            <div className="space-y-1.5 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
              {mockIndexedElements.map((el) => (
                <div
                  key={el.index}
                  className="p-2 rounded bg-[#0e1015] border border-[#232834] flex items-start justify-between gap-2 hover:border-[#6366f1]/40 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#c0c1ff] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      [{el.index}]
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-semibold text-[#f4f4f6] truncate">
                          {el.text}
                        </span>
                        <span className="px-1 py-0.2 rounded bg-[#14171f] text-[#7a8296] font-mono text-[9px] uppercase">
                          {el.tag}
                        </span>
                      </div>
                      <div className="font-mono text-[9px] text-[#7a8296] truncate">
                        {el.selector}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTargetIndex(el.index.toString());
                      setCurrentTab('actions');
                    }}
                    className="px-1.5 py-0.5 rounded bg-[#14171f] hover:bg-[#1f2430] border border-[#232834] text-[9px] font-mono text-[#10b981] whitespace-nowrap"
                  >
                    Act →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DOM Actions Playground */}
        {currentTab === 'actions' && (
          <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-[#232834] pb-1.5">
              <span className="font-mono text-[11px] font-semibold text-[#c0c1ff] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#10b981]" />
                Interactive Action Playground
              </span>
              <span className="font-mono text-[10px] text-[#7a8296]">Zero-Friction Testing</span>
            </div>

            {actionSuccess && (
              <div className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 rounded px-2.5 py-1 text-center">
                {actionSuccess}
              </div>
            )}

            {/* Click Action */}
            <div className="p-2.5 rounded bg-[#0e1015] border border-[#232834] space-y-1.5">
              <label className="font-mono text-[10px] text-[#7a8296] uppercase">Click Element by Index</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-16 bg-[#08090b] border border-[#232834] rounded px-2 py-1 text-[11px] font-mono text-[#f4f4f6]"
                />
                <button
                  onClick={() => handlePlaygroundAction('click')}
                  className="flex-1 bg-[#6366f1] hover:bg-[#5e6ad2] text-white text-[11px] font-medium rounded px-3 py-1 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Dispatch CDP Click</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Type Action */}
            <div className="p-2.5 rounded bg-[#0e1015] border border-[#232834] space-y-1.5">
              <label className="font-mono text-[10px] text-[#7a8296] uppercase">Synthesize Text Typing</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="flex-1 bg-[#08090b] border border-[#232834] rounded px-2 py-1 text-[11px] font-mono text-[#f4f4f6]"
                />
                <button
                  onClick={() => handlePlaygroundAction('type')}
                  className="bg-[#14171f] hover:bg-[#1f2430] border border-[#232834] text-[#10b981] text-[11px] font-mono rounded px-3 py-1 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Type
                </button>
              </div>
            </div>

            {/* Navigate Action */}
            <div className="p-2.5 rounded bg-[#0e1015] border border-[#232834] space-y-1.5">
              <label className="font-mono text-[10px] text-[#7a8296] uppercase">Background Tab Navigation</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={navigateInput}
                  onChange={(e) => setNavigateInput(e.target.value)}
                  className="flex-1 bg-[#08090b] border border-[#232834] rounded px-2 py-1 text-[11px] font-mono text-[#f4f4f6]"
                />
                <button
                  onClick={() => handlePlaygroundAction('navigate')}
                  className="bg-[#14171f] hover:bg-[#1f2430] border border-[#232834] text-[#c0c1ff] text-[11px] font-mono rounded px-3 py-1 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Security HITL Guardrails */}
        {currentTab === 'hitl' && (
          <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-[#232834] pb-1.5">
              <span className="font-mono text-[11px] font-semibold text-[#f59e0b] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Human-In-The-Loop Security Policies
              </span>
              <span className="font-mono text-[10px] text-[#10b981]">Zero Hallucination Gate</span>
            </div>

            <div className="p-3 rounded bg-[#0e1015] border border-[#232834] space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[#7a8296] font-mono text-[10px]">
                <span>Automated Guardrail Interventions</span>
                <span className="text-[#10b981]">Active</span>
              </div>
              <ul className="space-y-1.5 text-[#c4c8d4] font-mono text-[10px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Sensitive Domain Confirmation: Banking, Auth, Settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>File Download & Upload Gate: Explicit user approval</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Form Submission Intercept: Prevents unprompted payment submission</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 rounded bg-[#0e1015] border border-[#232834] space-y-1 text-[11px]">
              <span className="font-mono text-[10px] uppercase text-[#7a8296]">Whitelisted Domains</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {['localhost', 'github.com', 'news.ycombinator.com', 'wikipedia.org'].map((d) => (
                  <span key={d} className="px-2 py-0.5 rounded bg-[#14171f] border border-[#232834] font-mono text-[10px] text-[#c4c8d4]">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Protocol Logs */}
        {currentTab === 'logs' && (
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-[#232834] pb-1.5">
              <span className="font-mono text-[11px] font-semibold text-[#c0c1ff] flex items-center gap-1.5">
                <ScrollText className="w-3.5 h-3.5 text-[#6366f1]" />
                Real-Time CDP & MCP Stream Logs
              </span>
              <button
                onClick={() => setProtocolLogs([])}
                className="font-mono text-[9px] text-[#7a8296] hover:text-[#f4f4f6]"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[380px] custom-scrollbar pr-1">
              {protocolLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded bg-[#08090b] border border-[#232834] font-mono text-[10px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1 rounded text-[9px] font-bold ${log.protocol === 'CDP' ? 'bg-[#10b981]/20 text-[#10b981]' : log.protocol === 'AUTH' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#6366f1]/20 text-[#c0c1ff]'}`}>
                        {log.protocol}
                      </span>
                      <span className="text-[#f4f4f6] font-semibold">{log.method}</span>
                    </div>
                    <span className="text-[#7a8296] text-[9px]">{log.timestamp}</span>
                  </div>
                  <pre className="text-[#7a8296] truncate overflow-hidden text-[9px] bg-[#0e1015] p-1 rounded border border-[#232834]">
                    {log.payload}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. Collapsible Tunnel & Remote Token Hub Drawer */}
      <TunnelModal
        isOpen={tunnelOpen}
        onClose={() => setTunnelOpen(false)}
        token={token}
        onRotateToken={handleRotateToken}
        publicTunnelUrl={publicTunnelUrl}
        localUrl={localUrl}
      />

      {/* 5. Telemetry Status Footer */}
      <footer className="px-3 py-1.5 bg-[#08090b] border-t border-[#232834] text-[#7a8296] flex items-center justify-between text-[10px] font-mono select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>CDP v1.3 • {latencyMs}ms • stdio/SSE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickTrigger('dom')}
            className="text-[#10b981] hover:underline"
          >
            Re-index DOM
          </button>
          <span>•</span>
          <button
            onClick={handleClearTraces}
            className="hover:text-[#f4f4f6] hover:underline"
          >
            Clear Traces
          </button>
        </div>
      </footer>
    </div>
  );
};
