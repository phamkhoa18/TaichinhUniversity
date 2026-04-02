'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/upload/ImageUpload'

interface Props {
  data: {
    nameVi: string; nameEn: string; shortName: string; parentOrg: string
    foundedYear: number; logo: string; favicon: string
    descriptionVi: string; descriptionEn: string; slogan: string; copyright: string
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabGeneral({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6">
      {/* Tên đơn vị */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Tên đơn vị (Tiếng Việt)" required>
          <Input value={form.nameVi} onChange={e => update('nameVi', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Viện Đào tạo Sau Đại học" />
        </Field>
        <Field label="Tên đơn vị (Tiếng Anh)">
          <Input value={form.nameEn} onChange={e => update('nameEn', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Institute of Postgraduate Studies" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Tên viết tắt">
          <Input value={form.shortName} onChange={e => update('shortName', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="VSDH-UFM" />
        </Field>
        <Field label="Trực thuộc">
          <Input value={form.parentOrg} onChange={e => update('parentOrg', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Trường ĐH Tài chính – Marketing" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Năm thành lập">
          <Input type="number" value={form.foundedYear} onChange={e => update('foundedYear', parseInt(e.target.value) || 0)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="2005" />
        </Field>
        <Field label="Slogan">
          <Input value={form.slogan} onChange={e => update('slogan', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Nâng tầm tri thức — Kiến tạo tương lai" />
        </Field>
      </div>

      {/* Logo & Favicon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Logo chính" hint="Khuyến nghị: PNG trong suốt, tỉ lệ 1:1">
          <ImageUpload
            value={form.logo}
            onChange={(url) => update('logo', url)}
            category="images"
            previewSize="md"
            placeholder="Upload logo"
          />
        </Field>
        <Field label="Favicon" hint="File .ico hoặc .png 32×32">
          <ImageUpload
            value={form.favicon}
            onChange={(url) => update('favicon', url)}
            category="images"
            previewSize="sm"
            placeholder="Upload favicon"
            rounded
          />
        </Field>
      </div>

      {/* Mô tả */}
      <Field label="Mô tả ngắn (Tiếng Việt)" hint="Hiển thị ở footer và meta description mặc định">
        <textarea
          value={form.descriptionVi}
          onChange={e => update('descriptionVi', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Giới thiệu ngắn gọn về Viện..."
        />
      </Field>

      <Field label="Mô tả ngắn (Tiếng Anh)">
        <textarea
          value={form.descriptionEn}
          onChange={e => update('descriptionEn', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Brief introduction in English..."
        />
      </Field>

      {/* Copyright */}
      <Field label="Copyright (Footer)">
        <Input value={form.copyright} onChange={e => update('copyright', e.target.value)}
          className="h-10 rounded-lg border-slate-200 text-sm" placeholder="© 2026 Viện ĐT Sau Đại học — UFM" />
      </Field>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onSave(form)}
          disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu thông tin chung
        </Button>
      </div>
    </div>
  )
}

// ---- Field Wrapper ----
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
