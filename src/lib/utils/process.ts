import { spawn, ChildProcess } from 'child_process';

export interface ProcessControl {
  childProcess?: ChildProcess;
  cancel?: () => void;
}

export interface ProcessOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
}

export interface ProcessResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  killed: boolean;
}

export function runProcess(
  command: string,
  args: string[] = [],
  options: ProcessOptions = {},
  control?: ProcessControl
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    let stdoutData = '';
    let stderrData = '';
    let isKilled = false;

    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env || process.env,
      shell: false,
      windowsHide: true,
    });

    if (control) {
      control.childProcess = child;
      control.cancel = () => {
        isKilled = true;
        try {
          if (process.platform === 'win32' && child.pid) {
            spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t']);
          } else {
            child.kill('SIGTERM');
          }
        } catch (e) {
          // Ignore if already dead
        }
      };
    }

    if (child.stdout) {
      child.stdout.on('data', (chunk: Buffer) => {
        const str = chunk.toString();
        stdoutData += str;
        if (options.onStdout) options.onStdout(str);
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk: Buffer) => {
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
