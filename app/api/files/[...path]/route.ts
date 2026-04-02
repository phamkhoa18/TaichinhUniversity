// ============================================================
// API — Serve uploaded files from data directory
// GET /api/files/[...path]
// Production-safe: serves files from outside /public
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { getPhysicalPath } from '@/lib/upload/uploadService'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const relativePath = pathSegments.join('/')
    
    // Kiểm tra path không chứa .. (bảo mật)
    if (relativePath.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const filePath = getPhysicalPath(relativePath)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileData = await readFile(filePath)
    const ext = '.' + relativePath.split('.').pop()?.toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileData.length.toString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'File read failed' },
      { status: 500 }
    )
  }
}
