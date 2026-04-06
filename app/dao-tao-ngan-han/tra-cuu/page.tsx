'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, Phone, ShieldCheck, BookOpen, Clock, DollarSign,
  CheckCircle2, AlertCircle, Loader2, ArrowLeft, GraduationCap,
  Users, Building, ChevronRight, CreditCard
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function LookupPage() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'internal'>('lookup')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return setError('Vui lòng nhập số điện thoại')
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const res = await fetch('/api/public/short-courses/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const json = await res.json()
      if (json.success) {
        setResults(json.data)
      } else {
        setError(json.error || 'Không tìm thấy')
      }
    } catch {
      setError('Lỗi kết nối server')
    }
    setLoading(false)
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
            Tra cứu & <span className="text-[#ffd200]">Thanh toán</span>
          </h1>
          <p className="text-white/65 text-[15px] font-medium max-w-lg">
            Kiểm tra hồ sơ đăng ký và thông tin thanh toán khóa đào tạo ngắn hạn.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-[700px] mx-auto px-4 md:px-8">

          {/* Tab Switcher */}
          <div className="flex items-center gap-0 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm mb-8">
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === 'lookup'
                  ? 'bg-[#005496] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" /> Tra cứu / Thanh toán
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === 'internal'
                  ? 'bg-[#005496] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4" /> Nội bộ Nhà trường
            </button>
          </div>

          {activeTab === 'lookup' ? (
            <>
              {/* Lookup Tab */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-[15px] font-bold text-slate-800">Tra cứu hồ sơ đăng ký</h2>
                  <p className="text-[12px] text-slate-500 mt-0.5">Dành cho học viên đã đăng ký, muốn kiểm tra hồ sơ hoặc đóng học phí.</p>
                </div>
                <form onSubmit={handleSearch} className="p-6">
                  <div className="flex gap-3">
                    <div className="flex-1 relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
                      <input
                        type="tel" placeholder="Nhập số điện thoại đã đăng ký..."
                        className="w-full pl-11 pr-4 h-12 bg-[#f8fafc] border border-slate-200 rounded-xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496] transition-all"
                        value={phone} onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#005496] hover:bg-[#004377] text-white font-bold text-[14px] px-6 rounded-xl transition-all shadow-sm disabled:opacity-60 shrink-0"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-[13px] font-medium px-4 py-3 rounded-xl border border-rose-200 mb-6">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              {/* Results */}
              {results && results.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tìm thấy {results.length} đăng ký
                  </h3>
                  {results.map((reg: any) => (
                    <div key={reg._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mã đăng ký</span>
                          <p className="text-[18px] font-extrabold text-[#005496] font-mono tracking-widest">{reg.registrationCode}</p>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold ${
                          reg.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : reg.paymentStatus === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {reg.paymentStatus === 'PAID' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {reg.paymentStatus === 'PAID' ? 'Đã thanh toán' : reg.paymentStatus === 'CANCELLED' ? 'Đã hủy' : 'Chờ thanh toán'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[13px] text-slate-700">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="font-bold">{reg.lastName} {reg.firstName}</span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Lớp đã đăng ký</span>
                          <div className="space-y-1.5">
                            {reg.courses?.map((c: any) => (
                              <div key={c._id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-3.5 h-3.5 text-[#005496]" />
                                  <span className="text-[12px] font-bold text-slate-800">{c.title}</span>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase">{c.code}</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-700 tabular-nums">{formatVND(c.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[12px] font-semibold text-slate-500">Tổng học phí</span>
                          <span className="text-[18px] font-extrabold text-[#005496] tabular-nums">{formatVND(reg.totalFee)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Internal Tab */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-[15px] font-bold text-slate-800">Nội bộ Nhà trường</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Dành cho Giảng viên, Viên chức và NCS đang học tập và công tác tại Trường.</p>
              </div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#005496]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-[#005496]" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-800 mb-2">Đăng nhập hệ thống nội bộ</h3>
                <p className="text-[13px] text-slate-500 mb-6 max-w-sm mx-auto">
                  Vui lòng sử dụng tài khoản email nội bộ (@ufm.edu.vn) để truy cập hệ thống đăng ký dành cho cán bộ, giảng viên.
                </p>
                <a href="mailto:sdh@ufm.edu.vn"
                  className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#004377] text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-all shadow-sm">
                  Liên hệ Viện SĐH <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="text-center mt-8">
            <Link href="/dao-tao-ngan-han" className="inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-[#005496] font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Quay về trang Đào tạo Ngắn hạn
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
