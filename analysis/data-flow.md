### End-to-End Data Flow

#### Phase 1: Synthetic Population Generation
Source: generator/src/generator/engine.py
```
SyntheticWorldEngine.generate_all()
  │
  ├─ Phase 1: Generate canonical persons (50,000)
  ├─ Phase 2-3: Assign accounts to sites (probability distribution)
  ├─ Phase 4: Generate marketplace listings (~17,500)
  ├─ Phase 5: Simulate orders + escrow lifecycle
  ├─ Phase 6: Generate conversations + messages (~100,000)
  ├─ Phase 7: Generate forum posts + replies (~260,000)
  ├─ Phase 8: Generate reputation events (~100,000)
  ├─ Phase 9: Generate interactions (~500,000)
  ├─ Phase 10: Notifications + support tickets
  ├─ Phase 11: Inject noise (3-8% of truth links)
  ├─ Phase 12: Scenario overlays (alias-bridge, reputation-ring, migration-noise)
  └─ Phase 13: Validate integrity (referential, temporal, prohibited content)
```

#### Phase 2: Database Seeding
- generator/src/generator/exporters/ exports to PostgreSQL/MySQL
- scripts/seed_via_sql_files.py handles SQL seeding
- Truth links seeded into postgres-truth (Truth Vault)

#### Phase 3: Live Activity Simulation
Source: generator/src/generator/activity_simulator.py
- Continuous generation of new listings, orders, messages, forum activity
- Transaction state progression: ORDER_CREATED → PAYMENT_SIMULATED → ESCROW_SIMULATED → SELLER_CONFIRMED → SHIPPED_SIMULATED → COMPLETED
- All synthetic, no real financial transactions

#### Phase 4: HTTP Collection
Source: wolverine/src/collector/adapters.ts
- Adapters make HTTP requests to each site's API/pages
- Through Tor gateway in demo mode, direct in development
- Raw responses stored in MinIO (S3-compatible, bucket: 'captures')

#### Phase 5: Normalization
Source: wolverine/src/normalizer/parsers.ts
```
Raw HTTP → Site-Specific Parser → Canonical Record + Validation
  │
  ├─ AtlasParser: JSON → CanonicalAccountRecord + CanonicalListingRecord
  ├─ BriarParser: HTML (cheerio) → CanonicalListingRecord + CanonicalAccountRecord
  ├─ CinderParser: JSON:API → CanonicalListingRecord + CanonicalAccountRecord  
  ├─ DriftParser: JSON → CanonicalThreadRecord + CanonicalPostRecord
  └─ EmberParser: GraphQL → CanonicalListingRecord
```

All records include: schemaVersion, recordId (deterministic SHA-256 UUID), kind, source (siteId, sourceRecordId, locator), observedAt, occurredAt, attributes, relationships, provenance (captureId, rawSha256, parserVersion), dataClassification='synthetic-research'

#### Phase 6: Entity Resolution
Source: wolverine/src/resolver/entity_resolver.ts
```
Canonical Account Records → Blocking → Candidate Pairs → Feature Scoring → Decision
  │
  ├─ Blocking: 3 keys per account (handle prefix, registration week, email domain)
  ├─ Scoring: 5 weighted features (alias 0.30, display 0.15, temporal 0.20, activity 0.15, cue 0.20)
  └─ Decision: linked (≥0.92) / review (≥0.70) / rejected (<0.70)
```

#### Phase 7: Graph Projection
Source: wolverine/src/graph/projector.ts
- Canonical records projected to nodes and edges
- Resolution candidates projected as POSSIBLE_SAME_AS edges
- Multi-hop BFS traversal for graph queries

#### Phase 8: AI/RAG Analysis
Source: wolverine/src/ai/rag.ts
```
Analyst Question → Sanitize → Time-Window Filter → Keyword Match → LLM Prompt → Response
  │
  ├─ Sanitization: strip control chars, truncate 500, remove injection patterns, token bound
  ├─ Context: max 20 records within time window matching keywords
  ├─ LLM: Ollama llama3.2 with JSON format, 5s timeout
  └─ Fallback: deterministic 'Analytic hypothesis' with top-3 citations
```

#### Phase 9: Analyst Interface
- Wolverine API (port 4000): health, scenarios, records, graph queries, analysis, collection runs, resolution candidates
- Analyst UI (port 5173): React SPA consuming the API
- Role-based access: analyst/operator/reviewer via X-Wolverine-Role header
