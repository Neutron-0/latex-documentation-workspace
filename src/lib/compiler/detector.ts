import { BaseCompilerEngine } from './compiler';
import { TectonicEngine } from './engines/tectonic';
import { PdfLatexEngine, XeLatexEngine, LuaLatexEngine } from './engines/pdflatex';
import { EngineInfo } from '../types';

export class EngineDetector {
  engines: BaseCompilerEngine[];

  constructor() {
    this.engines = [
      new TectonicEngine(),
      new PdfLatexEngine(),
      new XeLatexEngine(),
      new LuaLatexEngine(),
    ];
  }

  async detectAll(): Promise<EngineInfo[]> {
    const results: EngineInfo[] = [];

    for (const engine of this.engines) {
      const detection = await engine.detect();
      results.push({
        id: engine.id,
        name: engine.name,
        description: engine.description,
        available: detection.available,
        path: detection.path,
        version: detection.version,
        isPortable: detection.isPortable,
        capabilities: engine.getCapabilities(),
      });
    }

    return results;
  }

  async getPreferredEngine(requestedEngineId?: string | null): Promise<{
    selected: EngineInfo | null;
    available: EngineInfo[];
    message: string | null;
  }> {
    const detected = await this.detectAll();
    const available = detected.filter((e) => e.available);

    if (available.length === 0) {
      return {
        selected: null,
        available: [],
        message: 'No LaTeX compiler found. Run "npm run setup" to install portable Tectonic, or install TeX Live / MiKTeX.',
      };
    }

    if (requestedEngineId) {
      const matched = available.find((e) => e.id === requestedEngineId);
      if (matched) {
        return { selected: matched, available, message: null };
      }
    }

    const preferredOrder = ['tectonic', 'pdflatex', 'xelatex', 'lualatex'];
    for (const id of preferredOrder) {
      const found = available.find((e) => e.id === id);
      if (found) {
        return { selected: found, available, message: null };
      }
    }

    return { selected: available[0], available, message: null };
  }
}
