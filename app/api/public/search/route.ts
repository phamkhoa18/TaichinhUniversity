import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/models/News';
import TrainingProgram from '@/models/TrainingProgram';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim() === '') {
      return NextResponse.json({ success: true, data: [] });
    }

    await connectDB();

    const searchRegex = new RegExp(q, 'i');
    
    // Tìm kiếm trong News (Tin tức, Sự kiện, Tuyển sinh...)
    const newsResults = await News.find({
      title: { $regex: searchRegex },
      status: 'PUBLISHED'
    })
      .select('title slug')
      .populate('category', 'name slug')
      .limit(10)
      .lean();

    // Tìm kiếm trong Chương trình đào tạo
    const programResults = await TrainingProgram.find({
      name: { $regex: searchRegex },
      status: 'PUBLISHED'
    })
      .select('name slug')
      .limit(5)
      .lean();

    // Chuẩn hóa kết quả
    const results: { title: string; category: string; href: string }[] = [];

    // Map programs
    programResults.forEach((p: any) => {
      results.push({
        title: p.name,
        category: 'Đào tạo',
        href: `/chuong-trinh-dao-tao/${p.slug}`,
      });
    });

    // Map news
    newsResults.forEach((n: any) => {
      results.push({
        title: n.title,
        category: n.category?.name || 'Tin tức',
        href: `/news/${n.slug}`,
      });
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Search Error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
