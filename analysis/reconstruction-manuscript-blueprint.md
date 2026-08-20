# MANUSCRIPT RECONSTRUCTION BLUEPRINT

This blueprint defines the final structure for the comprehensive LaTeX monograph, mapping every project component to its appropriate chapter, section, figures, tables, math, source code, and evidence class.

## I. FRONT MATTER
- Title Page
- Abstract
- Table of Contents
- List of Figures / Tables
- Abbreviations

## II. SYSTEM OVERVIEW & ARCHITECTURE

### 1. Executive Overview
- **Component**: Project Mission & Context
- **Source**: `chats/` history, `PROJECT_STATUS.md`
- **Evidence**: Class E (Contextual)

### 2. Complete Project Ecosystem
- **Component**: Real vs Simulated Demarcation
- **Table**: TAB-EVAL-02 (Real vs Simulated)
- **Source**: `chats/CONCLUSION.md`
- **Evidence**: Class A (Implementation Verified)

### 3. Overall System Architecture
- **Component**: Core subsystems and topology
- **Figure**: FIG-ARCH-01 (System Context)
- **Source**: Architecture docs
- **Evidence**: Class A

### 4. Deployment and Container Infrastructure
- **Component**: Docker Compose Topology (14 containers)
- **Figure**: FIG-ARCH-02 (Container Deployment)
- **Table**: TAB-INF-01 (Service Inventory)
- **Source**: `docker-compose.yml`, `docker-compose.prod.yml`
- **Evidence**: Class A

### 5. Network and Trust Architecture
- **Component**: Docker Networks, Tor Gateway, RBAC
- **Figure**: FIG-ARCH-03 (Network Isolation)
- **Table**: TAB-INF-02 (Trust Zones)
- **Source**: `tor-gateway/nginx.conf`, `api/server.ts`
- **Evidence**: Class A

## III. DATA ECOSYSTEM & PIPELINE

### 6. Data Ecosystem and Synthetic Platforms
- **Component**: 5 Heterogeneous Sites + Synthetic Generator (12 Phases)
- **Figure**: FIG-DATA-01 (Synthetic Topology)
- **Tables**: TAB-ECO-01 (Platforms), TAB-ECO-02 (Generator Phases)
- **Source**: `sites/*`, `generator/engine.py`
- **Evidence**: Class A (Sites) / Class D (Scale benchmarks)

### 7. Data Models and Canonicalization
- **Component**: Parsing, RFC 8785 Canonicalization
- **Figure**: FIG-DATA-02 (Canonicalization Pipeline)
- **Table**: TAB-ECO-04 (Canonical Mapping)
- **Source**: `normalizer/parsers.ts`, `contracts/canonical-record.schema.json`
- **Evidence**: Class A

### 8. Database Architecture and Persistence
- **Component**: Prisma Schema, MinIO
- **Figure**: FIG-DATA-03 (ER Model)
- **Table**: TAB-ECO-03 (Entity Dictionary)
- **Source**: `schema.prisma`, `collector/adapters.ts`
- **Evidence**: Class A

### 9. Eventing, Outbox, and Processing Pipeline
- **Component**: Redis Streams, Transactional Outbox
- **Figure**: FIG-DATA-04 (Outbox Flow)
- **Source**: `pipeline/processor.ts`
- **Evidence**: Class A

## IV. INTELLIGENCE ENGINE

### 10. Entity Resolution Methodology
- **Component**: Blocking Keys, Composite Scoring
- **Figure**: FIG-ALGO-01 (Resolution Pipeline)
- **Table**: TAB-ALG-01 (Feature Weights)
- **Equation**: $S = \sum w_i S_i$ (Composite Score)
- **Source**: `resolver/entity_resolver.ts`
- **Evidence**: Class A

### 11. Graph Projection and Network Analysis
- **Component**: PostgreSQL Recursive CTEs, In-Memory BFS
- **Figure**: FIG-ALGO-03 (Graph Projection)
- **Table**: TAB-ALG-02 (Node/Edge Types)
- **Equation**: Bounded BFS limits ($d \le 4, N \le 500$)
- **Source**: `graph/projector.ts`, `schema.prisma`
- **Evidence**: Class A

