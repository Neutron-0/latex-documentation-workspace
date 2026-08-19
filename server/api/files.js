const express = require('express');
const fs = require('fs');
const path = require('path');
const { safeResolve, getDirectoryTree, ensureDir } = require('../utils/filesystem');

function createFilesRouter(workspaceDir) {
  const router = express.Router();

  // GET /api/files - Get file tree
  router.get('/', (req, res) => {
    try {
      const tree = getDirectoryTree(workspaceDir);
      res.json({ success: true, tree });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/files/read?path=chapters/01-introduction.tex
  router.get('/read', (req, res) => {
    try {
      const relPath = req.query.path;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Path query param is required' });
      }

      const filePath = safeResolve(workspaceDir, relPath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'File not found' });
      }

      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        return res.status(400).json({ success: false, error: 'Path is a directory' });
      }

      const content = fs.readFileSync(filePath, 'utf8');
      res.json({ success: true, path: relPath, content });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/files/write - Save file
  router.post('/write', (req, res) => {
    try {
      const { path: relPath, content } = req.body;
      if (!relPath || typeof content !== 'string') {
        return res.status(400).json({ success: false, error: 'Path and content string are required' });
      }

      const filePath = safeResolve(workspaceDir, relPath);
      ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, content, 'utf8');

      res.json({ success: true, path: relPath, message: 'Saved successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/files/create - Create file or directory
  router.post('/create', (req, res) => {
    try {
      const { path: relPath, type = 'file' } = req.body;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      const targetPath = safeResolve(workspaceDir, relPath);
      if (fs.existsSync(targetPath)) {
        return res.status(400).json({ success: false, error: 'File or directory already exists' });
      }

      if (type === 'dir' || type === 'directory') {
        ensureDir(targetPath);
      } else {
        ensureDir(path.dirname(targetPath));
        fs.writeFileSync(targetPath, '', 'utf8');
      }

      res.json({ success: true, path: relPath, message: 'Created successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/files/rename - Rename file or directory
  router.post('/rename', (req, res) => {
    try {
      const { oldPath: oldRelPath, newPath: newRelPath } = req.body;
      if (!oldRelPath || !newRelPath) {
        return res.status(400).json({ success: false, error: 'oldPath and newPath are required' });
      }

      const source = safeResolve(workspaceDir, oldRelPath);
      const target = safeResolve(workspaceDir, newRelPath);

      if (!fs.existsSync(source)) {
        return res.status(404).json({ success: false, error: 'Source item does not exist' });
      }

      if (fs.existsSync(target)) {
        return res.status(400).json({ success: false, error: 'Target path already exists' });
      }

      ensureDir(path.dirname(target));
      fs.renameSync(source, target);

      res.json({ success: true, oldPath: oldRelPath, newPath: newRelPath });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/files/delete - Delete file or directory
  router.post('/delete', (req, res) => {
    try {
      const { path: relPath } = req.body;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      const target = safeResolve(workspaceDir, relPath);
      if (!fs.existsSync(target)) {
        return res.status(404).json({ success: false, error: 'Target does not exist' });
      }

      const stat = fs.statSync(target);
      if (stat.isDirectory()) {
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        fs.unlinkSync(target);
      }

      res.json({ success: true, path: relPath, message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

module.exports = { createFilesRouter };
