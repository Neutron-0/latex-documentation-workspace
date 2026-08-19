'use client';

import React from 'react';
import {
  Play,
  Square,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';
import { EngineInfo } from '@/lib/types';

interface ToolbarProps {
  rootFile: string;
  engines: EngineInfo[];
  selectedEngine: string;
  onEngineChange: (engineId: string) => void;
  isCompiling: boolean;
  onCompile: () => void;
  onCancelCompile: () => void;
  autoBuild: boolean;
  onAutoBuildChange: (autoBuild: boolean) => void;
  buildStatus: 'ready' | 'running' | 'success' | 'failed';
  buildDuration: number | null;
  hasPdf: boolean;
  onExportPdf: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  rootFile,
  engines,
  selectedEngine,
  onEngineChange,
  isCompiling,
  onCompile,
  onCancelCompile,
  autoBuild,
  onAutoBuildChange,
  buildStatus,
  buildDuration,
  hasPdf,
  onExportPdf,
}) => {
  return (
    <header className="h-14 bg-editor-panel/95 backdrop-blur border-b border-editor-border flex items-center justify-between px-4 select-none z-20">
      {/* Brand & Document Root Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-editor-text uppercase flex items-center gap-1.5">
              <span>TeX</span>
              <span className="text-editor-cyan font-normal">Workspace</span>
            </div>
            <div className="text-[10px] text-editor-muted font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>v2.0 Next.js</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-editor-surface/80 border border-editor-border/80 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-editor-cyan" />
          <span className="text-editor-muted">Root:</span>
          <span className="text-editor-text font-semibold text-editor-cyan">{rootFile}</span>
        </div>
      </div>

      {/* Compiler Action & Controls */}
      <div className="flex items-center gap-3">
        {/* Engine Dropdown */}
        <div className="flex items-center gap-2 bg-editor-surface border border-editor-border px-2.5 py-1 rounded-lg">
          <Zap className="w-3.5 h-3.5 text-editor-amber" />
          <span className="text-xs text-editor-muted hidden sm:inline font-medium">Engine:</span>
          <select
            value={selectedEngine}
            onChange={(e) => onEngineChange(e.target.value)}
            disabled={isCompiling}
            className="bg-transparent text-xs text-editor-text focus:outline-none cursor-pointer font-mono"
          >
            {engines.map((eng) => (
              <option key={eng.id} value={eng.id} className="bg-editor-panel text-editor-text">
                {eng.name} {eng.isPortable ? '(Portable)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Compile / Cancel Button */}
        {isCompiling ? (
          <button
            onClick={onCancelCompile}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Cancel current build"
          >
            <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>Cancel</span>
          </button>
        ) : (
          <button
            onClick={onCompile}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all border border-indigo-400/30"
            title="Compile LaTeX project (Ctrl+B)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Compile</span>
            <kbd className="hidden lg:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
              Ctrl+B
            </kbd>
          </button>
        )}

        {/* Auto Build Toggle */}
        <label
          className="hidden sm:flex items-center gap-2 text-xs text-editor-muted hover:text-editor-text cursor-pointer transition-colors"
          title="Auto-build when saving (Ctrl+S)"
        >
          <input
            type="checkbox"
            checked={autoBuild}
            onChange={(e) => onAutoBuildChange(e.target.checked)}
            className="rounded border-editor-border bg-editor-surface text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-[11px] font-medium">Auto-build</span>
        </label>
      </div>

      {/* Status Badge & PDF Export */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            buildStatus === 'running'
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse'
              : buildStatus === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : buildStatus === 'failed'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-editor-surface text-editor-muted border-editor-border'
          }`}
        >
          {buildStatus === 'running' && <Clock className="w-3.5 h-3.5 animate-spin" />}
          {buildStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {buildStatus === 'failed' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
          {buildStatus === 'ready' && <span className="w-2 h-2 rounded-full bg-editor-muted" />}

          <span className="font-mono text-[11px]">
            {buildStatus === 'running' && 'Compiling...'}
            {buildStatus === 'success' && `Ready (${buildDuration}ms)`}
            {buildStatus === 'failed' && 'Build Error'}
            {buildStatus === 'ready' && 'Ready'}
          </span>
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          disabled={!hasPdf}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            hasPdf
              ? 'bg-editor-surface hover:bg-editor-hover text-editor-text border-editor-border hover:border-editor-muted/40 shadow-sm active:scale-95'
              : 'opacity-40 cursor-not-allowed bg-editor-surface text-editor-muted border-editor-border'
          }`}
          title="Download generated PDF"
        >
          <Download className="w-3.5 h-3.5 text-editor-cyan" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  );
};
