import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve, ensureDir } from '@/lib/utils/filesystem';
import { getWorkspaceDir } from '@/lib/project';

export async function POST(req: Request) {
  try {
    const { oldPath, newPath } = await req.json();

    if (!oldPath || !newPath) {
      return NextResponse.json({ success: false, error: 'Both oldPath and newPath are required' }, { status: 400 });
    }

    const workspaceDir = getWorkspaceDir();
    const source = safeResolve(workspaceDir, oldPath);
    const target = safeResolve(workspaceDir, newPath);

    if (!fs.existsSync(source)) {
      return NextResponse.json({ success: false, error: 'Source path does not exist' }, { status: 404 });
    }

    if (fs.existsSync(target)) {
      return NextResponse.json({ success: false, error: 'Target path already exists' }, { status: 409 });
    }

    ensureDir(path.dirname(target));
    fs.renameSync(source, target);

    return NextResponse.json({ success: true, message: 'Renamed successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
