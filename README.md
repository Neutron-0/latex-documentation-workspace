# LaTeX Documentation Workspace 2.0

A sleek, high-performance LaTeX authoring workspace built on **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Monaco Editor**.

---

## ✨ Features

- ⚡ **Next.js 15 & TypeScript**: Fully type-safe REST API routes and interactive React components.
- 🎨 **Sleek Obsidian UI**: Dark aesthetic with glassmorphic accents, custom scrollbars, and modern web design standards.
- 📝 **Monaco LaTeX Editor**: Full LaTeX syntax coloring, bracket pair colorization, line markers for errors/warnings, keyboard shortcuts (`Ctrl+S` to save, `Ctrl+B` to compile), and jump-to-line navigation.
- 📂 **Hierarchical Explorer**: Multi-file project organization (`main.tex`, `chapters/`, `figures/`, `references.bib`), file/folder creation, inline renaming, deletion, and dynamic root-file selection.
- 🔄 **Live PDF Preview & Export**: High-definition embedded PDF preview with persistent caching on failed builds, full-screen expansion, and one-click PDF download.
- 🛠️ **Multi-Engine LaTeX Compiler**: Built-in support for **Tectonic** (default, automatic package resolution), **pdfLaTeX**, **XeLaTeX**, and **LuaLaTeX** with compilation cancellation.
- 📊 **Diagnostics Drawer**: Structured Problems list with clickable line jumps and raw compiler terminal logs with copy/clear actions.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` (tested on Node `v24.18.0`)
- **Git**

### 2. Setup Portable Engine (Optional)
If you don't have TeX Live or MiKTeX installed, download portable Tectonic into `bin/`:
```bash
npm run setup
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3080](http://localhost:3080)** in your browser.

### 4. Build & Production Start
```bash
npm run build
npm start
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>Cmd</kbd> + <kbd>S</kbd> | Save current buffer (triggers compilation if auto-build is active) |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> / <kbd>Cmd</kbd> + <kbd>B</kbd> | Compile LaTeX project and refresh preview |

---

## 📁 Project Structure

```text
Pro-doc/
├── src/
│   ├── app/
│   │   ├── api/                     # Next.js API route handlers
│   │   │   ├── compile/             # Build trigger, cancellation, engines, PDF streaming
│   │   │   ├── files/               # Workspace tree and CRUD handlers
│   │   │   └── project/             # Project configuration API
│   │   ├── globals.css              # Obsidian theme & custom scrollbar styles
│   │   ├── layout.tsx               # Root layout & meta tags
│   │   └── page.tsx                 # Main workspace coordinator
│   ├── components/                  # React UI components
│   │   ├── Toolbar.tsx              # Glassmorphic top bar & build actions
│   │   ├── FileTree.tsx             # Tree file manager & chapter explorer
│   │   ├── LatexMonacoEditor.tsx    # Monaco Editor with LaTeX theme
│   │   ├── PdfViewer.tsx            # Live PDF preview & full screen mode
│   │   └── DiagnosticsPanel.tsx     # Problems and raw output drawer
│   └── lib/                         # Type-safe compiler engine & utilities
│       ├── compiler/                # Tectonic, pdfLaTeX, XeLaTeX, LuaLaTeX adapters
│       ├── utils/                   # Safe path resolution and process isolation
│       └── types.ts                 # Core TypeScript definitions
├── workspace/                       # Modular LaTeX document project
│   ├── project.json                 # Project configuration
│   ├── main.tex                     # Root LaTeX document
│   ├── chapters/                    # Chapter modular includes
│   └── references.bib               # BibTeX citations
├── scripts/                         # Setup and testing scripts
│   ├── setup-tectonic.js
│   └── run-tests.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
