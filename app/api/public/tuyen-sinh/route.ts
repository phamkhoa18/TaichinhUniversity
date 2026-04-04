import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import AdmissionRound from '@/models/AdmissionRound'
import TrainingProgram from '@/models/TrainingProgram'
import '@/models/Applicant'
import '@/models/EducationLevel'

export async function GET() {
  try {
    await connectToDatabase()

    // Auto-update status based on current date
    const now = new Date()
    await AdmissionRound.updateMany(
      { openDate: { $lte: now }, closeDate: { $gte: now }, status: { $ne: 'OPEN' } },
      { $set: { status: 'OPEN' } }
    )
    await AdmissionRound.updateMany(
      { closeDate: { $lt: now }, status: { $ne: 'CLOSED' } },
      { $set: { status: 'CLOSED' } }
    )
    await AdmissionRound.updateMany(
      { openDate: { $gt: now }, status: { $ne: 'UPCOMING' } },
      { $set: { status: 'UPCOMING' } }
    )

    const rounds = await AdmissionRound.find({ status: { $in: ['OPEN', 'UPCOMING'] } })
      .sort({ openDate: 1 })
      .populate('applicantCount')
      .lean()

    // Also fetch published training programs for form reference
    const programs = await TrainingProgram.find({ status: 'PUBLISHED' })
      .select('name slug level type faculty programCode')
      .populate('level', 'name slug')
      .lean()

    return NextResponse.json({ success: true, data: { rounds, programs } })
  } catch (error: any) {
    console.error('GET public tuyen-sinh:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
