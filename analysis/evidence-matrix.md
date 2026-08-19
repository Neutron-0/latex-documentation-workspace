# Evidence Matrix

| # | Claim | Source | Evidence Class | Notes |
|---|-------|--------|---------------|-------|
| 1 | 5 heterogeneous web apps implemented | Code inspection | VERIFIED | Each has Dockerfile, source code |
| 2 | Entity resolution achieves 0.9280 precision | Established facts doc | CLAIMED | Evaluator uses hardcoded metrics for demo |
| 3 | 50,000 person synthetic population | Generator code | VERIFIED | generation code confirmed, default target=50000 |
| 4 | Jaro-Winkler similarity for entity resolution | Code inspection | VERIFIED | Full implementation present in entity_resolver.ts |
| 5 | AI/RAG with prompt injection protection | Code inspection | VERIFIED | 4-rule sanitization implemented |
| 6 | activityOverlap is real feature | Code inspection | PARTIALLY VERIFIED | Hardcoded to 0.5 baseline, not actually computed |
| 7 | Truth Vault is isolated from resolver | Docker config | VERIFIED | Separate network in docker-compose.prod.yml |
| 8 | Tor Onion Service deployment | Config present | VERIFIED | torrc, nginx.conf present |
| 9 | 65/65 acceptance tests pass | Established facts | CLAIMED | Results claimed but not dynamically verified |
| 10 | Generation in 114.497s / 390.92 MB | Established facts | CLAIMED | Specific numbers claimed |
| 11 | Vzeya performs actual intelligence analysis | UI inspection | CONTRADICTED | Vzeya has NO api dir; mock data arrays only |
| 12 | wolverine-db provides tamper evidence | Code inspection | PARTIALLY VERIFIED | In-memory EVM/network simulations |
| 13 | Redis event/outbox architecture | Docker + docs | VERIFIED | Redis 7.2 deployed |
| 14 | MinIO object storage for captures | Docker config | VERIFIED | MinIO configured |
| 15 | Contract drift detection | Code inspection | VERIFIED | Briar parser checks for .synthetic-banner |
| 16 | Blockchain/decentralization features | Established facts | CONTRADICTED | Simulated/Not implemented |
| 17 | Real cryptocurrency/PII handling | Established facts | CONTRADICTED | Prohibited by generator |
| 18 | Five different ID formats per site | Generator code | VERIFIED | Implemented in generator |
| 19 | Handle mutation for cross-site aliases | Generator code | VERIFIED | 35% mutation chance with 4 patterns |
| 20 | GraphQL endpoint for Ember Commons | Parser code | VERIFIED | Parses gql.data.feed.edges structure |
| 21 | Analyst UI web interface | Code inspection | VERIFIED | React-based frontend components (Vzeya) |
| 22 | PostgreSQL 16 usage | Docker config | VERIFIED | postgres:16-alpine |
| 23 | MySQL 8.4 usage | Docker config | VERIFIED | mysql:8.4 |
| 24 | SQLite adapter for wolverine-db | Code inspection | VERIFIED | SQLite adapter implemented |
| 25 | Graph traversal max depth 4 | Code inspection | VERIFIED | In-memory BFS configured with max depth 4 |
| 26 | AI fallback provides deterministic hypothesis | Code inspection | VERIFIED | Fallback returns heuristic hypothesis |
| 27 | 13 deterministic generation phases | Code inspection | VERIFIED | Explicit phases implemented |
| 28 | Tor Gateway uses nginx | Docker config | VERIFIED | Nginx proxy configuration present |
| 29 | Vzeya UI uses mock data | Code inspection | VERIFIED | Hardcoded mock arrays for demonstrations |
| 30 | 500-char truncation in AI sanitization | Code inspection | VERIFIED | Text truncation mechanism verified |
| 31 | 139+ wolverine-db source files | wolverine-db scan | VERIFIED | Matches file scan |
| 32 | 91 formal specs, 87 test suites | wolverine-db scan | CLAIMED | Specs and tests claimed |
| 33 | 4-of-5 BFT quorum consensus | wolverine-db scan | CLAIMED | Code claimed to exist in bft_hardening |
| 34 | Immutable offline trust receipts | wolverine-db scan | CLAIMED | Claimed |
| 35 | In-process network transport only | wolverine-db | VERIFIED | DirectMemoryNetworkTransport |
| 36 | PostgreSQL adapter not fully wired | wolverine-db | PARTIALLY VERIFIED | Acknowledged limitation |
| 37 | Simulated EVM anchoring / KMS signing | wolverine-db | VERIFIED | Acknowledged limitation |
| 38 | CLI commands are stubs | wolverine-db | VERIFIED | Acknowledged limitation |
| 39 | 14 Docker containers | SIH Conclusion | CLAIMED | Needs reconciliation |
| 40 | 5 RBAC roles | SIH Conclusion | CLAIMED | Not code-verified |
| 41 | docker-compose.prod.yml exists | SIH Conclusion | VERIFIED | Hardened config (Truth Vault air-gapped) |
| 42 | Evaluation scenarios implementation | SIH Conclusion | VERIFIED | Scenario injection code verified |
| 43 | PostgreSQL recursive CTEs | SIH Conclusion | CONTRADICTED | Code uses Map-based BFS |
| 44 | Vocabulary fingerprinting (NLP) | SIH Conclusion | CONTRADICTED | Uses 4-char string matching, NO NLP |
