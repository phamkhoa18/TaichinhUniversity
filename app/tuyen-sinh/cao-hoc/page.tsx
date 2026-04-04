'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  ChevronRight, Loader2, AlertCircle, CheckCircle2, Send, Upload, Eye,
  Trash2, Calendar as CalendarLucide, GraduationCap, Check, X, ChevronsUpDown
} from 'lucide-react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface Addr { code: number; name: string }

const ETHNICITIES = ['Kinh','Tày','Thái','Mường','Khmer','Hmông','Nùng','Hoa','Dao','Gia Rai','Ê Đê','Ba Na','Xơ Đăng','Sán Chay','Cơ Ho','Chăm','Sán Dìu','Hrê','Ra Glai','Mnông','Khác']
const DEG_SYS = ['Chính quy','Vừa làm vừa học','Liên thông','Từ xa','Bằng 2','Khác']
const DEG_CLS = ['Xuất sắc','Giỏi','Khá','Trung bình khá','Trung bình']

const DOCS = [
  { key: 'photoUrl', label: 'Ảnh thẻ 3x4', req: true, accept: 'image/*' },
  { key: 'diplomaUrl', label: 'Bằng tốt nghiệp ĐH', req: true, accept: 'image/*,.pdf' },
  { key: 'transcriptUrl', label: 'Bảng điểm ĐH', req: true, accept: 'image/*,.pdf' },
  { key: 'idCardUrl', label: 'CCCD/CMND (2 mặt)', req: true, accept: 'image/*,.pdf' },
  { key: 'foreignLanguageCertUrl', label: 'Chứng chỉ ngoại ngữ', req: false, accept: 'image/*,.pdf' },
  { key: 'cvUrl', label: 'CV / Lý lịch khoa học', req: false, accept: 'image/*,.pdf,.doc,.docx' },
]

