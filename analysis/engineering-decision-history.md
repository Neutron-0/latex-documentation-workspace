# ENGINEERING DECISION HISTORY

*Source: d:\Vault\chats\ — Extracted conclusions from design sessions*
*Evidence Class: Design documentation (secondary to source code)*

## Project Lineage

### Naming & Competition Context
- Event: Smart India Hackathon (SIH), August 2026
- Problem: Detecting coordinated illicit behavior across technically isolated, multi-jurisdiction online platforms
- Primary Author: Harsh Solanki (@solankiharsh2837)
- License: MIT across both wolverine-sih and wolverine-db

### Architectural Bifurcation
1. Wolverine → initial cross-platform entity resolution pipeline
2. Wolverine SIH → full intelligence analysis platform (14 containers, 5 synthetic sites)
3. WolverineDB → extracted as independent cryptographic trust layer (13 milestones, 91 specs)

## Master Decision Register

### D01: Graph Engine → PostgreSQL Recursive CTEs
- Chosen: PostgreSQL adjacency tables with WITH RECURSIVE (depth ≤ 4, max 500 nodes)
- Rejected: Neo4j / Dgraph — excessive operational overhead for <1M edges
- Rationale: PostgreSQL handles 500k edges in <100ms; zero additional daemon dependency
- Impact: Zero graph DB dependencies; instant SQL migrations and joins
- Code: wolverine/src/graph/projector.ts, PostgreSQL recursive CTE queries

### D02: Event Bus → Redis Streams + Outbox Pattern
- Chosen: Redis Streams with Consumer Groups and transactional Outbox
- Rejected: Kafka/RabbitMQ (over-engineered), direct pub/sub (message loss)
- Rationale: Lightweight, reliable event ordering with at-least-once delivery
- Impact: Guaranteed delivery between normalizer and processors
- Code: docker-compose.yml Redis service, Outbox Prisma model

### D03: Entity Resolution Complexity → Blocking Keys
- Chosen: Multi-attribute blocking (3-char alias prefix, email domain, registration week)
- Rejected: Exhaustive O(N²) pairwise comparison — intractable for 89.6k accounts
- Rationale: Reduces comparison space from ~4×10⁹ pairs to linear buckets
- Code: wolverine/src/resolver/entity_resolver.ts generateBlockingKey()

### D04: Resolution Optimization → Precision-First
- Chosen: Threshold ≥0.92 auto-link, 0.70-0.919 review queue, <0.70 reject
- Rejected: Recall-first optimization — noisy decoys cause false entity mergers
- Rationale: False accusations (FP) catastrophic in investigative/legal context
- Impact: 92.80% precision, 45.98% recall, F1=0.6149
- Code: entity_resolver.ts evaluatePair() thresholds

### D05: Raw Capture Storage → MinIO S3
- Chosen: MinIO with SHA-256 content addressing
- Rejected: Storing blobs in PostgreSQL — table bloat and write amplification
- Rationale: Immutable audit log decoupled from normalized relational data
- Code: docker-compose.yml MinIO service, collector/adapters.ts

### D06: AI/RAG → Local Ollama with Citation Schema
- Chosen: Local Ollama LLM with 4-rule sanitization and structured JSON output
- Rejected: Cloud LLM APIs — data leakage; free-form output — hallucinations
- Rationale: Air-gapped demo capability; citation schema prevents hallucinations
- Output: {answer, confidence, citations, limitations} with graceful offline fallback
- Code: wolverine/src/ai/rag.ts AIAssistant class

### D07: Evaluation Isolation → Air-Gapped Truth Vault
- Chosen: Separate PostgreSQL instance on isolated Docker network (wolverine-truth)
- Rejected: Shared evaluation tables in primary DB — fatal methodological flaw
- Rationale: Eliminates evaluation oracle leakage
- Code: docker-compose.yml postgres-truth on wolverine-truth network (internal:true)

### D08: Tor Gateway → Nginx Read-Only Proxy
- Chosen: Nginx with GET/HEAD only, rate limiting (10r/s burst 20), route masking
- Rejected: Open bidirectional Tor proxying; direct port mapping
- Rationale: Safe demo access without exposing admin/mutation endpoints
- Code: tor-gateway/nginx.conf, tor-gateway/torrc

