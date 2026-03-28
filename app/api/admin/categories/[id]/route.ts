import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Category from '@/models/Category'

// PUT: Cập nhật danh mục
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await req.json()
    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!category) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: category })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE: Xóa danh mục
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const category = await Category.findByIdAndDelete(id)
    if (!category) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Đã xóa' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
