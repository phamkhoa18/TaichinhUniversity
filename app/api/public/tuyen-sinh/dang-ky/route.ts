import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import AdmissionRound from '@/models/AdmissionRound'
import Applicant from '@/models/Applicant'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const required = ['roundId', 'programId', 'fullName', 'dateOfBirth', 'gender', 'idCard', 'phone', 'email', 'address', 'province', 'degreeSchool', 'degreeMajor', 'degreeYear']
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({
          success: false,
          error: `Thiếu thông tin bắt buộc: ${field}`
        }, { status: 400 })
      }
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ success: false, error: 'Email không hợp lệ' }, { status: 400 })
    }

    // Validate phone (VN)
    if (!/^(0|\+84)[0-9]{9,10}$/.test(data.phone.replace(/\s/g, ''))) {
      return NextResponse.json({ success: false, error: 'Số điện thoại không hợp lệ' }, { status: 400 })
    }

    await connectToDatabase()

    // Check round exists and is OPEN
    const round = await AdmissionRound.findById(data.roundId)
    if (!round) {
      return NextResponse.json({ success: false, error: 'Đợt tuyển sinh không tồn tại' }, { status: 404 })
    }

    const now = new Date()
    if (now < round.openDate || now > round.closeDate) {
      return NextResponse.json({ success: false, error: 'Đợt tuyển sinh này chưa mở hoặc đã hết hạn đăng ký' }, { status: 400 })
    }

    // Check duplicate
    const existing = await Applicant.findOne({
      roundId: data.roundId,
      programId: data.programId,
      idCard: data.idCard,
    })

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Bạn đã nộp hồ sơ cho ngành này trong đợt tuyển sinh này rồi. Mỗi thí sinh chỉ được nộp 1 hồ sơ/đợt/ngành.'
      }, { status: 409 })
    }

    const applicant = await Applicant.create({
      ...data,
      status: 'PENDING',
      otherFiles: data.otherFiles || [],
    })

    return NextResponse.json({ success: true, data: { id: applicant._id } }, { status: 201 })
  } catch (error: any) {
    console.error('POST public dang-ky:', error)
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Bạn đã nộp hồ sơ cho ngành này rồi' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }, { status: 500 })
  }
}
