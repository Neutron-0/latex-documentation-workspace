import fs from 'fs';
import path from 'path';
import { BaseCompilerEngine, CompileOptions, EngineCompileResult, EngineDetectResult } from '../compiler';
import { runProcess } from '../../utils/process';

export class PdfLatexEngine extends BaseCompilerEngine {
  constructor() {
    super(
      'pdflatex',
      'pdfLaTeX',
      'Standard TeX Live / MiKTeX engine for traditional 8-bit LaTeX documents'
    );
  }

  getCapabilities() {
    return {
      multiPassAuto: false,
      synctex: true,
      autoPackageDownload: false,
      unicodeSupport: false,
    };
  }

  async detect(customPath?: string | null): Promise<EngineDetectResult> {
    const candidatePaths: string[] = [];
    if (customPath) candidatePaths.push(customPath);
    candidatePaths.push('pdflatex');

    for (const candidate of candidatePaths) {
      try {
        const result = await runProcess(candidate, ['--version']);
        if (result.exitCode === 0) {
          const versionLine = (result.stdout || result.stderr).split('\n')[0].trim();
          return {
            available: true,
            path: candidate,
            version: versionLine,
            isPortable: false,
          };
        }
      } catch (e) {
        // Not found
      }
    }

    return {
      available: false,
      path: null,
      version: null,
      isPortable: false,
    };
  }

  async compile(options: CompileOptions): Promise<EngineCompileResult> {
    const { workspaceDir, buildDir, rootFile, executablePath, control, onStdout, onStderr } = options;

    const rootBaseName = path.basename(rootFile, path.extname(rootFile));
    const args = [
      '-interaction=nonstopmode',
      '-file-line-error',
      '-synctex=1',
      `-output-directory=${buildDir}`,
      rootFile,
    ];

    const result = await runProcess(
      executablePath,
      args,
      {
        cwd: workspaceDir,
        onStdout,
        onStderr,
      },
      control
    );

    const expectedPdf = path.join(buildDir, `${rootBaseName}.pdf`);
    const expectedSynctex = path.join(buildDir, `${rootBaseName}.synctex.gz`);

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      killed: result.killed,
      outputPdf: fs.existsSync(expectedPdf) ? expectedPdf : null,
      synctexFile: fs.existsSync(expectedSynctex) ? expectedSynctex : null,
    };
  }
}

export class XeLatexEngine extends BaseCompilerEngine {
  constructor() {
    super(
      'xelatex',
      'XeLaTeX',
      'Modern TeX engine with native UTF-8 and system font support'
    );
  }

  async detect(customPath?: string | null): Promise<EngineDetectResult> {
    const candidatePaths: string[] = [];
    if (customPath) candidatePaths.push(customPath);
    candidatePaths.push('xelatex');

    for (const candidate of candidatePaths) {
      try {
        const result = await runProcess(candidate, ['--version']);
        if (result.exitCode === 0) {
          const versionLine = (result.stdout || result.stderr).split('\n')[0].trim();
          return {
            available: true,
            path: candidate,
            version: versionLine,
            isPortable: false,
          };
        }
      } catch (e) {
        // Not found
      }
    }

    return {
      available: false,
      path: null,
      version: null,
      isPortable: false,
    };
  }

  async compile(options: CompileOptions): Promise<EngineCompileResult> {
    const { workspaceDir, buildDir, rootFile, executablePath, control, onStdout, onStderr } = options;

    const rootBaseName = path.basename(rootFile, path.extname(rootFile));
    const args = [
      '-interaction=nonstopmode',
      '-file-line-error',
      '-synctex=1',
      `-output-directory=${buildDir}`,
      rootFile,
    ];

    const result = await runProcess(
      executablePath,
      args,
      {
        cwd: workspaceDir,
        onStdout,
        onStderr,
      },
      control
    );

    const expectedPdf = path.join(buildDir, `${rootBaseName}.pdf`);
    const expectedSynctex = path.join(buildDir, `${rootBaseName}.synctex.gz`);

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      killed: result.killed,
      outputPdf: fs.existsSync(expectedPdf) ? expectedPdf : null,
      synctexFile: fs.existsSync(expectedSynctex) ? expectedSynctex : null,
    };
  }
}

export class LuaLatexEngine extends BaseCompilerEngine {
  constructor() {
    super(
      'lualatex',
      'LuaLaTeX',
      'Advanced TeX engine featuring embedded Lua scripting'
    );
  }

  async detect(customPath?: string | null): Promise<EngineDetectResult> {
    const candidatePaths: string[] = [];
    if (customPath) candidatePaths.push(customPath);
    candidatePaths.push('lualatex');

    for (const candidate of candidatePaths) {
      try {
        const result = await runProcess(candidate, ['--version']);
        if (result.exitCode === 0) {
          const versionLine = (result.stdout || result.stderr).split('\n')[0].trim();
          return {
            available: true,
            path: candidate,
            version: versionLine,
            isPortable: false,
          };
        }
      } catch (e) {
        // Not found
      }
    }

    return {
      available: false,
      path: null,
      version: null,
      isPortable: false,
    };
  }

  async compile(options: CompileOptions): Promise<EngineCompileResult> {
    const { workspaceDir, buildDir, rootFile, executablePath, control, onStdout, onStderr } = options;

    const rootBaseName = path.basename(rootFile, path.extname(rootFile));
    const args = [
      '--interaction=nonstopmode',
      '--file-line-error',
      '--synctex=1',
      `--output-directory=${buildDir}`,
      rootFile,
    ];

    const result = await runProcess(
      executablePath,
      args,
      {
        cwd: workspaceDir,
        onStdout,
        onStderr,
      },
      control
    );

    const expectedPdf = path.join(buildDir, `${rootBaseName}.pdf`);
    const expectedSynctex = path.join(buildDir, `${rootBaseName}.synctex.gz`);

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      killed: result.killed,
      outputPdf: fs.existsSync(expectedPdf) ? expectedPdf : null,
      synctexFile: fs.existsSync(expectedSynctex) ? expectedSynctex : null,
    };
  }
}
