'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap, BookOpen, Clock, MapPin,
  Users, Flame, Search, Calendar, ChevronRight
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function ShortCoursesListPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/public/short-courses')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCourses(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />

      {/* ── HERO — same style as /tuyen-sinh ── */}
      <section className="relative overflow-hidden min-h-[300px] py-12 md:py-0 md:min-h-[240px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003052]/90 via-[#003d6b]/85 to-[#005496]/80" />
        </div>
        <div className="relative z-10 vlu-news-container w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight mb-2">
              Đào tạo <span className="text-[#ffd200]">Ngắn hạn</span>
            </h1>
            <p className="text-white/65 text-[15px] font-medium max-w-lg">
              Nâng cao năng lực chuyên môn với các khóa đào tạo chứng chỉ, bồi dưỡng nghiệp vụ từ Viện Đào tạo Sau Đại học.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
            <div className="relative">
              <div className="absolute -top-2.5 -right-2.5 z-20">
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white"></span>
                </span>
              </div>
              <Link href="/dao-tao-ngan-han/dang-ky">
                <button className="bg-[#ffd200] hover:bg-[#ffdf4d] text-[#003052] px-6 md:px-8 py-3.5 rounded-xl font-extrabold text-[15px] flex items-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(255,210,0,0.4)] hover:shadow-[0_0_50px_rgba(255,210,0,0.6)] scale-100 hover:scale-105 group border-2 border-[#ffd200]">
                  <div className="w-8 h-8 rounded-full bg-[#003052] flex items-center justify-center shrink-0 group-hover:-rotate-12 transition-transform duration-300">
                    <BookOpen className="w-4 h-4 text-[#ffd200]" strokeWidth={3} />
                  </div>
                  <span className="tracking-wide uppercase">Đăng ký ngay</span>
                </button>
              </Link>
            </div>
            <Link href="/dao-tao-ngan-han/tra-cuu">
              <button className="bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 text-white px-5 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all">
                <Search className="w-4 h-4" /> Tra cứu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── COURSES LIST ── */}
      <section className="py-10 bg-[#f8f9fb] min-h-[50vh]">
        <div className="vlu-news-container">

          {/* Search */}
          <div className="max-w-md mb-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
            <input
              type="text" placeholder="Tìm kiếm khóa học..."
              className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005496]/20 focus:border-[#005496] transition-all shadow-sm"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-t-[#005496] border-slate-200 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-[18px] font-bold text-slate-800 mb-2">
                {search ? 'Không tìm thấy khóa học' : 'Chưa có khóa học nào'}
              </h3>
              <p className="text-[14px] text-slate-500 font-medium">
                {search ? 'Vui lòng thử lại với từ khóa khác.' : 'Các khóa đào tạo ngắn hạn sẽ được cập nhật sớm.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course: any) => (
                <div key={course._id} className={`bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md ${course.isHot ? 'border-[#005496]/30 shadow-sm' : 'border-slate-200'}`}>
                  {/* Color bar */}
                  <div className={`h-1.5 ${course.isHot ? 'bg-[#e9202a]' : 'bg-[#005496]'}`} />

                  {/* Image */}
                  <div className="relative h-40 bg-gradient-to-br from-[#005496]/10 to-[#005496]/5 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-[#005496]/15" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {course.isHot && (
                        <span className="inline-flex items-center gap-1 bg-[#e9202a] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          <Flame className="w-3 h-3" /> Hot
                        </span>
                      )}
                      <span className="bg-white/90 backdrop-blur-sm text-[#005496] text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-widest border border-slate-200/50">
                        {course.code}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#005496] text-white text-[13px] font-bold px-3 py-1 rounded-lg shadow-lg">
                      {formatVND(course.price)}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-[16px] font-bold text-slate-800 mb-3 leading-snug line-clamp-2">{course.title}</h3>

                    {course.excerpt && (
                      <p className="text-[13px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">{course.excerpt}</p>
                    )}

                    {/* Info */}
                    <div className="space-y-1.5 text-[13px] text-slate-600 font-medium mb-4">
                      {course.duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400 shrink-0" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.schedule && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400 shrink-0" />
                          <span>{course.schedule}</span>
                        </div>
                      )}
                      {course.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span>{course.location}</span>
                        </div>
                      )}
                      {course.maxStudents > 0 && (
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400 shrink-0" />
                          <span>Chỉ tiêu: <strong className="text-slate-800">{course.currentStudents}/{course.maxStudents}</strong></span>
                        </div>
                      )}
                    </div>

                    <Link href="/dao-tao-ngan-han/dang-ky">
                      <button className="w-full h-10 bg-[#005496] text-white font-bold text-[13px] rounded-lg hover:bg-[#004377] transition-all flex items-center justify-center gap-2">
                        Đăng ký <ChevronRight size={15} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
