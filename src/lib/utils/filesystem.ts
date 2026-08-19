import fs from 'fs';
import path from 'path';
import { FileItem } from '../types';

export function safeResolve(rootDir: string, relativePath: string = ''): string {
  const normalizedRoot = path.resolve(rootDir);
  const resolved = path.resolve(normalizedRoot, relativePath);

  if (resolved !== normalizedRoot && !resolved.startsWith(normalizedRoot + path.sep)) {
    throw new Error('Access denied: Path is outside workspace.');
  }
  return resolved;
}

export function getDirectoryTree(dirPath: string, relativeTo: string = dirPath): FileItem[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const items: FileItem[] = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.build' || entry.name === '.next') {
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

  return items.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
