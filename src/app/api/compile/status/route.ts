import { NextResponse } from 'next/server';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function GET() {
  try {
    const compilerManager = getCompilerManager();
    const lastBuild = compilerManager.getLastBuildInfo();
    return NextResponse.json({ success: true, lastBuild });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
