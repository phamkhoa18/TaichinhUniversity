// ============================================================
// MODEL — SiteSetting (Single Document Pattern)
// Lưu toàn bộ cài đặt hệ thống trong 1 document duy nhất
// ============================================================

import mongoose, { Document, Model, Schema } from 'mongoose'

// ---- Sub-schemas ----

const socialLinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false })

const emailTemplateSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, default: '' },
  body: { type: String, default: '' },
  variables: [{ type: String }],
}, { _id: true })

// ---- Main Interface ----

export interface ISiteSetting extends Document {
  // Tab 1: Thông tin chung
  general: {
    nameVi: string
    nameEn: string
    shortName: string
    parentOrg: string
    foundedYear: number
    logo: string
    favicon: string
    descriptionVi: string
    descriptionEn: string
    slogan: string
    copyright: string
  }

  // Tab 2: Liên hệ
  contact: {
    address: string
    address2: string
    phone: string
    hotline: string
    email: string
    admissionEmail: string
    fax: string
    workingHours: string
    googleMapsUrl: string
    latitude: string
    longitude: string
  }

  // Tab 3: Mạng xã hội
  socialLinks: Array<{
    platform: string
    url: string
    enabled: boolean
    order: number
  }>

  // Tab 4: SEO
  seo: {
    defaultTitle: string
    metaDescription: string
    metaKeywords: string[]
    ogImage: string
    ogTitle: string
    ogDescription: string
    canonicalUrl: string
    googleAnalyticsId: string
    googleTagManagerId: string
    facebookPixelId: string
    robotsTxt: string
    autoSitemap: boolean
  }

  // Tab 5: Email SMTP
  email: {
    smtpHost: string
    smtpPort: number
    smtpSecure: string
    fromEmail: string
    fromName: string
    smtpUsername: string
    smtpPassword: string
    replyToEmail: string
    templates: Array<{
      name: string
      subject: string
      body: string
      variables: string[]
    }>
  }

  // Tab 6: Bảo trì
  maintenance: {
    enabled: boolean
    title: string
    message: string
    estimatedEnd: Date | null
    allowAdmin: boolean
    whitelistIPs: string[]
  }

  // Tab 7: Bảo mật
  security: {
    maxLoginAttempts: number
    lockDurationMinutes: number
    sessionTimeoutMinutes: number
    allowMultipleSessions: boolean
    enable2FA: boolean
    autoBackup: boolean
    backupSchedule: string
  }

  // Tab 8: Giao diện
  appearance: {
    primaryColor: string
    accentColor: string
    fontFamily: string
    postsPerPage: number
    showChatbot: boolean
    showZaloChat: boolean
    showPopupNotice: boolean
    popupConfig?: {
      title: string;
      description: string;
      imageUrl: string;
      actionUrl: string;
      actionText: string;
      layout: 'image-only' | 'image-left' | 'image-top' | 'text-only';
      showOnce: boolean;
      activeDates?: {
        start: Date | null;
        end: Date | null;
      };
    }
    newsLayout: string
    defaultLanguage: string
    enableMultiLanguage: boolean
    defaultNewsImage: string
  }

  // Footer
  footer: {
    description: string
    columns: Array<{
      title: string
      links: Array<{
        label: string
        href: string
        icon: string
        order: number
      }>
      order: number
    }>
    bottomText: string
    showNewsletter: boolean
    newsletterTitle: string
    newsletterPlaceholder: string
    showMap: boolean
    mapEmbedUrl: string
  }

  updatedAt: Date
  createdAt: Date
}

// ---- Schema ----

