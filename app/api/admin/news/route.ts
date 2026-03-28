import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import { auth } from '@/auth'

// GET: Lấy danh sách bài viết
export async function GET() {
  try {
    await connectToDatabase()
    const news = await News.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('author', 'name')
      .populate('category', 'name slug color')
      .limit(50)
      .lean()
    return NextResponse.json({ success: true, data: news })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: Tạo bài viết mới
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    await connectToDatabase()
    const body = await req.json()

    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: 'Tiêu đề và slug là bắt buộc' }, { status: 400 })
    }

    const newsData = {
      ...body,
      author: (session.user as any).id,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : undefined,
    }

    const news = await News.create(newsData)
    return NextResponse.json({ success: true, data: news }, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug đã tồn tại, vui lòng chọn slug khác' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
