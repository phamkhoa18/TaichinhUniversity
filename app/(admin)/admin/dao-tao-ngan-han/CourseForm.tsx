'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, Save, Loader2, Image as ImageIcon,
  Send, X, CheckCircle2, AlertCircle, BookMarked,
  DollarSign, Calendar, MapPin, Users, Clock, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { showToast } from '@/lib/toast'

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

const STATUS_CFG = [
  { value: 'OPEN', label: 'Đang mở', dot: 'bg-emerald-500' },
  { value: 'DRAFT', label: 'Bản nháp', dot: 'bg-slate-300' },
  { value: 'CLOSED', label: 'Đã đóng', dot: 'bg-amber-400' },
]

interface CourseFormProps {
  initialData?: any
  isEdit?: boolean
}

export default function CourseForm({ initialData, isEdit }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(initialData?.thumbnail || null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    code: initialData?.code || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    schedule: initialData?.schedule || '',
    duration: initialData?.duration || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    location: initialData?.location || '',
    instructor: initialData?.instructor || '',
    maxStudents: initialData?.maxStudents || 0,
    status: initialData?.status || 'DRAFT',
    isHot: initialData?.isHot || false,
    order: initialData?.order || 0,
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxStudents' || name === 'order' ? Number(value) : value,
      ...(name === 'title' && !isEdit ? { slug: slugify(value) } : {}),
    }))
  }

  const handleThumbnailUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', 'images')
      showToast.promise(
        fetch('/api/upload', { method: 'POST', body: fd })
          .then(async (res) => {
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Upload thất bại')
            setThumbnail(data.url)
            return data
          }),
        { loading: 'Đang tải ảnh...', success: 'Đã tải ảnh thành công!', error: (err: any) => err.message }
      )
    }
    input.click()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) return setError('Vui lòng nhập tên khóa học')
    if (!formData.code.trim()) return setError('Vui lòng nhập mã lớp')

    setIsSubmitting(true)
    setError('')

    const payload = {
      ...formData,
      thumbnail,
      slug: formData.slug || slugify(formData.title),
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    }

    try {
      const url = isEdit ? `/api/admin/dao-tao-ngan-han/${initialData._id}` : '/api/admin/dao-tao-ngan-han'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.error)
        showToast.error(isEdit ? 'Không thể cập nhật' : 'Không thể tạo khóa học', json.error)
        setIsSubmitting(false)
      } else {
        setSuccess(true)
        showToast.success(isEdit ? 'Đã cập nhật thành công!' : 'Đã tạo khóa học thành công!')
        setTimeout(() => router.push('/admin/dao-tao-ngan-han'), 1500)
      }
    } catch {
      setError('Lỗi kết nối server')
      showToast.error('Lỗi kết nối server')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/dao-tao-ngan-han">
            <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:text-[#005496] hover:border-[#005496]/20 transition-all shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-[20px] font-bold tracking-tight text-slate-800 truncate">
              {isEdit ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
            </h1>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">Đào tạo ngắn hạn</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || success || !formData.title || !formData.code}
          size="sm"
          className="h-9 px-5 text-[12px] font-bold rounded-lg bg-[#005496] hover:bg-[#004377] text-white active:scale-[0.97] transition-all shadow-sm"
        >
          {success ? (
            <><CheckCircle2 className="w-4 h-4 mr-1.5" />Đã lưu!</>
          ) : isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Đang lưu...</>
          ) : (
            <><Send className="w-4 h-4 mr-1.5" />{isEdit ? 'Cập nhật' : 'Tạo khóa học'}</>
          )}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-[13px] font-medium px-4 py-2.5 rounded-lg border border-rose-200 mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" /><span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="hover:text-rose-800"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-4 py-2.5 rounded-lg border border-emerald-200 mb-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />Khóa học đã được lưu thành công!
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Main Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Tên khóa học <span className="text-rose-400 normal-case text-[10px]">• bắt buộc</span>
              </label>
              <input
                name="title" placeholder="VD: Thực hành nghiên cứu khoa học"
                className="w-full h-12 px-4 text-[17px] font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal bg-white border border-slate-200 rounded-xl outline-none focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/10 transition-all"
                value={formData.title} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Mã lớp <span className="text-rose-400 normal-case text-[10px]">• bắt buộc</span>
                </label>
                <input
                  name="code" placeholder="VD: TNNC02"
                  className="w-full h-10 px-4 text-[14px] font-mono font-bold text-slate-900 uppercase placeholder:text-slate-300 placeholder:font-normal bg-white border border-slate-200 rounded-xl outline-none focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/10 transition-all"
                  value={formData.code} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Đường dẫn</label>
                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#005496] focus-within:ring-2 focus-within:ring-[#005496]/10 transition-all">
                  <span className="text-[10px] text-slate-500 font-mono px-2.5 h-10 flex items-center bg-slate-100 border-r border-slate-200 select-none shrink-0">/dao-tao-ngan-han/</span>
                  <input
                    name="slug" placeholder="slug-tu-dong"
                    className="flex-1 h-10 px-3 bg-transparent text-[12px] font-mono text-slate-800 placeholder:text-slate-400 outline-none"
                    value={formData.slug} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Mô tả ngắn</label>
              <textarea
                name="excerpt" placeholder="1-2 câu mô tả ngắn gọn hiển thị trên trang danh sách..."
                className="w-full h-20 p-3.5 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#005496]/10 focus:border-[#005496] transition-all resize-none placeholder:text-slate-300 leading-relaxed"
                value={formData.excerpt} onChange={handleChange} maxLength={500}
              />
            </div>
          </div>

          {/* Description Editor */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <BookMarked className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-[13px] text-slate-800">Nội dung chi tiết</span>
            </div>
            <div className="min-h-[400px]">
              <RichTextEditor
                content={formData.description}
                onChange={(html: string) => setFormData(prev => ({ ...prev, description: html }))}
                minHeight={400}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">

          {/* Status & Publish */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-[13px] text-slate-800">Xuất bản</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Trạng thái</label>
                <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}>
                  <SelectTrigger className="w-full h-9 border-slate-200 rounded-lg text-[12px] font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {STATUS_CFG.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label htmlFor="isHot" className="text-[12px] font-medium text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Nổi bật
                </label>
                <Switch id="isHot" checked={formData.isHot} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHot: checked }))} />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-[13px] text-slate-800">Thông tin khóa học</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Học phí (VNĐ)</label>
                <input name="price" type="number" min="0" step="100000" placeholder="1500000"
                  className="w-full h-9 px-3 text-[13px] font-bold text-slate-900 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all tabular-nums"
                  value={formData.price} onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Ngày khai giảng</label>
                  <input name="startDate" type="date"
                    className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                    value={formData.startDate} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Ngày kết thúc</label>
                  <input name="endDate" type="date"
                    className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                    value={formData.endDate} onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Thời lượng</label>
                <input name="duration" placeholder="VD: 3 tuần"
                  className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={formData.duration} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Lịch học</label>
                <input name="schedule" placeholder="VD: T7-CN, 8h-17h"
                  className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={formData.schedule} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Địa điểm</label>
                <input name="location" placeholder="VD: Cơ sở 1 - 306 Nguyễn Trọng Tuyển"
                  className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={formData.location} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Giảng viên</label>
                <input name="instructor" placeholder="VD: PGS. TS. Nguyễn Văn A"
                  className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={formData.instructor} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Số lượng tối đa</label>
                <input name="maxStudents" type="number" min="0" placeholder="0 = không giới hạn"
                  className="w-full h-9 px-3 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={formData.maxStudents} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-[13px] text-slate-800">Ảnh đại diện</span>
            </div>
            <div className="p-4">
              {thumbnail ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                    <button onClick={handleThumbnailUpload} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110" title="Đổi ảnh">
                      <ImageIcon className="w-3 h-3 text-slate-700" />
                    </button>
                    <button onClick={() => setThumbnail(null)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110" title="Xóa">
                      <X className="w-3 h-3 text-rose-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleThumbnailUpload}
                  className="w-full h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-[#005496]/[0.02] hover:border-[#005496]/30 flex flex-col items-center justify-center transition-all group"
                >
                  <ImageIcon className="w-5 h-5 text-slate-300 group-hover:text-[#005496] mb-1.5 transition-colors" />
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-[#005496]">Tải ảnh lên</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
