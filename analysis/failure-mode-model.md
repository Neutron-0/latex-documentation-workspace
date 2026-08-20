# Failure Mode Model

| Subsystem | Failure | Cause | Detection | Response | Fallback | Recovery | Residual Effect |
|---|---|---|---|---|---|---|---|
| PostgreSQL DB | Connection Timeout | Network/Overload | Prisma Client Exception | Circuit Breaker | In-memory Queue | Retry on backoff | Delayed processing |
| Neo4j | Traversal Timeout | Dense graph queries | Query execution limit | Abort query | Partial sub-graph | Optimize indices | Missing relations in UI |
| Entity Resolver | Duplicate Records | Improper blocking | Unique Constraint Violation | Reject ingestion | Quarantine Record | Manual review | Potential data duplication |
| Wolverine-API | Network Failure | Tor circuit broken | Nginx 502/504 | Alert metrics | Cached responses | Automatic circuit rebuild | Transient request drops |
| Ollama / RAG | LLM Timeout | Context too large | API Timeout | Return empty synthesis | Standard error message | Scale LLM instances | No narrative generated |
| Redis | Stale Data | Cache invalidation bug | Cache Miss/Integrity Check | Purge key | Direct DB read | TTL expiration | Increased DB load |
| MinIO | Cryptographic Errors | Tampered objects | Hash mismatch on read | Reject file access | Alert admin | Restore from backup | Temporary object unavailability |
| Event Outbox | Malformed Messages | Schema evolution | Validation failure | Log Error | Dead Letter Queue | Manual schema patch | Stuck processing pipeline |
| WolverineDB | Replay Attempts | Adversarial injection | Checkpoint mismatch | Reject Tx | Drop connection | Ban offending node | Minimal (secure) |
