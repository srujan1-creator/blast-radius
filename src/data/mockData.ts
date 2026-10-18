import type { GraphData, SecurityFinding } from '../types';

export const INITIAL_GRAPH_DATA: GraphData = {
  nodes: [
    {
      id: 'internet',
      label: 'Public Internet',
      type: 'Internet',
      sublabel: 'Ingress 0.0.0.0/0',
      environment: 'External',
      isCrownJewel: false
    },
    {
      id: 'endpoint_api_gw',
      label: 'API Gateway',
      type: 'Endpoint',
      sublabel: '/api/v1/*',
      service: 'Envoy Ingress Proxy',
      owner: 'Platform Team',
      environment: 'production-dmz',
      isCrownJewel: false
    },
    {
      id: 'endpoint_admin',
      label: 'Internal Admin Endpoint',
      type: 'Endpoint',
      sublabel: ':8080/mgmt (VPN only)',
      service: 'Bastion Gate',
      owner: 'SecOps Team',
      environment: 'air-gapped-mgmt',
      isCrownJewel: false
    },
    {
      id: 'service_auth',
      label: 'Auth Service',
      type: 'Service',
      sublabel: 'JVM 11 · Spring Boot',
      owner: 'Identity Team',
      environment: 'production-dmz',
      isCrownJewel: false
    },
    {
      id: 'service_payment',
      label: 'Payment Service',
      type: 'Service',
      sublabel: 'Java Microservice',
      owner: 'Payments Team',
      environment: 'production-pci',
      isCrownJewel: false
    },
    {
      id: 'service_cart',
      label: 'Cart Service',
      type: 'Service',
      sublabel: 'Node.js 18',
      owner: 'Core Commerce Team',
      environment: 'production',
      isCrownJewel: false
    },
    {
      id: 'service_search',
      label: 'Search Service',
      type: 'Service',
      sublabel: 'Java Query Engine',
      owner: 'Catalog Team',
      environment: 'production',
      isCrownJewel: false
    },
    {
      id: 'service_webhook',
      label: 'Webhook Dispatcher',
      type: 'Service',
      sublabel: 'Node.js Event Pipe',
      owner: 'Integrations Team',
      environment: 'production',
      isCrownJewel: false
    },
    {
      id: 'service_recommendation',
      label: 'Recommendation ML',
      type: 'Service',
      sublabel: 'Python FastAPI',
      owner: 'ML Platform',
      environment: 'internal-mesh',
      isCrownJewel: false
    },
    {
      id: 'service_internal_admin',
      label: 'Admin Batch Runner',
      type: 'Service',
      sublabel: 'Go CLI daemon',
      owner: 'SecOps Team',
      environment: 'air-gapped-mgmt',
      isCrownJewel: false
    },
    {
      id: 'datastore_customer_db',
      label: 'Customer DB (PII)',
      type: 'DataStore',
      sublabel: 'PostgreSQL Cluster',
      dataClassification: 'PII / Highly Sensitive',
      recordsCount: '4.2M Users',
      owner: 'Data Platform',
      isCrownJewel: true
    },
    {
      id: 'datastore_payment_vault',
      label: 'Cardholder Vault',
      type: 'DataStore',
      sublabel: 'Encrypted HSM Store',
      dataClassification: 'PCI-DSS Tier 1',
      recordsCount: '850K Cards',
      owner: 'Payments Team',
      isCrownJewel: true
    },
    {
      id: 'datastore_analytics',
      label: 'Analytics Warehouse',
      type: 'DataStore',
      sublabel: 'ClickHouse OLAP',
      dataClassification: 'Aggregated Analytics',
      recordsCount: '1.2B Events',
      owner: 'Data Platform',
      isCrownJewel: false
    },
    {
      id: 'datastore_cache',
      label: 'Session Redis',
      type: 'DataStore',
      sublabel: 'Redis Cluster',
      dataClassification: 'Ephemeral Cache',
      recordsCount: '250K Keys',
      owner: 'Platform Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_log4j',
      label: 'log4j-core 2.14.1',
      type: 'Package',
      sublabel: 'org.apache.logging.log4j',
      owner: 'Identity Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_jackson',
      label: 'jackson-databind 2.13.0',
      type: 'Package',
      sublabel: 'com.fasterxml.jackson.core',
      owner: 'Payments Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_commons_text',
      label: 'commons-text 1.9',
      type: 'Package',
      sublabel: 'org.apache.commons',
      owner: 'Catalog Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_spring_beans',
      label: 'spring-beans 5.3.17',
      type: 'Package',
      sublabel: 'org.springframework',
      owner: 'Identity Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_axios',
      label: 'axios 0.21.1',
      type: 'Package',
      sublabel: 'npm package',
      owner: 'Integrations Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_lodash_auth',
      label: 'lodash 4.17.20',
      type: 'Package',
      sublabel: 'npm package (template compiler)',
      owner: 'Identity Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_http2',
      label: 'envoy-http2 1.27.0',
      type: 'Package',
      sublabel: 'binary protocol parser',
      owner: 'Platform Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_openssl',
      label: 'openssl 1.1.1k',
      type: 'Package',
      sublabel: 'system library (air-gapped)',
      owner: 'SecOps Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_lodash_dev',
      label: 'lodash 4.17.15 (dev)',
      type: 'Package',
      sublabel: 'npm devDependency (pruned)',
      owner: 'Core Commerce Team',
      isCrownJewel: false
    },
    {
      id: 'pkg_urllib3',
      label: 'urllib3 1.26.4',
      type: 'Package',
      sublabel: 'pypi package',
      owner: 'ML Platform',
      isCrownJewel: false
    },
    {
      id: 'team_identity',
      label: 'Identity Team',
      type: 'Team',
      sublabel: 'Lead: @alex.chen',
      isCrownJewel: false
    },
    {
      id: 'team_payments',
      label: 'Payments Team',
      type: 'Team',
      sublabel: 'Lead: @maria.santos',
      isCrownJewel: false
    },
    {
      id: 'team_platform',
      label: 'Platform Team',
      type: 'Team',
      sublabel: 'Lead: @david.kim',
      isCrownJewel: false
    }
  ],
  edges: [
    { id: 'e_inet_gw', source: 'internet', target: 'endpoint_api_gw', label: 'calls', protocol: 'HTTPS/443' },
    { id: 'e_gw_auth', source: 'endpoint_api_gw', target: 'service_auth', label: 'calls', protocol: 'gRPC' },
    { id: 'e_gw_payment', source: 'endpoint_api_gw', target: 'service_payment', label: 'calls', protocol: 'gRPC' },
    { id: 'e_gw_cart', source: 'endpoint_api_gw', target: 'service_cart', label: 'calls', protocol: 'HTTP/REST' },
    { id: 'e_gw_search', source: 'endpoint_api_gw', target: 'service_search', label: 'calls', protocol: 'HTTP/REST' },
    { id: 'e_gw_webhook', source: 'endpoint_api_gw', target: 'service_webhook', label: 'calls', protocol: 'HTTPS' },
    { id: 'e_gw_http2', source: 'endpoint_api_gw', target: 'pkg_http2', label: 'depends_on' },
    
    { id: 'e_auth_log4j', source: 'service_auth', target: 'pkg_log4j', label: 'depends_on' },
    { id: 'e_log4j_custdb', source: 'pkg_log4j', target: 'datastore_customer_db', label: 'reads' },
    { id: 'e_auth_custdb', source: 'service_auth', target: 'datastore_customer_db', label: 'reads' },
    { id: 'e_auth_spring', source: 'service_auth', target: 'pkg_spring_beans', label: 'depends_on' },
    { id: 'e_auth_lodash', source: 'service_auth', target: 'pkg_lodash_auth', label: 'depends_on' },
    
    { id: 'e_pay_jackson', source: 'service_payment', target: 'pkg_jackson', label: 'depends_on' },
    { id: 'e_jackson_vault', source: 'pkg_jackson', target: 'datastore_payment_vault', label: 'reads' },
    { id: 'e_pay_vault', source: 'service_payment', target: 'datastore_payment_vault', label: 'reads' },
    
    { id: 'e_search_text', source: 'service_search', target: 'pkg_commons_text', label: 'depends_on' },
    { id: 'e_text_analytics', source: 'pkg_commons_text', target: 'datastore_analytics', label: 'reads' },
    
    { id: 'e_cart_cache', source: 'service_cart', target: 'datastore_cache', label: 'reads' },
    { id: 'e_cart_rec', source: 'service_cart', target: 'service_recommendation', label: 'calls' },
    { id: 'e_cart_lodash', source: 'service_cart', target: 'pkg_lodash_dev', label: 'depends_on' },
    
    { id: 'e_rec_urllib3', source: 'service_recommendation', target: 'pkg_urllib3', label: 'depends_on' },
    { id: 'e_webhook_axios', source: 'service_webhook', target: 'pkg_axios', label: 'depends_on' },
    
    { id: 'e_admin_internal', source: 'endpoint_admin', target: 'service_internal_admin', label: 'calls' },
    { id: 'e_admin_openssl', source: 'service_internal_admin', target: 'pkg_openssl', label: 'depends_on' },
    
    { id: 'e_team_id_auth', source: 'team_identity', target: 'service_auth', label: 'owns' },
    { id: 'e_team_pay_pay', source: 'team_payments', target: 'service_payment', label: 'owns' },
    { id: 'e_team_plat_gw', source: 'team_platform', target: 'endpoint_api_gw', label: 'owns' }
  ]
};

