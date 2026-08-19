# LaTeX Documentation Workspace

A clean, modular local LaTeX authoring, live preview, and PDF export workspace designed for technical and scientific documentation.

## Features

- **Multi-File LaTeX Project Support**: Extensible file tree for modular chapters, bibliography (`.bib`), and figures.
- **Isolated Build System**: All intermediate files (`.aux`, `.log`, `.synctex`, etc.) reside strictly in `.build/`, keeping the source tree clean.
- **Multi-Engine Compiler Abstraction**:
  - **Tectonic** (Default / Portable): Self-contained engine with automatic package retrieval.
  - **pdfLaTeX**: Traditional TeX Live / MiKTeX workflow.
  - **XeLaTeX**: Native UTF-8 and system font support.
  - **LuaLaTeX**: Advanced typesetting with embedded Lua engine.
- **Live PDF Preview & Direct Export**: Embedded preview with instant reload upon compilation and a one-click "Export PDF" download action.
- **Structured Error Diagnostics**: Automated log parsing extracts file, line number, and human-readable error messages with direct click-to-line editor navigation.
- **Build Cancellation**: Safely cancel long-running compilations without race conditions or overwriting existing previews.
- **Keyboard Shortcuts**:
  - `Ctrl+S` / `Cmd+S`: Save active file (and auto-build if enabled)
  - `Ctrl+B` / `Cmd+B`: Compile active project

---

## Directory Structure

```text
.
├── README.md
├── package.json
├── .gitignore
├── .build/                     # Isolated build artifacts (gitignored)
│   └── .gitkeep
├── bin/                        # Local portable binaries (gitignored)
│   └── .gitkeep
├── server/                     # Node.js Express Backend
│   ├── index.js                # Server entrypoint
│   ├── api/                    # REST API endpoints (files, project, compile)
│   │   ├── files.js
│   │   ├── projects.js
│   │   └── compile.js
│   ├── compiler/               # Compiler abstraction & management
│   │   ├── compiler.js         # Base engine interface
│   │   ├── compiler-manager.js # Lifecycle, build queue & cancellation
│   │   ├── detector.js         # LaTeX engine detector
│   │   ├── error-parser.js     # Diagnostic & log parser
│   │   ├── build-manager.js    # Build tracking & isolation
│   │   └── engines/            # Engine implementations
│   │       ├── tectonic.js
│   │       ├── pdflatex.js
│   │       ├── xelatex.js
│   │       └── lualatex.js
│   └── utils/
│       ├── filesystem.js
│       ├── process.js
│       └── setup-tectonic.js   # Automated portable engine installer
├── client/                     # Lightweight Frontend UI
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js              # UI coordinator
│       ├── editor.js           # LaTeX editor with syntax highlighting
│       ├── filetree.js         # Multi-file explorer & chapter manager
│       ├── preview.js          # PDF preview & export
│       ├── console.js          # Problems and build log console
│       └── project.js          # REST client
└── workspace/                  # LaTeX Document Source
    ├── project.json            # Project config (rootFile, compiler, autoBuild)
    ├── main.tex                # Root document
    ├── chapters/
    │   └── 01-introduction.tex # Sample chapter
    ├── figures/                # Figures directory
    └── references.bib          # Bibliography database
```

---

## Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **LaTeX Engine**: Tectonic (portable), TeX Live, or MiKTeX.

### 2. Setup Compiler (Portable Tectonic)
If you do not have a system TeX distribution installed, install portable Tectonic with:
```bash
npm run setup
```
This downloads and verifies `tectonic` into the local `bin/` directory.

### 3. Start Application
```bash
npm start
```
Open your browser at **`http://localhost:3000`**.

---

## Project Configuration

The project behavior is configured via `workspace/project.json`:
```json
{
  "name": "Technical Documentation",
  "rootFile": "main.tex",
  "compiler": "tectonic",
  "autoBuild": false,
  "synctex": true,
  "buildDir": ".build"
}
```

## Running Automated Tests

```bash
npm test
```
