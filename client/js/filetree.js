/**
 * File Explorer Tree Component.
 */
class FileTree {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onSelect = options.onSelect;
    this.onSetRoot = options.onSetRoot;
    this.onDelete = options.onDelete;
    this.onRename = options.onRename;
    this.activePath = null;
    this.rootFile = 'main.tex';
  }

  setRootFile(rootFile) {
    this.rootFile = rootFile;
  }

  render(treeData, activePath = null) {
    if (activePath) this.activePath = activePath;
    this.container.innerHTML = '';

    if (!treeData || treeData.length === 0) {
      this.container.innerHTML = '<div class="empty-state" style="padding: 10px;">Workspace is empty.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();
    this.renderNodes(treeData, fragment, 0);
    this.container.appendChild(fragment);
  }

  renderNodes(nodes, parentEl, depth = 0) {
    nodes.forEach((node) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'tree-item';
      itemEl.style.paddingLeft = `${12 + depth * 14}px`;

      if (node.path === this.activePath) {
        itemEl.classList.add('active');
      }

      const isRoot = node.path === this.rootFile;
      if (isRoot) {
        itemEl.classList.add('is-root');
      }

      // Icon determination
      let icon = '📄';
      if (node.type === 'directory') {
        icon = '📁';
      } else if (node.name.endsWith('.bib')) {
        icon = '📚';
      } else if (node.name.endsWith('.json')) {
        icon = '⚙️';
      } else if (/\.(png|jpg|jpeg|svg|pdf)$/i.test(node.name)) {
        icon = '🖼️';
      }

      itemEl.innerHTML = `
        <span class="tree-icon">${icon}</span>
        <span class="tree-name" title="${node.path}">${node.name}</span>
        ${isRoot ? '<span style="font-size:9px; color:#06b6d4; margin-left:4px;">[root]</span>' : ''}
        <div class="tree-item-actions">
          ${node.name.endsWith('.tex') && !isRoot ? '<button class="icon-btn action-root" title="Set as Root Document">⭐</button>' : ''}
          <button class="icon-btn action-rename" title="Rename">✏️</button>
          <button class="icon-btn action-delete" title="Delete">🗑️</button>
        </div>
      `;

      // Event handlers
      itemEl.addEventListener('click', (e) => {
        if (e.target.closest('.tree-item-actions')) return;
        if (node.type === 'file') {
          this.activePath = node.path;
          this.updateActiveItem();
          if (this.onSelect) this.onSelect(node.path);
        }
      });

      const btnRoot = itemEl.querySelector('.action-root');
      if (btnRoot) {
        btnRoot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.onSetRoot) this.onSetRoot(node.path);
        });
      }

      const btnRename = itemEl.querySelector('.action-rename');
      if (btnRename) {
        btnRename.addEventListener('click', (e) => {
          e.stopPropagation();
          const newName = prompt(`Rename '${node.name}' to:`, node.name);
          if (newName && newName !== node.name) {
            const dir = node.path.includes('/') ? node.path.substring(0, node.path.lastIndexOf('/')) : '';
            const newPath = dir ? `${dir}/${newName}` : newName;
            if (this.onRename) this.onRename(node.path, newPath);
          }
        });
      }

      const btnDelete = itemEl.querySelector('.action-delete');
      if (btnDelete) {
        btnDelete.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to delete '${node.path}'?`)) {
            if (this.onDelete) this.onDelete(node.path);
          }
        });
      }

      parentEl.appendChild(itemEl);

      if (node.type === 'directory' && node.children && node.children.length > 0) {
        this.renderNodes(node.children, parentEl, depth + 1);
      }
    });
  }

  updateActiveItem() {
    const items = this.container.querySelectorAll('.tree-item');
    items.forEach((item) => {
      const nameEl = item.querySelector('.tree-name');
      if (nameEl && nameEl.getAttribute('title') === this.activePath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

window.FileTree = FileTree;
