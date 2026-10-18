import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="w-full border-t border-[#181a24] bg-[#07080c] text-xs font-mono text-[#8a91a8] py-10 mt-12 select-none">
      <div className="max-w-[1520px] mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#141620]">
          {/* Logo & Project Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#12141c] border border-[#7c83ff]/40 flex items-center justify-center text-[#7c83ff]">
                <Shield className="w-3 h-3" />
              </div>
              <span className="font-bold text-white text-sm font-sans tracking-wide">
                BLAST RADIUS
              </span>
            </div>
            <p className="text-[#656b82] text-[11px] font-sans">
              AI Security Triage Agent powered by Knowledge Graphs & Model Context Protocol.
            </p>
          </div>

          {/* Hackathon Track & Team Info */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="p-2 bg-[#12141c] border border-[#1e2028]">
              <span className="text-[#656b82] block text-[9px] uppercase">Hackathon Track</span>
              <span className="text-white font-semibold">Agents that Act on Connected Data</span>
            </div>
            <div className="p-2 bg-[#12141c] border border-[#1e2028]">
              <span className="text-[#656b82] block text-[9px] uppercase">Team</span>
              <span className="text-[#7c83ff] font-semibold">Team Blast Radius [Hackathon 2026]</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#555a6e]">
          <div>
            <span>© 2026 Blast Radius. Built for Hackathon Demo. Open standard under MIT License.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Graph Engine Operational
            </span>
            <button
              onClick={onScrollToTop}
              className="flex items-center gap-1 text-[#8890a6] hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
