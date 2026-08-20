# Final Source-Traceability Audit (Top 100 Claims)

This document provides rigorous, end-to-end evidence mapping for 100 major architectural, algorithmic, security, and operational claims in the 85-page monograph against the verified source codebases.

---

## Part 1: Core Entity Resolution & Graph Projection (Claims 1–25)

| # | Monograph Claim | Repository | File Path | Class / Function / Symbol | Runtime / Test Evidence | Section |
|---|---|---|---|---|---|---|
| 1 | Deterministic 3-character prefix blocking key | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | generateBlockingKey() | 	ests/resolver.test.js | Ch 4, App F |
| 2 | Registration week temporal bucket in blocking key | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | generateBlockingKey() | 	ests/resolver.test.js | Ch 4, App F |
| 3 | Email domain component in blocking key | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | generateBlockingKey() | 	ests/resolver.test.js | Ch 4, App F |
| 4 | Jaro string similarity algorithm implementation | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | jaro() | 	ests/resolver.test.js | Ch 4, App F |
| 5 | Jaro-Winkler prefix bonus with =0.1$ and $\ell \le 4$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | jaroWinkler() | 	ests/resolver.test.js | Ch 4, App F |
| 6 | Linear temporal proximity decay over 30-day window | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 84 | 	ests/resolver.test.js | Ch 4, App F, App H |
| 7 | Alias similarity feature weight  = 0.30$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 94 | 	ests/resolver.test.js | Ch 4, App F |
| 8 | Display name similarity feature weight  = 0.15$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 95 | 	ests/resolver.test.js | Ch 4, App F |
| 9 | Temporal proximity feature weight  = 0.20$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 96 | 	ests/resolver.test.js | Ch 4, App F |
| 10 | Activity overlap static baseline constant .5$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 88 | 	ests/resolver.test.js | Ch 4, App F |
| 11 | Activity overlap feature weight  = 0.15$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 97 | 	ests/resolver.test.js | Ch 4, App F |
| 12 | Cross-site cue feature weight  = 0.20$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 98 | 	ests/resolver.test.js | Ch 4, App F |
| 13 | 4-character prefix match for cross-site cue | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 90 | 	ests/resolver.test.js | Ch 4, App F |
| 14 | Automated linkage confidence threshold $\ge 0.92$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 104 | 	ests/resolver.test.js | Ch 4, App F, App H |
| 15 | Human review queue confidence threshold .70 \le S < 0.92$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 106 | 	ests/resolver.test.js | Ch 4, App F, App H |
| 16 | Rejection classification for confidence  < 0.70$ | wolverine-sih | wolverine/src/resolver/entity_resolver.ts | evaluatePair() line 108 | 	ests/resolver.test.js | Ch 4, App F, App H |
| 17 | In-memory node store using JavaScript Map | wolverine-sih | wolverine/src/graph/projector.ts | GraphProjector.nodes | 	ests/graph.test.js | Ch 2, Ch 4, App H |
| 18 | In-memory edge store using composite key Map | wolverine-sih | wolverine/src/graph/projector.ts | GraphProjector.edges | 	ests/graph.test.js | Ch 2, Ch 4, App H |
| 19 | Bounded BFS traversal query engine | wolverine-sih | wolverine/src/graph/projector.ts | queryGraph() line 125 | 	ests/graph.test.js | Ch 2, Ch 4, App H |
| 20 | Maximum BFS depth limit strictly clamped to  \le 4$ | wolverine-sih | wolverine/src/graph/projector.ts | queryGraph() line 145 | 	ests/graph.test.js | Ch 4, App F, App H |
| 21 | Maximum graph query node limit capped at  \le 500$ | wolverine-sih | wolverine/src/graph/projector.ts | queryGraph() line 160 | 	ests/graph.test.js | Ch 4, App F, App H |
| 22 | Graph node types: account, listing, post, message | wolverine-sih | packages/shared-types/src/index.ts | GraphNodeType enum | 	ests/graph.test.js | Ch 3, App C |
| 23 | Graph edge types: AUTHORED, REPLIED_TO, LISTED, etc. | wolverine-sih | packages/shared-types/src/index.ts | GraphEdgeType enum | 	ests/graph.test.js | Ch 3, App C |
| 24 | Dynamic projection of POSSIBLE_SAME_AS edges | wolverine-sih | wolverine/src/graph/projector.ts | projectLink() | 	ests/graph.test.js | Ch 4, App H |
| 25 | Total absence of WITH RECURSIVE SQL in graph path | wolverine-sih | wolverine/src/graph/projector.ts | Entire file (in-memory) | Verified in code audit | Ch 2, Ch 4, App H |

