'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  ChevronLeft, Search, Users, UserCheck, Clock, XCircle, CheckCircle2,
  Eye, Filter, Download, MoreHorizontal, Loader2, ClipboardList,
  GraduationCap, CalendarDays, ArrowUpDown, ShieldCheck, Ban
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:       { label: 'Chờ xét',     color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200', icon: Clock },
  QUALIFIED:     { label: 'Đủ điều kiện', color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',   icon: CheckCircle2 },
  ADMITTED:      { label: 'Trúng tuyển',  color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: ShieldCheck },
  NOT_QUALIFIED: { label: 'Không đủ ĐK',  color: 'text-slate-500',   bg: 'bg-slate-50 border-slate-200', icon: XCircle },
  REJECTED:      { label: 'Từ chối',      color: 'text-rose-600',    bg: 'bg-rose-50 border-rose-200',   icon: Ban },
}

export default function RoundDetailPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [round, setRound] = useState<any>(null)
  const [applicants, setApplicants] = useState<any[]>([])
  const [counts, setCounts] = useState({ total: 0, PENDING: 0, QUALIFIED: 0, ADMITTED: 0, NOT_QUALIFIED: 0, REJECTED: 0 })
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchRound = useCallback(async () => {
    const res = await fetch(`/api/admin/admissions/rounds/${id}`)
    const json = await res.json()
    if (json.success) setRound(json.data)
  }, [id])

  const fetchApplicants = useCallback(async (page = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search.trim()) params.set('search', search.trim())

    const res = await fetch(`/api/admin/admissions/rounds/${id}/applicants?${params}`)
    const json = await res.json()
    if (json.success) {
      setApplicants(json.data)
      setPagination(json.pagination)
      setCounts(json.counts)
    }
    setLoading(false)
  }, [id, statusFilter, search])

  useEffect(() => { fetchRound() }, [fetchRound])
  useEffect(() => { fetchApplicants() }, [fetchApplicants])

  const handleQuickStatus = async (applicantId: string, newStatus: string) => {
    setUpdatingId(applicantId)
    try {
      await fetch(`/api/admin/admissions/applicants/${applicantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchApplicants(pagination.page)
    } finally {
      setUpdatingId(null)
    }
  }

  if (!round && loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#005496]" />
      </div>
    )
  }

  const stats = [
    { label: 'Tổng hồ sơ', value: counts.total, icon: ClipboardList, color: 'text-slate-800', bg: 'bg-white', border: 'border-slate-200' },
    { label: 'Chờ xét duyệt', value: counts.PENDING, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-200/80' },
    { label: 'Đủ điều kiện', value: counts.QUALIFIED, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-200/80' },
    { label: 'Trúng tuyển', value: counts.ADMITTED, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-200/80' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* ══════ HEADER ══════ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/tuyen-sinh/dot">
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-xl border-slate-200 text-slate-500 hover:text-[#005496] hover:bg-[#005496]/5 hover:border-[#005496]/20">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-800">{round?.name || '...'}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className={`text-[11px] px-2.5 py-0 border uppercase tracking-wider font-bold ${round?.level === 'TIEN_SI' ? 'text-amber-600 bg-amber-50/50 border-amber-200' : 'text-slate-600 bg-slate-50/50 border-slate-200'}`}>
                {round?.level === 'TIEN_SI' ? 'Tiến sĩ' : 'Thạc sĩ'}
              </Badge>
              {round && (
                <span className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {format(new Date(round.openDate), 'dd/MM/yyyy')} — {format(new Date(round.closeDate), 'dd/MM/yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ STAT CARDS ══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, idx) => (
          <div key={idx} className={`${s.bg} ${s.border} border rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} bg-white border border-current/10`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[24px] font-bold tracking-tight text-slate-800">{s.value}</p>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ TOOLBAR ══════ */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full lg:max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, CCCD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 text-[13px] font-medium bg-white">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ xét duyệt</SelectItem>
              <SelectItem value="QUALIFIED">Đủ điều kiện</SelectItem>
              <SelectItem value="ADMITTED">Trúng tuyển</SelectItem>
              <SelectItem value="NOT_QUALIFIED">Không đủ ĐK</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ══════ TABLE ══════ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#005496]" />
          </div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">Chưa có hồ sơ nào</h3>
            <p className="text-slate-500 max-w-sm mt-1.5 text-[13px] font-medium">Chưa có ứng viên nào nộp hồ sơ cho đợt tuyển sinh này.</p>
          </div>
        ) : (
          <>
            <Table className="w-full text-slate-600">
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 w-[40px]">#</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500">Ứng viên</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500">Liên hệ</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500">Bằng cấp</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Trạng thái</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Ngày nộp</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {applicants.map((app, idx) => {
                  const st = STATUS_MAP[app.status] || STATUS_MAP.PENDING
                  const StatusIcon = st.icon
                  return (
                    <TableRow key={app._id} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                      <TableCell className="py-3.5 px-5 text-[13px] text-slate-400 font-medium">
                        {(pagination.page - 1) * 20 + idx + 1}
                      </TableCell>
                      <TableCell className="py-3.5 px-5">
                        <div className="flex flex-col gap-0.5">
                          <Link href={`/admin/tuyen-sinh/ho-so/${app._id}`} className="text-[14px] font-bold text-slate-800 hover:text-[#005496] transition-colors">
                            {app.fullName}
                          </Link>
                          <span className="text-[12px] text-slate-400 font-medium">CCCD: {app.idCard}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-5">
                        <div className="flex flex-col gap-0.5 text-[13px]">
                          <span className="text-slate-700 font-medium">{app.email}</span>
                          <span className="text-slate-400">{app.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-5">
                        <div className="flex flex-col gap-0.5 text-[13px]">
                          <span className="text-slate-700 font-medium">{app.degreeMajor}</span>
                          <span className="text-slate-400 truncate max-w-[180px]">{app.degreeSchool}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-5 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-bold ${st.bg} ${st.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {st.label}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-5 text-center text-[13px] text-slate-500 font-medium">
                        {format(new Date(app.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/tuyen-sinh/ho-so/${app._id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#005496] hover:bg-[#005496]/10 bg-transparent" title="Xem chi tiết">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          {app.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost" size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-transparent"
                                title="Duyệt Đủ ĐK"
                                disabled={updatingId === app._id}
                                onClick={() => handleQuickStatus(app._id, 'QUALIFIED')}
                              >
                                {updatingId === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost" size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-transparent"
                                title="Từ chối"
                                disabled={updatingId === app._id}
                                onClick={() => handleQuickStatus(app._id, 'REJECTED')}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[13px] text-slate-500 font-medium">
                Hiển thị <span className="text-slate-900 font-bold">{applicants.length}</span> / <span className="text-slate-900 font-bold">{pagination.total}</span> hồ sơ
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="outline" size="sm"
                  className="h-8 px-3 rounded-lg text-[13px] font-medium border-slate-200 shadow-none bg-white"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchApplicants(pagination.page - 1)}
                >Trước</Button>
                <span className="flex items-center px-3 text-[13px] font-bold text-slate-600">{pagination.page} / {pagination.totalPages}</span>
                <Button
                  variant="outline" size="sm"
                  className="h-8 px-3 rounded-lg text-[13px] font-medium border-slate-200 shadow-none bg-white"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchApplicants(pagination.page + 1)}
                >Sau</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
