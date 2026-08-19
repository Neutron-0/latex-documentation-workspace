const { TectonicEngine } = require('./engines/tectonic');
const { PdfLatexEngine } = require('./engines/pdflatex');
const { XeLatexEngine } = require('./engines/xelatex');
const { LuaLatexEngine } = require('./engines/lualatex');

class EngineDetector {
  constructor() {
    this.engines = [
      new TectonicEngine(),
      new PdfLatexEngine(),
      new XeLatexEngine(),
      new LuaLatexEngine(),
    ];
  }

  /**
   * Detects all installed engines and their status.
   * @returns {Promise<Array<{ id: string, name: string, description: string, available: boolean, path: string | null, version: string | null, isPortable: boolean, capabilities: object }>>}
   */
  async detectAll() {
    const results = [];

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

  /**
   * Gets the best available engine. Tectonic is preferred as default when available.
   */
  async getPreferredEngine(requestedEngineId = null) {
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

    // Default preference: tectonic first, then pdflatex, xelatex, lualatex
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

module.exports = { EngineDetector };
