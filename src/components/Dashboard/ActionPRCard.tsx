import React, { useState } from 'react';
import { GitPullRequest, Check, ExternalLink, Copy } from 'lucide-react';

interface ActionPRCardProps {
  pr: {
    title: string;
    prNumber: number;
    branch: string;
    targetFile: string;
    oldLine: string;
    newLine: string;
    assignedReviewer: string;
  };
}

export const ActionPRCard: React.FC<ActionPRCardProps> = ({ pr }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`git checkout ${pr.branch}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0c12] border border-[#1a1d28] card-raised p-3 text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1e2028] mb-2">
        <div className="flex items-center gap-1.5 text-[#38bdf8]">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span className="font-semibold text-white">Pull Request #{pr.prNumber} Opened</span>
        </div>
        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
          CI CHECKS PASSING (4/4)
        </span>
      </div>

      {/* PR Title & Branch */}
      <div className="font-sans font-medium text-white text-[12px] mb-1">
        {pr.title}
      </div>
      <div className="text-[10px] text-[#8890a6] mb-2 flex items-center justify-between">
        <span>Branch: <code className="text-[#a5abbf] bg-[#0c0d14] px-1 py-0.5 border border-[#1e2028]">{pr.branch}</code></span>
        <button
          onClick={handleCopy}
          className="text-[#656b82] hover:text-white flex items-center gap-1 transition-colors"
          title="Copy branch checkout"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Git Diff Block */}
      <div className="bg-[#090a0f] border border-[#1e2028] p-2 text-[10px] font-mono rounded-none mb-2 overflow-x-auto">
        <div className="text-[#656b82] pb-1 border-b border-[#171922] mb-1 flex items-center justify-between">
          <span>{pr.targetFile}</span>
          <span className="text-[9px] text-[#4d5265]">Unified Diff</span>
        </div>
        <div className="text-red-400/90 bg-red-950/20 px-1 py-0.5 border-l-2 border-red-500">
          - {pr.oldLine}
        </div>
        <div className="text-emerald-400/90 bg-emerald-950/20 px-1 py-0.5 border-l-2 border-emerald-500 mt-0.5">
          + {pr.newLine}
        </div>
      </div>

      {/* Reviewer & Link */}
      <div className="flex items-center justify-between text-[10px] text-[#8a91a8]">
        <span>Reviewer: <span className="text-white font-medium">{pr.assignedReviewer}</span></span>
        <span className="text-[#7c83ff] hover:underline flex items-center gap-1 cursor-pointer">
          View on GitHub <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
