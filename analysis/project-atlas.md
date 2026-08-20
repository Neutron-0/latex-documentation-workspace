# PROJECT ATLAS — WOLVERINE SIH ECOSYSTEM

## Repository 1: wolverine-sih (Main Backend Monorepo)
Path: `d:\Vault\wolverine-sih`

### Root Configuration
- `package.json`: Node.js monorepo with workspaces (`packages/*`, `sites/*`, `wolverine`, `analyst-ui`)
- `docker-compose.yml`: 14 services (postgres-sites, mysql-site-c, redis, minio, postgres-wolverine, postgres-truth, 5 sites, wolverine-api port 4000, analyst-ui port 5173, tor-gateway port 8088)
- `docker-compose.prod.yml`: Production hardening - disables host ports, enforces password injection, resource limits
- `.env.example`: Ports, classification (synthetic-research), database URLs
- Networks: `wolverine-internal`, `wolverine-truth`, `wolverine-dmz`
- `PROJECT_STATUS.md`: All 7 phases PASSED

### wolverine/src/ (Core Backend)
- `ai/rag.ts`: AI Analysis with Ollama. `sanitizeText` (4 rules). `answerQuestion`: filters by time/keywords, prompt template, fallback heuristic 0.75 confidence, 5000ms timeout
- `api/server.ts`: Express server. RBAC middleware (admin, operator, researcher, reviewer, public_demo). Routes: `/health/live`, `/health/ready`, `/metrics`, `/v1/collection-runs`, `/v1/records`, `/v1/graph/query`, `/v1/analysis/questions`, `/v1/scenarios`, `/v1/scenarios/:id/run`, `/v1/resolution-candidates`
- `collector/adapters.ts`: 5 adapters (AtlasRestAdapter, BriarHtmlAdapter, CinderJsonApiAdapter, DriftHybridAdapter, EmberGraphqlAdapter). Uses socks-proxy-agent for Tor
- `graph/projector.ts`: `GraphProjector` class. In-memory BFS. Depth limit 4, max 500 records
- `normalizer/parsers.ts`: 5 parsers (AtlasParser, BriarParser, CinderParser, DriftParser, EmberParser). Maps to `CanonicalRecord`
- `pipeline/processor.ts`: Processing orchestrator. SHA256 dedup. Routes valid→canonical, invalid→quarantine
- `resolver/entity_resolver.ts`: Blocking keys (prefix, regWeek, emailDomain). Jaro-Winkler similarity. Weights: aliasSim 0.30, dispSim 0.15, tempProx 0.20, actOverlap 0.15, crossSiteCue 0.20. Thresholds: >=0.92 linked, >=0.70 review, else rejected
- `services/`: Service layer
- `middleware/`: RBAC and request middleware
- `types/`: TypeScript type definitions
- `utils/`: Utility functions

### wolverine/prisma/
- `schema.prisma`: 10 models (Source, CollectionRun, Capture, NormalizedRecord, Quarantine, ResolutionCandidate, GraphNode, GraphEdge, Outbox, ProcessedMessage). UUIDs, timestamps, JSON attributes

### wolverine/tests/
- `ai.test.js`: Sanitization and LLM fallback
- `api.test.js`: Express router structure
- `graph.test.js`: Projection and BFS traversal
- `parsers.test.js`: All 5 parsers against fixtures
- `quarantine.test.js`: Malformed JSON rejection, contract drift
- `resolver.test.js`: Jaro-Winkler algorithm and scoring

### tor-gateway/
- `Dockerfile`: Nginx alpine, healthcheck port 80
- `nginx.conf`: Rate limits 10r/s burst 20. Proxies read-only endpoints. Blocks POST/mutation/admin/metrics. Injects `X-Synthetic-Research: true`
- `torrc`: Hidden service port 80 → 127.0.0.1:80

### evaluator/
- `src/evaluator/__main__.py`: Python CLI for ground truth evaluation. Hardcoded static metrics (P=0.9280, R=0.4598, F1=0.6149)
- `src/evaluator/metrics.py`: Binary metrics and scenario recall computation

