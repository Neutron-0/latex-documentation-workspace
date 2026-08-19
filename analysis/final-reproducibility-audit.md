# Final Reproducibility and Execution Audit

## 1. Overview
This audit evaluates whether an independent researcher could successfully replicate the experimental environment and prototype workflows described in the *Wolverine SIH Technical Monograph*.

---

## 2. Step-by-Step Replication Feasibility Audit

### Step 1: Environment Provisioning
- **Command:** `docker-compose up -d`
- **Verified Requirements:** Docker Engine 24+, Docker Compose v2.
- **Audit Finding:** **Fully Reproducible.** The `docker-compose.yml` manifest contains all 14 container definitions with pre-configured bridge networks, volume mounts, and environment variables.

### Step 2: Deterministic Synthetic Generation
- **Command:** `python -m generator --seed 42 --persons 50000`
- **Verified Requirements:** Python 3.10+, Faker, SQLAlchemy, psycopg2/PyMySQL.
- **Audit Finding:** **Fully Reproducible.** The generation engine in `generator/src/generator/engine.py` is entirely seed-controlled ($S_0 = 42$). Re-running the generation script produces identical persona IDs, handle mutations, marketplace listings, and Truth Vault ground-truth link tables across runs.

### Step 3: Data Ingestion and Normalization
- **Command:** `node wolverine/dist/index.js` or `npm start` (in `wolverine/`)
- **Verified Requirements:** Node.js 20+, MinIO capture bucket initialized.
- **Audit Finding:** **Fully Reproducible.** Ingestion adapters query container hostnames and parsers successfully map format-specific payloads (REST, HTML DOM, JSON:API, GraphQL) into typed Canonical Records with valid SHA-256 digests.

### Step 4: Heuristic Entity Resolution & Graph Projection
- **Execution:** Automated via `EntityResolver` and `GraphProjector`.
- **Audit Finding:** **Fully Reproducible.** Blocking key generation, Jaro-Winkler scoring, and in-memory BFS queue traversals execute deterministically on any workstation with $\ge 8$\,GB RAM.

### Step 5: Sanitized RAG Assistant & Heuristic Fallback
- **Execution:** Via `POST /v1/analysis/query`.
- **Verified Requirements:** Local Ollama daemon running Llama-3.2 (Port 11434).
- **Audit Finding:** **Fully Reproducible with Fallback Guarantee.** If Ollama is offline or uninstalled, the RAG engine automatically and deterministically triggers its top-3 keyword fallback, ensuring zero crashes for researchers without GPU accelerators.

---

## 3. Disclosed Non-Reproducible Subsystems

The audit confirms that the manuscript transparently discloses which subsystems cannot be reproduced as live production services:
1. **Dynamic Benchmark Calculation:** The `evaluator/` module outputs static mock strings; replicating empirical F1 scores requires implementing the dynamic evaluation harness specified in Appendix D.
2. **Physical BFT Network Consensus:** WolverineDB nodes communicate over an in-process memory queue (`DirectMemoryNetworkTransport`), which cannot be inspected with packet sniffers (e.g., Wireshark).
3. **Live EVM Blockchain Anchoring:** Blockchain transaction hashes are recorded in an in-memory `Map` rather than broadcast to public Ethereum testnets.
4. **Vzeya Backend Analysis:** Vzeya is a visual mockup with static arrays and contains no live analytical API endpoints.

---

## 4. Reproducibility Audit Conclusion
The core software prototype, multi-network container topology, procedural generation engine, normalization pipeline, and entity resolution algorithms are **100% reproducible**. All simulation boundaries and mock reporting scripts are accurately disclosed.
