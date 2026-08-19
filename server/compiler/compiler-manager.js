const path = require('path');
const fs = require('fs');
const { EngineDetector } = require('./detector');
const { BuildManager } = require('./build-manager');
const { LatexErrorParser } = require('./error-parser');

class CompilerManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.buildDir = path.join(projectRoot, '.build');
    this.workspaceDir = path.join(projectRoot, 'workspace');

    this.detector = new EngineDetector();
    this.buildManager = new BuildManager(this.buildDir);

    this.activeCompilation = null; // Holds { buildId, control }
  }

  /**
   * Returns detected engines and recommendation.
   */
  async getEngines(preferredId = null) {
    return await this.detector.getPreferredEngine(preferredId);
  }

  /**
   * Cancels the active build if one is running.
   */
  cancelCurrentBuild() {
    if (this.activeCompilation && this.activeCompilation.control && this.activeCompilation.control.cancel) {
      console.log(`Cancelling active compilation [${this.activeCompilation.buildId}]`);
      this.activeCompilation.control.cancel();
      this.activeCompilation = null;
      return true;
    }
    return false;
  }

  /**
   * Compiles the LaTeX document.
   */
  async compile({ rootFile = 'main.tex', engineId = null }) {
    // 1. If existing build running, cancel it first
    this.cancelCurrentBuild();

    const buildId = `build-${Date.now()}`;
    const control = {};
    this.activeCompilation = { buildId, control };

    // 2. Select engine
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
        errors: [{ file: rootFile, line: 1, message: errorMsg }],
        warnings: [],
        rawOutput: errorMsg,
        pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
      };
    }

    const selectedEngineMeta = engineInfo.selected;
    const engineInstance = this.detector.engines.find((e) => e.id === selectedEngineMeta.id);

    // 3. Start build record
    this.buildManager.startBuild(buildId, selectedEngineMeta.id, rootFile);

    let rawOutput = '';
    const onStdout = (chunk) => { rawOutput += chunk; };
    const onStderr = (chunk) => { rawOutput += chunk; };

    console.log(`[Compile] Starting build ${buildId} with ${selectedEngineMeta.name} for ${rootFile}`);

    try {
      const compileResult = await engineInstance.compile({
        workspaceDir: this.workspaceDir,
        buildDir: this.buildDir,
        rootFile,
        executablePath: selectedEngineMeta.path,
        control,
        onStdout,
        onStderr,
      });

      if (compileResult.killed) {
        console.log(`[Compile] Build ${buildId} was cancelled.`);
        return {
          success: false,
          cancelled: true,
          buildId,
          exitCode: -1,
          engine: selectedEngineMeta.id,
          errors: [{ file: rootFile, line: 1, message: 'Build cancelled by user or replaced by newer build.' }],
          warnings: [],
          rawOutput: rawOutput + '\n[Build cancelled]',
          pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
        };
      }

      // Check if output PDF was created and exitCode is 0
      const isSuccess = compileResult.exitCode === 0 && !!compileResult.outputPdf && fs.existsSync(compileResult.outputPdf);

      // Parse diagnostics from compiler output
      const combinedOutput = (compileResult.stdout || '') + '\n' + (compileResult.stderr || '') + '\n' + rawOutput;
      const diagnostics = LatexErrorParser.parse(combinedOutput, rootFile);

      // Finalize build in manager
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
    } catch (err) {
      this.activeCompilation = null;
      console.error(`[Compile] Execution error:`, err);
      const diagnostics = LatexErrorParser.parse(err.message + '\n' + rawOutput, rootFile);
      this.buildManager.finishBuild({
        success: false,
        exitCode: -1,
        outputPdf: null,
        errors: diagnostics.errors.length > 0 ? diagnostics.errors : [{ file: rootFile, line: 1, message: err.message }],
        warnings: diagnostics.warnings,
        rawOutput: rawOutput + '\n' + err.stack,
      });

      return {
        success: false,
        buildId,
        exitCode: -1,
        engine: selectedEngineMeta.id,
        duration: 0,
        errors: diagnostics.errors.length > 0 ? diagnostics.errors : [{ file: rootFile, line: 1, message: err.message }],
        warnings: diagnostics.warnings,
        rawOutput: rawOutput + '\n' + err.stack,
        pdfAvailable: this.buildManager.getLatestPreviewPdf() !== null,
      };
    }
  }

  getLatestPdfPath() {
    return this.buildManager.getLatestPreviewPdf();
  }

  getLastBuildInfo() {
    return this.buildManager.getLastBuild();
  }
}

module.exports = { CompilerManager };
