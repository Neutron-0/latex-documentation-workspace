# Final Mathematical Audit

## 1. Objective
To independently verify the accuracy, clarity, and consistency of all mathematical equations and formal definitions within the manuscript.

## 2. Equation Verification

### Jaro and Jaro-Winkler Similarities ($Sim_{JW}$)
- **Location:** Chapter 7.
- **Verification:** Correctly models the classical Winkler extension ($Sim_J + l \cdot p (1 - Sim_J)$). Variables ($m$, $|s_1|$, $t$, $l$, $p$) are explicitly defined.
- **Implementation Status:** Matches the functional string comparison mechanics.

### Temporal Decay ($f(t)$)
- **Location:** Chapter 7.
- **Verification:** Modeled as $f(t) = e^{-\lambda \Delta t}$. Variables defined.
- **Implementation Status:** Matches the heuristic time-bound weighting calculation.

### Composite Score ($S$)
- **Location:** Chapter 7.
- **Verification:** Modeled as a weighted sum: $S = \sum w_i \cdot x_i$. 
- **Scientific Honesty Check:** The text rigorously states this is a "heuristic score" and *not* a statistically calibrated probability, thus preserving mathematical integrity. The $activityOverlap$ parameter ($x_{act}$) is clearly defined as statically forced to $0.5$.

### Merkle Hash Chain ($H_i$)
- **Location:** Appendix C.
- **Verification:** Defined as $H_i = \text{SHA256}(H_{i-1} \parallel \text{SHA256}(m_i))$.
- **Implementation Status:** Authentically reflects the recurrent logic deployed in the `postgres-internal` database triggers.

### Precision (P), Recall (R), F1 Score
- **Location:** Appendix D.
- **Verification:** Defined via standard True Positive (TP), False Positive (FP), False Negative (FN) formulations.
- **Scientific Honesty Check:** These formulas are correctly walled off as "Future Blueprints" to ensure the reader does not mistake them as the origin of the $0.9280$ mock output string.

## 3. Notation Consistency
- All subscripts (e.g., $JW$, $J$, $act$, $temporal$) are used uniformly.
- Threshold parameters (0.70, 0.92) are expressed consistently without contradictory operators.