---

## Part 2: Normalization, Ingestion & Data Architecture (Claims 26–50)

| # | Monograph Claim | Repository | File Path | Class / Function / Symbol | Runtime / Test Evidence | Section |
|---|---|---|---|---|---|---|
| 26 | Atlas Market REST JSON adapter implementation | wolverine-sih | wolverine/src/collector/adapters.ts | AtlasRestAdapter | 	ests/parsers.test.js | Ch 3, App A |
| 27 | Briar Bazaar HTML scraping adapter via Cheerio | wolverine-sih | wolverine/src/collector/adapters.ts | BriarHtmlAdapter | 	ests/parsers.test.js | Ch 3, App A |
| 28 | Cinder Exchange JSON:API protocol adapter | wolverine-sih | wolverine/src/collector/adapters.ts | CinderJsonApiAdapter | 	ests/parsers.test.js | Ch 3, App A |
| 29 | Drift Forum hybrid REST/HTML topic adapter | wolverine-sih | wolverine/src/collector/adapters.ts | DriftHybridAdapter | 	ests/parsers.test.js | Ch 3, App A |
| 30 | Ember Commons GraphQL Relay query adapter | wolverine-sih | wolverine/src/collector/adapters.ts | EmberGraphqlAdapter | 	ests/parsers.test.js | Ch 3, App A |
| 31 | MinIO S3 raw byte capture storage with SHA-256 | wolverine-sih | docker-compose.yml | minio service | 	ests/quarantine.test.js | Ch 3, App G |
| 32 | Transactional Outbox pattern via PostgreSQL outbox table | wolverine-sih | wolverine/prisma/schema.prisma | model Outbox | 	ests/api.test.js | Ch 3, App C |
| 33 | Event streaming via Redis Streams consumer groups | wolverine-sih | docker-compose.yml | edis service (7.2) | 	ests/api.test.js | Ch 3, App G |
| 34 | Schema quarantine table for contract violations | wolverine-sih | wolverine/prisma/schema.prisma | model Quarantine | 	ests/quarantine.test.js | Ch 3, App C |
| 35 | Canonical record schema specification | wolverine-sih | contracts/canonical-record.schema.json | JSON Schema definition | Schema validation tests | Ch 3, App C |
| 36 | 10 normative Prisma models in schema.prisma | wolverine-sih | wolverine/prisma/schema.prisma | 10 model declarations | Prisma DB push verification | Ch 3, App C |
| 37 | SHA-256 payload deduplication in processing pipeline | wolverine-sih | wolverine/src/pipeline/processor.ts | ProcessingOrchestrator | 	ests/quarantine.test.js | Ch 3 |
| 38 | Atlas Market Node/Express/PostgreSQL backend | wolverine-sih | sites/atlas-market/src/server.ts | Express application | Docker healthcheck | Ch 1, App B |
| 39 | Briar Bazaar Python/Django/PostgreSQL backend | wolverine-sih | sites/briar-bazaar/marketplace/views.py | Django view router | Docker healthcheck | Ch 1, App B |
| 40 | Cinder Exchange PHP/Laravel/MySQL backend | wolverine-sih | sites/cinder-exchange/public/index.php | Laravel kernel | Docker healthcheck | Ch 1, App B |
| 41 | Drift Forum Go/Chi/PostgreSQL backend | wolverine-sih | sites/drift-forum/main.go | Chi router | Docker healthcheck | Ch 1, App B |
| 42 | Ember Commons Rust/Axum/PostgreSQL backend | wolverine-sih | sites/ember-commons/src/main.rs | Axum GraphQL router | Docker healthcheck | Ch 1, App B |
| 43 | Multi-database container topology (3 Postgres, 1 MySQL) | wolverine-sih | docker-compose.yml | Service definitions | docker-compose ps | Ch 2, App G |
| 44 | Isolated wolverine-truth Docker bridge network | wolverine-sih | docker-compose.yml | 
etworks.wolverine-truth | docker network inspect | Ch 2, Ch 6, App G |
| 45 | wolverine-internal service network | wolverine-sih | docker-compose.yml | 
etworks.wolverine-internal | docker network inspect | Ch 2, Ch 6, App G |
| 46 | wolverine-dmz public-facing ingress network | wolverine-sih | docker-compose.yml | 
etworks.wolverine-dmz | docker network inspect | Ch 2, Ch 6, App G |
| 47 | 12-phase Synthetic World Engine pipeline | wolverine-sih | generator/src/generator/engine.py | SyntheticWorldEngine | enchmark-scale.py | Ch 1, App B |
| 48 | 50,000 synthetic canonical persona generation | wolverine-sih | generator/src/generator/engine.py | Phase 1 execution | Generator execution logs | Ch 1, App B |
| 49 | Deterministic PRNG seeding ($) | wolverine-sih | generator/src/generator/engine.py | Random seed config | Reproducibility tests | Ch 1, App B |
| 50 | Ground truth export directly to postgres-truth | wolverine-sih | generator/src/generator/engine.py | Phase 12 validation | erify_full_ecosystem.py | Ch 1, Ch 9 |

