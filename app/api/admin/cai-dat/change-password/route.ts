// ============================================================
// API — POST /api/admin/cai-dat/change-password
// Đổi mật khẩu Admin
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import User from '@/models/User'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'

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
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Vui lòng điền đầy đủ' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Mật khẩu mới phải ít nhất 6 ký tự' }, { status: 400 })
    }

    // Lấy user hiện tại
    const dbUser = await User.findById(user.id)
    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tài khoản' }, { status: 404 })
    }

    // Verify mật khẩu cũ
    const isMatch = await bcrypt.compare(currentPassword, dbUser.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(12)
    const newHash = await bcrypt.hash(newPassword, salt)

    dbUser.passwordHash = newHash
    await dbUser.save()

    return NextResponse.json({ success: true, message: 'Đã đổi mật khẩu thành công' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
