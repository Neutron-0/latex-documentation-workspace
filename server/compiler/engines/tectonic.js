const fs = require('fs');
const path = require('path');
const { BaseCompilerEngine } = require('../compiler');
const { runProcess } = require('../../utils/process');

class TectonicEngine extends BaseCompilerEngine {
  constructor() {
    super(
      'tectonic',
      'Tectonic',
      'Modern, self-contained Rust-based TeX/LaTeX engine with automatic package management'
    );
  }

  getCapabilities() {
    return {
      multiPassAuto: true,
      synctex: true,
      autoPackageDownload: true,
      unicodeSupport: true,
    };
  }

  async detect(customPath = null) {
    const candidatePaths = [];

    if (customPath) candidatePaths.push(customPath);

    // Check project bin directory
    const projectRoot = path.resolve(__dirname, '../../../');
    const localBin = path.join(projectRoot, 'bin', process.platform === 'win32' ? 'tectonic.exe' : 'tectonic');
    candidatePaths.push(localBin);

    // System PATH
    candidatePaths.push('tectonic');

    for (const candidate of candidatePaths) {
      try {
        if (candidate.includes(path.sep) && !fs.existsSync(candidate)) {
          continue;
        }
        const result = await runProcess(candidate, ['--version']);
        if (result.exitCode === 0) {
          const versionLine = (result.stdout || result.stderr).split('\n')[0].trim();
          return {
            available: true,
            path: candidate,
            version: versionLine,
            isPortable: candidate === localBin,
          };
        }
      } catch (e) {
        // Continue checking other candidates
      }
    }

    return {
      available: false,
      path: null,
      version: null,
      isPortable: false,
    };
  }

  async compile(options) {
    const { workspaceDir, buildDir, rootFile, executablePath, control, onStdout, onStderr } = options;

    const rootFilePath = path.resolve(workspaceDir, rootFile);
    const rootBaseName = path.basename(rootFile, path.extname(rootFile));

    const args = [
      '--outdir',
      buildDir,
      '--synctex',
      '--keep-intermediates',
      '--print',
      rootFilePath,
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

module.exports = { TectonicEngine };
