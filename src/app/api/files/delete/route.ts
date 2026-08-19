import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function POST(req: Request) {
  try {
    const { path: relPath } = await req.json();

    if (!relPath) {
      return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
    }

    const target = safeResolve(WORKSPACE_DIR, relPath);
    if (!fs.existsSync(target)) {
      return NextResponse.json({ success: false, error: 'Target does not exist' }, { status: 404 });
    }

    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      fs.rmSync(target, { recursive: true, force: true });
    } else {
      fs.unlinkSync(target);
    }

    return NextResponse.json({ success: true, path: relPath, message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
