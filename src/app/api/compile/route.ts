import { NextResponse } from 'next/server';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function POST(req: Request) {
  try {
    const { rootFile = 'main.tex', engineId = null } = await req.json();
    const compilerManager = getCompilerManager();
    const result = await compilerManager.compile({ rootFile, engineId });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
