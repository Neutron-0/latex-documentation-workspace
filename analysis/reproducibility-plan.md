# Reproducibility Plan

## 1. Environment Requirements

To replicate the experimental setup for the Wolverine platform, the following components are required:

- **Container Orchestration:** Docker and Docker Compose
- **Data Generation:** Python 3.10+ for the Synthetic Population Generator
- **Services:** PostgreSQL 16, MySQL 8.4, Redis, MinIO

## 2. Deployment Steps

1. **Initialize Infrastructure:** Execute `docker-compose up -d` to launch the 14-container topology (web apps, databases, cache, storage, and intelligence services).
2. **Generate Synthetic Data:** Run the Python data generator to seed the 5 heterogeneous web apps with an initial population.
3. **Execute Pipeline:** Trigger the Wolverine ingestion pipeline to extract, normalize, and resolve entities into the Truth Vault.

## 3. Seed Control

To ensure deterministic synthetic data generation, the Python generator must be initialized with a fixed random seed.
- **Synthetic Seed:** `42` (or the specific integer used in the primary experiment)
- This ensures the same baseline population, aliases, and cross-site cues are generated across runs.

## 4. Exact Reproduction Limitations

While the data ingestion and resolution steps are deterministic, exact end-to-end reproduction of the evaluation metrics reported in project documentation is **not possible** due to the following hardcoded limitations:

1. **Mocked Evaluation Outputs:** The evaluation module does not dynamically compute metrics (e.g., precision, recall, F1) over the resolved data. It outputs **hardcoded metric values** (e.g., a claimed 0.928 precision) purely for demonstration purposes.
2. **Simulated Cryptographic Network:** WolverineDB's network and EVM anchoring are purely in-memory simulations (DirectMemoryNetworkTransport). It does not operate on a real distributed ledger.
3. **Mocked Analyst UI:** The Vzeya frontend has no functional API integration and relies on hardcoded data arrays for presentation. Visualizing the reproduced Truth Vault data requires manual database querying rather than using the UI.
