import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'
import { auth } from '@/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { id } = await params
    const body = await req.json()
    delete body._id

    const reg = await ShortCourseRegistration.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!reg) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: reg })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { id } = await params
    const reg = await ShortCourseRegistration.findByIdAndDelete(id)
    if (!reg) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
