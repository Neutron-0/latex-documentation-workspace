# COMPLETE SYSTEM MODEL — WOLVERINE SIH

## Level 0 — Mission
Detect coordinated illicit behavior, reputation manipulation, and actor migration across technically isolated, multi-jurisdiction online platforms without pre-existing knowledge of actor identities. Developed for Smart India Hackathon (SIH) August 2026. Author: Harsh Solanki.

## Level 1 — System Context
Actors:
- Analyst: Human investigator using the Analyst UI, querying RAG/graph
- Reviewer: Human adjudicating ambiguous entity links (confidence 0.70-0.919)
- Operator/Admin: System deployment and container lifecycle management
- Synthetic Platforms: 5 heterogeneous web applications generating observable data
- Tor Gateway: Public read-only demo access point

Environments:
- Docker Compose ecosystem on single host
- 3 isolated Docker networks (dmz, internal, truth)
- Local Ollama LLM runtime
- Deterministic synthetic world (no real PII)

## Level 2 — Subsystems
1. Synthetic Ecosystem (5 source platforms + generator + activity simulator)
2. Collection & Ingestion Pipeline (adapters, Tor proxy, Redis Streams, Outbox)
3. Data Normalization & Canonicalization (parsers, schema validation, quarantine)
4. Entity Resolution Engine (blocking, scoring, classification, review routing)
5. Graph Projection & Analysis (in-memory BFS, PostgreSQL recursive CTEs)
6. AI/RAG Investigation (Ollama, sanitization, citation schema, fallback)
7. WolverineDB Cryptographic Trust Layer (hash chains, Merkle trees, BFT consensus)
8. Frontend Presentation (Vzeya cinematic + dashboard routes)
9. Security Infrastructure (Tor gateway, RBAC, network isolation)
10. Evaluation & Benchmarking (ground truth vault, static evaluator, scenarios)

## Level 3 — Services (Docker Containers)
From docker-compose.yml:
1. postgres-sites: PostgreSQL 16 — shared instance for Atlas, Briar, Drift, Ember databases
2. mysql-site-c: MySQL 8.4 — Cinder Exchange database
3. redis: Redis 7.2 — event streaming (Streams + Consumer Groups)
4. minio: MinIO S3 — raw capture object storage with SHA-256 content addressing
5. postgres-wolverine: PostgreSQL 16 — Wolverine core database (Prisma models)
6. postgres-truth: PostgreSQL 16 — air-gapped ground truth vault (isolated network)
7. atlas-market: Node.js/Express/Next.js — REST API marketplace
8. briar-bazaar: Python/Django — HTML-rendered community forum
9. cinder-exchange: PHP/Laravel — JSON:API exchange
10. drift-forum: Go/Chi — Hybrid HTML+REST discussion board
11. ember-commons: Rust/Axum — GraphQL creative commons
12. wolverine-api: Node.js/Express — core analysis API (port 4000)
13. analyst-ui: Frontend container (port 5173)
14. tor-gateway: Nginx Alpine — read-only reverse proxy with Tor hidden service

Networks:
- wolverine-dmz: tor-gateway ↔ wolverine-api (external-facing)
- wolverine-internal: all source sites ↔ wolverine-api ↔ databases ↔ redis ↔ minio
- wolverine-truth: postgres-truth (isolated, internal:true)

## Level 4 — Modules
For each major module document: path, purpose, key interfaces

Wolverine API modules:
- ai/rag.ts: AIAssistant class, sanitizeText(), answerQuestion()
- api/server.ts: Express app, route registration, RBAC middleware
- collector/adapters.ts: 5 adapter classes implementing collect() → AsyncIterable<CaptureResult>
- graph/projector.ts: GraphProjector class, BFS traversal
- normalizer/parsers.ts: 5 parser classes mapping raw → CanonicalRecord
- pipeline/processor.ts: ProcessingOrchestrator, SHA256 dedup
- resolver/entity_resolver.ts: EntityResolver class, blocking, scoring

WolverineDB modules:
- crypto/hash.ts, merkle.ts, canonical.ts, approval.ts
- trust_network/consensus.ts, ledger.ts, validator.ts, proof.ts
- sentinel/anomaly_engine.ts, baseline.ts, policy_gate.ts
- runtime/gateway.ts, validator_daemon.ts, network_transport.ts
- survivability/crash_safe_journal.ts, receipt_chain.ts, catastrophic_cluster.ts
- bft_hardening/epoch_rotation.ts, key_rotation.ts, collusion_defense.ts
- adapters/mysql.ts, sqlite.ts + postgres/
- anchors/evm.ts

Generator modules:
- engine.py: SyntheticWorldEngine (12 phases)
- evaluator/__main__.py, metrics.py

