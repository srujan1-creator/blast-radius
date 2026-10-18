# Blast Radius 🛡️⚡
> **Agents That Act on Connected Data**  
> Autonomous Cybersecurity Triage Agent powered by **FalkorDB GraphBLAS** and **Google Gemini 3.8 Flash**.

[![FalkorDB Hackathon](https://img.shields.io/badge/FalkorDB-GraphBLAS%20v6.8-emerald?style=flat-square)](https://www.falkordb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-7c83ff?style=flat-square)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=flat-square)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.3-38bdf8?style=flat-square)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

---

## 🎯 The Problem: 2,000 Alerts. 12 That Matter.

Traditional security scanners (Trivy, Snyk, Prisma) rank vulnerabilities blindly using isolated **CVSS Base Scores**. A CVSS 9.8 in an air-gapped, internal batch worker looks identical to a CVSS 9.8 in a public ingress gateway with access to customer PII. Security teams drown in false positives while real attack paths remain unpatched.

**Blast Radius** changes this paradigm:
1. Ingests all CVE findings and projects them onto a live **infrastructure knowledge graph in FalkorDB**.
2. Deploys an autonomous **Gemini AI Security Agent** to traverse the graph using openCypher algorithms.
3. Distinguishes harmless vulnerabilities (**auto-suppresses 94% noise**) from active exploit chains reaching Crown Jewel datastores (`Customer DB [PII]`, `Cardholder Vault [PCI-DSS]`).
4. Autonomously remediates: opens **GitHub Pull Requests with version bump diffs**, files **Jira tickets**, broadcasts **Slack alerts**, and generates **Zero-Trust Kubernetes NetworkPolicies**.

---

## ✨ Key Features

- **Interactive D3.js Force-Directed Topology**: Real-time visualization of Internet boundaries, API gateways, microservices, CVEs, and Crown Jewel datastores with animated laser beam attack paths.
- **Dedicated Gemini AI Agent Command Center**:
  - **4 Attack Scenarios**: Log4j RCE (`CVE-2021-44228`), Spring4Shell Ingress (`CVE-2022-22965`), Lodash Suppressed (`CVE-2021-23337`), and OpenSSL (`CVE-2021-3711`).
  - **5-Phase Agent Execution Pipeline**: Subgraph extraction &rarr; Ingress boundary verification &rarr; Crown Jewel exposure check &rarr; Zero-shot blast radius math &rarr; Remediation dispatch.
  - **Interactive Security Copilot**: Live streaming conversational assistant for querying MITRE ATT&CK mappings and blast radius explanations.
  - **FalkorDB Cypher Studio**: Interactive openCypher query executor with live record inspection.
  - **Remediation Workspace**: Visual PR diffs with simulated merge workflows, Jira ticket toggling, and Slack incident broadcasts.
- **Enterprise Security & AI Guardrails**:
  - **Zero-Trust Service Quarantine**: One-click generation of Kubernetes `NetworkPolicy` (Calico/Cilium) to isolate compromised pods.
  - **Automated DLP Scrubber**: Scans logs and prompts to redact API keys (`AQ....`, `AIza...`), AWS tokens, and JWTs.
  - **FalkorDB Read-Only Firewall**: Enforces strict read-only execution guardrails, blocking destructive Cypher mutations (`DELETE`, `DROP`).
  - **SLSA Level 3 Attestation**: Sigstore in-toto cryptographic provenance for patch integrity.
- **Tactile Web Audio SOC Synthesizer**: Zero-dependency browser audio feedback with sonar pings, critical alarm chords, and patch success chimes.

---

## 🏗️ Architecture

```
                     ┌────────────────────────┐
                     │     Public Internet    │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   Public API Gateway   │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │      Auth Service      │ ──[DEPENDS_ON]──► log4j-core 2.14.1
                     └───────────┬────────────┘                   (CVE-2021-44228)
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   Customer DB (PII)    │ ◄── [Crown Jewel Exposed!]
                     └────────────────────────┘
```

1. **Ingest Findings**: Trivy / Snyk / Dependabot vulnerability JSON feeds.
2. **FalkorDB Knowledge Graph**: High-performance GraphBLAS sparse matrix representation storing services, dependencies, and network routes with sub-millisecond hop traversal.
3. **Reason with Agent (MCP & Gemini)**:
   - `find_dependents(package)`
   - `find_attack_path(internet, crown_jewel)`
   - `get_owner(service)`
   - `score_risk(...)`
4. **Autonomous Action**: Auto-generate pull request, file Jira issue to service team, and broadcast Slack alert.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 22+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/srujan1-creator/blast-radius.git
cd blast-radius

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173/** in your browser.

### Configuring Google Gemini (Optional)
The app runs in high-fidelity autonomous sandbox mode out of the box. To enable live zero-shot Gemini reasoning:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   ```
*(Alternatively, enter your key in the UI under **Security & Key Vault**; keys are kept strictly on the client).*

---

## 🗄️ FalkorDB Backend (Optional Local Setup)

To run against a local FalkorDB Docker container:

```bash
cd falkordb
docker-compose up -d

# Seed the graph topology
docker exec -i falkordb falkor-cli < seed_graph.cypher

# Run the Python agent bridge
pip install falkordb
python falkordb_agent.py
```

---

## 🔒 Security & Privacy

- **Zero Secret Exposure**: All `.env` and credential files are strictly ignored by Git.
- **Client-Side Vault**: API keys are saved only in browser local storage and never transmitted to external servers.
- **DLP Interception**: Automated regex pattern matching masks any sensitive strings before rendering.

---

## 📜 License

MIT License. Built with ❤️ for the **FalkorDB Graph Hackathon 2026**.
