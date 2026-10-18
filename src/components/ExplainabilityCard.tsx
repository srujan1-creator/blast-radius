import React, { useState } from 'react';
import type { SecurityFinding } from '../types';
import { 
  ArrowRight, 
  Database, 
  ShieldCheck,
  ShieldAlert,
  Shield,
  Lock,
  FileCheck,
  Code,
  Copy,
  Check,
  Zap,
  Activity
} from 'lucide-react';
import { sound } from '../utils/audio';
import { generateNetworkPolicy, generateSlsaAttestation } from '../utils/security';

interface ExplainabilityCardProps {
  finding: SecurityFinding;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ finding }) => {
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [showPolicyDrawer, setShowPolicyDrawer] = useState(false);
  const [showSlsaModal, setShowSlsaModal] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  const isCritical = finding.status === 'critical';
  const isHigh = finding.status === 'high';
  const isSuppressed = finding.status === 'suppressed';

  // Parse path breadcrumbs
  const pathTokens = finding.pathBreadcrumb.split('·')[0].split('→').map(t => t.trim());

  const networkPolicyYaml = generateNetworkPolicy(finding.affectedService);
  const slsaProof = generateSlsaAttestation(finding.package, finding.version, finding.patchedVersion);

  const toggleQuarantine = () => {
    if (!isQuarantined) {
      sound.playCriticalAlert();
      setIsQuarantined(true);
      setShowPolicyDrawer(true);
    } else {
      sound.playClick();
      setIsQuarantined(false);
    }
  };

  const handleCopyPolicy = () => {
    sound.playClick();
    navigator.clipboard.writeText(networkPolicyYaml);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  return (
    <div className="bg-[#0c0e15] border border-[#1a1d28] card-raised p-6 shadow-2xl relative overflow-hidden select-none space-y-5">
      {/* Corner Glow Accent */}
      <div 
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
        }`} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1e2028]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7c83ff] font-bold">
              SECTION 03 // EXPLAINABLE GRAPH REASONING & DEFENSE
            </span>
            <span className="text-[#3b4054]">·</span>
            <span className="text-[10px] font-mono text-[#8890a6]">
              FALKORDB CYPHER AUDIT TRAIL
            </span>
          </div>

          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Why This {isSuppressed ? 'Is Suppressed' : isCritical ? 'Is Critical' : 'Matters'}:</span>
            <span className="font-mono text-[#c7cbff]">{finding.cveId}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                isCritical
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : isHigh
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {finding.status}
            </span>
          </h3>
        </div>

        {/* Security Controls: Quarantine Toggle & Composite Score */}
        <div className="flex items-center gap-3">
          {/* Zero-Trust Quarantine Button */}
          <button
            onClick={toggleQuarantine}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isQuarantined
                ? 'bg-red-950/40 text-red-300 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                : 'bg-[#121422] hover:bg-[#1a1e32] text-[#a5adff] hover:text-white border-[#2b3046] hover:border-[#7c83ff]'
            }`}
            title="Isolate vulnerable service from network topology"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>{isQuarantined ? 'Service Quarantined' : 'Quarantine Service'}</span>
          </button>

          {/* Composite Score Pill */}
          <div className="flex items-center gap-3 bg-[#0a0b10] border border-[#1e2028] px-3.5 py-1.5">
            <div className="text-right font-mono">
              <div className="text-[9px] uppercase tracking-wider text-[#656b82]">Blast Radius</div>
              <div className="text-xs text-[#8a91a8]">vs CVSS {finding.genericCvss.toFixed(1)}</div>
            </div>
            <div
              className={`text-xl font-bold font-mono px-2 py-0.5 border ${
                isCritical
                  ? 'text-red-400 border-red-500/40 bg-red-500/10'
                  : isHigh
                  ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                  : 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
              }`}
            >
              {finding.blastRadiusScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Trust Quarantine Active Alert Banner (When Quarantined) */}
      {isQuarantined && (
        <div className="p-3.5 bg-red-950/20 border border-red-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-red-300">ZERO-TRUST MICROSEGMENTATION ACTIVE: </span>
              <span className="text-[#e2e4ec]">Ingress and egress routes for <strong className="text-white">{finding.affectedService}</strong> have been severed in FalkorDB.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPolicyDrawer(!showPolicyDrawer)}
              className="px-2.5 py-1 bg-[#1a0f12] hover:bg-[#281419] text-red-300 border border-red-700/50 text-[11px] transition-colors cursor-pointer"
            >
              {showPolicyDrawer ? 'Hide K8s Policy' : 'View K8s Policy'}
            </button>
            <button
              onClick={handleCopyPolicy}
              className="px-2.5 py-1 bg-[#1a0f12] hover:bg-[#281419] text-white border border-red-700/50 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedPolicy ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy YAML</span>
            </button>
          </div>
        </div>
      )}

      {/* NetworkPolicy Drawer */}
      {isQuarantined && showPolicyDrawer && (
        <div className="p-3 bg-[#050609] border border-[#1e2338] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#7c83ff]">
            <span>// Automated Kubernetes Zero-Trust NetworkPolicy (isolate-{finding.affectedService.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.yaml)</span>
            <span className="text-[#656c84]">Enforced at Calico / Cilium CNI</span>
          </div>
          <pre className="text-emerald-300 text-[11px] font-mono p-3 bg-[#07080d] border border-[#161824] overflow-x-auto">
            {networkPolicyYaml}
          </pre>
        </div>
      )}

      {/* Path Breadcrumb Ribbon */}
      <div className="mb-4">
        <div className="text-[10px] font-mono text-[#8890a6] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Validated Attack Graph Traversal:</span>
          <span className="text-[10px] text-[#7c83ff]">
            {finding.hopsCount > 0 ? `${finding.hopsCount} hops to impact` : 'No ingress route'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-[#0a0b10] border border-[#1e2028] font-mono text-xs">
          {pathTokens.map((token, index) => {
            const isLast = index === pathTokens.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={index}>
                <div
                  className={`px-2.5 py-1 text-xs border flex items-center gap-1.5 transition-all ${
                    isLast && finding.targetDataStoreId
                      ? 'bg-red-950/40 text-red-300 border-red-500/50 font-bold'
                      : isFirst
                      ? 'bg-[#141b29] text-[#7dd3fc] border-[#0284c7]/40'
                      : 'bg-[#131622] text-[#d1d5db] border-[#222738]'
                  }`}
                >
                  {isLast && finding.targetDataStoreId ? (
                    <Database className="w-3 h-3 text-red-400" />
                  ) : null}
                  <span>{token}</span>
                </div>

                {!isLast && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#4e556e] shrink-0" />
                )}
              </React.Fragment>
            );
          })}

          {/* Quick Stats Pill inside Ribbon */}
          <div className="ml-auto flex items-center gap-2 pl-3 border-l border-[#1e2028] text-[10px] text-[#8a91a8]">
            <span>Reachable: <strong className="text-white">{finding.reachabilityStatus.includes('Reachable') ? 'Yes' : 'No'}</strong></span>
            <span>·</span>
            <span>Data: <strong className={finding.targetDataStoreId ? 'text-red-400' : 'text-gray-300'}>{finding.targetDataStoreId ? 'PII' : 'Internal'}</strong></span>
            <span>·</span>
            <span>Service: <strong className="text-white">{finding.affectedService}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Plain-English Story + Metric Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Plain English Story (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[10px] font-mono text-[#8890a6] uppercase tracking-wider">
            Agent Synthesis & Impact Explanation
          </div>
          
          <div className="p-3.5 bg-[#0e1017] border border-[#1e2028] leading-relaxed text-sm text-[#c5cbdb] font-sans">
            <p className="mb-2">
              {finding.summaryExplanation}
            </p>
            {isSuppressed && finding.suppressionReason && (
              <div className="mt-3 pt-3 border-t border-[#1a1c26] text-xs font-mono text-emerald-400/90 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Why Suppressed: </strong>
                  <span>{finding.suppressionReason}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Score Breakdown with Meters (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[10px] font-mono text-[#8890a6] uppercase tracking-wider">
            Blast Radius Factor Breakdown
          </div>

          <div className="bg-[#0e1017] border border-[#1e2028] p-3.5 space-y-3">
            {/* Ingress Reachability */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8890a6]">Ingress Reachability</span>
                <span className="text-white font-bold">{finding.metrics.reachability}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#171a26] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    finding.metrics.reachability > 50 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${finding.metrics.reachability}%` }}
                />
              </div>
            </div>

            {/* Exposure Index */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8890a6]">Exposure Index</span>
                <span className="text-white font-bold">{finding.metrics.exposure} / 10</span>
              </div>
              <div className="w-full h-1.5 bg-[#171a26] overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${(finding.metrics.exposure / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Data Sensitivity */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8890a6]">Data Sensitivity (Crown Jewels)</span>
                <span className={`font-bold ${finding.metrics.dataSensitivity >= 8 ? 'text-red-400' : 'text-white'}`}>
                  {finding.metrics.dataSensitivity} / 10
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#171a26] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    finding.metrics.dataSensitivity >= 8 ? 'bg-red-500' : 'bg-indigo-400'
                  }`}
                  style={{ width: `${(finding.metrics.dataSensitivity / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Centrality */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8890a6]">Topology Centrality</span>
                <span className="text-white font-bold">{finding.metrics.centrality} / 10</span>
              </div>
              <div className="w-full h-1.5 bg-[#171a26] overflow-hidden">
                <div
                  className="h-full bg-[#7c83ff] transition-all duration-500"
                  style={{ width: `${(finding.metrics.centrality / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Enterprise Security & AI Guardrail Strip */}
      <div className="pt-4 border-t border-[#181a26] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-4 text-[#787f98]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DLP Scrubber: Active (Secrets Masked)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7c83ff]">
            <Lock className="w-3.5 h-3.5" />
            <span>FalkorDB Read-Only Firewall: Enforced</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero-Trust Microsegmentation: Ready</span>
          </div>
        </div>

        <button
          onClick={() => { sound.playClick(); setShowSlsaModal(!showSlsaModal); }}
          className="px-2.5 py-1 bg-[#10121c] hover:bg-[#181c2c] border border-[#23273c] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileCheck className="w-3 h-3 text-[#7c83ff]" />
          <span>{showSlsaModal ? 'Hide SLSA Provenance' : 'View SLSA Level 3 Provenance'}</span>
        </button>
      </div>

      {/* SLSA Provenance Drawer */}
      {showSlsaModal && (
        <div className="p-3.5 bg-[#05070c] border border-[#1d2236] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[#7c83ff]">
            <span className="font-bold flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHIC ATTESTATION & SBOM PROVENANCE</span>
            </span>
            <span className="text-[10px] text-[#6c738c]">Sigstore in-toto v1.0</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-[#656c84]">Target Package: </span>
              <strong className="text-white">{finding.package} ({finding.version} → {finding.patchedVersion})</strong>
            </div>
            <div>
              <span className="text-[#656c84]">SHA-256 Digest: </span>
              <code className="text-emerald-300">{slsaProof.sha256Digest}</code>
            </div>
            <div>
              <span className="text-[#656c84]">Builder ID: </span>
              <span className="text-[#a5abbf]">{slsaProof.builderId}</span>
            </div>
            <div>
              <span className="text-[#656c84]">Signature: </span>
              <code className="text-[#7c83ff]">{slsaProof.signature}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
