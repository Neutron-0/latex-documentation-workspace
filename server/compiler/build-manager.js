const fs = require('fs');
const path = require('path');
const { ensureDir } = require('../utils/filesystem');

class BuildManager {
  constructor(buildDir) {
    this.buildDir = buildDir;
    this.latestSuccessfulBuild = null;
    this.lastBuild = null;
    this.activeBuild = null;

    ensureDir(this.buildDir);
  }

  getBuildDir() {
    return this.buildDir;
  }

  /**
   * Records starting a build.
   */
  startBuild(buildId, engineId, rootFile) {
    const buildInfo = {
      id: buildId,
      engineId,
      rootFile,
      startTime: Date.now(),
      status: 'running',
    };
    this.activeBuild = buildInfo;
    return buildInfo;
  }

  /**
   * Finalizes a build record.
   */
  finishBuild(buildResult) {
    const duration = Date.now() - (this.activeBuild ? this.activeBuild.startTime : Date.now());
    const completeRecord = {
      ...this.activeBuild,
      ...buildResult,
      duration,
      endTime: Date.now(),
      status: buildResult.success ? 'success' : 'failed',
    };

    this.lastBuild = completeRecord;
    this.activeBuild = null;

    if (buildResult.success && buildResult.outputPdf && fs.existsSync(buildResult.outputPdf)) {
      // Store reference to latest successful output PDF
      const persistentPdf = path.join(this.buildDir, 'latest-preview.pdf');
      try {
        fs.copyFileSync(buildResult.outputPdf, persistentPdf);
        this.latestSuccessfulBuild = {
          ...completeRecord,
          previewPdfPath: persistentPdf,
        };
      } catch (e) {
        this.latestSuccessfulBuild = {
          ...completeRecord,
          previewPdfPath: buildResult.outputPdf,
        };
      }
    }

    return completeRecord;
  }

  /**
   * Gets the latest successful PDF file path for preview/export.
   */
  getLatestPreviewPdf() {
    if (this.latestSuccessfulBuild && fs.existsSync(this.latestSuccessfulBuild.previewPdfPath)) {
      return this.latestSuccessfulBuild.previewPdfPath;
    }
    const defaultPreview = path.join(this.buildDir, 'latest-preview.pdf');
    if (fs.existsSync(defaultPreview)) {
      return defaultPreview;
    }
    return null;
  }

  getLastBuild() {
    return this.lastBuild;
  }

  getLatestSuccessfulBuild() {
    return this.latestSuccessfulBuild;
  }
}

module.exports = { BuildManager };
