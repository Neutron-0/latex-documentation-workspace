'use client';

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode2,
  FileSpreadsheet,
  Image as ImageIcon,
  Plus,
  FolderPlus,
  Trash2,
  Edit2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Star,
  Layers,
} from 'lucide-react';
import { FileItem } from '@/lib/types';

interface FileTreeProps {
  files: FileItem[];
  activeFilePath: string | null;
  rootFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string, type: 'file' | 'directory') => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onDeleteFile: (path: string) => void;
  onSetRootFile: (path: string) => void;
  onRefresh: () => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFilePath,
  rootFilePath,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onSetRootFile,
  onRefresh,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    chapters: true,
    figures: true,
  });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState<{ open: boolean; type: 'file' | 'directory'; parentDir: string }>({
    open: false,
    type: 'file',
    parentDir: '',
  });
  const [newEntryName, setNewEntryName] = useState('');
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderPath]: !prev[folderPath] }));
  };

  const getFileIcon = (fileName: string, ext?: string) => {
    if (ext === '.tex') return <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />;
    if (ext === '.bib') return <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />;
    if (['.png', '.jpg', '.jpeg', '.svg', '.pdf'].includes(ext || ''))
      return <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />;
    if (fileName === 'project.json') return <Layers className="w-4 h-4 text-purple-400 shrink-0" />;
    return <FileText className="w-4 h-4 text-editor-muted shrink-0" />;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryName.trim()) return;

    const fullPath = showNewModal.parentDir
      ? `${showNewModal.parentDir}/${newEntryName.trim()}`
      : newEntryName.trim();

    onCreateFile(fullPath, showNewModal.type);
    setShowNewModal({ open: false, type: 'file', parentDir: '' });
    setNewEntryName('');
  };

  const handleRenameSubmit = (oldPath: string) => {
    if (!renameValue.trim() || renameValue === oldPath) {
      setRenamingPath(null);
      return;
    }

    const parts = oldPath.split('/');
    parts[parts.length - 1] = renameValue.trim();
    const newPath = parts.join('/');

    onRenameFile(oldPath, newPath);
    setRenamingPath(null);
    setRenameValue('');
  };

  const renderTree = (items: FileItem[], level = 0) => {
    return items.map((item) => {
      const isExpanded = !!expandedFolders[item.path];
      const isActive = activeFilePath === item.path;
      const isRoot = rootFilePath === item.path;
      const isMenuOpen = activeMenu === item.path;

      if (item.type === 'directory') {
        return (
          <div key={item.path} className="select-none">
            <div
              className={`group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-editor-surface cursor-pointer text-xs transition-colors ${
                level > 0 ? 'ml-3' : ''
              }`}
              onClick={() => toggleFolder(item.path)}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-editor-muted shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-editor-muted shrink-0" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="truncate text-editor-text font-medium">{item.name}</span>
              </div>

              {/* Folder quick actions */}
              <div
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowNewModal({ open: true, type: 'file', parentDir: item.path })}
                  className="p-1 hover:bg-editor-hover rounded text-editor-muted hover:text-cyan-400"
                  title="New File inside"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete folder '${item.name}' and all contents?`)) {
                      onDeleteFile(item.path);
                    }
                  }}
                  className="p-1 hover:bg-rose-500/20 rounded text-editor-muted hover:text-rose-400"
                  title="Delete Folder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isExpanded && item.children && item.children.length > 0 && (
              <div className="border-l border-editor-border/40 ml-4 pl-1">
                {renderTree(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      // File Row
      return (
        <div
          key={item.path}
          className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors relative ${
            level > 0 ? 'ml-3' : ''
          } ${
            isActive
              ? 'bg-indigo-500/15 text-white font-medium border-l-2 border-indigo-500 rounded-l-none'
              : 'hover:bg-editor-surface text-editor-text'
          }`}
          onClick={() => onSelectFile(item.path)}
        >
          <div className="flex items-center gap-2 overflow-hidden w-full">
            {getFileIcon(item.name, item.extension)}

            {renamingPath === item.path ? (
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleRenameSubmit(item.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(item.path);
                  if (e.key === 'Escape') setRenamingPath(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="bg-editor-bg border border-indigo-500 rounded px-1 py-0.5 text-xs text-white outline-none w-full font-mono"
              />
            ) : (
              <span className="truncate">{item.name}</span>
            )}

            {isRoot && (
              <span
                className="ml-auto mr-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                title="Root compilation file"
              >
                root
              </span>
            )}
          </div>

          {/* Context Action Menu Trigger */}
          <div
            className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveMenu(isMenuOpen ? null : item.path)}
              className="p-1 hover:bg-editor-hover rounded text-editor-muted hover:text-white"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-6 w-36 bg-editor-panel border border-editor-border rounded-lg shadow-xl py-1 z-30 font-sans text-xs">
                {item.extension === '.tex' && !isRoot && (
                  <button
                    onClick={() => {
                      onSetRootFile(item.path);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-editor-hover flex items-center gap-2 text-editor-text"
                  >
                    <Star className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Set as Root</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setRenamingPath(item.path);
                    setRenameValue(item.name);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-editor-hover flex items-center gap-2 text-editor-text"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    if (confirm(`Delete file '${item.name}'?`)) {
                      onDeleteFile(item.path);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-500/20 flex items-center gap-2 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <aside className="w-64 bg-editor-panel/70 backdrop-blur border-r border-editor-border flex flex-col h-full select-none">
      {/* File Tree Header */}
      <div className="h-10 px-3 border-b border-editor-border flex items-center justify-between text-xs font-semibold text-editor-muted">
        <span className="uppercase tracking-wider text-[10px] font-bold">Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewModal({ open: true, type: 'file', parentDir: '' })}
            className="p-1 hover:bg-editor-surface rounded text-editor-muted hover:text-cyan-400 transition-colors"
            title="New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowNewModal({ open: true, type: 'directory', parentDir: '' })}
            className="p-1 hover:bg-editor-surface rounded text-editor-muted hover:text-indigo-400 transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* File Tree Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
        {files.length === 0 ? (
          <div className="text-center py-8 text-editor-muted text-xs">No files in workspace</div>
        ) : (
          renderTree(files)
        )}
      </div>

      {/* New File/Folder Modal Dialog */}
      {showNewModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-editor-panel border border-editor-border rounded-xl shadow-2xl p-4 w-full max-w-sm"
          >
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              {showNewModal.type === 'file' ? <Plus className="w-4 h-4 text-cyan-400" /> : <FolderPlus className="w-4 h-4 text-indigo-400" />}
              <span>Create New {showNewModal.type === 'file' ? 'File' : 'Folder'}</span>
            </h3>
            {showNewModal.parentDir && (
              <p className="text-[11px] text-editor-muted mb-3 font-mono">
                Inside: <span className="text-editor-text">{showNewModal.parentDir}/</span>
              </p>
            )}
            <input
              type="text"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
              placeholder={showNewModal.type === 'file' ? 'filename.tex' : 'folder-name'}
              autoFocus
              className="w-full bg-editor-bg border border-editor-border rounded-lg px-3 py-2 text-xs text-white placeholder-editor-muted focus:outline-none focus:border-indigo-500 font-mono mb-4"
            />
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowNewModal({ open: false, type: 'file', parentDir: '' })}
                className="px-3 py-1.5 rounded-lg text-editor-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
