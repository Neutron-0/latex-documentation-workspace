import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve, ensureDir } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function POST(req: Request) {
  try {
    const { path: relPath, type = 'file' } = await req.json();

    if (!relPath) {
      return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
    }

    const targetPath = safeResolve(WORKSPACE_DIR, relPath);
    if (fs.existsSync(targetPath)) {
      return NextResponse.json({ success: false, error: 'File or directory already exists' }, { status: 400 });
    }

    if (type === 'dir' || type === 'directory') {
      ensureDir(targetPath);
    } else {
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, '', 'utf8');
    }

    return NextResponse.json({ success: true, path: relPath, message: 'Created successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
