# MANUSCRIPT COVERAGE MATRIX

This matrix maps the major project components against their coverage in the current LaTeX manuscript (d:\Vault\Pro-doc\manuscript).

| Component | Coverage Level | Current Documentation Location | Missing Detail |
|---|---|---|---|
| **Docker/container topology** | FULL | Chapter 5 | Green/blue deployment details, cloud infra requirements |
| **Onion sites / simulated platforms** | PARTIAL | Appendix G, Chapter 5 | Explicit API endpoints, individual schemas, platform narratives for Atlas/Briar/Cinder/Drift/Ember |
| **Generator phases** | PARTIAL | Chapter 11 | Complete list of all 12 phases with their exact algorithms |
| **Entity resolution** | FULL | Chapter 7, Appendix F | - |
| **Graph projection** | CONTRADICTED | Chapter 3, 5, Appendix E | Corrects false claims about Neo4j; must document PostgreSQL recursive CTEs and in-memory BFS accurately |
| **RAG pipeline** | DETAILED | Chapter 2, 7 | - |
| **WolverineDB** | FULL | Appendix C | - |
| **Vzeya frontend** | FULL | Chapter 10 | Corrects description of shaders (claims pure CSS, actually uses WebGL/Three.js) |
| **Analyst UI** | FULL | Chapter 10 | - |
| **Evaluation** | DETAILED | Chapter 12, Appendix D | Needs clearer separation in early chapters that metrics are static, not dynamic |
| **API routes** | FULL | Appendix B | - |
| **Database schema** | FULL | Appendix E | - |
| **Security** | DETAILED | Chapter 4, 13 | Corrects "air-gap" terminology (it is Docker network isolation, not a physical air gap) |
| **Deployment** | SUPERFICIAL | (Scattered) | Staging/production rollout procedures, compose production overrides |
| **Network topology** | FULL | Chapter 5 | - |

## Detailed Breakdown by Topology Layer

### A. Repository topology
- **Coverage**: MISSING
- **Detail**: The manuscript does not map the multi-repository structure (wolverine-sih vs wolverine-db vs Vzeya vs Pro-doc).

### B. Runtime topology
- **Coverage**: DETAILED
- **Detail**: The 13/14 services in docker-compose are documented, but the exact execution sequence needs clarification.

### C. Container topology
- **Coverage**: FULL
- **Detail**: Explicitly lists containers, port mappings (3000, 4000, 5432, 9000, etc.), and network bridging.

### D. Network topology
- **Coverage**: FULL
- **Detail**: Explains dmz, internal, truth networks and isolation routing.

### E. Database topology
- **Coverage**: DETAILED
- **Detail**: Prisma schema is fully documented (App E). Missing explicit schemas for the 5 source sites.

### F. API topology
- **Coverage**: FULL
- **Detail**: Appendix B documents the OpenAPI surface.

### G. Processing pipeline
- **Coverage**: PARTIAL
- **Detail**: Mentions normalizers and outbox, but lacks the exact step-by-step trace from MinIO to Graph.

### H. Data model
- **Coverage**: FULL
- **Detail**: Appendix E provides the data dictionary for all Prisma entities.

### I. Algorithm implementation
- **Coverage**: DETAILED
- **Detail**: Entity resolution composite score is explicitly documented with weights. Graph bounded BFS is documented. 

### J. Frontend architecture
- **Coverage**: CONTRADICTED
- **Detail**: Vzeya routes and mock data nature are documented, but WebGL/Three.js usage is falsely described as "pure CSS".

### K. Security architecture
- **Coverage**: DETAILED
- **Detail**: Tor gateway, RBAC documented. "Zero-knowledge" and "Air-gap" terms are used incorrectly/colloquially.

### L. Evaluation
- **Coverage**: DETAILED
- **Detail**: Metrics and evidence classes well documented. 

### M. Deployment
- **Coverage**: SUPERFICIAL
- **Detail**: Only covers basic docker-compose. Missing production hardening (docker-compose.prod.yml).

### N. Research/history
- **Coverage**: MISSING
- **Detail**: Engineering decisions, rejected approaches, and milestone evolution (chats/ history) are entirely absent.

### O. Demonstration ecosystem
- **Coverage**: PARTIAL
- **Detail**: Mentions 5 platforms but does not explain their distinct tech stacks (Node, Django, PHP, Go, Rust).

## Conclusion
The current manuscript provides a strong baseline for the core entity resolution and API structure but has critical gaps in documenting the simulated source platforms, the generator phases, the project's engineering history, and makes contradictory claims regarding Graph storage (Neo4j), Frontend rendering (CSS vs WebGL), and Security (Air-gapped vs Network isolated). It requires substantial reconstruction to achieve "Project Atlas" accuracy.
