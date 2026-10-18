export type NodeType = 'Internet' | 'Endpoint' | 'Service' | 'Package' | 'DataStore' | 'Team';

export type EdgeType = 'calls' | 'depends_on' | 'reads' | 'owns';

export type SeverityLevel = 'critical' | 'high' | 'suppressed';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  sublabel?: string;
  service?: string;
  owner?: string;
  environment?: string;
  dataClassification?: string;
  recordsCount?: string;
  isCrownJewel?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  label: EdgeType;
  protocol?: string;
}

export interface MCPToolStep {
  id: string;
  stepNumber: number;
  toolName: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
  timestamp: string;
  durationMs: number;
  inputParams: Record<string, any>;
  outputResult: Record<string, any>;
  highlightNodeIds: string[];
  highlightEdgeIds: string[];
}

export interface SecurityFinding {
  id: string;
  cveId: string;
  title: string;
  package: string;
  version: string;
  patchedVersion: string;
  affectedService: string;
  serviceNodeId: string;
  packageNodeId: string;
  targetDataStoreId?: string;
  genericCvss: number;
  blastRadiusScore: number;
  status: SeverityLevel;
  reachabilityStatus: 'Reachable from Internet' | 'Internal Service Only' | 'Air-gapped / Isolated' | 'DevDependency / Pruned';
  hopsCount: number;
  attackPathNodeIds: string[];
  attackPathEdgeIds: string[];
  pathBreadcrumb: string;
  summaryExplanation: string;
  suppressionReason?: string;
  metrics: {
    reachability: number; // 0-100
    exposure: number;     // 0-10
    dataSensitivity: number; // 0-10
    centrality: number;   // 0-10
  };
  actions: {
    pr?: {
      title: string;
      prNumber: number;
      branch: string;
      targetFile: string;
      oldLine: string;
      newLine: string;
      assignedReviewer: string;
    };
    jira?: {
      ticketKey: string;
      summary: string;
      priority: string;
      assignee: string;
      sprint: string;
    };
    slack?: {
      channel: string;
      targetUser: string;
      headline: string;
      summary: string;
    };
  };
  mcpSteps: MCPToolStep[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
