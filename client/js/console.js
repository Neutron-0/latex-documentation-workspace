/**
 * Diagnostics & Console Output Panel.
 */
class DiagnosticsConsole {
  constructor(options = {}) {
    this.onNavigate = options.onNavigate;

    this.panel = document.getElementById('diagnostics-panel');
    this.tabProblemsBtn = document.getElementById('tab-problems-btn');
    this.tabLogsBtn = document.getElementById('tab-logs-btn');
    this.paneProblems = document.getElementById('pane-problems');
    this.paneLogs = document.getElementById('pane-logs');
    this.problemsCountBadge = document.getElementById('problems-count');
    this.problemsList = document.getElementById('problems-list');
    this.rawLogOutput = document.getElementById('raw-log-output');
    this.metaLabel = document.getElementById('last-build-meta');
    this.btnToggle = document.getElementById('btn-toggle-diagnostics');
    this.statusBadge = document.getElementById('build-status-badge');
    this.statusText = document.getElementById('status-text');

    this.initEvents();
  }

  initEvents() {
    this.tabProblemsBtn.addEventListener('click', () => this.switchTab('problems'));
    this.tabLogsBtn.addEventListener('click', () => this.switchTab('logs'));

    this.btnToggle.addEventListener('click', () => {
      this.panel.classList.toggle('collapsed');
      this.btnToggle.textContent = this.panel.classList.contains('collapsed') ? '▴' : '▾';
    });

    document.getElementById('btn-clear-logs').addEventListener('click', () => {
      this.rawLogOutput.textContent = '';
    });

    document.getElementById('btn-copy-logs').addEventListener('click', () => {
      navigator.clipboard.writeText(this.rawLogOutput.textContent);
      alert('Logs copied to clipboard');
    });
  }

  switchTab(tab) {
    if (tab === 'problems') {
      this.tabProblemsBtn.classList.add('active');
      this.tabLogsBtn.classList.remove('active');
      this.paneProblems.classList.add('active');
      this.paneLogs.classList.remove('active');
    } else {
      this.tabLogsBtn.classList.add('active');
      this.tabProblemsBtn.classList.remove('active');
      this.paneLogs.classList.add('active');
      this.paneProblems.classList.remove('active');
    }
  }

  setStatus(state, message) {
    this.statusBadge.className = `status-badge ${state}`;
    this.statusText.textContent = message;
  }

  updateDiagnostics(buildResult) {
    const { success, duration, engine, errors = [], warnings = [], rawOutput = '' } = buildResult;

    // Expand panel if errors occur
    if (!success && errors.length > 0) {
      this.panel.classList.remove('collapsed');
      this.btnToggle.textContent = '▾';
      this.switchTab('problems');
    }

    // Update Status Badge
    if (buildResult.cancelled) {
      this.setStatus('failed', 'Cancelled');
      this.metaLabel.textContent = 'Build was cancelled';
    } else if (success) {
      this.setStatus('success', `Success (${duration}ms)`);
      this.metaLabel.textContent = `Built in ${duration}ms with ${engine}`;
    } else {
      this.setStatus('failed', `Failed (${errors.length} error${errors.length === 1 ? '' : 's'})`);
      this.metaLabel.textContent = `Compilation failed with ${engine}`;
    }

    // Update raw logs
    this.rawLogOutput.textContent = rawOutput || 'No output recorded.';

    // Update Problems Count
    const totalIssues = errors.length + warnings.length;
    this.problemsCountBadge.textContent = totalIssues;
    this.problemsCountBadge.style.backgroundColor = errors.length > 0 ? '#ef4444' : (warnings.length > 0 ? '#f59e0b' : '#343442');

    // Populate Problems List
    this.problemsList.innerHTML = '';

    if (totalIssues === 0) {
      this.problemsList.innerHTML = '<div class="empty-state">No issues found. Clean compilation.</div>';
      return;
    }

    // Render errors first
    errors.forEach((err) => {
      const item = document.createElement('div');
      item.className = 'problem-item error';
      item.innerHTML = `
        <span class="problem-icon">✕</span>
        <span class="problem-loc">${err.file || 'main.tex'}${err.line ? `:${err.line}` : ''}</span>
        <div class="problem-msg">
          <div>${this.escapeHtml(err.message)}</div>
          ${err.snippet ? `<div class="problem-snippet">${this.escapeHtml(err.snippet)}</div>` : ''}
        </div>
      `;

      item.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate(err.file, err.line);
      });

      this.problemsList.appendChild(item);
    });

    // Render warnings
    warnings.forEach((warn) => {
      const item = document.createElement('div');
      item.className = 'problem-item warning';
      item.innerHTML = `
        <span class="problem-icon">⚠</span>
        <span class="problem-loc">${warn.file || 'main.tex'}${warn.line ? `:${warn.line}` : ''}</span>
        <div class="problem-msg">
          <div>${this.escapeHtml(warn.message)}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate(warn.file, warn.line);
      });

      this.problemsList.appendChild(item);
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.DiagnosticsConsole = DiagnosticsConsole;
