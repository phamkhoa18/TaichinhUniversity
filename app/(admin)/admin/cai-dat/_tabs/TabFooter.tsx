'use client'

// ============================================================
// TAB — Footer
// Quản lý nội dung footer website — mô tả, cột liên kết, bản đồ,
// newsletter, dòng bản quyền
// ============================================================

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Save, Loader2, Plus, Trash2, GripVertical, X, FolderPlus,
  MapPin, Phone, Mail, Globe, ArrowRight,
  Newspaper, Map as MapIcon, Copyright,
} from 'lucide-react'

interface FooterLink {
  _id?: string
  label: string
  href: string
  icon: string
  order: number
}

interface FooterColumn {
  _id?: string
  title: string
  links: FooterLink[]
  order: number
}

interface FooterData {
  description: string
  columns: FooterColumn[]
  bottomText: string
  showNewsletter: boolean
  newsletterTitle: string
  newsletterPlaceholder: string
  showMap: boolean
  mapEmbedUrl: string
}

const ICON_OPTIONS = [
  { value: '', label: 'Mũi tên (mặc định)' },
  { value: 'map-pin', label: '📍 Địa chỉ' },
  { value: 'phone', label: '📞 Điện thoại' },
  { value: 'mail', label: '✉️ Email' },
  { value: 'globe', label: '🌐 Website' },
]

// Helper: extract src from iframe HTML if user pastes full <iframe> tag
function extractMapUrl(input: string): string {
  const trimmed = input.trim()
  // If it contains <iframe, try to extract src="..."
  if (trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i)
    return match?.[1] || trimmed
  }
  return trimmed
}

