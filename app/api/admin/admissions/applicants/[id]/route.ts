import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import Applicant from '@/models/Applicant'
import AdmissionRound from '@/models/AdmissionRound'
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

    const { id } = await params
    await connectToDatabase()

    const applicant = await Applicant.findById(id)
      .populate('roundId', 'name level openDate closeDate status')
      .populate('reviewedBy', 'name email')
      .lean()

    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hồ sơ' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: applicant })
  } catch (error: any) {
    console.error('GET Applicant [id]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const user = session.user as SessionUser
    if (!hasPermission(user.role, 'admission:edit')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()
    await connectToDatabase()

    // If updating status, stamp reviewer info
    if (data.status) {
      data.reviewedBy = (user as any).id || (user as any)._id
      data.reviewedAt = new Date()
    }

    const updated = await Applicant.findByIdAndUpdate(id, data, { new: true })

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hồ sơ' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('PUT Applicant [id]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
