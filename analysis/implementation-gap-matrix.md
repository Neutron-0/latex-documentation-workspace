# Implementation Gap Matrix

## 1. Objective
To document the precise differences between the theoretical architectural specifications discussed in the manuscript and the operational realities of the codebase.

## 2. Capability Gap Matrix

| Capability | Current State | Affected Modules | Why It Matters | Priority |
|------------|---------------|------------------|----------------|----------|
| **Dynamic `activityOverlap`** | SIMULATED (0.5) | `entity_resolver.ts` | Base heuristic recall is static, making real behavioral linkage impossible. | P3 |
| **BFT Network Consensus** | SIMULATED | `wolverine-db/transport.ts` | The system relies on local V8 memory events, negating the primary distributed Byzantine resilience claims. | P1 |
| **KMS Hardware Anchoring** | SIMULATED | `wolverine-db/crypto.ts` | Cryptographic trust relies on local environment variables instead of isolated HSM signing. | P2 |
| **EVM Blockchain Persistence** | SIMULATED | `wolverine-db/anchor.ts` | Merkle roots are not actually published to a public chain, negating zero-trust auditability. | P2 |
| **Disk-backed Graph DB** | SPECIFIED ONLY | `projector.ts` | BFS is forced into Node.js heap memory, strictly bounding query capabilities to $N=500$. | P1 |
| **Empirical Evaluation** | MISSING (Stubbed) | `evaluator/__main__.py` | Currently outputs static strings ($0.9280$ Precision). The confusion matrix logic is unwritten. | P3 |
| **Node.js Replay Cache** | IMPLEMENTED | `wolverine-db/recovery.ts`, `wolverine-db/adapter.ts` | Replay cache is durable in PostgreSQL (`wolverine_sys.approval_nonces`). | FIXED |

## 3. Implementation Taxonomy

### CURRENTLY IMPLEMENTED
- 14-container Docker networking isolation
- Canonical Record Parsing
- Jaro-Winkler string similarity mechanics
- WolverineDB PostgreSQL Merkle Triggers
- Durable Replay Protection Cache (PostgreSQL)

### CURRENTLY SIMULATED
- activityOverlap / Temporal behavioral matching
- WolverineDB BFT Transport (`DirectMemoryNetworkTransport`)
- Static Evaluator metrics

### CURRENTLY BROKEN
- In-memory Node.js anti-replay cache in WolverineDB

### FUTURE WORK
- Transitioning BFS to Neo4j/Postgres recursive CTEs
- Real KMS integration
- Dynamic Evaluation Confusion Matrix logic
