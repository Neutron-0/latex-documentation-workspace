# Traceability Matrix

This matrix maps Manuscript chapters and sections to Technical Claims, Evidence Sources, and their Classifications to ensure strict academic honesty and traceability.

| Chapter | Section | Technical Claim | Evidence Source | Classification | Figure/Table | Citation Requirement |
|---------|---------|-----------------|-----------------|----------------|--------------|----------------------|
| 4. Gen Engine | 4.2 Pipeline | 13-phase generation pipeline | Generator code | IMPLEMENTED | Table: Gen Phases | Generator config code |
| 4. Gen Engine | 4.4 Mutations | 35% mutation, 4-patterns | Generator code | IMPLEMENTED | Fig: Alias Tree | Mutation rules snippet |
| 5. Collection | 5.3 Adapters | Diverse site parsing (GraphQL/REST) | Parser code | IMPLEMENTED | - | Parser implementation |
| 6. Normalization| 6.2 Schema | Canonical Record Schema | Source schemas | IMPLEMENTED | Fig: Schema | Schema definition |
| 7. Resolution | 7.2 Similarity | Jaro-Winkler string similarity | `entity_resolver.ts` | IMPLEMENTED | Eq: Jaro-Winkler | Formula & TS code |
| 7. Resolution | 7.3 Overlaps | Behavioral overlap scoring | `entity_resolver.ts` | SIMULATED | - | Code showing `0.5` hardcode |
| 7. Resolution | 7.4 Cues | NLP vocabulary fingerprinting | Code inspection | SPECIFIED/CLAIMED | - | Code showing 4-char matches |
| 8. Graph | 8.2 BFS | Advanced graph traversal (CTEs) | Code inspection | SIMULATED (CTEs) | Fig: Graph Proj | Code showing Map-based BFS |
| 9. AI/RAG | 9.2 Safety | Prompt injection protection | AI module code | IMPLEMENTED | Table: Rules | 4-rule sanitization code |
| 10. Trust | 10.2 SQLite | Tamper-evident storage | WolverineDB code | IMPLEMENTED | Fig: DB Arch | SQLite adapter code |
| 10. Trust | 10.3 Network | P2P Network / BFT Consensus | `DirectMemory...` | SIMULATED | - | Memory transport code |
| 11. UI | 11.3 Mocking | Live intelligence UI | Vzeya UI code | MOCK/SIMULATED | Fig: UI Mockup | Mock data arrays code |
| 12. Security | 12.1 Docker | Air-gapped Truth Vault | `docker-compose...` | IMPLEMENTED | Fig: Net Topo | Compose network config |
| 13. Evaluation | 13.3 Metrics | 0.9280 precision resolution | Evaluator code | CLAIMED/MOCK | Table: Metrics | Evaluator hardcoded outputs |
