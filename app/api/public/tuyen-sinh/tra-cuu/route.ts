import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Applicant from '@/models/Applicant'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roundId = searchParams.get('roundId')
    const query = searchParams.get('q')

    if (!roundId || !query) {
      return NextResponse.json({ success: false, error: 'Vui lòng cung cấp đợt đăng ký và thông tin tra cứu.' }, { status: 400 })
    }

    await connectToDatabase()

    // Query builder
    const queryTrim = query.trim()
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(queryTrim)
    const filter: any = { roundId }
    
    const searchConditions: any[] = [
      { idCard: queryTrim },
      { phone: queryTrim },
      { email: { $regex: `^${queryTrim}$`, $options: 'i' } },
      { fullName: { $regex: queryTrim, $options: 'i' } }
    ]

    if (isValidObjectId) {
      searchConditions.push({ _id: queryTrim })
    }

    filter.$or = searchConditions

    const applicants = await Applicant.find(filter)
      .select('_id fullName dateOfBirth gender idCard status programId createdAt phone email')
      .lean()

    return NextResponse.json({ success: true, data: applicants })

  } catch (error: any) {
    console.error('Lỗi tra cứu:', error)
    return NextResponse.json({ success: false, error: 'Đã có lỗi xảy ra.' }, { status: 500 })
  }
}
