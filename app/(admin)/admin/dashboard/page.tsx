import { auth } from '@/auth'
import { Users, FileText, BookOpen, GraduationCap, TrendingUp, Clock, FileWarning } from 'lucide-react'

import { SessionUser } from '@/types/auth'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as SessionUser

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">
            Xin chào, <span className="text-[#005496]">{user?.name}</span> 👋
          </h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">
            Dưới đây là tổng quan hệ thống Quản trị Sau Đại học hôm nay.
          </p>
        </div>
        <div className="text-right">
           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#005496]/5 border border-[#005496]/20 text-[#005496] text-[0.65rem] font-bold uppercase tracking-widest">
             Quyền: {user?.role}
           </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 transition-colors hover:border-[#005496]/30">
          <div className="flex items-center justify-between mb-3">
             <h3 className="tracking-tight text-[14px] font-medium text-slate-500">Người truy cập</h3>
             <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-2xl font-bold text-slate-900">12,450</div>
             <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-500">+15%</span> so với tháng trước
             </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 transition-colors hover:border-[#005496]/30">
          <div className="flex items-center justify-between mb-3">
             <h3 className="tracking-tight text-[14px] font-medium text-slate-500">Hồ sơ chờ duyệt</h3>
             <FileWarning className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-2xl font-bold text-slate-900">48</div>
             <p className="text-xs text-amber-600 font-medium">Cần xử lý gấp trong 24h</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 transition-colors hover:border-[#005496]/30">
          <div className="flex items-center justify-between mb-3">
             <h3 className="tracking-tight text-[14px] font-medium text-slate-500">Ngành Đào tạo</h3>
             <BookOpen className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-2xl font-bold text-slate-900">18</div>
             <p className="text-[13px] text-slate-500 font-medium">Đang trong kỳ tuyển sinh</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 transition-colors hover:border-[#005496]/30">
          <div className="flex items-center justify-between mb-3">
             <h3 className="tracking-tight text-[14px] font-medium text-slate-500">Khóa Ngắn hạn</h3>
             <GraduationCap className="h-4 w-4 text-rose-500" />
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-2xl font-bold text-slate-900">5</div>
             <p className="text-[13px] text-slate-500 font-medium">Khai giảng tháng tới</p>
          </div>
        </div>
      </div>
      
      {/* Focus Area layout */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold tracking-tight text-slate-800 text-sm">Biểu đồ Tuyển sinh 2026</h3>
                <button className="text-xs font-semibold text-[#005496] hover:text-white bg-[#005496]/5 hover:bg-[#005496] px-3 py-1.5 rounded-lg transition-colors border border-[#005496]/20 hover:border-transparent">
                  Xuất PDF
                </button>
             </div>
             
             {/* Chart Placeholder */}
             <div className="h-56 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                  <TrendingUp className="w-5 h-5 text-[#005496]/50" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Dữ liệu hiện đang trống</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Hệ thống Recharts sẽ được tích hợp vào để vẽ biểu đồ thống kê hồ sơ.</p>
             </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold tracking-tight text-slate-800 text-sm flex items-center gap-2">
                   Hoạt động gần đây 
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
             </div>
             <p className="text-xs text-slate-500 mb-5 font-medium">Nhật ký xử lý hệ thống</p>

             {/* Activity Timeline */}
             <div className="space-y-4 flex-1 pl-1">
                {[
                  { text: "Sinh viên TS Huỳnh Tấn phát đã nộp lệ phí dự thi", time: "10 phút trước", type: "success" },
                  { text: 'Sửa thông báo "Kế hoạch thi Anh văn Đợt 2"', time: "1 giờ trước", type: "edit" },
                  { text: "Admin đã cập nhật phân quyền người dùng mới", time: "Hôm qua", type: "system" }
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 relative">
                     {/* Line */}
                     {i !== 2 && <div className="absolute left-[6px] top-[16px] bottom-[-16px] w-[1.5px] bg-slate-100" />}
                     
                     {/* Node */}
                     <div className={`w-[13px] h-[13px] shrink-0 rounded-full border-2 border-white ring-1 ring-slate-200 z-10 mt-0.5
                        ${log.type === 'success' ? 'bg-[#005496]' : 
                          log.type === 'edit' ? 'bg-[#ffd200]' : 'bg-slate-800'}`} 
                     />
                     <div className="-mt-0.5 flex flex-col">
                        <p className="text-xs font-medium text-slate-700 leading-relaxed break-words pr-2">
                          {log.text}
                        </p>
                        <span className="text-[0.65rem] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.time}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs py-2 rounded-lg transition-colors">
                Xem toàn bộ nhật ký
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
