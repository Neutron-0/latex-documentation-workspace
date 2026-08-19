import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve, ensureDir } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function POST(req: Request) {
  try {
    const { oldPath: oldRelPath, newPath: newRelPath } = await req.json();

    if (!oldRelPath || !newRelPath) {
      return NextResponse.json({ success: false, error: 'oldPath and newPath are required' }, { status: 400 });
    }

    const source = safeResolve(WORKSPACE_DIR, oldRelPath);
    const target = safeResolve(WORKSPACE_DIR, newRelPath);

    if (!fs.existsSync(source)) {
      return NextResponse.json({ success: false, error: 'Source item does not exist' }, { status: 404 });
    }

    if (fs.existsSync(target)) {
      return NextResponse.json({ success: false, error: 'Target path already exists' }, { status: 400 });
    }

    ensureDir(path.dirname(target));
    fs.renameSync(source, target);

    return NextResponse.json({ success: true, oldPath: oldRelPath, newPath: newRelPath });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
