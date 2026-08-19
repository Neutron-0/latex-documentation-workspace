const path = require('path');
const fs = require('fs');
const assert = require('assert');

console.log('=============================================');
console.log(' Running LaTeX Workspace Tests (Next.js/TS)  ');
console.log('=============================================');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

(async () => {
  console.log('\n[1] Next.js & TypeScript Project Structure');
  test('TypeScript and Tailwind configuration files exist', () => {
    assert(fs.existsSync(path.resolve(__dirname, '../tsconfig.json')), 'tsconfig.json missing');
    assert(fs.existsSync(path.resolve(__dirname, '../tailwind.config.ts')), 'tailwind.config.ts missing');
    assert(fs.existsSync(path.resolve(__dirname, '../next.config.mjs')), 'next.config.mjs missing');
  });

  test('Workspace documents and chapters exist', () => {
    assert(fs.existsSync(path.resolve(__dirname, '../workspace/main.tex')), 'workspace/main.tex missing');
    assert(fs.existsSync(path.resolve(__dirname, '../workspace/chapters/01-introduction.tex')), 'workspace/chapters/01-introduction.tex missing');
    assert(fs.existsSync(path.resolve(__dirname, '../workspace/references.bib')), 'workspace/references.bib missing');
  });

  console.log('\n[2] Tectonic Compilation Pipeline');
  await asyncTest('Tectonic compiles multi-file sample project into .build', async () => {
    const { spawnSync } = require('child_process');
    const binPath = path.resolve(__dirname, '../bin/tectonic.exe');
    const exists = fs.existsSync(binPath);
    assert(exists, 'tectonic binary exists in bin/');

    const run = spawnSync(binPath, [
      '--outdir',
      '.build',
      '--synctex',
      '--keep-intermediates',
      'workspace/main.tex',
    ], { encoding: 'utf8', cwd: path.resolve(__dirname, '../') });

    assert.strictEqual(run.status, 0, `Tectonic exited with code ${run.status}`);
    assert(fs.existsSync(path.resolve(__dirname, '../.build/main.pdf')), '.build/main.pdf generated');
  });

  console.log('\n=============================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
})();
