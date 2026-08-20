# COMPLETE DATA FLOW — WOLVERINE SIH

Trace every data transition from source to presentation.

## Stage 1: Synthetic World Generation
- **Producer**: generator/src/generator/engine.py (SyntheticWorldEngine)
- **Algorithm**: 12 deterministic phases with seed S₀
- **Output**: Populated databases for all 5 sites + ground truth in postgres-truth
- **Data structures**: Site-specific SQL schemas (users, listings, posts, orders, messages, reputation)
- **Persistence**: Direct SQL INSERT into postgres-sites (Atlas, Briar, Drift, Ember databases), mysql-site-c (Cinder), postgres-truth (ground truth pairs)
- **Serialization**: Native SQL
- **Error behavior**: Validation phase (12) catches constraint violations
- **Evidence**: Generated deterministically from seed; verified by benchmark-scale.py

## Stage 2: Activity Simulation
- **Producer**: Generator activity simulator (background daemon)
- **Consumer**: Source site databases
- **Data structure**: State machine transitions (ORDER_CREATED → PAYMENT_SIMULATED → ESCROW_SIMULATED → SELLER_CONFIRMED → SHIPPED_SIMULATED → COMPLETED)
- **Persistence**: UPDATE/INSERT into source databases
- **Error behavior**: State machine enforces valid transitions only
- **Evidence**: Continuous background process

## Stage 3: Collection / Scraping
- **Producer**: wolverine/src/collector/adapters.ts
- **Consumer**: wolverine/src/pipeline/processor.ts
- **5 Adapters**:
  - AtlasRestAdapter: HTTP GET → JSON response → CaptureResult
  - BriarHtmlAdapter: HTTP GET → HTML response → Cheerio parse → CaptureResult
  - CinderJsonApiAdapter: HTTP GET → JSON:API response → CaptureResult
  - DriftHybridAdapter: HTTP GET → HTML+JSON → CaptureResult
  - EmberGraphqlAdapter: HTTP POST → GraphQL query → JSON response → CaptureResult
- **Transport**: HTTP via socks-proxy-agent (Tor SOCKS5 when enabled)
- **Data structure**: CaptureResult { rawPayload: Buffer, contentHash: string (SHA-256), mimeType: string, sourceId: string }
- **Serialization**: Raw HTTP response bytes
- **Error behavior**: Network errors caught; failed captures do not crash pipeline
- **Evidence**: Real HTTP traffic between containers within Docker network

## Stage 4: Raw Capture Storage
- **Producer**: Collection adapters
- **Consumer**: MinIO S3
- **Data structure**: Raw byte payload with SHA-256 content-addressed key
- **Persistence**: MinIO object storage (S3-compatible)
- **Serialization**: Binary blob
- **Error behavior**: SHA-256 dedup prevents duplicate storage
- **Evidence**: Real MinIO container running real S3 protocol

## Stage 5: Capture Database Record
- **Producer**: Pipeline processor
- **Consumer**: Prisma → postgres-wolverine
- **Data structure**: Capture model { id, collectionRunId, rawPayload, contentHash, mimeType }
- **Persistence**: PostgreSQL via Prisma ORM
- **Error behavior**: Database transaction ensures atomicity

## Stage 6: Parsing & Normalization
- **Producer**: wolverine/src/normalizer/parsers.ts (5 parsers)
- **Consumer**: NormalizedRecord or Quarantine tables
- **5 Parsers**:
  - AtlasParser: JSON → CanonicalRecord
  - BriarParser: HTML → Cheerio DOM → CanonicalRecord (checks for synthetic banner)
  - CinderParser: JSON:API → CanonicalRecord
  - DriftParser: JSON topic → CanonicalRecord
  - EmberParser: GraphQL response → CanonicalRecord
- **Data structure**: CanonicalRecord { handle, displayName, email, bio, registeredAt, sourceId, attributes }
- **Error behavior**: Malformed payloads → Quarantine { errorCode, errorMessage, rawPayload }
- **Validation**: Against contracts/canonical-record.schema.json
- **Evidence**: Real parsing code with Cheerio HTML parsing

## Stage 7: Outbox Event Emission
- **Producer**: Pipeline processor
- **Consumer**: Redis Streams
- **Data structure**: Outbox { eventType: 'RecordNormalizedEvent', payload: JSON }
- **Persistence**: Written to Outbox table (PostgreSQL) AND Redis Stream
- **Serialization**: JSON
- **Pattern**: Transactional Outbox — database write and event emission in same transaction
- **Error behavior**: At-least-once delivery via Redis consumer groups

