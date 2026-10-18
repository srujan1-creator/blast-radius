// ==============================================================================
// Blast Radius — FalkorDB Knowledge Graph Schema & Ingestion Script
// Dialect: openCypher on FalkorDB (GraphBLAS sparse linear algebra engine)
// ==============================================================================

// 1. Create Ingress and Network Endpoints
CREATE (inet:Internet {id: 'internet', name: 'Public Internet', cidr: '0.0.0.0/0', isPublic: true})
CREATE (ep_gw:Endpoint {id: 'endpoint_api_gw', name: 'API Gateway', path: '/api/v1/*', protocol: 'HTTPS', port: 443, env: 'production-dmz'})
CREATE (ep_admin:Endpoint {id: 'endpoint_admin', name: 'Internal Admin Endpoint', path: ':8080/mgmt', protocol: 'VPN', port: 8080, env: 'air-gapped-mgmt'})

// 2. Create Microservices
CREATE (svc_auth:Service {id: 'service_auth', name: 'Auth Service', runtime: 'JVM 11', framework: 'Spring Boot', env: 'production-dmz', isPubliclyExposed: true})
CREATE (svc_payment:Service {id: 'service_payment', name: 'Payment Service', runtime: 'Java 17', framework: 'Micronaut', env: 'production-pci', isPubliclyExposed: false})
CREATE (svc_cart:Service {id: 'service_cart', name: 'Cart Service', runtime: 'Node.js 18', framework: 'Express', env: 'production', isPubliclyExposed: false})
CREATE (svc_search:Service {id: 'service_search', name: 'Search Service', runtime: 'Java 17', framework: 'Lucene', env: 'production', isPubliclyExposed: false})
CREATE (svc_webhook:Service {id: 'service_webhook', name: 'Webhook Dispatcher', runtime: 'Node.js 18', framework: 'Fastify', env: 'production', isPubliclyExposed: false})
CREATE (svc_rec:Service {id: 'service_recommendation', name: 'Recommendation ML', runtime: 'Python 3.10', framework: 'FastAPI', env: 'internal-mesh', isPubliclyExposed: false})
CREATE (svc_admin:Service {id: 'service_internal_admin', name: 'Admin Batch Runner', runtime: 'Go 1.21', framework: 'CLI daemon', env: 'air-gapped-mgmt', isPubliclyExposed: false})

// 3. Create Datastores (Crown Jewels)
CREATE (ds_cust:DataStore {id: 'datastore_customer_db', name: 'Customer DB (PII)', type: 'PostgreSQL', classification: 'PII', recordsCount: 4200000, isCrownJewel: true})
CREATE (ds_vault:DataStore {id: 'datastore_payment_vault', name: 'Cardholder Vault', type: 'Encrypted HSM', classification: 'PCI-DSS Tier 1', recordsCount: 850000, isCrownJewel: true})
CREATE (ds_analytics:DataStore {id: 'datastore_analytics', name: 'Analytics Warehouse', type: 'ClickHouse OLAP', classification: 'Aggregated Analytics', recordsCount: 1200000000, isCrownJewel: false})
CREATE (ds_cache:DataStore {id: 'datastore_cache', name: 'Session Redis', type: 'Redis Cluster', classification: 'Ephemeral Cache', recordsCount: 250000, isCrownJewel: false})

// 4. Create Packages and CVE Associations
CREATE (pkg_log4j:Package {id: 'pkg_log4j', name: 'log4j-core', version: '2.14.1', ecosystem: 'maven', cveId: 'CVE-2021-44228', cvssBase: 10.0, rce: true})
CREATE (pkg_jackson:Package {id: 'pkg_jackson', name: 'jackson-databind', version: '2.13.0', ecosystem: 'maven', cveId: 'CVE-2020-36518', cvssBase: 8.5, deserialization: true})
CREATE (pkg_commons_text:Package {id: 'pkg_commons_text', name: 'commons-text', version: '1.9', ecosystem: 'maven', cveId: 'CVE-2022-42889', cvssBase: 9.8, rce: true})
CREATE (pkg_spring:Package {id: 'pkg_spring_beans', name: 'spring-beans', version: '5.3.17', ecosystem: 'maven', cveId: 'CVE-2022-22965', cvssBase: 9.8, rce: true})
CREATE (pkg_axios:Package {id: 'pkg_axios', name: 'axios', version: '0.21.1', ecosystem: 'npm', cveId: 'CVE-2021-3749', cvssBase: 7.5, ssrf: true})
CREATE (pkg_openssl:Package {id: 'pkg_openssl', name: 'openssl', version: '1.1.1k', ecosystem: 'system', cveId: 'CVE-2021-22965', cvssBase: 9.8, isolated: true})
CREATE (pkg_lodash_dev:Package {id: 'pkg_lodash_dev', name: 'lodash', version: '4.17.15', ecosystem: 'npm', cveId: 'CVE-2020-8203', cvssBase: 7.4, devOnly: true})

