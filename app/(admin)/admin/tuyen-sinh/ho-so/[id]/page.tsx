'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Calendar as CalendarLucide, FileText, ShieldCheck, Ban, Clock,
  CheckCircle2, XCircle, Loader2, MessageSquare, ExternalLink, Hash, Eye, X,
  Download, FileDown, Maximize2, GraduationCap, Check, ChevronsUpDown, Edit, Save, Undo,
  User, MapPin, Briefcase, Globe, IdCard, Phone, Mail, Building2, ImageIcon, AlertCircle, Upload, Trash2
} from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, Table as DocTable, TableRow as DocTableRow, TableCell as DocTableCell, WidthType, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:       { label: 'Chờ xét duyệt',  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200', icon: Clock },
  QUALIFIED:     { label: 'Đủ điều kiện',    color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',   icon: CheckCircle2 },
  ADMITTED:      { label: 'Trúng tuyển',     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: ShieldCheck },
  NOT_QUALIFIED: { label: 'Không đủ ĐK',     color: 'text-slate-500',   bg: 'bg-slate-100 border-slate-200', icon: XCircle },
  REJECTED:      { label: 'Từ chối',         color: 'text-rose-600',    bg: 'bg-rose-50 border-rose-200',   icon: Ban },
}
const GENDER_MAP: Record<string, string> = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }

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

interface Addr { code: number; name: string }

