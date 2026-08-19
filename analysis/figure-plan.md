# Figure Plan

## Figure 1: System Context
- **Title:** Wolverine Platform System Context
- **Purpose:** Illustrate the high-level boundaries between the public synthetic ecosystem (5 heterogeneous web apps) and the local analyst environment (Wolverine intelligence pipeline, Vzeya UI).
- **Source Data:** Project Truth Model, System boundaries section.
- **Diagram Type:** Mermaid (C4 Context)
- **Chapter Placement:** Chapter 3: Architecture

## Figure 2: Container Topology
- **Title:** 14-Container Microservices Topology
- **Purpose:** Detail the Docker-based deployment architecture, showing all 14 containers including the 5 web apps, databases (PostgreSQL, MySQL, Redis, MinIO), and Wolverine services.
- **Source Data:** docker-compose files, Component definitions.
- **Diagram Type:** TikZ (Network Topology)
- **Chapter Placement:** Chapter 3: Architecture

## Figure 3: Isolated Truth Vault
- **Title:** Air-gapped Truth Vault Network Architecture
- **Purpose:** Highlight the security model isolating the Truth Vault via an internal-only Docker network, separated from the public web application networks.
- **Source Data:** docker-compose.prod.yml configurations.
- **Diagram Type:** Mermaid (Network Architecture)
- **Chapter Placement:** Chapter 4: Security Model

## Figure 4: Ingestion Pipeline
- **Title:** Wolverine Data Ingestion and Normalization Pipeline
- **Purpose:** Map the data lifecycle from app-specific databases via adapters to canonical schema normalization before entity resolution.
- **Source Data:** Data lifecycle specifications.
- **Diagram Type:** Mermaid (Flowchart)
- **Chapter Placement:** Chapter 5: Data Integration

## Figure 5: Entity Resolution Flow
- **Title:** Deterministic Entity Resolution Pipeline
- **Purpose:** Step-by-step visualization of the resolution algorithm applying Jaro-Winkler, weighted scoring, and hardcoded heuristic limitations without NLP.
- **Source Data:** Algorithm specifications and Mathematical Models.
- **Diagram Type:** TikZ (Algorithmic Flow)
- **Chapter Placement:** Chapter 6: Entity Resolution

## Figure 6: LLM RAG Pipeline
- **Title:** RAG Pipeline with Deterministic Fallback
- **Purpose:** Show the integration of LLM-based intelligence queries backed by the Truth Vault, emphasizing the deterministic fallback paths and prompt sanitization mechanisms.
- **Source Data:** Security model and LLM pipeline specifications.
- **Diagram Type:** Mermaid (Sequence Diagram)
- **Chapter Placement:** Chapter 7: Analyst Interface
