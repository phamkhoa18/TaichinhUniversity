import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'
import '@/models/ShortCourse'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const courseId = searchParams.get('courseId') || ''
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const query: any = {}
    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { registrationCode: { $regex: search, $options: 'i' } },
      ]
    }
    if (status) query.paymentStatus = status
    if (courseId) query.courses = courseId

    const total = await ShortCourseRegistration.countDocuments(query)
    const registrations = await ShortCourseRegistration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('courses', 'title code price')
      .lean()

    return NextResponse.json({ success: true, data: registrations, total, totalPages: Math.ceil(total / limit) })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
