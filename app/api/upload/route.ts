// ============================================================
// APP/API/UPLOAD — POST /api/upload
// Upload 1 file — hoạt động cả dev lẫn production build
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { UploadCategory } from '@/types/upload'
import { uploadFile } from '@/lib/upload/uploadService'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as UploadCategory) || 'images'

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file' }, { status: 400 })
    }

    // TODO: Xác thực session user ở đây
    // const session = await getServerSession()
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const result = await uploadFile(file, category)

    return NextResponse.json({
      success: true,
      url: result.url,
      originalName: result.originalName,
      size: result.size,
      category: result.category,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Upload thất bại' },
      { status: 500 }
    )
  }
}
