# Reconstruction Truth Model (Post-Audit Correction)
1. **Graph Architecture**: Graph projection and traversal strictly utilize an in-memory Bounded BFS (depth 4, max 500 nodes). The system does NOT use PostgreSQL recursive CTEs.
2. **Temporal Decay**: The proximity score utilizes a 30-day **Linear Decay** function. It is NOT exponential.
3. **Vzeya CRT Degradation**: The CRT monitor scanline and vignette effects are implemented purely via a CSS epeating-linear-gradient overlay, NOT WebGL fragment shaders. WebGL is reserved for interactive particle systems and specific 3D canvases.
4. **Entity Resolution Thresholds**: Auto-link at 0.92, Review Queue at 0.70.
