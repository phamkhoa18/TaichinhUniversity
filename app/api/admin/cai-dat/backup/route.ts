// ============================================================
// API — POST /api/admin/cai-dat/backup
// Export toàn bộ dữ liệu (dạng JSON backup)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { auth } from '@/auth'
import SiteSetting from '@/models/SiteSetting'
import News from '@/models/News'
import Category from '@/models/Category'
import User from '@/models/User'
import AdmissionRound from '@/models/AdmissionRound'
import Applicant from '@/models/Applicant'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()

    // Export tất cả collections
    const [settings, news, categories, users, admissionRounds, applicants] = await Promise.all([
      SiteSetting.findOne().lean(),
      News.find().lean(),
      Category.find().lean(),
      User.find().select('-passwordHash').lean(), // Không export password
      AdmissionRound.find().lean(),
      Applicant.find().lean(),
    ])

    const backupData = {
      _meta: {
        exportedAt: new Date().toISOString(),
        exportedBy: user.email,
        version: '1.0',
        collections: {
          settings: 1,
          news: news.length,
          categories: categories.length,
          users: users.length,
          admissionRounds: admissionRounds.length,
          applicants: applicants.length,
        },
      },
      settings,
      news,
      categories,
      users,
      admissionRounds,
      applicants,
    }

    return NextResponse.json({ success: true, data: backupData })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
