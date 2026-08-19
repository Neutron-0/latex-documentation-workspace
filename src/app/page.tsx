'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { FileTree } from '@/components/FileTree';
import { LatexMonacoEditor } from '@/components/LatexMonacoEditor';
import { PdfViewer } from '@/components/PdfViewer';
import { DiagnosticsPanel } from '@/components/DiagnosticsPanel';
import { FileItem, ProjectConfig, EngineInfo, DiagnosticIssue, BuildResult } from '@/lib/types';

export default function WorkspacePage() {
  const [project, setProject] = useState<ProjectConfig>({
    name: 'Technical Documentation',
    rootFile: 'main.tex',
    compiler: 'tectonic',
    autoBuild: false,
    synctex: true,
    buildDir: '.build',
  });

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>('main.tex');
  const [fileContent, setFileContent] = useState<string>('');
  const [savedContent, setSavedContent] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [engines, setEngines] = useState<EngineInfo[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<string>('tectonic');

  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [buildStatus, setBuildStatus] = useState<'ready' | 'running' | 'success' | 'failed'>('ready');
  const [buildDuration, setBuildDuration] = useState<number | null>(null);
  const [pdfTimestamp, setPdfTimestamp] = useState<number | null>(Date.now());
  const [hasPdf, setHasPdf] = useState<boolean>(false);

  const [errors, setErrors] = useState<DiagnosticIssue[]>([]);
  const [warnings, setWarnings] = useState<DiagnosticIssue[]>([]);
  const [rawOutput, setRawOutput] = useState<string>('');
  const [jumpToLine, setJumpToLine] = useState<number | null>(null);

  // Load project configuration
  const loadProject = async () => {
    try {
      const res = await fetch('/api/project');
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setSelectedEngine(data.project.compiler || 'tectonic');
      }
    } catch (e) {
      console.error('Failed to load project:', e);
    }
  };

  // Load files tree
  const loadFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.tree);
      }
    } catch (e) {
      console.error('Failed to load files:', e);
    }
  };

  // Load available engines
  const loadEngines = async () => {
    try {
      const res = await fetch('/api/compile/engines');
      const data = await res.json();
      if (data.success) {
        setEngines(data.available || []);
        if (data.selected) {
          setSelectedEngine(data.selected.id);
        }
      }
    } catch (e) {
      console.error('Failed to load engines:', e);
    }
  };

  // Load file content
  const loadFileContent = async (filePath: string) => {
    try {
      const res = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
        setSavedContent(data.content);
        setIsDirty(false);
        setActiveFile(filePath);
      }
    } catch (e) {
      console.error('Failed to read file:', e);
    }
  };

  // Save current file
  const saveFile = async () => {
    if (!activeFile) return;
    try {
      const res = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: activeFile, content: fileContent }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedContent(fileContent);
        setIsDirty(false);
        if (project.autoBuild) {
          compileProject();
        }
      }
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  // Trigger Compilation
  const compileProject = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setBuildStatus('running');

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootFile: project.rootFile || 'main.tex',
          engineId: selectedEngine,
        }),
      });
      const result: BuildResult = await res.json();

      setIsCompiling(false);
      setBuildDuration(result.duration || 0);
      setErrors(result.errors || []);
      setWarnings(result.warnings || []);
      setRawOutput(result.rawOutput || '');

      if (result.success) {
        setBuildStatus('success');
        setPdfTimestamp(Date.now());
        setHasPdf(true);
      } else {
        setBuildStatus('failed');
        if (result.pdfAvailable) {
          setHasPdf(true);
        }
      }
    } catch (e: any) {
      setIsCompiling(false);
      setBuildStatus('failed');
      setRawOutput((prev) => prev + '\n' + e.message);
    }
  };

  // Cancel Compilation
  const cancelCompilation = async () => {
    try {
      await fetch('/api/compile/cancel', { method: 'POST' });
      setIsCompiling(false);
      setBuildStatus('ready');
    } catch (e) {
      console.error('Failed to cancel build:', e);
    }
  };

  // Update Project Root
  const handleSetRootFile = async (rootPath: string) => {
    try {
      const updated = { ...project, rootFile: rootPath };
      await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setProject(updated);
    } catch (e) {
      console.error('Failed to set root file:', e);
    }
  };

  // Update Engine
  const handleEngineChange = async (engineId: string) => {
    setSelectedEngine(engineId);
    try {
      const updated = { ...project, compiler: engineId };
      await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setProject(updated);
    } catch (e) {
      console.error('Failed to update engine preference:', e);
    }
  };

  // Update Auto-Build
  const handleAutoBuildChange = async (autoBuild: boolean) => {
    try {
      const updated = { ...project, autoBuild };
      await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setProject(updated);
    } catch (e) {
      console.error('Failed to update auto-build setting:', e);
    }
  };

  // Create File / Directory
  const handleCreateFile = async (path: string, type: 'file' | 'directory') => {
    try {
      await fetch('/api/files/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, type }),
      });
      await loadFiles();
      if (type === 'file') {
        loadFileContent(path);
      }
    } catch (e) {
      console.error('Failed to create item:', e);
    }
  };

  // Rename File / Directory
  const handleRenameFile = async (oldPath: string, newPath: string) => {
    try {
      await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
      });
      await loadFiles();
      if (activeFile === oldPath) {
        setActiveFile(newPath);
      }
    } catch (e) {
      console.error('Failed to rename item:', e);
    }
  };

  // Delete File / Directory
  const handleDeleteFile = async (path: string) => {
    try {
      await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      await loadFiles();
      if (activeFile === path) {
        setActiveFile(null);
        setFileContent('');
      }
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  // Export PDF
  const handleExportPdf = () => {
    const rootBase = (project.rootFile || 'documentation').replace(/\.[^/.]+$/, '');
    const filename = `${rootBase}.pdf`;
    window.location.href = `/api/compile/pdf/download?filename=${encodeURIComponent(filename)}`;
  };

  // Jump to error line
  const handleJumpToIssue = (file: string, line?: number | null) => {
    if (activeFile !== file) {
      loadFileContent(file).then(() => {
        if (line) setJumpToLine(line);
      });
    } else if (line) {
      setJumpToLine(line);
    }
  };

  // Content change
  const handleEditorChange = (newContent: string) => {
    setFileContent(newContent);
    setIsDirty(newContent !== savedContent);
  };

  // Initial mount
  useEffect(() => {
    loadProject();
    loadFiles();
    loadEngines();
    loadFileContent('main.tex');

    // Check if initial PDF exists
    fetch('/api/compile/pdf', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setHasPdf(true);
          setBuildStatus('success');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-editor-bg text-editor-text overflow-hidden">
      {/* Top Application Header */}
      <Toolbar
        rootFile={project.rootFile}
        engines={engines}
        selectedEngine={selectedEngine}
        onEngineChange={handleEngineChange}
        isCompiling={isCompiling}
        onCompile={compileProject}
        onCancelCompile={cancelCompilation}
        autoBuild={project.autoBuild}
        onAutoBuildChange={handleAutoBuildChange}
        buildStatus={buildStatus}
        buildDuration={buildDuration}
        hasPdf={hasPdf}
        onExportPdf={handleExportPdf}
      />

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Explorer */}
        <FileTree
          files={files}
          activeFilePath={activeFile}
          rootFilePath={project.rootFile}
          onSelectFile={loadFileContent}
          onCreateFile={handleCreateFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onSetRootFile={handleSetRootFile}
          onRefresh={loadFiles}
        />

        {/* Center: Monaco LaTeX Editor */}
        <div className="flex-1 flex flex-col h-full border-r border-editor-border overflow-hidden">
          <LatexMonacoEditor
            filePath={activeFile}
            content={fileContent}
            isDirty={isDirty}
            diagnostics={[...errors, ...warnings]}
            onChange={handleEditorChange}
            onSave={saveFile}
            onCompile={compileProject}
            jumpToLine={jumpToLine}
          />
        </div>

        {/* Right: PDF Viewer */}
        <PdfViewer
          pdfUrl={hasPdf ? `/api/compile/pdf?t=${pdfTimestamp}` : null}
          isCompiling={isCompiling}
          onRefresh={() => setPdfTimestamp(Date.now())}
          onExport={handleExportPdf}
        />
      </div>

      {/* Bottom Diagnostics Drawer */}
      <DiagnosticsPanel
        errors={errors}
        warnings={warnings}
        rawOutput={rawOutput}
        onJumpToIssue={handleJumpToIssue}
        onClearLogs={() => setRawOutput('')}
      />
    </div>
  );
}
