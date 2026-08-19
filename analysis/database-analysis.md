# Database Analysis

### WolverineDB (Analytical Persistence)
- PostgreSQL 16, port 5433 (mapped from 5432 in container)
- User: wolverine, DB: wolverine
- Stores: canonical records, entity resolution results, relationship graph projections, collection state, analyst query state
- Separated from source application databases by design
- **EVIDENCE**: docker-compose.yml line 78-95, WOLVERINE_PROJECT_ESTABLISHED_FACTS.md §4 (VERIFIED/CLAIMED)

### Source Application Databases
- postgres-sites: Shared PostgreSQL 16, port 5432. Contains databases: atlas_market, briar_bazaar, drift_forum, ember_commons
- mysql-site-c: MySQL 8.4, port 3306. Contains: cinder_exchange
- Each site has its own schema for accounts, listings, orders, messages, etc.
- **EVIDENCE**: docker-compose.yml lines 5-40 (VERIFIED)

### Truth Vault
- postgres-truth: PostgreSQL 16, port 5434 (mapped from 5432)
- User: truth_admin, DB: truth_vault
- **CRITICAL**: Isolated on wolverine-truth network (internal: true) — no external connectivity
- Stores ground truth links between synthetic persons and their cross-site accounts
- NEVER accessed by the entity resolver during inference — evaluation-only
- **EVIDENCE**: docker-compose.yml lines 97-114, ESTABLISHED_FACTS §9 (VERIFIED/CLAIMED)

### wolverine-db Module (Cryptographic Trust Layer)
This is NOT a standalone database. It's a middleware/library with 139 TypeScript source files:
- Schema: wolverine_sys.change_history (append-only log with change_hash, previous_hash chain), wolverine_sys.versions (immutable state versions), wolverine_sys.checkpoints (Merkle roots), wolverine_sys.approval_nonces, wolverine_sys.pending_mutations, wolverine_sys.recovery_proposals
- Adapters: PostgreSQL, MySQL, SQLite
- Crypto: SHA-256 hashing, Merkle trees, Ed25519 signatures, BFT consensus
- CDC: PostgreSQL triggers capturing INSERT/UPDATE/DELETE into pending_mutations + pg_logical_emit_message
- Recovery: Continuous reconstruction engine with dependency graphs, proof graphs
- Anomaly Detection: Sentinel system with advisory proposals
- Open Issues (from wolverine-db-issues/):
  1. Replay protection uses in-memory Set instead of durable writes
  2. Gateway record not cryptographically bound to ingested commitment
  3. Gateway doesn't verify commitment signer signature
  4. TOCTOU window in Sentinel policy gate
- **EVIDENCE**: wolverine-db source files and issues (VERIFIED/INFERRED)

### Data Flow Between Databases
Source DBs → HTTP observation → Capture (MinIO) → Normalization → Canonical Records → WolverineDB
Truth Vault ← Generator seeds ground truth links (evaluation only)
wolverine-db module → wraps any of the above databases for tamper-evidence
- **EVIDENCE**: Architecture documentation and project structure (CLAIMED/INFERRED)
