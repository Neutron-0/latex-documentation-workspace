import fs from 'fs';
import path from 'path';
import { ensureDir } from '../utils/filesystem';
import { BuildResult } from '../types';

export class BuildManager {
  buildDir: string;
  latestSuccessfulBuild: (BuildResult & { previewPdfPath: string }) | null = null;
  lastBuild: BuildResult | null = null;
  activeBuild: { id: string; engineId: string; rootFile: string; startTime: number; status: string } | null = null;

  constructor(buildDir: string) {
    this.buildDir = buildDir;
    ensureDir(this.buildDir);
  }

  getBuildDir(): string {
    return this.buildDir;
  }

  startBuild(buildId: string, engineId: string, rootFile: string) {
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

  finishBuild(buildResult: Omit<BuildResult, 'duration' | 'buildId' | 'engine'> & { outputPdf: string | null; synctexFile?: string | null }): BuildResult {
    const duration = Date.now() - (this.activeBuild ? this.activeBuild.startTime : Date.now());
    const completeRecord: BuildResult = {
      buildId: this.activeBuild ? this.activeBuild.id : `build-${Date.now()}`,
      engine: this.activeBuild ? this.activeBuild.engineId : 'unknown',
      duration,
      ...buildResult,
    };

    this.lastBuild = completeRecord;
    this.activeBuild = null;

    if (buildResult.success && buildResult.outputPdf && fs.existsSync(buildResult.outputPdf)) {
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

  getLatestPreviewPdf(): string | null {
    if (this.latestSuccessfulBuild && fs.existsSync(this.latestSuccessfulBuild.previewPdfPath)) {
      return this.latestSuccessfulBuild.previewPdfPath;
    }
    const defaultPreview = path.join(this.buildDir, 'latest-preview.pdf');
    if (fs.existsSync(defaultPreview)) {
      return defaultPreview;
    }
    return null;
  }

  getLastBuild(): BuildResult | null {
    return this.lastBuild;
  }
}
