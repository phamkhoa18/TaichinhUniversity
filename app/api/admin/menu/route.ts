// ============================================================
// API — GET / POST / PUT / DELETE /api/admin/menu
// CRUD menu items
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import MenuItem from '@/models/MenuItem'
import { auth } from '@/auth'

// GET: Lấy tất cả menu items (đã sắp xếp)
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    await connectToDatabase()
    const items = await MenuItem.find().sort({ order: 1 }).lean()

    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: Tạo mới menu item
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()

    // Auto-increment order
    const maxOrder = await MenuItem.findOne().sort({ order: -1 }).select('order').lean()
    const newOrder = (maxOrder?.order ?? -1) + 1

    const item = await MenuItem.create({
      label: body.label || 'Menu mới',
      href: body.href || '#',
      type: body.type || 'link',
      target: body.target || '_self',
      enabled: body.enabled !== false,
      order: body.order ?? newOrder,
      groups: body.groups || [],
      overview: body.overview || { label: '', href: '' },
      promo: body.promo || { title: '', desc: '', cta: '', href: '#' },
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT: Cập nhật menu item hoặc bulk reorder
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()

    // Bulk reorder
    if (body.reorder && Array.isArray(body.items)) {
      const bulkOps = body.items.map((item: { _id: string; order: number }) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { order: item.order } },
        },
      }))
      await MenuItem.bulkWrite(bulkOps)
      return NextResponse.json({ success: true, message: 'Đã sắp xếp lại menu' })
    }

    // Single update
    const { _id, ...updateData } = body
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Thiếu _id' }, { status: 400 })
    }

    const updated = await MenuItem.findByIdAndUpdate(_id, updateData, { new: true })
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy menu' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE: Xóa menu item
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id' }, { status: 400 })
    }

    await MenuItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Đã xóa menu' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
