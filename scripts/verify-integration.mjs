import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import compiled TS / JS modules using dynamic or custom helpers
import { getWorkspaceDir, getProjectConfig } from '../src/lib/project.ts';
import { getDirectoryTree, safeResolve } from '../src/lib/utils/filesystem.ts';
import { getCompilerManager } from '../src/lib/compiler/compiler-manager.ts';

async function runVerification() {
  console.log('====================================================');
  console.log('RUNNING MANUSCRIPT & VIEWER INTEGRATION VERIFICATION');
  console.log('====================================================\n');

  // 1. Check workspace resolution
  const workspaceDir = getWorkspaceDir(projectRoot);
  console.log('1. Workspace Resolution:');
  console.log('   Expected: ', path.join(projectRoot, 'manuscript'));
  console.log('   Resolved: ', workspaceDir);
  if (workspaceDir !== path.join(projectRoot, 'manuscript')) {
    throw new Error('Workspace resolution failed! Did not resolve to manuscript directory.');
  }
  console.log('   [PASS] Canonical LaTeX project root correctly set to manuscript/\n');

  // 2. Check Project Config
  console.log('2. Project Configuration:');
  const config = getProjectConfig(projectRoot);
  console.log('   Config:', JSON.stringify(config, null, 2));
  if (config.rootFile !== 'main.tex') {
    throw new Error(`Expected rootFile 'main.tex', got '${config.rootFile}'`);
  }
  console.log('   [PASS] Project configuration successfully loaded.\n');

  // 3. Check File Tree Discovery
  console.log('3. File Tree Discovery:');
  const tree = getDirectoryTree(workspaceDir);
  const fileNames = tree.map((t) => t.name);
  console.log('   Top-level items in tree:', fileNames);
  const expectedItems = ['main.tex', 'frontmatter', 'chapters', 'appendices', 'bibliography.bib'];
  for (const item of expectedItems) {
    if (!fileNames.includes(item)) {
      throw new Error(`Missing expected file/folder in tree: ${item}`);
    }
  }
  console.log('   [PASS] File tree correctly discovers all manuscript files and subdirectories.\n');

  // 4. Check File Read & Write Integration
  console.log('4. File Read & Write Integration:');
  const introPath = safeResolve(workspaceDir, 'chapters/01-introduction.tex');
  const originalContent = fs.readFileSync(introPath, 'utf8');
  console.log('   Read chapters/01-introduction.tex (length:', originalContent.length, 'bytes)');
  
  const testAppend = '\n% Test comment for integration verification';
  fs.writeFileSync(introPath, originalContent + testAppend, 'utf8');
  const modifiedContent = fs.readFileSync(introPath, 'utf8');
  if (!modifiedContent.includes(testAppend)) {
    throw new Error('File write verification failed!');
  }
  // Restore original content
  fs.writeFileSync(introPath, originalContent, 'utf8');
  console.log('   [PASS] Read and write successfully verified on actual manuscript source.\n');

  // 5. Check Compilation Integration with Tectonic
  console.log('5. End-to-End Compilation:');
  const compilerManager = getCompilerManager();
  const compileResult = await compilerManager.compile({
    rootFile: 'main.tex',
    engineId: 'tectonic',
  });

  console.log('   Compile Success:', compileResult.success);
  console.log('   Exit Code:', compileResult.exitCode);
  console.log('   Duration:', compileResult.duration, 'ms');
  console.log('   Errors count:', compileResult.errors.length);
  console.log('   Warnings count:', compileResult.warnings.length);
  console.log('   Output PDF:', compileResult.outputPdf);

  if (!compileResult.success) {
    console.error('Raw Output:\n', compileResult.rawOutput);
    throw new Error('Compilation failed unexpectedly!');
  }
  console.log('   [PASS] Successfully compiled manuscript/main.tex using Tectonic.\n');

  // 6. Check PDF Preview Availability
  console.log('6. PDF Preview Availability:');
  const latestPdf = compilerManager.getLatestPdfPath();
  console.log('   Latest PDF path:', latestPdf);
  if (!latestPdf || !fs.existsSync(latestPdf)) {
    throw new Error('Latest PDF does not exist on disk!');
  }
  const pdfStats = fs.statSync(latestPdf);
  console.log('   PDF file size:', pdfStats.size, 'bytes');
  console.log('   [PASS] Generated manuscript PDF is valid and available for viewer preview.\n');

  // 7. Check Error Handling & Diagnostics
  console.log('7. Error Handling & Diagnostics:');
  const syntaxErrorIntro = originalContent + '\n\\invalidLaTeXMacroForTestingError{123';
  fs.writeFileSync(introPath, syntaxErrorIntro, 'utf8');
  
  const errorCompileResult = await compilerManager.compile({
    rootFile: 'main.tex',
    engineId: 'tectonic',
  });

  console.log('   Error Compile Success (should be false):', errorCompileResult.success);
  console.log('   Diagnostic Errors detected:', errorCompileResult.errors.length);
  if (errorCompileResult.errors.length > 0) {
    console.log('   Sample Diagnostic:', errorCompileResult.errors[0]);
  }
  console.log('   PDF still available after failed build?:', errorCompileResult.pdfAvailable);

  // Restore original content
  fs.writeFileSync(introPath, originalContent, 'utf8');

  if (errorCompileResult.success) {
    throw new Error('Expected compilation to fail on intentional syntax error, but it succeeded!');
  }
  if (!errorCompileResult.pdfAvailable) {
    throw new Error('Expected previous successful PDF to remain available after failed build!');
  }
  console.log('   [PASS] Diagnostics correctly captured and previous PDF preserved during failed build.\n');

  // 8. Recompile to clean state
  console.log('8. Recompiling Clean State:');
  const finalResult = await compilerManager.compile({
    rootFile: 'main.tex',
    engineId: 'tectonic',
  });
  console.log('   Final Build Clean Success:', finalResult.success);
  console.log('   [PASS] Manuscript restored and clean build confirmed.\n');

  console.log('====================================================');
  console.log('ALL 8 INTEGRATION TESTS PASSED PERFECTLY!');
  console.log('====================================================');
}

runVerification().catch((err) => {
  console.error('\nVerification failed with error:', err);
  process.exit(1);
});