export default function DangKyTuyenSinhPage() {
  const formRef = useRef<HTMLDivElement>(null)
  
  const [rounds, setRounds] = useState<any[]>([])
  const [roundId, setRoundId] = useState('')
  const [round, setRound] = useState<any>(null)
  
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})

  const [provs, setProvs] = useState<Addr[]>([])
  const [dists, setDists] = useState<Addr[]>([])
  const [wards, setWards] = useState<Addr[]>([])
  const [selProv, setSelProv] = useState('')
  const [selDist, setSelDist] = useState('')
  const [selWard, setSelWard] = useState('')
  const [dob, setDob] = useState<Date | undefined>()
  const [idDate, setIdDate] = useState<Date | undefined>()
  const [uploads, setUploads] = useState<Record<string, { url: string; name: string }>>({})
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  const [f, setF] = useState({
    fullName: '', gender: '', birthPlace: '', ethnicity: 'Kinh', nationality: 'Việt Nam',
    idCard: '', idCardPlace: '', phone: '', email: '', address: '',
    occupation: '', workplace: '', position: '',
    degreeSchool: '', degreeCountry: 'Việt Nam', degreeSystem: '',
    degreeMajor: '', degreeSpecialization: '', degreeYear: '',
    degreeClassification: '', degreeGpa: '', isAlumni: false,
    programId: '', entranceExamSubject: '', orientation: '', supplementaryKnowledge: false,
  })

  useEffect(() => { 
    fetch('/api/public/tuyen-sinh')
      .then(r => r.json())
      .then(j => { 
        if (j.success) { 
          const allRounds = j.data.rounds || []
          const openRounds = allRounds.filter((r: any) => r.status === 'OPEN')
          setRounds(openRounds)
          if (openRounds.length > 0) {
            setRoundId(openRounds[0]._id)
            setRound(openRounds[0])
          }
          setPrograms(j.data.programs || []) 
        } 
      })
      .finally(() => setLoading(false)) 
  }, [])
  
  useEffect(() => { fetch('https://provinces.open-api.vn/api/p/').then(r => r.json()).then(setProvs).catch(() => { }) }, [])
  useEffect(() => { if (!selProv) { setDists([]); setWards([]); return } setSelDist(''); setSelWard(''); setDists([]); setWards([]); fetch(`https://provinces.open-api.vn/api/p/${selProv}?depth=2`).then(r => r.json()).then(d => setDists(d.districts || [])).catch(() => { }) }, [selProv])
  useEffect(() => { if (!selDist) { setWards([]); return } setSelWard(''); setWards([]); fetch(`https://provinces.open-api.vn/api/d/${selDist}?depth=2`).then(r => r.json()).then(d => setWards(d.wards || [])).catch(() => { }) }, [selDist])

  const ch = (e: React.ChangeEvent<HTMLInputElement>) => { setF(p => ({ ...p, [e.target.name]: e.target.value })); clr(e.target.name) }
  const sf = (n: string, v: string) => { setF(p => ({ ...p, [n]: v })); clr(n) }
  const clr = (k: string) => { if (errs[k]) setErrs(p => { const n = { ...p }; delete n[k]; return n }) }

  const handleUpload = async (key: string, file: File) => {
    setUploadingKey(key); try { const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/public/tuyen-sinh/upload', { method: 'POST', body: fd }); const j = await r.json()
    if (j.success) { setUploads(p => ({ ...p, [key]: { url: j.url, name: j.originalName } })); clr(key) } else setError(j.error || 'Upload thất bại')
    } catch { setError('Lỗi upload') } finally { setUploadingKey(null) } }
  const rmUp = (k: string) => setUploads(p => { const n = { ...p }; delete n[k]; return n })

  const pN = () => provs.find(p => String(p.code) === selProv)?.name || ''
  const dN = () => dists.find(d => String(d.code) === selDist)?.name || ''
  const wN = () => wards.find(w => String(w.code) === selWard)?.name || ''

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!roundId) e.roundId = 'Bắt buộc'
    if (!f.fullName.trim()) e.fullName = 'Bắt buộc'
    if (!dob) e.dob = 'Bắt buộc'
    if (!f.gender) e.gender = 'Bắt buộc'
    if (!f.idCard.trim()) e.idCard = 'Bắt buộc'
    else if (!/^\d{9,12}$/.test(f.idCard.trim())) e.idCard = 'CCCD 9-12 số'
    if (!f.phone.trim()) e.phone = 'Bắt buộc'
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'SĐT không hợp lệ'
    if (!f.email.trim()) e.email = 'Bắt buộc'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email không hợp lệ'
    if (!selProv) e.province = 'Bắt buộc'
    if (!f.degreeSchool.trim()) e.degreeSchool = 'Bắt buộc'
    if (!f.degreeMajor.trim()) e.degreeMajor = 'Bắt buộc'
    if (!f.degreeYear) e.degreeYear = 'Bắt buộc'
    if (!f.programId) e.programId = 'Chọn ngành dự tuyển'
    DOCS.forEach(d => { if (d.req && !uploads[d.key]) e[d.key] = 'Bắt buộc' })
    setErrs(e)
    if (Object.keys(e).length > 0) { const el = formRef.current?.querySelector('[data-error="true"]'); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return; setSubmitting(true); setError('')
    try {
      const payload = { roundId, programId: f.programId, fullName: f.fullName.trim(), dateOfBirth: dob?.toISOString(), birthPlace: f.birthPlace || pN(), gender: f.gender, ethnicity: f.ethnicity, nationality: f.nationality, idCard: f.idCard.trim(), idCardDate: idDate?.toISOString(), idCardPlace: f.idCardPlace, phone: f.phone.trim(), email: f.email.trim().toLowerCase(), address: [f.address, wN(), dN(), pN()].filter(Boolean).join(', '), province: pN(), district: dN(), ward: wN(), occupation: f.occupation, workplace: f.workplace, position: f.position, degreeSchool: f.degreeSchool.trim(), degreeCountry: f.degreeCountry, degreeSystem: f.degreeSystem, degreeMajor: f.degreeMajor.trim(), degreeSpecialization: f.degreeSpecialization, degreeYear: Number(f.degreeYear), degreeClassification: f.degreeClassification, degreeGpa: f.degreeGpa ? Number(f.degreeGpa) : undefined, isAlumni: f.isAlumni, entranceExamSubject: f.entranceExamSubject, orientation: f.orientation, supplementaryKnowledge: f.supplementaryKnowledge, photoUrl: uploads.photoUrl?.url, diplomaUrl: uploads.diplomaUrl?.url, transcriptUrl: uploads.transcriptUrl?.url, idCardUrl: uploads.idCardUrl?.url, cvUrl: uploads.cvUrl?.url, foreignLanguageCertUrl: uploads.foreignLanguageCertUrl?.url }
      const res = await fetch('/api/public/tuyen-sinh/dang-ky', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json(); if (!j.success) { setError(j.error); setSubmitting(false) } else { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    } catch { setError('Lỗi kết nối'); setSubmitting(false) }
  }

  if (loading) return (<><Header /><div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-[#005496] border-slate-200 rounded-full animate-spin" /></div><Footer /></>)
  
  if (rounds.length === 0) return (<><Header /><div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"><AlertCircle className="w-16 h-16 text-slate-300 mb-4" /><h2 className="text-[24px] font-bold text-slate-800 mb-2">Chưa có đợt tuyển sinh nào đang mở</h2><Link href="/tuyen-sinh"><Button className="rounded-xl bg-[#005496] mt-4">Quay lại</Button></Link></div><Footer /></>)
  
  if (submitted) return (<><Header /><section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-white py-20"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center bg-white rounded-3xl border shadow-xl p-10"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></motion.div><h2 className="text-[26px] font-bold text-slate-800 mb-3">Đăng ký thành công! 🎉</h2><p className="text-[15px] text-slate-500 mb-6">Hồ sơ đã được gửi. Chúng tôi sẽ thông báo qua <strong className="text-slate-700">{f.email}</strong>.</p><div className="flex gap-3"><Link href="/tuyen-sinh" className="flex-1"><Button variant="outline" className="w-full h-11 rounded-xl font-bold">Trang tuyển sinh</Button></Link><Link href="/" className="flex-1"><Button className="w-full h-11 rounded-xl bg-[#005496] font-bold">Về trang chủ</Button></Link></div></motion.div></section><Footer /></>)

  return (
    <><Header />
      {/* HERO */}
      <section className="relative overflow-hidden h-[180px] md:h-[220px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003052]/90 via-[#003d6b]/85 to-[#005496]/80" />
        </div>
        <div className="relative z-10 vlu-news-container w-full max-w-6xl mx-auto px-6">
          <h1 className="text-[26px] md:text-[34px] font-bold text-white tracking-tight mb-2 uppercase">
            Đăng ký <span className="text-[#ffd200]">Xét tuyển Cao Học</span>
          </h1>
          <p className="text-white/80 text-[14px] md:text-[15px] font-medium">
            Điền form bên dưới để nộp hồ sơ xét tuyển trực tuyến
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-8 bg-[#eef2f7] min-h-screen">
        <div className="max-w-6xl mx-auto px-6" ref={formRef}>
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden">

            {error && <div className="bg-rose-50 text-rose-600 text-[14px] font-medium px-8 py-3 border-b border-rose-200 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

            <div className="px-8 py-6 space-y-8">

              {/* ═══ 0. ĐỢT TUYỂN SINH ═══ */}
              <div>
                <SH>CHỌN ĐỢT TUYỂN SINH</SH>
                 <div className="grid grid-cols-1 md:grid-cols-2">
                    <FI label="Đợt đăng ký dự thi" required>
                      <Sel 
                        value={roundId} 
                        onChange={(v) => { 
                           setRoundId(v); 
                           setRound(rounds.find(r => r._id === v));
                           clr('roundId');
                        }} 
                        ph="Chọn đợt tuyển sinh đang mở" 
                        opts={rounds.map(r => ({ v: r._id, l: `${r.name} (${r.level === 'TIEN_SI' ? 'Tiến sĩ' : 'Thạc sĩ'})` }))} 
                        error={errs.roundId}
                      />
                    </FI>
                 </div>
              </div>

              {/* ═══ 1. THÔNG TIN THÍ SINH ═══ */}
              <div>
                <SH>THÔNG TIN THÍ SINH</SH>
                <p className="text-[13px] text-slate-500 mb-5"><span className="text-rose-500 font-bold">*</span> <em>Thí sinh bắt buộc điền đầy đủ những mục có dấu (*)</em></p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                  <FI label="Họ và tên" required cls="col-span-2"><In name="fullName" ph="NGUYỄN VĂN A" value={f.fullName} onChange={ch} error={errs.fullName} /></FI>
                  <FI label="Giới tính" required><Sel value={f.gender} onChange={v => { sf('gender', v); clr('gender') }} ph="Chọn" opts={[{ v: 'MALE', l: 'Nam' }, { v: 'FEMALE', l: 'Nữ' }]} error={errs.gender} /></FI>
                  <FI label="Ngày sinh" required><DP date={dob} onSelect={d => { setDob(d); clr('dob') }} from={1950} to={new Date().getFullYear() - 20} error={errs.dob} /></FI>

                  <FI label="Nơi sinh"><SearchableSel value={f.birthPlace} onChange={v => sf('birthPlace', v)} ph="Chọn tỉnh/TP" opts={provs.map(p => ({ v: p.name, l: p.name }))} /></FI>
                  <FI label="Dân tộc"><Sel value={f.ethnicity} onChange={v => sf('ethnicity', v)} ph="Kinh" opts={ETHNICITIES.map(e => ({ v: e, l: e }))} /></FI>
                  <FI label="Điện thoại" required><In name="phone" ph="0901234567" value={f.phone} onChange={ch} error={errs.phone} /></FI>
                  <FI label="Quốc tịch"><In name="nationality" value={f.nationality} onChange={ch} /></FI>

                  <FI label="Số CMND/CCCD" required><In name="idCard" ph="001234567890" value={f.idCard} onChange={ch} error={errs.idCard} /></FI>
                  <FI label="Ngày cấp CMND/CCCD"><DP date={idDate} onSelect={setIdDate} from={2000} to={new Date().getFullYear()} /></FI>
                  <FI label="Nơi cấp CMND/CCCD" cls="col-span-2"><In name="idCardPlace" ph="Cục trưởng Cục Cảnh sát..." value={f.idCardPlace} onChange={ch} /></FI>

                  <FI label="Tỉnh/Thành phố" required><SearchableSel value={selProv} onChange={v => { setSelProv(v); clr('province') }} ph="Chọn tỉnh/TP" opts={provs.map(p => ({ v: String(p.code), l: p.name }))} error={errs.province} /></FI>
                  <FI label="Quận/Huyện"><SearchableSel value={selDist} onChange={setSelDist} ph={selProv ? "Chọn" : "Chọn tỉnh"} opts={dists.map(d => ({ v: String(d.code), l: d.name }))} disabled={!selProv} /></FI>
                  <FI label="Phường/Xã"><SearchableSel value={selWard} onChange={setSelWard} ph={selDist ? "Chọn" : "Chọn quận"} opts={wards.map(w => ({ v: String(w.code), l: w.name }))} disabled={!selDist} /></FI>
                  <FI label="Số nhà, đường"><In name="address" ph="123 Nguyễn Văn Bảo" value={f.address} onChange={ch} /></FI>

                  <FI label="Email" required cls="col-span-2"><In name="email" type="email" ph="Thí sinh cần ghi chính xác email đang sử dụng" value={f.email} onChange={ch} error={errs.email} /></FI>
                  <FI label="Nghề nghiệp"><In name="occupation" ph="Kế toán" value={f.occupation} onChange={ch} /></FI>
                  <FI label="Cơ quan công tác"><In name="workplace" ph="Công ty ABC" value={f.workplace} onChange={ch} /></FI>
                </div>
              </div>

              {/* ═══ 2. QUÁ TRÌNH ĐÀO TẠO ═══ */}
              <div>
                <SH>QUÁ TRÌNH ĐÀO TẠO</SH>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                  <FI label="Cơ sở đào tạo" required cls="col-span-2"><In name="degreeSchool" ph="VD: Trường ĐH Tài chính - Marketing" value={f.degreeSchool} onChange={ch} error={errs.degreeSchool} /></FI>
                  <FI label="Quốc gia đào tạo"><In name="degreeCountry" value={f.degreeCountry} onChange={ch} /></FI>
                  <FI label="Hệ đào tạo (ghi trên bằng)"><Sel value={f.degreeSystem} onChange={v => sf('degreeSystem', v)} ph="Chọn hệ ĐT" opts={DEG_SYS.map(s => ({ v: s, l: s }))} /></FI>

                  <FI label="Ngành tốt nghiệp" required><In name="degreeMajor" ph="Tài chính - Ngân hàng" value={f.degreeMajor} onChange={ch} error={errs.degreeMajor} /></FI>
                  <FI label="Chuyên ngành tốt nghiệp"><In name="degreeSpecialization" ph="Tài chính doanh nghiệp" value={f.degreeSpecialization} onChange={ch} /></FI>
                  <FI label="Năm tốt nghiệp" required><In name="degreeYear" type="number" ph="2024" value={f.degreeYear} onChange={ch} error={errs.degreeYear} /></FI>
                  <FI label="Xếp loại tốt nghiệp"><Sel value={f.degreeClassification} onChange={v => sf('degreeClassification', v)} ph="Chọn xếp loại" opts={DEG_CLS.map(c => ({ v: c, l: c }))} /></FI>

                  <FI label="GPA"><In name="degreeGpa" type="number" step="0.01" ph="3.50" value={f.degreeGpa} onChange={ch} /></FI>
                  <FI label="" cls="flex items-end pb-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group h-10">
                      <input type="checkbox" checked={f.isAlumni} onChange={e => setF(p => ({ ...p, isAlumni: e.target.checked }))} className="w-[18px] h-[18px] rounded border-slate-300 text-[#005496] focus:ring-[#005496]/30" />
                      <span className="text-[13px] font-semibold text-slate-700 group-hover:text-[#005496]">Cựu sinh viên UFM</span>
                    </label>
                  </FI>
                </div>
              </div>

              {/* ═══ 3. THÔNG TIN ĐĂNG KÝ ═══ */}
              <div>
                <SH>THÔNG TIN ĐĂNG KÝ</SH>
                <div className="space-y-4">
                  <FI label="Ngành đăng ký xét tuyển" required>
                    {errs.programId && <ErrMsg msg={errs.programId} />}
                    {/* Select Ngành Học Trực Tiếp */}
                    <div className="max-w-2xl mt-1">
                       <Sel 
                         value={f.programId} 
                         onChange={(v) => { sf('programId', v); clr('programId') }} 
                         ph="--- Chọn ngành học ---" 
                         opts={programs.map(p => ({ v: p._id || p.slug, l: `${p.name} ${p.programCode ? `(Mã: ${p.programCode})` : ''}` }))} 
                         error={errs.programId}
                       />
                    </div>
                  </FI>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4">
                    <FI label="Ngoại ngữ đầu vào"><Sel value={f.entranceExamSubject} onChange={v => sf('entranceExamSubject', v)} ph="Chọn ngoại ngữ" opts={[{ v: 'Tiếng Anh', l: 'Tiếng Anh' }, { v: 'Tiếng Pháp', l: 'Tiếng Pháp' }, { v: 'Tiếng Trung', l: 'Tiếng Trung' }, { v: 'Miễn thi', l: 'Miễn thi (có CC)' }]} /></FI>
                    <FI label="Định hướng"><Sel value={f.orientation} onChange={v => sf('orientation', v)} ph="Chọn định hướng" opts={[{ v: 'Ứng dụng', l: 'Ứng dụng' }, { v: 'Nghiên cứu', l: 'Nghiên cứu' }]} /></FI>
                    <FI label="" cls="flex items-end pb-1 col-span-2">
                      <label className="flex items-center gap-2.5 cursor-pointer group h-10">
                        <input type="checkbox" checked={f.supplementaryKnowledge} onChange={e => setF(p => ({ ...p, supplementaryKnowledge: e.target.checked }))} className="w-[18px] h-[18px] rounded border-slate-300 text-[#005496] focus:ring-[#005496]/30" />
                        <span className="text-[13px] font-semibold text-slate-700 group-hover:text-[#005496]">Đăng ký bổ sung kiến thức</span>
                      </label>
                    </FI>
                  </div>
                </div>
              </div>

              {/* ═══ 4. FILE HỒ SƠ ═══ */}
              <div>
                <SH>FILE HỒ SƠ</SH>
                <p className="text-[13px] text-slate-500 mb-4"><em>Định dạng JPG, PNG hoặc PDF — Tối đa 10MB mỗi file</em></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DOCS.map(doc => { const up = uploads[doc.key]; const ing = uploadingKey === doc.key; return (
                    <div key={doc.key} data-error={errs[doc.key] ? "true" : undefined} className={cn("border rounded-xl p-3 transition-all flex items-center gap-3", up ? 'border-emerald-300 bg-emerald-50/40' : errs[doc.key] ? 'border-rose-300 bg-rose-50/30' : 'border-dashed border-slate-300 hover:border-[#005496]/40 bg-slate-50/50')}>
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-bold", up ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-400')}>
                        {ing ? <Loader2 className="w-4 h-4 animate-spin" /> : up ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-700 truncate">{doc.label} {doc.req && <span className="text-rose-500">*</span>}</p>
                        {up ? <p className="text-[11px] text-emerald-600 truncate">{up.name}</p> : errs[doc.key] ? <p className="text-[11px] text-rose-500">{errs[doc.key]}</p> : null}
                      </div>
                      {up ? (
                        <div className="flex gap-1 shrink-0">
                          <a href={up.url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-[#005496] bg-transparent"><Eye className="w-3.5 h-3.5" /></Button></a>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 bg-transparent" onClick={() => rmUp(doc.key)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer shrink-0"><input type="file" accept={doc.accept} className="sr-only" onChange={e => { const fl = e.target.files?.[0]; if (fl) handleUpload(doc.key, fl); e.target.value = '' }} disabled={ing} /><span className="inline-flex items-center h-8 px-3 bg-[#005496] text-white font-bold text-[12px] rounded-lg hover:bg-[#004377] cursor-pointer">Chọn file</span></label>
                      )}
                    </div>) })}
                </div>
              </div>

              {/* ═══ CAM KẾT ═══ */}
              <div className="border-t-2 border-dashed border-slate-200 pt-6">
                <p className="text-[13px] text-slate-700 leading-relaxed mb-6">
                  <em>Tôi xin cam đoan những lời khai của tôi trên đăng ký online là đúng sự thật. Nếu sai tôi hoàn toàn chịu trách nhiệm và bị xử lý theo Quy chế tuyển sinh hiện hành.</em> <span className="text-rose-500 font-bold">*</span>
                </p>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 rounded-xl bg-[#005496] hover:bg-[#004377] font-bold text-[16px] shadow-lg shadow-[#005496]/15 disabled:opacity-60 transition-all hover:scale-[1.005] active:scale-[0.995]">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Đang nộp hồ sơ...</> : <><Send size={18} className="mr-2" />NỘP HỒ SƠ DỰ THI</>}
                </Button>
              </div>

            </div>
          </div>
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
      <div className="flex-1 border-t-2 border-dashed border-slate-200" />
      <h2 className="text-[15px] md:text-[17px] font-bold text-[#005496] uppercase tracking-wider shrink-0">{children}</h2>
      <div className="flex-1 border-t-2 border-dashed border-slate-200" />
    </div>
  )
}

function FI({ label, required, children, cls = '' }: { label: string; required?: boolean; children: React.ReactNode; cls?: string }) {
  return <div className={`space-y-1.5 ${cls}`}>{label && <label className="text-[13px] font-bold text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</label>}{children}</div>
}

function ErrMsg({ msg }: { msg: string }) { return <p className="text-rose-500 text-[11px] font-semibold mt-1">{msg}</p> }

function In({ name, ph, type = 'text', step, value, onChange, error }: { name: string; ph?: string; type?: string; step?: string; value: string; onChange: any; error?: string }) {
  return (<><Input name={name} type={type} step={step} placeholder={ph} value={value} onChange={onChange} data-error={error ? "true" : undefined} className={cn("h-10 rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#005496]", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")} />{error && <ErrMsg msg={error} />}</>)
}

function Sel({ value, onChange, ph, opts, disabled, error }: { value: string; onChange: (v: string) => void; ph: string; opts: { v: string; l: string }[]; disabled?: boolean; error?: string }) {
  return (<><Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger data-error={error ? "true" : undefined} className={cn("h-10 rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] font-medium focus:ring-1 focus:ring-[#005496]", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}><SelectValue placeholder={ph} /></SelectTrigger><SelectContent className="rounded-xl max-h-[260px] shadow-xl">{opts.map(o => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent></Select>{error && <ErrMsg msg={error} />}</>)
}

function SearchableSel({ value, onChange, ph, opts, disabled, error }: { value: string; onChange: (v: string) => void; ph: string; opts: { v: string; l: string }[]; disabled?: boolean; error?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled} data-error={error ? "true" : undefined} className={cn("w-full h-10 justify-between font-medium rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] hover:bg-[#eef2f7] hover:text-slate-800 disabled:opacity-50", !value && "text-slate-400 font-normal", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}>
            <span className="truncate">{value ? opts.find((opt) => opt.v === value)?.l : ph}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-slate-200 shadow-xl" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm..." className="h-10 text-[13px]" />
            <CommandEmpty className="py-3 text-[13px] text-center text-slate-500">Không tìm thấy.</CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {opts.map((opt) => (
                  <CommandItem key={opt.v} value={opt.l} onSelect={() => { onChange(opt.v); setOpen(false) }} className="text-[14px] py-2 cursor-pointer">
                    <Check className={cn("mr-2 h-4 w-4 text-[#005496]", value === opt.v ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{opt.l}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <ErrMsg msg={error} />}
    </>
  )
}

function DP({ date, onSelect, from, to, error }: { date?: Date; onSelect: (d: Date | undefined) => void; from: number; to: number; error?: string }) {
  return (<>
    <Popover><PopoverTrigger asChild><Button variant="outline" data-error={error ? "true" : undefined} className={cn("w-full h-10 justify-start text-left font-medium rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] hover:bg-[#eef2f7]", !date && "text-slate-400", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}><CalendarLucide className="mr-2 h-4 w-4 text-slate-400" />{date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}</Button></PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl" align="start"><Calendar mode="single" selected={date} onSelect={onSelect} captionLayout="dropdown" fromYear={from} toYear={to} disabled={d => d > new Date()} /></PopoverContent></Popover>
    {error && <ErrMsg msg={error} />}
  </>)
}
