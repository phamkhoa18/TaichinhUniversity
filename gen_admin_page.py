import re

form_path = "app/tuyen-sinh/dang-ky/[roundId]/page.tsx"
admin_path = "app/(admin)/admin/tuyen-sinh/ho-so/[id]/page.tsx"

with open(form_path, "r", encoding="utf-8") as f:
    form_content = f.read()

# Extract shared components
shared_comps = form_content.split("/* ═══ Compact shared components ═══ */")[1]

# Extract constants
eth_const = "const ETHNICITIES = ['Kinh','Tày','Thái','Mường','Khmer','Hmông','Nùng','Hoa','Dao','Gia Rai','Ê Đê','Ba Na','Xơ Đăng','Sán Chay','Cơ Ho','Chăm','Sán Dìu','Hrê','Ra Glai','Mnông','Khác']"
deg_const = "const DEG_SYS = ['Chính quy','Vừa làm vừa học','Liên thông','Từ xa','Bằng 2','Khác']\nconst DEG_CLS = ['Xuất sắc','Giỏi','Khá','Trung bình khá','Trung bình']"
docs_const = """const DOCS = [
  { key: 'photoUrl', label: 'Ảnh thẻ 3x4', req: true, icon: 'ImageIcon' },
  { key: 'diplomaUrl', label: 'Bằng tốt nghiệp ĐH', req: true, icon: 'GraduationCap' },
  { key: 'transcriptUrl', label: 'Bảng điểm ĐH', req: true, icon: 'FileText' },
  { key: 'idCardUrl', label: 'CCCD/CMND (2 mặt)', req: true, icon: 'IdCard' },
  { key: 'foreignLanguageCertUrl', label: 'Chứng chỉ ngoại ngữ', req: false, icon: 'Globe' },
  { key: 'cvUrl', label: 'CV / Lý lịch khoa học', req: false, icon: 'Briefcase' },
]"""

# Extract full form HTML from dang-ky/page.tsx
match = re.search(r'(<div className="px-8 py-6 space-y-8">.*?){\/\* ═══ CAM KẾT ═══ \*\/}', form_content, re.DOTALL)
form_blocks = match.group(1)

# Modify the form blocks to support edit mode
form_blocks = form_blocks.replace('<In ', '<In disabled={!isEditing} ')
form_blocks = form_blocks.replace('<Sel ', '<Sel disabled={!isEditing} ')
form_blocks = form_blocks.replace('<SearchableSel ', '<SearchableSel disabled={!isEditing} ')
form_blocks = form_blocks.replace('<DP ', '<DP disabled={!isEditing} ')
form_blocks = form_blocks.replace('type="checkbox"', 'type="checkbox" disabled={!isEditing}')
form_blocks = form_blocks.replace('type="radio"', 'type="radio" disabled={!isEditing}')

# In the form_blocks, need to swap out the error object from errs to an undefined object or empty to prevent crash
form_blocks = form_blocks.replace('errs.', '(errs || {}).')

# Replace file docs area completely
file_docs_replacement = """
{/* ═══ 4. FILE HỒ SƠ ═══ */}
<div>
  <SH>FILE HỒ SƠ</SH>
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
    {DOCS.map(doc => {
      const url = applicant[doc.key];
      if (!url) return null;
      return (
        <div key={doc.key} onClick={() => setPreviewDoc({url, label: doc.label})} className={cn("cursor-pointer border rounded-xl p-3 transition-all flex items-center gap-3 bg-slate-50 hover:bg-[#005496]/5 hover:border-[#005496]/30", previewDoc?.url === url ? "border-[#005496] bg-[#005496]/10 shadow-sm" : "border-slate-200")}>
          <div className={cn("w-9 h-9 flex items-center justify-center shrink-0 bg-white rounded-lg border text-slate-500 shadow-sm transition-colors", previewDoc?.url === url ? "border-[#005496]/30 text-[#005496]" : "border-slate-200")}>
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-700 truncate">{doc.label}</p>
            <p className="text-[11px] text-[#005496] hover:underline truncate" onClick={(e) => { e.stopPropagation(); window.open(url, '_blank') }}>Mở tab mới ↗</p>
          </div>
        </div>
      )
    })}
  </div>
</div>
"""
form_blocks = re.sub(r'{\/\* ═══ 4\. FILE HỒ SƠ ═══ \*\/}.*?(?=<\/div>\s*<\/div>\s*$)', file_docs_replacement, form_blocks, flags=re.DOTALL)

