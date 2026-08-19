# Wolverine Project Overview

## Project Identity
- **Name**: Wolverine
- **Organization**: DeusData (MIT License)
- **GitHub**: https://github.com/solankiharsh2837/wolverine-sih
- **Context**: Smart India Hackathon (SIH) project
- **Status**: COMPLETE & READY FOR DEMONSTRATION (per docs)

## What Wolverine Is
A local intelligence and analysis platform that:
1. **[CLAIMED]** Operates a synthetic ecosystem of 5 independently implemented web applications (Atlas Market, Briar Bazaar, Cinder Exchange, Drift Forum, Ember Commons)
2. **[CLAIMED]** Each uses different tech stacks: Node.js/Express, Python/Django, PHP/Laravel, Go/Chi, Rust/Axum
3. **[CLAIMED]** Each has its own database (4 PostgreSQL, 1 MySQL)
4. **[CLAIMED]** Each is exposed through separate Tor Onion Services
5. **[CLAIMED]** A synthetic population generator creates 50,000 persons with ~89,605 accounts distributed across sites
6. **[CLAIMED]** Wolverine collects observable HTTP data from these sites, normalizes it into canonical records, resolves entities across sites, builds relationship graphs, and provides AI-assisted analysis
7. **[VERIFIED]** Ground truth evaluation achieves 0.9280 Precision, 0.4598 Recall, 0.6149 F1 (via evaluator)

## Two-Environment Architecture
1. **[CLAIMED]** **Public Synthetic Ecosystem**: The 5 web apps + their databases + activity simulator + Tor gateway
2. **[CLAIMED]** **Local Wolverine Analyst Workstation**: Collection pipeline + WolverineDB + Entity Resolution + Relationship Graph + AI/RAG + Analyst UI + Truth Vault

## Additional Components
- **[VERIFIED]** **Vzeya** ([`d:\Vault\Vzeya`](file:///d:/Vault/Vzeya)): A Next.js 15 cinematic proof-of-concept frontend. It is a VISUAL SIMULATION of a law enforcement cyber-intelligence platform. It does NOT perform actual intelligence analysis. All data is mock/in-memory arrays. Uses Three.js, WebGL shaders (CRT post-processing), GSAP, Framer Motion. Contains simulated deanonymization pipelines, mock authentication, tactical HUD displays, and network graph visualizations. KEY FACT: Vzeya is the presentation/demo layer, NOT the analytical engine.
- **[VERIFIED]** **wolverine-db** ([`d:\Vault\wolverine-db`](file:///d:/Vault/wolverine-db)): An independent cryptographic trust layer (139 source files). NOT a database itself, but a middleware that sits alongside PostgreSQL/MySQL/SQLite databases. Implements: deterministic binary serialization, Merkle state checkpoints, BFT consensus engines, Ed25519 cryptographic approval, continuous state reconstruction, anomaly detection (sentinel), and catastrophe recovery. Has 4 documented open issues (replay protection, gateway binding, signer auth, TOCTOU).
- **[CLAIMED]** **OSINT Super-Dashboard** ([`d:\Vault\OSINT\osint-super-dashboard`](file:///d:/Vault/OSINT/osint-super-dashboard)): Electron + Next.js + FastAPI tool for consolidating OSINT bookmark exports
- **[CLAIMED]** **SIH Bootcamp Simulator** ([`d:\Vault\sih-bootcamp-simulator`](file:///d:/Vault/sih-bootcamp-simulator)): Training/demo scaffolding

## Evidence Classification Rules
Throughout the documentation, evidence is classified as:
- **VERIFIED**: Confirmed by reading actual source code
- **CLAIMED**: Stated in documentation but implementation details not fully verified
- **INFERRED**: Logically deduced from available evidence
