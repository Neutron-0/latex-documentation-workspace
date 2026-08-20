```md
# WOLVERINE — ESTABLISHED PROJECT FACTS

> **Document purpose:** This document records the established facts of the Wolverine project based on the implemented architecture, source code, deployment work, live verification, acceptance testing, and project history available for this project.
>
> It deliberately separates **implemented/verified facts** from ideas that were discussed as future architecture but are **not established as implemented**.

---

# 1. Project Identity

**Wolverine** is a local intelligence and analysis platform designed to collect observable information from multiple heterogeneous web services, normalize that information into a common representation, resolve entities across services, construct relationship graphs, and provide analyst-facing investigation and analysis capabilities.

The project is deliberately divided into two major environments:

1. **Public Synthetic Ecosystem**
   - Five independently implemented synthetic web applications.
   - Each application has its own application logic, database, routes, UI, and user-facing workflows.
   - The ecosystem continuously generates synthetic activity.

2. **Local Wolverine Analyst Workstation**
   - Wolverine collection and analysis pipeline.
   - WolverineDB / analytical persistence.
   - Entity resolution.
   - Relationship graph.
   - AI/RAG analysis.
   - Analyst UI.
   - Truth Vault.
   - Local Tor client for collecting from public Onion Services.

The fundamental separation is:

```text
             SYNTHETIC WORLD
                    |
                    | observable HTTP activity
                    v
            Wolverine Collectors
                    |
                    v
              Normalization
                    |
                    v
           Canonical Records
                    |
                    v
           Entity Resolution
                    |
                    v
          Relationship Projection
                    |
                    v
              WOLVERINEDB
                    |
             +------+------+
             |             |
             v             v
          Graph         AI/RAG
          Analysis      Analysis
             |             |
             +------+------+
                    |
                    v
               Analyst UI
```

---

# 2. The Problem Wolverine Solves

The project is not fundamentally a single-site scraper.

The synthetic environment intentionally consists of multiple services with:

- different technologies,
- different database schemas,
- different identifiers,
- different URL structures,
- different data representations,
- different UI conventions,
- different application semantics,
- and different user populations.

A single synthetic person can therefore have activity distributed across multiple apparently independent services.

Wolverine's job is to process those observations and reconstruct relationships across the services.

Conceptually:

```text
Site A account
       \
        \
Site B account ----+
                    |
Site C account ----+----> possible same entity
                    |
Site D account ----+
        /
       /
Site E account
```

The system uses observable evidence rather than requiring the source applications to expose a shared identity database.

---

# 3. Wolverine Core

The implemented Wolverine pipeline contains the following major stages:

1. Collection
2. Raw capture
3. Normalization
4. Canonical record validation
5. Entity resolution
6. Relationship graph projection
7. Persistent analytical storage
8. Analyst API
9. AI/RAG analysis
10. Analyst UI

The collector architecture supports independently configured source URLs.

The five source systems can therefore be treated as separate services rather than as one application.

---

# 4. WolverineDB

## 4.1 WolverineDB's Role

**WolverineDB is a first-class architectural component of the Wolverine system.**

It should not be described merely as "the database."

Its purpose is to provide the persistent analytical data substrate connecting:

```text
collection
   ↓
normalization
   ↓
canonical records
   ↓
entity resolution
   ↓
relationships
   ↓
graph
   ↓
analyst queries
   ↓
