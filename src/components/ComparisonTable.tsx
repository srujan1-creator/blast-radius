import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonRows = [
    {
      dimension: 'Prioritization Model',
      traditional: 'Ranks by generic CVSS scores in a vacuum',
      blastRadius: 'Ranks by your live infrastructure graph and crown jewel reachability',
      traditionalBadge: 'Formulaic',
      blastBadge: 'Graph-Aware'
    },
    {
      dimension: 'Context & Scope',
      traditional: 'Flat list of isolated, disconnected CVE alerts',
      blastRadius: 'Full multi-hop attack paths from Internet ingress to PII datastores',
      traditionalBadge: 'Disconnected',
      blastBadge: 'Connected Data'
    },
    {
      dimension: 'Noise Level',
      traditional: '2,000+ alerts with ~95% unreachable false alarms',
      blastRadius: '12 critical findings that actually matter; 94% noise auto-suppressed',
      traditionalBadge: 'Fatiguing',
      blastBadge: '94% Suppressed'
    },
    {
      dimension: 'Actionability',
      traditional: 'Alerts only — dumps static PDF reports on developer backlogs',
      blastRadius: 'Takes action — opens version-bump PRs, files Jira tickets, pages on-call',
      traditionalBadge: 'Passive',
      blastBadge: 'Autonomous Actions'
    },
    {
      dimension: 'Explainability & Audit',
      traditional: 'Black box math; unclear why an air-gapped CVE is marked Critical',
      blastRadius: 'Plain-English explanations with step-by-step graph traversal evidence',
      traditionalBadge: 'Opaque',
      blastBadge: 'Auditable Proof'
    },
    {
      dimension: 'Extensibility',
      traditional: 'Hardcoded proprietary rulesets and scanner silos',
      blastRadius: 'Model Context Protocol (MCP) tool standard over high-performance FalkorDB graph',
      traditionalBadge: 'Monolithic',
      blastBadge: 'Open MCP Protocol'
    }
  ];

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 py-12 select-none">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0c0e15] border border-[#1a1d28] text-[10px] font-mono uppercase text-[#7c83ff] font-semibold mb-2">
          <span>SECTION 06 // PARADIGM SHIFT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
          Traditional Scanners vs. Blast Radius
        </h2>
        <p className="text-xs text-[#8a91a8] mt-1">
          Why traditional CVSS ranking burns out security teams, and how connected data changes the equation.
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="bg-[#0c0e15] border border-[#1a1d28] card-raised overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2028] bg-[#0c0d14] text-[11px] font-mono uppercase tracking-wider">
                <th className="py-4 px-5 text-[#8890a6] w-1/4">Evaluation Dimension</th>
                <th className="py-4 px-5 text-[#f87171] w-3/8 bg-red-950/10 border-x border-[#1e2028]">
                  Traditional Scanners (Snyk, Trivy, Dependabot)
                </th>
                <th className="py-4 px-5 text-[#a5abbf] w-3/8 bg-[#7c83ff]/10">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#7c83ff]" />
                    <span>Blast Radius (Graph Agent)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2028] text-xs font-mono">
              {comparisonRows.map((row, index) => (
                <tr key={index} className="hover:bg-[#151824] transition-colors">
                  {/* Dimension */}
                  <td className="py-4 px-5 font-semibold text-white">
                    {row.dimension}
                  </td>

                  {/* Traditional */}
                  <td className="py-4 px-5 text-[#9ca3ba] bg-red-950/5 border-x border-[#1e2028]">
                    <div className="flex items-start gap-2">
                      <div className="p-0.5 rounded-full bg-red-500/10 text-red-400 mt-0.5 shrink-0">
                        <X className="w-3 h-3" />
                      </div>
                      <div className="space-y-1 font-sans">
                        <span className="leading-relaxed">{row.traditional}</span>
                        <div className="text-[10px] font-mono text-red-400/80">
                          [{row.traditionalBadge}]
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Blast Radius */}
                  <td className="py-4 px-5 text-[#e2e4ec] bg-[#7c83ff]/5">
                    <div className="flex items-start gap-2">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="space-y-1 font-sans">
                        <span className="leading-relaxed font-medium text-white">{row.blastRadius}</span>
                        <div className="text-[10px] font-mono text-[#a5abbf] font-semibold">
                          ★ {row.blastBadge}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
