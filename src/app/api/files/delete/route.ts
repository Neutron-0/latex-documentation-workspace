import { NextResponse } from 'next/server';
import fs from 'fs';
import { safeResolve } from '@/lib/utils/filesystem';
import { getWorkspaceDir } from '@/lib/project';

export async function POST(req: Request) {
  try {
    const { path: relPath } = await req.json();

    if (!relPath) {
      return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
    }

    const workspaceDir = getWorkspaceDir();
    const target = safeResolve(workspaceDir, relPath);

    if (!fs.existsSync(target)) {
      return NextResponse.json({ success: false, error: 'Target not found' }, { status: 404 });
    }

    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      fs.rmSync(target, { recursive: true, force: true });
    } else {
      fs.unlinkSync(target);
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
