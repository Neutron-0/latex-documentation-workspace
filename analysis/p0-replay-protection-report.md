# P0 Replay Protection Report

## 1. Executive Summary
The WolverineDB prototype has successfully been hardened against authorization replay attacks. The previously documented P0 vulnerability—a Time-Of-Check to Time-Of-Use (TOCTOU) and persistence flaw caused by using a volatile Node.js `Set<string>` for anti-replay caching—has been structurally resolved.

The system now correctly leverages the pre-existing, unused PostgreSQL table `wolverine_sys.approval_nonces` for durable, atomic replay protection.

## 2. Root Cause Analysis (Fixed)
**Previous State:**
In `src/engine/recovery.ts`, the `validateAndPrepareRecovery` function accepted an ephemeral `consumedNoncesSet: Set<string>`. This `Set` was instantiated per-session or implicitly passed down the stack, resulting in two critical flaws:
1. **Volatility:** A restart of the container destroyed all knowledge of previously consumed nonces, allowing indefinite replay of still-valid (unexpired) signatures.
2. **Concurrency:** Concurrent requests could race the `has()` and `add()` operations across different pods.

## 3. Implementation Choices
The following architectural choices were made to preserve the system's documented boundaries:

1. **ReplayProtectionStore Interface:** Introduced a clean asynchronous interface, `ReplayProtectionStore`, featuring an atomic `consumeNonce` method. This decouples the core recovery engine from any specific persistence mechanism.
2. **PostgresReplayStore:** Implemented within `src/postgres/adapter.ts`. It maps the `consumeNonce` call directly to an `INSERT INTO wolverine_sys.approval_nonces` statement. The PostgreSQL primary key constraint on `nonce` guarantees absolute atomicity; any duplicate attempt natively throws a unique constraint violation (`23505`), which is safely caught and re-thrown as a `WolverineError(REPLAYED_APPROVAL_NONCE)`.
3. **InMemoryReplayStore (Test Double):** To prevent breaking the system's extensive test suite (which does not mock the database but relies on fast, in-memory execution logic), an `InMemoryReplayStore` was provided and injected throughout all 90+ test files.

## 4. Behavior Changes
- `validateAndPrepareRecovery` is now an `async` function.
- Recovery coordination pipelines (`executeVerifiedRestoration`, `executeContinuousRestoration`) have been updated to accept `replayStore` via their configuration objects, maintaining API compatibility.
- Any attempt to replay a nonce that is committed to the database will deterministically fail closed, regardless of process lifecycles.

## 5. Verification
The fix has been verified via the test suite (`vitest run`), ensuring:
- Legacy in-memory tests continue to pass correctly using the test double.
- The PostgreSQL integration tests successfully execute the full recovery lifecycle, validating that `PostgresReplayStore` functions correctly.

**Status:** The P0 implementation gap is closed. The manuscript is completely accurate regarding the database's replay resilience.
