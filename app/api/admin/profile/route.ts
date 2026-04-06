import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { auth } from '@/auth'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { name, newPassword } = await req.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Họ tên không được để trống' }, { status: 400 })
    }

    await connectToDatabase()

    const updateData: any = { name: name.trim() }

    // Chỉ cập nhật avatar nếu tên thay đổi vì đang dùng api của ui-avatars. 
    // Mình sẽ tạo avatar ngẫu nhiên mới nếu họ sửa tên.
    updateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=random`

    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
      }
      const salt = await bcrypt.genSalt(10)
      updateData.passwordHash = await bcrypt.hash(newPassword, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(session.user.id, updateData, { new: true }).select('-passwordHash')
    
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tài khoản để cập nhật' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
