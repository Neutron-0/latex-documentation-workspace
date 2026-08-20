# Runtime Conformance Audit

## 1. Objective
To document the alignment between the theoretical claims made in the manuscript regarding runtime behavior and the actual execution realities of the current Dockerized prototype.

## 2. Runtime Execution Observations

### A. Environment Initialization
- **Manuscript Claim:** `docker-compose up -d` spins up 14 containers across 3 networks.
- **Runtime Reality:** Confirmed via inspection of `docker-compose.yml` and network specifications. The environment is heavily containerized.

### B. Synthetic Generation
- **Manuscript Claim:** `main.py --seed 42` deterministically generates 50,000 personas.
- **Runtime Reality:** The python module exists in `wolverine-sih/generator/main.py`. The parameters are hardcoded and exactly map to the manuscript's claims.

### C. Evaluation Metrics
- **Manuscript Claim:** Static stubs output $0.9280$ Precision, $0.4598$ Recall.
- **Runtime Reality:** Verified. Running `python -m evaluator` in the CLI mock deterministically outputs these string formatting blocks. No SQL queries are executed against the truth vault during this process.

### D. WolverineDB BFT
- **Manuscript Claim:** `DirectMemoryNetworkTransport` simulates BFT in-process.
- **Runtime Reality:** Confirmed via code inspection of `wolverine-db/typescript-sdk/src/transport.ts`. The transport layer relies strictly on local memory structures, bypassing standard TCP socket communication entirely.

### E. Graph Projection Limits
- **Manuscript Claim:** The BFS projection fails gracefully if $N>500$.
- **Runtime Reality:** Confirmed via `wolverine-sih/wolverine/src/graph/projector.ts`. The V8 heap limits are hardcoded. Exceeding $N=500$ truncates the array and returns a 206 Partial Content HTTP status to the UI.
