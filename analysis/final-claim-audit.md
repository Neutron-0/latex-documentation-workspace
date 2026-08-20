# Final Claim Audit

## 1. Objective
To adversarially evaluate the highest-risk claims in the manuscript, verifying that each claim is supported by actual prototype evidence and appropriately classified.

## 2. Claim Evaluation Matrix

| Claim | Location | Evidence Source | Evidence Class | Status | Required Correction | Severity |
|-------|----------|-----------------|----------------|--------|---------------------|----------|
| 14-container trust-zone architecture isolates ingest from truth | Ch 5 | `docker-compose.yml` | B (Functional) | **VERIFIED** | None | N/A |
| BFT Consensus guarantees ledger integrity | Ch 5, App C | `transport.ts` | D (Simulated) | **SIMULATED** | Must explicitly cite `DirectMemoryNetworkTransport`. (Done in Ch 12) | N/A |
| Jaro-Winkler heuristics compute human identity | Ch 7 | `entity_resolver.ts` | D (Simulated) | **CONTRADICTED** | Must term it "probabilistic correlation". (Corrected in Ch 11) | N/A |
| activityOverlap weight is 0.15 dynamically | Ch 7 | `entity_resolver.ts` | D (Simulated) | **SIMULATED** | Explicitly state it is hardcoded to 0.5. (Done in Ch 7/12) | N/A |
| Generator creates 89,605 accounts deterministically | Ch 9, App A | `generator/main.py` | B (Functional) | **VERIFIED** | None | N/A |
| Precision is 0.9280 | Ch 10, App D | `evaluator/__main__.py` | D (Simulated) | **SIMULATED** | Strictly define as a static mock output. (Done in Ch 10/12/App D) | N/A |
| RAG sanitization defends against Prompt Injection | Ch 11 | `rag.ts` | B (Functional) | **PARTIALLY VERIFIED** | Must state vulnerability to semantic smuggling. (Done in Ch 11) | N/A |
| BFS projection scales to graph databases | Ch 13 | `projector.ts` | E (Missing) | **INFERRED** | Must state memory limits ($N \le 500$) prevent this currently. (Done in Ch 12) | N/A |

## 3. Regression Audit (Metrics)
Searched manuscript for instances of $0.9280$, $0.4598$, and $0.6149$. Every instance is prefixed or immediately followed by explicit classification as a static formatting stub or a mock output. Zero occurrences imply empirical validity.

## 4. Correlation vs Attribution Audit
Searched for "human attribution" and "proven identity." The manuscript correctly isolates these terms within the ethical boundary warnings (\Cref{ch:security-ethics}). The phrase "candidate linkage" or "analyst hypothesis" is universally used when describing the algorithmic outputs.

## 5. Prototype vs Production Audit
Searched for "production scalable" and "robust." All usages of these terms have been strictly relegated to the "Prototype vs Production" roadmap (\Cref{ch:discussion}, \Cref{ch:future-work}), and are explicitly identified as missing experiments.
