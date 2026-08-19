/**
 * Project API client and state management.
 */
class ProjectClient {
  async getProject() {
    const res = await fetch('/api/project');
    const data = await res.json();
    return data.project;
  }

  async updateProject(partialConfig) {
    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partialConfig),
    });
    return await res.json();
  }

  async getFileTree() {
    const res = await fetch('/api/files');
    const data = await res.json();
    return data.tree || [];
  }

  async readFile(filePath) {
    const res = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to read file');
    return data.content;
  }

  async writeFile(filePath, content) {
    const res = await fetch('/api/files/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath, content }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to save file');
    return data;
  }

  async createItem(filePath, type = 'file') {
    const res = await fetch('/api/files/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath, type }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create item');
    return data;
  }

  async renameItem(oldPath, newPath) {
    const res = await fetch('/api/files/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath, newPath }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to rename item');
    return data;
  }

  async deleteItem(filePath) {
    const res = await fetch('/api/files/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete item');
    return data;
  }

  async getEngines() {
    const res = await fetch('/api/compile/engines');
    return await res.json();
  }

  async compile(rootFile, engineId) {
    const res = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rootFile, engineId }),
    });
    return await res.json();
  }

  async cancelCompile() {
    const res = await fetch('/api/compile/cancel', {
      method: 'POST',
    });
    return await res.json();
  }
}

window.projectClient = new ProjectClient();
