# Implementation Priority Roadmap

## 1. Objective
To classify and rank the implementation gaps discovered during the conformance audit, providing a rational engineering roadmap to transition the Wolverine prototype toward a production-ready state.

## 2. Ranking Taxonomy
- **P0:** Critical correctness / security blockers.
- **P1:** Core system functionality requirements.
- **P2:** Important engineering capabilities.
- **P3:** Evaluation/research enhancements.
- **P4:** Optional improvements.

## 3. Prioritized Gaps

### [P0] Fix Volatile Node.js Anti-Replay Cache
- **Dependency:** `wolverine-db/ledger.ts`
- **Reason:** Container restarts destroy the in-memory `Set`, allowing trivial replay attacks against the Sentinel validation logic.
- **Expected Result:** Shift the replay cache to an external Redis instance with AOF enabled.

### [P1] Replace `DirectMemoryNetworkTransport`
- **Dependency:** `wolverine-db/transport.ts`
- **Reason:** Real Byzantine Fault Tolerance requires distributed networking. The current memory bus invalidates the core cryptographic architecture claims.
- **Expected Result:** Implement gRPC or secure WebSockets for true inter-node BFT communication.

### [P1] Migrate BFS to PostgreSQL Recursive CTEs
- **Dependency:** `wolverine-sih/wolverine/src/graph/projector.ts`
- **Reason:** The hardcoded $N \le 500$ limit in the Node.js V8 heap prevents the discovery of deep intelligence networks.
- **Expected Result:** Move traversal logic to a disk-backed SQL graph schema.

### [P2] Integrate Hardware KMS
- **Dependency:** `wolverine-db/crypto.ts`
- **Reason:** Cryptographic commitments currently rely on ephemeral ENV variables, lacking true non-repudiation.
- **Expected Result:** Integrate AWS KMS or HashiCorp Vault.

### [P3] Implement Dynamic Evaluation Harness
- **Dependency:** `wolverine-sih/evaluator/__main__.py`
- **Reason:** The current metrics ($0.9280$ Precision) are static CLI stubs.
- **Expected Result:** Code the Confusion Matrix logic defined in Appendix D to generate empirical evaluations.

### [P3] Compute Dynamic `activityOverlap`
- **Dependency:** `wolverine-sih/wolverine/src/resolver/entity_resolver.ts`
- **Reason:** The parameter is currently hardcoded to $0.5$.
- **Expected Result:** Query temporal behavioral logs to compute actual behavioral intersection.

## 4. Practical Implementation Target
Do **NOT** implement all of these immediately. The current objective of this prototype is to serve as a demonstrator for the Smart India Hackathon. 
- **Core Implementation:** P0 (Replay Cache) should be patched.
- **Out of Scope (for now):** P1, P2, and P3 are strictly categorized as "Future Work" in the manuscript (Chapter 13). They should remain un-implemented until Phase 2 funding/research begins.
