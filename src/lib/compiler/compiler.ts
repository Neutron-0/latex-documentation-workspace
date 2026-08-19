import { ProcessControl } from '../utils/process';

export interface CompileOptions {
  workspaceDir: string;
  buildDir: string;
  rootFile: string;
  executablePath: string;
  control?: ProcessControl;
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
}

export interface EngineCompileResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  outputPdf: string | null;
  synctexFile: string | null;
  killed: boolean;
}

export interface EngineDetectResult {
  available: boolean;
  path: string | null;
  version: string | null;
  isPortable?: boolean;
}

export abstract class BaseCompilerEngine {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  abstract detect(customPath?: string | null): Promise<EngineDetectResult>;
  abstract compile(options: CompileOptions): Promise<EngineCompileResult>;

  getCapabilities() {
    return {
      multiPassAuto: false,
      synctex: true,
      autoPackageDownload: false,
      unicodeSupport: true,
    };
  }
}
