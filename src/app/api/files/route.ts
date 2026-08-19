import { NextResponse } from 'next/server';
import path from 'path';
import { getDirectoryTree } from '@/lib/utils/filesystem';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');

export async function GET() {
  try {
    const tree = getDirectoryTree(WORKSPACE_DIR);
    return NextResponse.json({ success: true, tree });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
