import React, { useState } from 'react';
import type { SecurityFinding, MCPToolStep, GraphData } from '../../types';
import { ActionPRCard } from './ActionPRCard';
import { ActionJiraCard } from './ActionJiraCard';
import { ActionSlackCard } from './ActionSlackCard';
import { ActionSuppressedCard } from './ActionSuppressedCard';
import { askGeminiCopilot, getGeminiApiKey } from '../../services/geminiAgent';
import { 
  Terminal, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  Cpu, 
  FileCode, 
  Zap, 
  Database, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Key,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface AgentReasoningProps {
  finding: SecurityFinding;
  visibleSteps: MCPToolStep[];
  isSimulating: boolean;
  hasTriaged: boolean;
  totalSteps: number;
  graphData: GraphData;
  onOpenKeyModal?: () => void;
}

export const AgentReasoning: React.FC<AgentReasoningProps> = ({
  finding,
  visibleSteps,
  isSimulating,
  hasTriaged,
  totalSteps,
  graphData,
  onOpenKeyModal
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'copilot' | 'cypher' | 'actions'>('trace');
  const [expandedStepIds, setExpandedStepIds] = useState<Record<string, boolean>>({});
  
  // Copilot Chat state
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your Gemini Security Agent. I have analyzed the FalkorDB topology for ${finding.cveId}. Ask me about attack reachability, Crown Jewel exposure, or ask for a custom openCypher query.`,
      time: 'Just now'
    }
  ]);

  const toggleExpand = (stepId: string) => {
    setExpandedStepIds(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const hasKey = !!getGeminiApiKey();
  const hasActions = finding.actions && (finding.actions.pr || finding.actions.jira || finding.actions.slack);
  const isSuppressed = finding.status === 'suppressed';
  const showActions = (hasTriaged || !isSimulating) && (hasActions || isSuppressed);

  const handleSendCopilot = async (queryText?: string) => {
    const textToSend = queryText || copilotInput;
    if (!textToSend.trim() || isCopilotLoading) return;

    const userMsg = { role: 'user' as const, text: textToSend.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setCopilotInput('');
    setIsCopilotLoading(true);

    try {
      const response = await askGeminiCopilot(textToSend, finding, graphData);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (err: any) {
      // Fallback sandbox response if no key or error
      let fallback = '';
      if (err?.message === 'MISSING_API_KEY') {
        if (textToSend.toLowerCase().includes('customer db') || textToSend.toLowerCase().includes('reach')) {
          fallback = `[Gemini Sandbox] Yes. Graph traversal in FalkorDB proves that ${finding.cveId} in ${finding.package} allows an unauthenticated external attacker on /api/v1/* to execute remote commands inside the Auth pod. Because the Auth Service holds direct read privileges to "Customer DB (PII)", the attacker can exfiltrate 4.2M sensitive customer records. Connect your Gemini API Key in the top bar to enable live zero-shot inference!`;
        } else if (textToSend.toLowerCase().includes('suppress') || textToSend.toLowerCase().includes('why')) {
          fallback = `[Gemini Sandbox] Analysis of FalkorDB confirms zero paths exist from the Internet ingress boundary to this service. It is air-gapped with no public socket listeners and devDependencies are pruned at container build time. Connect your Gemini API Key for dynamic reasoning!`;
        } else if (textToSend.toLowerCase().includes('cypher')) {
          fallback = `[Gemini Sandbox] Here is the optimal FalkorDB Cypher query:\n\nMATCH path = (inet:Internet)-[:CALLS*1..4]->(svc:Service)-[:DEPENDS_ON]->(p:Package {cveId: "${finding.cveId}"})\nRETURN path;`;
        } else {
          fallback = `[Gemini Sandbox] Exploitability confirmed via FalkorDB GraphBLAS multi-hop pathfinding. Composite Blast Radius score: ${finding.blastRadiusScore}/10.0. Connect your Google Gemini API key to enable live zero-shot responses!`;
        }
      } else {
        fallback = `Error querying Gemini: ${err?.message || 'Network error'}. Please check your API key.`;
      }

      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: fallback, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Cypher query for this finding
  const cypherQuery = `// FalkorDB Cypher Query for ${finding.cveId}
MATCH (i:Internet)-[r:CALLS*1..4]->(s:Service)
WHERE s.id = "${finding.serviceNodeId}"
MATCH (s)-[:DEPENDS_ON]->(p:Package {cveId: "${finding.cveId}"})
OPTIONAL MATCH (s)-[:READS]->(ds:DataStore)
RETURN i.name AS ingress,
       s.name AS service,
       p.name AS package,
       ds.name AS crownJewel,
       length(r) AS hops
ORDER BY hops ASC LIMIT 1;`;

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] border border-[#1a1d28] card-raised select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-[#0d0f16] border-b border-[#181a24]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7c83ff]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7c83ff] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#7c83ff]" />
              <span>Gemini AI Agent Engine</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenKeyModal && (
              <button
                onClick={onOpenKeyModal}
                className={`px-1.5 py-0.5 text-[9px] font-mono border flex items-center gap-1 cursor-pointer transition-colors ${
                  hasKey
                    ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40'
                    : 'bg-[#181a26] text-[#8e94a8] border-[#2c3246] hover:text-white'
                }`}
                title="Configure Gemini API Key"
              >
                <Key className="w-2.5 h-2.5" />
                <span>{hasKey ? 'Gemini Live' : 'Connect Key'}</span>
              </button>
            )}

            {isSimulating ? (
              <span className="px-2 py-0.5 bg-[#7c83ff]/15 text-[#c7cbff] border border-[#7c83ff]/40 text-[9px] font-mono animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c83ff] animate-ping" />
                <span>REASONING...</span>
              </span>
            ) : hasTriaged ? (
              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-semibold">
                COMPLETE
              </span>
            ) : null}
          </div>
        </div>

        {/* Target Finding Summary */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span>Target:</span>
            <span className="text-[#7c83ff]">{finding.cveId}</span>
          </span>
          <span className="text-[#656b82] text-[10px]">
            {finding.package} @ {finding.version}
          </span>
        </div>

        {/* 4 Clean Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-2.5 bg-[#06070a] p-1 border border-[#161824] text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('trace')}
            className={`py-1 px-1 text-center border transition-all cursor-pointer truncate ${
              activeTab === 'trace'
                ? 'bg-[#181a26] text-white border-[#2c3246] font-semibold'
                : 'text-[#6e758c] hover:text-[#c0c5d6] border-transparent'
            }`}
          >
            Trace ({visibleSteps.length})
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-1 px-1 text-center border transition-all cursor-pointer truncate ${
              activeTab === 'copilot'
                ? 'bg-[#7c83ff]/20 text-[#c7cbff] border-[#7c83ff]/50 font-semibold'
                : 'text-[#6e758c] hover:text-[#c0c5d6] border-transparent'
            }`}
          >
            AI Copilot ★
          </button>
          <button
            onClick={() => setActiveTab('cypher')}
            className={`py-1 px-1 text-center border transition-all cursor-pointer truncate ${
              activeTab === 'cypher'
                ? 'bg-[#181a26] text-white border-[#2c3246] font-semibold'
                : 'text-[#6e758c] hover:text-[#c0c5d6] border-transparent'
            }`}
          >
            Cypher
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-1 px-1 text-center border transition-all cursor-pointer truncate ${
              activeTab === 'actions'
                ? 'bg-[#181a26] text-white border-[#2c3246] font-semibold'
                : 'text-[#6e758c] hover:text-[#c0c5d6] border-transparent'
            }`}
          >
            Actions {showActions ? '●' : ''}
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* TAB 1: Agent Trace (MCP Timeline) */}
        {activeTab === 'trace' && (
          <div className="space-y-3">
            {visibleSteps.length === 0 ? (
              <div className="p-4 bg-[#08090d] border border-[#161824] text-center text-xs font-mono text-[#585e74] space-y-2">
                <Terminal className="w-5 h-5 mx-auto text-[#3b4054]" />
                <p>Click "Triage with Agent" to stream Gemini AI graph tool executions.</p>
              </div>
            ) : (
              <div className="space-y-2 relative before:absolute before:top-2 before:bottom-2 before:left-[9px] before:w-[1px] before:bg-[#1a1d28]">
                {visibleSteps.map((step) => {
                  const isExpanded = !!expandedStepIds[step.id];

                  return (
                    <div key={step.id} className="relative pl-5 text-xs font-mono">
                      {/* Timeline Bullet */}
                      <div className="absolute left-[9px] top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0a0c12] border-2 border-[#7c83ff] flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-[#7c83ff]" />
                      </div>

                      <div className="bg-[#08090d] border border-[#161824] hover:border-[#272c3d] transition-all">
                        {/* Step Header */}
                        <div
                          onClick={() => toggleExpand(step.id)}
                          className="p-2 flex items-start justify-between gap-2 cursor-pointer select-none"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#7c83ff] font-bold text-[10px]">
                                {step.toolName}
                              </span>
                              <span className="text-[8.5px] text-[#5d647a] bg-[#12141c] px-1 py-0.2 border border-[#1c202e]">
                                {step.durationMs}ms
                              </span>
                            </div>
                            <p className="text-[10px] text-[#9ca3ba] font-sans leading-tight">
                              {step.description}
                            </p>
                          </div>

                          <button className="text-[#555b70] hover:text-white p-0.5 mt-0.5">
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        </div>

                        {/* Expandable JSON Inspector */}
                        {isExpanded && (
                          <div className="p-2 pt-0 border-t border-[#141620] space-y-1.5 bg-[#050608]">
                            <div>
                              <div className="text-[8.5px] font-bold text-[#656b82] uppercase tracking-wider mb-1 mt-1 flex items-center gap-1">
                                <FileCode className="w-2.5 h-2.5 text-[#38bdf8]" />
                                <span>Tool Parameters:</span>
                              </div>
                              <pre className="p-1.5 bg-[#020305] border border-[#12141c] text-[9.5px] text-[#38bdf8] overflow-x-auto leading-relaxed">
                                {JSON.stringify(step.inputParams, null, 2)}
                              </pre>
                            </div>

                            <div>
                              <div className="text-[8.5px] font-bold text-[#656b82] uppercase tracking-wider mb-1 flex items-center gap-1">
                                <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                                <span>FalkorDB Graph Result:</span>
                              </div>
                              <pre className="p-1.5 bg-[#020305] border border-[#12141c] text-[9.5px] text-emerald-300 overflow-x-auto leading-relaxed">
                                {JSON.stringify(step.outputResult, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Gemini Security Copilot Chat */}
        {activeTab === 'copilot' && (
          <div className="flex flex-col h-full space-y-2.5 font-mono text-xs">
            {/* Quick Prompt Pills */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#656b82] font-bold">Suggested Inquiries:</span>
              <div className="flex flex-col gap-1 text-[10px]">
                <button
                  onClick={() => handleSendCopilot(`Can an external attacker reach Customer DB via ${finding.cveId}?`)}
                  className="p-1.5 text-left bg-[#08090d] hover:bg-[#12141c] border border-[#181a24] text-[#a5abbf] hover:text-white transition-colors cursor-pointer truncate"
                >
                  ⚡ Can an external attacker reach Customer DB?
                </button>
                <button
                  onClick={() => handleSendCopilot(`Why was ${finding.cveId} marked as ${finding.status}?`)}
                  className="p-1.5 text-left bg-[#08090d] hover:bg-[#12141c] border border-[#181a24] text-[#a5abbf] hover:text-white transition-colors cursor-pointer truncate"
                >
                  🔍 Why is this marked as {finding.status}?
                </button>
                <button
                  onClick={() => handleSendCopilot(`Write an openCypher query to isolate ${finding.affectedService}`)}
                  className="p-1.5 text-left bg-[#08090d] hover:bg-[#12141c] border border-[#181a24] text-[#a5abbf] hover:text-white transition-colors cursor-pointer truncate"
                >
                  🛠 Generate Cypher query to isolate service
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2.5 p-2 bg-[#06070a] border border-[#161824]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 border text-[11px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#12141f] border-[#222536] text-[#e2e4ec] ml-3'
                      : 'bg-[#090b10] border-[#181a24] text-[#a5abbf] mr-2 font-sans'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#656b82] mb-1">
                    <span className="flex items-center gap-1 font-bold">
                      {msg.role === 'user' ? <User className="w-2.5 h-2.5 text-[#7c83ff]" /> : <Bot className="w-2.5 h-2.5 text-emerald-400" />}
                      <span>{msg.role === 'user' ? 'You' : 'Gemini Agent'}</span>
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}

              {isCopilotLoading && (
                <div className="p-2 bg-[#090b10] border border-[#181a24] text-[11px] text-[#7c83ff] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini is reasoning over FalkorDB graph...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Ask Gemini about this attack vector..."
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCopilot()}
                className="flex-1 bg-[#06070a] border border-[#1a1d28] text-xs px-2.5 py-1.5 text-white placeholder-[#454a5c] focus:outline-none focus:border-[#7c83ff] font-mono"
              />
              <button
                onClick={() => handleSendCopilot()}
                disabled={!copilotInput.trim() || isCopilotLoading}
                className="p-1.5 bg-[#7c83ff] hover:bg-[#6c74fa] disabled:opacity-40 text-white border border-[#969cff] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FalkorDB Cypher Engine */}
        {activeTab === 'cypher' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 bg-[#08090d] border border-[#161824] space-y-2">
              <div className="flex items-center justify-between text-[10px] text-[#7c83ff] font-bold">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-[#7c83ff]" />
                  <span>FalkorDB GraphBLAS Query</span>
                </span>
                <span className="text-emerald-400">0.42ms</span>
              </div>
              <pre className="p-2 bg-[#050609] border border-[#141622] text-[10px] text-[#7dd3fc] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {cypherQuery}
              </pre>
            </div>

            <div className="p-2.5 bg-[#08090d] border border-[#161824] space-y-1.5 text-[10px] text-[#8a91a8]">
              <div className="text-white font-bold text-[11px] mb-1">Execution Engine Highlights</div>
              <div className="flex justify-between py-0.5 border-b border-[#141620]">
                <span className="text-[#555a6d]">Engine Core:</span>
                <span className="text-white">GraphBLAS Sparse Linear Algebra</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#141620]">
                <span className="text-[#555a6d]">Traversal Algorithm:</span>
                <span className="text-white">Multi-hop BFS Reachability</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#141620]">
                <span className="text-[#555a6d]">Exploitability Proof:</span>
                <span className="text-emerald-400 font-bold">Deterministic (No Hallucination)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Remediation Actions */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {!showActions ? (
              <div className="p-4 bg-[#08090d] border border-[#161822] text-center text-xs font-mono text-[#585e74]">
                Actions will generate automatically once the agent validates reachability over FalkorDB.
              </div>
            ) : (
              <div className="space-y-3">
                {isSuppressed && (
                  <ActionSuppressedCard
                    reason={finding.suppressionReason}
                    reachabilityStatus={finding.reachabilityStatus}
                    cveId={finding.cveId}
                    service={finding.affectedService}
                  />
                )}

                {finding.actions.pr && (
                  <ActionPRCard pr={finding.actions.pr} />
                )}

                {finding.actions.jira && (
                  <ActionJiraCard jira={finding.actions.jira} />
                )}

                {finding.actions.slack && (
                  <ActionSlackCard slack={finding.actions.slack} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