const siteSettingSchema = new Schema<ISiteSetting>(
  {
    general: {
      nameVi: { type: String, default: 'Viện Đào tạo Sau Đại học' },
      nameEn: { type: String, default: 'Institute of Postgraduate Studies' },
      shortName: { type: String, default: 'VSDH-UFM' },
      parentOrg: { type: String, default: 'Trường Đại học Tài chính – Marketing' },
      foundedYear: { type: Number, default: 2005 },
      logo: { type: String, default: '' },
      favicon: { type: String, default: '' },
      descriptionVi: { type: String, default: '' },
      descriptionEn: { type: String, default: '' },
      slogan: { type: String, default: 'Nâng tầm tri thức — Kiến tạo tương lai' },
      copyright: { type: String, default: '© 2026 Viện ĐT Sau Đại học — UFM. All rights reserved.' },
    },

    contact: {
      address: { type: String, default: '2/4 Trần Xuân Soạn, Phường Tân Thuận Tây, Quận 7, TP.HCM' },
      address2: { type: String, default: '' },
      phone: { type: String, default: '(028) 3997 2091' },
      hotline: { type: String, default: '' },
      email: { type: String, default: 'sdh@ufm.edu.vn' },
      admissionEmail: { type: String, default: 'tuyensinh.sdh@ufm.edu.vn' },
      fax: { type: String, default: '' },
      workingHours: { type: String, default: 'Thứ 2 - Thứ 6: 7:30 - 16:30' },
      googleMapsUrl: { type: String, default: '' },
      latitude: { type: String, default: '' },
      longitude: { type: String, default: '' },
    },

    socialLinks: {
      type: [socialLinkSchema],
      default: [
        { platform: 'facebook', url: '', enabled: true, order: 0 },
        { platform: 'zalo', url: '', enabled: true, order: 1 },
        { platform: 'youtube', url: '', enabled: true, order: 2 },
        { platform: 'tiktok', url: '', enabled: false, order: 3 },
        { platform: 'linkedin', url: '', enabled: false, order: 4 },
        { platform: 'instagram', url: '', enabled: false, order: 5 },
        { platform: 'twitter', url: '', enabled: false, order: 6 },
      ],
    },

    seo: {
      defaultTitle: { type: String, default: 'Viện Đào tạo Sau Đại học — Trường ĐH Tài chính – Marketing' },
      metaDescription: { type: String, default: 'Chương trình đào tạo Thạc sĩ, Tiến sĩ tại Trường Đại học Tài chính – Marketing (UFM). Đăng ký tuyển sinh, thông tin học phí, lịch học.' },
      metaKeywords: { type: [String], default: ['sau đại học', 'thạc sĩ', 'tiến sĩ', 'UFM', 'tài chính marketing'] },
      ogImage: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      canonicalUrl: { type: String, default: 'https://daotaosdh.ufm.edu.vn' },
      googleAnalyticsId: { type: String, default: '' },
      googleTagManagerId: { type: String, default: '' },
      facebookPixelId: { type: String, default: '' },
      robotsTxt: { type: String, default: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://daotaosdh.ufm.edu.vn/sitemap.xml' },
      autoSitemap: { type: Boolean, default: true },
    },

    email: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpSecure: { type: String, default: 'TLS' },
      fromEmail: { type: String, default: '' },
      fromName: { type: String, default: 'Viện SĐH - UFM' },
      smtpUsername: { type: String, default: '' },
      smtpPassword: { type: String, default: '' },
      replyToEmail: { type: String, default: '' },
      templates: {
        type: [emailTemplateSchema],
        default: [
          {
            name: 'Xác nhận nhận hồ sơ',
            subject: '[UFM] Xác nhận tiếp nhận hồ sơ tuyển sinh',
            body: '<p>Kính gửi <strong>{{ho_ten}}</strong>,</p><p>Viện Đào tạo Sau Đại học — UFM xác nhận đã tiếp nhận hồ sơ đăng ký của bạn cho chuyên ngành <strong>{{chuyen_nganh}}</strong>.</p><p>Mã hồ sơ: <strong>{{ma_ho_so}}</strong></p><p>Chúng tôi sẽ thông báo kết quả xét duyệt trong thời gian sớm nhất.</p><p>Trân trọng,<br/>Viện Đào tạo Sau Đại học — UFM</p>',
            variables: ['ho_ten', 'chuyen_nganh', 'ma_ho_so'],
          },
          {
            name: 'Kết quả xét duyệt',
            subject: '[UFM] Kết quả xét duyệt hồ sơ tuyển sinh',
            body: '<p>Kính gửi <strong>{{ho_ten}}</strong>,</p><p>Kết quả xét duyệt hồ sơ của bạn: <strong>{{ket_qua}}</strong></p><p>{{ghi_chu}}</p><p>Trân trọng,<br/>Viện Đào tạo Sau Đại học — UFM</p>',
            variables: ['ho_ten', 'ket_qua', 'ghi_chu'],
          },
          {
            name: 'Thông báo chung',
            subject: '[UFM] {{tieu_de}}',
            body: '<p>Kính gửi <strong>{{ho_ten}}</strong>,</p><p>{{noi_dung}}</p><p>Trân trọng,<br/>Viện Đào tạo Sau Đại học — UFM</p>',
            variables: ['ho_ten', 'tieu_de', 'noi_dung'],
          },
        ],
      },
    },

    maintenance: {
      enabled: { type: Boolean, default: false },
      title: { type: String, default: 'Website đang bảo trì' },
      message: { type: String, default: 'Chúng tôi đang nâng cấp hệ thống. Vui lòng quay lại sau.' },
      estimatedEnd: { type: Date, default: null },
      allowAdmin: { type: Boolean, default: true },
      whitelistIPs: { type: [String], default: [] },
    },

    security: {
      maxLoginAttempts: { type: Number, default: 5 },
      lockDurationMinutes: { type: Number, default: 30 },
      sessionTimeoutMinutes: { type: Number, default: 480 },
      allowMultipleSessions: { type: Boolean, default: true },
      enable2FA: { type: Boolean, default: false },
      autoBackup: { type: Boolean, default: false },
      backupSchedule: { type: String, default: 'daily' },
    },

    appearance: {
      primaryColor: { type: String, default: '#005496' },
      accentColor: { type: String, default: '#FFD200' },
      fontFamily: { type: String, default: 'Plus Jakarta Sans' },
      postsPerPage: { type: Number, default: 12 },
      showChatbot: { type: Boolean, default: true },
      showZaloChat: { type: Boolean, default: false },
      showPopupNotice: { type: Boolean, default: false },
      popupConfig: {
        title: { type: String, default: 'Thông báo' },
        description: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        actionUrl: { type: String, default: '' },
        actionText: { type: String, default: 'Xem chi tiết' },
        layout: { type: String, enum: ['image-only', 'image-left', 'image-top', 'text-only'], default: 'image-top' },
        showOnce: { type: Boolean, default: true },
        activeDates: {
          start: { type: Date, default: null },
          end: { type: Date, default: null },
        },
      },
      newsLayout: { type: String, default: 'grid' },
      defaultLanguage: { type: String, default: 'vi' },
      enableMultiLanguage: { type: Boolean, default: false },
      defaultNewsImage: { type: String, default: '/images/life/bg_ufm_5.jpg' },
    },

    footer: {
      description: {
        type: String,
        default: 'Trường Đại học Tài chính – Marketing – nơi kiến tạo những chuyên gia tài chính hàng đầu, đóng góp vào sự phát triển kinh tế bền vững của đất nước.',
      },
      columns: {
        type: [
          {
            title: { type: String, required: true },
            links: [
              {
                label: { type: String, required: true },
                href: { type: String, default: '#' },
                icon: { type: String, default: '' },
                order: { type: Number, default: 0 },
              },
            ],
            order: { type: Number, default: 0 },
          },
        ],
        default: [
          {
            title: 'Liên kết nhanh',
            order: 0,
            links: [
              { label: 'Trang chủ', href: '/', icon: '', order: 0 },
              { label: 'Giới thiệu', href: '/gioi-thieu', icon: '', order: 1 },
              { label: 'Tuyển sinh', href: '/tuyen-sinh', icon: '', order: 2 },
              { label: 'Đào tạo', href: '/dao-tao', icon: '', order: 3 },
              { label: 'Tin tức', href: '/news', icon: '', order: 4 },
              { label: 'Liên hệ', href: '/lien-he', icon: '', order: 5 },
            ],
          },
          {
            title: 'Ngành đào tạo',
            order: 1,
            links: [
              { label: 'Tài chính – Ngân hàng', href: '#', icon: '', order: 0 },
              { label: 'Kế toán – Kiểm toán', href: '#', icon: '', order: 1 },
              { label: 'Fintech', href: '#', icon: '', order: 2 },
              { label: 'Quản trị Kinh doanh', href: '#', icon: '', order: 3 },
              { label: 'Kinh tế Quốc tế', href: '#', icon: '', order: 4 },
              { label: 'Luật Kinh tế', href: '#', icon: '', order: 5 },
            ],
          },
          {
            title: 'Liên hệ',
            order: 2,
            links: [
              { label: '778 Nguyễn Kiệm, P.4, Q. Phú Nhuận, TP.HCM', href: '#', icon: 'map-pin', order: 0 },
              { label: '(028) 3822 5048', href: 'tel:02838225048', icon: 'phone', order: 1 },
              { label: 'info@ufm.edu.vn', href: 'mailto:info@ufm.edu.vn', icon: 'mail', order: 2 },
              { label: 'www.ufm.edu.vn', href: 'https://ufm.edu.vn', icon: 'globe', order: 3 },
            ],
          },
        ],
      },
      bottomText: {
        type: String,
        default: '© 2026 Trường Đại học Tài chính - Marketing (UFM). Tất cả quyền được bảo lưu.',
      },
      showNewsletter: { type: Boolean, default: false },
      newsletterTitle: { type: String, default: 'Đăng ký nhận bản tin' },
      newsletterPlaceholder: { type: String, default: 'Nhập email của bạn...' },
      showMap: { type: Boolean, default: false },
      mapEmbedUrl: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    collection: 'site_settings',
  }
)

if (mongoose.models.SiteSetting) {
  delete mongoose.models.SiteSetting;
}

const SiteSetting: Model<ISiteSetting> = mongoose.model<ISiteSetting>('SiteSetting', siteSettingSchema)

export default SiteSetting

// ---- Helper: lấy settings (tạo mới nếu chưa có) ----

export async function getSettings(): Promise<ISiteSetting> {
  let settings = await SiteSetting.findOne()
  if (!settings) {
    settings = await SiteSetting.create({})
  }
  return settings
}
