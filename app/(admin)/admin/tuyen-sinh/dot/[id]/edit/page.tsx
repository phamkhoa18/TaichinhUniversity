'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  CalendarIcon, ChevronLeft, Save, Loader2, Send, X, Users,
  Target, Bookmark, Upload, Scale, Info, Power
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export default function EditAdmissionRoundPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [openDate, setOpenDate] = useState<Date | undefined>(undefined)
  const [closeDate, setCloseDate] = useState<Date | undefined>(undefined)
  const [examDate, setExamDate] = useState<Date | undefined>(undefined)
  const [resultDate, setResultDate] = useState<Date | undefined>(undefined)

  const [formData, setFormData] = useState({
    name: '',
    level: 'THAC_SI',
    status: 'UPCOMING',
    quota: '',
    brochureUrl: '',
    syllabusUrl: '',
  })

  useEffect(() => {
    fetch(`/api/admin/admissions/rounds/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          const d = json.data
          setFormData({
            name: d.name || '',
            level: d.level || 'THAC_SI',
            status: d.status || 'UPCOMING',
            quota: d.quota?.toString() || '',
            brochureUrl: d.brochureUrl || '',
            syllabusUrl: d.syllabusUrl || ''
          })
          if (d.openDate) setOpenDate(new Date(d.openDate))
          if (d.closeDate) setCloseDate(new Date(d.closeDate))
          if (d.examDate) setExamDate(new Date(d.examDate))
          if (d.resultDate) setResultDate(new Date(d.resultDate))
        } else {
          setError('Không tìm thấy dữ liệu đợt tuyển sinh.')
        }
      })
      .catch(() => setError('Lỗi khi tải dữ liệu!'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return setError('Vui lòng nhập tên đợt tuyển sinh')
    if (!formData.quota || isNaN(Number(formData.quota)) || Number(formData.quota) <= 0) {
      return setError('Chỉ tiêu phải là số lớn hơn 0')
    }
    if (!openDate) return setError('Vui lòng chọn ngày mở đăng ký')
    if (!closeDate) return setError('Vui lòng chọn ngày kết thúc đăng ký')
    if (openDate >= closeDate) return setError('Ngày mở đăng ký phải trước ngày kết thúc')
    if (examDate && examDate <= closeDate) return setError('Ngày thi tuyển/xét tuyển phải sau ngày kết thúc đăng ký')

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/admissions/rounds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quota: Number(formData.quota),
          openDate: openDate.toISOString(),
          closeDate: closeDate.toISOString(),
          examDate: examDate?.toISOString(),
          resultDate: resultDate?.toISOString()
        }),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.error)
        setIsSubmitting(false)
      } else {
        setSuccess(true)
        setTimeout(() => router.back(), 1500)
      }
    } catch {
      setError('Lỗi kết nối server')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005496]" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-16">
      
      {/* ══════ HEADER ══════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="w-9 h-9 rounded-xl border-slate-200 text-slate-500 hover:text-[#005496] hover:bg-[#005496]/5 hover:border-[#005496]/20">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Chỉnh sửa Đợt Tuyển sinh</h1>
            <p className="text-[14px] text-slate-500 font-medium mt-0.5">Cập nhật thông tin và lịch trình xét tuyển</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || success}
            size="sm"
            className="h-10 px-6 text-[14px] font-bold rounded-xl bg-[#005496] hover:bg-[#004377] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
             {success ? (
               <><Send className="w-4 h-4 mr-2" /> Đã cập nhật!</>
             ) : isSubmitting ? (
               <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang cập nhật...</>
             ) : (
               <><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</>
             )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-[14px] font-medium px-4 py-3 rounded-xl border border-rose-200 mb-6 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ══════ FORM CONTENT ══════ */}
      <div className="space-y-6">
        
        {/* Card: Thông tin cơ bản */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100/50">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-[15px] text-slate-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#005496]" /> Thông tin chung
            </h3>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[14px] font-semibold text-slate-700">Tên đợt tuyển sinh <span className="text-rose-500">*</span></label>
              <Input 
                name="name"
                placeholder="VD: Tuyển sinh Thạc sĩ Đợt 1 năm 2025" 
                className="h-11 rounded-xl border-slate-200 text-[15px] font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-700">Cấp bậc đào tạo <span className="text-rose-500">*</span></label>
              <Select value={formData.level} onValueChange={(val) => setFormData(prev => ({...prev, level: val}))}>
                <SelectTrigger className="h-11 border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="THAC_SI">Đào tạo Thạc sĩ</SelectItem>
                  <SelectItem value="TIEN_SI">Đào tạo Tiến sĩ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                Chỉ tiêu tuyển sinh <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  name="quota"
                  type="number"
                  min="1"
                  placeholder="VD: 150" 
                  className="h-11 pl-10 rounded-xl border-slate-200 text-[14px] font-medium"
                  value={formData.quota}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status Control */}
            <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
               <label className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                 Trạng thái hệ thống <span className="text-rose-500">*</span>
               </label>
               <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({...prev, status: val}))}>
                <SelectTrigger className="h-11 border-slate-200 rounded-xl text-[14px] font-medium text-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="OPEN">
                     <span className="flex items-center gap-2 text-emerald-600 font-bold"><Power className="w-4 h-4" /> ĐANG MỞ ĐĂNG KÝ ONLINE</span>
                  </SelectItem>
                  <SelectItem value="UPCOMING">
                     <span className="flex items-center gap-2 text-amber-600 font-bold"><CalendarIcon className="w-4 h-4" /> SẮP MỞ ĐĂNG KÝ</span>
                  </SelectItem>
                  <SelectItem value="CLOSED">
                     <span className="flex items-center gap-2 text-slate-600 font-bold"><X className="w-4 h-4" /> ĐÃ ĐÓNG ĐĂNG KÝ</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Card: Lịch trình */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100/50">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-[15px] text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#005496]" /> Lịch trình tuyển sinh
            </h3>
            <span className="text-[12px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Ngày mở đăng ký phải trước kết thúc
            </span>
          </div>
          <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700">Mở đăng ký <span className="text-rose-500">*</span></label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-medium border-slate-200 h-10 px-3 rounded-xl hover:bg-slate-50 text-[13px]", !openDate && "text-slate-400 bg-slate-50")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                    {openDate ? format(openDate, 'dd/MM/yyyy') : 'Ngày bắt đầu'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 rounded-xl shadow-xl" align="start">
                  <Calendar mode="single" selected={openDate} onSelect={setOpenDate} className="rounded-xl" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700">Đóng đăng ký <span className="text-rose-500">*</span></label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-medium border-slate-200 h-10 px-3 rounded-xl hover:bg-slate-50 text-[13px]", !closeDate && "text-slate-400 bg-slate-50")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                    {closeDate ? format(closeDate, 'dd/MM/yyyy') : 'Ngày kết thúc'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 rounded-xl shadow-xl" align="start">
                  <Calendar mode="single" selected={closeDate} onSelect={setCloseDate} className="rounded-xl" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700">Thi / Xét duyệt</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-medium border-slate-200 h-10 px-3 rounded-xl hover:bg-slate-50 text-[13px]", !examDate && "text-slate-400 bg-slate-50")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
                    {examDate ? format(examDate, 'dd/MM/yyyy') : 'Ngày thi'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 rounded-xl shadow-xl" align="start">
                  <Calendar mode="single" selected={examDate} onSelect={setExamDate} className="rounded-xl" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700">Công bố dự kiến</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-medium border-slate-200 h-10 px-3 rounded-xl hover:bg-slate-50 text-[13px]", !resultDate && "text-slate-400 bg-slate-50")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#005496]" />
                    {resultDate ? format(resultDate, 'dd/MM/yyyy') : 'Ngày công bố'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 rounded-xl shadow-xl" align="start">
                  <Calendar mode="single" selected={resultDate} onSelect={setResultDate} className="rounded-xl" />
                </PopoverContent>
              </Popover>
            </div>
            
          </div>
        </div>

        {/* Card: File đính kèm */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100/50">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-[15px] text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#005496]" /> Files đính kèm (Quy chế & Đề cương)
            </h3>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-slate-400" /> Thông báo tuyển sinh (PDF)
              </label>
              <div className="flex items-center gap-2">
                <Input 
                  name="brochureUrl"
                  placeholder="URL link hoặc tự động điền khi tải lên..." 
                  className="h-10 rounded-xl border-slate-200 text-[13px]"
                  value={formData.brochureUrl}
                  onChange={handleChange}
                />
                <Button variant="secondary" className="h-10 px-4 rounded-xl text-[13px] font-medium shrink-0 shadow-none">
                  Tải file
                </Button>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" /> Đề cương ôn tập (PDF/ZIP)
              </label>
              <div className="flex items-center gap-2">
                <Input 
                  name="syllabusUrl"
                  placeholder="URL link hoặc tự động điền khi tải lên..." 
                  className="h-10 rounded-xl border-slate-200 text-[13px]"
                  value={formData.syllabusUrl}
                  onChange={handleChange}
                />
                <Button variant="secondary" className="h-10 px-4 rounded-xl text-[13px] font-medium shrink-0 shadow-none">
                  Tải file
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