## Stage 8: Entity Resolution
- **Producer**: wolverine/src/resolver/entity_resolver.ts
- **Consumer**: ResolutionCandidate table
- **Algorithm**:
  1. Generate blocking keys: (alias_prefix_3, email_domain, registration_week)
  2. Within each block, compute pairwise composite scores:
     S = 0.30·alias_jw + 0.15·display_jw + 0.20·temporal + 0.15·activity + 0.20·crosssite
  3. Classify: ≥0.92 → linked, 0.70-0.919 → review, <0.70 → rejected
- **Data structure**: ResolutionCandidate { recordAId, recordBId, score, status }
- **Persistence**: PostgreSQL via Prisma
- **Error behavior**: Blocking key generation is deterministic; no external dependencies
- **Evidence**: Algorithm constants verified from source code

## Stage 9: Graph Projection
- **Producer**: wolverine/src/graph/projector.ts (GraphProjector)
- **Consumer**: GraphNode and GraphEdge tables (PostgreSQL)
- **Algorithm**: Creates nodes for accounts, listings, posts. Creates edges for relationships (AUTHORED, REPLIED_TO, LISTED, REPUTATION_FOR, POSSIBLE_SAME_AS, INTERACTED_WITH)
- **Data structures**:
  - GraphNode { id, type, entityId, attributes }
  - GraphEdge { id, sourceNodeId, targetNodeId, type, weight, metadata }
- **6 Node types**: account, listing, post, thread, site, entity
- **6 Edge types**: AUTHORED, REPLIED_TO, LISTED, REPUTATION_FOR, POSSIBLE_SAME_AS, INTERACTED_WITH
- **Persistence**: PostgreSQL (NOT Neo4j — this is a critical correction)
- **Evidence**: Prisma schema defines these models

## Stage 10: Graph Query / BFS Traversal
- **Producer**: API request (GET /v1/graph/query)
- **Consumer**: Analyst (via frontend or API)
- **Algorithm**: PostgreSQL Recursive CTE with depth ≤ 4 and limit 500 nodes
- **Also**: In-memory BFS in GraphProjector for bounded traversal
- **Data structure**: Subgraph { nodes: GraphNode[], edges: GraphEdge[] }
- **Serialization**: JSON response
- **Error behavior**: Hard limits prevent runaway queries
- **Evidence**: Recursive CTE confirmed in established facts; BFS in projector.ts

## Stage 11: RAG / AI Analysis
- **Producer**: POST /v1/analysis/questions
- **Consumer**: Analyst (via frontend)
- **Pipeline**:
  1. sanitizeText(): Strip control chars, truncate 500, strip injection patterns, token limit
  2. Filter records by time window and keywords
  3. Assemble context: Top-20 records ranked by BM25 + recency (cap 12,000 tokens)
  4. Construct prompt with strict JSON output schema
  5. Query Ollama (local, 5000ms timeout)
  6. Parse structured response
- **Output**: { answer, confidence, citations: [{recordId, excerpt}], limitations }
- **Fallback**: If Ollama offline/timeout → heuristic response with confidence 0.75 citing top 3 records
- **Graceful degradation**: If completely unavailable → {answer: 'AI analysis unavailable', confidence: 0}
- **Evidence**: Real Ollama container; real sanitization regex

## Stage 12: Frontend Presentation
- **Producer**: Vzeya (Next.js) + Dashboard routes
- **Consumer**: Analyst (human)
- **Data flow**: Dashboard pages use static mock data (executionData.ts). Zero fetch() calls to backend API.
- **Vzeya narrative**: 4-phase scroll (boot → particles → carousel → 3D terminals)
- **3D terminals**: Link to dashboard routes (/threat, /intelligence, /demonstration, etc.)
- **Evidence**: Frontend is 100% static/mock. No live backend integration.

## Stage 13: WolverineDB Integrity Verification (Parallel Track)
- **Producer**: WolverineDB trust engine
- **Consumer**: Auditor (via offline trust receipts)
- **Pipeline**:
  1. Database mutations captured via PostgreSQL WAL/CDC triggers
  2. Mutations normalized to canonical binary format (RFC 8785 JCS + TaggedField)
  3. SHA-256 hash chain computed (computeChangeHash)
  4. Merkle tree updated (RFC 6962)
  5. BFT consensus: 4-of-5 validator attestations required
  6. QuorumCertificate generated and persisted to PersistentTrustLedger
  7. Offline trust receipts generated (self-contained, air-gap-verifiable)
- **Evidence**: Real crypto code (node:crypto). Network transport is in-memory (simulated).
