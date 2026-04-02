// ============================================================
// HOOKS — useSettings
// Custom hook để quản lý state settings
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { showToast } from '@/lib/toast'

export interface SettingsData {
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
  socialLinks: Array<{
    platform: string
    url: string
    enabled: boolean
    order: number
  }>
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
      _id?: string
      name: string
      subject: string
      body: string
      variables: string[]
    }>
  }
  maintenance: {
    enabled: boolean
    title: string
    message: string
    estimatedEnd: string | null
    allowAdmin: boolean
    whitelistIPs: string[]
  }
  security: {
    maxLoginAttempts: number
    lockDurationMinutes: number
    sessionTimeoutMinutes: number
    allowMultipleSessions: boolean
    enable2FA: boolean
    autoBackup: boolean
    backupSchedule: string
  }
  appearance: {
    primaryColor: string
    accentColor: string
    fontFamily: string
    postsPerPage: number
    showChatbot: boolean
    showZaloChat: boolean
    showPopupNotice: boolean
    newsLayout: string
    defaultLanguage: string
    enableMultiLanguage: boolean
    defaultNewsImage: string
  }
  footer: {
    description: string
    columns: Array<{
      _id?: string
      title: string
      links: Array<{
        _id?: string
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
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/cai-dat')
      const json = await res.json()
      if (json.success) {
        setSettings(json.data)
      } else {
        setError(json.error || 'Không thể tải cài đặt')
        showToast.error('Không thể tải cài đặt', json.error)
      }
    } catch {
      setError('Lỗi kết nối server')
      showToast.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const saveTab = useCallback(async (tab: string, data: any) => {
    try {
      setSaving(true)

      const res = await fetch('/api/admin/cai-dat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab, data }),
      })

      const json = await res.json()
      if (json.success) {
        showToast.success('Đã lưu cài đặt thành công!')
        await fetchSettings()
      } else {
        showToast.error('Lưu thất bại', json.error)
      }
    } catch {
      showToast.error('Lỗi kết nối server')
    } finally {
      setSaving(false)
    }
  }, [fetchSettings])

  return { settings, loading, saving, error, saveTab, fetchSettings }
}