### 12. RAG and LLM Safety
- **Component**: Ollama Integration, 4-Rule Sanitization
- **Figure**: FIG-ALGO-04 (RAG Flow)
- **Table**: TAB-ALG-03 (Sanitization Rules)
- **Source**: `ai/rag.ts`
- **Evidence**: Class A

## V. WOLVERINEDB CRYPTOGRAPHIC LAYER

### 13. WolverineDB Architecture
- **Component**: 13 Milestones, Specifications
- **Table**: TAB-WDB-02 (Milestone Evolution)
- **Source**: `wolverine-db/specs/`, `chats/CONCLUSION.md`
- **Evidence**: Class C (Design/Historical)

### 14. WolverineDB Cryptography
- **Component**: SHA-256 Chains, RFC 6962 Merkle Trees
- **Figure**: FIG-WDB-01 (State Transition)
- **Table**: TAB-WDB-01 (Cryptographic Primitives)
- **Equation**: $H_{i} = SHA256(prefix || data || H_{i-1})$
- **Source**: `wolverine-db/src/crypto/*`
- **Evidence**: Class A

### 15. WolverineDB Consensus / Trust Network
- **Component**: BFT 4-of-5 Quorum
- **Figure**: FIG-WDB-02 (BFT Flow)
- **Source**: `trust_network/consensus.ts`
- **Evidence**: Class A

### 16. WolverineDB Security and Recovery
- **Component**: Crash-safe Journals, Audit Remediation
- **Figure**: FIG-WDB-03 (Offline Trust Receipt)
- **Table**: TAB-WDB-03 (Audit Remediation)
- **Source**: `survivability/`, `chats/CONCLUSION.md`
- **Evidence**: Class A

## VI. FRONTEND & API

### 17. API Architecture
- **Component**: Express Routes, RBAC
- **Table**: TAB-INF-03 (API Specs)
- **Source**: `api/server.ts`, OpenAPI spec
- **Evidence**: Class A

### 18. Vzeya Deep Dive
- **Component**: Next.js App Router, Three.js/WebGL Shaders, 4-Phase Narrative
- **Figures**: FIG-UI-01 (Narrative State), FIG-UI-02 (3D Terminals)
- **Tables**: TAB-UI-01 (Routes), TAB-UI-02 (Scroll Phases)
- **Source**: `Vzeya/src/app/*`, `Vzeya/src/components/narrative/*`
- **Evidence**: Class A

### 19. Analyst UI Deep Dive
- **Component**: Dashboard components, static executionData mocking
- **Figure**: FIG-UI-03 (Dashboard Structure)
- **Source**: `Vzeya/src/components/shared/DashboardLayout.tsx`
- **Evidence**: Class A

## VII. EVALUATION & CONCLUSION

### 20. Evaluation Methodology
- **Component**: Evidence Classification, Air-gapped Truth Vault
- **Figure**: FIG-EVAL-01 (Evidence Pyramid)
- **Table**: TAB-EVAL-01 (Evaluation Scenarios)
- **Source**: `wolverine/tests/*`, `evaluator/*`
- **Evidence**: Class D (Static metrics)

### 21. Engineering Decisions and Evolution
- **Component**: History of architectural choices
- **Source**: `chats/*`
- **Evidence**: Class C

### 22. Limitations and Validity Threats
- **Component**: Single-host constraints, simulated HSMs
- **Source**: System Model analysis
- **Evidence**: Class B (Analytical)

### 23. Conclusion
- **Component**: Final summary

## VIII. APPENDICES
- A. Synthetic Generator Lexicons
- B. Prisma Data Dictionaries
- C. WolverineDB Specification Matrix
- D. Source Code Excerpts (Entity Resolver, BFT Consensus, RAG Sanitization, WebGL Shader)
