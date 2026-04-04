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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const { name, description, order, active } = body;

    const updateData: any = { description, order, active };
    if (name) {
        updateData.name = name;
        updateData.slug = slugify(name);
    }

    const updated = await EducationLevel.findByIdAndUpdate(id, updateData, { new: true });
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
    
    // TODO: Verify if any training programs are linked to this level before deleting

    await EducationLevel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
