import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload/uploadService'



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file' }, { status: 400 })
    }

    // Use 'applicants' category — allows images + PDF + Word, max 10MB
    const result = await uploadFile(file, 'applicants')

    return NextResponse.json({
      success: true,
      url: result.url,
      originalName: result.originalName,
      size: result.size,
    })
  } catch (error: any) {
    console.error('[Tuyen-sinh Upload Error]:', error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload thất bại' },
      { status: 500 }
    )
  }
}
