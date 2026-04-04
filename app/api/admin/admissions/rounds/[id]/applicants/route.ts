import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Applicant from '@/models/Applicant'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { SessionUser } from '@/types/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const user = session.user as SessionUser
    if (!hasPermission(user.role, 'admission:read')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id: roundId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    await connectToDatabase()

    const filter: any = { roundId }
    if (status && status !== 'all') filter.status = status
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { idCard: { $regex: search, $options: 'i' } },
      ]
    }

    const [applicants, total] = await Promise.all([
      Applicant.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Applicant.countDocuments(filter),
    ])

    // Status counts for the round
    const statusCounts = await Applicant.aggregate([
      { $match: { roundId: applicants.length > 0 ? applicants[0].roundId : null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    // Rebuild using roundId from params
    const mongoose = require('mongoose')
    const allCounts = await Applicant.aggregate([
      { $match: { roundId: new mongoose.Types.ObjectId(roundId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const counts = {
      total: 0,
      PENDING: 0,
      QUALIFIED: 0,
      ADMITTED: 0,
      NOT_QUALIFIED: 0,
      REJECTED: 0,
    }
    allCounts.forEach((c: any) => {
      counts[c._id as keyof typeof counts] = c.count
      counts.total += c.count
    })

    return NextResponse.json({
      success: true,
      data: applicants,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      counts,
    })
  } catch (error: any) {
    console.error('GET Applicants for round:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
