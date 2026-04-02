'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Loader2, Monitor, Eye, X, ArrowRight } from 'lucide-react'
import ImageUpload from '@/components/upload/ImageUpload'
import { cn } from '@/lib/utils'

const FONT_OPTIONS = [
  'Plus Jakarta Sans',
  'Inter',
  'Roboto',
  'Open Sans',
  'Nunito',
  'Montserrat',
  'Source Sans 3',
  'Lato',
]

interface Props {
  data: {
    primaryColor: string; accentColor: string; fontFamily: string; postsPerPage: number
    showChatbot: boolean; showZaloChat: boolean; showPopupNotice: boolean
    popupConfig?: {
      title: string;
      description: string;
      imageUrl: string;
      actionUrl: string;
      actionText: string;
      layout: string;
      showOnce: boolean;
      activeDates?: { start: string | null; end: string | null };
    }
    newsLayout: string; defaultLanguage: string; enableMultiLanguage: boolean
    defaultNewsImage: string
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabAppearance({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const updatePopup = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      popupConfig: {
        ...(prev.popupConfig || {}),
        title: prev.popupConfig?.title ?? 'Thông báo',
        description: prev.popupConfig?.description ?? '',
        imageUrl: prev.popupConfig?.imageUrl ?? '',
        actionUrl: prev.popupConfig?.actionUrl ?? '',
        actionText: prev.popupConfig?.actionText ?? 'Xem chi tiết',
        layout: prev.popupConfig?.layout ?? 'image-top',
        showOnce: prev.popupConfig?.showOnce ?? true,
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Bảng màu</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Màu chủ đạo (Primary)" hint="Dùng cho header, button, link">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => update('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer p-1"
              />
              <div className="flex-1 space-y-1">
                <Input
                  value={form.primaryColor}
                  onChange={e => update('primaryColor', e.target.value)}
                  className="h-9 rounded-lg border-slate-200 text-sm font-mono"
                />
                <div className="h-3 rounded-full" style={{ backgroundColor: form.primaryColor }} />
              </div>
            </div>
          </Field>
          <Field label="Màu phụ (Accent)" hint="Dùng cho điểm nhấn, CTA, badge">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={e => update('accentColor', e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer p-1"
              />
              <div className="flex-1 space-y-1">
                <Input
                  value={form.accentColor}
                  onChange={e => update('accentColor', e.target.value)}
                  className="h-9 rounded-lg border-slate-200 text-sm font-mono"
                />
                <div className="h-3 rounded-full" style={{ backgroundColor: form.accentColor }} />
              </div>
            </div>
          </Field>
        </div>

        {/* Color Preview */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" />
            Preview màu sắc
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-12 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: form.primaryColor }}>
              Primary — Header / Button
            </div>
            <div className="flex-1 h-12 rounded-lg flex items-center justify-center text-slate-900 text-sm font-bold" style={{ backgroundColor: form.accentColor }}>
              Accent — Badge / CTA
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-transform hover:scale-105" style={{ backgroundColor: form.primaryColor }}>
              Nút chính (Primary)
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-transform hover:scale-105" style={{ borderColor: form.primaryColor, color: form.primaryColor }}>
              Nút phụ (Outline)
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: form.accentColor, color: '#1e293b' }}>
              Badge
            </span>
          </div>
        </div>
      </div>

      {/* Font */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Font chữ chính">
          <Select value={form.fontFamily} onValueChange={v => update('fontFamily', v)}>
            <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm" style={{ fontFamily: form.fontFamily }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map(font => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Số bài viết mỗi trang">
          <Input type="number" min={4} max={48} value={form.postsPerPage} onChange={e => update('postsPerPage', parseInt(e.target.value) || 12)}
            className="h-10 rounded-lg border-slate-200 text-sm" />
        </Field>
      </div>

      {/* Layout */}
      <Field label="Layout tin tức">
        <div className="flex gap-3">
          {[
            { value: 'grid', label: 'Dạng lưới', icon: '⊞' },
            { value: 'list', label: 'Dạng danh sách', icon: '☰' },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => update('newsLayout', option.value)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                form.newsLayout === option.value
                  ? 'border-[#005496] bg-[#005496]/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <span className={`text-xs font-semibold ${form.newsLayout === option.value ? 'text-[#005496]' : 'text-slate-600'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Field>

      {/* Default News Image */}
      <Field label="Ảnh mặc định cho Bài viết" hint="Hiển thị ở trang danh sách nếu bài viết không có ảnh đại diện (Tỉ lệ khuyến nghị 16:9)">
        <div className="w-full md:w-1/2">
          <ImageUpload
            value={form.defaultNewsImage}
            onChange={(url) => update('defaultNewsImage', url)}
            category="images"
            previewSize="md"
            placeholder="Upload ảnh mặc định"
          />
        </div>
      </Field>

      {/* Toggles */}
      <div className="space-y-3">
        <ToggleRow
          label="Hiện Chatbot AI"
          description="Hiển thị chatbot tư vấn tuyển sinh trên website công khai"
          checked={form.showChatbot}
          onChange={v => update('showChatbot', v)}
        />
        <ToggleRow
          label="Hiện nút Zalo Chat"
          description="Widget Zalo OA ở góc phải dưới website"
          checked={form.showZaloChat}
          onChange={v => update('showZaloChat', v)}
        />
        <ToggleRow
          label="Hiện Popup thông báo"
          description="Popup xuất hiện khi người dùng vào trang (thông báo tuyển sinh, sự kiện...)"
          checked={form.showPopupNotice}
          onChange={v => update('showPopupNotice', v)}
        />
        
        {form.showPopupNotice && (
          <div className="p-6 mt-2 mb-4 ml-6 border-l-[3px] border-[#005496] bg-white rounded-xl shadow-sm border border-slate-200/50 space-y-5 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2 mb-2">
              Thiết lập nội dung Popup
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Tiêu đề Popup" hint="VD: Thông báo tuyển sinh 2026">
                <Input value={form.popupConfig?.title || ''} onChange={e => updatePopup('title', e.target.value)} className="h-10 rounded-lg text-sm" />
              </Field>
              <Field label="Văn bản phụ (Mô tả ngắn)">
                <Input value={form.popupConfig?.description || ''} onChange={e => updatePopup('description', e.target.value)} className="h-10 rounded-lg text-sm" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Đường dẫn nút bấm (Link)" hint="Chuyển hướng người dùng khi click vào">
                <Input value={form.popupConfig?.actionUrl || ''} onChange={e => updatePopup('actionUrl', e.target.value)} placeholder="https://" className="h-10 rounded-lg text-sm" />
              </Field>
              <Field label="Chữ trên nút bấm">
                <Input value={form.popupConfig?.actionText || ''} onChange={e => updatePopup('actionText', e.target.value)} className="h-10 rounded-lg text-sm" />
              </Field>
            </div>

            <Field label="Giao diện (Layout) hiển thị">
              <Select value={form.popupConfig?.layout || 'image-top'} onValueChange={v => updatePopup('layout', v)}>
                <SelectTrigger className="h-10 rounded-lg text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image-only">🖼️ Chỉ hiển thị Ảnh (Click ảnh nhảy link)</SelectItem>
                  <SelectItem value="image-top">🖼️ 📝 Ảnh nằm trên, Nội dung chữ nằm dưới</SelectItem>
                  <SelectItem value="image-left">🖼️ 📝 Ảnh nằm trái, Nội dung chữ nằm phải</SelectItem>
                  <SelectItem value="text-only">📝 Chỉ hiển thị Chữ (Không có ảnh)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {form.popupConfig?.layout !== 'text-only' && (
              <Field label="Hình ảnh Banner Popup">
                <div className="w-full sm:w-1/2">
                  <ImageUpload
                    value={form.popupConfig?.imageUrl || ''}
                    onChange={(url) => updatePopup('imageUrl', url)}
                    category="images"
                    previewSize="md"
                    placeholder="Tải ảnh Popup lên đây"
                  />
                </div>
              </Field>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                className="h-9 px-4 text-sm font-bold border-[#005496] text-[#005496] hover:bg-[#005496]/5"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem thử Popup
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP PREVIEW RENDERER */}
      {showPreview && form.popupConfig && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm transition-opacity duration-500 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className={cn(
              "relative mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] animate-in zoom-in-95",
              form.popupConfig.layout === 'image-only' 
                ? "bg-transparent shadow-none max-w-4xl w-auto" 
                : "bg-white shadow-2xl max-w-3xl w-full rounded-2xl sm:rounded-[24px] overflow-hidden"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className={cn(
                "absolute z-10 p-2 rounded-full transition-all shadow-sm",
                form.popupConfig.layout === 'image-only'
                  ? "-top-4 -right-4 sm:-top-5 sm:-right-5 bg-white text-slate-800 hover:text-rose-600 hover:scale-110"
                  : "top-3 right-3 sm:top-4 sm:right-4 bg-white/50 hover:bg-white backdrop-blur text-slate-800 hover:text-rose-600"
              )}
              style={form.popupConfig.layout === 'image-only' ? { top: '8px', right: '8px' } : undefined}
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* Layout Image Only */}
            {form.popupConfig.layout === 'image-only' && (
              <div className="relative w-full bg-transparent">
                <img src={form.popupConfig.imageUrl || '/images/placeholder.png'} alt="Preview" className="w-full h-auto object-contain max-h-[85vh] rounded-[1.5rem] shadow-2xl" />
              </div>
            )}

            {/* Layout Image Top */}
            {form.popupConfig.layout === 'image-top' && (
              <div className="flex flex-col">
                <div className="relative w-full bg-slate-50 border-b border-slate-100">
                  <img src={form.popupConfig.imageUrl || '/images/placeholder.png'} alt="Banner" className="w-full h-auto max-h-[45vh] object-contain" />
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{form.popupConfig.title || 'Tiêu đề Popup'}</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{form.popupConfig.description || 'Mô tả ngắn của popup sẽ xuất hiện tại đây...'}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer">
                      {form.popupConfig.actionText || 'Xem chi tiết'} <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Image Left */}
            {form.popupConfig.layout === 'image-left' && (
              <div className="flex flex-col sm:flex-row h-full sm:h-auto sm:max-h-[80vh]">
                <div className="w-full sm:w-2/5 shrink-0 relative bg-slate-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <img src={form.popupConfig.imageUrl || '/images/placeholder.png'} alt="Banner" className="w-full h-auto max-h-[30vh] sm:max-h-[80vh] object-contain drop-shadow-sm" />
                </div>
                <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-center overflow-y-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{form.popupConfig.title || 'Tiêu đề Popup'}</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{form.popupConfig.description || 'Mô tả ngắn của popup sẽ xuất hiện tại đây...'}</p>
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer">
                      {form.popupConfig.actionText || 'Xem chi tiết'} <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Text Only */}
            {form.popupConfig.layout === 'text-only' && (
              <div className="p-6 sm:p-10 space-y-5 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#005496] leading-tight">{form.popupConfig.title || 'Tiêu đề Popup'}</h3>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">{form.popupConfig.description || 'Mô tả ngắn của popup...'}</p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-8 py-3 rounded-full font-bold shadow-lg cursor-pointer">
                    {form.popupConfig.actionText || 'Xem chi tiết'} <ArrowRight size={20} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Ngôn ngữ</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Ngôn ngữ mặc định">
            <Select value={form.defaultLanguage} onValueChange={v => update('defaultLanguage', v)}>
              <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <ToggleRow
          label="Hỗ trợ đa ngôn ngữ"
          description="Hiện nút chuyển ngôn ngữ VI ↔ EN trên website"
          checked={form.enableMultiLanguage}
          onChange={v => update('enableMultiLanguage', v)}
        />
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu giao diện
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

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div>
        <p className="text-[14px] font-semibold text-slate-700">{label}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${checked ? 'bg-[#005496]' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
