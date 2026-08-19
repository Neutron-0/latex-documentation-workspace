const fs = require('fs');
const path = require('path');

/**
 * Validates and resolves a relative path safely inside a root directory.
 * Prevents directory traversal attacks.
 */
function safeResolve(rootDir, relativePath = '') {
  const normalizedRoot = path.resolve(rootDir);
  const resolved = path.resolve(normalizedRoot, relativePath);
  
  if (resolved !== normalizedRoot && !resolved.startsWith(normalizedRoot + path.sep)) {
    throw new Error('Access denied: Path is outside workspace.');
  }
  return resolved;
}

/**
 * Recursively scans directory and returns tree structure.
 */
function getDirectoryTree(dirPath, relativeTo = dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const items = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.build') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(relativeTo, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      items.push({
        name: entry.name,
        path: relPath,
        type: 'directory',
        children: getDirectoryTree(fullPath, relativeTo),
      });
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const stats = fs.statSync(fullPath);
      items.push({
        name: entry.name,
        path: relPath,
        type: 'file',
        extension: ext,
        size: stats.size,
        modifiedAt: stats.mtime,
      });
    }
  }

  // Sort directories first, then files alphabetically
  return items.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

/**
 * Ensures directory exists.
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = {
  safeResolve,
  getDirectoryTree,
  ensureDir,
};
