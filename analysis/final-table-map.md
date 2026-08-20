# FINAL TABLE MAP

This document maps all required tables for the reconstructed manuscript, ensuring comprehensive coverage of system specifications, architectures, and evaluation metrics.

## 1. System & Infrastructure

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-INF-01 | Container Service Inventory | Container, Port, Network, Image/Stack, Purpose | docker-compose.yml | 7. Deployment |
| TAB-INF-02 | Network Trust Zones | Network Name, Isolation Rule, Member Services | docker-compose.yml | 8. Network Architecture |
| TAB-INF-03 | API Route Specification | Method, Endpoint, Target Module, RBAC Role | api/server.ts | 22. API Architecture |

## 2. Data & Ecosystem

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-ECO-01 | Synthetic Source Platforms | Name, Stack, Database, API Format, ID Scheme | sites/* | 9. Data Ecosystem |
| TAB-ECO-02 | Generator Phase Definition | Phase, Purpose, Algorithm, Output | engine.py | 9. Data Ecosystem |
| TAB-ECO-03 | Database Entity Dictionary | Model, Role, Primary Fields, Relationships | schema.prisma | 11. Database Architecture |
| TAB-ECO-04 | Canonical Record Mapping | Raw Field, Target Field, Type, Parser Logic | parsers.ts | 10. Data Models |

## 3. Algorithms & Investigation

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-ALG-01 | Resolution Feature Weights | Feature, Weight, Algorithm, Code Ref | entity_resolver.ts | 13. Entity Resolution |
| TAB-ALG-02 | Graph Node & Edge Types | Type, Properties, Source Models | schema.prisma | 15. Graph Projection |
| TAB-ALG-03 | RAG Sanitization Rules | Rule #, Target, Regex/Logic, Purpose | rag.ts | 16. RAG & LLM |

## 4. WolverineDB

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-WDB-01 | Cryptographic Primitives | Component, Algorithm, Node module | crypto/* | 18. WDB Cryptography |
| TAB-WDB-02 | Milestone Evolution | Version, Title, Key Features | chats/CONCLUSION.md | 17. WolverineDB |
| TAB-WDB-03 | Security Audit Remediation | Vuln ID, Severity, Issue, Fix, Spec | chats/CONCLUSION.md | 20. WDB Security |

## 5. Frontend

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-UI-01 | Vzeya Route Architecture | Route, Component, Phase, Purpose | src/app/* | 24. Vzeya Deep Dive |
| TAB-UI-02 | Narrative Scroll Phases | Phase, Progress, Visual State, Audio | narrativeStore.ts | 24. Vzeya Deep Dive |

## 6. Evaluation & Reality

| Table ID | Title | Columns | Source Data | Target Chapter |
|---|---|---|---|---|
| TAB-EVAL-01 | Evaluation Scenarios | Scenario, Purpose, Target Assertion, Result | chats/CONCLUSION.md | 27. Evaluation Methodology |
| TAB-EVAL-02 | Real vs Simulated Demarcation | Subsystem, Real Implementation, Simulated Scope | chats/CONCLUSION.md | 4. Complete Project Ecosystem |
| TAB-EVAL-03 | Scale Benchmark Results | Persons, Accounts, Truth Pairs, Time, Memory | generator/engine.py | 27. Evaluation Methodology |
