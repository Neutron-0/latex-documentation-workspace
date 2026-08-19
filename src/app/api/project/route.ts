import { NextResponse } from 'next/server';
import { getProjectConfig, saveProjectConfig } from '@/lib/project';

export async function GET() {
  try {
    const project = getProjectConfig();
    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = saveProjectConfig(body);
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
