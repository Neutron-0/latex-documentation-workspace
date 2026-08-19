import { NextResponse } from 'next/server';
import fs from 'fs';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'documentation.pdf';

    const compilerManager = getCompilerManager();
    const pdfPath = compilerManager.getLatestPdfPath();

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return new NextResponse('No compiled PDF is available yet.', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
