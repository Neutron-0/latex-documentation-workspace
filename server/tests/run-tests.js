const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { LatexErrorParser } = require('../compiler/error-parser');
const { EngineDetector } = require('../compiler/detector');
const { BuildManager } = require('../compiler/build-manager');
const { CompilerManager } = require('../compiler/compiler-manager');
const { getDirectoryTree, safeResolve } = require('../utils/filesystem');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const WORKSPACE_DIR = path.join(PROJECT_ROOT, 'workspace');
const BUILD_DIR = path.join(PROJECT_ROOT, '.build');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (e) {
    console.error(`  ✕ ${name}: ${e.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (e) {
    console.error(`  ✕ ${name}: ${e.message}`);
    failedTests++;
  }
}

async function runAll() {
  console.log('=============================================');
  console.log(' Running LaTeX Documentation Workspace Tests');
  console.log('=============================================\n');

  console.log('[1] Filesystem & Workspace Structure');
  test('Safe path resolution prevents path traversal', () => {
    const resolved = safeResolve(WORKSPACE_DIR, 'chapters/01-introduction.tex');
    assert.ok(resolved.startsWith(WORKSPACE_DIR));

    assert.throws(() => {
      safeResolve(WORKSPACE_DIR, '../../outside.txt');
    });
  });

  test('Directory tree scans workspace correctly', () => {
    const tree = getDirectoryTree(WORKSPACE_DIR);
    assert.ok(Array.isArray(tree));
    const mainFile = tree.find((t) => t.name === 'main.tex');
    assert.ok(mainFile, 'main.tex should be found in workspace tree');
  });

  console.log('\n[2] LaTeX Error Parser');
  test('Parses file-line error format correctly', () => {
    const sampleLog = `
./chapters/01-intro.tex:14: LaTeX Error: Undefined control sequence.
Some extra text
`;
    const diagnostics = LatexErrorParser.parse(sampleLog);
    assert.strictEqual(diagnostics.errors.length, 1);
    assert.strictEqual(diagnostics.errors[0].line, 14);
    assert.strictEqual(diagnostics.errors[0].file, './chapters/01-intro.tex');
  });

  test('Parses classic TeX errors and line locator', () => {
    const sampleLog = `
(./chapters/01-intro.tex
! Undefined control sequence.
l.42 \\invalidcommand
`;
    const diagnostics = LatexErrorParser.parse(sampleLog);
    assert.strictEqual(diagnostics.errors.length, 1);
    assert.strictEqual(diagnostics.errors[0].line, 42);
    assert.strictEqual(diagnostics.errors[0].file, 'chapters/01-intro.tex');
  });

  test('Parses LaTeX warnings and line numbers', () => {
    const sampleLog = `
LaTeX Warning: Citation 'knuth1984' on page 1 undefined on input line 28.
`;
    const diagnostics = LatexErrorParser.parse(sampleLog);
    assert.strictEqual(diagnostics.warnings.length, 1);
    assert.strictEqual(diagnostics.warnings[0].line, 28);
  });

  console.log('\n[3] Build Manager & Build Isolation');
  test('Build manager isolates artifacts into .build directory', () => {
    const manager = new BuildManager(BUILD_DIR);
    assert.strictEqual(manager.getBuildDir(), BUILD_DIR);

    manager.startBuild('test-1', 'tectonic', 'main.tex');
    const record = manager.finishBuild({
      success: true,
      exitCode: 0,
      outputPdf: path.join(BUILD_DIR, 'main.pdf'),
    });

    assert.strictEqual(record.status, 'success');
    assert.strictEqual(record.engineId, 'tectonic');
  });

  console.log('\n[4] Compiler Detector & Compilation Execution');
  const detector = new EngineDetector();
  const engines = await detector.detectAll();
  const availableEngine = engines.find((e) => e.available);

  await runAsyncTest('Detects available compiler engine', async () => {
    assert.ok(availableEngine, 'At least one compiler engine (Tectonic/pdfLaTeX) must be available');
    console.log(`     Using engine: ${availableEngine.name} (${availableEngine.version})`);
  });

  if (availableEngine) {
    const compilerManager = new CompilerManager(PROJECT_ROOT);

    await runAsyncTest('Compiles multi-file sample project successfully', async () => {
      const result = await compilerManager.compile({ rootFile: 'main.tex', engineId: availableEngine.id });
      assert.strictEqual(result.success, true, `Compilation failed: ${JSON.stringify(result.errors)}`);
      assert.ok(result.outputPdf, 'Output PDF path must be returned');
      assert.ok(fs.existsSync(result.outputPdf), 'Generated PDF file must exist');
      assert.ok(fs.existsSync(path.join(BUILD_DIR, 'latest-preview.pdf')), 'Latest preview PDF must be cached');
    });

    await runAsyncTest('Handles compilation errors and surfaces diagnostics on broken TeX', async () => {
      // Create temporary broken tex file
      const brokenFile = path.join(WORKSPACE_DIR, 'broken-test.tex');
      fs.writeFileSync(brokenFile, `\\documentclass{article}\n\\begin{document}\n\\invalidMacroCommandError\n\\end{document}`, 'utf8');

      const result = await compilerManager.compile({ rootFile: 'broken-test.tex', engineId: availableEngine.id });
      assert.strictEqual(result.success, false, 'Broken document compilation must report failure');
      assert.ok(result.errors.length > 0, 'Diagnostic errors must be extracted');
      assert.strictEqual(result.pdfAvailable, true, 'Previous successful PDF preview should remain available');

      // Cleanup
      if (fs.existsSync(brokenFile)) fs.unlinkSync(brokenFile);
    });
  }

  console.log('\n=============================================');
  console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
  console.log('=============================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAll();