export default function ApplicantDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [applicant, setApplicant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [previewDoc, setPreviewDoc] = useState<{ url: string; label: string } | null>(null)

  const [programs, setPrograms] = useState<any[]>([])
  const [provs, setProvs] = useState<Addr[]>([])
  const [dists, setDists] = useState<Addr[]>([])
  const [wards, setWards] = useState<Addr[]>([])

  const [isEditing, setIsEditing] = useState(false)
  const errs: Record<string, string> = {}
  
  // Editor form state
  const [f, setF] = useState<any>({
    fullName: '', gender: '', birthPlace: '', ethnicity: 'Kinh', nationality: 'Việt Nam',
    idCard: '', idCardPlace: '', phone: '', email: '', address: '',
    occupation: '', workplace: '', position: '',
    degreeSchool: '', degreeCountry: 'Việt Nam', degreeSystem: '',
    degreeMajor: '', degreeSpecialization: '', degreeYear: '',
    degreeClassification: '', degreeGpa: '', isAlumni: false,
    programId: '', entranceExamSubject: '', orientation: '', supplementaryKnowledge: false,
  })
  const [dob, setDob] = useState<Date | undefined>()
  const [idDate, setIdDate] = useState<Date | undefined>()
  const [selProv, setSelProv] = useState('')
  const [selDist, setSelDist] = useState('')
  const [selWard, setSelWard] = useState('')

  useEffect(() => { fetch('/api/public/tuyen-sinh').then(r => r.json()).then(j => setPrograms(j.data?.programs || [])) }, [])
  useEffect(() => { fetch('https://provinces.open-api.vn/api/p/').then(r => r.json()).then(setProvs).catch(()=>{}) }, [])
  useEffect(() => { if (!selProv) { setDists([]); setWards([]); return }; fetch(`https://provinces.open-api.vn/api/p/${selProv}?depth=2`).then(r => r.json()).then(d => { setDists(d.districts || []); if(!isEditing) { const fnd = (d.districts || []).find((x:any)=>x.name===f._raw_dist); if(fnd) setSelDist(String(fnd.code)) } }).catch(()=>{}) }, [selProv, isEditing, f._raw_dist])
  useEffect(() => { if (!selDist) { setWards([]); return }; fetch(`https://provinces.open-api.vn/api/d/${selDist}?depth=2`).then(r => r.json()).then(d => { setWards(d.wards || []); if(!isEditing){ const fnd = (d.wards || []).find((x:any)=>x.name===f._raw_ward); if (fnd) setSelWard(String(fnd.code)) } }).catch(()=>{}) }, [selDist, isEditing, f._raw_ward])

  useEffect(() => {
    fetch(`/api/admin/admissions/applicants/${id}`)
      .then(r => r.json())
      .then(json => { 
        if (json.success) { 
          const data = json.data
          setApplicant(data); 
          setNotes(data.notes || '')
          initForm(data)
        } 
      })
      .finally(() => setLoading(false))
  }, [id])

  const initForm = (a: any) => {
    setF({
      ...a,
      _raw_prov: a.province, _raw_dist: a.district, _raw_ward: a.ward
    })
    setDob(a.dateOfBirth ? new Date(a.dateOfBirth) : undefined)
    setIdDate(a.idCardDate ? new Date(a.idCardDate) : undefined)
    setIsEditing(false)
  }

  // Effect to map Province string to openApi code for first load
  useEffect(() => {
    if (f._raw_prov && provs.length > 0 && !isEditing) {
      const p = provs.find(x => x.name === f._raw_prov)
      if (p) setSelProv(String(p.code))
    }
  }, [f._raw_prov, provs, isEditing])

  const ch = (e: React.ChangeEvent<HTMLInputElement>) => { setF((p:any) => ({ ...p, [e.target.name]: e.target.value })) }
  const sf = (n: string, v: string) => { setF((p:any) => ({ ...p, [n]: v })) }

  const pN = () => provs.find(p => String(p.code) === selProv)?.name || ''
  const dN = () => dists.find(d => String(d.code) === selDist)?.name || ''
  const wN = () => wards.find(w => String(w.code) === selWard)?.name || ''

  const saveEdits = async () => {
    setUpdating(true)
    try {
      const finalProv = pN() || f.province
      const finalDist = dN() || f.district
      const finalWard = wN() || f.ward
      const addrFull = [f.address, finalWard, finalDist, finalProv].filter(Boolean).join(', ')
      
      const payload = {
        ...f,
        dateOfBirth: dob?.toISOString(),
        idCardDate: idDate?.toISOString(),
        province: finalProv,
        district: finalDist,
        ward: finalWard,
        addressString: addrFull,
        degreeYear: Number(f.degreeYear),
        degreeGpa: f.degreeGpa ? Number(f.degreeGpa) : undefined,
      }
      
      const res = await fetch(`/api/admin/admissions/applicants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json.success) {
        setApplicant(json.data)
        initForm(json.data)
      } else { alert("Failed to save: " + json.error) }
    } finally { setUpdating(false) }
  }

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/admissions/applicants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, notes }) })
      const json = await res.json()
      if (json.success) setApplicant(json.data)
    } finally { setUpdating(false) }
  }

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('image')
  const isPdf = (url: string) => /\.pdf$/i.test(url)

  const exportDocx = async () => {
    if (!applicant) return
    const a = applicant
    const round = typeof a.roundId === 'object' ? a.roundId : null
    const borderAll = { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } } as const
    const makeRow = (label: string, value: string) => new DocTableRow({ children: [ new DocTableCell({ borders: borderAll, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, font: 'Times New Roman' })] })] }), new DocTableCell({ borders: borderAll, width: { size: 6500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: value || '—', size: 22, font: 'Times New Roman' })] })] }) ] })

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 720, bottom: 720, left: 1080, right: 1080 } } },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 24, font: 'Times New Roman' })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Độc lập – Tự do – Hạnh phúc', bold: true, size: 24, font: 'Times New Roman' })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: '——————————', size: 24, font: 'Times New Roman' })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: 'SƠ YẾU LÝ LỊCH ỨNG VIÊN', bold: true, size: 32, font: 'Times New Roman' })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: `Đợt tuyển sinh: ${round?.name || '—'}`, italics: true, size: 22, font: 'Times New Roman' })] }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
          new DocTable({ width: { size: 9500, type: WidthType.DXA }, rows: [
            makeRow('Họ và tên', a.fullName), makeRow('Ngày sinh', a.dateOfBirth ? format(new Date(a.dateOfBirth), 'dd/MM/yyyy') : '—'),
            makeRow('Nơi sinh', a.birthPlace || '—'), makeRow('Giới tính', GENDER_MAP[a.gender] || a.gender),
            makeRow('Dân tộc', a.ethnicity || 'Kinh'), makeRow('Quốc tịch', a.nationality || 'Việt Nam'),
            makeRow('Số CCCD/CMND', a.idCard), makeRow('Ngày cấp', a.idCardDate ? format(new Date(a.idCardDate), 'dd/MM/yyyy') : '—'),
            makeRow('Nơi cấp', a.idCardPlace || '—'), makeRow('Số điện thoại', a.phone),
            makeRow('Email', a.email), makeRow('Địa chỉ', a.address), makeRow('Tỉnh/TP', a.province)
          ]}),
        ],
      }],
    })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `Ho-so_${a.fullName.replace(/\s+/g, '-')}_${format(new Date(), 'ddMMyyyy')}.docx`)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-[#005496]" /></div>
  if (!applicant) return <div className="flex items-center justify-center min-h-[50vh]">Không tìm thấy hồ sơ</div>

  const st = STATUS_MAP[applicant.status] || STATUS_MAP.PENDING
  const StatusIcon = st.icon
  const round = applicant.roundId

  return (
    <div className="max-w-[960px] mx-auto animate-in fade-in duration-500 pb-32 mb-16 px-4 md:px-6 mt-4 relative">
      
      {/* ══ HEADER BREADCRUMB & INFO ══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 shrink-0" onClick={() => router.back()}><ChevronLeft className="w-5 h-5" /></Button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
               <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase">{applicant.fullName}</h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[12px] text-slate-500 font-medium tracking-tight">Mã Đợt: {typeof round === 'object' ? round.name : round}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
               <span className="text-[12px] text-slate-500 font-medium tracking-tight">Nộp lúc {format(new Date(applicant.createdAt), 'HH:mm dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm" className="h-9 px-3.5 text-[12px] font-bold text-[#005496] bg-[#005496]/10 hover:bg-[#005496]/20 border border-[#005496]/20 rounded-lg shadow-none"><Edit className="w-3.5 h-3.5 mr-1.5" /> Chỉnh sửa</Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => initForm(applicant)} className="h-9 px-3.5 text-[12px] font-bold text-slate-600 border-slate-300 rounded-lg"><Undo className="w-3.5 h-3.5 mr-1.5" /> Hủy</Button>
              <Button size="sm" onClick={saveEdits} disabled={updating} className="h-9 px-3.5 text-[12px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20">{updating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />} Lưu</Button>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={exportDocx} className="h-9 px-3.5 text-[12px] font-bold text-slate-600 bg-white border-slate-300 hover:text-[#005496] rounded-lg shadow-sm"><FileDown className="w-3.5 h-3.5 mr-1.5" /> Xuất DOCX</Button>
        </div>
      </div>

      {/* ══ REVIEW BAR (Trạng thái) ══ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center gap-4 p-3 md:p-4">
         <div className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 w-full md:w-auto justify-center rounded-lg border text-[12px] font-bold uppercase tracking-tight shadow-sm md:shadow-none ${st.bg} ${st.color}`}>
            <StatusIcon className="w-4 h-4" />{st.label}
         </div>
         <div className="flex-1 w-full relative">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Nhập ghi chú xét duyệt hồ sơ..."
                className="w-full h-10 px-4 bg-slate-50 border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#005496]" />
            {applicant.reviewedAt && <p className="absolute -bottom-5 left-1 text-[10px] text-slate-400 font-medium">Cập nhật lần cuối: {format(new Date(applicant.reviewedAt), 'HH:mm dd/MM/yyyy')} bởi {typeof applicant.reviewedBy === 'object' ? applicant.reviewedBy.name : applicant.reviewedBy}</p>}
         </div>
         <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto shrink-0 justify-end md:ml-4">
            {applicant.status !== 'ADMITTED' && <Button size="sm" className="h-10 px-4 rounded-lg text-[12px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" disabled={updating} onClick={() => updateStatus('ADMITTED')}>{updating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />} Trúng tuyển</Button>}
            {applicant.status !== 'QUALIFIED' && <Button size="sm" variant="outline" className="h-10 px-4 rounded-lg text-[12px] font-bold border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm md:shadow-none" disabled={updating} onClick={() => updateStatus('QUALIFIED')}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Đủ điều kiện</Button>}
            {applicant.status !== 'NOT_QUALIFIED' && <Button size="sm" variant="outline" className="h-10 px-4 rounded-lg text-[12px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm md:shadow-none" disabled={updating} onClick={() => updateStatus('NOT_QUALIFIED')}><XCircle className="w-3.5 h-3.5 mr-1.5" /> Không đủ ĐK</Button>}
            {applicant.status !== 'REJECTED' && <Button size="sm" variant="outline" className="h-10 px-4 rounded-lg text-[12px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm md:shadow-none" disabled={updating} onClick={() => updateStatus('REJECTED')}><Ban className="w-3.5 h-3.5 mr-1.5" /> Từ chối</Button>}
         </div>
      </div>

      {/* ══ EDITOR FORM ══ */}
      <div className={cn("bg-white rounded-xl shadow-sm border transition-all duration-300", isEditing ? 'border-[#005496]/50 shadow-md ring-4 ring-[#005496]/5' : 'border-slate-200/80')}>
        <div className="px-5 py-6 md:px-8 md:py-8 space-y-8">
          
          {/* 1. THÔNG TIN THÍ SINH */}
          <div className={cn("transition-opacity", !isEditing && "opacity-90")}>
            <SH>THÔNG TIN THÍ SINH</SH>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
               <FI label="Họ và tên" cls="md:col-span-2"><In name="fullName" disabled={!isEditing} ph="NGUYỄN VĂN A" value={f.fullName} onChange={ch} /></FI>
               <FI label="Giới tính"><Sel disabled={!isEditing} value={f.gender} onChange={(v: any) => { sf('gender', v) }} ph="Chọn" opts={[{ v: 'MALE', l: 'Nam' }, { v: 'FEMALE', l: 'Nữ' }]} /></FI>
               <FI label="Ngày sinh"><DP disabled={!isEditing} date={dob} onSelect={(d: any) => { setDob(d) }} from={1950} to={new Date().getFullYear() - 20} /></FI>

               <FI label="Nơi sinh"><SearchableSel disabled={!isEditing} value={f.birthPlace} onChange={(v: any) => sf('birthPlace', v)} ph="Chọn tỉnh/TP" opts={provs.map(p => ({ v: p.name, l: p.name }))} /></FI>
               <FI label="Dân tộc"><Sel disabled={!isEditing} value={f.ethnicity} onChange={(v: any) => sf('ethnicity', v)} ph="Kinh" opts={ETHNICITIES.map(e => ({ v: e, l: e }))} /></FI>
               <FI label="Điện thoại"><In name="phone" disabled={!isEditing} ph="0901234567" value={f.phone} onChange={ch} /></FI>
               <FI label="Quốc tịch"><In name="nationality" disabled={!isEditing} value={f.nationality} onChange={ch} /></FI>

               <FI label="Số CMND/CCCD"><In name="idCard" disabled={!isEditing} ph="001234567890" value={f.idCard} onChange={ch} /></FI>
               <FI label="Ngày cấp"><DP disabled={!isEditing} date={idDate} onSelect={setIdDate} from={2000} to={new Date().getFullYear()} /></FI>
               <FI label="Nơi cấp" cls="md:col-span-2"><In name="idCardPlace" disabled={!isEditing} ph="Cục cảnh sát..." value={f.idCardPlace} onChange={ch} /></FI>

               <FI label="Tỉnh/Thành phố"><SearchableSel disabled={!isEditing} value={selProv} onChange={(v: any) => { setSelProv(v) }} ph="Chọn tỉnh/TP" opts={provs.map(p => ({ v: String(p.code), l: p.name }))} /></FI>
               <FI label="Quận/Huyện"><SearchableSel disabled={!isEditing} value={selDist} onChange={setSelDist} ph="Quận/Huyện" opts={dists.map(d => ({ v: String(d.code), l: d.name }))} /></FI>
               <FI label="Phường/Xã"><SearchableSel disabled={!isEditing} value={selWard} onChange={setSelWard} ph="Phường/Xã" opts={wards.map(w => ({ v: String(w.code), l: w.name }))} /></FI>
               <FI label="Số nhà, đường" cls="md:col-span-2 lg:col-span-4"><In name="address" disabled={!isEditing} ph="123 Nguyễn Văn Bảo" value={f.address} onChange={ch} /></FI>

               <FI label="Email" cls="md:col-span-2"><In name="email" disabled={!isEditing} type="email" ph="Ghi chính xác email" value={f.email} onChange={ch} /></FI>
               <FI label="Nghề nghiệp"><In name="occupation" disabled={!isEditing} ph="Kế toán" value={f.occupation} onChange={ch} /></FI>
               <FI label="Cơ quan công tác"><In name="workplace" disabled={!isEditing} ph="Công ty ABC" value={f.workplace} onChange={ch} /></FI>
            </div>
          </div>

          {/* 2. QUÁ TRÌNH ĐÀO TẠO */}
          <div className={cn("transition-opacity", !isEditing && "opacity-90")}>
            <SH>QUÁ TRÌNH ĐÀO TẠO</SH>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
               <FI label="Cơ sở đào tạo" cls="md:col-span-2"><In name="degreeSchool" disabled={!isEditing} value={f.degreeSchool} onChange={ch} /></FI>
               <FI label="Quốc gia đào tạo"><In name="degreeCountry" disabled={!isEditing} value={f.degreeCountry} onChange={ch} /></FI>
               <FI label="Hệ đào tạo"><Sel value={f.degreeSystem} disabled={!isEditing} onChange={(v: any) => sf('degreeSystem', v)} ph="Chọn hệ ĐT" opts={DEG_SYS.map(s => ({ v: s, l: s }))} /></FI>

               <FI label="Ngành tốt nghiệp" cls="md:col-span-2"><In name="degreeMajor" disabled={!isEditing} value={f.degreeMajor} onChange={ch} /></FI>
               <FI label="Chuyên ngành" cls="md:col-span-2"><In name="degreeSpecialization" disabled={!isEditing} value={f.degreeSpecialization} onChange={ch} /></FI>
               <FI label="Năm tốt nghiệp"><In name="degreeYear" disabled={!isEditing} type="number" ph="2024" value={f.degreeYear} onChange={ch} /></FI>
               <FI label="Xếp loại tốt nghiệp"><Sel disabled={!isEditing} value={f.degreeClassification} onChange={(v: any) => sf('degreeClassification', v)} ph="Chọn xếp loại" opts={DEG_CLS.map(c => ({ v: c, l: c }))} /></FI>

               <FI label="GPA"><In disabled={!isEditing} name="degreeGpa" type="number" step="0.01" ph="3.50" value={f.degreeGpa} onChange={ch} /></FI>
               <FI label="" cls="flex items-end pb-0.5">
                 <label className={cn("flex items-center gap-2 cursor-pointer group h-9", !isEditing && "pointer-events-none")}>
                   <input type="checkbox" disabled={!isEditing} checked={f.isAlumni} onChange={e => setF((p:any) => ({ ...p, isAlumni: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-[#005496] focus:ring-[#005496]/30 disabled:opacity-70" />
                   <span className="text-[13px] font-medium text-slate-700">Cựu SV UFM</span>
                 </label>
               </FI>
            </div>
          </div>

          {/* 3. THÔNG TIN ĐĂNG KÝ */}
          <div className={cn("transition-opacity", !isEditing && "opacity-90")}>
            <SH>THÔNG TIN ĐĂNG KÝ XÉT TUYỂN</SH>
            <div className="space-y-4">
               <FI label="Chương trình đăng ký">
                 <div className="max-w-2xl mt-1">
                    <Sel 
                      disabled={!isEditing} 
                      value={f.programId} 
                      onChange={(v: any) => sf('programId', v)} 
                      ph="--- Chọn ngành học ---" 
                      opts={programs.map(p => ({ v: p._id || p.slug, l: `${p.name} ${p.programCode ? `(Mã: ${p.programCode})` : ''}` }))} 
                    />
                 </div>
               </FI>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                 <FI label="Ngoại ngữ đầu vào"><Sel disabled={!isEditing} value={f.entranceExamSubject} onChange={(v: any) => sf('entranceExamSubject', v)} ph="Chọn ngoại ngữ" opts={[{ v: 'Tiếng Anh', l: 'Tiếng Anh' }, { v: 'Tiếng Pháp', l: 'Tiếng Pháp' }, { v: 'Tiếng Trung', l: 'Tiếng Trung' }, { v: 'Miễn thi', l: 'Miễn thi (có CC)' }]} /></FI>
                 <FI label="Định hướng"><Sel disabled={!isEditing} value={f.orientation} onChange={(v: any) => sf('orientation', v)} ph="Chọn định hướng" opts={[{ v: 'Ứng dụng', l: 'Ứng dụng' }, { v: 'Nghiên cứu', l: 'Nghiên cứu' }]} /></FI>
                 <FI label="" cls="flex items-end pb-0.5 md:col-span-2">
                   <label className={cn("flex items-center gap-2 cursor-pointer group h-9", !isEditing && "pointer-events-none")}>
                     <input type="checkbox" disabled={!isEditing} checked={f.supplementaryKnowledge} onChange={e => setF((p:any) => ({ ...p, supplementaryKnowledge: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-[#005496] focus:ring-[#005496]/30 disabled:opacity-70" />
                     <span className="text-[13px] font-medium text-slate-700">Đăng ký Bổ sung kiến thức</span>
                   </label>
                 </FI>
               </div>
            </div>
          </div>

          {/* 4. FILE HỒ SƠ */}
          <div>
            <SH>TÀI LIỆU ĐÍNH KÈM (XEM NHANH)</SH>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOCS.map(doc => {
                const url = applicant[doc.key];
                if (!url) return null;
                return (
                  <div key={doc.key} onClick={() => setPreviewDoc({url, label: doc.label})} className="cursor-pointer bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:border-[#005496]/40 hover:bg-[#005496]/5 transition-all group shadow-sm">
                     <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#005496] group-hover:border-[#005496]/20 transition-all shrink-0">
                        <FileText className="w-4 h-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate-700 truncate">{doc.label}</p>
                        <p className="text-[11px] font-medium text-slate-400 group-hover:text-[#005496]"><Eye className="w-3 h-3 inline mr-1" /> Popup xem trước</p>
                     </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════ XEM TRƯỚC TÀI LIỆU (POPUP OVERLAY) ══════ */}
      <AnimatePresence>
         {previewDoc && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
               className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
               onClick={() => setPreviewDoc(null)}>
               
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[1200px] max-w-full h-[90vh] flex flex-col overflow-hidden">
                  
                  {/* Toolbars */}
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4 justify-between shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#005496]/10 flex items-center justify-center text-[#005496]"><Eye className="w-5 h-5" /></div>
                        <div>
                           <h2 className="text-[16px] font-bold text-slate-800">{previewDoc.label}</h2>
                           <p className="text-[13px] text-slate-500 font-medium">Lưu ý: Click biểu tượng [X] góc phải để đóng</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <a href={previewDoc.url} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="h-9 px-4 rounded-xl text-[13px] font-bold bg-white text-slate-700 hover:text-[#005496]"><ExternalLink className="w-4 h-4 mr-2" /> Mở tab web</Button></a>
                        <a href={previewDoc.url} download><Button variant="outline" className="h-9 px-4 rounded-xl text-[13px] font-bold bg-white text-emerald-600 hover:bg-emerald-50"><Download className="w-4 h-4 mr-2" /> Tải về</Button></a>
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 ml-2" onClick={() => setPreviewDoc(null)}><X className="w-5 h-5" /></Button>
                     </div>
                  </div>

                  {/* Canvas */}
                  <div className="flex-1 bg-slate-200 overflow-hidden relative isolate p-4 md:p-8 flex items-center justify-center">
                     <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')]" />
                     {isImage(previewDoc.url) ? (
                        <div className="relative shadow-xl border border-slate-300 rounded-xl overflow-auto max-h-full max-w-full bg-white flex items-center justify-center">
                           <img src={previewDoc.url} alt={previewDoc.label} className="max-w-full max-h-full object-contain object-center" />
                        </div>
                     ) : isPdf(previewDoc.url) ? (
                        <iframe src={previewDoc.url} className="w-full h-full bg-white rounded-xl shadow-xl border border-slate-300 relative z-10" />
                     ) : (
                        <div className="text-center bg-white p-10 rounded-2xl shadow-xl z-10 border border-slate-200">
                           <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                           <p className="text-lg font-bold text-slate-800 mb-2">Trình duyệt không hỗ trợ xem format này</p>
                           <a href={previewDoc.url} target="_blank" rel="noopener noreferrer"><Button className="mt-4 bg-[#005496] h-11 px-6 rounded-xl font-bold"><ExternalLink className="w-4 h-4 mr-2" /> Tải về trực tiếp để xem</Button></a>
                        </div>
                     )}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
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

function FI({ label, cls = '', children }: { label: string; cls?: string; children: React.ReactNode }) {
  return <div className={`space-y-1.5 ${cls}`}>{label && <label className="text-[13px] font-bold text-slate-700">{label}</label>}{children}</div>
}

function ErrMsg({ msg }: { msg: string }) { return <p className="text-rose-500 text-[11px] font-semibold mt-1">{msg}</p> }

function In({ name, ph, type = 'text', step, value, onChange, error, disabled }: any) {
  return (<><Input name={name} disabled={disabled} type={type} step={step} placeholder={ph} value={value} onChange={onChange} data-error={error ? "true" : undefined} className={cn("h-10 rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#005496] disabled:opacity-90 disabled:bg-slate-100 disabled:text-slate-700 disabled:border-slate-200", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")} />{error && <ErrMsg msg={error} />}</>)
}

function Sel({ value, onChange, ph, opts, disabled, error }: any) {
  return (<><Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger data-error={error ? "true" : undefined} className={cn("h-10 rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] font-medium focus:ring-1 focus:ring-[#005496] disabled:opacity-90 disabled:bg-slate-100 disabled:text-slate-700 disabled:border-slate-200", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}><SelectValue placeholder={ph} /></SelectTrigger><SelectContent className="rounded-xl max-h-[260px] shadow-xl">{opts.map((o:any) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent></Select>{error && <ErrMsg msg={error} />}</>)
}

function SearchableSel({ value, onChange, ph, opts, disabled, error }: any) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled} data-error={error ? "true" : undefined} className={cn("w-full h-10 justify-between font-medium rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] hover:bg-[#eef2f7] hover:text-slate-800 disabled:opacity-90 disabled:bg-slate-100 disabled:text-slate-700 disabled:border-slate-200", !value && "text-slate-400 font-normal", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}>
            <span className="truncate">{value ? opts.find((opt:any) => opt.v === value)?.l : ph}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-slate-200 shadow-xl" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm..." className="h-10 text-[13px]" />
            <CommandEmpty className="py-3 text-[13px] text-center text-slate-500">Không tìm thấy.</CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {opts.map((opt:any) => (
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

function DP({ date, onSelect, from, to, error, disabled }: any) {
  return (<>
    <Popover><PopoverTrigger asChild><Button disabled={disabled} variant="outline" data-error={error ? "true" : undefined} className={cn("w-full h-10 justify-start text-left font-medium rounded-lg bg-[#f5f8fa] border border-slate-200 text-[14px] hover:bg-[#eef2f7] disabled:opacity-90 disabled:bg-slate-100 disabled:text-slate-700 disabled:border-slate-200", !date && "text-slate-400", error && "ring-2 ring-rose-400/40 bg-rose-50/30 border-rose-200")}><CalendarLucide className="mr-2 h-4 w-4 text-slate-400" />{date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}</Button></PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl" align="start"><Calendar mode="single" selected={date} onSelect={onSelect} captionLayout="dropdown" fromYear={from} toYear={to} disabled={d => d > new Date()} /></PopoverContent></Popover>
    {error && <ErrMsg msg={error} />}
  </>)
}
