// ============================================================
// API — GET /api/public/settings
// Trả settings cho trang công khai (không cần đăng nhập)
// KHÔNG trả SMTP password, không trả security settings
// ============================================================

import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { getSettings } from '@/models/SiteSetting'

export const dynamic = 'force-dynamic' // không cache — luôn lấy mới nhất
export const revalidate = 0

export async function GET() {
  try {
    await connectToDatabase()
    const settings = await getSettings()
    const data = settings.toObject()

    // Chỉ trả các trường cần cho public website
    // KHÔNG trả: email.smtpPassword, security, email.templates
    return NextResponse.json({
      success: true,
      data: {
        general: data.general,
        contact: data.contact,
        socialLinks: (data.socialLinks || []).filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order),
        seo: {
          defaultTitle: data.seo?.defaultTitle,
          metaDescription: data.seo?.metaDescription,
          metaKeywords: data.seo?.metaKeywords,
          ogImage: data.seo?.ogImage,
          ogTitle: data.seo?.ogTitle,
          ogDescription: data.seo?.ogDescription,
          canonicalUrl: data.seo?.canonicalUrl,
          googleAnalyticsId: data.seo?.googleAnalyticsId,
          googleTagManagerId: data.seo?.googleTagManagerId,
          facebookPixelId: data.seo?.facebookPixelId,
        },
        maintenance: {
          enabled: data.maintenance?.enabled,
          title: data.maintenance?.title,
          message: data.maintenance?.message,
          estimatedEnd: data.maintenance?.estimatedEnd,
          allowAdmin: data.maintenance?.allowAdmin,
        },
        appearance: data.appearance,
        footer: data.footer,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
