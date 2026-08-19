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
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3080;

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
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

function startServer(port, maxAttempts = 5) {
  const server = app.listen(port, async () => {
    console.log('====================================================');
    console.log(` LaTeX Documentation Workspace`);
    console.log(` Running locally at: http://localhost:${port}`);
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

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1, maxAttempts - 1);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
}

const server = startServer(DEFAULT_PORT);

module.exports = { app, server };