Vzeya modules:
- narrative/InteractiveParticlesMesh.tsx, CarouselScene.tsx, Execution3DWorld.tsx
- lib/narrativeStore.ts (Zustand)
- webgl/CRTPostProcessing.tsx

## Level 5 — Functions (Key Algorithms)
- computeChangeHash(): SHA-256 chain computation with domain prefix
- jaro(): Jaro string distance
- jaroWinkler(): Jaro-Winkler similarity with p=0.1 prefix bonus
- generateBlockingKey(): 3-char prefix + registration week + email domain
- evaluatePair(): Composite scoring with 5 weighted features
- sanitizeText(): 4-rule adversarial input sanitization
- answerQuestion(): RAG context assembly + LLM query + fallback
- GraphProjector.bfs(): Bounded BFS (depth≤4, nodes≤500)
- MerkleTree.computeRoot(): RFC 6962 Merkle root with domain separation
- TrustConsensusEngine.processAttestations(): M-of-N BFT quorum

## Level 6 — Data
Prisma Schema (10 models):
- Source: id, name, type, baseUrl, status, config
- CollectionRun: id, sourceId, status, startedAt, completedAt, stats
- Capture: id, collectionRunId, rawPayload, contentHash (SHA-256), mimeType
- NormalizedRecord: id, captureId, sourceId, handle, displayName, email, bio, registeredAt, attributes
- Quarantine: id, captureId, errorCode, errorMessage, rawPayload
- ResolutionCandidate: id, recordAId, recordBId, score, status (linked/review/rejected)
- GraphNode: id, type, entityId, attributes
- GraphEdge: id, sourceNodeId, targetNodeId, type, weight, metadata
- Outbox: id, eventType, payload, processedAt
- ProcessedMessage: id, messageId, processedAt

Graph Node Types: account, listing, post, thread, site, entity
Graph Edge Types: AUTHORED, REPLIED_TO, LISTED, REPUTATION_FOR, POSSIBLE_SAME_AS, INTERACTED_WITH

## Level 7 — Runtime (Execution Sequence)
1. Generator seeds 5 databases with synthetic world (12 phases)
2. Activity simulator runs continuous state machines (ORDER lifecycle)
3. Collection adapters fetch from 5 sites via HTTP (optionally through Tor SOCKS proxy)
4. Raw payloads stored in MinIO with SHA-256 content hash
5. Pipeline processor deduplicates and routes to parsers
6. Parsers normalize to CanonicalRecord; failures go to Quarantine
7. Outbox events emitted to Redis Streams
8. Entity resolver generates blocking keys, computes pairwise scores
9. Scores classified: auto-link (≥0.92), review (0.70-0.919), reject (<0.70)
10. GraphProjector creates nodes/edges in PostgreSQL
11. Analyst queries via API → graph traversal (recursive CTE) or RAG question
12. RAG assembles context (top-20 records, BM25+recency), queries Ollama, returns structured JSON
13. WolverineDB can verify data integrity via Merkle proofs and BFT consensus

## Level 8 — Security
Trust Boundaries:
- DMZ: tor-gateway (read-only, rate-limited, GET/HEAD only)
- Internal: wolverine-api + all databases + source sites
- Truth: postgres-truth (logically isolated Docker network)

Security Controls:
- RBAC: 5 roles (admin, operator, researcher, reviewer, public_demo)
- Tor gateway: blocks POST/PUT/DELETE/PATCH, blocks /admin /metrics /seed /debug
- Rate limiting: 10 req/s, burst 20
- Security headers: X-Synthetic-Research, X-Content-Type-Options, X-Frame-Options
- RAG sanitization: 4-rule adversarial input defense
- WolverineDB: Ed25519 signatures, SHA-256 chains, BFT 4-of-5 quorum

Known Limitations:
- Docker network isolation is NOT physical air-gap
- BFT runs in single-process (DirectMemoryNetworkTransport)
- EVM anchoring is in-memory simulation
- KMS uses local deterministic signing (no actual HSM)

## Level 9 — Evidence
Tests:
- wolverine/tests/: 6 test files (ai, api, graph, parsers, quarantine, resolver)
- wolverine-db/tests/: 219+ tests across 87+ suites (security, BFT, survivability)
- evaluator: Static metrics (P=0.9280, R=0.4598, F1=0.6149) — hardcoded, not dynamic
- Tor safety: test-tor-safety.sh (8/8 checks passed)
- Ecosystem: verify_full_ecosystem.py (65/65 checks passed)
- Scenarios: 5 adversarial evaluation scenarios all passed

Limitations:
- Evaluation metrics are static string literals, not dynamic empirical results
- No load testing or stress testing documented
- No multi-host deployment tested
- Graph traversal tested only on synthetic data
- RAG quality not formally evaluated