// 5. Create Ownership Teams
CREATE (team_identity:Team {id: 'team_identity', name: 'Identity Team', lead: '@alex.chen', slackChannel: '#sec-incidents'})
CREATE (team_payments:Team {id: 'team_payments', name: 'Payments Team', lead: '@maria.santos', slackChannel: '#pci-alerts'})
CREATE (team_platform:Team {id: 'team_platform', name: 'Platform Team', lead: '@david.kim', slackChannel: '#infra-oncall'})
CREATE (team_secops:Team {id: 'team_secops', name: 'SecOps Team', lead: '@sarah.vance', slackChannel: '#soc-triage'})

// 6. Connect Network Ingress Relationships
CREATE (inet)-[:CALLS {protocol: 'HTTPS/443'}]->(ep_gw)
CREATE (ep_gw)-[:CALLS {protocol: 'gRPC'}]->(svc_auth)
CREATE (ep_gw)-[:CALLS {protocol: 'gRPC'}]->(svc_payment)
CREATE (ep_gw)-[:CALLS {protocol: 'HTTP/REST'}]->(svc_cart)
CREATE (ep_gw)-[:CALLS {protocol: 'HTTP/REST'}]->(svc_search)
CREATE (ep_gw)-[:CALLS {protocol: 'HTTPS'}]->(svc_webhook)
CREATE (ep_admin)-[:CALLS {protocol: 'Internal'}]->(svc_admin)

// 7. Connect Microservice Call Graphs & Dependencies
CREATE (svc_cart)-[:CALLS]->(svc_rec)
CREATE (svc_auth)-[:DEPENDS_ON {scope: 'runtime'}]->(pkg_log4j)
CREATE (svc_auth)-[:DEPENDS_ON {scope: 'runtime'}]->(pkg_spring)
CREATE (svc_payment)-[:DEPENDS_ON {scope: 'runtime'}]->(pkg_jackson)
CREATE (svc_search)-[:DEPENDS_ON {scope: 'runtime'}]->(pkg_commons_text)
CREATE (svc_webhook)-[:DEPENDS_ON {scope: 'runtime'}]->(pkg_axios)
CREATE (svc_admin)-[:DEPENDS_ON {scope: 'system'}]->(pkg_openssl)
CREATE (svc_cart)-[:DEPENDS_ON {scope: 'devDependencies'}]->(pkg_lodash_dev)

// 8. Connect Data Store Access Privileges
CREATE (svc_auth)-[:READS {privilege: 'SELECT,UPDATE'}]->(ds_cust)
CREATE (pkg_log4j)-[:READS {exploitVector: 'JNDI Pivot'}]->(ds_cust)
CREATE (svc_payment)-[:READS {privilege: 'PCI-ENCRYPTED-IO'}]->(ds_vault)
CREATE (pkg_jackson)-[:READS {exploitVector: 'Polymorphic Deserialization'}]->(ds_vault)
CREATE (svc_search)-[:READS]->(ds_analytics)
CREATE (svc_cart)-[:READS]->(ds_cache)

// 9. Connect Team Ownership
CREATE (team_identity)-[:OWNS]->(svc_auth)
CREATE (team_payments)-[:OWNS]->(svc_payment)
CREATE (team_platform)-[:OWNS]->(ep_gw)
CREATE (team_secops)-[:OWNS]->(svc_admin);