### D09: Source Site Heterogeneity → 5 Distinct Stacks
- Chosen: Node/Postgres, Django/Postgres, PHP/MySQL, Go/Chi+Redis, Rust/Axum
- Rejected: Monolithic shared framework — unrealistic architecture
- Rationale: Models real-world multi-stack, multi-protocol collection challenge
- Code: sites/atlas-market, sites/briar-bazaar, sites/cinder-exchange, sites/drift-forum, sites/ember-commons

### D10: Synthetic Data → 100% Deterministic Generation
- Chosen: Whitelist lexicons, SYNTHETIC banners, deterministic seed
- Rejected: Real darknet scraping / real user data — legal/ethical violations
- Rationale: Zero PII, zero payment rails, perfect reproducibility
- Code: generator/src/generator/engine.py SyntheticWorldEngine

### D11: WolverineDB Consensus → 5-Node BFT (4-of-5)
- Chosen: 4-of-5 validator attestations (3f+1 model)
- Rejected: Single-signature central coordinator
- Rationale: Byzantine fault tolerance; fail-closed semantics
- Code: wolverine-db/src/trust_network/consensus.ts TrustConsensusEngine

### D12: Merkle Tree → RFC 6962 Standard
- Chosen: Bounded leafCount, 0x00/0x01 domain prefixing
- Rejected: Naive binary tree — CVE-level root collision (VULN-001)
- Code: wolverine-db/src/crypto/merkle.ts MerkleTree class

### D13: Data Canonicalization → RFC 8785 JCS + TaggedField
- Chosen: JSON Canonicalization Scheme + length-prefixed binary tuples
- Rejected: Unordered JSON / delimiter strings — injection/ambiguity
- Code: wolverine-db/src/crypto/canonical.ts

### D14: Ledger Concurrency → Serialized Mutex Queue
- Chosen: Mutex append queue for trust ledger
- Rejected: Unlocked async file append — race conditions
- Code: wolverine-db/src/trust_network/ledger.ts PersistentTrustLedger

### D15: Checkpoint Atomicity → Kernel-Level O_CREAT|O_EXCL
- Chosen: Atomic exclusive file creation (Node.js 'wx' flag)
- Rejected: check-then-write — TOCTOU race (VULN-009)
- Code: LocalCheckpointStore

### D16: Receipt Verification → Offline Air-Gap Proofs
- Chosen: Self-contained receipts with Merkle path + quorum signatures
- Rejected: Online API verification — compromised infra could lie
- Code: ImmutableTrustReceiptVerifier, OfflineTrustProofVerifier

## WolverineDB Milestone Evolution (v0.1.0 → v1.3.0)

Document all 13 milestones with their focus areas:
- v0.1.0: State Integrity Foundation (SHA-256, Merkle, Ed25519)
- v0.2.0: External Evidence & PostgreSQL WAL/CDC
- v0.3.0: External Cryptographic Anchoring (EVM, Consensus)
- v0.4.0: Sentinel Behavioral Self-Healing
- v0.5.0: Distributed Security Fabric
- v0.6.0: Verified State Reconstruction
- v0.7.0: Continuous State Reconstruction
- v0.8.0: Trust Network Protocol (4-of-5 BFT)
- v0.9.0: Distributed Trust Runtime
- v1.0.0: Production Trust Service
- v1.1.0: Byzantine Resilience (Collusion, Key Rotation)
- v1.2.0: Survivability (Crash-Safe Journals)
- v1.3.0: Cryptographic & Concurrency Hardening

Phase groupings:
1. Local Integrity (v0.1-v0.3)
2. Self-Healing (v0.4-v0.7)
3. Decentralized BFT (v0.8-v1.0)
4. Hardening (v1.1-v1.3)

## Security Audit Remediation

### Cryptographic Audit (9 Findings)
VULN-001 Critical: Merkle odd-leaf root collision → RFC 6962 (WDB-0002)
VULN-002 Critical: Signature encoding ambiguity → RFC 8785 JCS (WDB-0130)
VULN-003 Critical: Attestation digest ambiguity → Tagged binary (WDB-0130)
VULN-004 Critical: Role check substring bypass → Exact enum (WDB-0133)
VULN-005 High: Multi-field preimage length omission → 4-byte prefix
VULN-006 High: Key rotation payload omission → Atomic multi-field sig
VULN-007 High: SQL identifier injection → quote_ident()
VULN-008 High: Missing trigger write body → JSON row serialization
VULN-009 Medium: Path traversal checkpoint → Path normalization + root jail

