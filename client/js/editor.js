/**
 * CodeMirror Editor Wrapper with LaTeX support and shortcuts.
 */
class LatexEditor {
  constructor(textareaId, onSaveCallback, onCompileCallback) {
    this.textarea = document.getElementById(textareaId);
    this.onSave = onSaveCallback;
    this.onCompile = onCompileCallback;
    this.activeFilePath = null;
    this.isModified = false;

    this.unsavedIndicator = document.getElementById('unsaved-indicator');
    this.activeFileLabel = document.getElementById('active-file-path');

    this.initCodeMirror();
  }

  initCodeMirror() {
    if (typeof CodeMirror !== 'undefined') {
      this.cm = CodeMirror.fromTextArea(this.textarea, {
        mode: 'stex',
        theme: 'nord',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        indentUnit: 2,
        tabSize: 2,
        extraKeys: {
          'Ctrl-S': () => { if (this.onSave) this.onSave(); },
          'Cmd-S': () => { if (this.onSave) this.onSave(); },
          'Ctrl-B': () => { if (this.onCompile) this.onCompile(); },
          'Cmd-B': () => { if (this.onCompile) this.onCompile(); },
        },
      });

      this.cm.on('change', () => {
        if (!this.isModified) {
          this.isModified = true;
          this.updateModifiedIndicator();
        }
      });
    } else {
      // Fallback if CodeMirror CDN is unreachable
      this.cm = null;
      this.textarea.addEventListener('input', () => {
        this.isModified = true;
        this.updateModifiedIndicator();
      });
    }
  }

  openFile(filePath, content) {
    this.activeFilePath = filePath;
    this.activeFileLabel.textContent = filePath;

    if (this.cm) {
      // Set appropriate mode based on extension
      if (filePath.endsWith('.bib')) {
        this.cm.setOption('mode', 'stex');
      } else if (filePath.endsWith('.json')) {
        this.cm.setOption('mode', 'javascript');
      } else {
        this.cm.setOption('mode', 'stex');
      }

      this.cm.setValue(content || '');
      this.cm.clearHistory();
    } else {
      this.textarea.value = content || '';
    }

    this.isModified = false;
    this.updateModifiedIndicator();
  }

  getValue() {
    return this.cm ? this.cm.getValue() : this.textarea.value;
  }

  getActiveFile() {
    return this.activeFilePath;
  }

  markSaved() {
    this.isModified = false;
    this.updateModifiedIndicator();
  }

  updateModifiedIndicator() {
    if (this.unsavedIndicator) {
      if (this.isModified) {
        this.unsavedIndicator.classList.remove('hidden');
      } else {
        this.unsavedIndicator.classList.add('hidden');
      }
    }
  }

  gotoLine(line, column = 1) {
    if (!this.cm || !line) return;
    const lineIndex = Math.max(0, parseInt(line, 10) - 1);
    this.cm.setCursor({ line: lineIndex, ch: column });
    this.cm.focus();

    // Scroll line to center of editor
    const t = this.cm.charCoords({ line: lineIndex, ch: 0 }, 'local').top;
    const middleHeight = this.cm.getScrollerElement().offsetHeight / 2;
    this.cm.scrollTo(null, t - middleHeight - 5);

    // Briefly highlight the line
    const handle = this.cm.addLineClass(lineIndex, 'background', 'line-highlight');
    setTimeout(() => {
      this.cm.removeLineClass(handle, 'background', 'line-highlight');
    }, 2000);
  }
}

window.LatexEditor = LatexEditor;
