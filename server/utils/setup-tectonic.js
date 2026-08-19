const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const BIN_DIR = path.join(PROJECT_ROOT, 'bin');
const TECTONIC_VERSION = '0.17.0';

// Mapping platform and arch to tectonic release assets
function getReleaseAsset() {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32') {
    return {
      fileName: `tectonic-${TECTONIC_VERSION}-x86_64-pc-windows-msvc.zip`,
      executable: 'tectonic.exe',
      isZip: true,
    };
  } else if (platform === 'darwin') {
    const targetArch = arch === 'arm64' ? 'aarch64' : 'x86_64';
    return {
      fileName: `tectonic-${TECTONIC_VERSION}-${targetArch}-apple-darwin.tar.gz`,
      executable: 'tectonic',
      isZip: false,
    };
  } else if (platform === 'linux') {
    const targetArch = arch === 'arm64' ? 'aarch64' : 'x86_64';
    return {
      fileName: `tectonic-${TECTONIC_VERSION}-${targetArch}-unknown-linux-musl.tar.gz`,
      executable: 'tectonic',
      isZip: false,
    };
  }
  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

async function downloadFile(url, destPath) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Pro-Doc-Setup-Agent' },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  console.log(`Downloaded ${buffer.length} bytes to ${destPath}`);
}

async function setup() {
  console.log('=== LaTeX Workspace Setup: Portable Tectonic Engine ===');

  if (!fs.existsSync(BIN_DIR)) {
    fs.mkdirSync(BIN_DIR, { recursive: true });
  }

  const asset = getReleaseAsset();
  const targetExecutablePath = path.join(BIN_DIR, asset.executable);

  if (fs.existsSync(targetExecutablePath)) {
    console.log(`Tectonic already present at: ${targetExecutablePath}`);
    try {
      const check = spawnSync(targetExecutablePath, ['--version'], { encoding: 'utf8' });
      console.log(`Verified: ${check.stdout.trim()}`);
      return;
    } catch (e) {
      console.log('Reinstalling binary...');
    }
  }

  const downloadUrl = `https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${TECTONIC_VERSION}/${asset.fileName}`;
  const tempArchive = path.join(BIN_DIR, asset.fileName);

  try {
    await downloadFile(downloadUrl, tempArchive);

    console.log('Extracting binary...');
    if (asset.isZip) {
      // Windows PowerShell extraction
      execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${tempArchive}' -DestinationPath '${BIN_DIR}' -Force"`, {
        stdio: 'inherit',
      });
    } else {
      // Unix tar extraction
      execSync(`tar -xzf "${tempArchive}" -C "${BIN_DIR}"`, {
        stdio: 'inherit',
      });
    }

    if (fs.existsSync(tempArchive)) {
      fs.unlinkSync(tempArchive);
    }

    if (process.platform !== 'win32') {
      fs.chmodSync(targetExecutablePath, 0o755);
    }

    console.log(`Tectonic successfully installed at ${targetExecutablePath}`);

    const verify = spawnSync(targetExecutablePath, ['--version'], { encoding: 'utf8' });
    console.log(`Verification: ${verify.stdout ? verify.stdout.trim() : verify.stderr.trim()}`);
    console.log('Setup complete! Tectonic engine is ready for use.');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setup();
}

module.exports = { setup };