### Concurrency Audit (6 Findings)
1. Recovery scope escape → Exact scope resolution (WDB-0133)
2. Ledger append race → Serialized mutex (WDB-0131)
3. Checkpoint TOCTOU → Atomic O_CREAT|O_EXCL (WDB-0132)
4. Keypair mismatch → Mathematical derivation verification (WDB-0134)
5. Locale-dependent ordering → UTF-8 byte collation (WDB-0135)
6. Signature encoding ambiguity → Protocol tuples (WDB-0130)

## Real vs Simulated Demarcation

| Subsystem | REAL | SIMULATED |
|---|---|---|
| 5 Web Applications | Real backend code, routing, HTML/JSON rendering, DB queries | Fictional user identities, synthetic personas |
| Source Databases | Real PostgreSQL×3, MySQL, Redis instances | Data from deterministic synthetic seed |
| Data Normalization | Real multi-protocol adapters (REST, scraping, JSON:API, GraphQL) | Records originate from synthetic backends |
| Entity Resolution | Real Jaro-Winkler, blocking keys, recursive CTE graph | Ground truth from generator definition only |
| WolverineDB Crypto | Real SHA-256, RFC 6962 Merkle, Ed25519, BFT 4/5 | Network transport via DirectMemoryNetworkTransport |
| Financial/Payments | Real order/escrow state machines | Fictional Bitcoin addresses, simulated settlement |
| Tor Gateway | Real Nginx proxy, rate limiting, security headers | Onion addresses route to synthetic containers |
| EVM Anchoring | Real hashing/commitment payload generation | In-memory Map-based simulated blockchain |
| Cloud KMS/HSM | Real ISigningProvider interface | Deterministic local Ed25519 (simulates AWS KMS) |

## Source Site Architecture

| Site | Name | Stack | DB | API Format | ID Scheme | Pagination |
|---|---|---|---|---|---|---|
| A | Atlas Market | Node.js 20 / Express / Next.js | PostgreSQL 16 | REST JSON | ULID | Cursor-based |
| B | Briar Bazaar | Python 3.12 / Django | PostgreSQL 16 | Server-rendered HTML | Integer | Page-number |
| C | Cinder Exchange | PHP 8.3 / Laravel | MySQL 8.4 | JSON:API | UUID v4 | Offset/Limit |
| D | Drift Forum | Go 1.22 / Chi | PostgreSQL 16 + Redis 7.2 | Hybrid HTML+REST | Base32 | Page-number |
| E | Ember Commons | Rust 1.78 / Axum | SQLite/PostgreSQL 16 | GraphQL (Relay) | Tagged NanoID | Relay Cursor |

## Evaluation Scenarios

| Scenario | Purpose | Result |
|---|---|---|
| alias-bridge | Cross-site identity linkage via handle similarity | ✅ Correctly unified accounts across 3 platforms |
| reputation-ring | Detecting coordinated mutual-rating rings | ✅ All colluding nodes identified, zero FP edges |
| migration-noise | Platform departure/re-emergence amid decoys | ✅ Decoys filtered, true migration path traced |
| source-drift | Pipeline resilience on schema changes | ✅ Invalid payloads quarantined, pipeline continued |
| partial-outage | Resilience during network/container failure | ✅ Redis outbox buffered; full replay on restart |

## Composite Scoring Formula

$$S = 0.30 \cdot S_{\text{alias}} + 0.15 \cdot S_{\text{name}} + 0.20 \cdot S_{\text{temporal}} + 0.15 \cdot S_{\text{activity}} + 0.20 \cdot S_{\text{behavioral}}$$

Where:
- $S_{\text{alias}}$ = Jaro-Winkler handle similarity
- $S_{\text{name}}$ = Display name token-set similarity
- $S_{\text{temporal}}$ = Account creation time window proximity
- $S_{\text{activity}}$ = Concurrent activity overlap / active hour distribution
- $S_{\text{behavioral}}$ = Cross-site bio vocabulary fingerprinting

### Classification Boundaries
- Score ≥ 0.92 → AUTO_LINK
- 0.70 ≤ Score < 0.92 → REVIEW_QUEUE
- Score < 0.70 → REJECT
