import React from 'react';
import { Network, Cpu, Wrench, Zap, FileSearch } from 'lucide-react';

export const KeyFocus: React.FC = () => {
  const focusItems = [
    {
      tag: 'CAPABILITY 01',
      title: 'Multi-hop reasoning',
      icon: Network,
      color: '#38bdf8',
      summary: 'Traces attack routes across ingress boundaries, microservice hops, and package dependencies back to sensitive datastores.',
      quote: '"Does an external attacker actually have a reachable route to our Customer PII database?"'
    },
    {
      tag: 'CAPABILITY 02',
      title: 'Graph algorithms as agent tools',
      icon: Wrench,
      color: '#a78bfa',
      summary: 'Exposes BFS traversal, Dijkstra shortest path, and Betweenness Centrality directly to the LLM agent as functional tools.',
      quote: '"mcp::find_shortest_attack_path(source=internet, target=customer_db)"'
    },
    {
      tag: 'CAPABILITY 03',
      title: 'Tool selection through MCP',
      icon: Cpu,
      color: '#7c83ff',
      summary: 'Standardized Model Context Protocol provides structured schemas, tool discovery, and deterministic execution for the agent.',
      quote: '"Zero hallucinated tools. Every step validates schema, types, and runtime outputs."'
    },
    {
      tag: 'CAPABILITY 04',
      title: 'Actions based on graph evidence',
      icon: Zap,
      color: '#f59e0b',
      summary: 'Moves beyond passive dashboards by automatically opening PRs, filing Jira tickets, and alerting on-call owners.',
      quote: '"Auto-generates patch branch, bumps pom.xml, verifies unit tests, and requests review."'
    },
    {
      tag: 'CAPABILITY 05',
      title: 'Explainable results',
      icon: FileSearch,
      color: '#34d399',
      summary: 'Provides human-auditable graph traversal trails and plain-English rationales for both critical remediations and noise suppressions.',
      quote: '"Clear audit trail: 100% reachability, PII scope confirmed, 0 false positive noise."'
    }
  ];

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 py-12 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-[#181a24] mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#7c83ff] font-bold mb-1">
            SECTION 05 // KEY FOCUS AREAS
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Architected for Connected Graph Intelligence
          </h2>
        </div>
        <div className="text-xs font-mono text-[#8890a6]">
          AI AGENTS + FALKORDB KNOWLEDGE GRAPH TOPOLOGY
        </div>
      </div>

      {/* Tag-style boxes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {focusItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="p-5 bg-[#0c0e15] border border-[#1a1d28] card-raised hover:border-[#2b3044] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 border"
                    style={{
                      color: item.color,
                      borderColor: `${item.color}40`,
                      backgroundColor: `${item.color}10`
                    }}
                  >
                    {item.tag}
                  </span>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>

                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  {item.title}
                </h3>

                <p className="text-xs text-[#9ca3ba] leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#181a24] text-[10px] font-mono text-[#8a91a8] italic bg-[#0a0b10] p-2 border border-[#161822]">
                {item.quote}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
