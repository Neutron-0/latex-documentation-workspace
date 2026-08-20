# Module Traceability Matrix

## 1. Objective
To maintain an authoritative module inventory linking the repository structure to the technical manuscript.

## 2. Core Modules

| Repository | Module Path | Purpose | Manuscript Ref | Status |
|------------|-------------|---------|----------------|--------|
| `wolverine-sih` | `wolverine/src/api/server.ts` | Main Express intelligence pipeline | Ch 5, App B | Implemented |
| `wolverine-sih` | `wolverine/src/ai/rag.ts` | Local LLM RAG orchestrator | Ch 7, 11 | Implemented |
| `wolverine-sih` | `wolverine/src/resolver/entity_resolver.ts` | Jaro-Winkler entity linkage | Ch 7 | Implemented |
| `wolverine-sih` | `wolverine/src/graph/projector.ts` | In-memory BFS projection ($N \le 500$) | Ch 7 | Implemented |
| `wolverine-sih` | `wolverine/src/normalizer/parsers.ts` | Payload to Canonical mapping | Ch 6, App A | Implemented |
| `wolverine-sih` | `generator/main.py` | Synthetic state determinism | Ch 9, App A | Implemented |
| `wolverine-sih` | `evaluator/__main__.py` | CLI stub for evaluation metrics | Ch 10, App D | Implemented (Stub) |
| `wolverine-sih` | `tor-gateway/` | SOCKS5 proxy for DMZ ingress | Ch 5, Ch 11 | Implemented |
| `wolverine-sih` | `sites/` | The 5 synthetic mock platforms | Ch 5 | Implemented |
| `wolverine-db` | `pg-plugin/src/merkle_trigger.c` | Core CDC hashing trigger | App C | Implemented |
| `wolverine-db` | `typescript-sdk/src/transport.ts` | BFT event bus simulation | App C | Simulated |
| `Vzeya` | `src/app/` | Cinematic frontend (mock data) | Ch 8 | Implemented |

## 3. Findings
All major architectural components highlighted in the manuscript successfully trace directly back to physical source code. No "phantom" architectural modules were invented in the text.
