import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, Lock } from 'lucide-react';

interface ActionSuppressedCardProps {
  reason?: string;
  reachabilityStatus: string;
  cveId: string;
  service: string;
}

export const ActionSuppressedCard: React.FC<ActionSuppressedCardProps> = ({
  reason,
  reachabilityStatus,
  cveId,
  service
}) => {
  return (
    <div className="bg-[#08120c] border border-emerald-500/25 card-raised p-3 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-2">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold text-white">Alert Safely Suppressed (Noise Reduction)</span>
        </div>
        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
          0 INGRESS EXPOSURE
        </span>
      </div>

      {/* Suppression Reason Callout */}
      <div className="p-2.5 bg-[#090d0b] border border-emerald-500/20 text-[11px] mb-2 font-sans">
        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1 text-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Graph Verification Proof</span>
        </div>
        <p className="text-[#9ca3af] leading-relaxed text-[11px]">
          {reason || 'Knowledge graph traversal verified 0 ingress paths from public boundaries, no socket listeners, and no privileges to sensitive datastores.'}
        </p>
      </div>

      {/* Audit Log Record */}
      <div className="space-y-1 text-[10px] text-[#86efac]/80 bg-[#070b09] p-2 border border-emerald-500/10 font-mono">
        <div className="flex justify-between">
          <span className="text-emerald-600">Decision Engine:</span>
          <span>BFS Ingress Reachability Check</span>
        </div>
        <div className="flex justify-between">
          <span className="text-emerald-600">Network Reachability:</span>
          <span>{reachabilityStatus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-emerald-600">Audit Compliance:</span>
          <span>SOC2 & ISO-27001 Exception Logged</span>
        </div>
      </div>
    </div>
  );
};