AI/RAG analysis
```

The public source applications have their own databases.

WolverineDB represents the data from those applications after it has entered Wolverine's analytical pipeline.

---

## 4.2 Source Databases vs WolverineDB

There are therefore two fundamentally different database domains.

### Source application databases

These belong to:

- Atlas
- Briar
- Cinder
- Drift
- Ember

They contain application-level state such as:

- accounts,
- profiles,
- listings,
- offers,
- topics,
- replies,
- messages,
- orders,
- reputation,
- notifications,
- and other application-specific information.

### WolverineDB / analytical persistence

This represents information collected and transformed by Wolverine.

It contains or supports:

- normalized/canonical records,
- analytical relationships,
- entity-resolution results,
- graph projections,
- collection-related state,
- investigation/query state,
- and other Wolverine-side analytical information.

The two domains are intentionally separate.

---

# 5. WolverineDB Data Pipeline

The established data flow is:

```text
Source HTTP response
        |
        v
      Capture
        |
        v
    Normalization
        |
        v
 Canonical Record
        |
        +----------------+
        |                |
        v                v
 Entity Resolution    Other analysis
        |
        v
 Relationship Evidence
        |
        v
 Relationship Graph
        |
        v
     WolverineDB
```

The source database is therefore **not copied wholesale into WolverineDB**.

Instead, Wolverine observes the source applications and produces an analytical representation.

---

# 6. Canonical Records

Wolverine uses canonical records to provide a common representation across heterogeneous source systems.

This allows information originating from different application stacks to be processed by the same downstream pipeline.

The implementation includes schema validation for canonical records.

Live collection testing demonstrated:

```text
HTTP captures
      ↓
normalized records
      ↓
outbox events
```

without requiring a common database between the source applications.

---

# 7. Entity Resolution

Wolverine includes an entity-resolution subsystem.

Its purpose is to determine whether multiple accounts observed across different services may correspond to the same underlying synthetic person.

The source sites intentionally use different identifiers and representations.

Entity resolution therefore operates over observable evidence.

The project includes:

- alias resolution,
- probabilistic matching,
- confidence thresholds,
- candidate relationships,
- and handling of uncertain/noisy matches.

---

# 8. Zero-Knowledge Entity Resolution Verification

A dedicated evaluation was implemented to test entity resolution without providing the resolver with the canonical person IDs or ground-truth links.

The verified evaluation used:

```text
1,000 persons
1,794 accounts
```

Results:

```text
Ground Truth Pairs: 1,205
Inferred Pairs:       597

True Positives:       554
False Positives:       43
False Negatives:      651

Precision:           0.9280
Recall:              0.4598
F1:                  0.6149
```

The important established architectural property is that Wolverine can perform entity-resolution inference without directly reading the Truth Vault during the observable-data evaluation.

---

# 9. Truth Vault

The architecture includes a separate **Truth Vault**.

Its purpose is evaluation and ground-truth management.

It is deliberately separated from the core observable-data pipeline.

This allows the project to distinguish between:

```text
GROUND TRUTH
     |
     | isolated
     v

OBSERVABLE DATA
     |
     v
Wolverine inference
```

The Truth Vault is therefore not intended to be a shortcut used by the entity resolver to obtain the correct answer.

---

# 10. Relationship Graph

Wolverine projects canonical/entity-resolved information into a relationship graph.

The graph can represent relationships between entities observed across the synthetic ecosystem.

The graph is queryable through the Wolverine analyst API.

This enables investigation patterns such as:

```text
Person
 ├── Account
 │     ├── Listing
 │     ├── Message
 │     └── Reputation Event
 │
 ├── Forum Account
 │     ├── Topic
 │     └── Reply
 │
 └── Exchange Account
       └── Order
```

The graph is one of the primary outputs of Wolverine's analytical pipeline.

---

# 11. Wolverine Persistence Infrastructure

The local Wolverine deployment contains persistent infrastructure supporting the analytical pipeline.

Established components include:

- PostgreSQL for core Wolverine persistence.
- Redis for Streams/event processing.
- MinIO for object/capture storage.
- Separate PostgreSQL-backed Truth Vault storage.

The exact implementation is containerized for the local workstation deployment.

---

# 12. Event / Outbox Architecture

The collection pipeline emits events after successful normalization.

The live five-site collection verification demonstrated:

```text
Captures
   ↓
Normalized Records
   ↓
