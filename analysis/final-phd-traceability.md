# Final PhD Traceability Matrix

This matrix links critical claims within the monograph directly to their verifiable implementation locations in the class A codebase.

| Claim | Implementation Source | Document Location |
|-------|------------------------|--------------------|
| **Linear 30-day Temporal Decay** | wolverine-sih > wolverine/src/resolver/entity_resolver.ts | Chapter 4, Appendix H |
| **In-Memory Bounded BFS Graph** | wolverine-sih > wolverine/src/graph/projector.ts | Chapter 4, Chapter 8, Appendix H |
| **CSS-Based CRT Overlay** | Vzeya > src/components/webgl/CRTPostProcessing.tsx | Chapter 7, Appendix H |
| **Simulated Network Transport** | wolverine-db > src/runtime/network_transport.ts | Chapter 5 |
| **0.92 / 0.70 Confidence Thresholds** | wolverine-sih > wolverine/src/resolver/entity_resolver.ts | Chapter 4, Appendix F |
| **BFT 4-of-5 Consensus Logic** | wolverine-db > src/trust_network/consensus.ts | Chapter 5 |
| **Air-gapped Ground Truth DB** | wolverine-sih > docker-compose.yml (wolverine-truth network) | Chapter 9, Appendix G |
