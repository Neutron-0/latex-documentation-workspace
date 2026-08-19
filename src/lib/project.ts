import fs from 'fs';
import path from 'path';
import { ProjectConfig } from './types';

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  name: 'Wolverine SIH Technical Monograph',
  projectDir: 'manuscript',
  rootFile: 'main.tex',
  compiler: 'tectonic',
  autoBuild: false,
  synctex: true,
  buildDir: '.build',
};

/**
 * Discovers and returns the absolute path to the active LaTeX project/workspace directory.
 * Priority:
 * 1. Environment variable LATEX_WORKSPACE or LATEX_PROJECT_ROOT
 * 2. Root project.json containing projectDir
 * 3. manuscript/ directory if it exists and contains main.tex or files
 * 4. manuscript/project.json
 * 5. workspace/ directory fallback
 */
export function getWorkspaceDir(projectRoot: string = process.cwd()): string {
  if (process.env.LATEX_WORKSPACE) {
    return path.resolve(projectRoot, process.env.LATEX_WORKSPACE);
  }
  if (process.env.LATEX_PROJECT_ROOT) {
    return path.resolve(projectRoot, process.env.LATEX_PROJECT_ROOT);
  }

  // Check root project.json
  const rootConfigPath = path.join(projectRoot, 'project.json');
  if (fs.existsSync(rootConfigPath)) {
    try {
      const conf = JSON.parse(fs.readFileSync(rootConfigPath, 'utf8'));
      if (conf.projectDir) {
        const resolved = path.resolve(projectRoot, conf.projectDir);
        if (fs.existsSync(resolved)) return resolved;
      }
    } catch (e) {}
  }

  // Check manuscript directory (primary project location)
  const manuscriptDir = path.join(projectRoot, 'manuscript');
  if (fs.existsSync(manuscriptDir)) {
    if (fs.existsSync(path.join(manuscriptDir, 'main.tex')) || fs.existsSync(path.join(manuscriptDir, 'project.json'))) {
      return manuscriptDir;
    }
    const files = fs.readdirSync(manuscriptDir);
    if (files.length > 0) {
      return manuscriptDir;
    }
  }

  // Fallback to legacy workspace directory if manuscript doesn't exist
  const fallbackDir = path.join(projectRoot, 'workspace');
  if (fs.existsSync(fallbackDir)) {
    return fallbackDir;
  }

  return manuscriptDir;
}

/**
 * Returns the path to the project configuration file.
 */
export function getProjectConfigPath(projectRoot: string = process.cwd()): string {
  const wsDir = getWorkspaceDir(projectRoot);
  return path.join(wsDir, 'project.json');
}

/**
 * Reads the project configuration, merging with defaults.
 */
export function getProjectConfig(projectRoot: string = process.cwd()): ProjectConfig {
  const wsDir = getWorkspaceDir(projectRoot);
  const configPath = getProjectConfigPath(projectRoot);
  const relWs = path.relative(projectRoot, wsDir).replace(/\\/g, '/') || '.';

  let config: Partial<ProjectConfig> = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {}
  } else {
    // Check root project.json as fallback
    const rootConfigPath = path.join(projectRoot, 'project.json');
    if (fs.existsSync(rootConfigPath)) {
      try {
        config = JSON.parse(fs.readFileSync(rootConfigPath, 'utf8'));
      } catch (e) {}
    }
  }

  return {
    ...DEFAULT_PROJECT_CONFIG,
    projectDir: config.projectDir || relWs,
    ...config,
  };
}

/**
 * Saves the project configuration.
 */
export function saveProjectConfig(updated: Partial<ProjectConfig>, projectRoot: string = process.cwd()): ProjectConfig {
  const wsDir = getWorkspaceDir(projectRoot);
  const configPath = getProjectConfigPath(projectRoot);
  const current = getProjectConfig(projectRoot);
  const merged: ProjectConfig = {
    ...current,
    ...updated,
  };

  fs.writeFileSync(configPath, JSON.stringify(merged, null, 2), 'utf8');

  // Also maintain root project.json with projectDir pointer
  const rootConfigPath = path.join(projectRoot, 'project.json');
  try {
    fs.writeFileSync(rootConfigPath, JSON.stringify(merged, null, 2), 'utf8');
  } catch (e) {}

  return merged;
}
