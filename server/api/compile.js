const express = require('express');
const fs = require('fs');
const path = require('path');

function createCompileRouter(compilerManager) {
  const router = express.Router();

  // GET /api/compile/engines - Detect and list all engines
  router.get('/engines', async (req, res) => {
    try {
      const preferred = req.query.preferred || null;
      const engineInfo = await compilerManager.getEngines(preferred);
      res.json({ success: true, ...engineInfo });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/compile - Trigger compilation
  router.post('/', async (req, res) => {
    try {
      const { rootFile = 'main.tex', engineId = null } = req.body;
      const result = await compilerManager.compile({ rootFile, engineId });
      res.json({ success: result.success, ...result });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/compile/cancel - Cancel active compilation
  router.post('/cancel', (req, res) => {
    try {
      const cancelled = compilerManager.cancelCurrentBuild();
      res.json({ success: true, cancelled });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/compile/status - Check last build status
  router.get('/status', (req, res) => {
    try {
      const lastBuild = compilerManager.getLastBuildInfo();
      res.json({ success: true, lastBuild });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/compile/pdf - Inline PDF preview
  router.get('/pdf', (req, res) => {
    try {
      const pdfPath = compilerManager.getLatestPdfPath();
      if (!pdfPath || !fs.existsSync(pdfPath)) {
        return res.status(404).send('No compiled PDF is available yet.');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/compile/pdf/download - Download PDF attachment
  router.get('/pdf/download', (req, res) => {
    try {
      const pdfPath = compilerManager.getLatestPdfPath();
      if (!pdfPath || !fs.existsSync(pdfPath)) {
        return res.status(404).send('No compiled PDF is available yet.');
      }

      const filename = req.query.filename || 'documentation.pdf';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

module.exports = { createCompileRouter };
