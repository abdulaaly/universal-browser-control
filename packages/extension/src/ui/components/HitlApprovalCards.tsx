import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle } from 'lucide-react';

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
    <div className="space-y-3 mb-4">
      <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-xs">
        <AlertTriangle className="w-4 h-4" />
        <span>Action Approval Required ({requests.length})</span>
      </div>

      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-3.5 shadow-lg animate-in fade-in duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700/60">
                {req.tool}
              </span>
              {req.domain && (
                <span className="ml-2 text-xs text-slate-300 font-medium">
                  {req.domain}
                </span>
              )}
            </div>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>

          <p className="text-xs text-slate-200 mb-3 leading-relaxed">
            {req.description}
          </p>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onDecision(req.id, 'allow_once')}
              className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Allow Once</span>
            </button>

            <button
              onClick={() => onDecision(req.id, 'allow_domain')}
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium border border-slate-700 transition truncate"
              title="Whitelist domain for current session"
            >
              <span>Trust Domain</span>
            </button>

            <button
              onClick={() => onDecision(req.id, 'deny')}
              className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-medium border border-rose-700 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Deny</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
