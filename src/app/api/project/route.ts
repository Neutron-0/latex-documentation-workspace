import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ProjectConfig } from '@/lib/types';

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');
const CONFIG_PATH = path.join(WORKSPACE_DIR, 'project.json');

const DEFAULT_CONFIG: ProjectConfig = {
  name: 'Technical Documentation',
  rootFile: 'main.tex',
  compiler: 'tectonic',
  autoBuild: false,
  synctex: true,
  buildDir: '.build',
};

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      const config = JSON.parse(raw);
      return NextResponse.json({ success: true, project: { ...DEFAULT_CONFIG, ...config } });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
    return NextResponse.json({ success: true, project: DEFAULT_CONFIG });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let current = DEFAULT_CONFIG;
    if (fs.existsSync(CONFIG_PATH)) {
      try {
        current = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      } catch (e) {}
    }

    const updated = { ...current, ...body };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8');
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
