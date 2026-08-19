import { NextResponse } from 'next/server';
import fs from 'fs';
import { getCompilerManager } from '@/lib/compiler/compiler-manager';

export async function GET() {
  try {
    const compilerManager = getCompilerManager();
    const pdfPath = compilerManager.getLatestPdfPath();

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return new NextResponse('No compiled PDF is available yet.', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const stats = fs.statSync(pdfPath);
    const fileBuffer = fs.readFileSync(pdfPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'inline; filename="preview.pdf"',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function HEAD() {
  try {
    const compilerManager = getCompilerManager();
    const pdfPath = compilerManager.getLatestPdfPath();

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return new NextResponse(null, { status: 404 });
    }

    const stats = fs.statSync(pdfPath);
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'inline; filename="preview.pdf"',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: any) {
    return new NextResponse(null, { status: 500 });
  }
}
