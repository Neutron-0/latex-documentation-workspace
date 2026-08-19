import { NextResponse } from 'next/server';
import path from 'path';
import { getDirectoryTree } from '@/lib/utils/filesystem';
import { getWorkspaceDir } from '@/lib/project';

export async function GET() {
  try {
    const workspaceDir = getWorkspaceDir();
    const tree = getDirectoryTree(workspaceDir);
    const relativeWorkspace = path.relative(process.cwd(), workspaceDir).replace(/\\/g, '/') || '.';
    return NextResponse.json({ success: true, tree, workspaceDir: relativeWorkspace });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
