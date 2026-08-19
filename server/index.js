const express = require('express');
const path = require('path');
const { CompilerManager } = require('./compiler/compiler-manager');
const { createFilesRouter } = require('./api/files');
const { createProjectsRouter } = require('./api/projects');
const { createCompileRouter } = require('./api/compile');
const { ensureDir } = require('./utils/filesystem');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const WORKSPACE_DIR = path.join(PROJECT_ROOT, 'workspace');
const BUILD_DIR = path.join(PROJECT_ROOT, '.build');
const CLIENT_DIR = path.join(PROJECT_ROOT, 'client');
const PORT = process.env.PORT || 3000;

ensureDir(WORKSPACE_DIR);
ensureDir(BUILD_DIR);

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Instantiate compiler manager
const compilerManager = new CompilerManager(PROJECT_ROOT);

// API Routes
app.use('/api/files', createFilesRouter(WORKSPACE_DIR));
app.use('/api/project', createProjectsRouter(WORKSPACE_DIR));
app.use('/api/compile', createCompileRouter(compilerManager));

// Serve client static files
app.use(express.static(CLIENT_DIR));

// Fallback to client/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

// Start server
const server = app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(` LaTeX Documentation Workspace`);
  console.log(` Running locally at: http://localhost:${PORT}`);
  console.log('====================================================');

  try {
    const engines = await compilerManager.getEngines();
    console.log(`Available LaTeX Engines:`);
    if (engines.available.length === 0) {
      console.log(`  [!] No LaTeX engine found on PATH or in bin/.`);
      console.log(`  [!] Run "npm run setup" to install portable Tectonic.`);
    } else {
      engines.available.forEach((e) => {
        console.log(`  ✓ ${e.name} (${e.version || 'installed'}) ${e.isPortable ? '[local bin]' : '[system]'}`);
      });
      console.log(`Default engine: ${engines.selected ? engines.selected.name : 'None'}`);
    }
  } catch (e) {
    console.error('Engine detection check failed:', e.message);
  }
  console.log('----------------------------------------------------');
});

module.exports = { app, server };
