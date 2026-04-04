import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import TrainingProgram from '@/models/TrainingProgram';
import '@/models/EducationLevel';
import { auth } from '@/auth';

import slugify from 'slugify';

function generateSlug(text: string) {
  return slugify(text, { lower: true, strict: true, locale: 'vi' });
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // support filtering by status or level if query params exist
    const { searchParams } = new URL(req.url);
    const levelId = searchParams.get('level');
    
    let filter: any = {};
    if (levelId && levelId !== 'all') filter.level = levelId;

    const programs = await TrainingProgram.find(filter)
        .populate('level', 'name slug')
        .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: programs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { name, level, status, _id, createdAt, updatedAt, __v, slug: _, ...otherFields } = body;

    if (!name || !level) {
      return NextResponse.json({ success: false, error: 'Tên và Bậc học là bắt buộc' }, { status: 400 });
    }

    const slug = generateSlug(name);
    const existing = await TrainingProgram.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Chương trình với tên/slug này đã tồn tại' }, { status: 400 });
    }

    const newProgram = new TrainingProgram({
      name,
      slug,
      level,
      status: status || 'DRAFT',
      ...otherFields
    });

    await newProgram.save();

    return NextResponse.json({ success: true, data: newProgram });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
