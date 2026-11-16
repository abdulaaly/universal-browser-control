import React from 'react';
import { Shield, ShieldAlert, Check, X, Globe } from 'lucide-react';

export interface HitlItem {
  id: string;
  tool: string;
  params: Record<string, any>;
  url?: string;
  domain?: string;
  description: string;
  timestamp: number;
}

interface HitlApprovalCardsProps {
  requests: HitlItem[];
  onDecision: (id: string, decision: 'allow_once' | 'allow_domain' | 'deny') => void;
}

export const HitlApprovalCards: React.FC<HitlApprovalCardsProps> = ({ requests, onDecision }) => {
  if (requests.length === 0) return null;

  return (
    <div className="space-y-2 mb-2">
      {requests.map((req) => (
        <section
          key={req.id}
          className="bg-[#14120a] border border-[#f59e0b]/40 rounded-lg p-2.5 space-y-2 relative overflow-hidden animate-in fade-in duration-200"
        >
          {/* Subtle background shield outline */}
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Shield className="w-24 h-24 text-[#f59e0b]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#f59e0b]/20 border border-[#f59e0b]/50 flex items-center justify-center text-[#f59e0b]">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[10px] text-[#f59e0b] font-bold tracking-wider uppercase">
                SECURITY GUARDRAIL INTERRUPT
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 py-0.2 rounded border border-[#f59e0b]/30">
              {req.tool}
            </span>
          </div>

          {/* Description */}
          <p className="font-mono text-xs text-[#e3e2e5] leading-relaxed">
            {req.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={() => onDecision(req.id, 'allow_once')}
              className="flex-1 h-7 bg-[#10b981] hover:bg-[#059669] text-black font-mono text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Allow Once</span>
            </button>

            <button
              onClick={() => onDecision(req.id, 'allow_domain')}
              className="h-7 px-2.5 bg-[#14171f] border border-[#232834] hover:border-[#3b4354] text-[#e3e2e5] font-mono text-[11px] rounded transition-colors flex items-center gap-1"
              title="Whitelist domain for current session"
            >
              <Globe className="w-3 h-3 text-[#7a8296]" />
              <span>Always for Domain</span>
            </button>

            <button
              onClick={() => onDecision(req.id, 'deny')}
              className="h-7 px-2.5 bg-[#f43f5e]/20 border border-[#f43f5e]/40 hover:bg-[#f43f5e]/30 text-[#f43f5e] font-mono text-[11px] rounded transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Deny</span>
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};
