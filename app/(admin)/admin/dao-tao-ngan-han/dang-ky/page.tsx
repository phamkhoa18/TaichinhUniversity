'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  ChevronLeft, Search, Users, Loader2, Trash2, CheckCircle2,
  Clock, Phone, Mail, CreditCard, BookOpen
} from 'lucide-react'
import { format } from 'date-fns'
import { showToast } from '@/lib/toast'

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admin/dao-tao-ngan-han/registrations?${params}`)
      const json = await res.json()
      if (json.success) {
        setRegistrations(json.data)
        setTotal(json.total)
      }
    } catch { }
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const togglePayment = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID'
    try {
      const res = await fetch(`/api/admin/dao-tao-ngan-han/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        showToast.success(newStatus === 'PAID' ? 'Đã xác nhận thanh toán' : 'Đã chuyển về chờ thanh toán')
        fetchData()
      }
    } catch {
      showToast.error('Lỗi cập nhật')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa đăng ký này?')) return
    try {
      const res = await fetch(`/api/admin/dao-tao-ngan-han/registrations/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        showToast.success('Đã xóa')
        fetchData()
      }
    } catch {
      showToast.error('Lỗi xóa')
    }
  }

  const statusTabs = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ thanh toán', value: 'PENDING' },
    { label: 'Đã thanh toán', value: 'PAID' },
    { label: 'Đã hủy', value: 'CANCELLED' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dao-tao-ngan-han">
            <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:text-[#005496] hover:border-[#005496]/20 transition-all shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Quản lý Đăng ký</h1>
            <p className="text-[15px] text-slate-500 font-medium mt-1">Tổng cộng <span className="text-[#005496] font-bold">{total}</span> đăng ký</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-[#005496] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 w-full lg:max-w-sm relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
        <input
          type="text" placeholder="Tìm theo tên, SĐT, email, mã ĐK..."
          className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all shadow-sm"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-14">
            <Loader2 className="w-8 h-8 animate-spin text-[#005496]" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Chưa có đăng ký nào</h3>
            <p className="text-slate-500 max-w-sm mt-1 text-xs font-medium">Đăng ký sẽ xuất hiện khi học viên đăng ký qua trang web.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-slate-600 min-w-[900px]">
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[50px] text-center font-semibold text-slate-500 h-9 py-2 text-[13px]">STT</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500">Mã ĐK</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500">Học viên</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500">Lớp đăng ký</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500 text-right">Tổng phí</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500 text-center">Thanh toán</TableHead>
                  <TableHead className="h-9 py-2 px-4 text-[13px] font-semibold text-slate-500 text-right">Quản lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {registrations.map((reg: any, idx: number) => (
                  <TableRow key={reg._id} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                    <TableCell className="py-3 px-3 text-center align-middle">
                      <span className="text-[13px] font-semibold text-slate-400">{idx + 1}</span>
                    </TableCell>

                    <TableCell className="py-3 px-4 align-middle">
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-bold border-[#005496]/20 text-[#005496] uppercase tracking-widest font-mono bg-[#005496]/5">
                        {reg.registrationCode}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-slate-800">{reg.lastName} {reg.firstName}</span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{reg.phone}</span>
                          <span className="flex items-center gap-1 border-l border-slate-200 pl-3"><Mail className="w-3 h-3" />{reg.email}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400"><Clock className="w-3 h-3" />{format(new Date(reg.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {reg.courses?.map((c: any) => (
                          <span key={c._id} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-mono text-[10px] text-slate-500">{c.code}</span>
                            <span className="truncate max-w-[160px]">{c.title}</span>
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4 align-middle text-right">
                      <span className="text-[13px] font-bold text-slate-800 tabular-nums">{formatVND(reg.totalFee)}</span>
                    </TableCell>

                    <TableCell className="py-3 px-4 align-middle text-center">
                      <button
                        onClick={() => togglePayment(reg._id, reg.paymentStatus)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold tracking-wide transition-all hover:shadow-sm cursor-pointer ${
                          reg.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : reg.paymentStatus === 'CANCELLED'
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {reg.paymentStatus === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                        {reg.paymentStatus === 'PAID' ? 'ĐÃ TT' : reg.paymentStatus === 'CANCELLED' ? 'ĐÃ HỦY' : 'CHỜ TT'}
                      </button>
                    </TableCell>

                    <TableCell className="py-3 px-4 align-middle text-right">
                      <Button onClick={() => handleDelete(reg._id)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50" title="Xóa">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