---

## Part 3: WolverineDB Cryptographic Trust Layer (Claims 51–75)

| # | Monograph Claim | Repository | File Path | Class / Function / Symbol | Runtime / Test Evidence | Section |
|---|---|---|---|---|---|---|
| 51 | SHA-256 linear hash chain computation | wolverine-db | src/crypto/hash.ts | computeChangeHash() | 	ests/security.test.ts | Ch 5, App E |
| 52 | RFC 6962 compliant Merkle tree construction | wolverine-db | src/crypto/merkle.ts | MerkleTree class | 	ests/security.test.ts | Ch 5, App E |
| 53 | Leaf node prefix separation byte  x00 | wolverine-db | src/crypto/merkle.ts | hashLeaf() line 42 | 	ests/security.test.ts | Ch 5, App E |
| 54 | Interior node prefix separation byte  x01 | wolverine-db | src/crypto/merkle.ts | hashInterior() line 58 | 	ests/security.test.ts | Ch 5, App E |
| 55 | Bounded leaf count validation against collision attacks | wolverine-db | src/crypto/merkle.ts | computeRoot() validation | 	ests/bft_hardening/ | Ch 5, App E |
| 56 | Ed25519 asymmetric cryptographic signatures | wolverine-db | src/crypto/hash.ts | 
ode:crypto.sign | 	ests/security.test.ts | Ch 5, App E |
| 57 | RFC 8785 JSON Canonicalization Scheme (JCS) | wolverine-db | src/crypto/canonical.ts | canonicalize() | 	ests/security.test.ts | Ch 5, App E |
| 58 | Tagged binary field pre-image encoding | wolverine-db | src/crypto/canonical.ts | encodeTaggedField() | 	ests/security.test.ts | Ch 5, App E |
| 59 | 4-of-5 Byzantine Fault Tolerant consensus engine | wolverine-db | src/trust_network/consensus.ts | TrustConsensusEngine | 	ests/bft_hardening/ | Ch 5, App E |
| 60 | Quorum Certificate generation upon 4 valid attestations | wolverine-db | src/trust_network/consensus.ts | generateQuorumCertificate()| 	ests/bft_hardening/ | Ch 5, App E |
| 61 | Linearized mutex queue in persistent trust ledger | wolverine-db | src/trust_network/ledger.ts | PersistentTrustLedger | 	ests/survivability/ | Ch 5, App E |
| 62 | In-memory simulated network transport | wolverine-db | src/runtime/network_transport.ts | DirectMemoryNetworkTransport| Single-process test runner | Ch 5, App E, App I |
| 63 | Simulated EVM smart contract anchoring via Map | wolverine-db | src/anchors/evm.ts | EvmAnchorClient | Unit test suite | Ch 5, App E |
| 64 | Deterministic local Ed25519 KMS/HSM simulation | wolverine-db | src/sentinel/policy_gate.ts | ISigningProvider mock | Unit test suite | Ch 5, App E |
| 65 | Behavioral baseline anomaly engine | wolverine-db | src/sentinel/anomaly_engine.ts | AnomalyEngine | 	ests/security.test.ts | Ch 5, App E |
| 66 | Policy authorization gating and role scoping | wolverine-db | src/sentinel/policy_gate.ts | PolicyGate | 	ests/security.test.ts | Ch 5, App E |
| 67 | Epoch rotation protocol for validator sets | wolverine-db | src/bft_hardening/epoch_rotation.ts | EpochRotationManager | 	ests/bft_hardening/ | Ch 5, App E |
| 68 | Key rotation with atomic multi-field signatures | wolverine-db | src/bft_hardening/key_rotation.ts | KeyRotationProtocol | 	ests/bft_hardening/ | Ch 5, App E |
| 69 | Collusion defense and Byzantine validator ejection | wolverine-db | src/bft_hardening/collusion_defense.ts| CollusionDefense | 	ests/bft_hardening/ | Ch 5, App E |
| 70 | Crash-safe write-ahead journaling | wolverine-db | src/survivability/crash_safe_journal.ts| CrashSafeJournal | 	ests/survivability/ | Ch 5, App E |
| 71 | Catastrophic cluster disaster recovery engine | wolverine-db | src/survivability/catastrophic_cluster.ts| ClusterRecovery | 	ests/survivability/ | Ch 5, App E |
| 72 | Offline self-contained trust receipt verifier | wolverine-db | src/engine/verifier.ts | StateVerifier | 	ests/security.test.ts | Ch 5, App E |
| 73 | MySQL foreign database WAL CDC adapter | wolverine-db | src/adapters/mysql.ts | MySqlAdapter | Adapter unit tests | Ch 5, App E |
| 74 | SQLite local database adapter | wolverine-db | src/adapters/sqlite.ts | SqliteAdapter | Adapter unit tests | Ch 5, App E |
| 75 | 91 Normative specifications (WDB-0001 to WDB-0135) | wolverine-db | specs/ | 91 Markdown spec files | Spec-to-code traceability | Ch 5, App E |

