import Link from 'next/link'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import Category from '@/models/Category'
import '@/models/User'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Plus, Search, Filter, Clock, FileText, Pin, User } from 'lucide-react'
import { format } from 'date-fns'
import NewsActions from './NewsActions'

export const dynamic = 'force-dynamic'

export default async function NewsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : ''
  const currentPage = Number(resolvedParams.page) || 1
  const ITEMS_PER_PAGE = 10
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  await connectToDatabase()
  // Đảm bảo model Category đã được register
  Category

  const query: any = {}
  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }

  const totalCount = await News.countDocuments(query)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const newsList = await News.find(query)
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .populate('author', 'name')
    .populate('category', 'name slug color')
    .lean()

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Quản lý Thông báo</h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Kho lưu trữ nội dung truyền thông, sự kiện và tin tức cập nhật.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/thong-bao/danh-muc">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold text-slate-600 border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5 mr-1.5" /> Danh mục
            </Button>
          </Link>
          <Link href="/admin/thong-bao/tao-moi">
            <Button size="sm" className="h-8 px-4 text-xs font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Tạo bài viết
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" action="/admin/thong-bao" className="flex flex-col lg:flex-row gap-3 items-center justify-between w-full">
         <div className="flex-1 w-full lg:max-w-sm relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Tìm theo tiêu đề..." 
              className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all shadow-sm"
            />
         </div>
         <button type="submit" className="hidden" />
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">{search ? 'Không tìm thấy kết quả' : 'Hệ thống đang trống'}</h3>
              <p className="text-slate-500 max-w-sm mt-1 text-xs font-medium">
                {search ? 'Vui lòng thử lại với từ khóa khác.' : 'Khởi tạo nội dung đầu tiên để tương tác với sinh viên.'}
              </p>
              {search && (
                <Link href="/admin/thong-bao">
                  <Button variant="outline" className="mt-4 h-8 px-4 text-xs font-semibold rounded-lg text-slate-600">Xóa tìm kiếm</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table className="w-full text-slate-600">
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[60px] text-center font-semibold text-slate-500 h-9 py-2 text-[13px]">STT</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 w-[45%]">Thông tin bài viết</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500">Danh mục</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Trạng thái</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Quản lý</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {newsList.map((news: any, idx: number) => (
                    <TableRow key={news._id.toString()} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                      
                      {/* Cột STT */}
                      <TableCell className="py-3 px-3 text-center align-middle">
                         <span className="text-[13px] font-semibold text-slate-400">
                           {skip + idx + 1}
                         </span>
                      </TableCell>

                      <TableCell className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            {news.isPinned && <Pin className="w-3.5 h-3.5 text-[#005496] shrink-0 fill-[#005496]/10" />}
                            <Link href={`/admin/thong-bao/${news._id}/edit`} className="text-[14px] font-bold text-slate-800 hover:text-[#005496] transition-colors leading-snug line-clamp-1 pr-4">
                              {news.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium mt-0.5">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[120px]">{news.author?.name || 'VĐTSĐH'}</span>
                            </span>
                            <span className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {format(new Date(news.createdAt), 'dd/MM/yyyy')}
                            </span>
                            {news.tags?.length > 0 && (
                              <span className="text-[11px] font-semibold text-slate-400 border-l border-slate-200 pl-3 ml-0.5">
                                {news.tags.length} thẻ
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle">
                        {news.category ? (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-bold border-slate-200 uppercase tracking-wide bg-white shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: news.category.color || '#005496' }} />
                            {news.category.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle text-center">
                         <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100">
                           <span className="relative flex h-2 w-2">
                             {news.status === 'PUBLISHED' && <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></>}
                             {news.status === 'DRAFT' && <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>}
                             {news.status === 'ARCHIVED' && <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>}
                           </span>
                           <span className="text-[12px] font-bold text-slate-600 tracking-wide">
                             {news.status === 'PUBLISHED' ? 'CÔNG KHAI' : (news.status === 'DRAFT' ? 'BẢN NHÁP' : 'LƯU TRỮ')}
                           </span>
                         </div>
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle text-right w-[140px]">
                        <NewsActions id={news._id.toString()} slug={news.slug || ''} />
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination UI chuẩn */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
                <p className="text-[13px] text-slate-500 font-medium">
                  Hiển thị <span className="text-slate-900 font-bold">{totalCount === 0 ? 0 : skip + 1}</span> đến <span className="text-slate-900 font-bold">{Math.min(skip + newsList.length, totalCount)}</span> trong số <span className="text-[#005496] font-bold">{totalCount}</span> bài viết
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link href={`?search=${encodeURIComponent(search)}&page=${currentPage - 1}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-white hover:text-[#005496] border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#005496]/20">
                        Trước
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-400 border-slate-200 opacity-60">
                      Trước
                    </Button>
                  )}

                  {currentPage < totalPages ? (
                    <Link href={`?search=${encodeURIComponent(search)}&page=${currentPage + 1}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-white hover:text-[#005496] border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-[#005496]/20">
                        Tiếp
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="h-8 px-3.5 rounded-lg text-[12px] font-semibold text-slate-400 border-slate-200 opacity-60">
                      Tiếp
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  )
}
