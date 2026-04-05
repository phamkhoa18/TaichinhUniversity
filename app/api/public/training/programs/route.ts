import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import TrainingProgram from '@/models/TrainingProgram';
import '@/models/EducationLevel';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const programs = await TrainingProgram.find({ status: 'PUBLISHED' })
        .populate('level', 'name')
        .sort({ createdAt: -1 })
        .lean();

    // Map to the shape expected by the frontend
    const mapped = programs.map(p => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      level: (p.level as any)?.name || 'Vô danh',
      faculty: p.faculty || 'Viện Sau đại học',
      degree: p.degreeIssued || p.name,
      type: p.type || 'Tiêu chuẩn',
      thumbnail: p.thumbnail || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop'
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch public programs' }, { status: 500 });
  }
}