export const SECURITY_FINDINGS: SecurityFinding[] = [
  {
    id: 'f-log4j',
    cveId: 'CVE-2021-44228',
    title: 'Log4Shell Remote Code Execution in Auth Service',
    package: 'log4j-core',
    version: '2.14.1',
    patchedVersion: '2.17.1',
    affectedService: 'Auth Service',
    serviceNodeId: 'service_auth',
    packageNodeId: 'pkg_log4j',
    targetDataStoreId: 'datastore_customer_db',
    genericCvss: 10.0,
    blastRadiusScore: 9.9,
    status: 'critical',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 3,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_log4j', 'datastore_customer_db'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_log4j', 'e_log4j_custdb'],
    pathBreadcrumb: 'Public API → Auth Service → log4j-core 2.14 → Customer DB (PII) · 3 hops · Reachable: Yes · Data: PII · Owner: Identity Team',
    summaryExplanation: 'Log4Shell RCE in Auth Service directly reachable via Public API Gateway login headers. Ingress path enables remote arbitrary code execution inside the Auth pod, granting unrestricted root read access to Customer DB containing 4.2M decrypted PII customer records.',
    metrics: {
      reachability: 100,
      exposure: 9.8,
      dataSensitivity: 10.0,
      centrality: 8.9
    },
    actions: {
      pr: {
        title: 'fix(security): bump log4j-core from 2.14.1 to 2.17.1',
        prNumber: 412,
        branch: 'blast-radius/fix-cve-2021-44228',
        targetFile: 'services/auth-service/pom.xml',
        oldLine: '    <log4j.version>2.14.1</log4j.version>',
        newLine: '    <log4j.version>2.17.1</log4j.version>',
        assignedReviewer: '@alex.chen (Identity Team)'
      },
      jira: {
        ticketKey: 'SEC-8492',
        summary: '[CRITICAL BLAST] Remediate Log4Shell RCE path to Customer PII DB',
        priority: 'P0 - Blocker',
        assignee: 'Alex Chen (Identity Team)',
        sprint: 'Emergency Hotfix'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@identity-oncall',
        headline: '🚨 CRITICAL ATTACK PATH DETECTED: Log4Shell -> Customer DB (PII)',
        summary: 'Blast Radius discovered an active 3-hop attack route from Public API to Customer DB (4.2M records). Hotfix PR #412 has been auto-generated with passing CI.'
      }
    },
    mcpSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        toolName: 'mcp::find_dependents',
        description: 'Querying graph for services importing log4j-core@2.14.1',
        status: 'completed',
        timestamp: '15:42:01.120',
        durationMs: 142,
        inputParams: { package: 'log4j-core', version: '2.14.1' },
        outputResult: { affectedServices: ['service_auth'], ecosystem: 'maven', runtimeInclusion: true },
        highlightNodeIds: ['pkg_log4j', 'service_auth'],
        highlightEdgeIds: ['e_auth_log4j']
      },
      {
        id: 'step-2',
        stepNumber: 2,
        toolName: 'mcp::find_attack_path',
        description: 'Tracing ingress connectivity from Public Internet to service_auth',
        status: 'completed',
        timestamp: '15:42:01.890',
        durationMs: 285,
        inputParams: { source: 'internet', target: 'service_auth', protocolFilters: ['HTTPS', 'gRPC'] },
        outputResult: { reachable: true, hops: 2, route: ['internet', 'endpoint_api_gw', 'service_auth'], exposureLevel: 'PUBLIC_INGRESS' },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_auth'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_auth']
      },
      {
        id: 'step-3',
        stepNumber: 3,
        toolName: 'mcp::get_accessible_datastores',
        description: 'Enumerating data access privileges and sensitive stores linked to target',
        status: 'completed',
        timestamp: '15:42:02.610',
        durationMs: 198,
        inputParams: { serviceNode: 'service_auth', depth: 2 },
        outputResult: { datastores: [{ id: 'datastore_customer_db', classification: 'PII', records: '4.2M' }] },
        highlightNodeIds: ['service_auth', 'pkg_log4j', 'datastore_customer_db'],
        highlightEdgeIds: ['e_auth_log4j', 'e_log4j_custdb']
      },
      {
        id: 'step-4',
        stepNumber: 4,
        toolName: 'mcp::get_owner',
        description: 'Resolving service ownership and escalation contact via IAM team graph',
        status: 'completed',
        timestamp: '15:42:03.220',
        durationMs: 115,
        inputParams: { service: 'service_auth' },
        outputResult: { team: 'Identity Team', lead: '@alex.chen', slackChannel: '#sec-incidents' },
        highlightNodeIds: ['service_auth', 'team_identity'],
        highlightEdgeIds: ['e_team_id_auth']
      },
      {
        id: 'step-5',
        stepNumber: 5,
        toolName: 'mcp::score_risk',
        description: 'Synthesizing reachability, data sensitivity, and network topology into Blast Radius index',
        status: 'completed',
        timestamp: '15:42:03.850',
        durationMs: 160,
        inputParams: { cve: 'CVE-2021-44228', pathHops: 3, piiExposure: true, cvssBase: 10.0 },
        outputResult: { blastRadiusScore: 9.9, verdict: 'ACTION_REQUIRED_CRITICAL', priority: 'P0' },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_log4j', 'datastore_customer_db'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_log4j', 'e_log4j_custdb']
      }
    ]
  },
  {
    id: 'f-spring4shell',
    cveId: 'CVE-2022-22965',
    title: 'Spring4Shell RCE in Spring Framework Beans',
    package: 'spring-beans',
    version: '5.3.17',
    patchedVersion: '5.3.18',
    affectedService: 'Auth Service',
    serviceNodeId: 'service_auth',
    packageNodeId: 'pkg_spring_beans',
    targetDataStoreId: 'datastore_customer_db',
    genericCvss: 9.8,
    blastRadiusScore: 9.4,
    status: 'critical',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 3,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_spring_beans'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_spring'],
    pathBreadcrumb: 'Public API → Auth Service → spring-beans 5.3.17 · 3 hops · Reachable: Yes · Exploitation: Remote ClassLoader Override',
    summaryExplanation: 'Classloader binding manipulation flaw in Spring Framework allowing unauthenticated remote code execution via HTTP query parameters routed through the Public API gateway.',
    metrics: {
      reachability: 100,
      exposure: 9.5,
      dataSensitivity: 9.0,
      centrality: 8.8
    },
    actions: {
      pr: {
        title: 'fix(security): upgrade spring-beans to 5.3.18',
        prNumber: 414,
        branch: 'blast-radius/fix-cve-2022-22965',
        targetFile: 'services/auth-service/pom.xml',
        oldLine: '    <spring.version>5.3.17</spring.version>',
        newLine: '    <spring.version>5.3.18</spring.version>',
        assignedReviewer: '@alex.chen'
      },
      jira: {
        ticketKey: 'SEC-8496',
        summary: '[CRITICAL] Patch Spring4Shell ClassLoader exploit in Auth Service',
        priority: 'P0 - Blocker',
        assignee: 'Identity Team',
        sprint: 'Emergency Hotfix'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@alex.chen',
        headline: '🚨 Spring4Shell RCE Confirmed on Auth Service',
        summary: 'Attack route verified through Public API. Automated PR #414 is ready for staging merge.'
      }
    },
    mcpSteps: [
      {
        id: 'step-s4s-1',
        stepNumber: 1,
        toolName: 'mcp::find_dependents',
        description: 'Analyzing dependency tree for spring-beans vulnerable classloaders',
        status: 'completed',
        timestamp: '15:43:10.100',
        durationMs: 130,
        inputParams: { package: 'spring-beans', version: '5.3.17' },
        outputResult: { affectedServices: ['service_auth'], runtimeInclusion: true },
        highlightNodeIds: ['pkg_spring_beans', 'service_auth'],
        highlightEdgeIds: ['e_auth_spring']
      },
      {
        id: 'step-s4s-2',
        stepNumber: 2,
        toolName: 'mcp::find_attack_path',
        description: 'Validating public parameter routing through API Gateway to Spring controller',
        status: 'completed',
        timestamp: '15:43:10.750',
        durationMs: 240,
        inputParams: { source: 'internet', target: 'service_auth' },
        outputResult: { reachable: true, route: ['internet', 'endpoint_api_gw', 'service_auth'] },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_auth'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_auth']
      },
      {
        id: 'step-s4s-3',
        stepNumber: 3,
        toolName: 'mcp::score_risk',
        description: 'Calculating blast radius based on high service centrality and public route',
        status: 'completed',
        timestamp: '15:43:11.300',
        durationMs: 140,
        inputParams: { cve: 'CVE-2022-22965', cvss: 9.8 },
        outputResult: { blastRadiusScore: 9.4, verdict: 'CRITICAL_ACTION' },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_spring_beans'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_spring']
      }
    ]
  },
  {
    id: 'f-text4shell',
    cveId: 'CVE-2022-42889',
    title: 'Text4Shell Remote Code Execution in Search Engine',
    package: 'commons-text',
    version: '1.9',
    patchedVersion: '1.10.0',
    affectedService: 'Search Service',
    serviceNodeId: 'service_search',
    packageNodeId: 'pkg_commons_text',
    targetDataStoreId: 'datastore_analytics',
    genericCvss: 9.8,
    blastRadiusScore: 9.1,
    status: 'critical',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 3,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_search', 'pkg_commons_text', 'datastore_analytics'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_search', 'e_search_text', 'e_text_analytics'],
    pathBreadcrumb: 'Public API → Search Service → commons-text 1.9 → Analytics Warehouse · 3 hops · Reachable: Yes · Owner: Catalog Team',
    summaryExplanation: 'Insecure string interpolation in Apache Commons Text search query processor. Attacker can supply `${script:javascript:...}` in search parameters to execute commands on the search node and siphon analytics data.',
    metrics: {
      reachability: 100,
      exposure: 9.2,
      dataSensitivity: 8.4,
      centrality: 7.9
    },
    actions: {
      pr: {
        title: 'fix(security): update commons-text to 1.10.0',
        prNumber: 413,
        branch: 'blast-radius/fix-cve-2022-42889',
        targetFile: 'services/search-service/pom.xml',
        oldLine: '    <commons-text.version>1.9</commons-text.version>',
        newLine: '    <commons-text.version>1.10.0</commons-text.version>',
        assignedReviewer: '@catalog-lead'
      },
      jira: {
        ticketKey: 'SEC-8495',
        summary: '[CRITICAL] Remediate Text4Shell interpolation exploit in Search API',
        priority: 'P0 - Blocker',
        assignee: 'Catalog Team',
        sprint: 'Emergency Hotfix'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@catalog-oncall',
        headline: '🚨 Text4Shell String Interpolation Vulnerability on /api/v1/search',
        summary: 'Direct ingress path verified. PR #413 opened to bump commons-text to 1.10.0.'
      }
    },
    mcpSteps: [
      {
        id: 'step-t4s-1',
        stepNumber: 1,
        toolName: 'mcp::find_dependents',
        description: 'Searching for commons-text dependency in runtime catalog services',
        status: 'completed',
        timestamp: '15:44:02.100',
        durationMs: 110,
        inputParams: { package: 'commons-text', version: '1.9' },
        outputResult: { affectedServices: ['service_search'] },
        highlightNodeIds: ['pkg_commons_text', 'service_search'],
        highlightEdgeIds: ['e_search_text']
      },
      {
        id: 'step-t4s-2',
        stepNumber: 2,
        toolName: 'mcp::find_attack_path',
        description: 'Tracing public internet ingress route to search query endpoint',
        status: 'completed',
        timestamp: '15:44:02.720',
        durationMs: 230,
        inputParams: { source: 'internet', target: 'service_search' },
        outputResult: { reachable: true, hops: 2, route: ['internet', 'endpoint_api_gw', 'service_search'] },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_search'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_search']
      },
      {
        id: 'step-t4s-3',
        stepNumber: 3,
        toolName: 'mcp::score_risk',
        description: 'Evaluating reachability, query parser exposure, and analytics store access',
        status: 'completed',
        timestamp: '15:44:03.310',
        durationMs: 150,
        inputParams: { cve: 'CVE-2022-42889', cvss: 9.8 },
        outputResult: { blastRadiusScore: 9.1, verdict: 'CRITICAL_ACTION' },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_search', 'pkg_commons_text', 'datastore_analytics'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_search', 'e_search_text', 'e_text_analytics']
      }
    ]
  },
  {
    id: 'f-jackson',
    cveId: 'CVE-2020-36518',
    title: 'Jackson-databind Deserialization Flaw in Payment Service',
    package: 'jackson-databind',
    version: '2.13.0',
    patchedVersion: '2.13.2.1',
    affectedService: 'Payment Service',
    serviceNodeId: 'service_payment',
    packageNodeId: 'pkg_jackson',
    targetDataStoreId: 'datastore_payment_vault',
    genericCvss: 8.5,
    blastRadiusScore: 8.8,
    status: 'high',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 3,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_payment', 'pkg_jackson', 'datastore_payment_vault'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_payment', 'e_pay_jackson', 'e_jackson_vault'],
    pathBreadcrumb: 'Public API → Payment Service → jackson-databind 2.13 → Cardholder Vault · 3 hops · Reachable: Yes · Data: PCI Vault · Owner: Payments Team',
    summaryExplanation: 'Polymorphic deserialization flaw in Payment Service payload handler. Attackers can trigger denial of service or arbitrary gadget invocation targeting the PCI cardholder vault.',
    metrics: {
      reachability: 100,
      exposure: 8.4,
      dataSensitivity: 9.5,
      centrality: 7.6
    },
    actions: {
      pr: {
        title: 'fix(security): update jackson-databind to 2.13.2.1',
        prNumber: 415,
        branch: 'blast-radius/fix-cve-2020-36518',
        targetFile: 'services/payment-service/pom.xml',
        oldLine: '    <jackson.version>2.13.0</jackson.version>',
        newLine: '    <jackson.version>2.13.2.1</jackson.version>',
        assignedReviewer: '@maria.santos'
      },
      jira: {
        ticketKey: 'SEC-8498',
        summary: '[HIGH] Remediate Jackson deserialization bug in Payment Gateway',
        priority: 'P1 - High',
        assignee: 'Payments Team',
        sprint: 'Sprint 42'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@payments-oncall',
        headline: '⚠️ High Risk Path: Payment Service -> Cardholder Vault',
        summary: 'Jackson deserialization vulnerability path validated to PCI data boundary.'
      }
    },
    mcpSteps: [
      {
        id: 'step-jck-1',
        stepNumber: 1,
        toolName: 'mcp::find_dependents',
        description: 'Searching payment services importing vulnerable jackson-databind',
        status: 'completed',
        timestamp: '15:45:10.200',
        durationMs: 120,
        inputParams: { package: 'jackson-databind', version: '2.13.0' },
        outputResult: { affectedServices: ['service_payment'] },
        highlightNodeIds: ['pkg_jackson', 'service_payment'],
        highlightEdgeIds: ['e_pay_jackson']
      },
      {
        id: 'step-jck-2',
        stepNumber: 2,
        toolName: 'mcp::find_attack_path',
        description: 'Checking ingress connectivity from API gateway to checkout endpoint',
        status: 'completed',
        timestamp: '15:45:10.810',
        durationMs: 250,
        inputParams: { source: 'internet', target: 'service_payment' },
        outputResult: { reachable: true, hops: 2 },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_payment'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_payment']
      },
      {
        id: 'step-jck-3',
        stepNumber: 3,
        toolName: 'mcp::score_risk',
        description: 'Scoring PCI data boundary impact vs generic CVSS score',
        status: 'completed',
        timestamp: '15:45:11.450',
        durationMs: 160,
        inputParams: { cve: 'CVE-2020-36518', cvss: 8.5, pciScope: true },
        outputResult: { blastRadiusScore: 8.8, elevatedDueToPci: true },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_payment', 'pkg_jackson', 'datastore_payment_vault'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_payment', 'e_pay_jackson', 'e_jackson_vault']
      }
    ]
  },
  {
    id: 'f-axios',
    cveId: 'CVE-2021-3749',
    title: 'Axios SSRF in Webhook Event Dispatcher',
    package: 'axios',
    version: '0.21.1',
    patchedVersion: '0.21.2',
    affectedService: 'Webhook Dispatcher',
    serviceNodeId: 'service_webhook',
    packageNodeId: 'pkg_axios',
    genericCvss: 7.5,
    blastRadiusScore: 8.2,
    status: 'high',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 2,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_webhook', 'pkg_axios'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_webhook', 'e_webhook_axios'],
    pathBreadcrumb: 'Public API → Webhook Dispatcher → axios 0.21.1 · 2 hops · Reachable: Yes · SSRF Risk: Cloud Metadata',
    summaryExplanation: 'Insecure URL handling permits internal network SSRF when users register custom outgoing webhook callback targets. Threat actor can query internal AWS Instance Metadata Service (`169.254.169.254`).',
    metrics: {
      reachability: 100,
      exposure: 8.8,
      dataSensitivity: 7.9,
      centrality: 7.2
    },
    actions: {
      pr: {
        title: 'fix(security): bump axios to 0.21.2',
        prNumber: 416,
        branch: 'blast-radius/fix-cve-2021-3749',
        targetFile: 'services/webhook-service/package.json',
        oldLine: '    "axios": "^0.21.1"',
        newLine: '    "axios": "^0.21.2"',
        assignedReviewer: '@integrations-lead'
      },
      jira: {
        ticketKey: 'SEC-8501',
        summary: '[HIGH] Fix SSRF in outgoing webhook registration service',
        priority: 'P1 - High',
        assignee: 'Integrations Team',
        sprint: 'Sprint 42'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@integrations-oncall',
        headline: '⚠️ SSRF Vector in Webhook Dispatcher',
        summary: 'Publicly reachable webhook service vulnerable to internal SSRF. PR #416 opened.'
      }
    },
    mcpSteps: [
      {
        id: 'step-ax-1',
        stepNumber: 1,
        toolName: 'mcp::find_attack_path',
        description: 'Analyzing ingress route to webhook registration endpoint',
        status: 'completed',
        timestamp: '15:46:00.150',
        durationMs: 180,
        inputParams: { source: 'internet', target: 'service_webhook' },
        outputResult: { reachable: true, route: ['internet', 'endpoint_api_gw', 'service_webhook'] },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_webhook', 'pkg_axios'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_webhook', 'e_webhook_axios']
      },
      {
        id: 'step-ax-2',
        stepNumber: 2,
        toolName: 'mcp::score_risk',
        description: 'Assessing IMDS metadata SSRF exposure',
        status: 'completed',
        timestamp: '15:46:00.600',
        durationMs: 120,
        inputParams: { cve: 'CVE-2021-3749', ssrfRisk: 'HIGH' },
        outputResult: { blastRadiusScore: 8.2 },
        highlightNodeIds: ['service_webhook', 'pkg_axios'],
        highlightEdgeIds: ['e_webhook_axios']
      }
    ]
  },
  {
    id: 'f-http2',
    cveId: 'CVE-2023-44487',
    title: 'HTTP/2 Rapid Reset Denial of Service in Edge Gateway',
    package: 'envoy-http2',
    version: '1.27.0',
    patchedVersion: '1.27.2',
    affectedService: 'API Gateway',
    serviceNodeId: 'endpoint_api_gw',
    packageNodeId: 'pkg_http2',
    genericCvss: 7.5,
    blastRadiusScore: 7.9,
    status: 'high',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 1,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'pkg_http2'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_http2'],
    pathBreadcrumb: 'Public Internet → API Gateway Envoy Proxy · 1 hop · Direct Ingress Edge DoS',
    summaryExplanation: 'Rapid Reset stream cancellation flood enables remote unauthenticated attackers to exhaust gateway CPU resources, creating a systemic cascading outage across all downstream services.',
    metrics: {
      reachability: 100,
      exposure: 9.9,
      dataSensitivity: 5.0,
      centrality: 9.5
    },
    actions: {
      pr: {
        title: 'fix(infra): update envoy image to v1.27.2 with stream limit patch',
        prNumber: 417,
        branch: 'blast-radius/fix-cve-2023-44487',
        targetFile: 'k8s/ingress/envoy-values.yaml',
        oldLine: '  tag: v1.27.0',
        newLine: '  tag: v1.27.2',
        assignedReviewer: '@david.kim'
      },
      jira: {
        ticketKey: 'SEC-8504',
        summary: '[HIGH] Deploy HTTP/2 Rapid Reset mitigation to Envoy edge proxies',
        priority: 'P1 - High',
        assignee: 'David Kim (Platform Team)',
        sprint: 'Emergency Hotfix'
      },
      slack: {
        channel: '#sec-incidents',
        targetUser: '@platform-oncall',
        headline: '⚠️ Edge Gateway HTTP/2 Rapid Reset Flaw',
        summary: 'Direct exposure to internet flood. Upgraded image deployed to staging cluster.'
      }
    },
    mcpSteps: [
      {
        id: 'step-h2-1',
        stepNumber: 1,
        toolName: 'mcp::find_attack_path',
        description: 'Evaluating edge exposure for HTTP/2 protocol ingress',
        status: 'completed',
        timestamp: '15:47:12.100',
        durationMs: 140,
        inputParams: { source: 'internet', target: 'endpoint_api_gw' },
        outputResult: { directEdgeExposure: true, publicPorts: [443, 80] },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'pkg_http2'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_http2']
      },
      {
        id: 'step-h2-2',
        stepNumber: 2,
        toolName: 'mcp::score_risk',
        description: 'Centrality calculation: Gateway outage impacts 100% of microservice traffic',
        status: 'completed',
        timestamp: '15:47:12.500',
        durationMs: 130,
        inputParams: { cve: 'CVE-2023-44487', blastCentrality: 'SYSTEMIC' },
        outputResult: { blastRadiusScore: 7.9 },
        highlightNodeIds: ['endpoint_api_gw', 'pkg_http2'],
        highlightEdgeIds: ['e_gw_http2']
      }
    ]
  },
  {
    id: 'f-lodash-auth',
    cveId: 'CVE-2021-23337',
    title: 'Lodash Command Injection in Auth Service Template Engine',
    package: 'lodash',
    version: '4.17.20',
    patchedVersion: '4.17.21',
    affectedService: 'Auth Service',
    serviceNodeId: 'service_auth',
    packageNodeId: 'pkg_lodash_auth',
    genericCvss: 7.3,
    blastRadiusScore: 7.8,
    status: 'high',
    reachabilityStatus: 'Reachable from Internet',
    hopsCount: 3,
    attackPathNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_lodash_auth'],
    attackPathEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_lodash'],
    pathBreadcrumb: 'Public API → Auth Service → lodash 4.17.20 · 3 hops · Template injection',
    summaryExplanation: 'Vulnerable `template` function in lodash allows command injection if unsanitized user-supplied templates are compiled during auth registration emails.',
    metrics: {
      reachability: 100,
      exposure: 7.8,
      dataSensitivity: 8.0,
      centrality: 7.5
    },
    actions: {
      pr: {
        title: 'fix(security): bump lodash to 4.17.21 in auth service',
        prNumber: 418,
        branch: 'blast-radius/fix-cve-2021-23337',
        targetFile: 'services/auth-service/package.json',
        oldLine: '    "lodash": "4.17.20"',
        newLine: '    "lodash": "4.17.21"',
        assignedReviewer: '@alex.chen'
      },
      jira: {
        ticketKey: 'SEC-8509',
        summary: '[HIGH] Update lodash in Auth Service email notification generator',
        priority: 'P1 - High',
        assignee: 'Identity Team',
        sprint: 'Sprint 42'
      }
    },
    mcpSteps: [
      {
        id: 'step-la-1',
        stepNumber: 1,
        toolName: 'mcp::find_attack_path',
        description: 'Validating registration input route to lodash template compiler',
        status: 'completed',
        timestamp: '15:48:02.100',
        durationMs: 140,
        inputParams: { source: 'internet', target: 'service_auth' },
        outputResult: { reachable: true },
        highlightNodeIds: ['internet', 'endpoint_api_gw', 'service_auth', 'pkg_lodash_auth'],
        highlightEdgeIds: ['e_inet_gw', 'e_gw_auth', 'e_auth_lodash']
      }
    ]
  },
  {
    id: 'f-openssl-suppressed',
    cveId: 'CVE-2021-22965',
    title: 'OpenSSL Buffer Overflow in Admin Batch Daemon',
    package: 'openssl',
    version: '1.1.1k',
    patchedVersion: '1.1.1l',
    affectedService: 'Admin Batch Runner',
    serviceNodeId: 'service_internal_admin',
    packageNodeId: 'pkg_openssl',
    genericCvss: 9.8,
    blastRadiusScore: 1.1,
    status: 'suppressed',
    reachabilityStatus: 'Air-gapped / Isolated',
    hopsCount: 0,
    attackPathNodeIds: ['service_internal_admin', 'pkg_openssl'],
    attackPathEdgeIds: ['e_admin_openssl'],
    pathBreadcrumb: 'Internal Admin Batch Runner (Air-gapped) · 0 Ingress Hops · NO INTERNET ROUTE · Suppressed',
    summaryExplanation: 'Traditional scanner scored 9.8 Critical! However, graph analysis proves Admin Batch Runner is isolated in an air-gapped subnet with egress disabled and no connected customer datastores. Attack route from Internet is impossible.',
    suppressionReason: 'ZERO_INGRESS_REACHABILITY: Service is deployed exclusively in an air-gapped management subnet with no routes from public ingress, no live socket listeners, and no PII datastore permissions.',
    metrics: {
      reachability: 0,
      exposure: 0.5,
      dataSensitivity: 1.0,
      centrality: 1.2
    },
    actions: {},
    mcpSteps: [
      {
        id: 'step-ossl-1',
        stepNumber: 1,
        toolName: 'mcp::find_dependents',
        description: 'Identifying services embedding openssl 1.1.1k',
        status: 'completed',
        timestamp: '15:49:10.100',
        durationMs: 120,
        inputParams: { package: 'openssl', version: '1.1.1k' },
        outputResult: { affectedServices: ['service_internal_admin'] },
        highlightNodeIds: ['pkg_openssl', 'service_internal_admin'],
        highlightEdgeIds: ['e_admin_openssl']
      },
      {
        id: 'step-ossl-2',
        stepNumber: 2,
        toolName: 'mcp::find_attack_path',
        description: 'Attempting graph BFS traversal from Internet to service_internal_admin',
        status: 'completed',
        timestamp: '15:49:10.650',
        durationMs: 310,
        inputParams: { source: 'internet', target: 'service_internal_admin' },
        outputResult: { reachable: false, error: 'NO_VALID_ROUTE_FROM_INGRESS', firewallBoundary: 'AIR_GAPPED_VPC' },
        highlightNodeIds: ['service_internal_admin'],
        highlightEdgeIds: []
      },
      {
        id: 'step-ossl-3',
        stepNumber: 3,
        toolName: 'mcp::score_risk',
        description: 'Calculating graph blast radius: Reachability 0%, Blast Score 1.1 (Auto-Suppressed)',
        status: 'completed',
        timestamp: '15:49:11.200',
        durationMs: 95,
        inputParams: { cve: 'CVE-2021-22965', cvssBase: 9.8, reachable: false },
        outputResult: { blastRadiusScore: 1.1, verdict: 'AUTO_SUPPRESS_NOISE', auditLogged: true },
        highlightNodeIds: ['pkg_openssl'],
        highlightEdgeIds: []
      }
    ]
  },
  {
    id: 'f-lodash-dev-suppressed',
    cveId: 'CVE-2020-8203',
    title: 'Lodash Prototype Pollution in Cart Service (Dev Only)',
    package: 'lodash',
    version: '4.17.15',
    patchedVersion: '4.17.19',
    affectedService: 'Cart Service',
    serviceNodeId: 'service_cart',
    packageNodeId: 'pkg_lodash_dev',
    genericCvss: 7.4,
    blastRadiusScore: 0.5,
    status: 'suppressed',
    reachabilityStatus: 'DevDependency / Pruned',
    hopsCount: 0,
    attackPathNodeIds: ['service_cart', 'pkg_lodash_dev'],
    attackPathEdgeIds: ['e_cart_lodash'],
    pathBreadcrumb: 'Cart Service (Build-time only devDependency) · Pruned in Production Container · Suppressed',
    summaryExplanation: 'Vulnerable lodash version found only inside devDependencies for local unit tests. The production Docker multi-stage build strips all devDependencies. Zero presence at runtime.',
    suppressionReason: 'PRUNED_DEV_DEPENDENCY: Package is restricted to package.json devDependencies and excluded by Docker production image builder.',
    metrics: {
      reachability: 0,
      exposure: 0.2,
      dataSensitivity: 0.0,
      centrality: 0.8
    },
    actions: {},
    mcpSteps: [
      {
        id: 'step-ldev-1',
        stepNumber: 1,
        toolName: 'mcp::verify_runtime_inclusion',
        description: 'Checking SBOM vs running container filesystem sha256',
        status: 'completed',
        timestamp: '15:50:01.100',
        durationMs: 140,
        inputParams: { service: 'service_cart', package: 'lodash@4.17.15' },
        outputResult: { inRuntimeImage: false, strippedAtStage: 'npm prune --production' },
        highlightNodeIds: ['pkg_lodash_dev'],
        highlightEdgeIds: []
      }
    ]
  },
  {
    id: 'f-follow-redirects',
    cveId: 'CVE-2023-26159',
    title: 'Follow-redirects Open Redirect in Admin Script',
    package: 'follow-redirects',
    version: '1.15.0',
    patchedVersion: '1.15.4',
    affectedService: 'Admin Batch Runner',
    serviceNodeId: 'service_internal_admin',
    packageNodeId: 'pkg_openssl',
    genericCvss: 9.8,
    blastRadiusScore: 1.4,
    status: 'suppressed',
    reachabilityStatus: 'Air-gapped / Isolated',
    hopsCount: 0,
    attackPathNodeIds: ['service_internal_admin'],
    attackPathEdgeIds: [],
    pathBreadcrumb: 'Admin Batch Runner · Non-routable internal synchronization script · Suppressed',
    summaryExplanation: 'Admin backup script executed as a one-shot batch job. It cannot be coerced with attacker URLs. Graph confirms no public listener.',
    suppressionReason: 'ISOLATED_BATCH_EXECUTION: One-shot CLI utility running on bastion host with no external inputs.',
    metrics: {
      reachability: 0,
      exposure: 0.8,
      dataSensitivity: 0.5,
      centrality: 1.1
    },
    actions: {},
    mcpSteps: []
  },
  {
    id: 'f-urllib3',
    cveId: 'CVE-2023-32681',
    title: 'Urllib3 Cookie Disclosure in Recommendation Engine',
    package: 'urllib3',
    version: '1.26.4',
    patchedVersion: '1.26.17',
    affectedService: 'Recommendation ML',
    serviceNodeId: 'service_recommendation',
    packageNodeId: 'pkg_urllib3',
    genericCvss: 6.5,
    blastRadiusScore: 1.0,
    status: 'suppressed',
    reachabilityStatus: 'Internal Service Only',
    hopsCount: 0,
    attackPathNodeIds: ['service_recommendation', 'pkg_urllib3'],
    attackPathEdgeIds: ['e_rec_urllib3'],
    pathBreadcrumb: 'Recommendation ML Service · Internal Mesh Only · Outbound HTTP Disabled · Suppressed',
    summaryExplanation: 'Internal ML model inference pod without outbound egress access. Service mesh egress firewall blocks cross-domain redirects.',
    suppressionReason: 'EGRESS_LOCKED_ENCLAVE: Outbound HTTP disabled by Istio service mesh policy; cross-domain redirection impossible.',
    metrics: {
      reachability: 0,
      exposure: 0.5,
      dataSensitivity: 1.5,
      centrality: 1.8
    },
    actions: {},
    mcpSteps: []
  },
  {
    id: 'f-semver',
    cveId: 'CVE-2022-25883',
    title: 'Semver ReDoS in Build Runner',
    package: 'semver',
    version: '7.3.5',
    patchedVersion: '7.5.2',
    affectedService: 'CI/CD Pipeline',
    serviceNodeId: 'service_cart',
    packageNodeId: 'pkg_lodash_dev',
    genericCvss: 7.5,
    blastRadiusScore: 0.1,
    status: 'suppressed',
    reachabilityStatus: 'DevDependency / Pruned',
    hopsCount: 0,
    attackPathNodeIds: [],
    attackPathEdgeIds: [],
    pathBreadcrumb: 'CI/CD Pipeline · Sandboxed GitHub Actions Runner · Suppressed',
    summaryExplanation: 'ReDoS pattern in semver parsing only triggered during build-time package validation. No production process evaluates user-supplied semver strings.',
    suppressionReason: 'BUILD_TIME_ONLY: Ephemeral GitHub runner dependency, zero runtime footprint.',
    metrics: {
      reachability: 0,
      exposure: 0.1,
      dataSensitivity: 0.0,
      centrality: 0.1
    },
    actions: {},
    mcpSteps: []
  },
  {
    id: 'f-jquery',
    cveId: 'CVE-2022-31160',
    title: 'jQuery-UI XSS in Static Documentation',
    package: 'jquery-ui',
    version: '1.12.1',
    patchedVersion: '1.13.2',
    affectedService: 'Internal Docs',
    serviceNodeId: 'endpoint_admin',
    packageNodeId: 'pkg_openssl',
    genericCvss: 6.1,
    blastRadiusScore: 0.2,
    status: 'suppressed',
    reachabilityStatus: 'Internal Service Only',
    hopsCount: 0,
    attackPathNodeIds: [],
    attackPathEdgeIds: [],
    pathBreadcrumb: 'Internal Developer Documentation · Static HTML · Suppressed',
    summaryExplanation: 'Static HTML documentation bundle hosted on internal localhost loopback. Contains no user cookies, auth tokens, or private endpoints.',
    suppressionReason: 'ZERO_IMPACT_STATIC_DOCS: No session tokens or sensitive API context exist on the documentation port.',
    metrics: {
      reachability: 0,
      exposure: 0.3,
      dataSensitivity: 0.0,
      centrality: 0.2
    },
    actions: {},
    mcpSteps: []
  },
  {
    id: 'f-cni',
    cveId: 'CVE-2023-2253',
    title: 'ContainerNetworking CNI Memory Leak',
    package: 'containernetworking/cni',
    version: '1.0.1',
    patchedVersion: '1.0.2',
    affectedService: 'Kubernetes Node Daemon',
    serviceNodeId: 'endpoint_api_gw',
    packageNodeId: 'pkg_http2',
    genericCvss: 7.5,
    blastRadiusScore: 1.5,
    status: 'suppressed',
    reachabilityStatus: 'Internal Service Only',
    hopsCount: 0,
    attackPathNodeIds: [],
    attackPathEdgeIds: [],
    pathBreadcrumb: 'Kubernetes Host Kernel · Syscall Blocked by Seccomp · Suppressed',
    summaryExplanation: 'Container runtime plugin issue already neutralized by default Kubelet seccomp profile and kernel-level network namespace hardening.',
    suppressionReason: 'COMPENSATING_CONTROL_ACTIVE: Node security daemon has eBPF filtering and seccomp profile preventing socket leakage.',
    metrics: {
      reachability: 10,
      exposure: 1.2,
      dataSensitivity: 1.0,
      centrality: 2.0
    },
    actions: {},
    mcpSteps: []
  },
  {
    id: 'f-netty',
    cveId: 'CVE-2023-38606',
    title: 'Netty HTTP Codec Header Disclosure',
    package: 'netty-codec-http',
    version: '4.1.60',
    patchedVersion: '4.1.94',
    affectedService: 'API Gateway Proxy',
    serviceNodeId: 'endpoint_api_gw',
    packageNodeId: 'pkg_http2',
    genericCvss: 6.5,
    blastRadiusScore: 1.8,
    status: 'suppressed',
    reachabilityStatus: 'Internal Service Only',
    hopsCount: 0,
    attackPathNodeIds: [],
    attackPathEdgeIds: [],
    pathBreadcrumb: 'API Gateway Proxy · Neutralized by Upstream Cloudflare WAF · Suppressed',
    summaryExplanation: 'Edge WAF layer normalizes and strips malformed HTTP chunk trailers before requests reach the internal Netty pipeline.',
    suppressionReason: 'WAF_NORMALIZATION_ACTIVE: Upstream WAF strips chunked transfer variations, preventing the vulnerability trigger condition.',
    metrics: {
      reachability: 20,
      exposure: 1.5,
      dataSensitivity: 2.0,
      centrality: 2.5
    },
    actions: {},
    mcpSteps: []
  }
];

export const MOCK_STATS = {
  alertsReceived: 2148,
  noiseSuppressedPercentage: 94.2,
  noiseSuppressedCount: 2024,
  criticalAttackPaths: 3,
  actionsTaken: 12
};
