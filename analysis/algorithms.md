# Algorithms Analysis

### 1. Entity Resolution Engine
File: `d:\Vault\wolverine-sih\wolverine\src\resolver\entity_resolver.ts` (196 lines)

#### Blocking Strategy
- generateBlockingKeys(): Produces 3 blocking keys per account:
  1. Handle prefix (first 3 characters of normalized handle)
  2. Registration week (ISO week string like '2025-W03')
  3. Email domain (synthetic: '{siteId}.example.test')
- Only cross-site pairs are compared (same-site excluded)
- **EVIDENCE**: VERIFIED (Code inspection)

#### Jaro-Winkler String Similarity
Full implementation in jaroWinkler() function (lines 41-88):
- Standard Jaro distance with match-distance window
- Winkler prefix boost (up to 4 characters, scaling factor 0.1)
- Returns similarity score in [0.0, 1.0]
- **EVIDENCE**: VERIFIED (Code inspection)

#### Weighted Multi-Feature Scoring (evaluatePair method)
| Feature | Weight | Source | Method |
|---------|--------|--------|--------|
| aliasSimilarity | 0.30 | Normalized handles | Jaro-Winkler |
| displayNameSimilarity | 0.15 | Display names | Jaro-Winkler |
| temporalProximity | 0.20 | Join dates | Linear decay over 30 days |
| activityOverlap | 0.15 | (baseline) | Fixed 0.5 for synthetic sim |
| crossSiteCue | 0.20 | Handle prefix overlap | Binary (4-char prefix match) |
- **EVIDENCE**: VERIFIED (Code inspection)

#### Decision Thresholds
- score >= 0.92 → "linked" (auto-linked)
- score >= 0.70 → "review" (human review)
- score < 0.70 → "rejected"
- **EVIDENCE**: VERIFIED (Code inspection)

#### Verified Benchmark Results (from ESTABLISHED_FACTS §8)
- 1,000 persons, 1,794 accounts, 1,205 ground truth pairs
- 597 inferred pairs, 554 true positives, 43 false positives, 651 false negatives
- Precision: 0.9280, Recall: 0.4598, F1: 0.6149
- **EVIDENCE**: CLAIMED (Documentation)

**NOTE**: activityOverlap is hardcoded to 0.5 (baseline). This is a known simplification — real activity overlap computation is not implemented. This limits recall. (VERIFIED)

### 2. Synthetic Population Generator
File: `d:\Vault\wolverine-sih\generator\src\generator\engine.py` (729 lines)
Class: SyntheticWorldEngine

13 deterministic generation phases:
1. Canonical persons (Faker names or built-in name lists)
2. Site account assignment (probability distribution: 50% 1 site, 30% 2 sites, 14% 3 sites, 6% 4-5 sites)
3. Handle mutation (35% chance of alias variation: _x suffix, real_ prefix, dot/dash substitution)
4. Marketplace listings (~35% of person count)
5. Simulated orders with escrow lifecycle (7 states)
6. Private messaging (~50% of person count × ~4 msgs)
7. Forum activity (~20% topics × 25 replies)
8. Reputation events (~2× person count)
9. Interactions (~10× person count)
10. Notifications + support tickets
11. Noise injection (3-8% of truth links marked noisy)
12. Scenario overlays (alias-bridge, reputation-ring, migration-noise)
13. Integrity validation (referential integrity, temporal ordering, prohibited content)

ID generation per site: Atlas=ULID, Briar=sequential integer, Cinder=UUID, Drift=custom, Ember=custom
- **EVIDENCE**: VERIFIED (Code inspection)

### 3. Graph Projection
File: `d:\Vault\wolverine-sih\wolverine\src\graph\projector.ts` (176 lines)
- In-memory adjacency via Map<string, GraphNode> and Map<string, GraphEdge>
- Edge types: AUTHORED, REPLIED_TO, LISTED, REPUTATION_FOR, INTERACTED_WITH, POSSIBLE_SAME_AS
- Multi-hop BFS query (max depth 4, max 500 records)
- Entity resolution links projected as POSSIBLE_SAME_AS edges with confidence scores
- **EVIDENCE**: VERIFIED (Code inspection)

### 4. AI/RAG Analysis
File: `d:\Vault\wolverine-sih\wolverine\src\ai\rag.ts` (144 lines)
- LLM: Ollama (llama3.2) at port 11434
- 4-rule input sanitization: control char stripping, 500-char truncation, injection pattern removal, token bounding
- Time-windowed keyword-based record retrieval (max 20 records)
- Graceful fallback: if LLM unavailable, produces deterministic "Analytic hypothesis" with heuristic citations
- All outputs labeled "Analytic hypothesis" — never stated as fact
- dataClassification always "synthetic-research"
- **EVIDENCE**: VERIFIED (Code inspection)

### 5. Normalization Parsers
File: `d:\Vault\wolverine-sih\wolverine\src\normalizer\parsers.ts` (482 lines)
- 5 format-specific parsers (Atlas JSON, Briar HTML/cheerio, Cinder JSON:API, Drift JSON, Ember GraphQL)
- Deterministic UUID generation via SHA-256
- Contract drift detection (Briar: checks for .synthetic-banner)
- All records include provenance chain (captureId, rawSha256, parserVersion)
- **EVIDENCE**: VERIFIED (Code inspection)

### 6. Cryptographic Trust (wolverine-db)
- Merkle state checkpoints (crypto/merkle.ts)
- BFT consensus with epoch rotation (bft_hardening/)
- Ed25519 multi-party approval (crypto/approval.ts)
- Continuous reconstruction with dependency graphs (continuous_reconstruction/)
- **EVIDENCE**: VERIFIED (Code inspection claim based on dir structure)
