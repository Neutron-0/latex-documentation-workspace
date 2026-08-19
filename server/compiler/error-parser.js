/**
 * Modular diagnostics and error parser for LaTeX engines.
 */
class LatexErrorParser {
  /**
   * Parses raw compiler output into structured diagnostics (errors, warnings, summary).
   * @param {string} rawOutput - Combined stdout/stderr or log file content.
   * @param {string} defaultFile - The root file name as fallback.
   * @returns {{ errors: Array, warnings: Array, fatalError: string | null }}
   */
  static parse(rawOutput = '', defaultFile = 'main.tex') {
    const lines = rawOutput.split(/\r?\n/);
    const errors = [];
    const warnings = [];
    let currentFile = defaultFile;
    let fatalError = null;

    // Regex patterns
    // 1. File-line-error format: "filename.tex:12: LaTeX Error: ..."
    const fileLineErrorRegex = /^(.+?\.(?:tex|sty|cls|bib)):(\d+):\s*(?:LaTeX Error:\s*)?(.*)$/i;

    // 2. TeX classic error marker: "! LaTeX Error: ..." or "! Undefined control sequence."
    const classicErrorRegex = /^!\s+(?:LaTeX Error:\s*)?(.*)$/i;

    // 3. Line locator in classic TeX log: "l.42 \badcommand"
    const lineLocatorRegex = /^l\.(\d+)\s*(.*)$/;

    // 4. LaTeX warning: "LaTeX Warning: Citation 'xyz' ... on input line 23."
    const warningRegex = /^(?:LaTeX Warning|Package \w+ Warning):\s*(.*)$/i;
    const warningLineRegex = /on input line (\d+)/i;

    // 5. Tectonic error: "error: <msg>" or "... at line 12 of <file>"
    const tectonicErrorRegex = /^error:\s*(.*)$/i;
    const tectonicLocRegex = /at (?:line )?(\d+)(?: of (.+?\.(?:tex|sty|cls)))?/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Track file enters like "(./chapters/01-intro.tex"
      const fileEnterMatch = line.match(/\(([\.\/\\a-zA-Z0-9_\-]+\.tex)\b/);
      if (fileEnterMatch) {
        currentFile = fileEnterMatch[1].replace(/^\.\//, '');
      }

      // Check file-line error format (most direct)
      const fleMatch = line.match(fileLineErrorRegex);
      if (fleMatch) {
        const file = fleMatch[1].trim();
        const lineNum = parseInt(fleMatch[2], 10);
        const message = fleMatch[3].trim() || 'LaTeX syntax error';
        errors.push({
          type: 'error',
          file,
          line: lineNum,
          message,
          raw: line,
        });
        continue;
      }

      // Check classic TeX error
      const classicMatch = line.match(classicErrorRegex);
      if (classicMatch) {
        const message = classicMatch[1].trim();
        let errorLine = null;
        let snippet = '';

        // Look ahead a few lines for "l.NN <snippet>"
        for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
          const aheadLine = lines[j];
          const lineMatch = aheadLine.match(lineLocatorRegex);
          if (lineMatch) {
            errorLine = parseInt(lineMatch[1], 10);
            snippet = lineMatch[2].trim();
            break;
          }
        }

        errors.push({
          type: 'error',
          file: currentFile,
          line: errorLine,
          message: message || 'LaTeX compilation error',
          snippet: snippet || undefined,
          raw: line,
        });
        continue;
      }

      // Check Tectonic specific error format
      const tectonicMatch = line.match(tectonicErrorRegex);
      if (tectonicMatch) {
        const message = tectonicMatch[1].trim();
        let errorLine = null;
        let file = currentFile;

        const locMatch = message.match(tectonicLocRegex);
        if (locMatch) {
          errorLine = parseInt(locMatch[1], 10);
          if (locMatch[2]) file = locMatch[2];
        }

        errors.push({
          type: 'error',
          file,
          line: errorLine,
          message,
          raw: line,
        });
        continue;
      }

      // Check LaTeX warnings
      const warnMatch = line.match(warningRegex);
      if (warnMatch) {
        const message = warnMatch[1].trim();
        let warnLine = null;
        const lineInWarn = message.match(warningLineRegex);
        if (lineInWarn) {
          warnLine = parseInt(lineInWarn[1], 10);
        }

        warnings.push({
          type: 'warning',
          file: currentFile,
          line: warnLine,
          message,
          raw: line,
        });
        continue;
      }

      // Fatal / abort markers
      if (line.includes('Fatal error occurred') || line.includes('Emergency stop')) {
        fatalError = line;
      }
    }

    // Deduplicate errors that have same file, line, and message
    const uniqueErrors = [];
    const seenErrors = new Set();
    for (const err of errors) {
      const key = `${err.file}:${err.line}:${err.message}`;
      if (!seenErrors.has(key)) {
        seenErrors.add(key);
        uniqueErrors.push(err);
      }
    }

    return {
      errors: uniqueErrors,
      warnings,
      fatalError,
    };
  }
}

module.exports = { LatexErrorParser };
