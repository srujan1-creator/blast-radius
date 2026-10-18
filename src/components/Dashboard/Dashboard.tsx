import React, { useState, useEffect, useRef } from 'react';
import type { GraphData, SecurityFinding, GraphNode, MCPToolStep } from '../../types';
import { AlertQueue } from './AlertQueue';
import { GraphVisualization } from './GraphVisualization';
import { AgentReasoning } from './AgentReasoning';
import { ExplainabilityCard } from '../ExplainabilityCard';
import { NodeDrawer } from '../NodeDrawer';
import { triageFindingWithGemini, getGeminiApiKey } from '../../services/geminiAgent';

interface DashboardProps {
  graphData: GraphData;
  findings: SecurityFinding[];
  onOpenKeyModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ graphData, findings, onOpenKeyModal }) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>('f-log4j');
  const [isCvssView, setIsCvssView] = useState<boolean>(false);
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasTriaged, setHasTriaged] = useState<boolean>(true); // start triaged by default so the demo looks complete immediately, but user can re-run
  const [simulationStep, setSimulationStep] = useState<number>(5);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedDrawerNode, setSelectedDrawerNode] = useState<GraphNode | null>(null);

  const [localFindings, setLocalFindings] = useState<SecurityFinding[]>(findings);
  const activeFinding = localFindings.find(f => f.id === selectedFindingId) || localFindings[0];

  // Active step highlights during simulation
  const [activeStepNodes, setActiveStepNodes] = useState<string[]>([]);
  const [activeStepEdges, setActiveStepEdges] = useState<string[]>([]);

  const timerRef = useRef<number | null>(null);

  // Visible steps in reasoning panel
  const visibleSteps: MCPToolStep[] = activeFinding.mcpSteps ? activeFinding.mcpSteps.slice(0, simulationStep) : [];

  // Update active step nodes/edges when step changes or finding changes
  useEffect(() => {
    if (isSimulating) {
      if (activeFinding.mcpSteps && activeFinding.mcpSteps.length > 0) {
        const currentMcpStep = activeFinding.mcpSteps[simulationStep - 1];
        if (currentMcpStep) {
          setActiveStepNodes(currentMcpStep.highlightNodeIds || []);
          setActiveStepEdges(currentMcpStep.highlightEdgeIds || []);
        }
      }
    } else {
      // Not simulating: show full attack path of selected finding
      setActiveStepNodes(activeFinding.attackPathNodeIds || []);
      setActiveStepEdges(activeFinding.attackPathEdgeIds || []);
    }
  }, [selectedFindingId, simulationStep, isSimulating, activeFinding]);

  // Handle running triage simulation with optional live Gemini call
  const handleRunTriage = async () => {
    if (isSimulating) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsSimulating(true);
    setHasTriaged(false);
    setSimulationStep(1);

    const hasKey = !!getGeminiApiKey();

    // If Gemini API Key is present, trigger real Gemini triage
    if (hasKey) {
      try {
        const geminiResult = await triageFindingWithGemini(activeFinding, graphData);
        // Update local finding with live Gemini output
        setLocalFindings(prev => prev.map(f => {
          if (f.id === activeFinding.id) {
            return {
              ...f,
              blastRadiusScore: geminiResult.blastRadiusScore,
              status: geminiResult.status,
              attackPathNodeIds: geminiResult.attackPathNodeIds.length > 0 ? geminiResult.attackPathNodeIds : f.attackPathNodeIds,
              summaryExplanation: geminiResult.summaryExplanation || f.summaryExplanation,
              suppressionReason: geminiResult.suppressionReason || f.suppressionReason,
              mcpSteps: geminiResult.mcpSteps && geminiResult.mcpSteps.length > 0 ? geminiResult.mcpSteps : f.mcpSteps,
              actions: geminiResult.actions || f.actions
            };
          }
          return f;
        }));
      } catch (e) {
        console.warn('Gemini live call error, falling back to deterministic graph steps:', e);
      }
    }

    const totalSteps = activeFinding.mcpSteps ? activeFinding.mcpSteps.length : 5;
    const baseInterval = 800 / speedMultiplier;

    let currentStep = 1;
    timerRef.current = window.setInterval(() => {
      currentStep++;
      if (currentStep <= totalSteps) {
        setSimulationStep(currentStep);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSimulating(false);
        setHasTriaged(true);
        setSimulationStep(totalSteps);
        // Show complete attack path
        setActiveStepNodes(activeFinding.attackPathNodeIds || []);
        setActiveStepEdges(activeFinding.attackPathEdgeIds || []);
      }
    }, baseInterval);
  };

  const handleResetTriage = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSimulating(false);
    setHasTriaged(false);
    setSimulationStep(0);
    setActiveStepNodes([]);
    setActiveStepEdges([]);
  };

  // Switch selected finding
  const handleSelectFinding = (findingId: string) => {
    setSelectedFindingId(findingId);
    const finding = findings.find(f => f.id === findingId);
    if (finding) {
      setSimulationStep(finding.mcpSteps ? finding.mcpSteps.length : 0);
      setActiveStepNodes(finding.attackPathNodeIds || []);
      setActiveStepEdges(finding.attackPathEdgeIds || []);
    }
  };

  return (
    <section id="live-dashboard" className="w-full max-w-[1520px] mx-auto px-4 py-4 space-y-6">
      {/* Dashboard Section Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#181a24]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7c83ff] font-bold">
              SECTION 02 // FALKORDB LIVE ENVIRONMENT
            </span>
            <span className="text-[#3b4054]">·</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FALKORDB GRAPH KERNEL RUNNING
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous Graph Security Triage Console
          </h2>
          <p className="text-xs text-[#8a91a8] mt-0.5">
            Watch the AI agent traverse infrastructure relationships over FalkorDB to isolate valid attack paths and execute remediation.
          </p>
        </div>

        {/* Speed Controls & Stats bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0c0e15] border border-[#1a1d28] p-1 text-[11px] font-mono">
            <span className="text-[#555a6d] px-2 text-[10px] uppercase font-bold">Execution:</span>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-0.5 border cursor-pointer ${
                speedMultiplier === 1
                  ? 'bg-[#181a26] text-white border-[#2c3246]'
                  : 'text-[#6e758c] border-transparent hover:text-white'
              }`}
            >
              1x (Realtime)
            </button>
            <button
              onClick={() => setSpeedMultiplier(2)}
              className={`px-2 py-0.5 border cursor-pointer ${
                speedMultiplier === 2
                  ? 'bg-[#181a26] text-white border-[#2c3246]'
                  : 'text-[#6e758c] border-transparent hover:text-white'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => {
                setSpeedMultiplier(4);
                if (isSimulating) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setIsSimulating(false);
                  setHasTriaged(true);
                  setSimulationStep(activeFinding.mcpSteps ? activeFinding.mcpSteps.length : 5);
                }
              }}
              className={`px-2 py-0.5 border cursor-pointer ${
                speedMultiplier === 4
                  ? 'bg-[#181a26] text-white border-[#2c3246]'
                  : 'text-[#6e758c] border-transparent hover:text-white'
              }`}
            >
              Instant
            </button>
          </div>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[760px]">
        {/* Left Panel: Alert Queue (3 cols) */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <AlertQueue
            findings={findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={handleSelectFinding}
            isCvssView={isCvssView}
            onToggleView={setIsCvssView}
            onRunTriage={handleRunTriage}
            onResetTriage={handleResetTriage}
            isSimulating={isSimulating}
            hasTriaged={hasTriaged}
            simulationStep={simulationStep}
            totalSteps={activeFinding.mcpSteps ? activeFinding.mcpSteps.length : 5}
          />
        </div>

        {/* Center Panel: Interactive Graph Visualization (6 cols) */}
        <div className="lg:col-span-6 h-full overflow-hidden">
          <GraphVisualization
            nodes={graphData.nodes}
            edges={graphData.edges}
            highlightNodeIds={activeFinding.attackPathNodeIds || []}
            highlightEdgeIds={activeFinding.attackPathEdgeIds || []}
            activeStepNodes={activeStepNodes}
            activeStepEdges={activeStepEdges}
            selectedFindingId={selectedFindingId}
            onSelectNode={(node) => setSelectedDrawerNode(node)}
            isSimulating={isSimulating}
          />
        </div>

        {/* Right Panel: Agent Reasoning and Actions (3 cols) */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <AgentReasoning
            finding={activeFinding}
            visibleSteps={visibleSteps}
            isSimulating={isSimulating}
            hasTriaged={hasTriaged}
            totalSteps={activeFinding.mcpSteps ? activeFinding.mcpSteps.length : 5}
            graphData={graphData}
            onOpenKeyModal={onOpenKeyModal}
          />
        </div>
      </div>

      {/* Section 3: Explainability Card (Directly below dashboard) */}
      <ExplainabilityCard finding={activeFinding} />

      {/* Sliding Side Drawer for Node Details */}
      {selectedDrawerNode && (
        <NodeDrawer
          node={selectedDrawerNode}
          onClose={() => setSelectedDrawerNode(null)}
          edges={graphData.edges}
          nodes={graphData.nodes}
          findings={findings}
          onSelectFinding={handleSelectFinding}
        />
      )}
    </section>
  );
};
