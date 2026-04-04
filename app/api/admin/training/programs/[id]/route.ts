import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import TrainingProgram from '@/models/TrainingProgram';
import '@/models/EducationLevel';
import { auth } from '@/auth';

import slugify from 'slugify';

function generateSlug(text: string) {
  return slugify(text, { lower: true, strict: true, locale: 'vi' });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;
      await connectToDatabase();
      const program = await TrainingProgram.findById(id).populate('level', 'name slug');
      if (!program) return NextResponse.json({ success: false, error: 'Không tìm thấy chương trình' }, { status: 404 });
      return NextResponse.json({ success: true, data: program });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const { name, _id, createdAt, updatedAt, __v, slug: _, ...otherFields } = body;

    const updateData: any = { ...otherFields };
    if (name) {
        updateData.name = name;
        updateData.slug = generateSlug(name);
    }

    const updated = await TrainingProgram.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ success: false, error: 'Không tìm thấy dữ liệu' }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    
    await TrainingProgram.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
