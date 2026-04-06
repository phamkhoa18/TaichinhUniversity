import Link from 'next/link'
import connectToDatabase from '@/lib/db/mongodb'
import ShortCourse from '@/models/ShortCourse'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Plus, Search, BookMarked, Users, Flame, Clock } from 'lucide-react'
import { format } from 'date-fns'
import CourseActions from './CourseActions'

export const dynamic = 'force-dynamic'

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default async function ShortCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : ''
  const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : ''
  const currentPage = Number(resolvedParams.page) || 1
  const ITEMS_PER_PAGE = 10
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  await connectToDatabase()

  const query: any = {}
  if (search) query.title = { $regex: search, $options: 'i' }
  if (statusFilter) query.status = statusFilter

  const totalCount = await ShortCourse.countDocuments(query)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const courses = await ShortCourse.find(query)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean()

  const statusTabs = [
    { label: 'Tất cả', value: '', count: await ShortCourse.countDocuments({}) },
    { label: 'Đang mở', value: 'OPEN', count: await ShortCourse.countDocuments({ status: 'OPEN' }) },
    { label: 'Bản nháp', value: 'DRAFT', count: await ShortCourse.countDocuments({ status: 'DRAFT' }) },
    { label: 'Đã đóng', value: 'CLOSED', count: await ShortCourse.countDocuments({ status: 'CLOSED' }) },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Đào tạo Ngắn hạn</h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Quản lý các khóa đào tạo ngắn hạn, chứng chỉ và bồi dưỡng.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dao-tao-ngan-han/dang-ky">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold text-slate-600 border-slate-200 rounded-lg hover:bg-slate-50">
              <Users className="w-3.5 h-3.5 mr-1.5" /> Đăng ký
            </Button>
          </Link>
          <Link href="/admin/dao-tao-ngan-han/tao-moi">
            <Button size="sm" className="h-8 px-4 text-xs font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Tạo khóa mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
        {statusTabs.map(tab => (
          <Link
            key={tab.value}
            href={`/admin/dao-tao-ngan-han?status=${tab.value}&search=${encodeURIComponent(search)}`}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-[#005496] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              statusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Search */}
      <form method="GET" action="/admin/dao-tao-ngan-han" className="flex flex-col lg:flex-row gap-3 items-center justify-between w-full">
        <input type="hidden" name="status" value={statusFilter} />
        <div className="flex-1 w-full lg:max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm theo tên khóa học..."
            className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all shadow-sm"
          />
        </div>
        <button type="submit" className="hidden" />
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <BookMarked className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">{search ? 'Không tìm thấy kết quả' : 'Chưa có khóa học nào'}</h3>
            <p className="text-slate-500 max-w-sm mt-1 text-xs font-medium">
              {search ? 'Vui lòng thử lại với từ khóa khác.' : 'Tạo khóa đào tạo ngắn hạn đầu tiên ngay bây giờ.'}
            </p>
          </div>
        ) : (
          <>
            <Table className="w-full text-slate-600">
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[50px] text-center font-semibold text-slate-500 h-9 py-2 text-[13px]">STT</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 w-[35%]">Khóa học</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500">Mã lớp</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Học phí</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">SL</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Trạng thái</TableHead>
                  <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Quản lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {courses.map((course: any, idx: number) => (
                  <TableRow key={course._id.toString()} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                    <TableCell className="py-3 px-3 text-center align-middle">
                      <span className="text-[13px] font-semibold text-slate-400">{skip + idx + 1}</span>
                    </TableCell>

                    <TableCell className="py-3 px-5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          {course.isHot && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                          <Link href={`/admin/dao-tao-ngan-han/${course._id}/edit`} className="text-[14px] font-bold text-slate-800 hover:text-[#005496] transition-colors leading-snug line-clamp-1">
                            {course.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium mt-0.5">
                          {course.startDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {format(new Date(course.startDate), 'dd/MM/yyyy')}
                            </span>
                          )}
                          {course.duration && (
                            <span className="border-l border-slate-200 pl-3">{course.duration}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-5 align-middle">
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-bold border-slate-200 uppercase tracking-widest bg-white shadow-sm font-mono">
                        {course.code}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3 px-5 align-middle text-right">
                      <span className="text-[13px] font-bold text-slate-800 tabular-nums">{formatVND(course.price)}</span>
                    </TableCell>

                    <TableCell className="py-3 px-5 align-middle text-center">
                      <span className="text-[12px] font-bold text-slate-600 tabular-nums">
                        {course.currentStudents}{course.maxStudents > 0 ? `/${course.maxStudents}` : ''}
                      </span>
                    </TableCell>

                    <TableCell className="py-3 px-5 align-middle text-center">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100">
                        <span className="relative flex h-2 w-2">
                          {course.status === 'OPEN' && <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></>}
                          {course.status === 'DRAFT' && <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>}
                          {course.status === 'CLOSED' && <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>}
                        </span>
                        <span className="text-[12px] font-bold text-slate-600 tracking-wide">
                          {course.status === 'OPEN' ? 'ĐANG MỞ' : course.status === 'DRAFT' ? 'BẢN NHÁP' : 'ĐÃ ĐÓNG'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-5 align-middle text-right w-[100px]">
                      <CourseActions id={course._id.toString()} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
              <p className="text-[13px] text-slate-500 font-medium">
                Hiển thị <span className="text-slate-900 font-bold">{totalCount === 0 ? 0 : skip + 1}</span> đến <span className="text-slate-900 font-bold">{Math.min(skip + courses.length, totalCount)}</span> trong số <span className="text-[#005496] font-bold">{totalCount}</span> khóa học
              </p>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link href={`?status=${statusFilter}&search=${encodeURIComponent(search)}&page=${currentPage - 1}`}>
                    <Button variant="outline" size="sm" className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-700 border-slate-200 shadow-sm">Trước</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-400 border-slate-200 opacity-60">Trước</Button>
                )}
                {currentPage < totalPages ? (
                  <Link href={`?status=${statusFilter}&search=${encodeURIComponent(search)}&page=${currentPage + 1}`}>
                    <Button variant="outline" size="sm" className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-700 border-slate-200 shadow-sm">Tiếp</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-400 border-slate-200 opacity-60">Tiếp</Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