### generator/
- `src/generator/engine.py`: `SyntheticWorldEngine` class. 12 phases:
  1. Canonical Persons
  2. Site Accounts
  3. Marketplace Listings
  4. Simulated Orders
  5. Conversations/Messaging
  6. Forum Activity
  7. Reputation Events
  8. Interactions
  9. Notifications & Support Tickets
  10. Noise Injection
  11. Scenarios
  12. Validation

### contracts/
- `canonical-record.schema.json`: Canonical representation format
- `wolverine.openapi.yaml`: OpenAPI 3.1 API specs
- `events.asyncapi.yaml`: AsyncAPI 3.0 Outbox event specs
- `fixtures/`: Test fixture data

### sites/ (5 Simulated Platforms)
- `atlas-market/`: Express/Next.js (Node 20), PostgreSQL (`atlas_market`), REST API, `server.ts` 66KB
- `briar-bazaar/`: Python Django, PostgreSQL (`briar_bazaar`), Server-rendered HTML, `views.py` 41KB, synthetic banner
- `cinder-exchange/`: PHP Laravel, MySQL (`cinder_exchange`), JSON:API, `index.php` 48KB
- `drift-forum/`: Go Chi, PostgreSQL (`drift_forum`) + Redis, Hybrid HTML/JSON, `main.go` 42KB
- `ember-commons/`: Rust Axum, PostgreSQL (`ember_commons`), GraphQL Relay, `main.rs` 40KB

### packages/
- `shared-types/`: `src/index.ts` exporting canonical, events, api, validator types

### scripts/
- `seed_via_sql_files.py` / `seed.sh`: Seeds test data to all 5 databases
- `benchmark-scale.py`: Scalability validation
- `test-tor-safety.sh`: Automated safety checks
- `verify_full_ecosystem.py`: End-to-end ecosystem verifier

---

## Repository 2: wolverine-db (Cryptographic Trust Layer)
Path: `d:\Vault\wolverine-db`
Version: 1.3.0, 91 normative specifications (WDB-0001 through WDB-0135)

### Source Code (src/)
- `crypto/hash.ts`: SHA-256 chains (`computeChangeHash`), timing-safe comparisons
- `crypto/merkle.ts`: RFC 6962 Merkle trees (`MerkleTree` class), inclusion proofs, bounded leafCount, 0x00/0x01 prefixes
- `crypto/approval.ts`: Approval workflows
- `crypto/canonical.ts`: RFC 8785 JSON Canonicalization + TaggedField binary tuples
- `engine/verifier.ts`: State verification engine
- `engine/recovery.ts`: State recovery
- `engine/recovery_provenance.ts`: Recovery provenance tracking
- `bft_hardening/epoch_rotation.ts`: BFT epoch rotation
- `bft_hardening/key_rotation.ts`: Key rotation with atomic multi-field signatures
- `bft_hardening/collusion_defense.ts`: Collusion detection and defense
- `trust_network/consensus.ts`: `TrustConsensusEngine` - M-of-N validator attestations, `QuorumCertificate` generation
- `trust_network/ledger.ts`: `PersistentTrustLedger` with serialized mutex queue
- `trust_network/validator.ts`: Validator node management
- `trust_network/proof.ts`: Cryptographic proof generation
- `runtime/gateway.ts`: Trust gateway
- `runtime/validator_daemon.ts`: Validator daemon process
- `runtime/network_transport.ts`: Network transport (DirectMemoryNetworkTransport for in-process)
- `survivability/catastrophic_cluster.ts`: Catastrophic cluster recovery
- `survivability/receipt_chain.ts`: Receipt chain management
- `survivability/crash_safe_journal.ts`: Crash-safe journaling
- `survivability/epoch_certificate.ts`: Epoch certificate management
- `survivability/ledger_recovery_engine.ts`: Disaster queue and replay
- `adapters/mysql.ts`: MySQL adapter
- `adapters/sqlite.ts`: SQLite adapter
- `postgres/`: PostgreSQL integration
- `sentinel/anomaly_engine.ts`: Behavioral anomaly detection
- `sentinel/baseline.ts`: Baseline behavioral models
- `sentinel/policy_gate.ts`: Policy enforcement and authorization scoping
- `anchors/evm.ts`: EVM smart contract anchoring (in-memory Map simulation)

