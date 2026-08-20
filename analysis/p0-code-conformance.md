# P0 Codebase Conformance Audit

## 1. Objective
To independently verify the final P0 implementation (Replay Protection Cache) against the actual codebase (`wolverine-db`), ensuring that any claims injected into the PhD manuscript accurately reflect the physical software.

## 2. Implementation Status
**Classification:** `CONFIGURATION-DEPENDENT` (Implemented at module layer, but lacking injection in CLI).

### Verified Architecture
The engineering requirements for P0 have been satisfied at the module layer:
1. **Abstraction Boundary:** The `ReplayProtectionStore` interface exists in `src/engine/recovery.ts`, cleanly decoupling recovery logic from persistence.
2. **Durable Postgres Path:** `PostgresReplayStore` is implemented in `src/postgres/adapter.ts`.
3. **Atomic Semantics:** Uniqueness is enforced via an atomic `INSERT INTO wolverine_sys.approval_nonces` and duplicate keys throw `23505`, successfully mapped to `WolverineErrorCode.REPLAYED_APPROVAL_NONCE`.
4. **Test Proofs:** The integration test `tests/postgres_integration.test.ts` successfully mounts the Postgres store and runs the tamper-detect-recover loop.

### Runtime vs Compatibility Path
- **Test / Compatibility Path:** 90+ tests use `InMemoryReplayStore`.
- **Runtime Path:** The primary CLI tools (`src/reconstruction/cli.ts`, `src/continuous_reconstruction/cli_v2.ts`) have *not* been updated to instantiate the `PostgresAdapter` or pass the `replayStore` to `StateReconstructionCoordinator.executeVerifiedRestoration`. 
- **Consequence:** Because it is omitted from the options object at runtime, the coordinator falls back to `options.replayStore || new InMemoryReplayStore()`. Thus, if run via the provided CLIs, the system still uses a volatile in-memory cache. 

## 3. Conformance Constraint
The PhD manuscript **must not** claim that the deployed system universally prevents replay attacks across container restarts. It must accurately specify that:
- The `wolverine-db` recovery engine supports durable PostgreSQL-backed replay protection.
- The `PostgresReplayStore` atomically consumes nonces.
- Production integration requires dependency-injecting the `PostgresReplayStore` into the recovery coordinator, whereas default test/demo profiles remain in-memory.
