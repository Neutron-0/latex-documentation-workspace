'use client';

import React, { useState } from 'react';
import {
  FileText,
  RefreshCw,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string | null;
  isCompiling: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfUrl,
  isCompiling,
  onRefresh,
  onExport,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`flex flex-col bg-editor-bg border-l border-editor-border transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black/95' : 'w-1/2 h-full'
      }`}
    >
      {/* PDF Header Controls */}
      <div className="h-10 bg-editor-panel/80 backdrop-blur border-b border-editor-border flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-editor-text">Document Preview</span>
          {isCompiling && (
            <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full animate-pulse border border-indigo-500/20">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>rendering...</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
          </button>

          {pdfUrl && (
            <>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
                title="Open PDF in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onExport}
                className="p-1.5 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-editor-hover rounded text-editor-muted hover:text-white transition-colors"
            title={isFullscreen ? 'Exit full screen' : 'Full screen preview'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* PDF Frame / Empty State */}
      <div className="flex-1 w-full h-full bg-[#1e1e24] relative overflow-hidden flex items-center justify-center">
        {pdfUrl ? (
          <object
            key={pdfUrl}
            data={`${pdfUrl}#view=FitH`}
            type="application/pdf"
            className="w-full h-full border-0"
            aria-label="LaTeX PDF Preview"
          >
            <iframe
              src={`${pdfUrl}#view=FitH`}
              className="w-full h-full border-0"
              title="LaTeX PDF Preview"
            />
          </object>
        ) : (
          <div className="text-center p-8 text-editor-muted max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-editor-surface flex items-center justify-center mx-auto mb-3 border border-editor-border">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">No Document Preview Available</h4>
            <p className="text-xs text-editor-muted mb-4">
              Compile your project using the Compile button or press Ctrl+B to generate the live PDF preview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
