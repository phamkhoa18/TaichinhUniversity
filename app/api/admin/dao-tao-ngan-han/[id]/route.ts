import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourse from '@/models/ShortCourse'
import { auth } from '@/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const course = await ShortCourse.findById(id).lean()
    if (!course) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: course })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { id } = await params
    const body = await req.json()
    delete body._id

    const course = await ShortCourse.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!course) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: course })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Mã lớp hoặc slug đã tồn tại' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { id } = await params
    const course = await ShortCourse.findByIdAndDelete(id)
    if (!course) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
