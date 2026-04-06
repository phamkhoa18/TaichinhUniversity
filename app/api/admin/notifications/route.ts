import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { auth } from '@/auth'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'
import News from '@/models/News'
import Applicant from '@/models/Applicant'
import Lead from '@/models/Lead'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()

    // Parallelize all counts
    const [
      pendingRegistrations,
      draftNews,
      pendingApplicants,
      recentRegistrations,
      recentApplicants,
      newLeadsCount,
      recentLeads,
    ] = await Promise.all([
      ShortCourseRegistration.countDocuments({ paymentStatus: 'PENDING' }),
      News.countDocuments({ status: 'DRAFT' }),
      Applicant.countDocuments({ status: 'PENDING' }),
      ShortCourseRegistration.find({ paymentStatus: 'PENDING' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('courses', 'title code')
        .lean(),
      Applicant.find({ status: 'PENDING' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Lead.countDocuments({ status: 'New', isRead: { $ne: true } }),
      Lead.find({ status: 'New', isRead: { $ne: true } }).sort({ createdAt: -1 }).limit(5).lean(),
    ])

    // Build notifications list
    const notifications: any[] = []

    // CRM Leads notifications
    for (const lead of recentLeads) {
      notifications.push({
        id: `lead-${lead._id}`,
        type: 'lead',
        title: `${lead.fullName} sử dụng Chatbot AI`,
        description: `Score: ${lead.aiAnalysis?.score || 0}/10 — Đang chờ liên hệ`,
        time: lead.createdAt,
        read: false,
        href: '/admin/khach-hang-tiem-nang',
        icon: 'MessageSquare',
        color: 'amber',
      })
    }

    // Pending registration notifications
    for (const reg of recentRegistrations) {
      notifications.push({
        id: `reg-${reg._id}`,
        type: 'registration',
        title: `${reg.lastName} ${reg.firstName} đăng ký ĐTNH`,
        description: `${(reg.courses as any[])?.map((c: any) => c.code).join(', ')} — Chờ thanh toán`,
        time: reg.createdAt,
        read: false,
        href: '/admin/dao-tao-ngan-han/dang-ky',
        icon: 'UserPlus',
        color: 'blue',
      })
    }

    // Pending applicant notifications
    for (const app of recentApplicants) {
      notifications.push({
        id: `app-${app._id}`,
        type: 'applicant',
        title: `${app.fullName} nộp hồ sơ tuyển sinh`,
        description: `${app.degreeMajor} — Chờ xét duyệt`,
        time: app.createdAt,
        read: false,
        href: '/admin/tuyen-sinh/ho-so',
        icon: 'GraduationCap',
        color: 'green',
      })
    }

    // Draft news notification (summary)
    if (draftNews > 0) {
      notifications.push({
        id: 'draft-news',
        type: 'info',
        title: `${draftNews} bài viết nháp`,
        description: 'Có bài viết đang ở trạng thái bản nháp chờ công khai.',
        time: new Date(),
        read: true,
        href: '/admin/thong-bao',
        icon: 'FileText',
        color: 'amber',
      })
    }

    // Sort by time
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    // Badge counts for sidebar
    const badges: Record<string, number> = {}
    if (pendingRegistrations > 0) badges['/admin/dao-tao-ngan-han'] = pendingRegistrations
    if (draftNews > 0) badges['/admin/thong-bao'] = draftNews
    if (pendingApplicants > 0) badges['/admin/tuyen-sinh'] = pendingApplicants
    if (newLeadsCount > 0) badges['/admin/khach-hang-tiem-nang'] = newLeadsCount

    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      success: true,
      data: {
        notifications: notifications.slice(0, 15),
        badges,
        unreadCount,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
