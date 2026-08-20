# Phase G: Mathematical Consistency Audit

## 1. Inventory & Verification
The manuscript contains the following formal mathematical definitions, all of which have been verified for notation consistency and implementation correspondence:

- **Jaro Similarity ($Sim_J$):** Chapter 7.
- **Jaro-Winkler Similarity ($Sim_{JW}$):** Chapter 7.
- **Temporal Decay ($f(t)$):** Chapter 7 (30-day half-life).
- **Composite Entity Resolution Score ($S$):** Chapter 7.
- **Merkle Hash Chain ($H_i$):** Appendix C.
- **Precision (P), Recall (R), F1 Score:** Appendix D (Blueprint Equations).

## 2. Scientific Disclosure & Constraints
- **Complexity vs. Performance:** The BFS is defined as theoretically bounded by $O(|V| + |E|)$, but explicitly constrained in implementation to $d \le 4, N \le 500$ (Ch 7, Ch 8).
- **Heuristic vs. Probability:** The score $S$ is correctly defined as a heuristic weighted sum, *not* a statistically calibrated probability (Ch 10, Ch 12).
- **Metrics vs. Static Mocks:** The Precision ($P=0.9280$), Recall ($R=0.4598$), and $F1=0.6149$ values are isolated in Chapter 10 and Appendix D as **static formatting stubs**. The mathematical formulas for calculating them are cleanly separated as future-work blueprints.
- **Simulated Variables:** The `activityOverlap` feature in the composite score is explicitly identified as hardcoded to `0.5` across the manuscript.

## 3. Canonical Notation Established
- $S$: Composite correlation score.
- $N$: Node bound (limit 500).
- $d$: Traversal depth (limit 4).
- $S_0$: Master deterministic seed (42).
- $H_i$: State hash in WolverineDB.