---

## Part 4: Frontends, Security & Evaluation (Claims 76–100)

| # | Monograph Claim | Repository | File Path | Class / Function / Symbol | Runtime / Test Evidence | Section |
|---|---|---|---|---|---|---|
| 76 | Vzeya Next.js 15 App Router structure | Vzeya | src/app/layout.tsx | Next.js root layout | pnpm dev execution | Ch 7 |
| 77 | 4-phase scroll state management via Zustand | Vzeya | src/lib/narrativeStore.ts | useNarrativeStore | Browser runtime test | Ch 7 |
| 78 | Smooth scroll velocity tracking via Lenis | Vzeya | src/components/narrative/NarrativeScroller.tsx | Lenis scroll handler | Browser runtime test | Ch 7 |
| 79 | GPU-accelerated WebGL particle mesh with Simplex noise | Vzeya | src/components/narrative/InteractiveParticlesMesh.tsx | RawShaderMaterial | WebGL canvas inspection | Ch 7, App H |
| 80 | CRT scanline effect via CSS epeating-linear-gradient | Vzeya | src/components/webgl/CRTPostProcessing.tsx | CSS style object | DOM stylesheet inspection | Ch 7, App H |
| 81 | Radial vignette effect via pure CSS adial-gradient | Vzeya | src/components/webgl/CRTPostProcessing.tsx | CSS style object | DOM stylesheet inspection | Ch 7, App H |
| 82 | Zero backend API route handlers inside Vzeya | Vzeya | src/app/ | Absence of src/app/api/ | Directory tree inspection | Ch 7, Ch 8 |
| 83 | Centralized static demonstration constants in Vzeya | Vzeya | src/lib/executionData.ts | ARCHITECTURE_PREVIEW etc. | Static file review | Ch 7, Ch 8 |
| 84 | Web Audio API synthetic audio oscillator engine | Vzeya | src/lib/audioManager.ts | AudioContext synth | Audio output verification | Ch 7 |
| 85 | 3D terminal corridor with 8 spatial HUD panels | Vzeya | src/components/narrative/Execution3DWorld.tsx | Drei <Html> overlays | 3D corridor view | Ch 7 |
| 86 | Analyst UI standalone React + Vite SPA container | wolverine-sih | nalyst-ui/package.json | Vite build config | Docker container port 5173 | Ch 8 |
| 87 | Mocked Neo4j and BiLSTM claims inside Analyst UI | wolverine-sih | nalyst-ui/src/data/mockMetrics.ts | Mock metric strings | UI label inspection | Ch 8 |
| 88 | CSS Flexbox chain representation for graph nodes | wolverine-sih | nalyst-ui/src/components/GraphView.tsx | Flexbox DOM layout | Rendered HTML DOM | Ch 8 |
| 89 | RAG input sanitization: 500-character truncation | wolverine-sih | wolverine/src/ai/rag.ts | sanitizeText() rule 2 | 	ests/ai.test.js | Ch 4, Ch 6 |
| 90 | RAG input sanitization: control character elimination | wolverine-sih | wolverine/src/ai/rag.ts | sanitizeText() rule 1 | 	ests/ai.test.js | Ch 4, Ch 6 |
| 91 | RAG input sanitization: prompt injection pattern redaction | wolverine-sih | wolverine/src/ai/rag.ts | sanitizeText() rule 3 | 	ests/ai.test.js | Ch 4, Ch 6 |
| 92 | Local Ollama LLM integration with 5000ms timeout | wolverine-sih | wolverine/src/ai/rag.ts | AIAssistant.query() | 	ests/ai.test.js | Ch 4, Ch 6 |
| 93 | Deterministic fallback heuristic scoring (.75$) | wolverine-sih | wolverine/src/ai/rag.ts | AIAssistant.fallback() | 	ests/ai.test.js | Ch 4, Ch 6 |
| 94 | Tor gateway Nginx read-only reverse proxy container | wolverine-sih | 	or-gateway/nginx.conf | Rate limit & GET filter | 	est-tor-safety.sh | Ch 6, App G |
| 95 | Tor gateway rate limiting: 10 req/s with burst 20 | wolverine-sih | 	or-gateway/nginx.conf | limit_req_zone line 12 | 	est-tor-safety.sh | Ch 6, App G |
| 96 | Tor gateway security header: X-Synthetic-Research: true | wolverine-sih | 	or-gateway/nginx.conf | proxy_set_header line 34 | 	est-tor-safety.sh | Ch 6, App G |
| 97 | 5-tier Role-Based Access Control middleware | wolverine-sih | wolverine/src/middleware/rbac.ts | equireRole() | 	ests/api.test.js | Ch 6, App D |
| 98 | Static evaluator metric baseline: Precision = 0.9280 | wolverine-sih | evaluator/src/evaluator/__main__.py | Hardcoded literal float | Python execution output | Ch 9 |
| 99 | Static evaluator metric baseline: Recall = 0.4598 | wolverine-sih | evaluator/src/evaluator/__main__.py | Hardcoded literal float | Python execution output | Ch 9 |
| 100 | Static evaluator metric baseline: F1 = 0.6149 | wolverine-sih | evaluator/src/evaluator/__main__.py | Hardcoded literal float | Python execution output | Ch 9 |
