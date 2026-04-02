import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import '@/models/Category'
import '@/models/User'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase()

    const { slug } = await params

    // Only allow view of PUBLISHED posts
    const news = await News.findOne({ slug, status: 'PUBLISHED' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .lean()

    if (!news) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 })
    }

    // Optional: increment view count
    // await News.updateOne({ slug }, { $inc: { views: 1 } })

    return NextResponse.json({ success: true, data: news })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
