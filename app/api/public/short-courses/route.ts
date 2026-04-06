import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourse from '@/models/ShortCourse'

// GET: Public list of OPEN courses
export async function GET() {
  try {
    await connectToDatabase()
    const courses = await ShortCourse.find({ status: 'OPEN' })
      .sort({ isHot: -1, order: 1, createdAt: -1 })
      .lean()
    return NextResponse.json({ success: true, data: courses })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
