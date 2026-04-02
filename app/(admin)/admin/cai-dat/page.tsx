'use client'

// ============================================================
// SETTINGS PAGE — /admin/cai-dat
// Trang cài đặt hệ thống — 8 tabs đầy đủ
// ============================================================

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'
import {
  Settings, Building2, Phone, Globe, Search, Mail, Wrench, Shield, Palette,
  Loader2, XCircle, Footprints,
} from 'lucide-react'

// Tab components
import TabGeneral from './_tabs/TabGeneral'
import TabContact from './_tabs/TabContact'
import TabSocial from './_tabs/TabSocial'
import TabSEO from './_tabs/TabSEO'
import TabEmail from './_tabs/TabEmail'
import TabMaintenance from './_tabs/TabMaintenance'
import TabSecurity from './_tabs/TabSecurity'
import TabAppearance from './_tabs/TabAppearance'
import TabFooter from './_tabs/TabFooter'

const TABS = [
  { id: 'general', label: 'Thông tin chung', icon: Building2, description: 'Tên, logo, mô tả Viện' },
  { id: 'contact', label: 'Liên hệ', icon: Phone, description: 'Địa chỉ, SĐT, email' },
  { id: 'social', label: 'Mạng xã hội', icon: Globe, description: 'Facebook, Zalo, YouTube...' },
  { id: 'seo', label: 'SEO & Metadata', icon: Search, description: 'Title, meta, Analytics' },
  { id: 'email', label: 'Email SMTP', icon: Mail, description: 'Cấu hình gửi email' },
  { id: 'maintenance', label: 'Bảo trì', icon: Wrench, description: 'Chế độ bảo trì website' },
  { id: 'security', label: 'Bảo mật', icon: Shield, description: 'Đăng nhập, session, backup' },
  { id: 'appearance', label: 'Giao diện', icon: Palette, description: 'Màu sắc, font, layout' },
  { id: 'footer', label: 'Footer', icon: Footprints, description: 'Nội dung chân trang' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { settings, loading, saving, error, saveTab } = useSettings()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#005496] animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Đang tải cài đặt...</span>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <XCircle className="w-8 h-8 text-rose-400" />
          <span className="text-sm text-slate-500 font-medium">Không thể tải cài đặt</span>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <TabGeneral data={settings.general} onSave={(data) => saveTab('general', data)} saving={saving} />
      case 'contact':
        return <TabContact data={settings.contact} onSave={(data) => saveTab('contact', data)} saving={saving} />
      case 'social':
        return <TabSocial data={settings.socialLinks} onSave={(data) => saveTab('socialLinks', data)} saving={saving} />
      case 'seo':
        return <TabSEO data={settings.seo} onSave={(data) => saveTab('seo', data)} saving={saving} />
      case 'email':
        return <TabEmail data={settings.email} onSave={(data) => saveTab('email', data)} saving={saving} />
      case 'maintenance':
        return <TabMaintenance data={settings.maintenance} onSave={(data) => saveTab('maintenance', data)} saving={saving} />
      case 'security':
        return <TabSecurity data={settings.security} onSave={(data) => saveTab('security', data)} saving={saving} />
      case 'appearance':
        return <TabAppearance data={settings.appearance} onSave={(data) => saveTab('appearance', data)} saving={saving} />
      case 'footer':
        return <TabFooter data={settings.footer} onSave={(data) => saveTab('footer', data)} saving={saving} />
      default:
        return null
    }
  }

  const activeTabInfo = TABS.find(t => t.id === activeTab)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-800 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#005496]" />
          Cài đặt hệ thống
        </h1>
        <p className="text-[15px] text-slate-500 font-medium mt-1">
          Quản lý toàn bộ cấu hình website — Viện Đào tạo Sau Đại học UFM.
        </p>
      </div>


      {/* Layout: Sidebar tabs + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vertical Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative
                    ${idx < TABS.length - 1 ? 'border-b border-slate-100' : ''}
                    ${isActive
                      ? 'bg-[#005496]/5 text-[#005496]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingsTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#005496] rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-[#005496]/10' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#005496]' : 'text-slate-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[13px] font-semibold truncate ${isActive ? 'text-[#005496]' : ''}`}>
                      {tab.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{tab.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-xl border border-slate-200">
                {/* Tab Header */}
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                    {activeTabInfo && <activeTabInfo.icon className="w-4.5 h-4.5 text-[#005496]" />}
                    {activeTabInfo?.label}
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-0.5">{activeTabInfo?.description}</p>
                </div>

                {/* Tab Body */}
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
