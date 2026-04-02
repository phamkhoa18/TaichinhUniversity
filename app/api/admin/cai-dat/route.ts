// ============================================================
// API — GET / PUT /api/admin/cai-dat
// Lấy & cập nhật cài đặt hệ thống
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import SiteSetting, { getSettings } from '@/models/SiteSetting'
import { auth } from '@/auth'

// GET: Lấy toàn bộ settings
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    await connectToDatabase()
    const settings = await getSettings()

    // Ẩn SMTP password khỏi response
    const result = settings.toObject()
    if (result.email?.smtpPassword) {
      result.email.smtpPassword = result.email.smtpPassword ? '••••••••' : ''
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT: Cập nhật settings (theo từng tab)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    // Check role ADMIN
    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền truy cập' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()
    const { tab, data } = body

    if (!tab || !data) {
      return NextResponse.json({ success: false, error: 'Thiếu tab hoặc data' }, { status: 400 })
    }

    // Validate tab
    const validTabs = ['general', 'contact', 'socialLinks', 'seo', 'email', 'maintenance', 'security', 'appearance', 'footer']
    if (!validTabs.includes(tab)) {
      return NextResponse.json({ success: false, error: 'Tab không hợp lệ' }, { status: 400 })
    }

    // Lấy hoặc tạo settings
    let settings = await SiteSetting.findOne()
    if (!settings) {
      settings = await SiteSetting.create({})
    }

    // Xử lý SMTP password: nếu gửi '••••••••' thì giữ password cũ
    if (tab === 'email' && data.smtpPassword === '••••••••') {
      data.smtpPassword = settings.email.smtpPassword
    }

    // Cập nhật tab tương ứng
    if (tab === 'socialLinks') {
      settings.socialLinks = data
    } else if (tab === 'footer') {
      (settings as any).footer = data
    } else {
      (settings as any)[tab] = { ...(settings as any)[tab], ...data }
    }

    await settings.save()

    return NextResponse.json({ success: true, message: 'Đã lưu cài đặt' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
