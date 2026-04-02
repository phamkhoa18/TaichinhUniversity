'use client'

import React, { useState, useEffect, KeyboardEvent as KbEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Loader2, AlertTriangle, ShieldAlert, X, Plus, Eye } from 'lucide-react'

interface Props {
  data: {
    enabled: boolean; title: string; message: string
    estimatedEnd: string | null; allowAdmin: boolean; whitelistIPs: string[]
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabMaintenance({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)
  const [ipInput, setIpInput] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleMaintenance = () => {
    if (!form.enabled) {
      // Đang tắt → muốn bật → hiện confirm
      setShowConfirm(true)
    } else {
      // Đang bật → tắt ngay
      update('enabled', false)
    }
  }

  const confirmEnable = () => {
    update('enabled', true)
    setShowConfirm(false)
  }

  const addIP = () => {
    const trimmed = ipInput.trim()
    if (trimmed && !form.whitelistIPs.includes(trimmed)) {
      update('whitelistIPs', [...form.whitelistIPs, trimmed])
      setIpInput('')
    }
  }

  const handleIPKey = (e: KbEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addIP() }
  }

  const removeIP = (ip: string) => {
    update('whitelistIPs', form.whitelistIPs.filter(i => i !== ip))
  }

  return (
    <div className="space-y-6">
      {/* Big Toggle */}
      <div className={`p-5 rounded-xl border-2 transition-all ${
        form.enabled
          ? 'border-amber-400 bg-amber-50'
          : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {form.enabled ? (
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            <div>
              <p className="text-[15px] font-bold text-slate-800">
                {form.enabled ? '⚠️ Website đang ở chế độ BẢO TRÌ' : '✅ Website đang hoạt động bình thường'}
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {form.enabled
                  ? 'Người dùng không thể truy cập website. Chỉ Admin/IP whitelist mới vào được.'
                  : 'Tất cả người dùng có thể truy cập website bình thường.'
                }
              </p>
            </div>
          </div>
          <ToggleSwitch checked={form.enabled} onChange={toggleMaintenance} size="lg" />
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-800">Xác nhận bật chế độ bảo trì?</p>
              <p className="text-xs text-rose-600 mt-1">
                Toàn bộ website sẽ ngưng hoạt động đối với người dùng thông thường.
                Chỉ có Admin và các IP được phép mới có thể truy cập.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-7">
            <Button size="sm" onClick={confirmEnable}
              className="h-8 px-4 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white">
              Xác nhận bật bảo trì
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}
              className="h-8 px-3 text-xs rounded-lg border-slate-200">
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Settings */}
      <Field label="Tiêu đề trang bảo trì">
        <Input value={form.title} onChange={e => update('title', e.target.value)}
          className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Website đang bảo trì" />
      </Field>

      <Field label="Nội dung thông báo" hint="Nội dung hiển thị cho người truy cập khi website đang bảo trì">
        <textarea
          value={form.message}
          onChange={e => update('message', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
          placeholder="Chúng tôi đang nâng cấp hệ thống..."
        />
      </Field>

      <Field label="Thời gian dự kiến hoàn tất" hint="Hiển thị countdown cho người dùng">
        <Input
          type="datetime-local"
          value={form.estimatedEnd ? new Date(form.estimatedEnd).toISOString().slice(0, 16) : ''}
          onChange={e => update('estimatedEnd', e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="h-10 rounded-lg border-slate-200 text-sm"
        />
      </Field>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="text-[14px] font-semibold text-slate-700">Cho phép Admin truy cập</p>
          <p className="text-[12px] text-slate-500 mt-0.5">Admin đăng nhập vẫn vào được khi đang bảo trì</p>
        </div>
        <ToggleSwitch checked={form.allowAdmin} onChange={(v) => update('allowAdmin', v)} />
      </div>

      {/* Whitelist IPs */}
      <Field label="Whitelist IPs" hint="Các địa chỉ IP được phép truy cập khi đang bảo trì. Nhấn Enter để thêm.">
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={ipInput}
            onChange={e => setIpInput(e.target.value)}
            onKeyDown={handleIPKey}
            className="h-9 rounded-lg border-slate-200 text-sm font-mono flex-1"
            placeholder="VD: 123.45.67.89"
          />
          <Button type="button" variant="outline" size="sm" onClick={addIP}
            className="h-9 px-3 rounded-lg border-slate-200">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.whitelistIPs?.map((ip) => (
            <span key={ip} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono group">
              {ip}
              <button onClick={() => removeIP(ip)} className="text-slate-400 hover:text-rose-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </Field>

      {/* Preview */}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-9 px-4 rounded-lg border-slate-200 text-sm mb-3"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          {showPreview ? 'Ẩn Preview' : 'Xem Preview trang bảo trì'}
        </Button>

        {showPreview && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 text-center min-h-[300px] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold">{form.title || 'Website đang bảo trì'}</h2>
              <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                {form.message || 'Nội dung thông báo...'}
              </p>
              {form.estimatedEnd && (
                <div className="mt-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
                  <p className="text-xs text-slate-400">Dự kiến hoàn tất:</p>
                  <p className="text-sm font-semibold text-amber-400">
                    {new Date(form.estimatedEnd).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu cài đặt bảo trì
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

function ToggleSwitch({ checked, onChange, size = 'md' }: { checked: boolean; onChange: (v: boolean) => void; size?: 'md' | 'lg' }) {
  const w = size === 'lg' ? 'w-14 h-7' : 'w-11 h-6'
  const d = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
  const t = size === 'lg' ? 'translate-x-7' : 'translate-x-5'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${w} rounded-full transition-colors relative ${checked ? 'bg-[#005496]' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 ${d} bg-white rounded-full shadow transition-transform ${checked ? t : 'translate-x-0'}`} />
    </button>
  )
}
