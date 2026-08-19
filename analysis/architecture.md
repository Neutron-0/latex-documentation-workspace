# Architecture Reconstruction

## Infrastructure Layer (Docker Compose, 13 services)
**[VERIFIED]** Based on `docker-compose.yml`:
- **Databases**: 
  - `postgres-sites` (shared PostgreSQL 16 for Atlas/Briar/Drift/Ember)
  - `mysql-site-c` (MySQL 8.4 for Cinder)
  - `postgres-wolverine` (PostgreSQL 16 for WolverineDB)
  - `postgres-truth` (PostgreSQL 16 for Truth Vault, isolated on `wolverine-truth` network)
- **Services**: `redis` (7.2, streams), `minio` (object storage for captures)
- **Networks**: `wolverine-internal` (bridge), `wolverine-truth` (bridge, internal: true), `wolverine-dmz` (bridge)

## Data Pipeline Architecture
**[VERIFIED]** Flow from HTTP observation through to analyst UI:
1. **Collection**: [`wolverine/src/collector/adapters.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/collector/adapters.ts)
2. **Normalization**: [`wolverine/src/normalizer/parsers.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/normalizer/parsers.ts) (5 site-specific parsers: AtlasParser, BriarParser, CinderParser, DriftParser, EmberParser)
3. **Canonical Record Validation**: `@wolverine/shared-types` `checkCanonicalRecord()`
4. **Entity Resolution**: [`wolverine/src/resolver/entity_resolver.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/resolver/entity_resolver.ts) (EntityResolver class with Jaro-Winkler scoring)
5. **Graph Projection**: [`wolverine/src/graph/projector.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/graph/projector.ts) (GraphProjector with multi-hop BFS queries)
6. **AI/RAG Analysis**: [`wolverine/src/ai/rag.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/ai/rag.ts) (AIAssistant class with Ollama/llama3.2, 4-rule sanitization)
7. **API Server**: [`wolverine/src/api/server.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/api/server.ts)

## Entity Resolution Algorithm Details
**[VERIFIED]** From [`entity_resolver.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/resolver/entity_resolver.ts):
- **Blocking keys**: handle prefix (3 chars), registration week, email domain
- **5 weighted features**: 
  - aliasSimilarity (0.30, Jaro-Winkler)
  - displayNameSimilarity (0.15, Jaro-Winkler)
  - temporalProximity (0.20)
  - activityOverlap (0.15, fixed 0.5 baseline)
  - crossSiteCue (0.20)
- **Decision thresholds**: `>= 0.92` → linked, `>= 0.70` → review, `< 0.70` → rejected
- **Rule**: Cross-site only comparison (same-site pairs excluded)

## Normalization Strategy
**[VERIFIED]** From [`parsers.ts`](file:///d:/Vault/wolverine-sih/wolverine/src/normalizer/parsers.ts):
- **Atlas**: JSON API → CanonicalAccountRecord + CanonicalListingRecord
- **Briar**: HTML (cheerio parsing) → CanonicalListingRecord + CanonicalAccountRecord + contract drift detection
- **Cinder**: JSON:API format → CanonicalListingRecord + CanonicalAccountRecord
- **Drift**: JSON → CanonicalThreadRecord + CanonicalPostRecord
- **Ember**: GraphQL response → CanonicalListingRecord
- **Common Metadata**: All records include: SHA-256 raw hash, deterministic UUID (SHA-256 based), parser version, provenance chain

## Architecture Diagram
**[INFERRED]** Logical flow based on documented structure:
```
[Synthetic Ecosystem]           [Wolverine Pipeline]                 [Analyst Tools]
+-----------------+             +------------------+                 +-------------+
| Atlas (Node.js) |             | Collection       |                 |             |
| Briar (Django)  |=== HTTP ===>| (adapters.ts)    |==+              | Analyst UI  |
| Cinder (PHP)    |  Capture    +------------------+  |              | (React)     |
| Drift (Go)      |                                   v              |             |
| Ember (Rust)    |             +------------------+  |              +-------------+
+-----------------+             | Normalization    |  |                     ^
                                | (parsers.ts)     |<-+                     |
[Data Stores]                   +------------------+  |                     | API
+-----------------+                                   v                     | Server
| postgres-sites  |             +------------------+  |              +-------------+
| mysql-site-c    |             | Entity Resolver  |  |              | Wolverine   |
+-----------------+             | (Jaro-Winkler)   |<-+------------->| Graph / RAG |
                                +------------------+                 +-------------+
                                                                            |
                                                                     +-------------+
                                                                     | WolverineDB |
                                                                     | (Trust Lyr) |
                                                                     +-------------+
```
