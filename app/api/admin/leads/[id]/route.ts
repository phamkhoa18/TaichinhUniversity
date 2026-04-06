import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, isRead } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    if (!lead) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 });

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Lỗi xóa' }, { status: 500 });
  }
}
