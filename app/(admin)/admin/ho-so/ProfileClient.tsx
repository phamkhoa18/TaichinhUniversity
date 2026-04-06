'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { User, Mail, ShieldAlert, KeyRound, Loader2, CheckCircle2, ShieldHalf, BadgeCheck } from 'lucide-react'

const ROLE_DISPLAY: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  ADMIN: { label: 'Quản trị viên (ADMIN)', bg: 'bg-rose-100', text: 'text-rose-700', icon: KeyRound },
  EDITOR: { label: 'Biên tập viên (EDITOR)', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: ShieldHalf },
  ADMISSION_OFFICER: { label: 'Tuyển sinh (OFFICER)', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: BadgeCheck },
}

export default function ProfileClient({ initialData }: { initialData: any }) {
  const router = useRouter()
  const roleCfg = ROLE_DISPLAY[initialData.role] || ROLE_DISPLAY.EDITOR
  const Icon = roleCfg.icon

  const [formData, setFormData] = useState({
    name: initialData.name,
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          newPassword: formData.newPassword
        })
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      setSuccess('Cập nhật thông tin thành công! Tải lại trang sau 2 giây...')
      setFormData({ ...formData, newPassword: '', confirmPassword: '' })
      
      // Auto refresh to update session layout / navbar avatar
      setTimeout(() => {
        router.refresh()
        window.location.reload()
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cột trái: Thông tin hiển thị */}
      <div className="col-span-1 border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden self-start">
        <div className="h-24 bg-gradient-to-r from-[#005496] to-[#0074cc]"></div>
        <div className="relative px-6 pb-6 text-center">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 mx-auto -mt-12 overflow-hidden shadow-md flex items-center justify-center relative z-10">
            {initialData.avatar ? (
              <Image src={initialData.avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="text-[32px] font-bold text-[#005496]">{initialData.name.charAt(0)}</span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">{initialData.name}</h2>
          
          <div className={`mt-2.5 mx-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${roleCfg.bg} ${roleCfg.text}`}>
            <Icon className="w-4 h-4" />
            {roleCfg.label}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-[13px] text-slate-600 font-medium pb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              {initialData.email}
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
           <p className="text-[11px] text-slate-500 font-medium">Bắt đầu tham gia hệ thống: {new Date(initialData.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Cột phải: Form cập nhật */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#005496]" /> Cập nhật chi tiết
        </h3>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-[13px] font-medium">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-700 text-[13px] font-medium">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700">Địa chỉ Email (Đăng nhập)</label>
              <input 
                type="email" 
                value={initialData.email}
                disabled
                className="w-full bg-slate-100/70 border border-slate-200 px-4 py-3 rounded-xl text-[14px] text-slate-500 font-medium cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Email đóng vai trò định danh, không thể thay đổi.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700">Họ và Tên</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-slate-200 focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/20 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-800 transition-all outline-none"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div>
             <h4 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
               <KeyRound className="w-4 h-4 text-[#005496]" /> Đổi mật khẩu
             </h4>
             <p className="text-[12px] text-slate-500 mb-6">Bạn có thể bỏ qua khu vực này nếu như không muốn đổi mật khẩu truy cập hệ thống.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700">Mật khẩu thẻ mới</label>
                  <input 
                    type="password" 
                    value={formData.newPassword}
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full bg-white border border-slate-200 focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/20 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-800 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700">Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Nhập lại chính xác"
                    className="w-full bg-white border border-slate-200 focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/20 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-800 transition-all outline-none"
                  />
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button 
                type="submit" 
                disabled={loading}
                className="bg-[#005496] hover:bg-[#004377] text-white px-8 py-3 rounded-xl font-bold text-[14px] transition-colors flex items-center gap-2 shadow-sm shadow-[#005496]/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Cập nhật Hồ sơ cá nhân
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