export default function TabFooter({
  data,
  onSave,
  saving,
}: {
  data: FooterData
  onSave: (data: FooterData) => void
  saving: boolean
}) {
  const [form, setForm] = useState<FooterData>(() => ({
    description: data?.description || '',
    columns: data?.columns || [],
    bottomText: data?.bottomText || '',
    showNewsletter: data?.showNewsletter || false,
    newsletterTitle: data?.newsletterTitle || 'Đăng ký nhận bản tin',
    newsletterPlaceholder: data?.newsletterPlaceholder || 'Nhập email của bạn...',
    showMap: data?.showMap || false,
    mapEmbedUrl: data?.mapEmbedUrl || '',
  }))

  useEffect(() => {
    if (data) {
      setForm({
        description: data.description || '',
        columns: data.columns || [],
        bottomText: data.bottomText || '',
        showNewsletter: data.showNewsletter || false,
        newsletterTitle: data.newsletterTitle || 'Đăng ký nhận bản tin',
        newsletterPlaceholder: data.newsletterPlaceholder || 'Nhập email của bạn...',
        showMap: data.showMap || false,
        mapEmbedUrl: data.mapEmbedUrl || '',
      })
    }
  }, [data])

  // ── Column CRUD ──
  const addColumn = () => {
    setForm(prev => ({
      ...prev,
      columns: [...prev.columns, { title: 'Cột mới', links: [], order: prev.columns.length }],
    }))
  }

  const updateColumn = (ci: number, key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => i === ci ? { ...col, [key]: value } : col),
    }))
  }

  const removeColumn = (ci: number) => {
    setForm(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== ci),
    }))
  }

  // ── Link CRUD ──
  const addLink = (ci: number) => {
    setForm(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === ci ? { ...col, links: [...col.links, { label: 'Link mới', href: '#', icon: '', order: col.links.length }] } : col
      ),
    }))
  }

  const updateLink = (ci: number, li: number, key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === ci ? { ...col, links: col.links.map((link, j) => j === li ? { ...link, [key]: value } : link) } : col
      ),
    }))
  }

  const removeLink = (ci: number, li: number) => {
    setForm(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === ci ? { ...col, links: col.links.filter((_, j) => j !== li) } : col
      ),
    }))
  }

  return (
    <div className="space-y-8">
      {/* ── Section 1: Mô tả ── */}
      <div className="space-y-4">
        <SectionHeader icon={<Copyright className="w-4 h-4" />} title="Nội dung chính" />
        <FieldGroup label="Mô tả footer" desc="Đoạn văn mô tả ngắn hiển thị bên trái footer, dưới logo">
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496] outline-none transition-all"
            placeholder="Trường Đại học Tài chính – Marketing – nơi kiến tạo..."
          />
        </FieldGroup>
        <FieldGroup label="Dòng bản quyền" desc="Hiển thị ở thanh dưới cùng của footer">
          <Input
            value={form.bottomText}
            onChange={e => setForm(prev => ({ ...prev, bottomText: e.target.value }))}
            className="h-10 rounded-lg border-slate-200 text-sm"
            placeholder="© 2026 Trường Đại học Tài chính - Marketing (UFM)..."
          />
        </FieldGroup>
      </div>

      {/* ── Section 2: Các cột liên kết ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader icon={<FolderPlus className="w-4 h-4" />} title={`Cột liên kết (${form.columns.length})`} />
          <Button size="sm" variant="outline" onClick={addColumn}
            className="h-8 px-3 text-[12px] rounded-lg border-slate-200 font-semibold">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Thêm cột
          </Button>
        </div>

        {form.columns.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <FolderPlus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Chưa có cột nào</p>
            <p className="text-xs text-slate-400 mt-1">Nhấn &quot;Thêm cột&quot; để tạo cột liên kết mới</p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.columns.map((col, ci) => (
              <div key={ci} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Column header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 border-b border-slate-100">
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#005496]/10 text-[#005496] shrink-0">
                    Cột {ci + 1}
                  </span>
                  <Input
                    value={col.title}
                    onChange={e => updateColumn(ci, 'title', e.target.value)}
                    className="h-8 rounded-lg border-slate-200 text-sm font-semibold flex-1"
                    placeholder="Tên cột"
                  />
                  <button
                    onClick={() => removeColumn(ci)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Xóa cột"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Links */}
                <div className="px-4 py-3 space-y-2">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-2 group">
                      <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        {li + 1}
                      </span>
                      <Input
                        value={link.label}
                        onChange={e => updateLink(ci, li, 'label', e.target.value)}
                        className="h-8 rounded border-slate-200 text-[12px] flex-1"
                        placeholder="Label"
                      />
                      <Input
                        value={link.href}
                        onChange={e => updateLink(ci, li, 'href', e.target.value)}
                        className="h-8 rounded border-slate-200 text-[12px] font-mono w-36"
                        placeholder="/path"
                      />
                      <select
                        value={link.icon}
                        onChange={e => updateLink(ci, li, 'icon', e.target.value)}
                        className="h-8 rounded border border-slate-200 text-[11px] px-2 bg-white text-slate-600 w-28"
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeLink(ci, li)}
                        className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addLink(ci)}
                    className="text-[12px] text-[#005496] hover:text-[#004882] font-semibold flex items-center gap-1 mt-1 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 3: Newsletter ── */}
      <div className="space-y-4">
        <SectionHeader icon={<Newspaper className="w-4 h-4" />} title="Bản tin (Newsletter)" />
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
          <Switch
            checked={form.showNewsletter}
            onCheckedChange={v => setForm(prev => ({ ...prev, showNewsletter: v }))}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">Hiển thị form đăng ký bản tin</p>
            <p className="text-xs text-slate-400">Form sẽ hiển thị ở đầu footer với input email và nút đăng ký</p>
          </div>
        </div>
        {form.showNewsletter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-[#005496]/20">
            <FieldGroup label="Tiêu đề">
              <Input
                value={form.newsletterTitle}
                onChange={e => setForm(prev => ({ ...prev, newsletterTitle: e.target.value }))}
                className="h-9 rounded-lg border-slate-200 text-sm"
                placeholder="Đăng ký nhận bản tin"
              />
            </FieldGroup>
            <FieldGroup label="Placeholder email">
              <Input
                value={form.newsletterPlaceholder}
                onChange={e => setForm(prev => ({ ...prev, newsletterPlaceholder: e.target.value }))}
                className="h-9 rounded-lg border-slate-200 text-sm"
                placeholder="Nhập email của bạn..."
              />
            </FieldGroup>
          </div>
        )}
      </div>

      {/* ── Section 4: Google Maps ── */}
      <div className="space-y-4">
        <SectionHeader icon={<MapIcon className="w-4 h-4" />} title="Bản đồ Google Maps" />
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
          <Switch
            checked={form.showMap}
            onCheckedChange={v => setForm(prev => ({ ...prev, showMap: v }))}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">Nhúng bản đồ Google Maps</p>
            <p className="text-xs text-slate-400">Hiển thị bản đồ vị trí trường ngay trước dòng bản quyền</p>
          </div>
        </div>
        {form.showMap && (
          <div className="pl-4 border-l-2 border-[#005496]/20 space-y-3">
            <FieldGroup label="Embed URL" desc="Paste cả thẻ <iframe> hoặc chỉ URL src — hệ thống tự trích xuất URL">
              <Input
                value={form.mapEmbedUrl}
                onChange={e => {
                  const extracted = extractMapUrl(e.target.value)
                  setForm(prev => ({ ...prev, mapEmbedUrl: extracted }))
                }}
                className="h-9 rounded-lg border-slate-200 text-sm font-mono"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </FieldGroup>
            {form.mapEmbedUrl && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-[11px] text-slate-400 font-medium mb-1">URL đã trích xuất:</p>
                <p className="text-[11px] text-slate-600 font-mono break-all line-clamp-2">{form.mapEmbedUrl}</p>
                {!form.mapEmbedUrl.startsWith('https://') && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">⚠️ URL không hợp lệ — URL phải bắt đầu bằng https://</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <Button
          onClick={() => onSave(form)}
          disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu cài đặt Footer
        </Button>
        <span className="text-xs text-slate-400">
          Thay đổi sẽ ảnh hưởng ngay trên tất cả các trang công khai.
        </span>
      </div>
    </div>
  )
}

// ── Helper components ──

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-[#005496]/10 flex items-center justify-center text-[#005496]">
        {icon}
      </div>
      <h3 className="text-[14px] font-bold text-slate-800">{title}</h3>
    </div>
  )
}

function FieldGroup({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>
      {desc && <p className="text-[11px] text-slate-400 -mt-0.5">{desc}</p>}
      {children}
    </div>
  )
}
