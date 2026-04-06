import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'
import '@/models/ShortCourse'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const { phone } = await req.json()

    if (!phone || phone.trim().length < 8) {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập số điện thoại hợp lệ' }, { status: 400 })
    }

    const registrations = await ShortCourseRegistration.find({ phone: phone.trim() })
      .sort({ createdAt: -1 })
      .populate('courses', 'title code price schedule startDate')
      .lean()

    if (registrations.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hồ sơ đăng ký nào với số điện thoại này' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: registrations })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
