"""
Blast Radius — FalkorDB Agent Client & Cypher Query Engine
Uses the official FalkorDB Python SDK (built on Redis + GraphBLAS).
"""

import sys
import json
from typing import Dict, Any, List

try:
    from falkordb import FalkorDB
except ImportError:
    print("[INFO] 'falkordb' library not installed. Install via: pip install falkordb")


class BlastRadiusFalkorDB:
    def __init__(self, host: str = "localhost", port: int = 6379, graph_name: str = "blast_radius_sec"):
        self.host = host
        self.port = port
        self.graph_name = graph_name
        self.db = None
        self.graph = None

    def connect(self):
        """Connect to FalkorDB instance."""
        print(f"[*] Connecting to FalkorDB at {self.host}:{self.port}...")
        self.db = FalkorDB(host=self.host, port=self.port)
        self.graph = self.db.select_graph(self.graph_name)
        print(f"[+] Connected to graph: '{self.graph_name}'")

    def seed_from_file(self, cypher_file_path: str):
        """Execute the Cypher seed script to build the infrastructure graph."""
        with open(cypher_file_path, "r", encoding="utf-8") as f:
            cypher_script = f.read()

        # Split statements and execute
        statements = [stmt.strip() for stmt in cypher_script.split(";") if stmt.strip()]
        for stmt in statements:
            # Skip pure comments
            lines = [l for l in stmt.splitlines() if not l.strip().startswith("//")]
            clean_stmt = "\n".join(lines).strip()
            if clean_stmt:
                self.graph.query(clean_stmt)
        print(f"[+] Successfully seeded FalkorDB graph with topology and CVE telemetry.")

    def find_ingress_attack_path(self, cve_id: str) -> Dict[str, Any]:
        """
        MCP Tool: Queries FalkorDB to find full attack route from Public Internet
        to vulnerable package and down to Crown Jewel datastores.
        """
        cypher = """
        MATCH (inet:Internet)-[e1:CALLS*1..3]->(svc:Service)-[e2:DEPENDS_ON]->(pkg:Package {cveId: $cveId})
        OPTIONAL MATCH (svc)-[e3:READS]->(ds:DataStore {isCrownJewel: true})
        RETURN inet.name AS ingress,
               svc.name AS affectedService,
               pkg.name AS package,
               pkg.version AS version,
               ds.name AS crownJewelTarget,
               ds.classification AS dataClassification,
               length(e1) + 1 AS hopsCount
        """
        result = self.graph.query(cypher, {"cveId": cve_id})

        if not result.result_set:
            return {
                "cveId": cve_id,
                "reachableFromInternet": False,
                "verdict": "SUPPRESSED_AIR_GAPPED",
                "reason": "FalkorDB graph traversal proved 0 ingress routes from public boundary."
            }

        row = result.result_set[0]
        return {
            "cveId": cve_id,
            "reachableFromInternet": True,
            "ingress": row[0],
            "affectedService": row[1],
            "package": row[2],
            "version": row[3],
            "crownJewelTarget": row[4],
            "dataClassification": row[5],
            "hopsCount": row[6],
            "verdict": "CRITICAL_ATTACK_PATH_CONFIRMED"
        }

    def get_service_owner(self, service_id: str) -> Dict[str, Any]:
        """
        MCP Tool: Resolves IAM ownership and escalation channels from FalkorDB.
        """
        cypher = """
        MATCH (team:Team)-[:OWNS]->(svc:Service {id: $serviceId})
        RETURN team.name AS teamName, team.lead AS lead, team.slackChannel AS slackChannel
        """
        res = self.graph.query(cypher, {"serviceId": service_id})
        if res.result_set:
            row = res.result_set[0]
            return {"teamName": row[0], "lead": row[1], "slackChannel": row[2]}
        return {"teamName": "Unknown", "lead": "@unassigned", "slackChannel": "#security"}


if __name__ == "__main__":
    print("=== Blast Radius FalkorDB Engine Demo ===")
    print("To run with live FalkorDB:")
    print("1. docker run -p 6379:6379 -it --rm falkordb/falkordb:latest")
    print("2. python falkordb_agent.py")
