# FINAL FIGURE MAP

This document maps all required diagrams and figures for the reconstructed manuscript, ensuring complete coverage of the actual Wolverine SIH architecture.

## 1. Architecture & Deployment

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-ARCH-01 | System Context & Boundary | TikZ | System Model Level 1 | 6. Overall Architecture |
| FIG-ARCH-02 | Container Deployment Topology | Mermaid | docker-compose.yml (14 containers) | 7. Deployment & Infrastructure |
| FIG-ARCH-03 | Network Isolation & Trust Zones | TikZ | dmz, internal, truth networks | 8. Network & Trust Architecture |
| FIG-ARCH-04 | Service Dependency Graph | Mermaid | Inter-container communication paths | 6. Overall Architecture |

## 2. Data & Ingestion

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-DATA-01 | Synthetic Ecosystem Topology | TikZ | 5 Source Sites (Atlas, Briar, Cinder, Drift, Ember) | 9. Data Ecosystem |
| FIG-DATA-02 | Canonicalization Pipeline | Mermaid | collector → MinIO → parser → Prisma | 10. Data Models |
| FIG-DATA-03 | Database Entity-Relationship | TikZ/ER | schema.prisma (10 models) | 11. Database Architecture |
| FIG-DATA-04 | Event Outbox Flow | Mermaid | Pipeline Processor → Redis Streams | 12. Processing Pipeline |

## 3. Algorithms & Graph

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-ALGO-01 | Entity Resolution Pipeline | Mermaid | entity_resolver.ts blocking & scoring | 13. Entity Resolution |
| FIG-ALGO-02 | Composite Score Distribution | PGFPlots | Thresholds (<0.70, 0.70-0.919, ≥0.92) | 14. Mathematical Model |
| FIG-ALGO-03 | Graph Projection Process | Mermaid | GraphProjector (PostgreSQL CTE vs Memory BFS) | 15. Graph Projection |
| FIG-ALGO-04 | RAG Investigation Flow | Mermaid | rag.ts (Sanitization → Context → Ollama) | 16. RAG & LLM |

## 4. WolverineDB

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-WDB-01 | Cryptographic State Transition | TikZ | hash.ts, merkle.ts (RFC 6962) | 18. WDB Cryptography |
| FIG-WDB-02 | 4-of-5 BFT Consensus Flow | Mermaid | consensus.ts (TrustConsensusEngine) | 19. WDB Consensus |
| FIG-WDB-03 | Offline Trust Receipt | TikZ | receipt_chain.ts | 20. WDB Security |

## 5. Frontend & UI

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-UI-01 | Vzeya Narrative Phase State | Mermaid | narrativeStore.ts (Phases 0-3) | 24. Vzeya Deep Dive |
| FIG-UI-02 | 3D Spatial Terminal Architecture | TikZ | Execution3DWorld.tsx, drei HTML | 24. Vzeya Deep Dive |
| FIG-UI-03 | Analyst Dashboard Structure | Mermaid | DashboardLayout.tsx | 25. Analyst UI Deep Dive |

## 6. Evaluation

| Figure ID | Title | Type | Source Data / Component | Target Chapter |
|---|---|---|---|---|
| FIG-EVAL-01 | Evidence Classification Pyramid | TikZ | Class A through E | 27. Evaluation Methodology |
| FIG-EVAL-02 | Precision-Recall Curve (Simulated) | PGFPlots | P=0.9280, R=0.4598 (from static eval) | 27. Evaluation Methodology |

## Tooling Standards
- **TikZ**: For structural architecture, physical layouts, network topologies, and mathematical representations.
- **Mermaid**: For state machines, sequence diagrams, data flows, and dependency graphs.
- **PGFPlots**: For quantitative data, performance charts, and distributions.
