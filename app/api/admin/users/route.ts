import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { auth } from '@/auth'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Require ADMIN.' }, { status: 403 })
    }

    await connectToDatabase()
    const users = await User.find({}).sort({ createdAt: -1 }).select('-passwordHash').lean()

    return NextResponse.json({ success: true, data: users })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Require ADMIN.' }, { status: 403 })
    }

    const { email, name, role, password } = await req.json()
    if (!email || !name || !role || !password) {
      return NextResponse.json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
    }

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email đã tồn tại trong hệ thống' }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      email,
      name,
      role,
      passwordHash,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    })

    const sanitizedUser = newUser.toObject()
    delete (sanitizedUser as any).passwordHash

    return NextResponse.json({ success: true, data: sanitizedUser }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
