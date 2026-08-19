import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve, ensureDir } from '@/lib/utils/filesystem';
import { getWorkspaceDir } from '@/lib/project';

export async function POST(req: Request) {
  try {
    const { path: relPath, type } = await req.json();

    if (!relPath || !type) {
      return NextResponse.json({ success: false, error: 'Path and type are required' }, { status: 400 });
    }

    const workspaceDir = getWorkspaceDir();
    const targetPath = safeResolve(workspaceDir, relPath);

    if (fs.existsSync(targetPath)) {
      return NextResponse.json({ success: false, error: 'Target already exists' }, { status: 409 });
    }

    if (type === 'directory') {
      ensureDir(targetPath);
    } else {
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, '% New LaTeX file\n', 'utf8');
    }

    return NextResponse.json({ success: true, path: relPath, message: 'Created successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
