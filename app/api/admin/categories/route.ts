import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Category from '@/models/Category'

// GET: Lấy tất cả danh mục
export async function GET() {
  try {
    await connectToDatabase()
    const categories = await Category.find().sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: Tạo danh mục mới
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: 'Tên và slug là bắt buộc' }, { status: 400 })
    }

    const category = await Category.create(body)
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Danh mục đã tồn tại' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
