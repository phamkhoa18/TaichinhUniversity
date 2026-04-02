import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import '@/models/Category' // Ensure relation is loaded
import '@/models/User' // Ensure author relation is loaded
import SiteSetting, { getSettings } from '@/models/SiteSetting'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Build query: only PUBLISHED and valid publishedAt
    const query: any = { status: 'PUBLISHED', publishedAt: { $lte: new Date() } }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ]
    }

    // Fetch matching categories if 'category' slug is provided
    // For now, if we pass category slug, we'd need to look up the Category ID first.
    // Let's populate category and filter in memory if slug is passed, or better, query Category.
    // To make it simple, we will return populated result and let frontend filter, OR
    // we use mongoose population match. For simplicity, let's just fetch all published and populate it.
    
    const settings = await getSettings()
    const defaultImg = settings?.appearance?.defaultNewsImage || '/images/life/bg_ufm_5.jpg'

    const news = await News.find(query)
      .sort({ isPinned: -1, publishedAt: -1 })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .limit(limit)
      .lean()

    const preparedNews = news.map(n => ({
      ...n,
      thumbnail: n.thumbnail || defaultImg
    }))

    return NextResponse.json({ success: true, data: preparedNews })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