Outbox Events
```

This provides an event-oriented boundary between collection/normalization and downstream processing.

---

# 13. Wolverine Analyst API

Wolverine exposes an analyst-facing API.

Established API functionality includes endpoints for:

- health checks,
- scenarios,
- records,
- graph queries,
- analysis questions,
- collection runs,
- resolution candidates.

Role-based request handling is implemented for analyst/operator/reviewer-style access.

Administrative endpoints are not intended to be exposed through the public Tor ingress.

---

# 14. AI / RAG Analysis

Wolverine contains an AI-assisted analysis layer.

It can receive analyst questions and use available Wolverine context to produce analytical hypotheses.

The implementation includes:

- prompt-injection stripping,
- input sanitization,
- context-aware analysis,
- citation support,
- graceful fallback when an LLM is unavailable.

The fallback path can produce an explicitly labeled:

```text
Analytic hypothesis:
```

rather than pretending that a generated hypothesis is authoritative ground truth.

---

# 15. Analyst UI

A dedicated React-based Analyst UI exists for interacting with the Wolverine system.

It provides the analyst-facing interface for:

- records,
- graph investigation,
- analysis,
- and Wolverine intelligence workflows.

The UI is intended to run locally on the analyst workstation.

---

# 16. Synthetic Ecosystem

The public side of the project consists of five independently implemented synthetic applications.

They are intended to appear as separate services.

The five applications are:

```text
Atlas Market
Briar Bazaar
Cinder Exchange
Drift Forum
Ember Commons
```

They are not merely five static HTML mockups.

They contain:

- backend application logic,
- persistent databases,
- application routes,
- data-driven pages,
- user flows,
- generated users,
- generated activity,
- and APIs used by Wolverine collectors.

---

# 17. Site A — Atlas Market

Technology:

```text
Node.js
Express
PostgreSQL
```

Established functionality includes:

- marketplace catalogue,
- categories,
- search,
- listing details,
- seller profiles,
- reputation,
- orders,
- escrow lifecycle,
- messages,
- notifications,
- support,
- persona switching.

The application preserves its REST API contracts for Wolverine collection.

---

# 18. Site B — Briar Bazaar

Technology:

```text
Python
Django
PostgreSQL
```

Established functionality includes:

- catalogue,
- marketplace offers,
- member profiles,
- community boards,
- discussion threads,
- replies,
- reputation/trust,
- correspondence,
- orders.

The application uses its own presentation identity and server-rendered pages.

---

# 19. Site C — Cinder Exchange

Technology:

```text
PHP
MySQL
```

Established functionality includes:

- exchange offers,
- vendor information,
- trading-oriented pages,
- orders,
- escrow,
- operator views,
- trade activity,
- settlement identifiers.

Cinder exposes a JSON/API surface used by Wolverine's collector.

---

# 20. Site D — Drift Forum

Technology:

```text
Go
PostgreSQL
```

Established functionality includes:

- forum boards,
- topic lists,
- topics,
- nested replies,
- contributor profiles,
- trust scores,
- topic filtering,
- pagination,
- contributor/persona switching.

Drift has a deliberately different visual and interaction identity from the marketplace sites.

---

# 21. Site E — Ember Commons

Technology:

```text
Rust
Axum
PostgreSQL
```

Established functionality includes:

- exhibition feed,
- artifacts,
- categories,
- curator information,
- provenance,
- gallery-style presentation,
- commissions,
- deterministic synthetic artwork representations.

Ember exposes a GraphQL endpoint used by Wolverine's collector.

---

# 22. Synthetic Population

The generator was extended to operate at a **50,000-person scale**.

The synthetic ecosystem contains generated:

- persons,
- accounts,
- marketplace listings,
- offers,
- forum topics,
- replies,
- reputation events,
- messages,
- transaction/order activity,
- cross-service identity signals.

Multiple accounts can belong to the same underlying synthetic person.

This is essential to Wolverine's entity-resolution and relationship-graph demonstration.

---

# 23. Scale Results

A scale benchmark was executed at:

```text
1,000 persons
10,000 persons
50,000 persons
```

The 50,000-person run produced approximately:

```text
89,605 accounts
17,500 listings
260,000 posts/replies
100,000 reputation events
500,000 interactions
60,096 truth links
```

The measured generation time was approximately:

```text
114.497 seconds
```

with approximately:

```text
390.92 MB
```

peak memory in the reported benchmark.

---

# 24. Live Activity Simulator

A background activity simulator was implemented.

Its purpose is to make the synthetic ecosystem behave as a living environment rather than as a static database dump.

The simulator can continuously generate or mutate:

- listings,
- orders,
- messages,
- forum activity,
- replies,
- reputation events,
- notifications.

The simulator supports transaction state progression.

Established example:

```text
ORDER_CREATED
      ↓
