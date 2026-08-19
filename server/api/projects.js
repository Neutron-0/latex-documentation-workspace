const express = require('express');
const fs = require('fs');
const path = require('path');

const DEFAULT_PROJECT_CONFIG = {
  name: 'LaTeX Documentation Workspace',
  rootFile: 'main.tex',
  compiler: 'tectonic',
  autoBuild: false,
  synctex: true,
  buildDir: '.build',
};

function createProjectsRouter(workspaceDir) {
  const router = express.Router();
  const configPath = path.join(workspaceDir, 'project.json');

  // GET /api/project - Get project configuration
  router.get('/', (req, res) => {
    try {
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(raw);
        return res.json({ success: true, project: { ...DEFAULT_PROJECT_CONFIG, ...config } });
      }

      // If project.json doesn't exist, create it with default
      fs.writeFileSync(configPath, JSON.stringify(DEFAULT_PROJECT_CONFIG, null, 2), 'utf8');
      res.json({ success: true, project: DEFAULT_PROJECT_CONFIG });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/project - Update project configuration
  router.post('/', (req, res) => {
    try {
      let current = DEFAULT_PROJECT_CONFIG;
      if (fs.existsSync(configPath)) {
        try {
          current = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {}
      }

      const updated = {
        ...current,
        ...req.body,
      };

      fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf8');
      res.json({ success: true, project: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

module.exports = { createProjectsRouter, DEFAULT_PROJECT_CONFIG };
