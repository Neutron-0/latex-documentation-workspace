# Phase G: Bibliography Audit

## 1. Inventory & Verification
The `manuscript/bibliography.bib` file contains authoritative, peer-reviewed sources supporting the methodologies employed in the prototype:

- **Entity Resolution:**
  - `fellegi1969theory` (Fellegi-Sunter model)
  - `jaro1989advances` (Jaro string comparator)
  - `winkler1990string` (Jaro-Winkler enhancements)
  - `christen2012data` (General data matching and duplicate detection)
- **Architecture & Security:**
  - `castro2002practical` (PBFT consensus underlying WolverineDB specs)
  - `merkle1987digital` (Merkle trees underlying the CDC ledger)
  - `rfc6962` (Certificate Transparency, mapped to the state-hashing design)
  - `dingledine2004tor` (Tor network architecture for the DMZ gateway)
- **AI & Retrieval:**
  - `lewis2020retrieval` (Retrieval-Augmented Generation / RAG)
  - `perez2022ignore` (Prompt injection attacks / Semantic jailbreaking)

## 2. Integrity Checks
- **Relevance:** No filler citations. Every source maps directly to a specific implemented module or a documented security vulnerability (e.g., prompt injection).
- **Standards:** RFC 6962 is appropriately used as the authoritative standard for the cryptographic transparency ledger.
- **Completeness:** All citations referenced in the text are present in the `.bib` file. No missing citations.
