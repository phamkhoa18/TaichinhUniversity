'use client'

// ============================================================
// CONTEXT — SiteSettingsProvider
// Cung cấp settings cho toàn bộ website public
// Admin thay đổi → trang public phản ánh ngay khi refresh
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface PublicSiteSettings {
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
  }
  maintenance: {
    enabled: boolean
    title: string
    message: string
    estimatedEnd: string | null
    allowAdmin: boolean
  }
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
      activeDates?: { start: string | null; end: string | null };
    }
    newsLayout: string
    defaultLanguage: string
    enableMultiLanguage: boolean
  }
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
}

interface SiteSettingsContextType {
  settings: PublicSiteSettings | null
  loading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  loading: true,
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchSettings() {
      try {
        const res = await fetch('/api/public/settings')
        const json = await res.json()
        if (json.success && mounted) {
          setSettings(json.data)
        }
      } catch {
        // silently fail — use defaults
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchSettings()
    return () => { mounted = false }
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
