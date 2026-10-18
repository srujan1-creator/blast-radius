import React, { useState } from 'react';
import type { SecurityFinding } from '../../types';
import { 
  RotateCcw, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AlertQueueProps {
  findings: SecurityFinding[];
  selectedFindingId: string;
  onSelectFinding: (findingId: string) => void;
  isCvssView: boolean;
  onToggleView: (cvssView: boolean) => void;
  onRunTriage: () => void;
  onResetTriage: () => void;
  isSimulating: boolean;
  hasTriaged: boolean;
  simulationStep: number;
  totalSteps: number;
}

export const AlertQueue: React.FC<AlertQueueProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  isCvssView,
  onToggleView,
  onRunTriage,
  onResetTriage,
  isSimulating,
  hasTriaged,
  simulationStep,
  totalSteps
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const sortedFindings = [...findings].sort((a, b) => {
    if (isCvssView) {
      return b.genericCvss - a.genericCvss;
    }
    return b.blastRadiusScore - a.blastRadiusScore;
  });

  // Filtering
  const filteredFindings = sortedFindings.filter((item) => {
    const matchesSearch = 
      item.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.affectedService.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterSeverity === 'all') return true;
    return item.status === filterSeverity;
  });

  const criticalCount = findings.filter(f => f.status === 'critical').length;
  const highCount = findings.filter(f => f.status === 'high').length;
  const suppressedCount = findings.filter(f => f.status === 'suppressed').length;

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] border border-[#1a1d28] card-raised select-none overflow-hidden">
      {/* Queue Header */}
      <div className="p-3 bg-[#0d0f16] border-b border-[#181a24] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7c83ff]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
              Alert Queue
            </span>
            <span className="text-[10px] font-mono text-[#656b82]">
              ({findings.length})
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#07080c] border border-[#1a1c28] p-0.5 text-[10px] font-mono">
            <button
              onClick={() => { sound.playClick(); onToggleView(false); }}
              className={`px-2 py-0.5 transition-all cursor-pointer ${
                !isCvssView
                  ? 'bg-[#7c83ff] text-white font-semibold shadow-sm'
                  : 'text-[#6e758c] hover:text-[#c0c5d6]'
              }`}
            >
              FalkorDB
            </button>
            <button
              onClick={() => { sound.playClick(); onToggleView(true); }}
              className={`px-2 py-0.5 transition-all cursor-pointer ${
                isCvssView
                  ? 'bg-[#222638] text-white font-semibold'
                  : 'text-[#6e758c] hover:text-[#c0c5d6]'
              }`}
            >
              CVSS
            </button>
          </div>
        </div>

        {/* Triage with Agent Button */}
        <button
          onClick={() => {
            sound.playPing(840);
            onRunTriage();
          }}
          disabled={isSimulating}
          className="w-full py-1.5 px-3 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-[11px] font-mono font-bold border border-[#9aa0ff] shadow-[0_0_15px_rgba(124,131,255,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Agent Triaging ({simulationStep}/{totalSteps})...</span>
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 fill-current" />
              <span>Triage with Agent</span>
            </>
          )}
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4d5366]" />
          <input
            type="text"
            placeholder="Search CVE, package, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#07080d] border border-[#181a24] text-xs pl-7 pr-3 py-1 text-white placeholder-[#454a5c] focus:outline-none focus:border-[#7c83ff] font-mono"
          />
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex items-center gap-1 text-[10px] font-mono pt-0.5">
          <button
            onClick={() => { sound.playClick(); setFilterSeverity('all'); }}
            className={`px-2 py-0.5 border cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-[#181a26] text-white border-[#2c3246]'
                : 'text-[#6e758c] border-transparent hover:text-white'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setFilterSeverity('critical'); }}
            className={`px-1.5 py-0.5 border cursor-pointer ${
              filterSeverity === 'critical'
                ? 'bg-red-500/15 text-red-300 border-red-500/40'
                : 'text-[#6e758c] border-transparent hover:text-red-300'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => { sound.playClick(); setFilterSeverity('high'); }}
            className={`px-1.5 py-0.5 border cursor-pointer ${
              filterSeverity === 'high'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'text-[#6e758c] border-transparent hover:text-amber-300'
            }`}
          >
            High ({highCount})
          </button>
          <button
            onClick={() => { sound.playClick(); setFilterSeverity('suppressed'); }}
            className={`px-1.5 py-0.5 border cursor-pointer ${
              filterSeverity === 'suppressed'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'text-[#6e758c] border-transparent hover:text-emerald-300'
            }`}
          >
            Suppressed ({suppressedCount})
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#13151f]">
        {filteredFindings.map((finding) => {
          const isSelected = finding.id === selectedFindingId;
          const isCritical = finding.status === 'critical';
          const isHigh = finding.status === 'high';
          const isSuppressed = finding.status === 'suppressed';

          return (
            <div
              key={finding.id}
              onClick={() => {
                sound.playPing(680);
                onSelectFinding(finding.id);
              }}
              className={`p-2.5 cursor-pointer transition-all border-l-2 ${
                isSelected
                  ? isCritical
                    ? 'bg-[#170e11] border-l-red-500'
                    : isHigh
                    ? 'bg-[#18120a] border-l-amber-500'
                    : 'bg-[#0a1610] border-l-emerald-500'
                  : 'border-l-transparent hover:bg-[#0f1118]'
              }`}
            >
              {/* Row 1: CVE ID & Badge */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-xs font-semibold text-white">
                  {finding.cveId}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                  <span className="text-[#555a6d]">
                    CVSS {finding.genericCvss.toFixed(1)}
                  </span>
                  <span className="text-[#3b4054]">→</span>
                  <span
                    className={`px-1.5 py-0.2 font-bold border ${
                      isCritical
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {finding.blastRadiusScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Row 2: Package & Target Service */}
              <div className="text-[11px] text-[#8e94a8] mb-1 line-clamp-1">
                <span className="text-[#c7cbff] font-mono">{finding.package}</span>
                <span className="text-[#454a5c] mx-1">in</span>
                <span>{finding.affectedService}</span>
              </div>

              {/* Row 3: Reachability / Crown Jewel route */}
              <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-[#141622]">
                {isCritical || isHigh ? (
                  <span className="text-red-400 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    <span>{finding.hopsCount} hops to {finding.targetDataStoreId ? 'PII Store' : 'Mesh'}</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{finding.reachabilityStatus}</span>
                  </span>
                )}

                <span className="text-[#555a6d]">
                  {isSuppressed ? 'Suppressed' : isCritical ? 'Critical' : 'High'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
