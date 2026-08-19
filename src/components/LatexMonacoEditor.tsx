'use client';

import React, { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { FileCode2, Save, Sparkles } from 'lucide-react';
import { DiagnosticIssue } from '@/lib/types';

interface LatexMonacoEditorProps {
  filePath: string | null;
  content: string;
  isDirty: boolean;
  diagnostics: DiagnosticIssue[];
  onChange: (value: string) => void;
  onSave: () => void;
  onCompile: () => void;
  jumpToLine: number | null;
}

export const LatexMonacoEditor: React.FC<LatexMonacoEditorProps> = ({
  filePath,
  content,
  isDirty,
  diagnostics,
  onChange,
  onSave,
  onCompile,
  jumpToLine,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom dark theme
    monaco.editor.defineTheme('obsidian-tex', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'tag', foreground: '38bdf8' },
        { token: 'delimiter', foreground: '94a3b8' },
      ],
      colors: {
        'editor.background': '#0d0e15',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#18192680',
        'editorCursor.foreground': '#818cf8',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#818cf8',
        'editor.selectionBackground': '#4338ca50',
        'editor.inactiveSelectionBackground': '#312e8130',
      },
    });

    monaco.editor.setTheme('obsidian-tex');

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      onCompile();
    });
  };

  // Jump to line when triggered from diagnostics panel
  useEffect(() => {
    if (jumpToLine && editorRef.current) {
      editorRef.current.revealLineInCenter(jumpToLine);
      editorRef.current.setPosition({ lineNumber: jumpToLine, column: 1 });
      editorRef.current.focus();
    }
  }, [jumpToLine]);

  // Set line markers for errors and warnings
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !filePath) return;

    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();
    if (!model) return;

    const relevantDiagnostics = diagnostics.filter(
      (d) => !d.file || d.file === filePath || filePath.endsWith(d.file)
    );

    const markers = relevantDiagnostics
      .filter((d) => d.line && d.line > 0)
      .map((d) => ({
        startLineNumber: d.line!,
        startColumn: 1,
        endLineNumber: d.line!,
        endColumn: 100,
        message: d.message,
        severity:
          d.type === 'error'
            ? monaco.MarkerSeverity.Error
            : monaco.MarkerSeverity.Warning,
      }));

    monaco.editor.setModelMarkers(model, 'latex', markers);
  }, [diagnostics, filePath]);

  const getLanguage = (path: string | null) => {
    if (!path) return 'latex';
    if (path.endsWith('.tex') || path.endsWith('.sty') || path.endsWith('.cls')) return 'latex';
    if (path.endsWith('.bib')) return 'plaintext';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  if (!filePath) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-editor-bg text-editor-muted select-none">
        <FileCode2 className="w-12 h-12 text-editor-border mb-3" />
        <p className="text-sm font-medium">Select a file from the explorer to begin editing</p>
        <p className="text-xs text-slate-600 mt-1 font-mono">Press Ctrl+B to compile at any time</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-editor-bg overflow-hidden">
      {/* Active File Tab Bar */}
      <div className="h-10 bg-editor-panel/60 border-b border-editor-border flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-editor-bg rounded-t-md border-t-2 border-indigo-500 text-xs font-mono text-white">
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{filePath}</span>
            {isDirty && (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-medium transition-colors shadow-sm"
              title="Save (Ctrl+S)"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <Editor
          height="100%"
          language={getLanguage(filePath)}
          value={content}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="obsidian-tex"
          options={{
            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
            fontSize: 13,
            lineHeight: 20,
            minimap: { enabled: true, scale: 0.75 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
