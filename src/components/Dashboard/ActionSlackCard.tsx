import React from 'react';
import { MessageSquare, Bell, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface ActionSlackCardProps {
  slack: {
    channel: string;
    targetUser: string;
    headline: string;
    summary: string;
  };
}

export const ActionSlackCard: React.FC<ActionSlackCardProps> = ({ slack }) => {
  return (
    <div className="bg-[#0a0c12] border border-[#1a1d28] card-raised p-3 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1e2028] mb-2">
        <div className="flex items-center gap-1.5 text-[#ec4899]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="font-semibold text-white">Slack Incident Notification</span>
        </div>
        <span className="px-1.5 py-0.5 bg-[#1c1f2b] text-[#c0c5d6] border border-[#2b3044] text-[9px]">
          {slack.channel}
        </span>
      </div>

      {/* Slack Block Message Simulation */}
      <div className="p-2.5 bg-[#0a0b10] border-l-2 border-red-500 border-t border-r border-b border-[#1e2028] text-[11px] mb-2 font-sans">
        <div className="flex items-center gap-1.5 font-bold text-red-300 text-xs mb-1">
          <Bell className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{slack.headline}</span>
        </div>

        <p className="text-[#a5abbf] text-[11px] leading-relaxed mb-2 font-sans">
          {slack.summary}
        </p>

        <div className="flex items-center gap-2 pt-1.5 border-t border-[#1a1c26] text-[10px] font-mono">
          <span className="text-[#656b82]">Paging:</span>
          <span className="text-[#7c83ff] font-bold bg-[#7c83ff]/10 px-1 py-0.5 border border-[#7c83ff]/30">
            {slack.targetUser}
          </span>
          <span className="text-[#656b82] ml-auto">Delivered to On-Call Pager</span>
        </div>
      </div>

      {/* Interactive Slack buttons */}
      <div className="flex items-center gap-2 text-[10px]">
        <button className="px-2 py-1 bg-[#1a1c26] hover:bg-[#252837] border border-[#2a2e40] text-white transition-colors">
          Acknowledge Alert
        </button>
        <button className="px-2 py-1 bg-[#7c83ff]/20 hover:bg-[#7c83ff]/30 border border-[#7c83ff]/50 text-[#c7cbff] transition-colors flex items-center gap-1">
          Open Incident War Room <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