PAYMENT_SIMULATED
      ↓
ESCROW_SIMULATED
      ↓
SELLER_CONFIRMED
      ↓
SHIPPED_SIMULATED
      ↓
COMPLETED
```

These are synthetic states.

No real payments or real financial transactions are involved.

---

# 25. Synthetic Cryptocurrency / Payment Data

The synthetic environment contains fictional payment-style and cryptocurrency-style identifiers.

These exist to provide realistic-looking application data and cross-site analytical signals.

They are not:

- real Bitcoin addresses used for real transactions,
- real wallets,
- real cryptocurrency funds,
- or real payment credentials.

All financial activity in the project is synthetic.

---

# 26. Database-Backed Web Applications

The five public applications were specifically extended beyond static/mock presentation.

They use persistent application databases.

The project includes database verification for the five application backends.

The intended architecture is:

```text
Frontend
   ↓
Application backend
   ↓
Application database
```

rather than:

```text
Frontend
   ↓
hardcoded demo HTML
```

This distinction is central to the project.

---

# 27. User Flows

The five applications were expanded toward normal multi-page application behavior.

Established flows include combinations of:

- catalogue browsing,
- search,
- filtering,
- listing details,
- profiles,
- reputation,
- orders,
- escrow states,
- messaging,
- notifications,
- forum boards,
- topics,
- replies,
- correspondence,
- operator/persona switching,
- gallery/exhibition browsing.

The project contains a dedicated user-journey acceptance suite.

Reported result:

```text
65 / 65 checks passed
0 failed
```

---

# 28. Public Deployment Architecture

The public synthetic ecosystem is designed to run independently from the local Wolverine workstation.

The public environment contains:

```text
Atlas
Briar
Cinder
Drift
Ember
```

and their corresponding application databases and infrastructure.

The public environment does not need to contain WolverineDB.

This is an intentional separation.

---

# 29. Local Wolverine Deployment

The local workstation contains:

```text
Analyst UI
      |
Wolverine API
      |
+-----+---------+-----------+
|               |           |
PostgreSQL     Redis       MinIO
|
Truth Vault
|
Tor Client
```

The local workstation is the location where Wolverine performs analysis.

This allows the analyst system to remain local while the synthetic source ecosystem is publicly reachable.

---

# 30. Tor Architecture

The final intended demonstration model is to expose the five source applications through the public Tor network while keeping Wolverine local.

Conceptually:

```text
                    TOR NETWORK
                         |
        +----------------+----------------+
        |                |                |
        v                v                v

   Onion Service A  Onion Service B  Onion Service C
        |                |                |
      Atlas            Briar           Cinder

        +----------------+----------------+
                         |
                  Onion Service D
                         |
                       Drift

                  Onion Service E
                         |
                       Ember
```

Each site can have its own Onion Service identity and `.onion` address.

A single Tor daemon can host multiple Onion Services.

Each Onion Service has its own persistent hidden-service identity.

---

# 31. Why Five Onion Services

The five-site deployment is conceptually stronger than putting all applications behind one `.onion` hostname.

With five services:

```text
Atlas      → Onion A
Briar      → Onion B
Cinder     → Onion C
Drift      → Onion D
Ember      → Onion E
```

Wolverine can be presented as collecting from apparently separate services.

The investigative narrative becomes:

```text
Five independent services
          ↓
