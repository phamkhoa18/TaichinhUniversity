'use client'

import React, { useState, useEffect, KeyboardEvent as KbEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Loader2, X, Search, Plus } from 'lucide-react'
import ImageUpload from '@/components/upload/ImageUpload'

interface Props {
  data: {
    defaultTitle: string; metaDescription: string; metaKeywords: string[]
    ogImage: string; ogTitle: string; ogDescription: string; canonicalUrl: string
    googleAnalyticsId: string; googleTagManagerId: string; facebookPixelId: string
    robotsTxt: string; autoSitemap: boolean
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabSEO({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)
  const [keywordInput, setKeywordInput] = useState('')

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !form.metaKeywords.includes(trimmed)) {
      update('metaKeywords', [...form.metaKeywords, trimmed])
      setKeywordInput('')
    }
  }

  const handleKeywordKey = (e: KbEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  const removeKeyword = (keyword: string) => {
    update('metaKeywords', form.metaKeywords.filter(k => k !== keyword))
  }

  const descLength = form.metaDescription?.length || 0

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <Field label="Title mặc định" required hint="Hiển thị trên tab trình duyệt">
        <Input value={form.defaultTitle} onChange={e => update('defaultTitle', e.target.value)}
          className="h-10 rounded-lg border-slate-200 text-sm"
          placeholder="Viện Đào tạo Sau Đại học — UFM" />
      </Field>

      <Field label="Meta Description" required hint={`${descLength}/160 ký tự`}>
        <textarea
          value={form.metaDescription}
          onChange={e => update('metaDescription', e.target.value)}
          rows={3}
          maxLength={300}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Mô tả ngắn gọn website..."
        />
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all ${descLength > 160 ? 'bg-rose-500' : descLength > 120 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
          />
        </div>
      </Field>

      {/* Keywords */}
      <Field label="Meta Keywords" hint="Nhấn Enter để thêm từ khóa">
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKey}
            className="h-9 rounded-lg border-slate-200 text-sm flex-1"
            placeholder="Nhập từ khóa..."
          />
          <Button type="button" variant="outline" size="sm" onClick={addKeyword}
            className="h-9 px-3 rounded-lg border-slate-200">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.metaKeywords?.map((kw) => (
            <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium group">
              {kw}
              <button onClick={() => removeKeyword(kw)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </Field>

      {/* Google Search Preview */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          Google Search Preview
        </p>
        <div className="space-y-1">
          <p className="text-[18px] text-[#1a0dab] font-medium leading-tight truncate">
            {form.defaultTitle || 'Tiêu đề trang web'}
          </p>
          <p className="text-[13px] text-emerald-700 truncate">
            {form.canonicalUrl || 'https://daotaosdh.ufm.edu.vn'}
          </p>
          <p className="text-[13px] text-slate-500 leading-snug line-clamp-2">
            {form.metaDescription || 'Mô tả ngắn gọn website sẽ hiển thị ở đây...'}
          </p>
        </div>
      </div>

      {/* OG Tags */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Open Graph (khi share link)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="OG Title">
            <Input value={form.ogTitle} onChange={e => update('ogTitle', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Để trống = dùng Title mặc định" />
          </Field>
          <Field label="Canonical URL">
            <Input value={form.canonicalUrl} onChange={e => update('canonicalUrl', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="https://daotaosdh.ufm.edu.vn" />
          </Field>
        </div>
        <Field label="OG Description">
          <Input value={form.ogDescription} onChange={e => update('ogDescription', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Để trống = dùng Meta Description" />
        </Field>
        <Field label="OG Image (ảnh share)" hint="Khuyến nghị: 1200×630px">
          <ImageUpload value={form.ogImage} onChange={url => update('ogImage', url)} category="images" previewSize="lg" placeholder="Upload ảnh cho share link" />
        </Field>
      </div>

      {/* Tracking */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Tracking & Analytics</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Google Analytics ID">
            <Input value={form.googleAnalyticsId} onChange={e => update('googleAnalyticsId', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm font-mono" placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Google Tag Manager ID">
            <Input value={form.googleTagManagerId} onChange={e => update('googleTagManagerId', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm font-mono" placeholder="GTM-XXXXXXX" />
          </Field>
          <Field label="Facebook Pixel ID">
            <Input value={form.facebookPixelId} onChange={e => update('facebookPixelId', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm font-mono" placeholder="123456789" />
          </Field>
        </div>
      </div>

      {/* Robots.txt */}
      <Field label="Nội dung Robots.txt">
        <textarea
          value={form.robotsTxt}
          onChange={e => update('robotsTxt', e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="User-agent: *&#10;Allow: /"
        />
      </Field>

      {/* Sitemap */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="text-[14px] font-semibold text-slate-700">Tự động tạo Sitemap.xml</p>
          <p className="text-[12px] text-slate-500 mt-0.5">Tự động cập nhật khi thêm bài viết mới</p>
        </div>
        <ToggleSwitch checked={form.autoSitemap} onChange={(v) => update('autoSitemap', v)} />
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu SEO & Metadata
        </Button>
      </div>
    </div>
  )
}

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[14px] font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      {children}
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-[#005496]' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
