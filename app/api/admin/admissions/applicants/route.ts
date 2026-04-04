import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Applicant from '@/models/Applicant'
import AdmissionRound from '@/models/AdmissionRound'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { SessionUser } from '@/types/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const user = session.user as SessionUser
    if (!hasPermission(user.role, 'admission:read')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const roundId = searchParams.get('roundId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    await connectToDatabase()

    const filter: any = {}
    if (status && status !== 'all') filter.status = status
    if (roundId && roundId !== 'all') filter.roundId = roundId
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
        .populate('roundId', 'name level')
        .lean(),
      Applicant.countDocuments(filter),
    ])

    // Status counts
    const mongoose = require('mongoose')
    const matchFilter: any = {}
    if (roundId && roundId !== 'all') matchFilter.roundId = new mongoose.Types.ObjectId(roundId)
    
    const allCounts = await Applicant.aggregate([
      ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const counts: any = { total: 0, PENDING: 0, QUALIFIED: 0, ADMITTED: 0, NOT_QUALIFIED: 0, REJECTED: 0 }
    allCounts.forEach((c: any) => { counts[c._id] = c.count; counts.total += c.count })

    // Also return rounds list for filter dropdown
    const rounds = await AdmissionRound.find().sort({ openDate: -1 }).select('name level').lean()

    return NextResponse.json({
      success: true,
      data: applicants,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      counts,
      rounds,
    })
  } catch (error: any) {
    console.error('GET all applicants:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
