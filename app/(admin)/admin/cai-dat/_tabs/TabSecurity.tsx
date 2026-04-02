'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Loader2, KeyRound, Database, Download, Clock } from 'lucide-react'

interface Props {
  data: {
    maxLoginAttempts: number; lockDurationMinutes: number; sessionTimeoutMinutes: number
    allowMultipleSessions: boolean; enable2FA: boolean
    autoBackup: boolean; backupSchedule: string
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabSecurity({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleChangePassword = async () => {
    setPwError('')
    setPwSuccess('')

    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      setPwError('Vui lòng điền đầy đủ các trường')
      return
    }
    if (pwForm.newPw.length < 6) {
      setPwError('Mật khẩu mới phải ít nhất 6 ký tự')
      return
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('Mật khẩu xác nhận không khớp')
      return
    }

    setChangingPw(true)
    try {
      const res = await fetch('/api/admin/cai-dat/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setPwSuccess('Đã đổi mật khẩu thành công!')
        setPwForm({ current: '', newPw: '', confirm: '' })
        setTimeout(() => setPwSuccess(''), 3000)
      } else {
        setPwError(json.error || 'Đổi mật khẩu thất bại')
      }
    } catch {
      setPwError('Lỗi kết nối server')
    } finally {
      setChangingPw(false)
    }
  }

  const handleExportData = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/cai-dat/backup', { method: 'POST' })
      const json = await res.json()
      if (json.success && json.data) {
        // Tạo file JSON và download
        const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ufm-backup-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // silently fail
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Đổi mật khẩu */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#005496]" />
          Đổi mật khẩu Admin
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Mật khẩu hiện tại">
            <Input type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="••••••••" />
          </Field>
          <Field label="Mật khẩu mới">
            <Input type="password" value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Ít nhất 6 ký tự" />
          </Field>
          <Field label="Xác nhận mật khẩu mới">
            <Input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Nhập lại mật khẩu mới" />
          </Field>
        </div>
        {pwError && <p className="text-xs text-rose-500 font-medium">{pwError}</p>}
        {pwSuccess && <p className="text-xs text-emerald-600 font-medium">{pwSuccess}</p>}
        <Button onClick={handleChangePassword} disabled={changingPw} size="sm"
          className="h-9 px-4 text-xs font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {changingPw ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5 mr-1.5" />}
          Đổi mật khẩu
        </Button>
      </div>

      {/* Login security */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Giới hạn đăng nhập</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Số lần đăng nhập sai tối đa" hint="Khóa tài khoản sau N lần sai">
            <Input type="number" min={1} max={20} value={form.maxLoginAttempts} onChange={e => update('maxLoginAttempts', parseInt(e.target.value) || 5)}
              className="h-10 rounded-lg border-slate-200 text-sm" />
          </Field>
          <Field label="Thời gian khóa (phút)" hint="Thời gian chờ sau khi bị khóa">
            <Input type="number" min={1} max={1440} value={form.lockDurationMinutes} onChange={e => update('lockDurationMinutes', parseInt(e.target.value) || 30)}
              className="h-10 rounded-lg border-slate-200 text-sm" />
          </Field>
          <Field label="Session timeout (phút)" hint="Tự đăng xuất sau N phút không thao tác">
            <Input type="number" min={5} max={1440} value={form.sessionTimeoutMinutes} onChange={e => update('sessionTimeoutMinutes', parseInt(e.target.value) || 480)}
              className="h-10 rounded-lg border-slate-200 text-sm" />
          </Field>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <ToggleRow
          label="Cho phép đăng nhập nhiều thiết bị"
          description="Một tài khoản có thể đăng nhập đồng thời trên nhiều trình duyệt/thiết bị"
          checked={form.allowMultipleSessions}
          onChange={v => update('allowMultipleSessions', v)}
        />
        <ToggleRow
          label="Xác thực 2 bước (2FA)"
          description="Gửi mã OTP qua email khi đăng nhập"
          checked={form.enable2FA}
          onChange={v => update('enable2FA', v)}
        />
      </div>

      {/* Backup */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#005496]" />
          Sao lưu dữ liệu
        </p>

        <ToggleRow
          label="Sao lưu tự động"
          description="Tự động tạo backup theo lịch"
          checked={form.autoBackup}
          onChange={v => update('autoBackup', v)}
        />

        {form.autoBackup && (
          <Field label="Lịch sao lưu">
            <Select value={form.backupSchedule} onValueChange={v => update('backupSchedule', v)}>
              <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleExportData} disabled={exporting} variant="outline" size="sm"
            className="h-9 px-4 text-xs font-semibold rounded-lg border-slate-200">
            {exporting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
            Xuất dữ liệu (JSON)
          </Button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu cài đặt bảo mật
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
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
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
