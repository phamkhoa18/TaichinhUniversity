import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourse from '@/models/ShortCourse'
import { auth } from '@/auth'

// GET: Danh sách khóa học (paginated + search)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const query: any = {}
    if (search) query.title = { $regex: search, $options: 'i' }
    if (status) query.status = status

    const total = await ShortCourse.countDocuments(query)
    const courses = await ShortCourse.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({ success: true, data: courses, total, totalPages: Math.ceil(total / limit) })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: Tạo khóa học mới
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()

    if (!body.title || !body.code || !body.slug) {
      return NextResponse.json({ success: false, error: 'Tên, mã lớp và slug là bắt buộc' }, { status: 400 })
    }

    const course = await ShortCourse.create(body)
    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Mã lớp hoặc slug đã tồn tại' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
