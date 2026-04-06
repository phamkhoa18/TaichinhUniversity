import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { auth } from '@/auth'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request, context: any) {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Require ADMIN.' }, { status: 403 })
    }

    const { id } = context.params
    const { email, name, role, password } = await req.json()

    if (!email || !name || !role) {
      return NextResponse.json({ success: false, error: 'Vui lòng điền đủ thông tin bắt buộc' }, { status: 400 })
    }

    await connectToDatabase()

    // Check if email belongs to someone else
    const existingEmail = await User.findOne({ email, _id: { $ne: id } })
    if (existingEmail) {
      return NextResponse.json({ success: false, error: 'Email đã được sử dụng bởi người dùng khác' }, { status: 400 })
    }

    const updateData: any = { email, name, role }

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      updateData.passwordHash = await bcrypt.hash(password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash')
    if (!updatedUser) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Require ADMIN.' }, { status: 403 })
    }

    const { id } = context.params
    await connectToDatabase()

    if (session.user.id === id) {
      return NextResponse.json({ success: false, error: 'Không thể xóa chính tài khoản bạn đang đăng nhập' }, { status: 400 })
    }

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: deletedUser })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
