# Project Truth Model

## 1. Project identity
Project Wolverine (Smart India Hackathon). A cross-service entity resolution and intelligence platform.

## 2. Problem definition
Cross-service entity resolution in heterogeneous web ecosystems with no shared identity.

## 3. System boundaries
The system is divided into two environments: a public synthetic ecosystem (5 heterogeneous web apps) and a local analyst environment (Wolverine intelligence pipeline, Vzeya UI).

## 4. Components
- Synthetic Population Generator
- Wolverine Intelligence Pipeline
- Analyst UI (Vzeya)
- WolverineDB (Cryptographic Trust Layer)
- 5 Heterogeneous Web Apps (Atlas Market, Briar Bazaar, Cinder Exchange, Drift Forum, Ember Commons)

## 5. Architecture
Docker-based microservices architecture. 5 separate stack web apps generate data. Wolverine normalizes data, resolves entities, and stores them in Truth Vault.

## 6. Data lifecycle
Data is generated synthetically, stored in app-specific databases. Wolverine pulls via adapters, normalizes to a canonical schema, resolves entities, and stores in the Truth Vault (PostgreSQL).

## 7. Database architecture
- Source databases: PostgreSQL 16 (for most), MySQL 8.4 (for site-c)
- Truth Vault: PostgreSQL 16-alpine
- WolverineDB: Uses SQLite adapter for internal storage
- MinIO: Object storage for captures
- Redis: Event/outbox architecture

## 8. Algorithms
- Entity resolution uses Jaro-Winkler similarity for strings.
- **Activity overlap is hardcoded to 0.5** and not dynamically computed.
- Cross-site cues are resolved using **4-char string matches**.
- **NO NLP** is used in entity resolution.

## 9. Frontend
- Analyst UI is **Vzeya**.
- Vzeya has **NO api directory**; it is purely a frontend presentation layer using hardcoded mock data arrays for demonstration.

## 10. Wolverine DB
- **Partially implemented**: Network and EVM anchoring are purely in-memory simulations (DirectMemoryNetworkTransport).
- Cryptographic trust features exist in code but lack real distributed network capabilities.

## 11. Security model
- **Truth Vault IS air-gapped** in `docker-compose.prod.yml`, utilizing an internal-only Docker network separate from the web apps.
- Prompt injection protection via 4-rule sanitization and 500-char truncation.

## 12. Experiments
- The evaluator uses **hardcoded metric outputs** for the demo.
- Claims like 0.928 precision are **demonstration outputs**, not dynamically computed from real evaluation scenarios.

## 13. Limitations
- Graph traversal uses an **in-memory BFS** (Map-based, max depth 4) instead of PostgreSQL recursive CTEs.
- System relies heavily on simulated components (WolverineDB network, Vzeya UI data, evaluation metrics).

## 14. Contradictions
- Claimed PostgreSQL recursive CTEs for graphs, but code uses in-memory BFS.
- Claimed dynamic real-time entity resolution metrics (0.928 precision), but evaluator uses hardcoded metric outputs.
- Claimed NLP and vocabulary fingerprinting, but resolution uses basic 4-char string matching and Jaro-Winkler.
- Vzeya claimed to be a fully functional intelligence analysis UI, but is purely a frontend presentation with mock data.

## 15. Unknowns
- Full effectiveness of the BFT consensus and Merkle state checkpoints since they are partially implemented and untested in a distributed environment.
- True performance of the resolution algorithms on large real-world datasets, as experiments use hardcoded metric outputs.

## 16. Research contribution
- Architecture for isolating a synthetic ecosystem from an intelligence analysis pipeline for testing.
- Integration of deterministic rule-based resolution with cryptographic audit logs (WolverineDB), albeit simulated.

## 17. Literature dependencies
- Fellegi-Sunter model / Christen (2012) for entity resolution.
- Jaro-Winkler string similarity.
- Merkle trees for tamper-evident logs.

## 18. Subsystem Status Table
| Subsystem | Status |
| :--- | :--- |
| Wolverine DB | Prototype |
| Graph Projector | Prototype |
| Evaluator | Mock |
| Vzeya | Mock |
| Tor Gateway | Simulation |
| Sites | Production-like |
| Pipeline | Production-like |
| Generator | Experimental harness |
