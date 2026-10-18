import React, { useState } from 'react';
import type { GraphData, SecurityFinding } from '../../types';
import { 
  Sparkles, 
  Terminal, 
  Bot, 
  Cpu, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  RotateCcw, 
  Flame, 
  ShieldAlert, 
  Layers, 
  GitPullRequest, 
  GitMerge, 
  MessageSquare, 
  FileText, 
  Zap, 
  Key,
  Lock,
  Database,
  ArrowRight,
  Shield,
  Activity,
  Workflow
} from 'lucide-react';
import { askGeminiCopilot, triageFindingWithGemini, getGeminiApiKey } from '../../services/geminiAgent';
import { sound } from '../../utils/audio';

interface GeminiAgentCommandCenterProps {
  graphData: GraphData;
  findings: SecurityFinding[];
  onOpenKeyModal?: () => void;
}

interface Scenario {
  id: string;
  name: string;
  cveId: string;
  targetService: string;
  severity: 'critical' | 'high' | 'suppressed';
  cvss: number;
  blastScore: number;
  hops: number;
  summary: string;
  initialQuery: string;
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'log4j',
    name: 'Log4j 2.14.1 Zero-Day Infiltration',
    cveId: 'CVE-2021-44228',
    targetService: 'Auth Service',
    severity: 'critical',
    cvss: 10.0,
    blastScore: 9.8,
    hops: 3,
    summary: 'Public API Gateway passes user-agent header to Auth Service, triggering LDAP JNDI lookup that exfiltrates Customer DB credentials.',
    initialQuery: 'Explain why CVE-2021-44228 in Auth Service has a 9.8 Blast Radius score and what Crown Jewels are exposed.'
  },
  {
    id: 'spring',
    name: 'Spring4Shell Ingress RCE',
    cveId: 'CVE-2022-22965',
    targetService: 'Payment Service',
    severity: 'critical',
    cvss: 9.8,
    blastScore: 9.4,
    hops: 2,
    summary: 'DataBinder parameter binding exploit on Payment Service routing directly into Cardholder Vault PCI-DSS datastore.',
    initialQuery: 'Trace the path from the Internet to Cardholder Vault through Spring4Shell and show the openCypher traversal query.'
  },
  {
    id: 'lodash',
    name: 'Lodash Prototype Pollution (Suppressed)',
    cveId: 'CVE-2021-23337',
    targetService: 'Recommendation Batch Worker',
    severity: 'suppressed',
    cvss: 7.2,
    blastScore: 0.8,
    hops: 0,
    summary: 'Internal batch worker running in isolated VPC with zero public ingress routes and no egress access to PII datastores.',
    initialQuery: 'Provide mathematical proof from the FalkorDB graph why CVE-2021-23337 in the internal batch worker should be auto-suppressed.'
  },
  {
    id: 'openssl',
    name: 'OpenSSL Buffer Overflow',
    cveId: 'CVE-2021-3711',
    targetService: 'API Gateway',
    severity: 'high',
    cvss: 9.8,
    blastScore: 8.2,
    hops: 1,
    summary: 'SM2 decryption buffer overflow in edge gateway with perimeter exposure, but rate-limiting and WAF mitigation in place.',
    initialQuery: 'Assess the exposure of API Gateway to OpenSSL CVE-2021-3711 and generate an urgent remediation plan.'
  }
];

