# Phase B: Expansion Report (Chapters 1–4)

## 1. Depth Score Changes
- **Chapter 1 (Introduction):** Depth score improved from 2 to 5.
- **Chapter 2 (Foundations):** Depth score improved from 2 to 5.
- **Chapter 3 (Related Work):** Depth score improved from 3 to 5.
- **Chapter 4 (Requirements and Threat Model):** Depth score improved from 3 to 5.

## 2. Word/Page Count Changes
- **Chapter 1:** Expanded from ~39 lines to ~131 lines.
- **Chapter 2:** Expanded from ~42 lines to ~123 lines.
- **Chapter 3:** Expanded from ~37 lines to ~128 lines.
- **Chapter 4:** Expanded from ~67 lines to ~127 lines.
- The overall PDF length has increased, delivering a substantially deeper academic foundation.

## 3. New Tables Added
1. **System Objectives and Technical Mapping** (Chapter 1)
2. **Operational Scope and Explicit System Boundaries** (Chapter 1)
3. **Comparative Synthesis of Literature vs. Implementation** (Chapter 3)
4. **System Asset Inventory** (Chapter 4)
5. **Functional Requirements Traceability** (Chapter 4)
6. **System Threat Matrix and Mitigations** (Chapter 4)

## 4. New Worked Examples
- **String Similarity (Jaro-Winkler vs Levenshtein):** An explicitly labeled synthetic example demonstrating why `shadow_broker` and `shadowbroker99` match under Jaro-Winkler but are penalized under Levenshtein (Chapter 2).

## 5. New Equations
- Mathematical depth was deferred primarily to Chapter 7 per the instructions, but the Fellegi-Sunter model comparison vector $\gamma = [\gamma_1, \dots, \gamma_K]$ and computational bound notations $O(|A| \times |B|)$ were integrated conceptually (Chapter 2 \& 3).

## 6. New Bibliography Entries
- Dingledine et al. (Tor, 2004)
- RFC 6962 (Certificate Transparency)
These were formally added to `bibliography.bib` and properly cited using `\cite{}`.

## 7. Technical Details Newly Documented
- Explicit formalization of the 4-rule Regex RAG sanitization and the 500-char LLM input limits.
- Clear trust boundary delineation (DMZ vs. Internal vs. Truth).
- Detailed definition of Canonical Record creation (normalization, extraction, provenance, hashing).
- System asset criticality classifications.
- Hard limits for graph processing ($d \le 4$, $N \le 500$).

## 8. Contradictions Discovered
- None.

## 9. Scientific Disclosures Preserved
- The F1 metric is explicitly identified as a static mock output, NOT a dynamic benchmark (Chapter 1, Scope).
- The "in-memory BFS" limitation is heavily emphasized against previous false claims of "PostgreSQL CTEs" (Chapter 3).
- Vzeya is classified strictly as a presentation layer using mock data, separate from Analyst UI (Chapter 1, Contributions).
- BFT network consensus is explicitly stated to be simulated (Chapter 3 \& 4).
- The synthetic-only constraint is thoroughly defended (Chapter 4, NFR-04).

## 10. Tectonic Build Status
- **Success:** The compilation returned exit code 0 (`note: generating pdf: manuscript\main.pdf`).

## 11. Viewer Synchronization Status
- **Success:** The canonical manuscript remains `manuscript/main.tex`. All cross-references are valid, and the visual rendering is unaffected. No configurations or project setups were broken.
