/**
 * LaTeX Documentation Workspace - Application Coordinator.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const projectClient = window.projectClient;

  // UI Element References
  const btnCompile = document.getElementById('btn-compile');
  const btnCancel = document.getElementById('btn-cancel');
  const btnSaveFile = document.getElementById('btn-save-file');
  const rootFileNameLabel = document.getElementById('root-file-name');
  const engineSelect = document.getElementById('engine-select');
  const autoBuildToggle = document.getElementById('auto-build-toggle');
  const btnNewFile = document.getElementById('btn-new-file');
  const btnNewFolder = document.getElementById('btn-new-folder');
  const btnRefreshFiles = document.getElementById('btn-refresh-files');

  let currentProject = { rootFile: 'main.tex', compiler: 'tectonic', autoBuild: false };
  let isBuilding = false;

  // Initialize Components
  const preview = new window.PdfPreview();

  const diagnostics = new window.DiagnosticsConsole({
    onNavigate: async (filePath, lineNumber) => {
      if (filePath) {
        await openFileInEditor(filePath);
        if (lineNumber) {
          editor.gotoLine(lineNumber);
        }
      }
    },
  });

  const editor = new window.LatexEditor(
    'latex-code-input',
    async () => {
      await saveCurrentFile();
      if (autoBuildToggle.checked) {
        await runCompilation();
      }
    },
    async () => {
      await runCompilation();
    }
  );

  const fileTree = new window.FileTree('file-tree', {
    onSelect: async (filePath) => {
      await openFileInEditor(filePath);
    },
    onSetRoot: async (filePath) => {
      currentProject.rootFile = filePath;
      rootFileNameLabel.textContent = filePath;
      fileTree.setRootFile(filePath);
      await projectClient.updateProject({ rootFile: filePath });
      await refreshFiles();
    },
    onRename: async (oldPath, newPath) => {
      await projectClient.renameItem(oldPath, newPath);
      if (editor.getActiveFile() === oldPath) {
        editor.activeFilePath = newPath;
        document.getElementById('active-file-path').textContent = newPath;
      }
      await refreshFiles();
    },
    onDelete: async (filePath) => {
      await projectClient.deleteItem(filePath);
      if (editor.getActiveFile() === filePath) {
        await openFileInEditor(currentProject.rootFile);
      }
      await refreshFiles();
    },
  });

  // Helper: Open file in editor
  async function openFileInEditor(filePath) {
    try {
      const content = await projectClient.readFile(filePath);
      editor.openFile(filePath, content);
      fileTree.activePath = filePath;
      fileTree.updateActiveItem();
    } catch (err) {
      alert(`Could not open file: ${err.message}`);
    }
  }

  // Helper: Save current editor file
  async function saveCurrentFile() {
    const activeFile = editor.getActiveFile();
    if (!activeFile) return;

    try {
      const content = editor.getValue();
      await projectClient.writeFile(activeFile, content);
      editor.markSaved();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  }

  // Helper: Refresh file tree
  async function refreshFiles() {
    const tree = await projectClient.getFileTree();
    fileTree.render(tree, editor.getActiveFile());
  }

  // Helper: Trigger Compilation
  async function runCompilation() {
    if (isBuilding) {
      // If already building, canceling will happen on server side
    }

    // Auto-save before compile
    if (editor.isModified) {
      await saveCurrentFile();
    }

    setBuildingState(true);
    diagnostics.setStatus('running', 'Compiling...');

    try {
      const result = await projectClient.compile(currentProject.rootFile, engineSelect.value);
      setBuildingState(false);

      diagnostics.updateDiagnostics(result);

      if (result.success) {
        preview.updatePreview();
      }
    } catch (err) {
      setBuildingState(false);
      diagnostics.updateDiagnostics({
        success: false,
        duration: 0,
        engine: engineSelect.value,
        errors: [{ file: currentProject.rootFile, line: 1, message: err.message }],
        rawOutput: err.stack,
      });
    }
  }

  function setBuildingState(building) {
    isBuilding = building;
    if (building) {
      btnCompile.classList.add('hidden');
      btnCancel.classList.remove('hidden');
    } else {
      btnCompile.classList.remove('hidden');
      btnCancel.classList.add('hidden');
    }
  }

  // Cancel build
  btnCancel.addEventListener('click', async () => {
    await projectClient.cancelCompile();
    setBuildingState(false);
    diagnostics.setStatus('failed', 'Cancelled');
  });

  // Compile button
  btnCompile.addEventListener('click', () => runCompilation());

  // Save button
  btnSaveFile.addEventListener('click', async () => {
    await saveCurrentFile();
    if (autoBuildToggle.checked) {
      await runCompilation();
    }
  });

  // Engine selection change
  engineSelect.addEventListener('change', async () => {
    currentProject.compiler = engineSelect.value;
    await projectClient.updateProject({ compiler: engineSelect.value });
  });

  // Auto-build toggle change
  autoBuildToggle.addEventListener('change', async () => {
    currentProject.autoBuild = autoBuildToggle.checked;
    await projectClient.updateProject({ autoBuild: autoBuildToggle.checked });
  });

  // Toolbar File Explorer Actions
  btnNewFile.addEventListener('click', async () => {
    const filename = prompt('Enter new file name (e.g. chapters/02-background.tex):');
    if (filename) {
      try {
        await projectClient.createItem(filename, 'file');
        await refreshFiles();
        await openFileInEditor(filename);
      } catch (err) {
        alert(err.message);
      }
    }
  });

  btnNewFolder.addEventListener('click', async () => {
    const folderName = prompt('Enter new folder name (e.g. sections):');
    if (folderName) {
      try {
        await projectClient.createItem(folderName, 'dir');
        await refreshFiles();
      } catch (err) {
        alert(err.message);
      }
    }
  });

  btnRefreshFiles.addEventListener('click', refreshFiles);

  // Initial Load Sequence
  try {
    // 1. Fetch project configuration
    currentProject = await projectClient.getProject();
    rootFileNameLabel.textContent = currentProject.rootFile || 'main.tex';
    fileTree.setRootFile(currentProject.rootFile || 'main.tex');
    autoBuildToggle.checked = !!currentProject.autoBuild;

    // 2. Fetch detected engines
    const enginesData = await projectClient.getEngines(currentProject.compiler);
    engineSelect.innerHTML = '';

    if (enginesData.available && enginesData.available.length > 0) {
      enginesData.available.forEach((eng) => {
        const opt = document.createElement('option');
        opt.value = eng.id;
        opt.textContent = `${eng.name} ${eng.isPortable ? '(Portable)' : ''}`;
        if (eng.id === currentProject.compiler || (enginesData.selected && eng.id === enginesData.selected.id)) {
          opt.selected = true;
        }
        engineSelect.appendChild(opt);
      });
    } else {
      const opt = document.createElement('option');
      opt.value = 'none';
      opt.textContent = 'No Engine Found (Run setup)';
      engineSelect.appendChild(opt);
    }

    // 3. Populate file tree & open root document
    await refreshFiles();
    await openFileInEditor(currentProject.rootFile || 'main.tex');

    // 4. Check initial compile status
    const statusRes = await fetch('/api/compile/status');
    const statusData = await statusRes.json();
    if (statusData.lastBuild) {
      diagnostics.updateDiagnostics(statusData.lastBuild);
      if (statusData.lastBuild.success) {
        preview.updatePreview();
      }
    }
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