new_content = f"""'use client'

import React, {{ useState, useEffect }} from 'react'
import {{ useParams, useRouter }} from 'next/navigation'
import Link from 'next/link'
import {{ format }} from 'date-fns'
import {{ vi }} from 'date-fns/locale'
import {{ motion, AnimatePresence }} from 'framer-motion'
import {{
  ChevronLeft, Calendar as CalendarLucide, FileText, ShieldCheck, Ban, Clock,
  CheckCircle2, XCircle, Loader2, MessageSquare, ExternalLink, Hash, Eye, X,
  Download, FileDown, Maximize2, GraduationCap, Check, ChevronsUpDown, Edit, Save, Undo,
  User, MapPin, Briefcase, Globe, IdCard, Phone, Mail, Building2, ImageIcon, AlertCircle
}} from 'lucide-react'
import {{ Document, Packer, Paragraph, TextRun, Table as DocTable, TableRow as DocTableRow, TableCell as DocTableCell, WidthType, AlignmentType, BorderStyle }} from 'docx'
import {{ saveAs }} from 'file-saver'

import {{ Button }} from '@/components/ui/button'
import {{ Input }} from '@/components/ui/input'
import {{ Calendar }} from '@/components/ui/calendar'
import {{ Popover, PopoverContent, PopoverTrigger }} from '@/components/ui/popover'
import {{ Select, SelectContent, SelectItem, SelectTrigger, SelectValue }} from '@/components/ui/select'
import {{ Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList }} from '@/components/ui/command'
import {{ cn }} from '@/lib/utils'

const STATUS_MAP: Record<string, {{ label: string; color: string; bg: string; icon: any }}> = {{
  PENDING:       {{ label: 'Chờ xét duyệt',  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200', icon: Clock }},
  QUALIFIED:     {{ label: 'Đủ điều kiện',    color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',   icon: CheckCircle2 }},
  ADMITTED:      {{ label: 'Trúng tuyển',     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: ShieldCheck }},
  NOT_QUALIFIED: {{ label: 'Không đủ ĐK',     color: 'text-slate-500',   bg: 'bg-slate-100 border-slate-200', icon: XCircle }},
  REJECTED:      {{ label: 'Từ chối',         color: 'text-rose-600',    bg: 'bg-rose-50 border-rose-200',   icon: Ban }},
}}
const GENDER_MAP: Record<string, string> = {{ MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }}

{eth_const}
{deg_const}
{docs_const}

interface Addr {{ code: number; name: string }}

export default function ApplicantDetailPage() {{
  const {{ id }} = useParams() as {{ id: string }}
  const router = useRouter()

  const [applicant, setApplicant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [previewDoc, setPreviewDoc] = useState<{{ url: string; label: string }} | null>(null)

  const [programs, setPrograms] = useState<any[]>([])
  const [provs, setProvs] = useState<Addr[]>([])
  const [dists, setDists] = useState<Addr[]>([])
  const [wards, setWards] = useState<Addr[]>([])

  const [isEditing, setIsEditing] = useState(false)
  const errs: Record<string, string> = {{}} // Define empty so errors don't pop up during edit
  
  // Editor form state
  const [f, setF] = useState<any>({{}})
  const [dob, setDob] = useState<Date | undefined>()
  const [idDate, setIdDate] = useState<Date | undefined>()
  const [selProv, setSelProv] = useState('')
  const [selDist, setSelDist] = useState('')
  const [selWard, setSelWard] = useState('')

  useEffect(() => {{ fetch('/api/public/tuyen-sinh').then(r => r.json()).then(j => setPrograms(j.data?.programs || [])) }}, [])
  useEffect(() => {{ fetch('https://provinces.open-api.vn/api/p/').then(r => r.json()).then(setProvs).catch(()=>{{}}) }}, [])
  useEffect(() => {{ if (!selProv) {{ setDists([]); setWards([]); return }}; fetch(`https://provinces.open-api.vn/api/p/${{selProv}}?depth=2`).then(r => r.json()).then(d => {{ setDists(d.districts || []); if(!isEditing) {{ const fnd = (d.districts || []).find((x:any)=>x.name===f._raw_dist); if(fnd) setSelDist(String(fnd.code)) }} }}).catch(()=>{{}}) }}, [selProv, isEditing, f._raw_dist])
  useEffect(() => {{ if (!selDist) {{ setWards([]); return }}; fetch(`https://provinces.open-api.vn/api/d/${{selDist}}?depth=2`).then(r => r.json()).then(d => {{ setWards(d.wards || []); if(!isEditing){{ const fnd = (d.wards || []).find((x:any)=>x.name===f._raw_ward); if (fnd) setSelWard(String(fnd.code)) }} }}).catch(()=>{{}}) }}, [selDist, isEditing, f._raw_ward])

  useEffect(() => {{
    fetch(`/api/admin/admissions/applicants/${{id}}`)
      .then(r => r.json())
      .then(json => {{ 
        if (json.success) {{ 
          const data = json.data
          setApplicant(data); 
          setNotes(data.notes || '')
          initForm(data)
        }} 
      }})
      .finally(() => setLoading(false))
  }}, [id])

  const initForm = (a: any) => {{
    setF({{
      ...a,
      _raw_prov: a.province, _raw_dist: a.district, _raw_ward: a.ward
    }})
    setDob(a.dateOfBirth ? new Date(a.dateOfBirth) : undefined)
    setIdDate(a.idCardDate ? new Date(a.idCardDate) : undefined)
    setIsEditing(false)
  }}

  // Effect to map Province string to openApi code for first load
  useEffect(() => {{
    if (f._raw_prov && provs.length > 0 && !isEditing) {{
      const p = provs.find(x => x.name === f._raw_prov)
      if (p) setSelProv(String(p.code))
    }}
  }}, [f._raw_prov, provs, isEditing])

  const ch = (e: React.ChangeEvent<HTMLInputElement>) => {{ setF((p:any) => ({{ ...p, [e.target.name]: e.target.value }})) }}
  const sf = (n: string, v: string) => {{ setF((p:any) => ({{ ...p, [n]: v }})) }}

  const pN = () => provs.find(p => String(p.code) === selProv)?.name || ''
  const dN = () => dists.find(d => String(d.code) === selDist)?.name || ''
  const wN = () => wards.find(w => String(w.code) === selWard)?.name || ''

  const saveEdits = async () => {{
    setUpdating(true)
    try {{
      const finalProv = pN() || f.province
      const finalDist = dN() || f.district
      const finalWard = wN() || f.ward
      const addrFull = [f.address, finalWard, finalDist, finalProv].filter(Boolean).join(', ')
      
      const payload = {{
        ...f,
        dateOfBirth: dob?.toISOString(),
        idCardDate: idDate?.toISOString(),
        province: finalProv,
        district: finalDist,
        ward: finalWard,
        address: f.address,
        addressString: addrFull,
        degreeYear: Number(f.degreeYear),
        degreeGpa: f.degreeGpa ? Number(f.degreeGpa) : undefined,
      }}
      
      const res = await fetch(`/api/admin/admissions/applicants/${{id}}`, {{ method: 'PUT', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify(payload) }})
      const json = await res.json()
      if (json.success) {{
        setApplicant(json.data)
        initForm(json.data)
      }} else {{ alert("Failed to save: " + json.error) }}
    }} finally {{ setUpdating(false) }}
  }}

  const updateStatus = async (status: string) => {{
    setUpdating(true)
    try {{
      const res = await fetch(`/api/admin/admissions/applicants/${{id}}`, {{ method: 'PUT', headers: {{ 'Content-Type': 'application/json' }}, body: JSON.stringify({{ status, notes }}) }})
      const json = await res.json()
      if (json.success) setApplicant(json.data)
    }} finally {{ setUpdating(false) }}
  }}

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('image')
  const isPdf = (url: string) => /\.pdf$/i.test(url)

  const exportDocx = async () => {{
    if (!applicant) return
    const a = applicant
    const round = typeof a.roundId === 'object' ? a.roundId : null
    const borderAll = {{ top: {{ style: BorderStyle.SINGLE, size: 1 }}, bottom: {{ style: BorderStyle.SINGLE, size: 1 }}, left: {{ style: BorderStyle.SINGLE, size: 1 }}, right: {{ style: BorderStyle.SINGLE, size: 1 }} }} as const
    const makeRow = (label: string, value: string) => new DocTableRow({{ children: [ new DocTableCell({{ borders: borderAll, width: {{ size: 3000, type: WidthType.DXA }}, children: [new Paragraph({{ children: [new TextRun({{ text: label, bold: true, size: 22, font: 'Times New Roman' }})] }})] }}), new DocTableCell({{ borders: borderAll, width: {{ size: 6500, type: WidthType.DXA }}, children: [new Paragraph({{ children: [new TextRun({{ text: value || '—', size: 22, font: 'Times New Roman' }})] }})] }}) ] }})

    const doc = new Document({{
      sections: [{{
        properties: {{ page: {{ margin: {{ top: 720, bottom: 720, left: 1080, right: 1080 }} }} }},
        children: [
          new Paragraph({{ alignment: AlignmentType.CENTER, spacing: {{ after: 60 }}, children: [new TextRun({{ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 24, font: 'Times New Roman' }})] }}),
          new Paragraph({{ alignment: AlignmentType.CENTER, spacing: {{ after: 200 }}, children: [new TextRun({{ text: 'Độc lập – Tự do – Hạnh phúc', bold: true, size: 24, font: 'Times New Roman' }})] }}),
          new Paragraph({{ alignment: AlignmentType.CENTER, spacing: {{ after: 80 }}, children: [new TextRun({{ text: '——————————', size: 24, font: 'Times New Roman' }})] }}),
          new Paragraph({{ alignment: AlignmentType.CENTER, spacing: {{ after: 300 }}, children: [new TextRun({{ text: 'SƠ YẾU LÝ LỊCH ỨNG VIÊN', bold: true, size: 32, font: 'Times New Roman' }})] }}),
          new Paragraph({{ alignment: AlignmentType.CENTER, spacing: {{ after: 100 }}, children: [new TextRun({{ text: `Đợt tuyển sinh: ${{round?.name || '—'}}`, italics: true, size: 22, font: 'Times New Roman' }})] }}),
          new Paragraph({{ spacing: {{ after: 200 }}, children: [] }}),
          new DocTable({{ width: {{ size: 9500, type: WidthType.DXA }}, rows: [
            makeRow('Họ và tên', a.fullName), makeRow('Ngày sinh', a.dateOfBirth ? format(new Date(a.dateOfBirth), 'dd/MM/yyyy') : '—'),
            makeRow('Nơi sinh', a.birthPlace || '—'), makeRow('Giới tính', GENDER_MAP[a.gender] || a.gender),
            makeRow('Dân tộc', a.ethnicity || 'Kinh'), makeRow('Quốc tịch', a.nationality || 'Việt Nam'),
            makeRow('Số CCCD/CMND', a.idCard), makeRow('Ngày cấp', a.idCardDate ? format(new Date(a.idCardDate), 'dd/MM/yyyy') : '—'),
            makeRow('Nơi cấp', a.idCardPlace || '—'), makeRow('Số điện thoại', a.phone),
            makeRow('Email', a.email), makeRow('Địa chỉ', a.address), makeRow('Tỉnh/TP', a.province)
          ]}}),
        ],
      }}],
    }})
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `Ho-so_${{a.fullName.replace(/\s+/g, '-')}}_${{format(new Date(), 'ddMMyyyy')}}.docx`)
  }}

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-[#005496]" /></div>
  if (!applicant) return <div className="flex items-center justify-center min-h-[50vh]">Không tìm thấy hồ sơ</div>

  const st = STATUS_MAP[applicant.status] || STATUS_MAP.PENDING
  const StatusIcon = st.icon
  const round = applicant.roundId

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 animate-in fade-in duration-500 pb-12 px-6">
      
      {{/* ══ HEADER ══ */}}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-md z-40 py-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-slate-200 shadow-sm text-slate-500 hover:text-[#005496]" onClick={() => router.back()}><ChevronLeft className="w-5 h-5" /></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-extrabold tracking-tight text-slate-800 uppercase">{{applicant.fullName}}</h1>
              {{!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-[12px] font-bold text-[#005496] border-[#005496]/20 bg-[#005496]/5 hover:bg-[#005496]/10 rounded-lg shadow-none"><Edit className="w-3.5 h-3.5 mr-1.5" /> Chỉnh sửa</Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => initForm(applicant)} className="h-7 text-[12px] font-bold text-slate-500 border-slate-200 rounded-lg shadow-none"><Undo className="w-3.5 h-3.5 mr-1.5" /> Hủy</Button>
                  <Button size="sm" onClick={saveEdits} disabled={updating} className="h-7 text-[12px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-none">{{updating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}} Lưu thay đổi</Button>
                </div>
              )}}
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className={{`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-bold uppercase shadow-sm ${{st.bg}} ${{st.color}}`}}><StatusIcon className="w-3.5 h-3.5" />{{st.label}}</div>
              {{round && <span className="text-[11px] text-slate-500 font-bold bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">Đợt: {{typeof round === 'object' ? round.name : round}}</span>}}
              <Button variant="ghost" onClick={exportDocx} size="sm" className="h-5 text-[11px] font-bold text-slate-500 hover:text-[#005496] bg-transparent pl-2 pr-0 gap-1.5"><FileDown className="w-3.5 h-3.5" /> In sơ yếu DOCX</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {{/* ══ LEFT: Editor Form ══ */}}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {form_blocks}
          </div>
        </div>

        {{/* ══ RIGHT: Sticky Document Review & Actions ══ */}}
        <div className="w-full lg:w-[460px] flex-shrink-0 flex flex-col gap-6">
          <div className="sticky top-[100px] flex flex-col gap-6 h-[calc(100vh-120px)]">
            
            {{/* Status Manager */}}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
              <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#005496]" /> Kết quả xét duyệt</h3>
                {{applicant.reviewedAt && <span className="text-[11px] text-slate-400 font-medium">Bởi: {{typeof applicant.reviewedBy === 'object' ? applicant.reviewedBy.name : applicant.reviewedBy}}</span>}}
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-600 block">Ghi chú cho hồ sơ này</label>
                  <textarea value={notes} onChange={{(e) => setNotes(e.target.value)}} rows={{2}} placeholder="Nhập ghi chú..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005496]/20 transition-all resize-none shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {{applicant.status !== 'ADMITTED' && <Button className="w-full h-9 rounded-lg text-[13px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20" disabled={{updating}} onClick={() => updateStatus('ADMITTED')}>{{updating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />}} Trúng tuyển</Button>}}
                  {{applicant.status !== 'QUALIFIED' && <Button variant="outline" className="w-full h-9 rounded-lg text-[13px] font-bold border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm" disabled={{updating}} onClick={() => updateStatus('QUALIFIED')}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Đủ điều kiện</Button>}}
                  {{applicant.status !== 'NOT_QUALIFIED' && <Button variant="outline" className="w-full h-9 rounded-lg text-[13px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm col-span-2" disabled={{updating}} onClick={() => updateStatus('NOT_QUALIFIED')}><XCircle className="w-3.5 h-3.5 mr-1.5" /> Không đủ điều kiện</Button>}}
                  {{applicant.status !== 'REJECTED' && <Button variant="outline" className="w-full h-9 rounded-lg text-[13px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm col-span-2" disabled={{updating}} onClick={() => updateStatus('REJECTED')}><Ban className="w-3.5 h-3.5 mr-1.5" /> Từ chối</Button>}}
                </div>
              </div>
            </div>

            {{/* Document Inline Viewer */}}
            <div className="bg-[url('/images/backgrounds/pattern.svg')] bg-[#001020] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
              <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
                <h3 className="text-[14px] font-bold text-white flex items-center gap-2"><Eye className="w-4 h-4 text-[#ffd200]" /> Khung xem nhanh tài liệu</h3>
                {{previewDoc && (
                  <div className="flex items-center gap-1">
                    <a href={{previewDoc.url}} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-white bg-transparent hover:bg-white/10"><ExternalLink className="w-3.5 h-3.5" /></Button></a>
                    <a href={{previewDoc.url}} download><Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-[#ffd200] bg-transparent hover:bg-[#ffd200]/10"><Download className="w-3.5 h-3.5" /></Button></a>
                  </div>
                )}}
              </div>
              <div className="flex-1 flex items-center justify-center p-2 isolate relative overflow-hidden backdrop-blur-3xl">
                {{!previewDoc ? (
                  <div className="text-center p-6 border border-dashed border-white/20 rounded-xl max-w-[80%]">
                    <FileText className="w-10 h-10 text-white/30 mx-auto mb-3" />
                    <p className="text-[13px] font-semibold text-white/60 leading-relaxed">Chọn một loại giấy tờ đính kèm phía bên trái để xem nhanh ở đây.</p>
                  </div>
                ) : isImage(previewDoc.url) ? (
                  <img src={{previewDoc.url}} alt={{previewDoc.label}} className="w-full h-full object-contain rounded-lg" />
                ) : isPdf(previewDoc.url) ? (
                  <iframe src={{previewDoc.url}} className="w-full h-full rounded-lg bg-white" />
                ) : (
                  <div className="text-center p-6 border border-dashed border-white/20 rounded-xl">
                    <AlertCircle className="w-10 h-10 text-white/30 mx-auto mb-3" />
                    <p className="text-[13px] font-semibold text-white/60 mb-3">Tài liệu này không hỗ trợ xem trước.</p>
                    <a href={{previewDoc.url}} target="_blank" rel="noopener noreferrer"><Button size="sm" className="bg-[#ffd200] hover:bg-[#ffe14d] text-[#003052] h-8 rounded-lg text-[12px] font-bold"><ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Mở tab mới</Button></a>
                  </div>
                )}}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}}

{shared_comps}
"""

with open("gen_admin.sh", "w", encoding="utf-8") as f:
    f.write(new_content)
