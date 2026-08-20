# Final PhD Literature & Scholarship Audit

This document audits the academic literature, citation foundations, and theoretical framing of the 85-page monograph against standard scholarly benchmarks in computer science, cybersecurity, and distributed systems.

---

## 1. Bibliographic Corpus Overview

The repository's master manuscript/bibliography.bib contains 32 peer-reviewed articles, RFC specifications, and foundational textbooks spanning record linkage, string similarity, graph theory, distributed systems, and LLM security.

### Core Scholarly Corpus in ibliography.bib:
1. **Record Linkage & Entity Resolution**:
   - Fellegi & Sunter (1969): *A Theory for Record Linkage* (JASA)
   - Jaro (1989): *Advances in Record-Linkage Methodology* (JASA)
   - Winkler (1990): *String Comparator Metrics* (ASA)
   - Elmagarmid et al. (2007): *Duplicate Record Detection: A Survey* (IEEE TKDE)
   - Getoor & Machanavajjhala (2012): *Entity Resolution: Theory, Practice & Open Challenges* (VLDB)
   - Christen (2012): *Data Matching: Concepts and Techniques* (Springer)
2. **String Similarity & Approximate Matching**:
   - Cohen, Ravikumar, Fienberg (2003): *A Comparison of String Distance Metrics* (IJCAI)
   - Navarro (2001): *A Guided Tour to Approximate String Matching* (ACM Computing Surveys)
3. **Graph Theory & Complex Networks**:
   - Cormen, Leiserson, Rivest, Stein (2009): *Introduction to Algorithms, 3rd Ed.* (MIT Press)
   - Newman (2003 / 2018): *The Structure and Function of Complex Networks* (SIAM Review / Oxford)
4. **Distributed Systems, Consensus & Cryptography**:
   - Lamport, Shostak, Pease (1982): *The Byzantine Generals Problem* (ACM TOPLAS)
   - Castro & Liskov (1999 / 2002): *Practical Byzantine Fault Tolerance* (OSDI / ACM TOCS)
   - Merkle (1987): *A Digital Signature Based on a Conventional Encryption Function* (CRYPTO)
   - Nakamoto (2008): *Bitcoin: A Peer-to-Peer Electronic Cash System*
   - RFC 6962: *Certificate Transparency* (IETF)
   - RFC 8032: *Edwards-Curve Digital Signature Algorithm (Ed25519)* (IETF)
   - RFC 8785: *JSON Canonicalization Scheme (JCS)* (IETF)
5. **AI / RAG & Adversarial Prompt Security**:
   - Lewis et al. (2020): *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (NeurIPS)
   - Gao et al. (2024): *Retrieval-Augmented Generation for Large Language Models: A Survey*
   - Perez & Ribeiro (2022): *Ignore This Title and Hack This Review: Prompt Injection Attacks*
   - Greshake et al. (2023): *Not What You've Signed Up For: Indirect Prompt Injections*
   - Liu et al. (2024): *Formalizing and Benchmarking Prompt Injection Attacks*
6. **Cyber Threat Intelligence & Privacy / Tor**:
   - Liao et al. (2016): *Acing the IOC Game: Automated Extraction of Cyber Threat Intelligence* (CCS)
   - Soska & Christin (2015): *Measuring the Longitudinal Evolution of the Online Anonymous Marketplace Ecosystem* (USENIX Security)
   - Dingledine, Mathewson, Syverson (2004): *Tor: The Second-Generation Onion Router* (USENIX Security)
   - Narayanan & Shmatikov (2008): *Robust De-anonymization of Large Sparse Datasets* (IEEE S&P)
   - Nowok, Raab, Dibben (2016): *synthpop: Bespoke Creation of Synthetic Data in R* (JSS)
   - Shostack (2014): *Threat Modeling: Designing for Security* (Wiley)
   - Sultan et al. (2019): *Container Security: Issues, Challenges, and the Road Ahead* (IEEE Access)
   - Newman (2021): *Building Microservices, 2nd Ed.* (O'Reilly)

---

## 2. In-Text Citation Audit across Current Chapters

| Chapter / Appendix | Citations Present in LaTeX | Citation Density Evaluation | Recommended Scholarly Strengthening |
| :--- | :--- | :--- | :--- |
| **Ch 1: Project Ecosystem** | 0 citations | LOW | Add Fellegi-Sunter, Soska & Christin, and synthetic data ethics citations (Nowok). |
| **Ch 2: Architecture** | 0 citations | LOW | Add microservices (Newman 2021) and container isolation (Sultan 2019) citations. |
| **Ch 3: Data Architecture** | 0 citations | LOW | Add transactional outbox & event streaming literature. |
| **Ch 4: Analytical Methodology** | 0 citations | MEDIUM (Math present) | Directly cite Jaro (1989), Winkler (1990), Cohen (2003), and Gao (2024). |
| **Ch 5: WolverineDB** | \cite{rfc6962}, \cite{castro1999practical} | HIGH | Well-grounded in BFT and Merkle standards. Add RFC 8785 and Lamport (1982). |
| **Ch 6: Security & Ethics** | 0 citations | LOW | Add Dingledine (Tor), Perez & Ribeiro (Prompt Injection), Shostack (STRIDE). |
| **Ch 7: Vzeya Frontend** | 0 citations | LOW | Add WebGL performance and terminal interface interaction literature. |
| **Ch 8: Analyst UI** | 0 citations | LOW | Add CTI visual analytics and provenance visualization citations. |
| **Ch 9: Evaluation** | \cite{wolverine_eval_2026} | MEDIUM | Add precision-recall benchmarking and synthetic evaluation literature. |
| **Ch 10: Conclusion** | 0 citations | LOW | Add future work citations for distributed WAN BFT and disk-backed graph querying. |
| **Appendix C: Data Dictionary** | \cite{db:stonebraker2005}, \cite{graphs:newman2018} | HIGH | Grounded in database theory and network graph structures. |

---

## 3. Literature Quality & Positioning Assessment

1. **Foundational Positioning**:
   - The manuscript positions the problem accurately at the intersection of Fellegi-Sunter record linkage and adversarial CTI analysis.
   - The trade-offs between heuristic blocking and quadratic comparison are theoretically justified.
2. **Missing In-Text Cross-References**:
   - While ibliography.bib is comprehensive and authoritative, the newly generated LaTeX chapters condensed the narrative into direct technical exposition, inadvertently dropping many \cite{...} tags that existed in the earlier 127-page draft.
   - **Remediation**: For full academic publication, re-inserting the explicit in-text citations from the bibliography into Chapters 1, 2, 4, 6, and 10 will elevate the scholarly density to standard journal/conference levels.
