'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Loader2, Send, Eye, EyeOff, CheckCircle, XCircle, Mail, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

interface EmailTemplate {
  _id?: string
  name: string
  subject: string
  body: string
  variables: string[]
}

interface Props {
  data: {
    smtpHost: string; smtpPort: number; smtpSecure: string
    fromEmail: string; fromName: string; smtpUsername: string; smtpPassword: string
    replyToEmail: string; templates: EmailTemplate[]
  }
  onSave: (data: any) => void
  saving: boolean
}

export default function TabEmail({ data, onSave, saving }: Props) {
  const [form, setForm] = useState(data)
  const [showPassword, setShowPassword] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null)

  useEffect(() => { setForm(data) }, [data])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleTestEmail = async () => {
    if (!testEmail) return
    setTesting(true)
    setTestResult(null)

    try {
      const res = await fetch('/api/admin/cai-dat/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: testEmail }),
      })
      const json = await res.json()
      setTestResult({ success: json.success, message: json.message || json.error })
    } catch {
      setTestResult({ success: false, message: 'Lỗi kết nối server' })
    } finally {
      setTesting(false)
    }
  }

  const updateTemplate = (index: number, key: keyof EmailTemplate, value: any) => {
    const newTemplates = [...form.templates]
    newTemplates[index] = { ...newTemplates[index], [key]: value }
    update('templates', newTemplates)
  }

  const isConfigured = form.smtpHost && form.fromEmail && form.smtpUsername

  return (
    <div className="space-y-6">
      {/* Status indicator */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
        isConfigured
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-amber-50 border-amber-200 text-amber-700'
      }`}>
        {isConfigured ? (
          <><CheckCircle className="w-4 h-4 shrink-0" /><span className="text-sm font-medium">SMTP đã được cấu hình</span></>
        ) : (
          <><XCircle className="w-4 h-4 shrink-0" /><span className="text-sm font-medium">Chưa cấu hình SMTP — Email tự động sẽ không hoạt động</span></>
        )}
      </div>

      {/* SMTP Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="SMTP Host" required>
          <Input value={form.smtpHost} onChange={e => update('smtpHost', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="smtp.gmail.com" />
        </Field>
        <Field label="SMTP Port" required>
          <Input type="number" value={form.smtpPort} onChange={e => update('smtpPort', parseInt(e.target.value) || 587)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="587" />
        </Field>
        <Field label="Bảo mật">
          <Select value={form.smtpSecure} onValueChange={v => update('smtpSecure', v)}>
            <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không</SelectItem>
              <SelectItem value="TLS">TLS (Port 587)</SelectItem>
              <SelectItem value="SSL">SSL (Port 465)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Email gửi đi (From)" required>
          <Input type="email" value={form.fromEmail} onChange={e => update('fromEmail', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="noreply@ufm.edu.vn" />
        </Field>
        <Field label="Tên hiển thị (From Name)">
          <Input value={form.fromName} onChange={e => update('fromName', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="Viện SĐH - UFM" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="SMTP Username" required>
          <Input value={form.smtpUsername} onChange={e => update('smtpUsername', e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm" placeholder="user@ufm.edu.vn" />
        </Field>
        <Field label="SMTP Password" required>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={form.smtpPassword}
              onChange={e => update('smtpPassword', e.target.value)}
              className="h-10 rounded-lg border-slate-200 text-sm pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
      </div>

      <Field label="Reply-to Email" hint="Email nhận khi người dùng trả lời email">
        <Input type="email" value={form.replyToEmail} onChange={e => update('replyToEmail', e.target.value)}
          className="h-10 rounded-lg border-slate-200 text-sm" placeholder="sdh@ufm.edu.vn" />
      </Field>

      {/* Test Email */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#005496]" />
          Gửi email kiểm tra
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            className="h-10 rounded-lg border-slate-200 text-sm flex-1"
            placeholder="Nhập email nhận test..."
          />
          <Button
            onClick={handleTestEmail}
            disabled={testing || !testEmail}
            variant="outline"
            className="h-10 px-4 rounded-lg border-slate-200 text-sm font-semibold"
          >
            {testing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            Gửi test
          </Button>
        </div>
        {testResult && (
          <div className={`flex items-center gap-2 text-sm font-medium ${testResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>
            {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Email Templates */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#005496]" />
          Template Email Mặc Định
        </p>
        <div className="space-y-2">
          {form.templates?.map((template, index) => (
            <div key={template._id || index} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedTemplate(expandedTemplate === index ? null : index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[13px] font-semibold text-slate-700">{template.name}</span>
                </div>
                {expandedTemplate === index
                  ? <ChevronUp className="w-4 h-4 text-slate-400" />
                  : <ChevronDown className="w-4 h-4 text-slate-400" />
                }
              </button>
              {expandedTemplate === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
                  <div className="pt-3">
                    <Field label="Tiêu đề email">
                      <Input
                        value={template.subject}
                        onChange={e => updateTemplate(index, 'subject', e.target.value)}
                        className="h-9 rounded-lg border-slate-200 text-sm"
                      />
                    </Field>
                  </div>
                  <Field label="Nội dung (HTML)">
                    <textarea
                      value={template.body}
                      onChange={e => updateTemplate(index, 'body', e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
                    />
                  </Field>
                  {template.variables?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 mb-1.5">Biến có thể dùng:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(v => (
                          <code key={v} className="px-2 py-0.5 bg-slate-100 text-[#005496] rounded text-[11px] font-mono">
                            {`{{${v}}}`}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu cấu hình Email
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
