import React from 'react';
import type { GraphNode, GraphEdge, SecurityFinding } from '../types';
import { 
  X, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';

interface NodeDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
  edges: GraphEdge[];
  nodes: GraphNode[];
  findings: SecurityFinding[];
  onSelectFinding: (findingId: string) => void;
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({
  node,
  onClose,
  edges,
  nodes,
  findings,
  onSelectFinding
}) => {
  if (!node) return null;

  // Find inbound & outbound edges
  const inboundEdges = edges.filter(e => {
    const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;
    return targetId === node.id;
  });

  const outboundEdges = edges.filter(e => {
    const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
    return sourceId === node.id;
  });

  // Find linked CVEs
  const linkedFindings = findings.filter(f => 
    f.serviceNodeId === node.id || 
    f.packageNodeId === node.id || 
    f.attackPathNodeIds.includes(node.id)
  );

  const getNodeLabel = (id: string) => {
    const found = nodes.find(n => n.id === id);
    return found ? found.label : id;
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e1017] border-l border-[#1e2028] shadow-2xl flex flex-col font-mono text-xs">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#1e2028] bg-[#12141c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7c83ff]" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7c83ff]">
            NODE INSPECTOR // {node.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#8890a6] hover:text-white hover:bg-[#1c1f2b] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Title & Identity */}
        <div className="p-3 bg-[#12141c] border border-[#1e2028]">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-base font-semibold text-white font-sans">
              {node.label}
            </h2>
            {node.isCrownJewel && (
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-bold">
                CRITICAL CROWN JEWEL
              </span>
            )}
          </div>
          <div className="text-xs text-[#8890a6] font-mono">{node.sublabel || node.id}</div>
        </div>

        {/* Node Metadata Attributes */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8890a6] uppercase tracking-wider font-bold">
            Infrastructure Attributes
          </div>
          <div className="bg-[#12141c] border border-[#1e2028] p-3 space-y-2">
            <div className="flex justify-between py-1 border-b border-[#181a24]">
              <span className="text-[#656b82]">Node ID:</span>
              <span className="text-white font-mono">{node.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#181a24]">
              <span className="text-[#656b82]">Node Type:</span>
              <span className="text-[#7c83ff] font-bold">{node.type}</span>
            </div>
            {node.owner && (
              <div className="flex justify-between py-1 border-b border-[#181a24]">
                <span className="text-[#656b82]">Owner Team:</span>
                <span className="text-white">{node.owner}</span>
              </div>
            )}
            {node.environment && (
              <div className="flex justify-between py-1 border-b border-[#181a24]">
                <span className="text-[#656b82]">Environment:</span>
                <span className="text-amber-300">{node.environment}</span>
              </div>
            )}
            {node.dataClassification && (
              <div className="flex justify-between py-1 border-b border-[#181a24]">
                <span className="text-[#656b82]">Data Classification:</span>
                <span className="text-red-400 font-bold">{node.dataClassification}</span>
              </div>
            )}
            {node.recordsCount && (
              <div className="flex justify-between py-1">
                <span className="text-[#656b82]">Records Volume:</span>
                <span className="text-white font-bold">{node.recordsCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Connected Graph Topology */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8890a6] uppercase tracking-wider font-bold">
            Graph Topology Connections ({inboundEdges.length + outboundEdges.length})
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Inbound Relations */}
            <div className="bg-[#12141c] border border-[#1e2028] p-3">
              <div className="text-[10px] text-[#7dd3fc] font-bold mb-2 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Inbound Links ({inboundEdges.length})</span>
              </div>
              {inboundEdges.length === 0 ? (
                <div className="text-[10px] text-[#555b70]">None (Root Ingress)</div>
              ) : (
                <div className="space-y-1.5">
                  {inboundEdges.map(e => {
                    const srcId = typeof e.source === 'object' ? (e.source as any).id : e.source;
                    return (
                      <div key={e.id} className="flex items-center justify-between text-[11px] p-1 bg-[#090a0f] border border-[#1a1c26]">
                        <span className="text-[#a5abbf]">{getNodeLabel(srcId)}</span>
                        <span className="text-[9px] px-1 py-0.2 bg-[#1b1f2e] text-[#818cf8]">
                          {e.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Outbound Relations */}
            <div className="bg-[#12141c] border border-[#1e2028] p-3">
              <div className="text-[10px] text-[#c084fc] font-bold mb-2 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Outbound Links ({outboundEdges.length})</span>
              </div>
              {outboundEdges.length === 0 ? (
                <div className="text-[10px] text-[#555b70]">None (Terminal Leaf)</div>
              ) : (
                <div className="space-y-1.5">
                  {outboundEdges.map(e => {
                    const tgtId = typeof e.target === 'object' ? (e.target as any).id : e.target;
                    return (
                      <div key={e.id} className="flex items-center justify-between text-[11px] p-1 bg-[#090a0f] border border-[#1a1c26]">
                        <span className="text-[#a5abbf]">{getNodeLabel(tgtId)}</span>
                        <span className="text-[9px] px-1 py-0.2 bg-[#1b1f2e] text-[#818cf8]">
                          {e.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linked CVE Findings */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8890a6] uppercase tracking-wider font-bold">
            Vulnerabilities Traversing This Node ({linkedFindings.length})
          </div>

          {linkedFindings.length === 0 ? (
            <div className="p-3 bg-[#12141c] border border-[#1e2028] text-center text-[11px] text-[#555b70]">
              No active security findings traverse this node.
            </div>
          ) : (
            <div className="space-y-2">
              {linkedFindings.map(f => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFinding(f.id);
                    onClose();
                  }}
                  className="p-2.5 bg-[#12141c] hover:bg-[#181b26] border border-[#1e2028] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                      <span>{f.cveId}</span>
                      <span className={`text-[9px] px-1 py-0.2 border ${
                        f.status === 'critical' ? 'text-red-400 border-red-500/40 bg-red-500/10' :
                        f.status === 'high' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' :
                        'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                      }`}>
                        {f.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8890a6] mt-0.5">
                      Blast Radius: {f.blastRadiusScore.toFixed(1)} · {f.package}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7c83ff]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
