# Documentation Blueprint (14-Chapter PhD Structure)

This blueprint aligns the manuscript structure with the verified project truth model. Simulated or mocked components are clearly identified to maintain academic honesty.

## Front Matter
- Title Page, Abstract, Acknowledgements, Table of Contents, List of Figures, List of Tables.

## 1. Introduction
- 1.1 Problem Statement: Cross-service entity resolution in heterogeneous ecosystems without shared identity.
- 1.2 Motivation: Intelligence analysis across disparate silos.
- 1.3 Contributions: Synthetic environment architecture, resolution pipeline, simulated trust logs.
- 1.4 Project Context: Smart India Hackathon.

## 2. Background and Related Work
- 2.1 Entity Resolution Models (Fellegi-Sunter, Christen 2012).
- 2.2 String Similarity (Jaro-Winkler).
- 2.3 Synthetic Data in Evaluation.
- 2.4 Cryptographic Tamper Evidence (Merkle Trees, BFT).

## 3. System Architecture
- 3.1 Separation of Environments: Synthetic Public Ecosystem vs. Local Analyst Environment.
- 3.2 High-Level Component Topology (Generators, Pipeline, UI, DB).
- 3.3 Network Isolation Strategies (Air-gapped Truth Vault).

## 4. Synthetic Data Generation Engine
- 4.1 Need for Verifiable Ground Truth.
- 4.2 13-Phase Deterministic Generation Pipeline.
- 4.3 Population Scale and Identity Distribution (Target 50,000 baseline).
- 4.4 Mutation and Alias Models (35% mutation chance, 4-pattern strategies).

## 5. Heterogeneous Data Collection
- 5.1 The 5 Synthetic Web Apps (Atlas, Briar, Cinder, Drift, Ember).
- 5.2 Ecosystem Modalities (Dark web markets, exchanges, forums).
- 5.3 Extractor and Adapter Implementations.
- 5.4 Graphql vs REST Data Ingestion.

## 6. Data Normalization and Schema
- 6.1 Challenges in Schema Heterogeneity.
- 6.2 The Canonical Record Schema.
- 6.3 Field Mapping and Type Coercion.
- 6.4 Event/Outbox Architecture (Redis).

## 7. Entity Resolution Algorithms
- 7.1 Deterministic Rule-Based Resolution.
- 7.2 String Similarity Implementation (Jaro-Winkler).
- 7.3 Simulated Features (activityOverlap hardcoded to 0.5).
- 7.4 Cross-Site Cues (4-char string matching vs NLP claims).

## 8. Graph Construction and Traversal
- 8.1 Representing Entities and Relationships.
- 8.2 In-Memory Breadth-First Search (BFS) Implementation.
- 8.3 Traversal Constraints (Max depth 4).
- 8.4 Graph Projection Techniques.

## 9. Artificial Intelligence and RAG
- 9.1 AI Integration for Intelligence Analysis.
- 9.2 Prompt Injection Protection (4-rule sanitization, 500-char limit).
- 9.3 Fallback Mechanisms (Deterministic heuristic hypothesis).
- 9.4 Context Window Management.

## 10. Cryptographic Trust and Audit (WolverineDB)
- 10.1 Purpose of Tamper-Evident Logs in Intelligence.
- 10.2 WolverineDB Architecture and SQLite Adapter.
- 10.3 Simulated Network Transport (DirectMemoryNetworkTransport).
- 10.4 Simulated EVM Anchoring and BFT Consensus.

## 11. Intelligence Analyst Interface (Vzeya)
- 11.1 Presentation Layer Architecture (React).
- 11.2 UI Paradigms for Intelligence Analysts.
- 11.3 Demonstration Mechanisms (Mock Data Arrays vs Real-time APIs).
- 11.4 Visualizing Entity Clusters.

## 12. Security and Deployment Infrastructure
- 12.1 Docker-based Containerization (14 containers).
- 12.2 Database Segregation (PostgreSQL 16, MySQL 8.4).
- 12.3 Network Isolation (Internal-only Docker networks).
- 12.4 Object Storage Integration (MinIO).

## 13. System Evaluation and Demonstrations
- 13.1 Benchmarking Design.
- 13.2 Scenario Injection Mechanism.
- 13.3 Analysis of Claimed vs Simulated Metrics (Hardcoded 0.9280 precision).
- 13.4 System Acceptance Tests and Demonstrations.

## 14. Conclusion and Future Work
- 14.1 Summary of Delivered Capabilities.
- 14.2 Reconciliation of Claims vs Implementations (Addressing PostgreSQL CTEs, True P2P WolverineDB, NLP).
- 14.3 Future Directions for Full Production Readiness.
- 14.4 Final Remarks.
