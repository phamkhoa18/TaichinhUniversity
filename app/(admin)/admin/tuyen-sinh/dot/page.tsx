import Link from 'next/link'
import connectToDatabase from '@/lib/db/mongodb'
import AdmissionRound from '@/models/AdmissionRound'
import Applicant from '@/models/Applicant' // import để populate ảo chạy
import { format } from 'date-fns'
import { Plus, Search, Filter, Eye, Edit2, Trash2, CalendarIcon, Users, Calendar, GraduationCap, Pin, Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function AdmissionRoundsPage() {
  await connectToDatabase()
  Applicant // ensure Applicant is registered for populate virtual

  const rounds = await AdmissionRound.find()
    .sort({ status: -1, openDate: -1 })
    .populate('applicantCount')
    .lean() as any[]

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Quản lý Đợt Tuyển sinh</h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Thiết lập các mốc thời gian và chỉ tiêu tuyển sinh Thạc sĩ, Tiến sĩ.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/tuyen-sinh/dot/tao-moi">
            <Button size="sm" className="h-9 px-4 text-[13px] font-bold rounded-xl bg-[#005496] hover:bg-[#004882] text-white transition-all shadow-none">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm đợt mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between w-full">
         <div className="flex-1 w-full lg:max-w-sm relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm theo tên đợt tuyển sinh..." 
              className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all"
            />
         </div>
         <Button variant="outline" className="h-10 px-3.5 text-[13px] font-semibold text-slate-600 border-slate-200 rounded-xl hover:bg-slate-50 shadow-none">
           <Filter className="w-3.5 h-3.5 mr-1.5" /> Lọc đợt
         </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {rounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">Chưa có đợt tuyển sinh nào</h3>
            <p className="text-slate-500 max-w-sm mt-1.5 text-[13px] font-medium leading-relaxed">
              Bạn chưa thiết lập cấu hình đợt tuyển sinh mới cho hệ thống SĐH.
            </p>
            <Link href="/admin/tuyen-sinh/dot/tao-moi" className="mt-5">
               <Button className="h-9 px-5 bg-slate-900 hover:bg-slate-800 rounded-xl font-semibold text-[13px] shadow-none">Tạo đợt đầu tiên</Button>
            </Link>
          </div>
        ) : (
          <>
            <Table className="w-full text-slate-600">
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500">Thông tin đợt</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500">Thời gian</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Hồ sơ</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Trạng thái</TableHead>
                  <TableHead className="h-10 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Quản lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {rounds.map((round) => {
                  const isActive = round.status === 'OPEN'
                  const isUpcoming = round.status === 'UPCOMING'
                  const isClosed = round.status === 'CLOSED'
                  
                  return (
                    <TableRow key={round._id.toString()} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                      
                      <TableCell className="py-4 px-5">
                        <div className="flex flex-col gap-1.5">
                          <Link href={`/admin/tuyen-sinh/dot/${round._id}`} className="text-[14px] font-bold text-slate-800 hover:text-[#005496] transition-colors leading-snug truncate pr-4">
                            {round.name}
                          </Link>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[11px] px-2 py-0 border-slate-200 uppercase tracking-wider font-bold ${round.level === 'TIEN_SI' ? 'text-amber-600 bg-amber-50/50' : 'text-slate-600 bg-slate-50/50'}`}>
                              {round.level === 'TIEN_SI' ? 'Tiến sĩ' : 'Thạc sĩ'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-5 align-middle">
                        <div className="flex flex-col gap-1 text-[13px] text-slate-600 font-medium">
                          <span className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {format(new Date(round.openDate), 'dd/MM/yyyy')}
                          </span>
                          <span className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {format(new Date(round.closeDate), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-5 align-middle text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                           <span className="text-[15px] font-bold text-slate-800">
                             {round.applicantCount || 0}
                             <span className="text-[12px] font-medium text-slate-400"> / {round.quota}</span>
                           </span>
                           <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hồ sơ nộp</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-5 align-middle text-center">
                         <div className="inline-flex items-center gap-1.5">
                           <span className="relative flex h-2 w-2">
                             {isActive && <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></>}
                             {isClosed && <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300"></span>}
                             {isUpcoming && <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd200]"></span>}
                           </span>
                           <span className="text-[13px] font-semibold text-slate-700">
                             {isActive ? 'Đang mở' : (isClosed ? 'Đã đóng' : 'Sắp diễn ra')}
                           </span>
                         </div>
                      </TableCell>

                      <TableCell className="py-4 px-5 align-middle text-right">
                        <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 bg-transparent transition-colors" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Link href={`/admin/tuyen-sinh/dot/${round._id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#005496] hover:bg-[#005496]/10 bg-transparent transition-colors" title="Sửa">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-transparent transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
                Hiển thị <span className="text-slate-900 font-bold">{rounds.length}</span> kết quả
              </p>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-[13px] font-medium text-slate-600 border-slate-200 shadow-none bg-white" disabled>Trước</Button>
                <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-[13px] font-medium text-slate-600 border-slate-200 shadow-none bg-white" disabled>Sau</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
