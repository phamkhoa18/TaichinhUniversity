import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import EducationLevel from '@/models/EducationLevel';
import { auth } from '@/auth';

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const levels = await EducationLevel.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: levels });
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
    const { name, description, order, active } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Tên cấp bậc là bắt buộc' }, { status: 400 });
    }

    const slug = slugify(name);
    
    // Check if slug exists
    const existing = await EducationLevel.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Cấp bậc với slug này đã tồn tại' }, { status: 400 });
    }

    const newLevel = new EducationLevel({
      name,
      slug,
      description,
      order: order || 0,
      active: active !== undefined ? active : true
    });

    await newLevel.save();

    return NextResponse.json({ success: true, data: newLevel });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
