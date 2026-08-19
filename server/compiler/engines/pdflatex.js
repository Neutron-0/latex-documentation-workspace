const fs = require('fs');
const path = require('path');
const { BaseCompilerEngine } = require('../compiler');
const { runProcess } = require('../../utils/process');

class PdfLatexEngine extends BaseCompilerEngine {
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

  async detect(customPath = null) {
    const candidatePaths = [];
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

  async compile(options) {
    const { workspaceDir, buildDir, rootFile, executablePath, control, onStdout, onStderr } = options;

    const rootBaseName = path.basename(rootFile, path.extname(rootFile));
    const args = [
      '-interaction=nonstopmode',
      '-file-line-error',
      '-synctex=1',
      `-output-directory=${buildDir}`,
      rootFile,
    ];

    // First pass
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

    if (result.killed || result.exitCode !== 0) {
      const expectedPdf = path.join(buildDir, `${rootBaseName}.pdf`);
      return {
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
        killed: result.killed,
        outputPdf: fs.existsSync(expectedPdf) ? expectedPdf : null,
        synctexFile: null,
      };
    }

    // Check if bibtex is needed
    const auxFile = path.join(buildDir, `${rootBaseName}.aux`);
    if (fs.existsSync(auxFile)) {
      const auxContent = fs.readFileSync(auxFile, 'utf8');
      if (auxContent.includes('\\bibdata') || auxContent.includes('\\citation')) {
        try {
          await runProcess('bibtex', [rootBaseName], { cwd: buildDir }, control);
          // Re-run pdflatex twice for citations and cross-references
          await runProcess(executablePath, args, { cwd: workspaceDir, onStdout, onStderr }, control);
          await runProcess(executablePath, args, { cwd: workspaceDir, onStdout, onStderr }, control);
        } catch (e) {
          // Bibtex not available or failed; continue with first pass result
        }
      }
    }

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

module.exports = { PdfLatexEngine };
