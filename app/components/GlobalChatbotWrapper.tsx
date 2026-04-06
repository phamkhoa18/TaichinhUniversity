'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useSiteSettings } from '@/store/SiteSettingsProvider'
import Chatbot from './Chatbot'

export default function GlobalChatbotWrapper() {
  const pathname = usePathname()
  const { settings } = useSiteSettings()

  // Không hiển thị Chatbot ở các trang quản trị (Admin) và trang Chat Toàn Màn Hình
  if (pathname.startsWith('/admin') || pathname.startsWith('/chat')) {
    return null
  }

  // Hiển thị Chatbot dựa trên cấu hình hệ thống (Mặc định: Bật)
  const showChatbot = settings?.appearance?.showChatbot !== false
  if (!showChatbot) return null

  return <Chatbot />
}
