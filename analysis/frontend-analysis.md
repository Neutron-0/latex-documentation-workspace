### Vzeya Frontend (d:\Vault\Vzeya)

#### Technology Stack [VERIFIED]
- Next.js 15.3 (App Router)
- React 19.1
- TypeScript
- TailwindCSS 4.x
- Three.js / @react-three/fiber (WebGL)
- GSAP / Framer Motion / Lenis (animations)
- Howler.js (tactical audio)
- Xterm.js (terminal simulations)
- Zustand (state management)

#### Application Pages [VERIFIED]
1. **Homepage** (`/`): 4-phase cinematic narrative. AuthProvider wraps entire app. Persistent R3F WebGL canvas with CRT post-processing. Lenis smooth scrolling.
2. **Architecture** (`/architecture`): Tactical dashboard of 'Distributed Microservice Topology'. Mock ARCHITECTURE_LAYERS data.
3. **Demonstration** (`/demonstration`): 'Live Attribution Laboratory Simulation'. 6-step interactive pipeline: Ingest → Timing → VPN Strip → OSINT → ML → Dossier. Uses setTimeout for progress. Mock targets like 'SilkRoad-V3 Admin'.
4. **Intelligence** (`/intelligence`): Real-time Intelligence HUD. NetworkGraph component showing mock TOR circuits, filterable INTERCEPT_LOGS.
5. **Demos** (`/demos/[id]`): WebGL/WebGPU demonstration viewer.
6. **Login** (`/login`): 'Operative Authentication Gateway'. Pre-filled admin credentials. DotGridBackground + ImageRevealShader.
7. **Register** (`/register`): 'Enrollment Gateway'.

#### Key Components [VERIFIED]
- DashboardLayout.tsx: Master tactical wrapper, animated header, LiveClock, auth status
- NetworkGraph.tsx: Mock IP node and VPN endpoint visualization
- CRTPostProcessing.tsx: Persistent CRT shader effect (scanlines, chromatic aberration)
- narrative/* components: Scroll-synced 3D cinematic scenes

#### State Management [VERIFIED]
- auth-context.tsx: React Context with mock user array (in-memory). loginUser/registerUser functions.
- narrativeStore.ts: Zustand store mapping Lenis scroll progress (0-1) to 4 phases
- spatialSensorsStore.ts: Zustand for spatial/sensor data
- sound.ts: Howler.js controller for tactical audio

#### CRITICAL FINDING [VERIFIED]
Vzeya performs NO actual intelligence analysis. There are:
- No database connections (no Prisma, Drizzle, or query libraries)
- No API routes (src/app/api/ does not exist)
- No real network analysis
- No ML/NLP algorithms
- All data is hardcoded in-memory arrays and constants
- Algorithm labels ('Pearson Timing Correlation', 'BiLSTM Stylometry', 'DNS Leak Decapsulator') are visual decorations only

Vzeya is the PRESENTATION LAYER for the project. Its purpose is cinematic storytelling and visual demonstration of the CONCEPT. The actual analytical work happens in wolverine-sih/wolverine/.

### Analyst UI (d:\Vault\wolverine-sih\analyst-ui)
- React + Vite SPA
- Containerized in Docker (port 5173:80)
- Depends on wolverine-api
- Actual analytical interface for the Wolverine system
- CLAIMED as functional; code not deeply inspected in this pass

#### Relationship Between UIs
```
Vzeya           = Cinematic presentation / visual demo / portfolio piece
Analyst UI      = Functional analytical interface (React+Vite, connects to real API)
```
These serve fundamentally different purposes.
