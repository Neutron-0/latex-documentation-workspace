# Phase G: Terminology Audit

## 1. Verified Distinctions
The manuscript adheres strictly to the following critical terminology boundaries:

- **Synthetic vs. Real-World:** The terms "synthetic persona", "virtual human", and "simulated ecosystem" are used exclusively. No claims of "real-world operator identification" exist.
- **Correlation vs. Attribution:** A Jaro-Winkler match is universally termed an "analyst hypothesis", a "probabilistic correlation", or a "candidate edge". It is never termed "legal human attribution" or "proven identity."
- **Specification vs. Implementation:** WolverineDB's formal Byzantine guarantees are termed "specifications", while the `DirectMemoryNetworkTransport` is explicitly termed a "simulation."
- **Prototype vs. Production:** The system is exclusively defined as a functional "prototype" (Class B evidence), expressly warning against assumptions of "production scalability" (Class E missing evidence).

## 2. Regression Check
- Searched for instances where the mocked F1 score ($0.6149$) might have been accidentally framed as an empirical performance metric. No such regressions exist.
- Searched for instances of "air-gap" applied to the `postgres-truth` vault. Corrected/clarified to state it is a Docker `internal: true` virtual packet-drop boundary, not a physical hardware air-gap.

## 3. Quantitative Consistency Checked
- 14 containers: Consistent.
- 3 networks (dmz, internal, truth): Consistent.
- 5 platforms (Atlas, Briar, Cinder, Drift, Ember): Consistent.
- 50,000 personas, 89,605 accounts, 39,605 ground-truth links: Consistent.
- $S_0 = 42$: Consistent.
- 35% handle mutation rate: Consistent.
- 3-character blocking prefix: Consistent.
- 30-day temporal decay: Consistent.
- `activityOverlap = 0.5`: Consistent.
- 4-character cross-site cue: Consistent.
- $d \le 4, N \le 500$: Consistent.
- Thresholds: 0.70 (Review), 0.92 (Linked): Consistent.
