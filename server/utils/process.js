const { spawn } = require('child_process');

/**
 * Executes a command with timeout and cancellation support.
 * @param {string} command - Executable path or command name.
 * @param {string[]} args - Command arguments.
 * @param {object} options - Spawn options (cwd, env, etc.).
 * @param {object} control - Optional control object for cancellation { onCancel, signal }.
 * @returns {Promise<{ exitCode: number, stdout: string, stderr: string, killed: boolean }>}
 */
function runProcess(command, args = [], options = {}, control = {}) {
  return new Promise((resolve, reject) => {
    let stdoutData = '';
    let stderrData = '';
    let isKilled = false;

    const child = spawn(command, args, {
      ...options,
      shell: false,
      windowsHide: true,
    });

    if (control) {
      control.childProcess = child;
      control.cancel = () => {
        isKilled = true;
        try {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t']);
          } else {
            child.kill('SIGTERM');
          }
        } catch (e) {
          // Process might already be terminated
        }
      };
    }

    if (child.stdout) {
      child.stdout.on('data', (chunk) => {
        const str = chunk.toString();
        stdoutData += str;
        if (options.onStdout) options.onStdout(str);
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk) => {
        const str = chunk.toString();
        stderrData += str;
        if (options.onStderr) options.onStderr(str);
      });
    }

    child.on('error', (err) => {
      if (isKilled) {
        resolve({ exitCode: -1, stdout: stdoutData, stderr: stderrData, killed: true });
      } else {
        reject(err);
      }
    });

    child.on('close', (code) => {
      resolve({
        exitCode: code ?? 0,
        stdout: stdoutData,
        stderr: stderrData,
        killed: isKilled,
      });
    });
  });
}

module.exports = {
  runProcess,
};
