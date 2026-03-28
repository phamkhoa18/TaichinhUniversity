import Link from 'next/link'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import Category from '@/models/Category'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Plus, Search, Filter, Eye, Edit2, Trash2, CalendarIcon, User, Clock, FileText, Pin } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function NewsManagementPage() {
  await connectToDatabase()
  // Đảm bảo model Category đã được register
  Category
  const newsList = await News.find()
    .sort({ isPinned: -1, createdAt: -1 })
    .populate('author', 'name')
    .populate('category', 'name slug color')
    .limit(50)
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
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between w-full">
         <div className="flex-1 w-full lg:max-w-sm relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm theo tiêu đề..." 
              className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#005496]/50 focus:border-[#005496] transition-all"
            />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Hệ thống đang trống</h3>
              <p className="text-slate-500 max-w-sm mt-1 text-xs font-medium">
                Khởi tạo nội dung đầu tiên để tương tác với sinh viên.
              </p>
            </div>
          ) : (
            <>
              <Table className="w-full text-slate-600">
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 w-[45%]">Thông tin bài viết</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500">Danh mục</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-center">Trạng thái</TableHead>
                    <TableHead className="h-9 py-2 px-5 text-[13px] font-semibold text-slate-500 text-right">Quản lý</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {newsList.map((news: any) => (
                    <TableRow key={news._id.toString()} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100">
                      
                      <TableCell className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            {news.isPinned && <Pin className="w-3 h-3 text-[#005496] shrink-0" />}
                            <Link href={`/admin/thong-bao/${news._id}/edit`} className="text-[14px] font-bold text-slate-800 hover:text-[#005496] transition-colors leading-snug line-clamp-1 pr-4">
                              {news.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              {news.author?.name || 'Admin'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {format(new Date(news.createdAt), 'dd/MM/yyyy')}
                            </span>
                            {news.tags?.length > 0 && (
                              <span className="text-[0.6rem] text-slate-400">{news.tags.length} tags</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle">
                        {news.category ? (
                          <Badge variant="outline" className="text-[0.6rem] px-2 py-0 rounded-full font-bold border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full mr-1 shrink-0" style={{ backgroundColor: news.category.color || '#005496' }} />
                            {news.category.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle text-center">
                         <div className="inline-flex items-center gap-1.5">
                           <span className="relative flex h-2 w-2">
                             {news.status === 'PUBLISHED' && <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></>}
                             {news.status === 'DRAFT' && <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300"></span>}
                             {news.status === 'ARCHIVED' && <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>}
                           </span>
                           <span className="text-[13px] font-semibold text-slate-600">
                             {news.status === 'PUBLISHED' ? 'Công khai' : (news.status === 'DRAFT' ? 'Nháp' : 'Ẩn')}
                           </span>
                         </div>
                      </TableCell>

                      <TableCell className="py-3 px-5 align-middle text-right">
                        <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" title="Xem">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Link href={`/admin/thong-bao/${news._id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-[#005496] hover:bg-blue-50" title="Sửa">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50" title="Xóa">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-200 bg-white">
                <p className="text-[0.7rem] text-slate-500 font-medium">
                  Hiển thị <span className="text-slate-900 font-bold">{newsList.length}</span> kết quả
                </p>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 px-3 rounded text-xs font-medium text-slate-600 border-slate-200" disabled>Trước</Button>
                  <Button variant="outline" size="sm" className="h-7 px-3 rounded text-xs font-medium text-slate-600 border-slate-200" disabled>Sau</Button>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  )
}
