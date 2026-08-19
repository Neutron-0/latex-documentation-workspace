import { DiagnosticIssue } from '../types';

export class LatexErrorParser {
  static parse(rawOutput: string = '', defaultFile: string = 'main.tex'): { errors: DiagnosticIssue[]; warnings: DiagnosticIssue[]; fatalError: string | null } {
    const lines = rawOutput.split(/\r?\n/);
    const errors: DiagnosticIssue[] = [];
    const warnings: DiagnosticIssue[] = [];
    let currentFile = defaultFile;
    let fatalError: string | null = null;

    const fileLineErrorRegex = /^(.+?\.(?:tex|sty|cls|bib)):(\d+):\s*(?:LaTeX Error:\s*)?(.*)$/i;
    const classicErrorRegex = /^!\s+(?:LaTeX Error:\s*)?(.*)$/i;
    const lineLocatorRegex = /^l\.(\d+)\s*(.*)$/;
    const warningRegex = /^(?:LaTeX Warning|Package \w+ Warning):\s*(.*)$/i;
    const warningLineRegex = /on input line (\d+)/i;
    const tectonicPrefixErrorRegex = /^(?:error|warning):\s*(.+?\.(?:tex|sty|cls|bib)):(\d+):\s*(.*)$/i;
    const tectonicGenericErrorRegex = /^error:\s*(.*)$/i;
    const tectonicLocRegex = /at (?:line )?(\d+)(?: of (.+?\.(?:tex|sty|cls)))?/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const fileEnterMatch = line.match(/\(([\.\/\\a-zA-Z0-9_\-]+\.tex)\b/);
      if (fileEnterMatch) {
        currentFile = fileEnterMatch[1].replace(/^\.\//, '');
      }

      // Check Tectonic file:line syntax first: "error: chapters/01-introduction.tex:23: message"
      const tecLineMatch = line.match(tectonicPrefixErrorRegex);
      if (tecLineMatch) {
        const isWarn = line.toLowerCase().startsWith('warning:');
        const file = tecLineMatch[1].trim();
        const lineNum = parseInt(tecLineMatch[2], 10);
        const message = tecLineMatch[3].trim() || (isWarn ? 'Warning' : 'LaTeX syntax error');

        if (isWarn) {
          warnings.push({
            type: 'warning',
            file,
            line: lineNum,
            message,
            raw: line,
          });
        } else {
          errors.push({
            type: 'error',
            file,
            line: lineNum,
            message,
            raw: line,
          });
        }
        continue;
      }

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

      const classicMatch = line.match(classicErrorRegex);
      if (classicMatch) {
        const message = classicMatch[1].trim();
        let errorLine: number | null = null;
        let snippet = '';

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

      const tectonicMatch = line.match(tectonicGenericErrorRegex);
      if (tectonicMatch) {
        const message = tectonicMatch[1].trim();
        let errorLine: number | null = null;
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

      const warnMatch = line.match(warningRegex);
      if (warnMatch) {
        const message = warnMatch[1].trim();
        let warnLine: number | null = null;
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

      if (line.includes('Fatal error occurred') || line.includes('Emergency stop')) {
        fatalError = line;
      }
    }

    const uniqueErrors: DiagnosticIssue[] = [];
    const seenErrors = new Set<string>();
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
