'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  CalendarDays, Users, GraduationCap, Clock, ArrowRight, Timer, Search
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function TuyenSinhPage() {
  const [rounds, setRounds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/tuyen-sinh')
      .then(r => r.json())
      .then(json => { if (json.success) setRounds(json.data.rounds || []) })
      .finally(() => setLoading(false))
  }, [])

  const openRounds = rounds.filter(r => r.status === 'OPEN')
  const otherRounds = rounds.filter(r => r.status !== 'OPEN')

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[300px] py-12 md:py-0 md:min-h-[240px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003052]/90 via-[#003d6b]/85 to-[#005496]/80" />
        </div>
        <div className="relative z-10 vlu-news-container w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight mb-2">
              Tuyển sinh <span className="text-[#ffd200]">Sau đại học</span>
            </h1>
            <p className="text-white/65 text-[15px] font-medium max-w-lg">
              Viện Đào tạo Sau Đại học — Đại học Tài chính Marketing
            </p>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div className="absolute -top-2.5 -right-2.5 z-20">
               <span className="relative flex h-5 w-5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white"></span>
               </span>
            </div>
            <Link href="/tuyen-sinh/tra-cuu">
              <button className="bg-[#ffd200] hover:bg-[#ffdf4d] text-[#003052] px-6 md:px-8 py-3.5 rounded-xl font-extrabold text-[15px] flex items-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(255,210,0,0.4)] hover:shadow-[0_0_50px_rgba(255,210,0,0.6)] scale-100 hover:scale-105 group border-2 border-[#ffd200]">
                <div className="w-8 h-8 rounded-full bg-[#003052] flex items-center justify-center shrink-0 group-hover:-rotate-12 transition-transform duration-300">
                   <Search className="w-4 h-4 text-[#ffd200]" strokeWidth={3} /> 
                </div>
                <span className="tracking-wide uppercase">Tra cứu hồ sơ</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ROUNDS LIST */}
      <section className="py-10 bg-[#f8f9fb] min-h-[50vh]">
        <div className="vlu-news-container">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-t-[#005496] border-slate-200 rounded-full animate-spin" />
            </div>
          ) : rounds.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-[18px] font-bold text-slate-800 mb-2">Chưa có đợt tuyển sinh nào</h3>
              <p className="text-[14px] text-slate-500 font-medium">Vui lòng quay lại sau.</p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* ĐANG MỞ */}
              {openRounds.length > 0 && (
                <div>
                  <h2 className="text-[16px] font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Đang mở đăng ký
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {openRounds.map(round => <RoundCard key={round._id} round={round} />)}
                  </div>
                </div>
              )}

              {/* CÁC ĐỢT KHÁC */}
              {otherRounds.length > 0 && (
                <div>
                  {openRounds.length > 0 && (
                    <h2 className="text-[16px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                      Các đợt khác
                    </h2>
                  )}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {otherRounds.map(round => <RoundCard key={round._id} round={round} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

function RoundCard({ round }: { round: any }) {
  const isOpen = round.status === 'OPEN'
  const isUpcoming = round.status === 'UPCOMING'
  const now = new Date()
  const close = new Date(round.closeDate)
  const daysLeft = Math.max(0, Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md ${isOpen ? 'border-[#005496]/30 shadow-sm' : 'border-slate-200'}`}>
      {/* Color bar */}
      <div className={`h-1.5 ${isOpen ? 'bg-[#005496]' : isUpcoming ? 'bg-amber-400' : 'bg-slate-200'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${round.level === 'TIEN_SI' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
              <GraduationCap size={12} />{round.level === 'TIEN_SI' ? 'Tiến sĩ' : 'Thạc sĩ'}
            </span>
          </div>
          {isOpen && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Đang mở
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
              <Timer size={10} />Sắp mở
            </span>
          )}
        </div>

        <h3 className="text-[16px] font-bold text-slate-800 mb-3 leading-snug">{round.name}</h3>

        <div className="space-y-1.5 text-[13px] text-slate-600 font-medium mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-slate-400 shrink-0" />
            <span>{format(new Date(round.openDate), 'dd/MM/yyyy')} — {format(new Date(round.closeDate), 'dd/MM/yyyy')}</span>
          </div>
          {round.examDate && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400 shrink-0" />
              <span>Thi: {format(new Date(round.examDate), 'dd/MM/yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-400 shrink-0" />
            <span>Chỉ tiêu: <strong className="text-slate-800">{round.quota}</strong></span>
            {isOpen && daysLeft > 0 && (
              <span className="ml-auto text-[12px] font-bold text-rose-500">Còn {daysLeft} ngày</span>
            )}
          </div>
        </div>

        {isOpen ? (
          <Link href={`/tuyen-sinh/cao-hoc`}>
            <button className="w-full h-10 bg-[#005496] text-white font-bold text-[13px] rounded-lg hover:bg-[#004377] transition-all flex items-center justify-center gap-2">
              Đăng ký ngay <ArrowRight size={15} />
            </button>
          </Link>
        ) : (
          <button className="w-full h-10 bg-slate-100 text-slate-400 font-bold text-[13px] rounded-lg cursor-default" disabled>
            {isUpcoming ? 'Sắp mở đăng ký' : 'Đã kết thúc'}
          </button>
        )}
      </div>
    </div>
  )
}
