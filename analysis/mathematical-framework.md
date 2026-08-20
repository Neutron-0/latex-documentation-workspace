# MATHEMATICAL FRAMEWORK

This document strictly defines the mathematical models used within the Wolverine SIH ecosystem, derived explicitly from the source code. It dictates the equations that must be used in the LaTeX manuscript.

## 1. Entity Resolution: Jaro-Winkler Similarity
- **Source Code**: `wolverine/src/resolver/entity_resolver.ts`
- **Observed Computation**: Combines matching characters and transpositions with a prefix scale.
- **Equation**: 
  $$S_{JW}(s_1, s_2) = S_J(s_1, s_2) + p \cdot \ell \cdot (1 - S_J(s_1, s_2))$$
- **Variable Definitions**: $S_J$ = standard Jaro similarity, $p$ = prefix scale (0.1), $\ell$ = common prefix length (max 4).

## 2. Entity Resolution: Temporal Proximity Decay
- **Source Code**: `wolverine/src/resolver/entity_resolver.ts`
- **Observed Computation**: A linear decay function based on the difference in registration dates. *Note: The previous manuscript falsely claimed this was exponential.*
- **Equation**:
  $$S_{temporal} = \max\left(0, 1 - \frac{|t_1 - t_2|}{T_{max}}\right)$$
- **Variable Definitions**: $t_1, t_2$ = account creation timestamps, $T_{max}$ = maximum window threshold (30 days).

## 3. Entity Resolution: Composite Score
- **Source Code**: `wolverine/src/resolver/entity_resolver.ts`
- **Observed Computation**: Weighted sum of similarity vectors.
- **Equation**:
  $$S = 0.30 \cdot S_{alias} + 0.15 \cdot S_{name} + 0.20 \cdot S_{temporal} + 0.15 \cdot S_{activity} + 0.20 \cdot S_{behavioral}$$
- **Classification Boundaries**:
  - Auto-Link: $S \ge 0.92$
  - Review Queue: $0.70 \le S < 0.92$
  - Reject: $S < 0.70$
- *Note: $S_{activity}$ is currently a hardcoded placeholder returning 0.5 in the source code.*

## 4. Graph Projection: Traversal Bounds
- **Source Code**: `wolverine/src/graph/projector.ts`
- **Observed Computation**: Bounded Breadth-First Search (BFS) to prevent explosive fan-out.
- **Equation**: 
  $$O(|V| + |E|)$$ bounded such that $depth(v) \le 4$ and $\sum |V| \le 500$

## 5. WolverineDB: Cryptographic Hash Chain
- **Source Code**: `wolverine-db/src/crypto/hash.ts`
- **Observed Computation**: RFC 6962 compliant Merkle Tree leaf hashing and state transition hashing.
- **Equation**:
  $$H_{i} = SHA256(0x00 || payload || H_{i-1})$$
- **Variable Definitions**: $0x00$ = leaf prefix (prevents second preimage attacks), $payload$ = RFC 8785 canonicalized JSON.

## 6. WolverineDB: BFT Consensus Threshold
- **Source Code**: `wolverine-db/src/trust_network/consensus.ts`
- **Observed Computation**: Byzantine Fault Tolerant quorum requiring a supermajority of validator attestations.
- **Equation**:
  $$Q = \lfloor \frac{2N}{3} \rfloor + 1$$
- **Variable Definitions**: $N$ = total validators (5). For $N=5$, $Q=4$. The system tolerates $f=1$ Byzantine fault ($N \ge 3f + 1$).

## 7. Evaluation Metrics (Static)
- **Source Code**: `evaluator/src/evaluator/__main__.py`
- **Observed Computation**: Standard precision, recall, and F1-score computation against synthetic ground truth.
- **Equations**:
  $$Precision (P) = \frac{TP}{TP + FP} = 0.9280$$
  $$Recall (R) = \frac{TP}{TP + FN} = 0.4598$$
  $$F_1 = 2 \cdot \frac{P \cdot R}{P + R} = 0.6149$$
- *Note: These are static results of a benchmark run, not dynamic formulas calculated at runtime.*
