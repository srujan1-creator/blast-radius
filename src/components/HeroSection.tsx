import React from 'react';
import { Play, ArrowRight, ShieldCheck, Database, Zap, Bot, Sparkles } from 'lucide-react';
import { MOCK_STATS } from '../data/mockData';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onScrollToDemo: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToAgent?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToDemo,
  onScrollToHowItWorks,
  onScrollToAgent
}) => {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 pt-16 pb-12 text-center select-none">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[260px] bg-[#7c83ff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Track Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e1017] border border-[#1e2230] text-[11px] font-mono text-[#a5abbf] mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#7c83ff] animate-pulse" />
        <span className="text-white font-medium tracking-wide">FALKORDB GRAPH HACKATHON</span>
        <span className="text-[#43485c]">/</span>
        <span className="text-[#8e94a8]">Agents That Act on Connected Data</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans max-w-3xl mx-auto mb-5">
        2,000 security alerts. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-[#7c83ff]">
          12 that actually matter.
        </span>
      </h1>

      {/* Subheadline */}
      <p className="text-base sm:text-lg text-[#8f96ab] max-w-2xl mx-auto leading-relaxed font-sans mb-8">
        Blast Radius reasons over your infrastructure knowledge graph to trace reachable attack paths to Crown Jewel datastores, then autonomously opens the PR, files the ticket, and alerts the owner.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        <button
          onClick={() => { sound.playClick(); onScrollToDemo(); }}
          className="px-6 py-3 bg-[#7c83ff] hover:bg-[#6c74fa] text-white font-mono text-xs font-semibold flex items-center gap-2 border border-[#969cff] shadow-[0_0_20px_rgba(124,131,255,0.3)] transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Mission Control</span>
        </button>

        {onScrollToAgent && (
          <button
            onClick={() => { sound.playPing(880); onScrollToAgent(); }}
            className="px-5 py-3 bg-[#131626] hover:bg-[#1b2036] text-[#a5adff] hover:text-white font-mono text-xs font-semibold border border-[#2e3450] hover:border-[#7c83ff] transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Bot className="w-3.5 h-3.5 text-[#7c83ff]" />
            <span>AI Agent Command Center</span>
            <Sparkles className="w-3 h-3 text-[#7c83ff]" />
          </button>
        )}

        <button
          onClick={() => { sound.playClick(); onScrollToHowItWorks(); }}
          className="px-5 py-3 bg-[#0d0f16] hover:bg-[#151824] text-[#a5abbf] hover:text-white font-mono text-xs border border-[#1e2230] hover:border-[#2f354a] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>FalkorDB Architecture</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7c83ff]" />
        </button>
      </div>

      {/* 4 Clean, Balanced Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
        {/* Stat 1 */}
        <div className="p-4 bg-[#0c0e15] border border-[#181a24] card-raised">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#656b82] mb-1">
            ALERTS INGESTED
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {MOCK_STATS.alertsReceived.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#787f96] mt-0.5 font-sans">
            Raw CVEs from Trivy & Snyk
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-4 bg-[#0c0e15] border border-[#181a24] card-raised">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
            NOISE SUPPRESSED
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
            <span>{MOCK_STATS.noiseSuppressedPercentage}%</span>
            <span className="text-xs text-emerald-500/70 font-normal">({MOCK_STATS.noiseSuppressedCount})</span>
          </div>
          <div className="text-[11px] text-[#787f96] mt-0.5 font-sans">
            Air-gapped & non-routable
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-4 bg-[#0c0e15] border border-[#181a24] card-raised">
          <div className="text-[10px] font-mono uppercase tracking-wider text-red-400 mb-1">
            CRITICAL ATTACK PATHS
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            0{MOCK_STATS.criticalAttackPaths}
          </div>
          <div className="text-[11px] text-[#787f96] mt-0.5 font-sans">
            Reachable routes to PII data
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-4 bg-[#0c0e15] border border-[#181a24] card-raised">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c83ff] mb-1">
            ACTIONS TAKEN
          </div>
          <div className="text-2xl font-bold font-mono text-[#c7cbff]">
            {MOCK_STATS.actionsTaken}
          </div>
          <div className="text-[11px] text-[#787f96] mt-0.5 font-sans">
            PRs, Jira tickets & Slack alerts
          </div>
        </div>
      </div>
    </section>
  );
};
