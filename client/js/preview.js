/**
 * PDF Preview & Export Management.
 */
class PdfPreview {
  constructor() {
    this.frame = document.getElementById('pdf-viewer-frame');
    this.placeholder = document.getElementById('preview-placeholder');
    this.btnRefresh = document.getElementById('btn-refresh-preview');
    this.btnOpenTab = document.getElementById('btn-open-tab');
    this.btnExport = document.getElementById('btn-export-pdf');

    this.hasPdf = false;
    this.initEvents();
  }

  initEvents() {
    if (this.btnRefresh) {
      this.btnRefresh.addEventListener('click', () => this.refresh());
    }

    if (this.btnOpenTab) {
      this.btnOpenTab.addEventListener('click', () => {
        if (this.hasPdf) {
          window.open('/api/compile/pdf', '_blank');
        } else {
          alert('No compiled PDF available yet. Build the document first.');
        }
      });
    }

    if (this.btnExport) {
      this.btnExport.addEventListener('click', () => this.exportPdf());
    }
  }

  updatePreview() {
    this.hasPdf = true;
    this.placeholder.classList.add('hidden');
    this.frame.classList.remove('hidden');

    // Add timestamp cache-buster to force iframe reload
    const pdfUrl = `/api/compile/pdf?t=${Date.now()}`;
    this.frame.src = pdfUrl;
  }

  refresh() {
    if (this.hasPdf) {
      this.updatePreview();
    }
  }

  exportPdf(preferredFilename = null) {
    if (!this.hasPdf) {
      alert('Please compile the document first before exporting.');
      return;
    }

    const filename = preferredFilename || 'technical-documentation.pdf';
    const downloadUrl = `/api/compile/pdf/download?filename=${encodeURIComponent(filename)}&t=${Date.now()}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

window.PdfPreview = PdfPreview;
