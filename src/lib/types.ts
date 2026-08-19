export interface ProjectConfig {
  name: string;
  projectDir?: string;
  rootFile: string;
  compiler: string;
  autoBuild: boolean;
  synctex: boolean;
  buildDir: string;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  modifiedAt?: Date | string;
  children?: FileItem[];
}

export interface DiagnosticIssue {
  type: 'error' | 'warning';
  file: string;
  line?: number | null;
  message: string;
  snippet?: string;
  raw?: string;
}

export interface EngineInfo {
  id: string;
  name: string;
  description: string;
  available: boolean;
  path: string | null;
  version: string | null;
  isPortable?: boolean;
  capabilities?: {
    multiPassAuto: boolean;
    synctex: boolean;
    autoPackageDownload: boolean;
    unicodeSupport: boolean;
  };
}

export interface BuildResult {
  success: boolean;
  cancelled?: boolean;
  buildId: string;
  exitCode: number;
  engine: string;
  duration: number;
  errors: DiagnosticIssue[];
  warnings: DiagnosticIssue[];
  rawOutput: string;
  outputPdf?: string | null;
  pdfAvailable?: boolean;
}
