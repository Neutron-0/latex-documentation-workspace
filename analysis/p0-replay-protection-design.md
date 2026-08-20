# P0: Replay Protection Design Note

## 1. Threat Model & Vulnerability
**Threat Model:** An adversary with network access to the `wolverine-dmz` intercepts a valid, cryptographically signed `SignedApprovalEnvelope` and attempts to resubmit it to bypass authorization for an arbitrary or historical state recovery.
**Replay Attack Being Mitigated:** Resubmitting an already-consumed `ApprovalEnvelope` nonce.
**Current Vulnerability:** `validateAndPrepareRecovery` stores consumed nonces in an ephemeral Node.js `Set<string>`. If the Node.js process restarts, the `Set` is cleared, allowing previously consumed nonces to be successfully replayed. Furthermore, multiple concurrent Node.js processes would not share this `Set`, leading to TOCTOU (Time-Of-Check to Time-Of-Use) races.

## 2. Required Properties
- **Persistence Requirement:** The replay cache must persist across container restarts.
- **Concurrency Requirement:** The check-and-insert operation must be strictly atomic at the database level to prevent concurrent replays from bypassing the check.
- **Expiry Semantics:** The protocol enforces expiration via `expiresAtUs` inside the `ApprovalEnvelope`. The store does not technically need a strict TTL eviction (as the signature check will naturally fail expired envelopes), but it must retain the nonce *at least* until `expiresAtUs`.
- **Uniqueness Requirement:** The `nonce` (UUID v4) uniquely identifies an approval envelope.

## 3. Implementation Mechanism
We will use **PostgreSQL**, leveraging the existing `wolverine_sys.approval_nonces` table, which is already defined in `src/postgres/schema.ts` but previously dead code (as noted in `KNOWN_ISSUES.md`). 
- **Why Postgres?** The `wolverine-db` architecture already provisions a PostgreSQL database (`wolverine-postgres-core`). Utilizing the existing table avoids introducing a new dependency (like Redis) while providing ACID guarantees.
- **Atomicity:** We will use an atomic `INSERT ... ON CONFLICT DO NOTHING` (or catch the Unique Violation error) to guarantee that only the first request succeeds.

## 4. Interface Abstraction
We will introduce `ReplayProtectionStore`:
```typescript
export interface ReplayProtectionStore {
  /**
   * Atomically checks if the nonce was consumed. If not, consumes it.
   * Throws REPLAYED_APPROVAL_NONCE if it already exists.
   */
  consumeNonce(nonceHex: string, incidentId: string, approverPubkeyHex: string): Promise<void>;
}
```

## 5. Failure & Recovery Behavior
- **Failure Behavior:** If the PostgreSQL database is unavailable, the `consumeNonce` operation will throw a `DATABASE_CONNECTION_ERROR`. The recovery process will fail closed. This is the correct security posture: we must not bypass replay protection during a database outage.
- **Recovery:** Upon database restoration, operations resume normally.

## 6. Compatibility
We will provide an `InMemoryReplayStore` for backwards compatibility with existing unit tests that don't need a real database. We will also modify `validateAndPrepareRecovery` to be `async` and accept the `ReplayProtectionStore` interface instead of `Set<string>`.
