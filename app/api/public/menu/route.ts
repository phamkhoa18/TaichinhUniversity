// ============================================================
// API — GET /api/public/menu
// Trả menu cho trang công khai (không cần đăng nhập)
// Chỉ trả các item enabled=true, đã sort theo order
// ============================================================

import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import MenuItem from '@/models/MenuItem'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    await connectToDatabase()
    const items = await MenuItem.find({ enabled: true }).sort({ order: 1 }).lean()

    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