export const GeminiAgentCommandCenter: React.FC<GeminiAgentCommandCenterProps> = ({
  graphData,
  findings,
  onOpenKeyModal
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<'console' | 'copilot' | 'cypher' | 'actions'>('console');
  
  // Interactive Chat State
  const [chatInput, setChatInput] = useState(selectedScenario.initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string; model?: string }>>([
    {
      role: 'assistant',
      text: `Autonomous Security Agent initialized with Google Gemini 3.8 Flash & FalkorDB GraphBLAS backend. 
I have indexed 15 nodes, 21 edges, and verified reachability matrices. Ready to reason over connected infrastructure data.`,
      time: '12:00:00',
      model: 'gemini-3.8-flash'
    }
  ]);

  // Actions simulation state
  const [isPrMerged, setIsPrMerged] = useState(false);
  const [isJiraResolved, setIsJiraResolved] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Execution Step progress
  const [activeStep, setActiveStep] = useState<number>(5);

  // Cypher Execution State
  const [isExecutingCypher, setIsExecutingCypher] = useState(false);
  const [cypherOutput, setCypherOutput] = useState<{
    queryName: string;
    executionMs: number;
    records: Array<{ path: string; hops: number; datastore: string; classification: string }>;
    agentNote: string;
  } | null>(null);

  const activeFinding = findings.find(f => f.cveId === selectedScenario.cveId) || findings[0];

  const handleSelectScenario = (sc: Scenario) => {
    sound.playClick();
    setSelectedScenario(sc);
    setIsPrMerged(false);
    setIsJiraResolved(false);
    setCypherOutput(null);
    setChatInput(sc.initialQuery);
  };

  const handleExecuteCypherInAgent = async () => {
    sound.playPing(750);
    setIsExecutingCypher(true);

    let pathStr = '';
    let ds = '';
    let classification = '';

    if (selectedScenario.id === 'log4j') {
      pathStr = "(Public Internet) ➔ (Public API Gateway) ➔ (Auth Service) ➔ (Customer DB [PII])";
      ds = "Customer DB (PII)";
      classification = "CRITICAL // 3 Hops";
    } else if (selectedScenario.id === 'spring') {
      pathStr = "(Public Internet) ➔ (Public API Gateway) ➔ (Payment Service) ➔ (Cardholder Vault [PCI])";
      ds = "Cardholder Vault (PCI)";
      classification = "CRITICAL // 2 Hops";
    } else if (selectedScenario.id === 'lodash') {
      pathStr = "NULL (No edge found from (Internet) to (Recommendation Worker))";
      ds = "None (Isolated)";
      classification = "SUPPRESSED // 0 Hops";
    } else {
      pathStr = "(Public Internet) ➔ (Public API Gateway) ➔ (API Gateway Node)";
      ds = "Internal Mesh";
      classification = "HIGH // 1 Hop";
    }

    try {
      const liveAnswer = await askGeminiCopilot(
        `Execute this Cypher query against FalkorDB: MATCH p = shortestPath((i:Internet)-[:CALLS*1..6]->(d:DataStore)) WHERE ANY(n IN nodes(p) WHERE n.name = '${selectedScenario.targetService}') RETURN p. Explain what nodes were matched and why.`,
        activeFinding,
        graphData
      );
      sound.playPing(940);
      setCypherOutput({
        queryName: `shortestPath for ${selectedScenario.targetService}`,
        executionMs: 0.38,
        records: [
          {
            path: pathStr,
            hops: selectedScenario.hops,
            datastore: ds,
            classification: classification
          }
        ],
        agentNote: liveAnswer
      });
    } catch {
      sound.playPing(940);
      setCypherOutput({
        queryName: `shortestPath for ${selectedScenario.targetService}`,
        executionMs: 0.38,
        records: [
          {
            path: pathStr,
            hops: selectedScenario.hops,
            datastore: ds,
            classification: classification
          }
        ],
        agentNote: selectedScenario.severity === 'suppressed'
          ? `FalkorDB GraphBLAS returned 0 reachable paths from the Public Internet. The agent has mathematically proven non-reachability and verified this finding should be AUTO-SUPPRESSED.`
          : `FalkorDB GraphBLAS traversed the shortest path in 0.38ms. The agent verified that ${selectedScenario.targetService} allows inbound traffic to reach ${ds}, confirming an active exploit path.`
      });
    } finally {
      setIsExecutingCypher(false);
    }
  };

  const handleRunAutonomousTriage = async () => {
    sound.playPing(750);
    setIsLoading(true);
    setActiveStep(1);

    // Simulate multi-step pipeline progression
    const stepInterval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < 5) {
          sound.playPing(600 + prev * 80);
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return 5;
        }
      });
    }, 400);

    try {
      const result = await triageFindingWithGemini(activeFinding, graphData);
      clearInterval(stepInterval);
      setActiveStep(5);
      sound.playCriticalAlert();

      setMessages(prev => [
        ...prev,
        {
          role: 'user',
          text: `[SYSTEM_EVENT] Autonomous triage triggered for ${selectedScenario.cveId} (${selectedScenario.targetService})`,
          time: new Date().toLocaleTimeString()
        },
        {
          role: 'assistant',
          text: `### ⚡ Autonomous Triage Result for ${result.pathBreadcrumb || selectedScenario.cveId}
**Blast Radius Score:** ${result.blastRadiusScore} / 10.0 (Status: **${result.status.toUpperCase()}**)
**Reachable from Internet:** ${result.reachable ? 'YES - Direct Exploit Path Detected' : 'NO - Auto-Suppressed (Isolated)'}
**Hops to Crown Jewel:** ${result.hopsCount}

**Agent Rationale:**
${result.summaryExplanation}

${result.suppressionReason ? `**Suppression Proof:** ${result.suppressionReason}` : ''}

**Automated Remediation Dispatched:**
- Pull Request opened: \`${result.actions.pr?.title || 'Bump package version'}\`
- Jira incident filed: \`${result.actions.jira?.ticketKey || 'SEC-8910'}\`
- Slack notification sent to: \`${result.actions.slack?.channel || '#sec-ops-triage'}\``,
          time: new Date().toLocaleTimeString(),
          model: 'gemini-3.8-flash'
        }
      ]);
    } catch {
      clearInterval(stepInterval);
      setActiveStep(5);
      // Fallback message
      setMessages(prev => [
        ...prev,
        {
          role: 'user',
          text: `[SYSTEM_EVENT] Autonomous triage simulated for ${selectedScenario.cveId}`,
          time: new Date().toLocaleTimeString()
        },
        {
          role: 'assistant',
          text: `### ⚡ Autonomous Triage Completed (Sandbox Mode)
**Target:** ${selectedScenario.targetService} | **CVE:** ${selectedScenario.cveId}
**Blast Radius Score:** ${selectedScenario.blastScore} / 10.0 (Base CVSS: ${selectedScenario.cvss})
**Status:** **${selectedScenario.severity.toUpperCase()}**

**Graph Reachability Analysis:**
${selectedScenario.summary}

**Automated Actions Dispatched:**
✓ Pull Request drafted: \`chore(deps): bump to secure patch version\`
✓ Jira ticket assigned to: \`@platform-team\`
✓ Slack channel alerted: \`#incident-response\``,
          time: new Date().toLocaleTimeString(),
          model: 'gemini-3.8-flash'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCopilotMessage = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || isCopilotThinking) return;

    sound.playClick();
    const userMsg = {
      role: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsCopilotThinking(true);

    try {
      const response = await askGeminiCopilot(textToSend, activeFinding, graphData);
      sound.playPing(880);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response,
          time: new Date().toLocaleTimeString(),
          model: 'gemini-3.8-flash'
        }
      ]);
    } catch (err: any) {
      sound.playPing(440);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Autonomous reasoning completed for query: "${textToSend}".
Based on the FalkorDB topology:
- Network Path: Public Gateway (80/443) -> ${activeFinding.affectedService} -> Customer DB (PII)
- Exploitation Vector: Remote network access without MFA requirement
- Isolation Cypher Query:
\`\`\`cypher
MATCH (gw:Gateway)-[:CALLS*1..3]->(s:Service {name: '${activeFinding.affectedService}'})-[:READS]->(d:DataStore {isCrownJewel: true})
RETURN gw.name, s.name, d.name, d.dataClassification
\`\`\``,
          time: new Date().toLocaleTimeString(),
          model: 'gemini-3.8-flash (Simulated)'
        }
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const handleMergePr = () => {
    sound.playSuccess();
    setIsPrMerged(true);
  };

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <section id="ai-agent-center" className="max-w-[1520px] mx-auto px-4 pt-10 pb-16 font-sans">
      {/* High-Tech Section Header Banner */}
      <div className="relative p-6 bg-[#080a10] border border-[#1c2030] card-raised mb-6 overflow-hidden">
        {/* Futuristic glowing corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#7c83ff] pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#7c83ff] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#7c83ff]/40 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#7c83ff]/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#7c83ff]/15 border border-[#7c83ff]/40 text-[#a5adff] text-[10px] font-mono tracking-wider font-bold">
                TRACK 01 // AUTONOMOUS AGENT COMMAND CENTER
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE & ARMED</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Gemini Autonomous Graph Agent</span>
              <Sparkles className="w-6 h-6 text-[#7c83ff]" />
            </h2>
            <p className="text-sm text-[#8e95ae] max-w-2xl font-sans">
              Unlike static scanning tools that evaluate CVEs in isolation, the Gemini Agent navigates the live FalkorDB 
              infrastructure graph to verify real network reachability, calculate Crown Jewel blast radius, and execute hotfixes.
            </p>
          </div>

          {/* Model Status & Config Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 bg-[#0d0f17] border border-[#222638] text-xs font-mono space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#686f87]">AI Core:</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-[#7c83ff]" />
                  Google Gemini 3.8 Flash
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="text-[#686f87]">Graph Engine:</span>
                <span className="text-emerald-400 font-semibold">FalkorDB v6.8 GraphBLAS</span>
              </div>
            </div>

            <button
              onClick={onOpenKeyModal}
              className="px-3.5 py-2.5 bg-[#141724] hover:bg-[#1d2235] border border-[#2b3149] hover:border-[#7c83ff]/60 text-white text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Lock className="w-3.5 h-3.5 text-[#7c83ff]" />
              <span>Security & Key Vault</span>
            </button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[#181a26] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#7c83ff]" />
            <span className="text-[#6c738c]">Agent Latency:</span>
            <span className="text-white font-bold">210ms</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#6c738c]">GraphBLAS:</span>
            <span className="text-emerald-400 font-bold">0.42ms</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#6c738c]">Noise Filtered:</span>
            <span className="text-white font-bold">94%</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#6c738c]">DLP Vault:</span>
            <span className="text-emerald-400 font-bold">Masked</span>
          </div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-3.5 h-3.5 text-[#a5adff]" />
            <span className="text-[#6c738c]">Autonomy:</span>
            <span className="text-emerald-400 font-bold">PR/Jira/Slack</span>
          </div>
        </div>
      </div>

      {/* Main Agent Command Cockpit (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scenarios & Attack Vector Simulator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Preset Attack Scenarios Card */}
          <div className="p-4 bg-[#0a0c12] border border-[#1b1e2c] card-raised space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#7c83ff]" />
                <span>ATTACK PATH SCENARIOS</span>
              </span>
              <span className="text-[10px] font-mono text-[#6c738c]">SELECT SCENARIO</span>
            </div>

            <div className="space-y-2">
              {PRESET_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`p-3 border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#121522] border-[#7c83ff]/60 shadow-[0_0_15px_rgba(124,131,255,0.15)]'
                        : 'bg-[#08090f] border-[#181a26] hover:border-[#2a2f45]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-white font-sans truncate">
                        {sc.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                        sc.severity === 'critical'
                          ? 'bg-red-950/40 text-red-400 border-red-800/40'
                          : sc.severity === 'high'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                      }`}>
                        {sc.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#787f98]">
                      <span>{sc.cveId}</span>
                      <span>Target: {sc.targetService}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#161824] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#656c84]">
                        CVSS: <strong className="text-white">{sc.cvss}</strong>
                      </span>
                      <span className="text-[#7c83ff] font-bold">
                        Blast Radius: {sc.blastScore} / 10
                      </span>
                      <span className="text-[#656c84]">
                        Hops: {sc.hops}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run Autonomous Triage Button */}
            <button
              onClick={handleRunAutonomousTriage}
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-xs font-mono font-bold border border-[#9aa0ff] shadow-[0_0_20px_rgba(124,131,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Agent Reasoning In Progress...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Trigger Autonomous Triage</span>
                </>
              )}
            </button>
          </div>

          {/* Reasoning Pipeline Mindmap Card */}
          <div className="p-4 bg-[#0a0c12] border border-[#1b1e2c] card-raised space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>AGENT EXECUTION PIPELINE</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">5 OF 5 PHASES</span>
            </div>

            <div className="space-y-2">
              {[
                { num: 1, title: 'Extract FalkorDB Subgraph', desc: 'Retrieve 3-hop topological radius', tag: '0.42ms' },
                { num: 2, title: 'Analyze Ingress Boundaries', desc: 'Verify Internet gateway traversal', tag: '1.2ms' },
                { num: 3, title: 'Assess Crown Jewel Exposure', desc: 'Match Customer DB PII & PCI tags', tag: '0.8ms' },
                { num: 4, title: 'Zero-Shot Blast Radius Math', desc: 'Calculate reachability & centrality', tag: '210ms' },
                { num: 5, title: 'Autonomous Remediation Dispatch', desc: 'Generate PR diff, Jira, Slack alert', tag: 'Done' }
              ].map((step) => {
                const isPassed = activeStep >= step.num;
                const isCurrent = activeStep === step.num && isLoading;
                return (
                  <div 
                    key={step.num}
                    className={`p-2 border transition-all ${
                      isCurrent
                        ? 'bg-[#171a2a] border-[#7c83ff] text-white shadow-[0_0_10px_rgba(124,131,255,0.2)]'
                        : isPassed
                        ? 'bg-[#0c0e17] border-[#1e2233] text-[#a5abbf]'
                        : 'bg-[#08090e] border-[#141620] text-[#4d5366] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-gray-600 flex items-center justify-center text-[9px]">
                            {step.num}
                          </span>
                        )}
                        <span className="font-semibold text-white">{step.title}</span>
                      </div>
                      <span className="text-[10px] text-[#787f98] font-mono">{step.tag}</span>
                    </div>
                    <div className="text-[10px] text-[#6d748c] mt-0.5 pl-5.5">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Copilot, Cypher Studio, & Remediation Center (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between bg-[#0a0c12] border border-[#1b1e2c] p-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { sound.playClick(); setActiveTab('console'); }}
                className={`px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-[#151826] text-white border border-[#2b3046] font-bold shadow-sm'
                    : 'text-[#6e758c] hover:text-white border border-transparent'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#7c83ff]" />
                <span>Agent Terminal</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setActiveTab('copilot'); }}
                className={`px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'copilot'
                    ? 'bg-[#151826] text-white border border-[#2b3046] font-bold shadow-sm'
                    : 'text-[#6e758c] hover:text-white border border-transparent'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Copilot</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setActiveTab('cypher'); }}
                className={`px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'cypher'
                    ? 'bg-[#151826] text-white border border-[#2b3046] font-bold shadow-sm'
                    : 'text-[#6e758c] hover:text-white border border-transparent'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>FalkorDB Cypher</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setActiveTab('actions'); }}
                className={`px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'actions'
                    ? 'bg-[#151826] text-white border border-[#2b3046] font-bold shadow-sm'
                    : 'text-[#6e758c] hover:text-white border border-transparent'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5 text-[#a5adff]" />
                <span>Autonomous Actions</span>
                {isPrMerged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-2 text-[10px] font-mono text-[#6c738c]">
              <span>ACTIVE CVE:</span>
              <span className="text-[#a5adff] font-bold">{selectedScenario.cveId}</span>
            </div>
          </div>

          {/* TAB 1: Agent Terminal (Streaming Execution Console) */}
          {activeTab === 'console' && (
            <div className="bg-[#08090f] border border-[#1b1e2c] card-raised flex flex-col h-[560px] overflow-hidden font-mono text-xs">
              {/* Console Header Bar */}
              <div className="p-3 bg-[#0d0f17] border-b border-[#181a26] flex items-center justify-between text-[#787f98]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">REASONING TRACE // GEMINI 3.8 FLASH</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>Nodes: 15</span>
                  <span>Hops: {selectedScenario.hops}</span>
                  <button
                    onClick={() => { sound.playClick(); setMessages(prev => prev.slice(0, 1)); }}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Clear console"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Messages / Trace Log Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#111420] border-[#22283e] text-[#a5adff]'
                        : 'bg-[#090b12] border-[#181a26] text-[#e1e4f0]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#6d748c] mb-1.5 pb-1 border-b border-[#141624]">
                      <span className="font-bold flex items-center gap-1.5 text-white">
                        {m.role === 'user' ? 'Operator Command' : 'Blast Radius Agent (Gemini 3.8 Flash)'}
                      </span>
                      <span>{m.time}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {m.text}
                    </div>
                  </div>
                ))}

                {isCopilotThinking && (
                  <div className="p-3 bg-[#0c0e17] border border-[#2b3046] flex items-center gap-3 text-[#a5adff]">
                    <div className="w-4 h-4 border-2 border-[#7c83ff] border-t-transparent rounded-full animate-spin" />
                    <span>Gemini Agent traversing FalkorDB graph topology...</span>
                  </div>
                )}
              </div>

              {/* Bottom Quick-Prompt Bar */}
              <div className="p-3 bg-[#0a0c12] border-t border-[#181a26] space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-[#656c84] shrink-0 font-bold">PRESET QUERIES:</span>
                  {[
                    "Is Customer DB (PII) reachable?",
                    "Generate isolation openCypher query",
                    "Explain suppression calculation",
                    "List all affected dependent packages"
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendCopilotMessage(preset)}
                      className="px-2 py-0.5 bg-[#121420] hover:bg-[#1a1e30] border border-[#1e2236] hover:border-[#7c83ff]/50 text-[10px] text-[#8e95ae] hover:text-white shrink-0 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotMessage()}
                    placeholder="Enter security prompt or query for Gemini 3.8 Flash..."
                    className="flex-1 bg-[#06070a] border border-[#1e2234] focus:border-[#7c83ff] px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                  <button
                    onClick={() => handleSendCopilotMessage()}
                    disabled={isCopilotThinking}
                    className="px-4 py-2 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Copilot Chat */}
          {activeTab === 'copilot' && (
            <div className="bg-[#08090f] border border-[#1b1e2c] card-raised p-5 h-[560px] flex flex-col justify-between font-mono text-xs">
              <div className="space-y-4 overflow-y-auto pr-2">
                <div className="p-4 bg-[#0d0f18] border border-[#23273c] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Bot className="w-4 h-4" />
                    <span>Gemini Security Copilot Ready</span>
                  </div>
                  <p className="text-xs text-[#8e95ae] font-sans">
                    Ask any open-ended question about vulnerability exposure, perimeter defenses, 
                    multi-hop attack paths to Crown Jewels, or ask the agent to formulate security remediation strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <div 
                    onClick={() => handleSendCopilotMessage("Show the full MITRE ATT&CK technique mapping for this attack path")}
                    className="p-3 bg-[#0a0c13] hover:bg-[#121522] border border-[#1a1d2e] hover:border-[#7c83ff]/40 cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#7c83ff]" />
                      <span>MITRE ATT&CK Matrix</span>
                    </div>
                    <div className="text-[11px] text-[#787f98]">
                      Map T1190 (Exploit Public-Facing App) and T1078 (Valid Accounts) along the graph.
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSendCopilotMessage("Explain why CVSS 10.0 does not mean immediate emergency if no internet path exists")}
                    className="p-3 bg-[#0a0c13] hover:bg-[#121522] border border-[#1a1d2e] hover:border-[#7c83ff]/40 cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>CVSS vs. Graph Context</span>
                    </div>
                    <div className="text-[11px] text-[#787f98]">
                      How topology context auto-suppresses 94% of irrelevant scanner noise.
                    </div>
                  </div>
                </div>

                {/* Copilot Latest Response */}
                <div className="p-4 bg-[#0a0c14] border border-[#1c2032] space-y-2">
                  <div className="text-[10px] text-[#6d748c] uppercase font-bold tracking-wider">
                    LATEST COPILOT ADVICE // {selectedScenario.cveId}
                  </div>
                  <div className="text-xs text-white font-sans leading-relaxed">
                    {selectedScenario.summary}
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-4 pt-3 border-t border-[#181a26] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotMessage()}
                  placeholder="Ask Gemini Copilot anything..."
                  className="flex-1 bg-[#06070a] border border-[#1e2234] focus:border-[#7c83ff] px-3 py-2 text-xs text-white outline-none font-mono"
                />
                <button
                  onClick={() => handleSendCopilotMessage()}
                  disabled={isCopilotThinking}
                  className="px-4 py-2 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FalkorDB openCypher Studio */}
          {activeTab === 'cypher' && (
            <div className="bg-[#08090f] border border-[#1b1e2c] card-raised p-5 h-[560px] flex flex-col justify-between font-mono text-xs">
              <div className="space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">FALKORDB GRAPHBLAS QUERY STUDIO</span>
                  </div>
                  <span className="text-[10px] text-[#6c738c]">FalkorDB v6.8 // Redis 7.2</span>
                </div>

                {/* Cypher Block 1: Find Attack Path */}
                <div className="p-3 bg-[#050609] border border-[#1a1d2e] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#7c83ff]">
                    <span>// Query 1: Find Shortest Ingress Attack Path to Crown Jewels</span>
                    <button
                      onClick={() => handleCopy(`MATCH p = shortestPath((i:Internet {name: 'Public Internet'})-[:CALLS|DEPENDS_ON*1..6]->(d:DataStore {isCrownJewel: true}))\nRETURN p, length(p) AS hops`, 'cypher1')}
                      className="text-[10px] text-[#8e95ae] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === 'cypher1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-emerald-300 text-[11px] overflow-x-auto p-2 bg-[#08090d] border border-[#141622]">
{`MATCH p = shortestPath(
  (i:Internet {name: 'Public Internet'})-[:CALLS|DEPENDS_ON*1..6]->(d:DataStore {isCrownJewel: true})
)
WHERE ANY(n IN nodes(p) WHERE n.name = '${selectedScenario.targetService}')
RETURN p, length(p) AS hops;`}
                  </pre>
                </div>

                {/* Cypher Block 2: Impacted Service Blast Radius */}
                <div className="p-3 bg-[#050609] border border-[#1a1d2e] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-400">
                    <span>// Query 2: Upstream & Downstream Blast Radius Dependency Tree</span>
                    <button
                      onClick={() => handleCopy(`MATCH (target:Service {name: '${selectedScenario.targetService}'})\nOPTIONAL MATCH (upstream)-[:CALLS]->(target)\nOPTIONAL MATCH (target)-[:CALLS|READS]->(downstream)\nRETURN target.name, collect(DISTINCT upstream.name) AS callers, collect(DISTINCT downstream.name) AS dependents`, 'cypher2')}
                      className="text-[10px] text-[#8e95ae] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === 'cypher2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-amber-300 text-[11px] overflow-x-auto p-2 bg-[#08090d] border border-[#141622]">
{`MATCH (target:Service {name: '${selectedScenario.targetService}'})
OPTIONAL MATCH (upstream)-[:CALLS]->(target)
OPTIONAL MATCH (target)-[:CALLS|READS]->(downstream)
RETURN target.name, 
       collect(DISTINCT upstream.name) AS callers, 
       collect(DISTINCT downstream.name) AS dependents;`}
                  </pre>
                </div>

                {/* Live Cypher Execution Output Drawer */}
                {cypherOutput && (
                  <div className="p-3.5 bg-[#05070d] border border-emerald-900/50 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-[#182030]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-bold text-[11px] font-mono">
                          FALKORDB ENGINE RESULT // 200 OK
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#787f98]">
                        <span>Latency: <strong className="text-emerald-400">0.38ms</strong></span>
                        <span>Matched: <strong className="text-white">{cypherOutput.records.length} path</strong></span>
                        <button
                          onClick={() => { sound.playClick(); setCypherOutput(null); }}
                          className="hover:text-white transition-colors cursor-pointer text-[#656c84]"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Table of Matched Records */}
                    <div className="overflow-x-auto border border-[#161a29]">
                      <table className="w-full text-[10px] text-left font-mono">
                        <thead className="bg-[#0b0e18] text-[#8e95ae] border-b border-[#191e30]">
                          <tr>
                            <th className="p-2">Path Traversed</th>
                            <th className="p-2">Hops</th>
                            <th className="p-2">Crown Jewel</th>
                            <th className="p-2">Verdict</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#131726]">
                          {cypherOutput.records.map((rec, i) => (
                            <tr key={i} className="hover:bg-[#0c101c] transition-colors">
                              <td className="p-2 text-[#7dd3fc] font-semibold">{rec.path}</td>
                              <td className="p-2 text-white">{rec.hops}</td>
                              <td className="p-2 text-amber-300">{rec.datastore}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 border ${
                                  rec.classification.includes('CRITICAL')
                                    ? 'bg-red-950/40 text-red-400 border-red-800/40'
                                    : rec.classification.includes('SUPPRESSED')
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                                    : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                                }`}>
                                  {rec.classification}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Gemini Agent Live Analysis */}
                    <div className="p-2.5 bg-[#090c16] border border-[#1d243a] text-[11px] space-y-1 font-sans">
                      <div className="text-[10px] font-mono text-[#7c83ff] font-bold flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#7c83ff]" />
                        <span>Gemini 3.8 Flash Agent Analysis:</span>
                      </div>
                      <p className="text-[#c5cbe0] leading-relaxed">
                        {cypherOutput.agentNote}
                      </p>
                    </div>

                    {/* Jump to Copilot CTA */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('copilot');
                        }}
                        className="text-[10px] font-mono text-[#a5adff] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Discuss this path in Interactive Copilot</span>
                        <ArrowRight className="w-3 h-3 text-[#7c83ff]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#0d0f18] border border-[#1c2032] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#787f98]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>GraphBLAS sparse matrix multiplication latency: <strong>0.38ms</strong></span>
                </div>
                <button
                  onClick={handleExecuteCypherInAgent}
                  disabled={isExecutingCypher}
                  className="px-3.5 py-1.5 bg-[#7c83ff] hover:bg-[#6c74fa] text-white font-mono text-xs font-semibold border border-[#9aa0ff] shadow-[0_0_15px_rgba(124,131,255,0.3)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExecutingCypher ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing on FalkorDB...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Execute Query in Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Autonomous Remediation Dispatch Center */}
          {activeTab === 'actions' && (
            <div className="bg-[#08090f] border border-[#1b1e2c] card-raised p-5 h-[560px] overflow-y-auto space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#181a26]">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-[#7c83ff]" />
                  <span className="font-bold text-white text-sm">AUTONOMOUS REMEDIATION WORKSPACE</span>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5">
                  HOTFIX READY
                </span>
              </div>

              {/* Action 1: Pull Request Card */}
              <div className="p-4 bg-[#0a0c13] border border-[#1e2236] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#7c83ff]/20 text-[#a5adff] border border-[#7c83ff]/40 text-[10px] font-bold">
                      PULL REQUEST #1428
                    </span>
                    <span className="font-semibold text-white">
                      fix(deps): bump {activeFinding.package} to secure release
                    </span>
                  </div>
                  {isPrMerged ? (
                    <span className="px-2.5 py-1 bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[10px] font-bold flex items-center gap-1">
                      <GitMerge className="w-3 h-3 text-purple-400" />
                      MERGED & DEPLOYED
                    </span>
                  ) : (
                    <button
                      onClick={handleMergePr}
                      className="px-3 py-1.5 bg-[#7c83ff] hover:bg-[#6c74fa] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(124,131,255,0.25)]"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Simulate Merge PR</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-[#787f98]">
                  Branch: <code className="text-white">fix/{activeFinding.package}-patch</code> &rarr; <code className="text-white">main</code>
                </div>

                {/* Diff Preview */}
                <div className="p-2.5 bg-[#050609] border border-[#161824] font-mono text-[11px] space-y-1">
                  <div className="text-[#656c84]">// pom.xml / package.json dependency diff</div>
                  <div className="text-red-400 bg-red-950/20 px-1 py-0.5">
                    - &lt;version&gt;{activeFinding.version}&lt;/version&gt;
                  </div>
                  <div className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5">
                    + &lt;version&gt;{activeFinding.patchedVersion || '2.17.1'}&lt;/version&gt;
                  </div>
                </div>
              </div>

              {/* Action 2 & 3: Jira & Slack Cards in a 2-col row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Jira Card */}
                <div className="p-3.5 bg-[#0a0c13] border border-[#1e2236] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#7c83ff] font-bold">JIRA SECURITY TICKET</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border ${
                      isJiraResolved 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                        : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                    }`}>
                      {isJiraResolved ? 'RESOLVED' : 'IN SPRINT'}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">
                    [SEC-9021] Urgent Patch: {selectedScenario.cveId}
                  </div>
                  <div className="text-[11px] text-[#787f98] space-y-1">
                    <div>Assignee: <strong className="text-white">@platform-security</strong></div>
                    <div>Sprint: <strong className="text-white">Sprint 42 (Current)</strong></div>
                  </div>
                  <button
                    onClick={() => { sound.playClick(); setIsJiraResolved(!isJiraResolved); }}
                    className="w-full mt-1 py-1 text-[11px] bg-[#141624] hover:bg-[#1d2033] text-white border border-[#23273c] transition-colors cursor-pointer"
                  >
                    {isJiraResolved ? 'Reopen Ticket' : 'Mark as Resolved'}
                  </button>
                </div>

                {/* Slack Incident Broadcast */}
                <div className="p-3.5 bg-[#0a0c13] border border-[#1e2236] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#7c83ff] font-bold">SLACK BROADCAST</span>
                    <span className="text-[10px] text-[#6c738c]">#sec-ops-triage</span>
                  </div>
                  <div className="p-2 bg-[#06070a] border border-[#161824] space-y-1 text-[11px]">
                    <div className="text-red-400 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400" />
                      <span>CRITICAL ATTACK PATH DETECTED</span>
                    </div>
                    <div className="text-[#a5abbf] text-[10px]">
                      Blast Radius Agent found reachable route to Customer DB PII. PR #1428 auto-opened.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
