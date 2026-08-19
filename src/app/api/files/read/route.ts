import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const relPath = searchParams.get('path');

    if (!relPath) {
      return NextResponse.json({ success: false, error: 'Path query param is required' }, { status: 400 });
    }

    const filePath = safeResolve(WORKSPACE_DIR, relPath);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return NextResponse.json({ success: false, error: 'Path is a directory' }, { status: 400 });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json({ success: true, path: relPath, content });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
