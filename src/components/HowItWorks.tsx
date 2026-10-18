import React from 'react';
import { Database, Network, Cpu, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Ingest findings',
      tagline: 'Aggregate Telemetry',
      icon: Database,
      accent: '#38bdf8',
      description: 'Ingest raw vulnerability scanner alerts from Snyk, Dependabot, Trivy, and AWS Inspector into a normalized security stream.',
      details: ['Multi-scanner deduplication', 'CVE & CWE metadata enrichment', 'Ecosystem translation (npm/maven/go)']
    },
    {
      step: '02',
      title: 'Build graph',
      tagline: 'Topology Synthesis',
      icon: Network,
      accent: '#a78bfa',
      description: 'Synthesize live Kubernetes topology, ingress endpoints, cloud IAM policies, runtime dependencies, and data store classifications into a connected FalkorDB knowledge graph.',
      details: ['Ingress-to-pod mapping', 'Crown jewel PII tagging', 'Transitive library dependency chains']
    },
    {
      step: '03',
      title: 'Reason with graph tools',
      tagline: 'MCP Agent Execution',
      icon: Cpu,
      accent: '#7c83ff',
      description: 'The AI agent dynamically selects graph algorithms via Model Context Protocol (MCP) to calculate attack paths, choke points, and true exposure.',
      details: ['Dijkstra shortest attack route', 'Ingress reachability traversal', 'Graph centrality scoring']
    },
    {
      step: '04',
      title: 'Act and explain',
      tagline: 'Autonomous Execution',
      icon: ShieldCheck,
      accent: '#34d399',
      description: 'For verified paths, the agent bumps dependencies in git, opens PRs with green CI, assigns Jira tickets, pages on-call teams, and explains every decision.',
      details: ['Automated PRs with diffs', 'PagerDuty & Slack paging', 'SOC2 explainable audit log']
    }
  ];

  return (
    <section id="how-it-works" className="w-full max-w-[1520px] mx-auto px-4 py-12 select-none">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0c0e15] border border-[#1a1d28] text-[10px] font-mono uppercase text-[#7c83ff] font-semibold mb-2">
          <span>SECTION 04 // FALKORDB ARCHITECTURAL PIPELINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
          How Blast Radius Works
        </h2>
        <p className="text-xs text-[#8a91a8] mt-1">
          From thousands of disconnected scanner alarms to high-conviction, autonomous security actions.
        </p>
      </div>

      {/* 4-Step Horizontal Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.step}
              className="bg-[#0c0e15] border border-[#1a1d28] card-raised p-5 hover:border-[#2b3044] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] opacity-70 transition-all group-hover:opacity-100"
                style={{ backgroundColor: item.accent }} 
              />

              <div>
                {/* Step badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#444a62] group-hover:text-white transition-colors">
                    {item.step}
                  </span>
                  <div
                    className="p-2 border"
                    style={{
                      backgroundColor: `${item.accent}15`,
                      borderColor: `${item.accent}40`,
                      color: item.accent
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c83ff] mb-1">
                  {item.tagline}
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9ca3ba] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Sub-bullets */}
              <div className="pt-3 border-t border-[#1a1c26] space-y-1.5 font-mono text-[10px] text-[#788099]">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.accent }} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
