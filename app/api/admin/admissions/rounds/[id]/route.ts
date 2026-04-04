import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import AdmissionRound from '@/models/AdmissionRound'
import '@/models/Applicant'
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

    const round = await AdmissionRound.findById(id)
      .populate('applicantCount')
      .lean()

    if (!round) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đợt tuyển sinh' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: round })
  } catch (error: any) {
    console.error('GET AdmissionRound [id]:', error)
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

    const updated = await AdmissionRound.findByIdAndUpdate(id, data, { new: true, runValidators: true })

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đợt tuyển sinh' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('PUT AdmissionRound [id]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(
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
    await connectToDatabase()

    await AdmissionRound.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE AdmissionRound [id]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
