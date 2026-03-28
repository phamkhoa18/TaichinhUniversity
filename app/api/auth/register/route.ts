import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import User from '@/models/User'
import { hashPassword } from '@/lib/auth/passwordUtils'
import { Role } from '@/types/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Validate request
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    // Kết nối database
    await connectToDatabase()

    // Query xem email bị trùng chưa
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email này đã tồn tại trong hệ thống' },
        { status: 422 }
      )
    }

    // Mã hóa mật khẩu
    const passwordHash = await hashPassword(password)

    // Tạo user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role as Role,
    })

    return NextResponse.json(
      { message: 'Tạo tài khoản thành công!', user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration Error:', error)
    return NextResponse.json(
      { message: 'Lỗi server! Không thể tạo tài khoản lúc này.' },
      { status: 500 }
    )
  }
}
