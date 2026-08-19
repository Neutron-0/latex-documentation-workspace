const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const BIN_DIR = path.join(PROJECT_ROOT, 'bin');

if (!fs.existsSync(BIN_DIR)) {
  fs.mkdirSync(BIN_DIR, { recursive: true });
}

const TECTONIC_VERSION = '0.17.0';
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

let assetName = '';
let targetBinaryName = isWindows ? 'tectonic.exe' : 'tectonic';

if (isWindows) {
  assetName = `tectonic-${TECTONIC_VERSION}-x86_64-pc-windows-msvc.zip`;
} else if (isMac) {
  assetName = `tectonic-${TECTONIC_VERSION}-x86_64-apple-darwin.tar.gz`;
} else if (isLinux) {
  assetName = `tectonic-${TECTONIC_VERSION}-x86_64-unknown-linux-musl.tar.gz`;
} else {
  console.error(`Unsupported platform for auto-download: ${process.platform}`);
  process.exit(1);
}

const downloadUrl = `https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${TECTONIC_VERSION}/${assetName}`;
const targetArchive = path.join(BIN_DIR, assetName);
const targetBinary = path.join(BIN_DIR, targetBinaryName);

console.log('========================================================');
console.log(` Installing Portable Tectonic (${TECTONIC_VERSION})`);
console.log(` Target binary: ${targetBinary}`);
console.log('========================================================');

if (fs.existsSync(targetBinary)) {
  console.log(`Tectonic binary already exists at ${targetBinary}. Checking version...`);
  const check = spawnSync(targetBinary, ['--version'], { encoding: 'utf8' });
  if (check.status === 0) {
    console.log(`✓ Detected existing binary: ${check.stdout.trim()}`);
    process.exit(0);
  }
}

console.log(`Downloading ${downloadUrl}...`);

function downloadFile(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      return downloadFile(response.headers.location, dest, callback);
    }
    if (response.statusCode !== 200) {
      return callback(new Error(`Failed to download: HTTP ${response.statusCode}`));
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    callback(err);
  });
}

downloadFile(downloadUrl, targetArchive, (err) => {
  if (err) {
    console.error(`Download failed: ${err.message}`);
    process.exit(1);
  }

  console.log('Extracting binary...');
  try {
    if (isWindows) {
      const psCommand = `Expand-Archive -Path '${targetArchive}' -DestinationPath '${BIN_DIR}' -Force`;
      spawnSync('powershell', ['-Command', psCommand], { stdio: 'inherit' });
    } else {
      spawnSync('tar', ['-xzf', targetArchive, '-C', BIN_DIR], { stdio: 'inherit' });
      fs.chmodSync(targetBinary, 0o755);
    }

    if (fs.existsSync(targetArchive)) {
      fs.unlinkSync(targetArchive);
    }

    if (!fs.existsSync(targetBinary)) {
      console.error(`Extraction completed but ${targetBinary} was not found.`);
      process.exit(1);
    }

    const testRun = spawnSync(targetBinary, ['--version'], { encoding: 'utf8' });
    if (testRun.status === 0) {
      console.log(`✓ Successfully installed: ${testRun.stdout.trim()}`);
      console.log('========================================================');
    } else {
      console.error(`Tectonic binary verification failed.`);
      process.exit(1);
    }
  } catch (extractErr) {
    console.error(`Extraction failed: ${extractErr.message}`);
    process.exit(1);
  }
});
