// ============================================================
// APP/API/UPLOAD — POST /api/upload
// Upload 1 file — hoạt động cả dev lẫn production build
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { UploadCategory } from '@/types/upload'
import { uploadFile } from '@/lib/upload/uploadService'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as UploadCategory) || 'images'

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file' }, { status: 400 })
    }

    const userId = (session.user as any).id
    const result = await uploadFile(file, category, userId)

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
