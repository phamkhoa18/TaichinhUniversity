'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Loader2, MapPin } from 'lucide-react'

interface Props {
  data: {
    address: string; address2: string; phone: string; hotline: string
    email: string; admissionEmail: string; fax: string; workingHours: string
    googleMapsUrl: string; latitude: string; longitude: string
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabContact({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6">
      {/* Địa chỉ */}
      <Field label="Địa chỉ trụ sở chính" required>
        <textarea
          value={form.address}
          onChange={e => update('address', e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Số nhà, Đường, Phường, Quận, TP..."
        />
      </Field>

      <Field label="Địa chỉ cơ sở 2 (tùy chọn)">
        <textarea
          value={form.address2}
          onChange={e => update('address2', e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Cơ sở phụ nếu có..."
        />
      </Field>

      {/* Điện thoại */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Số điện thoại chính" required>
          <Input value={form.phone} onChange={e => update('phone', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="(028) 3997 2091" />
        </Field>
        <Field label="Hotline / SĐT phụ">
          <Input value={form.hotline} onChange={e => update('hotline', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="0909 xxx xxx" />
        </Field>
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Email chính" required>
          <Input type="email" value={form.email} onChange={e => update('email', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="sdh@ufm.edu.vn" />
        </Field>
        <Field label="Email tuyển sinh">
          <Input type="email" value={form.admissionEmail} onChange={e => update('admissionEmail', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="tuyensinh.sdh@ufm.edu.vn" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Fax">
          <Input value={form.fax} onChange={e => update('fax', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="(028) xxxx xxxx" />
        </Field>
        <Field label="Giờ làm việc">
          <Input value={form.workingHours} onChange={e => update('workingHours', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Thứ 2 - Thứ 6: 7:30 - 16:30" />
        </Field>
      </div>

      {/* Google Maps */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin className="w-4 h-4 text-[#005496]" />
          Bản đồ Google Maps
        </div>
        
        <Field label="Google Maps Embed URL" hint="Lấy từ Google Maps → Share → Embed → Copy src URL">
          <Input value={form.googleMapsUrl} onChange={e => update('googleMapsUrl', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="https://www.google.com/maps/embed?pb=..." />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Vĩ độ (Latitude)">
            <Input value={form.latitude} onChange={e => update('latitude', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="10.7376" />
          </Field>
          <Field label="Kinh độ (Longitude)">
            <Input value={form.longitude} onChange={e => update('longitude', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="106.7181" />
          </Field>
        </div>

        {/* Preview bản đồ */}
        {form.googleMapsUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <iframe
              src={form.googleMapsUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Preview"
            />
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onSave(form)}
          disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu thông tin liên hệ
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
