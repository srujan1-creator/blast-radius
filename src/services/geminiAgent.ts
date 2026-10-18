import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GraphData, SecurityFinding, MCPToolStep } from '../types';
import { redactDlpSecrets } from '../utils/security';

// Default model to use
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
const FALLBACK_GEMINI_MODEL = 'gemini-flash-latest';

export interface GeminiTriageResponse {
  blastRadiusScore: number;
  status: 'critical' | 'high' | 'suppressed';
  reachable: boolean;
  attackPathNodeIds: string[];
  attackPathEdgeIds: string[];
  hopsCount: number;
  pathBreadcrumb: string;
  summaryExplanation: string;
  suppressionReason?: string;
  mcpSteps: MCPToolStep[];
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
}

/**
 * Reads Gemini API Key from localStorage or Vite env
 */
export function getGeminiApiKey(): string | null {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('blast_radius_gemini_api_key');
    if (localKey && localKey.trim()) return localKey.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();
  return null;
}

/**
 * Saves Gemini API Key to localStorage
 */
export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('blast_radius_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('blast_radius_gemini_api_key');
    }
  }
}

/**
 * Real-time Gemini security triage agent
 */
export async function triageFindingWithGemini(
  finding: SecurityFinding,
  graphData: GraphData,
  apiKeyOverride?: string
): Promise<GeminiTriageResponse> {
  const apiKey = apiKeyOverride || getGeminiApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const systemPrompt = `You are "Blast Radius", an autonomous cybersecurity triage agent that reasons over an infrastructure knowledge graph stored in FalkorDB.
Your task is to determine whether a given vulnerability alert (CVE) is ACTUALLY exploitable from the Public Internet and can reach Crown Jewel datastores (PII/PCI), or if it is harmless noise that must be auto-suppressed.

You have access to the following graph schema:
Nodes: ${JSON.stringify(graphData.nodes.map(n => ({ id: n.id, name: n.label, type: n.type, isCrownJewel: n.isCrownJewel, env: n.environment, owner: n.owner })))}
Edges: ${JSON.stringify(graphData.edges.map(e => ({ id: e.id, source: typeof e.source === 'object' ? (e.source as any).id : e.source, target: typeof e.target === 'object' ? (e.target as any).id : e.target, label: e.label })))}

The vulnerability under evaluation is:
- CVE ID: ${finding.cveId}
- Package: ${finding.package} @ ${finding.version}
- Affected Service: ${finding.affectedService} (Service Node: ${finding.serviceNodeId})
- Base CVSS Score: ${finding.genericCvss}

Evaluate exploitability:
1. Trace multi-hop network paths starting from Internet ("internet") through Gateways to the affected service.
2. Check if the affected service or package has access to Crown Jewel datastores (e.g. "datastore_customer_db" with PII, or "datastore_payment_vault").
3. If reachable from Internet:
   - status: "critical" (if touches Crown Jewel PII/PCI) or "high"
   - blastRadiusScore: between 7.5 and 10.0
   - attackPathNodeIds: array of node ids in order from internet to target
   - generate PR (title, branch, targetFile, oldLine, newLine, reviewer), Jira ticket, and Slack alert
4. If NOT reachable from Internet (e.g. air-gapped, internal-only batch tool, devDependency only):
   - status: "suppressed"
   - blastRadiusScore: between 0.1 and 1.8 (proves dramatic reduction from high generic CVSS!)
   - suppressionReason: clear mathematical proof why no path exists from internet boundary
   - attackPathNodeIds: []

Format output as valid JSON matching this schema:
{
  "blastRadiusScore": number,
  "status": "critical" | "high" | "suppressed",
  "reachable": boolean,
  "attackPathNodeIds": string[],
  "attackPathEdgeIds": string[],
  "hopsCount": number,
  "pathBreadcrumb": string,
  "summaryExplanation": string,
  "suppressionReason": string,
  "mcpSteps": [
    {
      "id": string,
      "stepNumber": number,
      "toolName": string,
      "description": string,
      "status": "completed",
      "timestamp": string,
      "durationMs": number,
      "inputParams": object,
      "outputResult": object,
      "highlightNodeIds": string[],
      "highlightEdgeIds": string[]
    }
  ],
  "actions": {
    "pr": { "title": string, "prNumber": number, "branch": string, "targetFile": string, "oldLine": string, "newLine": string, "assignedReviewer": string },
    "jira": { "ticketKey": string, "summary": string, "priority": string, "assignee": string, "sprint": string },
    "slack": { "channel": string, "targetUser": string, "headline": string, "summary": string }
  }
}`;

  let text = '';
  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_GEMINI_MODEL,
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    });
    const result = await model.generateContent(systemPrompt);
    text = redactDlpSecrets(result.response.text());
  } catch {
    const fallbackModel = genAI.getGenerativeModel({
      model: FALLBACK_GEMINI_MODEL,
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    });
    const result = await fallbackModel.generateContent(systemPrompt);
    text = redactDlpSecrets(result.response.text());
  }

  const parsed = JSON.parse(text) as GeminiTriageResponse;
  return parsed;
}

/**
 * Interactive Gemini Security Copilot Chat
 */
export async function askGeminiCopilot(
  userQuery: string,
  finding: SecurityFinding,
  graphData: GraphData,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey = apiKeyOverride || getGeminiApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `You are the Blast Radius Gemini Security Copilot, an expert AppSec & knowledge graph intelligence assistant.
You have live access to the organization's infrastructure knowledge graph in FalkorDB:
Nodes count: ${graphData.nodes.length}
Edges count: ${graphData.edges.length}
Active finding: ${finding.cveId} in package ${finding.package} affecting ${finding.affectedService}.
Finding status: ${finding.status} (Blast Radius score: ${finding.blastRadiusScore}, generic CVSS: ${finding.genericCvss}).
Path: ${finding.pathBreadcrumb}.

Answer the user's security question accurately and concisely. If they ask for a Cypher query, provide the exact openCypher query. If they ask about reachability, explain the multi-hop network path.

User Question: ${userQuery}`;

  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_GEMINI_MODEL,
      generationConfig: { temperature: 0.3 }
    });
    const result = await model.generateContent(prompt);
    return redactDlpSecrets(result.response.text());
  } catch {
    const fallbackModel = genAI.getGenerativeModel({
      model: FALLBACK_GEMINI_MODEL,
      generationConfig: { temperature: 0.3 }
    });
    const result = await fallbackModel.generateContent(prompt);
    return redactDlpSecrets(result.response.text());
  }
}
