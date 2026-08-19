# Repository Inventory

## `d:\Vault\wolverine-sih` (Main SIH Project)
Structure:
- `analyst-ui/` — React + Vite analyst interface
- `contracts/` — JSON Schema, OpenAPI, AsyncAPI specs
- `deploy/` — Deployment configs
- `docs/` — 33 documentation files + 11 subdirectories + `project-manifest.json` + `benchmark_results.json`
- `evaluator/` — Python: `metrics.py` (precision/recall/F1 computation), `__main__.py`
- `generator/` — Python: `engine.py` (729 lines, SyntheticWorldEngine class), `models.py`, `vocabulary.py`, `id_utils.py`, `activity_simulator.py`, `seeder.py`, `exporters/`
- `packages/` — Shared TypeScript types (`@wolverine/shared-types`)
- `scripts/` — DB migration, seeding, testing, Tor safety scripts
- `sites/atlas-market` — Node.js + Express + PostgreSQL
- `sites/briar-bazaar` — Python + Django + PostgreSQL
- `sites/cinder-exchange` — PHP + Laravel + MySQL
- `sites/drift-forum` — Go + Chi + PostgreSQL + Redis
- `sites/ember-commons` — Rust + Axum + PostgreSQL
- `tor-gateway/` — Nginx + Tor configuration
- `wolverine/` — Core pipeline: 8 TypeScript source files in `src/` (`ai/rag.ts`, `api/server.ts`, `collector/adapters.ts`, `graph/projector.ts`, `normalizer/parsers.ts`, `pipeline/processor.ts`, `resolver/entity_resolver.ts`, `index.ts`)
- `docker-compose.yml` — 13 services defined

## `d:\Vault\Vzeya` (Frontend PoC)
- Next.js 15 App Router
- `src/app/` pages: `/`, `/architecture`, `/demonstration`, `/intelligence`, `/demos/[id]`, `/login`, `/register`
- `src/components/` — DashboardLayout, NetworkGraph, CRTPostProcessing, narrative components, WebGL shaders
- `src/lib/` — `auth-context.tsx` (mock auth), `narrativeStore.ts` (Zustand), `sound.ts` (Howler.js)
- Dependencies: Three.js, @react-three/fiber, GSAP, Framer Motion, Lenis, Howler, Xterm

## `d:\Vault\wolverine-db` (Cryptographic Trust Layer)
- 139 TypeScript source files in `src/`
- Directories: `adapters/`, `anchors/`, `bft_hardening/`, `binary/`, `checkpoint/`, `cli/`, `continuous_reconstruction/`, `crypto/`, `daemons/`, `demo/`, `postgres/`, `runtime/`, `sentinel/`, `survivability/`
- Open issues in `d:\Vault\wolverine-db-issues/`: 4 documented bugs

## `d:\Vault\chats` (Evidence Documents)
- Single file: `WOLVERINE_PROJECT_ESTABLISHED_FACTS.md` (1314 lines, 29KB)
- Contains 40 numbered sections of established/verified project facts
