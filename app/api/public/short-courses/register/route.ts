import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourse from '@/models/ShortCourse'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const { lastName, firstName, phone, email, workplace, birthDate, courseIds } = body

    if (!lastName || !firstName || !phone || !email) {
      return NextResponse.json({ success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' }, { status: 400 })
    }
    if (!courseIds || courseIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Vui lòng chọn ít nhất 1 lớp' }, { status: 400 })
    }

    // Verify courses exist and are OPEN
    const courses = await ShortCourse.find({ _id: { $in: courseIds }, status: 'OPEN' })
    if (courses.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy lớp học hợp lệ' }, { status: 400 })
    }

    // Calculate total fee
    const totalFee = courses.reduce((sum, c) => sum + (c.price || 0), 0)

    // Create registration
    const registration = await ShortCourseRegistration.create({
      lastName,
      firstName,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      workplace: workplace || '',
      birthDate: birthDate || undefined,
      courses: courses.map(c => c._id),
      totalFee,
      paymentStatus: 'PENDING',
    })

    // Increment currentStudents on each course
    await ShortCourse.updateMany(
      { _id: { $in: courses.map(c => c._id) } },
      { $inc: { currentStudents: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: {
        registrationCode: registration.registrationCode,
        totalFee,
        coursesCount: courses.length,
      },
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
