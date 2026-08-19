import { NextResponse } from 'next/server';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const preferred = searchParams.get('preferred') || null;
    const compilerManager = getCompilerManager();
    const engineInfo = await compilerManager.getEngines(preferred);
    return NextResponse.json({ success: true, ...engineInfo });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
