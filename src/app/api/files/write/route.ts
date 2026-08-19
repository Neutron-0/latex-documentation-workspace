import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { safeResolve, ensureDir } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function POST(req: Request) {
  try {
    const { path: relPath, content } = await req.json();

    if (!relPath || typeof content !== 'string') {
      return NextResponse.json({ success: false, error: 'Path and content string are required' }, { status: 400 });
    }

    const filePath = safeResolve(WORKSPACE_DIR, relPath);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');

    return NextResponse.json({ success: true, path: relPath, message: 'Saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
