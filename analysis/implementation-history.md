# Implementation History

## 1. P0: Durable Replay Protection Cache
- **Original Vulnerability:** The authorization replay cache in `wolverine-db/src/engine/recovery.ts` relied on a volatile Node.js `Set<string>`. Container restarts would erase consumed nonces, allowing trivial signature replay attacks.
- **Implementation Decision:** Abstracted a `ReplayProtectionStore` interface and created `PostgresReplayStore` using the `wolverine_sys.approval_nonces` table. Atomic constraints (error 23505) correctly map to replay rejections without race conditions.
- **Affected Modules:**
  - `src/engine/recovery.ts`
  - `src/postgres/adapter.ts`
  - `src/reconstruction/coordinator.ts`
  - Over 90 test files updated to use `InMemoryReplayStore`.
- **Verification:** Unit tests confirm `InMemoryReplayStore` works; `tests/postgres_integration.test.ts` validates the durable Postgres store rejects duplicate nonces correctly.
- **Manuscript Updates:** 
  - Ch 6: Added Replay Protection DB subsection.
  - Ch 8: Added Implementation details (`PostgresReplayStore` vs `InMemoryReplayStore`).
  - Ch 11: Added before/after security table and updated residual risks.
  - Ch 12: Added Discussion interpreting the post-audit engineering improvement.
  - Ch 13: Updated future work (moved single-node durable to implemented, distributed replay remains future work).
  - App C: Added WDB-05 specification mapping.
