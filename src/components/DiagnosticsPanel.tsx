'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import { DiagnosticIssue } from '@/lib/types';

interface DiagnosticsPanelProps {
  errors: DiagnosticIssue[];
  warnings: DiagnosticIssue[];
  rawOutput: string;
  onJumpToIssue: (file: string, line?: number | null) => void;
  onClearLogs: () => void;
}

export const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({
  errors,
  warnings,
  rawOutput,
  onJumpToIssue,
  onClearLogs,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'console'>('problems');
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalIssues = errors.length + warnings.length;

  return (
    <div
      className={`border-t border-editor-border bg-editor-panel/95 backdrop-blur flex flex-col transition-all z-10 select-none ${
        isOpen ? 'h-48' : 'h-8'
      }`}
    >
      {/* Panel Tab Header */}
      <div className="h-8 px-3 flex items-center justify-between border-b border-editor-border/60 bg-editor-surface/60">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('problems');
              setIsOpen(true);
            }}
            className={`flex items-center gap-1.5 py-1 transition-colors relative ${
              activeTab === 'problems' && isOpen
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-editor-muted hover:text-editor-text'
            }`}
          >
            <span>Problems</span>
            {errors.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-mono">
                {errors.length}
              </span>
            )}
            {warnings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">
                {warnings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('console');
              setIsOpen(true);
            }}
            className={`flex items-center gap-1.5 py-1 transition-colors relative ${
              activeTab === 'console' && isOpen
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-editor-muted hover:text-editor-text'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Compiler Output</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'console' && (
            <>
              <button
                onClick={handleCopyLogs}
                className="p-1 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
                title="Copy compiler output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClearLogs}
                className="p-1 hover:bg-editor-hover rounded text-editor-muted hover:text-rose-400 transition-colors"
                title="Clear logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
            title={isOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Panel Body */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
          {activeTab === 'problems' ? (
            <div>
              {totalIssues === 0 ? (
                <div className="text-editor-muted text-center py-6 text-xs">
                  No problems detected in the project
                </div>
              ) : (
                <div className="space-y-1">
                  {errors.map((err, idx) => (
                    <div
                      key={`err-${idx}`}
                      onClick={() => onJumpToIssue(err.file, err.line)}
                      className="group flex items-start gap-2 p-1.5 rounded hover:bg-rose-500/10 cursor-pointer text-rose-300 border border-transparent hover:border-rose-500/30 transition-all"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{err.file}</span>
                          {err.line && (
                            <span className="text-[11px] text-rose-400 bg-rose-500/20 px-1 rounded">
                              Line {err.line}
                            </span>
                          )}
                        </div>
                        <p className="text-editor-text text-xs mt-0.5">{err.message}</p>
                        {err.snippet && (
                          <div className="bg-editor-bg/80 p-1 rounded mt-1 text-[11px] text-editor-muted border border-editor-border">
                            {err.snippet}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {warnings.map((warn, idx) => (
                    <div
                      key={`warn-${idx}`}
                      onClick={() => onJumpToIssue(warn.file, warn.line)}
                      className="group flex items-start gap-2 p-1.5 rounded hover:bg-amber-500/10 cursor-pointer text-amber-300 border border-transparent hover:border-amber-500/30 transition-all"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{warn.file}</span>
                          {warn.line && (
                            <span className="text-[11px] text-amber-400 bg-amber-500/20 px-1 rounded">
                              Line {warn.line}
                            </span>
                          )}
                        </div>
                        <p className="text-editor-text text-xs mt-0.5">{warn.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <pre className="text-xs text-editor-muted font-mono whitespace-pre-wrap select-text leading-relaxed">
              {rawOutput || 'No output from the compiler yet. Run compile (Ctrl+B) to see execution logs.'}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
