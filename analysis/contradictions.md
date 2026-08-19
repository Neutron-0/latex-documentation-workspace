# Contradictions and Inconsistencies

### Verified Contradictions and Inconsistencies

1. **activityOverlap Feature Weight vs Implementation**
   - **CLAIM**: activityOverlap is a real analytical feature with weight 0.15
   - **REALITY**: Hardcoded to 0.5 baseline (`entity_resolver.ts` line 151)
   - **IMPACT**: Inflates all scores by a constant 0.075; does not actually measure activity overlap
   - **SEVERITY**: Medium — affects scoring fidelity but doesn't invalidate results
   - **CLASS**: VERIFIED

2. **Vzeya as Intelligence Platform vs Visual Simulation**
   - **CLAIM** (implicit from UI labels): Performs 'Pearson Timing Correlation', 'BiLSTM Stylometry', 'DNS Leak Decapsulator'
   - **REALITY**: All algorithm names are text labels. No actual ML, NLP, or network analysis code exists in Vzeya. All data is mock arrays.
   - **IMPACT**: Presentation claims must be clearly separated from implementation evidence
   - **SEVERITY**: High for documentation — must not conflate Vzeya's visual claims with Wolverine's actual capabilities
   - **CLASS**: VERIFIED

3. **wolverine-db Security Claims vs Open Issues**
   - **CLAIM**: Provides tamper-evident cryptographic trust
   - **REALITY**: 4 documented security issues remain open (replay protection, gateway binding, signer auth, TOCTOU)
   - **IMPACT**: Security guarantees are aspirational, not fully verified
   - **SEVERITY**: Medium — architecture is sound but implementation has gaps
   - **CLASS**: VERIFIED / INFERRED

4. **Early Blockchain/Web3 Concepts vs Final Architecture**
   - **EVOLUTION**: Early project planning included blockchain-controlled infrastructure, custom anonymity protocols
   - **RESOLUTION**: Explicitly abandoned in favor of PostgreSQL/Docker/standard Tor (documented in §38)
   - **IMPACT**: None if documented correctly; misleading if early concepts are presented as features
   - **CLASS**: VERIFIED

5. **Recall Performance**
   - **METRIC**: 0.4598 recall (less than half of true links detected)
   - **CAUSE** (INFERRED): activityOverlap hardcoded to 0.5, crossSiteCue only checks 4-char prefix, 35% handle mutation rate
   - **IMPACT**: System is precise but misses many true links — tradeoff acknowledged but not deeply analyzed
   - **CLASS**: INFERRED / CLAIMED

6. **wolverine-db Production Status vs Stubs**
   - **CLAIM**: Described as 'Production' status with commercial tiering.
   - **REALITY**: Acknowledges in-process network only, simulated EVM/KMS, stubbed CLI, and unused PostgreSQL adapter.
   - **IMPACT**: Highly aspirational documentation for a prototype implementation.
   - **CLASS**: VERIFIED

7. **wolverine-db Security Vulnerabilities**
   - **CLAIM**: 15 security vulnerabilities remediated in two audits.
   - **REALITY**: 4 OPEN issues exist in wolverine-db-issues/. Unclear if these overlap or contradict the 15 remediated.
   - **IMPACT**: Security posture is questionable.
   - **CLASS**: INFERRED

8. **SIH Container Count**
   - **CLAIM**: 14 Docker containers claimed.
   - **REALITY**: docker-compose.yml shows 13 containers. (Might include tor-gateway profile).
   - **IMPACT**: Minor documentation discrepancy.
   - **CLASS**: VERIFIED

9. **SIH Graph Traversal Implementation**
   - **CLAIM**: Uses 'PostgreSQL adjacency tables + recursive CTEs'.
   - **REALITY**: `graph/projector.ts` uses in-memory Map-based BFS, not PostgreSQL CTEs.
   - **IMPACT**: Significant architectural misrepresentation in conclusion doc.
   - **CLASS**: VERIFIED

10. **SIH NLP / Entity Resolving Features**
    - **CLAIM**: 'vocabulary fingerprinting' links forum discussions to marketplace behavior; 'crossSiteCue' uses bio overlap.
    - **REALITY**: No NLP code exists in `entity_resolver.ts`. 'crossSiteCue' is just a 4-character handle prefix match. 'activityOverlap' is hardcoded to 0.5.
    - **IMPACT**: Claimed features do not exist in the verified code.
    - **CLASS**: VERIFIED

11. **SIH Evaluation Targets**
    - **CLAIM**: F1 of 0.6149 meets '≥ 0.85' target because it is 'precision-optimized'.
    - **REALITY**: F1 objectively misses target; precision focus rationalized post-hoc.
    - **IMPACT**: Misleading evaluation reporting.
    - **CLASS**: INFERRED

12. **SIH Database Engines**
    - **CLAIM**: 'Ember: SQLite (dev) / PostgreSQL 16 (prod)'.
    - **REALITY**: docker-compose.yml only shows PostgreSQL.
    - **IMPACT**: Minor documentation discrepancy.
    - **CLASS**: VERIFIED

### Unresolved Questions
1. Is the analyst-ui actually fully functional or a skeleton? (UNKNOWN)
2. Has the full 13-container Docker stack been successfully deployed end-to-end? (UNKNOWN)
3. Are the 5 source site Dockerfiles complete and buildable? (UNKNOWN)
4. What is the actual Wolverine API server implementation (`server.ts` not yet analyzed in depth)? (UNKNOWN)
5. Is there any evaluation beyond the 1,000-person benchmark? (UNKNOWN)