Independent observations
          ↓
Wolverine collection
          ↓
Cross-service entity resolution
          ↓
Relationship graph
```

This better demonstrates the purpose of Wolverine.

---

# 32. Local Outbound Tor Collection

Wolverine is intended to remain local.

The local workstation uses Tor client functionality to reach the public Onion Services.

The conceptual flow is:

```text
Wolverine
   |
   v
Local Tor client
   |
   v
Tor network
   |
   +--> Atlas Onion Service
   +--> Briar Onion Service
   +--> Cinder Onion Service
   +--> Drift Onion Service
   +--> Ember Onion Service
```

The source sites therefore do not need to expose their normal HTTP ports directly to the public internet.

---

# 33. End-to-End Architecture

The complete established architecture can be represented as:

```text
                SYNTHETIC POPULATION
                        |
                        v
               Activity Simulator
                        |
                        v
       +----------------+----------------+
       |                |                |
     Atlas            Briar           Cinder
       |                |                |
       +----------------+----------------+
                        |
                  Drift / Ember
                        |
                        v
                 Five databases
                        |
                        v
               Five web applications
                        |
                        v
                Five Onion Services
                        |
                  Public Tor
                        |
                        v
                Local Tor Client
                        |
                        v
                WOLVERINE COLLECTOR
                        |
                        v
                    Captures
                        |
                        v
                 NORMALIZATION
                        |
                        v
                CANONICAL RECORDS
                        |
                        v
                ENTITY RESOLUTION
                        |
                        v
             RELATIONSHIP PROJECTION
                        |
                        v
                    WOLVERINEDB
                        |
             +----------+----------+
             |                     |
             v                     v
       Relationship Graph       AI/RAG
             |                     |
             +----------+----------+
                        |
                        v
                   ANALYST UI
