import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import HomePage from '@/models/HomePage'
import { getHomePageConfig } from '@/models/HomePage'
import News from '@/models/News'
import '@/models/Category'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDatabase()
    await getHomePageConfig() // ensure document exists

    const config = await HomePage.findOne().lean()

    // Lấy bài viết "Đôi nét SĐH" từ featuredNewsIds (nếu có)
    let featuredArticles: any[] = []
    if (config?.featuredNewsIds && config.featuredNewsIds.length > 0) {
      const validIds = config.featuredNewsIds.filter(
        (id: any) => id && String(id).length === 24
      )
      if (validIds.length > 0) {
        featuredArticles = await News.find({ _id: { $in: validIds } })
          .select('title slug thumbnail tags publishedAt isPinned _id')
          .lean()
      }
    }

    // Lấy 8 bài viết mới nhất (có ưu tiên bài được ghim)
    const latestNews = await News.find({ status: 'PUBLISHED' })
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(8)
      .select('title slug thumbnail tags category publishedAt isPinned _id')
      .populate('category', 'name')
      .lean()

    const finalData = {
      ...config,
      featuredNewsIds: featuredArticles,
      latestNews
    }

    return NextResponse.json({ success: true, data: finalData })
  } catch (error: any) {
    console.error('Public home API error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
