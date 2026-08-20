# Research Rigor Corrections & Scientific Demarcations

**Monograph Title**: Architectures for High-Fidelity Synthetic Threat Intelligence Ecosystems  
**Version**: PhD Monograph Final Targeted Pass (v3.0.0)  
**Date**: August 20, 2026  

---

## 1. Problem $\to$ Prior Work $\to$ Gap $\to$ Methodology $\to$ Evidence $\to$ Limitations Mapping

All chapters in the monograph have been audited and updated to follow the standard doctoral dissertation structure:

| Chapter | Problem Formalization | Prior Work & Literature | Identified Gap | Proposed Methodology | Empirical / Functional Evidence | Formal Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ch 1: Ecosystem** | CTI fragmentation across darknet/surface webs | Darknet measurements (soska2015measuring), record linkage (ellegi1969theory) | Lack of reproducible multi-protocol benchmark ecosystems | 14-service polyglot architecture with 5 synthetic platforms | 65/65 full-ecosystem verifications passing | Synthetic simulation, single-host Docker resources |
| **Ch 2: Architecture** | Latency and trust boundaries in multi-tier CTI | Distributed microservices (
ewman2021building), eventing (kleppmann2017designing) | Database lock contention in recursive graph traversals | Bounded in-memory BFS + Transactional Outbox + Tor gateway | 8/8 Tor security checks,  \le 4$ graph traversal | Memory budget bounds ( \le 500$ vertices) |
| **Ch 3: Data Architecture** | Multi-schema polyglot ingestion & lineage | Relational vs. analytical stores (db:stonebraker2005), JCS (fc8785) | Cross-language serialization & signature ambiguity | RFC 8785 canonical record schema + MinIO immutable store | Type-safe Prisma models, zero content-digest mismatch | In-memory graph state requires re-projection on restart |
| **Ch 4: Analytical Methodology** | (N^2)$ candidate space in cross-platform ER | Jaro-Winkler (jaro1989advances), blocking (christen2012data) | Adversarial handle distortion & prompt injection | 3-char blocking + linear 30-day decay + 4-rule RAG sanitization | Precision-first linkage at $\tau = 0.92$, review queue at .70$ | Static activity overlap (.5$), regex-based prompt filtering |
| **Ch 5: WolverineDB** | Insider threat & historical audit log forgery | PBFT (castro1999practical), Merkle trees (merkle1987digital, fc6962) | Database superuser privilege escalation rewriting CDC logs | Append-only hash chain + 4-of-5 BFT quorum certificates | 219 automated test suites across 87 specs passing | In-process DirectMemoryNetworkTransport, simulated EVM Map |
| **Ch 6: Security & Ethics** | Data poisoning, prompt injection, PII violation | STRIDE (shostack2014threat), differential privacy (dwork2006differential) | LLM prompt injection and ground-truth oracle leakage | 3-zone Docker networks + Tor DMZ + 5-tier RBAC | Tor safety script verification, 4-rule prompt sanitization | Logical container isolation $\neq$ hardware air-gapping |
| **Ch 7: Vzeya UI** | High-dimensional CTI data narrative presentation | Modern spatial web UX, React Three Fiber, WebGL shaders | GPU resource starvation from full-screen postprocessing shaders | WebGL particles + CSS epeating-linear-gradient scanlines | 60 FPS rendering under particle loads | Static mock data demonstration mode |
| **Ch 8: Analyst UI** | Human-in-the-loop candidate review & CTI triage | Single-page applications, flexbox graph visualization | Complex external graph framework dependencies | React/Vite SPA with CSS flexbox layout & live RAG backend | Seamless candidate adjudication workflow | Simulated Neo4j/BiLSTM backend claims in executionData.ts |
| **Ch 9: Evaluation** | Conflation of static baselines with dynamic results | Synthetic benchmark evaluation (
owok2016synthpop, christen2012data) | Unverified empirical claims in prototype literature | 5-tier evidence taxonomy + 12 unperformed experimental protocols | Static baselines (=0.9280, R=0.4598, F1=0.6149$) qualified | Unperformed empirical benchmarks explicitly demarcated |
| **Ch 10: Synthesis** | Research prototype to production deployment | Scalable systems literature (kleppmann2017designing, castro2002practical) | In-memory and in-process simulation constraints | 5 actionable future research trajectories with risk analysis | Comprehensive architectural blueprint | Real WAN latency, disk-backed indexing, semantic embeddings |

---

## 2. Rigorous Scientific Terminology Enforced

1. **Logical Isolation vs. Air-Gapping**: Docker network bridge (internal: true) is explicitly qualified as kernel namespace isolation, never as a physical air gap.
2. **Deterministic Cryptography vs. Absolute Immutability**: Hash chains and Merkle trees are qualified as tamper-evident append-only structures, acknowledging storage hardware layer constraints.
3. **Simulated BFT vs. Distributed Network**: The consensus engine is documented as running over DirectMemoryNetworkTransport in memory rather than across a physical WAN.
4. **Reference Literals vs. Dynamic Measurements**: Baseline metrics (=0.9280, R=0.4598, F1=0.6149$) are strictly cataloged as static reference literals.
