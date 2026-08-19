import path from 'path';
import fs from 'fs';
import { EngineDetector } from './detector';
import { BuildManager } from './build-manager';
import { LatexErrorParser } from './error-parser';
import { BuildResult, EngineInfo } from '../types';
import { ProcessControl } from '../utils/process';
import { getWorkspaceDir, getProjectConfig } from '../project';

export class CompilerManager {
  projectRoot: string;
  buildDir: string;
  workspaceDir: string;
  detector: EngineDetector;
  buildManager: BuildManager;
  activeCompilation: { buildId: string; control: ProcessControl } | null = null;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.buildDir = path.join(projectRoot, '.build');
    this.workspaceDir = getWorkspaceDir(projectRoot);

    this.detector = new EngineDetector();
    this.buildManager = new BuildManager(this.buildDir, () => this.workspaceDir);
  }

  async getEngines(preferredId?: string | null): Promise<{
    selected: EngineInfo | null;
    available: EngineInfo[];
    message: string | null;
  }> {
    return await this.detector.getPreferredEngine(preferredId);
  }

  cancelCurrentBuild(): boolean {
    if (this.activeCompilation && this.activeCompilation.control && this.activeCompilation.control.cancel) {
      this.activeCompilation.control.cancel();
      this.activeCompilation = null;
      return true;
    }
    return false;
  }

  async compile(options: { rootFile?: string; engineId?: string | null }): Promise<BuildResult> {
    const projectConfig = getProjectConfig(this.projectRoot);
    const rootFile = options.rootFile || projectConfig.rootFile || 'main.tex';
    const engineId = options.engineId || projectConfig.compiler || null;

    // Refresh active workspace directory
    this.workspaceDir = getWorkspaceDir(this.projectRoot);

    this.cancelCurrentBuild();

    const buildId = `build-${Date.now()}`;
    const control: ProcessControl = {};
    this.activeCompilation = { buildId, control };

    const engineInfo = await this.detector.getPreferredEngine(engineId);
    if (!engineInfo.selected || !engineInfo.selected.available) {
      this.activeCompilation = null;
      const errorMsg = engineInfo.message || `Selected engine '${engineId}' is not installed or available.`;
      return {
        success: false,
        buildId,
        exitCode: -1,
        engine: engineId || 'none',
        duration: 0,
        errors: [{ type: 'error', file: rootFile, line: 1, message: errorMsg }],
        warnings: [],
        rawOutput: errorMsg,
        pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
      };
    }

    const selectedEngineMeta = engineInfo.selected;
    const engineInstance = this.detector.engines.find((e) => e.id === selectedEngineMeta.id);

    if (!engineInstance) {
      throw new Error(`Engine adapter ${selectedEngineMeta.id} not found.`);
    }

    this.buildManager.startBuild(buildId, selectedEngineMeta.id, rootFile);

    let rawOutput = '';
    const onStdout = (chunk: string) => { rawOutput += chunk; };
    const onStderr = (chunk: string) => { rawOutput += chunk; };

    try {
      const compileResult = await engineInstance.compile({
        workspaceDir: this.workspaceDir,
        buildDir: this.buildDir,
        rootFile,
        executablePath: selectedEngineMeta.path || 'tectonic',
        control,
        onStdout,
        onStderr,
      });

      if (compileResult.killed) {
        return {
          success: false,
          cancelled: true,
          buildId,
          exitCode: -1,
          engine: selectedEngineMeta.id,
          duration: 0,
          errors: [{ type: 'error', file: rootFile, line: 1, message: 'Build cancelled by user or replaced by newer build.' }],
          warnings: [],
          rawOutput: rawOutput + '\n[Build cancelled]',
          pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
        };
      }

      const isSuccess = compileResult.exitCode === 0 && !!compileResult.outputPdf && fs.existsSync(compileResult.outputPdf);
      const combinedOutput = (compileResult.stdout || '') + '\n' + (compileResult.stderr || '') + '\n' + rawOutput;
      const diagnostics = LatexErrorParser.parse(combinedOutput, rootFile);

      const finalized = this.buildManager.finishBuild({
        success: isSuccess,
        exitCode: compileResult.exitCode,
        outputPdf: compileResult.outputPdf,
        synctexFile: compileResult.synctexFile,
        errors: diagnostics.errors,
        warnings: diagnostics.warnings,
        rawOutput: combinedOutput,
      });

      this.activeCompilation = null;

      return {
        success: isSuccess,
        buildId,
        exitCode: compileResult.exitCode,
        engine: selectedEngineMeta.id,
        duration: finalized.duration,
        errors: diagnostics.errors,
        warnings: diagnostics.warnings,
        rawOutput: combinedOutput,
        outputPdf: compileResult.outputPdf,
        pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
      };
    } catch (err: any) {
      this.activeCompilation = null;
      const diagnostics = LatexErrorParser.parse((err.message || '') + '\n' + rawOutput, rootFile);
      this.buildManager.finishBuild({
        success: false,
        exitCode: -1,
        outputPdf: null,
        errors: diagnostics.errors.length > 0 ? diagnostics.errors : [{ type: 'error', file: rootFile, line: 1, message: err.message }],
        warnings: diagnostics.warnings,
        rawOutput: rawOutput + '\n' + (err.stack || ''),
      });

      return {
        success: false,
        buildId,
        exitCode: -1,
        engine: selectedEngineMeta.id,
        duration: 0,
        errors: diagnostics.errors.length > 0 ? diagnostics.errors : [{ type: 'error', file: rootFile, line: 1, message: err.message }],
        warnings: diagnostics.warnings,
        rawOutput: rawOutput + '\n' + (err.stack || ''),
        pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
      };
    }
  }

  getLatestPdfPath(): string | null {
    return this.buildManager.getLatestPreviewPdf();
  }

  getLastBuildInfo(): BuildResult | null {
    return this.buildManager.getLastBuild();
  }
}

// Global singleton instance for Next.js API routes
declare global {
  var __compilerManagerInstance: CompilerManager | undefined;
}

export function getCompilerManager(): CompilerManager {
  if (!global.__compilerManagerInstance) {
    global.__compilerManagerInstance = new CompilerManager(process.cwd());
  }
  return global.__compilerManagerInstance;
}
