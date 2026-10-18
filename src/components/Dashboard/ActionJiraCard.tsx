import React from 'react';
import { Bookmark, AlertCircle, ExternalLink, User } from 'lucide-react';

interface ActionJiraCardProps {
  jira: {
    ticketKey: string;
    summary: string;
    priority: string;
    assignee: string;
    sprint: string;
  };
}

export const ActionJiraCard: React.FC<ActionJiraCardProps> = ({ jira }) => {
  return (
    <div className="bg-[#0a0c12] border border-[#1a1d28] card-raised p-3 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1e2028] mb-2">
        <div className="flex items-center gap-1.5 text-[#3b82f6]">
          <Bookmark className="w-3.5 h-3.5" />
          <span className="font-semibold text-white">Jira Ticket Created</span>
          <span className="text-[#60a5fa] font-bold">[{jira.ticketKey}]</span>
        </div>
        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-bold">
          {jira.priority}
        </span>
      </div>

      {/* Summary */}
      <div className="font-sans font-medium text-white text-[12px] mb-2">
        {jira.summary}
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-[#0a0b10] border border-[#1e2028] text-[10px] mb-2">
        <div>
          <span className="text-[#656b82]">Assignee:</span>
          <div className="text-white font-medium flex items-center gap-1 mt-0.5">
            <User className="w-2.5 h-2.5 text-[#7c83ff]" />
            <span>{jira.assignee}</span>
          </div>
        </div>
        <div>
          <span className="text-[#656b82]">Sprint:</span>
          <div className="text-amber-300 font-medium mt-0.5">{jira.sprint}</div>
        </div>
      </div>

      {/* Footer link */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-[#72798e]">Status: Open · Auto-triaged</span>
        <span className="text-[#7c83ff] hover:underline flex items-center gap-1 cursor-pointer">
          Open in Jira <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
