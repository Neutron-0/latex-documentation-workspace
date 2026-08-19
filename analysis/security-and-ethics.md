### Security Architecture [VERIFIED/CLAIMED mix]

#### Network Isolation
- wolverine-truth network: bridge, internal: true (no external access)
- wolverine-internal: main service mesh
- wolverine-dmz: tor-gateway and wolverine-api only

#### Tor Gateway Security [VERIFIED]
File: wolverine-sih/tor-gateway/
- Rate limiting: 10 req/sec
- Method restriction: GET/HEAD only
- Blocked paths: /admin, /v1/scenarios, /seed, /metrics
- Security header: X-Synthetic-Research: true
- Safety test scripts: scripts/test-tor-safety.sh, scripts/kill-tor.sh

#### AI Prompt Injection Protection [VERIFIED]
File: wolverine/src/ai/rag.ts
4-rule sanitization:
1. Strip control characters (U+0000-U+0008, U+000B, U+000C, U+000E-U+001F, U+007F)
2. Truncate to 500 chars
3. Remove injection patterns: 'ignore previous', 'system:', '<|', '|>', '[INST]', '[/INST]'
4. Token limit bounding

#### Data Classification [VERIFIED]
- All canonical records tagged dataClassification: 'synthetic-research'
- All AI outputs tagged dataClassification: 'synthetic-research'
- All resolution candidates tagged dataClassification: 'synthetic-research'

### Ethical Framework [VERIFIED]

#### Synthetic-Only Guarantee
- No real PII anywhere in the system
- No real cryptocurrency transactions (generate_synthetic_btc() in id_utils.py)
- No real payment credentials
- Generator validates against prohibited terms: 'real_bitcoin', 'real_wallet', 'visa_card', 'mastercard_cvv'
- All financial identifiers are explicitly synthetic

#### Truth Vault Isolation
- Ground truth NEVER accessible to the entity resolver during inference
- Evaluation is post-hoc only
- Separate database, separate credentials, separate network

#### Security Gaps [VERIFIED]
From wolverine-db-issues/:
1. Replay protection uses in-memory Set (not durable)
2. Gateway ledger record not cryptographically bound
3. No signer authentication on gateway commits
4. TOCTOU vulnerability in policy gate

### Limitations
1. Synthetic data may not represent real-world distribution patterns
2. Entity resolution has 0.46 recall (misses >50% of true links)
3. activityOverlap feature is a hardcoded constant
4. AI layer depends on local LLM availability (fallback is deterministic)
5. Vzeya UI claims capabilities not implemented in the actual system
