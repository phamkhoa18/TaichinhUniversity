import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    const total = await Lead.countDocuments(query);

    return NextResponse.json({ success: true, data: leads, total }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi tải danh sách' },
      { status: 500 }
    );
  }
}
