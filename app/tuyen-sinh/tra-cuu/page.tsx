'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  Search, Loader2, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Dữ liệu mapping trạng thái sang style chuyên nghiệp trong bảng
const STATUS_MAP: Record<string, { label: string; text: string; bg: string }> = {
  PENDING:       { label: 'Chờ xét duyệt', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  QUALIFIED:     { label: 'Đủ điều kiện', text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  ADMITTED:      { label: 'Trúng tuyển', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  NOT_QUALIFIED: { label: 'Không đủ ĐK', text: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
  REJECTED:      { label: 'Từ chối / Hủy', text: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
}

export default function TraCuuHoSoPage() {
  const [rounds, setRounds] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loadingInit, setLoadingInit] = useState(true)

  const [roundId, setRoundId] = useState('')
  const [query, setQuery] = useState('')
  
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/public/tuyen-sinh')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setRounds(json.data.rounds || [])
          setPrograms(json.data.programs || [])
          
          const openR = json.data.rounds?.find((r:any) => r.status === 'OPEN')
          if (openR) setRoundId(openR._id)
          else if (json.data.rounds?.length > 0) setRoundId(json.data.rounds[0]._id)
        }
      })
      .finally(() => setLoadingInit(false))
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roundId || !query.trim()) {
      setErrorMsg('Vui lòng chọn đợt đăng ký và nhập thông tin tra cứu!')
      return
    }
    
    setIsSearching(true)
    setErrorMsg('')
    setHasSearched(true)
    
    try {
      const res = await fetch(`/api/public/tuyen-sinh/tra-cuu?roundId=${roundId}&q=${encodeURIComponent(query.trim())}`)
      const json = await res.json()
      
      if (json.success) {
        setResults(json.data || [])
      } else {
        setErrorMsg(json.error || 'Lỗi hệ thống.')
        setResults([])
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('Lỗi kết nối máy chủ.')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const getProgramName = (id: string) => {
    const p = programs.find(x => x._id === id || x.slug === id)
    return p ? p.name : '—'
  }

  const formatGender = (gender: string) => {
     if (gender === 'MALE') return 'Nam'
     if (gender === 'FEMALE') return 'Nữ'
     return 'Khác'
  }

  const maskPhone = (phone?: string) => {
     if (!phone || phone.length < 5) return '—'
     return phone.substring(0, 3) + '****' + phone.substring(phone.length - 3)
  }

  const maskEmail = (email?: string) => {
     if (!email || !email.includes('@')) return '—'
     const parts = email.split('@')
     return parts[0].substring(0, 3) + '***@' + parts[1]
  }

  return (
    <>
      <Header />
      
      <main className="min-h-[85vh] bg-white pt-8 pb-20">
        <div className="vlu-news-container max-w-[1100px] border border-slate-200 mt-6 md:mt-10 mb-8 bg-white shadow-xl shadow-slate-200/40 rounded-xl overflow-hidden p-6 md:p-12 relative">
           
           <Link href="/tuyen-sinh" className="absolute top-6 left-6 text-slate-400 hover:text-[#005496] flex items-center gap-1 text-[13px] font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Tuyển sinh
           </Link>

           {/* 1. SECTION HEADING */}
           <div className="text-center mb-10 mt-4 md:mt-0">
             <h1 className="text-[26px] md:text-[30px] font-bold text-[#003052] uppercase tracking-wide leading-tight">
                Tra cứu <br className="hidden md:block"/> tình trạng hồ sơ dự thi
             </h1>
             <div className="w-16 h-[3px] bg-[#005496] mx-auto mt-4 rounded-full" />
           </div>

           {/* 2. SECTION INSTRUCTIONS */}
           <div className="mb-8">
              <h3 className="font-bold italic text-slate-800 text-[15px] mb-1.5">Ghi chú:</h3>
              <p className="italic text-slate-600 text-[14px]">
                 - Thí sinh chọn đợt đăng ký sau đó nhập Mã đăng ký, Họ tên, CCCD, Số điện thoại hoặc Email để tra cứu hồ sơ dự thi.
              </p>
           </div>

           {/* 3. SECTION SEARCH FORM */}
           <div className="max-w-3xl border-b border-slate-100 pb-10 mb-8">
              {errorMsg && (
                 <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[14px] font-medium animate-in fade-in">
                    {errorMsg}
                 </div>
              )}
              
              <form onSubmit={handleSearch} className="flex flex-col gap-5">
                 {/* Đợt đăng ký */}
                 <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <label className="md:w-36 text-[14px] font-bold text-slate-700 text-left">Đợt đăng ký (*):</label>
                    <div className="flex-1 max-w-sm">
                       <Select value={roundId} onValueChange={setRoundId} disabled={loadingInit || isSearching}>
                         <SelectTrigger className="h-10 text-[14px] bg-white border-slate-300">
                            <SelectValue placeholder="--- Chọn đợt đăng ký ---" />
                         </SelectTrigger>
                         <SelectContent>
                            {rounds.map(r => <SelectItem key={r._id} value={r._id} className="text-[14px] py-2">{r.name}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                 </div>

                 {/* Tra cứu */}
                 <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <label className="md:w-36 text-[14px] font-bold text-slate-700 text-left">Tra cứu (*):</label>
                    <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-start max-w-2xl">
                       <Input 
                         value={query} 
                         onChange={(e) => setQuery(e.target.value)}
                         placeholder="(Mã đăng ký, Họ tên, CCCD, SĐT hoặc Email)" 
                         className="h-10 text-[14px] bg-white border-slate-300"
                         disabled={loadingInit || isSearching}
                       />
                       <Button 
                         type="submit" 
                         disabled={isSearching || !query || !roundId} 
                         className="h-10 rounded-full px-8 bg-[#005496] hover:bg-[#003052] font-semibold text-white shadow-md w-full sm:w-auto"
                       >
                          {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Tra cứu
                       </Button>
                    </div>
                 </div>
              </form>
           </div>

           {/* 4. SECTION TABLE RESULTS */}
           <div>
              <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="bg-[#005496] text-white">
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Mã đăng ký</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Họ tên</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Giới tính</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Ngày sinh</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Số di động</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Email</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] max-w-[200px]">Chuyên ngành</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Tình trạng</th>
                          <th className="py-3 px-4 text-[13px] font-semibold tracking-wide border-r border-[#004377] whitespace-nowrap">Nộp lệ phí</th>
                       </tr>
                    </thead>
                    <tbody>
                       {(!hasSearched || results.length === 0) ? (
                          <tr>
                             <td colSpan={9} className="py-8 text-center text-[14px] text-slate-500 italic bg-white">
                                {isSearching ? (
                                   <div className="flex items-center justify-center gap-2 text-[#005496]">
                                      <Loader2 className="w-5 h-5 animate-spin" /> Đang tra cứu...
                                   </div>
                                ) : "Không tìm thấy dữ liệu..."}
                             </td>
                          </tr>
                       ) : (
                          results.map((app, index) => {
                             const st = STATUS_MAP[app.status] || STATUS_MAP.PENDING
                             return (
                                <tr key={app._id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                   <td className="py-3 px-4 text-[13px] font-medium text-slate-800 border-r border-slate-200">
                                      {app._id.toString().substring(app._id.length - 8).toUpperCase()} {/* View truncated ID for cleaner look */}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] font-bold text-[#005496] border-r border-slate-200 whitespace-nowrap">
                                      {app.fullName}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] text-slate-600 border-r border-slate-200 text-center">
                                      {formatGender(app.gender)}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] text-slate-600 border-r border-slate-200 whitespace-nowrap text-center">
                                      {app.dateOfBirth ? format(new Date(app.dateOfBirth), 'dd/MM/yyyy') : '—'}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] text-slate-600 border-r border-slate-200 text-center">
                                      {maskPhone(app.phone)}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] text-slate-600 border-r border-slate-200">
                                      {maskEmail(app.email)}
                                   </td>
                                   <td className="py-3 px-4 text-[13px] font-medium text-slate-800 border-r border-slate-200 max-w-[200px] truncate" title={getProgramName(app.programId)}>
                                      {getProgramName(app.programId)}
                                   </td>
                                   <td className="py-3 px-4 text-center border-r border-slate-200">
                                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase rounded border ${st.bg} ${st.text} whitespace-nowrap`}>
                                         {st.label}
                                      </span>
                                   </td>
                                   <td className="py-3 px-4 text-center text-[13px] font-bold text-slate-400 border-slate-200">
                                      —
                                   </td>
                                </tr>
                             )
                          })
                       )}
                    </tbody>
                 </table>
              </div>
              
              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden flex flex-col gap-4">
                 {(!hasSearched || results.length === 0) ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-center text-[14px] text-slate-500 italic bg-slate-50 border border-slate-200 rounded-xl">
                       {isSearching ? <><Loader2 className="w-5 h-5 animate-spin text-[#005496] mb-1" /> Đang tra cứu...</> : 'Không tìm thấy dữ liệu...'}
                    </div>
                 ) : (
                    results.map((app) => {
                       const st = STATUS_MAP[app.status] || STATUS_MAP.PENDING
                       return (
                          <div key={app._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                             <div className="bg-[#005496] px-4 py-3 flex items-center justify-between">
                                <div className="text-white text-[12px] font-medium tracking-wide">Mã: {app._id.toString().substring(app._id.length - 8).toUpperCase()}</div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${st.bg} ${st.text}`}>{st.label}</span>
                             </div>
                             <div className="p-4 space-y-3.5">
                                <div>
                                   <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Họ và tên</div>
                                   <div className="text-[16px] font-bold text-[#005496]">{app.fullName}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Ngày sinh</div>
                                      <div className="text-[13px] font-medium text-slate-700">{app.dateOfBirth ? format(new Date(app.dateOfBirth), 'dd/MM/yyyy') : '—'}</div>
                                   </div>
                                   <div>
                                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Giới tính</div>
                                      <div className="text-[13px] font-medium text-slate-700">{formatGender(app.gender)}</div>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Số ĐT</div>
                                      <div className="text-[13px] font-medium text-slate-700">{maskPhone(app.phone)}</div>
                                   </div>
                                   <div>
                                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Email</div>
                                      <div className="text-[13px] font-medium text-slate-700">{maskEmail(app.email)}</div>
                                   </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                   <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Chuyên ngành</div>
                                   <div className="text-[13px] font-bold text-slate-800 leading-snug">{getProgramName(app.programId)}</div>
                                </div>
                             </div>
                          </div>
                       )
                    })
                 )}
              </div>

              {/* 5. SECTION PAGINATION */}
              <div className="flex items-center justify-end gap-1 mt-6">
                 <Button variant="ghost" disabled className="text-[13px] text-slate-500 hover:text-slate-800 h-8 px-3">
                    Previous
                 </Button>
                 <Button variant="ghost" disabled className="text-[13px] text-slate-500 hover:text-slate-800 h-8 px-3">
                    Next
                 </Button>
              </div>
           </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
