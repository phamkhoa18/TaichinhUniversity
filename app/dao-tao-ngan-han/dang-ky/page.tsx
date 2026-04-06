'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap, User, Phone, Mail, Briefcase, Calendar,
  BookOpen, CheckCircle2, AlertCircle, ArrowLeft, Loader2,
  ShieldCheck, ChevronRight, Sparkles, DollarSign, PartyPopper
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function RegistrationPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ code: string; total: number; count: number } | null>(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    birthDate: '',
    phone: '',
    email: '',
    workplace: '',
  })

  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())

  // Captcha
  const [captchaA] = useState(() => Math.floor(Math.random() * 9) + 1)
  const [captchaB] = useState(() => Math.floor(Math.random() * 9) + 1)
  const [captchaAnswer, setCaptchaAnswer] = useState('')

  useEffect(() => {
    fetch('/api/public/short-courses')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCourses(json.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalFee = useMemo(() => {
    return courses
      .filter(c => selectedCourses.has(c._id))
      .reduce((sum, c) => sum + (c.price || 0), 0)
  }, [selectedCourses, courses])

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.lastName.trim() || !formData.firstName.trim()) return setError('Vui lòng nhập họ tên')
    if (!formData.phone.trim()) return setError('Vui lòng nhập số điện thoại')
    if (!formData.email.trim()) return setError('Vui lòng nhập email')
    if (selectedCourses.size === 0) return setError('Vui lòng chọn ít nhất 1 lớp')
    if (Number(captchaAnswer) !== captchaA + captchaB) return setError('Kết quả xác thực không đúng')

    setSubmitting(true)
    try {
      const res = await fetch('/api/public/short-courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate || undefined,
          courseIds: Array.from(selectedCourses),
        }),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess({
          code: json.data.registrationCode,
          total: json.data.totalFee,
          count: json.data.coursesCount,
        })
      } else {
        setError(json.error || 'Có lỗi xảy ra')
      }
    } catch {
      setError('Lỗi kết nối server')
    }
    setSubmitting(false)
  }

  // Success screen
  if (success) {
    return (
      <>
        <Header />
        <section className="min-h-[60vh] bg-[#f8f9fb] flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Đăng ký thành công!</h1>
            <p className="text-slate-500 text-[15px] mb-8">Cảm ơn bạn đã đăng ký. Vui lòng lưu lại mã đăng ký để tra cứu.</p>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mã đăng ký</span>
                <p className="text-[28px] font-extrabold text-[#005496] font-mono tracking-widest mt-1">{success.code}</p>
              </div>
              <div className="flex items-center justify-center gap-6 text-[14px] text-slate-600 font-medium">
                <span>{success.count} lớp</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="font-bold text-slate-800">{formatVND(success.total)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-700 font-medium mb-6">
              <p>Vui lòng liên hệ <strong>(028) 3822 5048</strong> hoặc email <strong>sdh@ufm.edu.vn</strong> để được hướng dẫn thanh toán.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dao-tao-ngan-han/tra-cuu"
                className="inline-flex items-center justify-center gap-2 bg-[#005496] hover:bg-[#004377] text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-all">
                <ShieldCheck className="w-4 h-4" /> Tra cứu hồ sơ
              </Link>
              <Link href="/dao-tao-ngan-han"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] px-6 py-3 rounded-xl transition-all">
                <ArrowLeft className="w-4 h-4" /> Về trang khóa học
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      {/* ── HERO — same style as /tuyen-sinh ── */}
      <section className="relative overflow-hidden min-h-[240px] py-10 md:py-0 md:min-h-[200px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003052]/90 via-[#003d6b]/85 to-[#005496]/80" />
        </div>
        <div className="relative z-10 vlu-news-container w-full">
          <h1 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight mb-2">
            Đăng ký <span className="text-[#ffd200]">Đào tạo Ngắn hạn</span>
          </h1>
          <p className="text-white/65 text-[15px] font-medium max-w-lg">
            Vui lòng điền đầy đủ thông tin và chọn các lớp bạn muốn đăng ký.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-[#eef2f7] pb-24 pt-8 md:pt-12 min-h-screen">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ─── LEFT COLUMN: User Information ─── */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-6 md:p-8 space-y-8">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-[13px] font-medium px-4 py-3 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              {/* ═══ 1. THÔNG TIN CÁ NHÂN ═══ */}
              <div>
                <SH>THÔNG TIN CÁ NHÂN</SH>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
                  <FI label="Họ và tên lót" required>
                    <In name="lastName" ph="VD: Nguyễn Văn" value={formData.lastName} onChange={handleChange} />
                  </FI>
                  <FI label="Tên" required>
                    <In name="firstName" ph="VD: A" value={formData.firstName} onChange={handleChange} />
                  </FI>
                  <FI label="Ngày sinh">
                    <input name="birthDate" type="date"
                      className="w-full h-10 px-3 text-[14px] text-slate-800 bg-[#f5f8fa] border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-[#005496] transition-all font-medium"
                      value={formData.birthDate} onChange={handleChange}
                    />
                  </FI>
                  <FI label="Số điện thoại" required>
                    <In name="phone" type="tel" ph="0901234567" value={formData.phone} onChange={handleChange} />
                  </FI>
                  <FI label="Email" required cls="sm:col-span-2">
                    <In name="email" type="email" ph="Nhập chính xác email để nhận thông báo" value={formData.email} onChange={handleChange} />
                  </FI>
                </div>
              </div>

              {/* ═══ 2. THÔNG TIN CÔNG TÁC ═══ */}
              <div>
                <SH>THÔNG TIN CÔNG TÁC</SH>
                <div className="grid grid-cols-1">
                  <FI label="Đơn vị công tác (nếu có)">
                    <In name="workplace" ph="Trường ĐH Tài chính - Marketing..." value={formData.workplace} onChange={handleChange} />
                  </FI>
                </div>
              </div>

              {/* ═══ 4. XÁC THỰC BẢO MẬT ═══ */}
              <div>
                <SH>XÁC THỰC BẢO MẬT</SH>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#f5f8fa] border border-slate-200 px-4 py-2 rounded-lg">
                    <span className="text-[18px] font-extrabold text-[#005496]">{captchaA}</span>
                    <span className="text-[14px] text-slate-400 font-bold">+</span>
                    <span className="text-[18px] font-extrabold text-[#005496]">{captchaB}</span>
                    <span className="text-[14px] text-slate-400 font-bold">=</span>
                  </div>
                  <In 
                    name="captcha" type="number" ph="Nhập kết quả" 
                    value={captchaAnswer} onChange={(e: any) => setCaptchaAnswer(e.target.value)} 
                  />
                </div>
              </div>

              {/* Tái xác nhận */}
              <div className="pt-2">
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  <em><span className="text-rose-500 font-bold">*</span> Tôi xin cam đoan thông tin đăng ký trên là hoàn toàn chính xác. Hệ thống sẽ tự động tổng hợp thông tin và gửi xác nhận qua email của bạn.</em>
                </p>
              </div>

            </div>

            {/* ─── RIGHT COLUMN: Course Selection & Checkout ─── */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden flex flex-col">
                <div className="px-5 py-4 bg-[#fafbfc] border-b border-slate-200 flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#005496]" />
                  <h2 className="text-[14px] font-bold text-[#005496] uppercase tracking-wide">Môn học đăng ký</h2>
                </div>

                <div className="p-4 max-h-[400px] overflow-y-auto cb-scroll">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-[#005496]" />
                    </div>
                  ) : courses.length === 0 ? (
                    <p className="text-center text-slate-500 py-8 text-[13px]">Hiện chưa có lớp nào đang mở đăng ký.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {courses.map(course => {
                        const isSelected = selectedCourses.has(course._id)
                        return (
                          <button
                            key={course._id}
                            type="button"
                            onClick={() => toggleCourse(course._id)}
                            className={`flex justify-between items-center w-full p-3.5 rounded-xl border text-left transition-all duration-200 group ${
                              isSelected
                                ? 'border-[#005496] bg-[#005496]/[0.03] shadow-sm'
                                : 'border-slate-100 bg-white hover:border-[#005496]/30 hover:bg-slate-50'
                            }`}
                          >
                            <div className="pr-3">
                              <h4 className={`text-[13px] font-bold mb-1 leading-snug ${isSelected ? 'text-[#005496]' : 'text-slate-800'}`}>{course.title}</h4>
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-[#f5f8fa] border border-slate-100 px-1.5 py-0.5 rounded-md">{course.code}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-[#005496] border-[#005496]' : 'border-slate-300 bg-[#f5f8fa] group-hover:bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-[#f8fafc] border-t border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[13px] text-slate-500 font-bold">Đã chọn ({selectedCourses.size} lớp)</span>
                    <span className="text-[20px] font-black text-[#e9202a]">{formatVND(totalFee)}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-slate-300 mb-4" />

                  <button 
                    type="submit" 
                    disabled={submitting || selectedCourses.size === 0} 
                    className="flex justify-center items-center w-full h-11 rounded-xl bg-[#005496] hover:bg-[#004377] text-white font-bold text-[14px] shadow-lg shadow-[#005496]/15 disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang xử lý...</> : <><Sparkles className="w-4 h-4 mr-2" />Gửi hồ sơ đăng ký</>}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}

/* ═══ Compact shared components ═══ */
function SH({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="flex-1 border-t border-dashed border-slate-300" />
      <h2 className="text-[14px] md:text-[15px] font-bold text-[#005496] uppercase tracking-wider shrink-0">{children}</h2>
      <div className="flex-1 border-t border-dashed border-slate-300" />
    </div>
  )
}

function FI({ label, required, children, cls = '' }: { label: string; required?: boolean; children: React.ReactNode; cls?: string }) {
  return <div className={`space-y-1.5 ${cls}`}>{label && <label className="text-[12px] font-bold text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</label>}{children}</div>
}

function In({ name, ph, type = 'text', value, onChange }: { name: string; ph?: string; type?: string; value: string; onChange: any }) {
  return <input name={name} type={type} placeholder={ph} value={value} onChange={onChange} className="w-full h-10 px-3 text-[14px] text-slate-800 bg-[#f5f8fa] border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] transition-all placeholder:text-slate-400 font-medium" />
}
