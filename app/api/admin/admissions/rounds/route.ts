import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import AdmissionRound from '@/models/AdmissionRound'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { SessionUser } from '@/types/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const user = session.user as SessionUser
    if (!hasPermission(user.role, 'admission:read')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    await connectToDatabase()
    
    // Tìm và populate virtual field (nếu Applicant đang chạy mượt)
    const rounds = await AdmissionRound.find()
      .sort({ openDate: -1 })
      .populate('applicantCount') // Kích hoạt Virtual field
      .lean()

    return NextResponse.json({ success: true, data: rounds })
  } catch (error: any) {
    console.error('Lỗi GET AdmissionRounds:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const user = session.user as SessionUser
    if (!hasPermission(user.role, 'admission:edit')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()

    // Validate
    if (!data.name || !data.level || !data.openDate || !data.closeDate || !data.quota) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    await connectToDatabase()
    
    const newRound = await AdmissionRound.create(data)

    return NextResponse.json({ success: true, data: newRound })
  } catch (error: any) {
    console.error('Lỗi POST AdmissionRounds:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
