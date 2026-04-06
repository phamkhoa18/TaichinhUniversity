'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Search, MoreVertical, Edit2, Trash2, KeyRound, ShieldAlert, BadgeCheck, X, ShieldHalf, Mail, Loader2, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Format roles beautifully
const ROLE_BADGE: Record<string, { label: string; color: string; icon: any }> = {
  ADMIN: { label: 'Quản trị viên (Admin)', color: 'bg-rose-100 text-rose-700 ring-rose-600/20', icon: KeyRound },
  EDITOR: { label: 'Biên tập viên (Editor)', color: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20', icon: ShieldHalf },
  ADMISSION_OFFICER: { label: 'Tuyển sinh', color: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20', icon: BadgeCheck },
}

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId?: string }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'EDITOR', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenModal = (user: any = null) => {
    setError('')
    if (user) {
      setEditingUser(user)
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' })
    } else {
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'EDITOR', password: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const payload: any = { ...formData }
      if (editingUser && !payload.password) delete payload.password // Don't send empty password on update

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      // Cập nhật state
      if (editingUser) {
        setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...json.data } : u))
      } else {
        setUsers([json.data, ...users])
      }
      setIsModalOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUserId) {
      alert("Không thể xóa tài khoản của chính bạn!")
      return
    }
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${name}"? Hành động này không thể hoàn tác.`)) return
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      
      setUsers(users.filter(u => u._id !== id))
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <>
      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496] transition-all"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#005496] hover:bg-[#004377] text-white px-5 py-2 rounded-xl text-[14px] font-bold transition-all shadow-sm shadow-[#005496]/20"
          >
            <Plus className="w-4 h-4" /> Thêm người dùng
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-5 font-semibold text-slate-500 w-[35%]">Người dùng</th>
                <th className="py-3 px-5 font-semibold text-slate-500 w-[25%]">Vai trò (Role)</th>
                <th className="py-3 px-5 font-semibold text-slate-500 w-[20%]">Trạng thái</th>
                <th className="py-3 px-5 font-semibold text-slate-500 text-right w-[20%]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Không tìm thấy người dùng nào.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => {
                  const roleCfg = ROLE_BADGE[user.role] || ROLE_BADGE.EDITOR
                  const Icon = roleCfg.icon
                  const isMe = user._id === currentUserId

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#005496]/10 shrink-0 overflow-hidden relative border border-slate-200">
                            {user.avatar ? (
                              <Image src={user.avatar} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#005496] font-bold">
                                {user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-bold text-slate-800 truncate flex items-center gap-2">
                              {user.name} 
                              {isMe && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded uppercase font-bold tracking-wider border border-slate-200">Bạn</span>}
                            </div>
                            <div className="text-[12px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${roleCfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-slate-700">Hoạt động</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(user)} 
                            className="p-2 text-slate-400 hover:text-[#005496] hover:bg-[#005496]/10 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isMe && (
                            <button 
                              onClick={() => handleDelete(user._id, user.name)} 
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over / Modal for Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !loading && setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800">
                  {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Thiết lập thông tin và phân quyền truy cập.
                </p>
              </div>
              <button 
                onClick={() => !loading && setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 text-[13px] font-medium rounded-xl border border-rose-100 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Email truy cập <span className="text-rose-500">*</span></label>
                <input 
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
                  placeholder="nguyenvana@ufm.edu.vn"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Phân quyền (Role) <span className="text-rose-500">*</span></label>
                <select
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
                >
                  <option value="EDITOR">Biên tập viên (News/Content)</option>
                  <option value="ADMISSION_OFFICER">Tuyển sinh (Quản lý hồ sơ)</option>
                  <option value="ADMIN">Toàn quyền (Admin)</option>
                </select>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3 h-3" /> ADMIN có có thể truy cập toàn bộ hệ thống.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">
                  {editingUser ? 'Mật khẩu (Bỏ trống nếu không đổi)' : 'Mật khẩu khởi tạo'} {!editingUser && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required={!editingUser}
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496]"
                    placeholder="Nhập mật khẩu..."
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, password: Math.random().toString(36).slice(-8)})}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#005496] bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
                    title="Tạo ngẫu nhiên"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-[#005496] text-white rounded-xl text-[14px] font-bold hover:bg-[#004377] transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#005496]/20"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
