import React from 'react';
import { Layout, Bot, Code2, Shield, ScrollText } from 'lucide-react';

export type NavTab = 'inspector' | 'stream' | 'actions' | 'hitl' | 'logs';

interface SideNavRailProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingHitlCount?: number;
}

export const SideNavRail: React.FC<SideNavRailProps> = ({
  activeTab,
  onTabChange,
  pendingHitlCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'inspector', label: 'Inspector', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'stream', label: 'Agent Stream', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'actions', label: 'DOM Actions', icon: <Code2 className="w-3.5 h-3.5" /> },
    {
      id: 'hitl',
      label: 'Security HITL',
      icon: <Shield className="w-3.5 h-3.5" />,
      badge: pendingHitlCount > 0 ? pendingHitlCount : undefined,
    },
    { id: 'logs', label: 'Protocol Logs', icon: <ScrollText className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="bg-[#0e1015] border-b border-[#232834] px-2 py-1 flex items-center justify-between gap-1 overflow-x-auto text-[#7a8296] text-[11px] select-none no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors whitespace-nowrap font-mono text-[11px] ${
              isActive
                ? 'bg-[#191d27] text-[#c0c1ff] border-l-2 border-[#6366f1] font-medium'
                : 'hover:text-[#f4f4f6] hover:bg-[#14171f]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="w-4 h-4 rounded-full bg-[#f59e0b] text-[#000000] text-[9px] font-bold flex items-center justify-center animate-bounce">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
