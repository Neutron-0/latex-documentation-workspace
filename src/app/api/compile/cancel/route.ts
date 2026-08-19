import { NextResponse } from 'next/server';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function POST() {
  try {
    const compilerManager = getCompilerManager();
    const cancelled = compilerManager.cancelCurrentBuild();
    return NextResponse.json({ success: true, cancelled });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