### Tests (tests/)
- `security.test.ts`: 16 attack vectors (DB tampering, history deletion, approval replay, Merkle forgery, signature verification)
- `survivability/`: Catastrophic recovery tests
- `bft_hardening/`: Epoch rotation, collusion attacks, Byzantine fault vectors
- 219+ total tests across 87+ suites

### Implementation Status
- Cryptographic code: REAL (node:crypto SHA-256, Ed25519)
- Hash chains: REAL
- Consensus: REAL (iterates attestations, verifies signatures, checks quorum)
- Network transport: SIMULATED (`DirectMemoryNetworkTransport`)
- EVM anchoring: SIMULATED (in-memory Map)
- KMS/HSM: SIMULATED (deterministic local Ed25519)

---

## Repository 3: Vzeya (Cinematic Frontend)
Path: `d:\Vault\Vzeya`
Framework: Next.js 15.3.2, React 19.1.0, Three.js 0.185.1, R3F 9.7.0, Framer Motion 13.1.0, Tailwind CSS v4

### App Router Routes
- `/` : 4-Phase cinematic landing
- `/architecture` : Distributed Microservices & Kernel Pipeline telemetry panel
- `/demonstration` : Live Attribution Pipeline Simulation Lab
- `/demos` & `/demos/[id]` : WebGL/WebGPU Shader galleries
- `/docs` : API & Platform Technical Documentation
- `/impact` : Blast Radius & Operational Impact Matrix
- `/intelligence` : Threat Stream & Signal Deobfuscation
- `/login` & `/register` : Tactical Authentication
- `/methodology` : Autonomous Execution Model & 4-Phase Forensic Protocol
- `/settings` : System Preferences
- `/team` : Operational Command Unit & Contributors
- `/threat` : Zero-Day Vulnerability & Threat Radar

### Narrative Engine (components/narrative/)
- `InteractiveParticlesMesh.tsx`: GPU particle morph shader (Simplex noise, RawShaderMaterial, InstancedBufferGeometry, >13k particles, mouse repulsion physics)
- `CarouselScene.tsx`: Curved WebGL carousels with scroll momentum physics
- `Execution3DWorld.tsx`: Spatial terminal corridor with 8 interactive 3D HUD terminals (EXEC-01 to EXEC-08)
- `ExecutionCinematicScene.tsx`: 3D world wrapper with focus/inspection modes
- `NarrativeCanvas.tsx`: Master R3F canvas
- `NarrativeOverlay.tsx`: Left-column typography overlay for Phase 1
- `CrtBootSequence.tsx`: Boot animation

### Data Sources
- 100% static/mock data. `executionData.ts` provides `VITALS_METRICS`, `RECENT_INTERCEPTS`, `ARCHITECTURE_PREVIEW`
- `auth-context.tsx`: Mock authentication
- Zero `fetch()` calls to any backend API

---

## Repository 4: chats (Design Decisions)
Path: `d:\Vault\chats`
3 files: `CONCLUSION.md` (WolverineDB), `CONCLUSION (1).md` (Wolverine SIH), `WOLVERINE_PROJECT_ESTABLISHED_FACTS.md`

---

## Repository 5: Pro-doc (LaTeX Documentation Workspace)
Path: `d:\Vault\Pro-doc`
Framework: Next.js LaTeX viewer with Tectonic compiler
- `manuscript/`: 16 chapters, 7 appendices, bibliography
- `analysis/`: Forensic analysis artifacts
- `bin/tectonic.exe`: Bundled Tectonic compiler
- `src/`: Next.js web-based LaTeX editor/viewer