```

---

# 34. Security Boundaries

Established security/deployment principles include:

- synthetic-only data,
- no real PII,
- no real payment processing,
- no real financial transactions,
- isolated Truth Vault,
- internal database isolation,
- restricted administrative routes,
- Tor gateway controls,
- method restrictions,
- rate limiting,
- security headers,
- production secret injection,
- local Wolverine analyst deployment.

The public source applications and their infrastructure are separate from the local analytical system.

---

# 35. Public Repository

The project was published as:

```text
https://github.com/solankiharsh2837/wolverine-sih
```

The repository contains:

- source applications,
- Wolverine source,
- WolverineDB-related analytical infrastructure,
- synthetic generator,
- activity simulator,
- evaluation,
- deployment configurations,
- testing,
- security audits,
- UX specifications,
- deployment documentation.

---

# 36. Acceptance Evidence

The project has undergone substantial live verification.

Established verification included:

### Source applications

All five applications were run as real application services.

### Databases

The corresponding PostgreSQL/MySQL persistence layers were exercised.

### Live collection

Wolverine successfully collected live HTTP data from all five source applications.

### Normalization

Live source responses were converted into canonical records.

### Graph projection

Normalized/entity-resolved information was projected into the relationship graph.

### AI analysis

The analyst analysis pipeline was exercised against live collected context.

### Tor gateway

Gateway behavior was tested for:

- allowed reads,
- blocked methods,
- blocked administration,
- blocked metrics,
- security headers,
- rate limiting.

### Restart recovery

The complete Docker environment was restarted and recovered.

### Failure recovery

A source site was intentionally stopped and the collector continued processing surviving services.

### User journeys

The reported user-journey suite reached:

```text
65/65 PASS
```

### Scale

The generator was benchmarked through 50,000 synthetic persons.

---

# 37. What Is Established as Implemented

The following are established as implemented and/or live-verified components of the project:

- Wolverine collection pipeline
- heterogeneous source adapters
- raw capture processing
- normalization
- canonical record validation
- entity resolution
- alias/entity matching
- relationship graph projection
- WolverineDB / analytical persistence
- Truth Vault isolation
- Redis event/stream infrastructure
- MinIO object storage
- Wolverine analyst API
- Analyst UI
- AI/RAG analysis layer
- five source applications
- five source application databases
- source application user flows
- synthetic population generator
- 50,000-person scale generation
- continuous activity simulation
- synthetic messages
- synthetic forum activity
- synthetic marketplace activity
- synthetic orders/escrow state transitions
- synthetic reputation activity
- live HTTP collection
- Docker deployment
- Tor gateway infrastructure
- local Wolverine deployment
- public synthetic ecosystem deployment
- acceptance testing
- security/deployment audit tooling

---

# 38. Concepts Discussed but Not Established as Implemented

The following concepts have been discussed during the project's development but should **not** be presented as completed Wolverine functionality unless separately implemented and verified:

- permissioned blockchain controlling Wolverine infrastructure,
- blockchain-controlled dynamic database/compute placement,
- automatic backend deployment per user cluster,
- a novel replacement for Web2/Web3,
- custom anonymity protocol replacing Tor,
- custom anonymous messaging/email protocol,
- real-world criminal intelligence collection,
- real cryptocurrency transactions,
- real darknet marketplace data,
- production-scale real-world surveillance,
- real financial transactions,
- automatic de-anonymization of real individuals.

These belong to future research/design territory rather than established project functionality.

---

# 39. Important Terminology

The project should consistently distinguish:

### Synthetic ecosystem

The five public database-backed applications.

### Source database

The database belonging to one of the five applications.

### Wolverine

The local collection, intelligence, graph, and analysis platform.

### WolverineDB

The persistent analytical data substrate used by Wolverine.

### Truth Vault

The isolated ground-truth/evaluation data store.

### Entity resolution

The process of inferring whether observations across different services may belong to the same synthetic entity.

### Relationship graph

The graph representation produced from canonical and resolved information.

### Activity simulator

The process that continuously creates synthetic application activity.

### Analyst

The person operating the local Wolverine interface.

---

# 40. Final Architectural Conclusion

The established Wolverine project is best understood as:

> **A local intelligence platform that reconstructs relationships across a deliberately constructed, heterogeneous, continuously active synthetic web ecosystem.**

The five websites are not Wolverine itself.

They are the **observable synthetic world**.

Their databases contain the underlying synthetic application state.

Their activity simulator makes that world evolve.

Their Onion Services make the five applications independently reachable through Tor.

Wolverine then observes those services independently.

The pipeline transforms those observations:

```text
OBSERVATION
    ↓
COLLECTION
    ↓
NORMALIZATION
    ↓
CANONICAL DATA
    ↓
ENTITY RESOLUTION
    ↓
RELATIONSHIP GRAPH
    ↓
WOLVERINEDB
    ↓
ANALYSIS
    ↓
ANALYST
```

The central architectural separation is therefore:

```text
┌─────────────────────────────────────────────┐
│              PUBLIC SYNTHETIC WORLD         │
│                                             │
│ Atlas  Briar  Cinder  Drift  Ember          │
│   │      │       │       │      │            │
│   └──────┴───────┴───────┴──────┘            │
│              Independent DBs                 │
└──────────────────────┬──────────────────────┘
                       │
                    TOR NETWORK
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             LOCAL WOLVERINE                  │
│                                             │
│ Collector                                   │
│    ↓                                        │
│ Normalizer                                  │
│    ↓                                        │
│ Entity Resolution                           │
│    ↓                                        │
│ Relationship Graph                          │
│    ↓                                        │
│ WOLVERINEDB                                 │
│    ↓                                        │
│ AI/RAG + Analyst API                        │
│    ↓                                        │
│ Analyst UI                                  │
└─────────────────────────────────────────────┘
```

**WolverineDB is the bridge between raw observation and intelligence.**

It is the persistent analytical substrate that allows Wolverine to move from:

> "I observed these records on several unrelated services"

to:

> "These observations can be represented as connected entities and relationships and investigated through a unified analytical system."

That distinction is the core of the established Wolverine architecture.
```