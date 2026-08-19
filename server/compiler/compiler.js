/**
 * Base abstract class for LaTeX compiler engines.
 */
class BaseCompilerEngine {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  /**
   * Checks if this engine executable is available on the system.
   * @param {string} customPath - Optional path to executable.
   * @returns {Promise<{ available: boolean, path: string | null, version: string | null }>}
   */
  async detect(customPath = null) {
    throw new Error('detect() must be implemented by engine subclass');
  }

  /**
   * Compiles the LaTeX document.
   * @param {object} options
   * @param {string} options.workspaceDir - Root directory of LaTeX source files.
   * @param {string} options.buildDir - Isolated build directory (.build).
   * @param {string} options.rootFile - Entry .tex file (relative to workspaceDir).
   * @param {string} options.executablePath - Path to compiler binary.
   * @param {object} options.control - Cancellation controller.
   * @param {function} options.onStdout - Stdout callback.
   * @param {function} options.onStderr - Stderr callback.
   * @returns {Promise<{ exitCode: number, stdout: string, stderr: string, outputPdf: string | null, synctexFile: string | null, killed: boolean }>}
   */
  async compile(options) {
    throw new Error('compile() must be implemented by engine subclass');
  }

  /**
   * Returns capabilities supported by this engine.
   */
  getCapabilities() {
    return {
      multiPassAuto: false,
      synctex: true,
      autoPackageDownload: false,
      unicodeSupport: true,
    };
  }
}

module.exports = { BaseCompilerEngine };
