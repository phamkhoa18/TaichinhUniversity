import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { getHomePageConfig } from '@/models/HomePage'
import { auth } from '@/auth'

// GET: Lấy cấu hình trang chủ
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    await connectToDatabase()
    const config = await getHomePageConfig()
    return NextResponse.json({ success: true, data: config })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT: Cập nhật cấu hình
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền truy cập' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()
    const config = await getHomePageConfig()

    // Cập nhật các trường
    if (body.heroSlides) config.heroSlides = body.heroSlides
    if (body.videoHighlight) config.videoHighlight = body.videoHighlight
    if (body.aboutStats) config.aboutStats = body.aboutStats
    if (body.achievements) config.achievements = body.achievements
    if (body.featuredNewsIds) {
      config.featuredNewsIds = body.featuredNewsIds.filter((id: string) => id && id.length > 0)
    }

    await config.save()

    return NextResponse.json({ success: true, message: 'Đã lưu cấu hình Trang chủ CMS' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
