// ============================================================
// API — POST /api/admin/menu/seed
// Seed menu từ hardcoded Header data (chạy 1 lần)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import MenuItem from '@/models/MenuItem'
import { auth } from '@/auth'

const DEFAULT_MENU = [
  {
    label: 'Giới thiệu',
    href: '#',
    type: 'mega' as const,
    enabled: true,
    order: 0,
    overview: { label: 'Tổng quan', href: '/gioi-thieu' },
    groups: [
      {
        title: 'Về UFM',
        order: 0,
        links: [
          { label: 'Tổng quan', href: '/gioi-thieu', order: 0 },
          { label: 'Cơ cấu tổ chức', href: '/gioi-thieu/co-cau-to-chuc', order: 1 },
          { label: 'Thành tựu nổi bật', href: '#', order: 2 },
          { label: 'Cơ sở vật chất', href: '#', order: 3 },
        ],
      },
      {
        title: 'Hợp tác',
        order: 1,
        links: [
          { label: 'Đối tác trong nước', href: '#', order: 0 },
          { label: 'Đối tác quốc tế', href: '#', order: 1 },
          { label: 'Doanh nghiệp', href: '#', order: 2 },
        ],
      },
    ],
    promo: {
      title: 'Trường Đại học Tài chính – Marketing',
      desc: '50 năm xây dựng và phát triển, đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực tài chính, ngân hàng, marketing và quản trị kinh doanh.',
      cta: 'Tìm hiểu thêm về UFM',
      href: '#',
    },
  },
  {
    label: 'Đào tạo',
    href: '#',
    type: 'mega' as const,
    enabled: true,
    order: 1,
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      {
        title: 'Chương trình đào tạo',
        order: 0,
        links: [
          { label: 'Đại học chính quy', href: '#', order: 0 },
          { label: 'Sau đại học', href: '#', order: 1 },
          { label: 'Chương trình quốc tế', href: '#', order: 2 },
          { label: 'Đào tạo ngắn hạn', href: '#', order: 3 },
        ],
      },
      {
        title: 'Tuyển sinh',
        order: 1,
        links: [
          { label: 'Thông tin tuyển sinh', href: '#', order: 0 },
          { label: 'Điều kiện xét tuyển', href: '#', order: 1 },
          { label: 'Đăng ký trực tuyến', href: '#', order: 2 },
        ],
      },
    ],
    promo: {
      title: 'Các Trường & Khối đào tạo',
      desc: 'Trường Đại học Tài chính – Marketing đào tạo đa ngành với chương trình đạt chuẩn quốc tế.',
      cta: 'Xem toàn bộ ngành đào tạo',
      href: '#',
    },
  },
  {
    label: 'Sinh viên',
    href: '#',
    type: 'mega' as const,
    enabled: true,
    order: 2,
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      {
        title: 'Học tập',
        order: 0,
        links: [
          { label: 'Lịch học & Thi', href: '#', order: 0 },
          { label: 'Hoạt động NCKH', href: '#', order: 1 },
          { label: 'Thư viện & Tài liệu', href: '#', order: 2 },
        ],
      },
      {
        title: 'Đời sống',
        order: 1,
        links: [
          { label: 'CLB & Đoàn thể', href: '#', order: 0 },
          { label: 'Ký túc xá', href: '#', order: 1 },
          { label: 'Học bổng', href: '#', order: 2 },
        ],
      },
    ],
    promo: {
      title: 'Đời sống Sinh viên UFM',
      desc: 'Trải nghiệm môi trường học tập năng động, sáng tạo.',
      cta: 'Khám phá đời sống sinh viên',
      href: '#',
    },
  },
  {
    label: 'Nghiên cứu khoa học',
    href: '#',
    type: 'mega' as const,
    enabled: true,
    order: 3,
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      {
        title: 'Nghiên cứu khoa học tại UFM',
        order: 0,
        links: [
          { label: 'Lĩnh vực nghiên cứu tập trung', href: '#', order: 0 },
          { label: 'Công bố khoa học', href: '#', order: 1 },
        ],
      },
      {
        title: 'Các thông tin khác',
        order: 1,
        links: [
          { label: 'Cơ sở vật chất & Phòng thí nghiệm', href: '#', order: 0 },
          { label: 'Dự án nghiên cứu', href: '#', order: 1 },
          { label: 'Hội đồng Đạo đức', href: '#', order: 2 },
          { label: 'Đơn vị nghiên cứu', href: '#', order: 3 },
        ],
      },
    ],
    promo: {
      title: 'Nghiên cứu tại UFM',
      desc: 'Trường có hệ thống phòng thí nghiệm hiện đại và đội ngũ giảng viên với năng lực nghiên cứu hàng đầu.',
      cta: 'Tìm hiểu thêm',
      href: '#',
    },
  },
  {
    label: 'Tin tức',
    href: '/news',
    type: 'link' as const,
    enabled: true,
    order: 4,
    groups: [],
    overview: { label: '', href: '' },
    promo: { title: '', desc: '', cta: '', href: '#' },
  },
  {
    label: 'Liên hệ',
    href: '/lien-he',
    type: 'link' as const,
    enabled: true,
    order: 5,
    groups: [],
    overview: { label: '', href: '' },
    promo: { title: '', desc: '', cta: '', href: '#' },
  },
]

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()

    // Kiểm tra đã có menu chưa
    const count = await MenuItem.countDocuments()
    if (count > 0) {
      return NextResponse.json({
        success: false,
        error: `Đã có ${count} menu items. Xóa hết rồi seed lại nếu muốn.`,
      }, { status: 400 })
    }

    await MenuItem.insertMany(DEFAULT_MENU)

    return NextResponse.json({
      success: true,
      message: `Đã tạo ${DEFAULT_MENU.length} menu items mặc định`,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
