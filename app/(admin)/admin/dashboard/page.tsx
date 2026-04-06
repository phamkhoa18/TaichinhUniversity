import { auth } from '@/auth'
import connectToDatabase from '@/lib/db/mongodb'
import { SessionUser } from '@/types/auth'
import { Users, FileWarning, BookOpen, GraduationCap, TrendingUp, Clock, CalendarRange, ArrowRight, Activity } from 'lucide-react'
import Link from 'next/link'

// Models
import Applicant from '@/models/Applicant'
import TrainingProgram from '@/models/TrainingProgram'
import ShortCourse from '@/models/ShortCourse'
import ShortCourseRegistration from '@/models/ShortCourseRegistration'
import News from '@/models/News'

// Client Chart Components
import { DashboardAdmissionsChart, DashboardDistributionChart } from './DashboardCharts'

export const dynamic = 'force-dynamic'

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as SessionUser

  await connectToDatabase()

  // 1. Fetch Key Stats
  const [
    totalApplicants,
    pendingApplicants,
    totalPrograms,
    totalShortCourses,
    draftNewsCount
  ] = await Promise.all([
    Applicant.countDocuments(),
    Applicant.countDocuments({ status: 'PENDING' }),
    TrainingProgram.countDocuments({ status: 'PUBLISHED' }),
    ShortCourse.countDocuments({ status: 'DRAFT' }), // Hoặc active
    News.countDocuments({ status: 'DRAFT' }),
  ])

  // 2. Fetch Chart Data (Admissions by month for current year)
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  
  const applicantsByMonth = await Applicant.aggregate([
    { $match: { createdAt: { $gte: startOfYear } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        total: { $sum: 1 },
        admitted: { $sum: { $cond: [{ $eq: ['$status', 'ADMITTED'] }, 1, 0] } }
      }
    },
    { $sort: { '_id.month': 1 } }
  ])

  // Process data for AreaChart (12 months)
  const monthNames = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12']
  const chartData = monthNames.map((name, index) => {
    const found = applicantsByMonth.find(item => item._id.month === index + 1)
    return {
      month: name,
      applicants: found ? found.total : 0,
      admitted: found ? found.admitted : 0,
    }
  })

  // 3. Fetch Recent Activities (Combine recent applicants and course registrations)
  const recentApplicants = await Applicant.find().sort({ createdAt: -1 }).limit(3).lean()
  const recentRegistrations = await ShortCourseRegistration.find().sort({ createdAt: -1 }).limit(2).lean()
  
  const rawActivities = [
    ...recentApplicants.map((app: any) => ({
      text: `Hồ sơ mới: ${app.fullName} đăng ký ${app.degreeMajor}`,
      time: app.createdAt,
      type: 'applicant'
    })),
    ...recentRegistrations.map((reg: any) => ({
      text: `Đăng ký ĐTNH: ${reg.lastName} ${reg.firstName}`,
      time: reg.createdAt,
      type: 'course'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4)

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">
            Xin chào, <span className="text-[#005496]">{user?.name || 'Quản trị viên'}</span> 👋
          </h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1 inline-flex items-center gap-2">
            Tổng quan hệ thống Quản trị Sau Đại học hôm nay.
          </p>
        </div>
        <div className="text-right flex items-center gap-3">
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#005496]/5 border border-[#005496]/20 text-[#005496] text-[11px] font-bold uppercase tracking-widest">
             Tài khoản: {user?.role || 'Admin'}
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-all hover:border-[#005496]/40 hover:shadow-lg hover:shadow-[#005496]/5 group cursor-default">
          <div className="flex items-center justify-between mb-4">
             <h3 className="tracking-tight text-[14px] font-semibold text-slate-500 uppercase">Ứng viên Tuyển sinh</h3>
             <div className="w-8 h-8 rounded-full bg-[#005496]/10 flex items-center justify-center text-[#005496] group-hover:scale-110 transition-transform">
               <Users className="h-4 w-4" />
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">{totalApplicants.toLocaleString('vi-VN')}</div>
             <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
               <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-emerald-500 font-semibold">+Tăng trưởng</span> trong năm {currentYear}
             </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-all hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 group cursor-default relative overflow-hidden">
          {pendingApplicants > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-[100px] -z-0" />}
          <div className="flex items-center justify-between mb-4 relative z-10">
             <h3 className="tracking-tight text-[14px] font-semibold text-slate-500 uppercase">Hồ sơ chờ duyệt</h3>
             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
               <FileWarning className="h-4 w-4" />
             </div>
          </div>
          <div className="flex flex-col gap-1 relative z-10">
             <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">{pendingApplicants.toLocaleString('vi-VN')}</div>
             <Link href="/admin/tuyen-sinh/ho-so" className="text-[13px] text-amber-600 font-bold flex items-center gap-1 hover:text-amber-700 mt-1 w-max">
               Xử lý ngay <ArrowRight className="w-3.5 h-3.5" />
             </Link>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group cursor-default">
          <div className="flex items-center justify-between mb-4">
             <h3 className="tracking-tight text-[14px] font-semibold text-slate-500 uppercase">Chương trình Đào tạo</h3>
             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
               <BookOpen className="h-4 w-4" />
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">{totalPrograms.toLocaleString('vi-VN')}</div>
             <p className="text-[13px] text-slate-500 font-medium mt-1">Đang hoạt động (Published)</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 group cursor-default">
          <div className="flex items-center justify-between mb-4">
             <h3 className="tracking-tight text-[14px] font-semibold text-slate-500 uppercase">Khóa Ngắn hạn</h3>
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
               <GraduationCap className="h-4 w-4" />
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <div className="text-[28px] font-extrabold text-slate-900 tracking-tight">{totalShortCourses.toLocaleString('vi-VN')}</div>
             <p className="text-[13px] text-slate-500 font-medium mt-1">Tổng số lớp hiện hành</p>
          </div>
        </div>
      </div>
      
      {/* Focus Area layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white/80 rounded-3xl border border-slate-200 p-6 flex-1 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold tracking-tight text-slate-800 text-[18px]">Biểu đồ Tuyển sinh {currentYear}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Thống kê lượng hồ sơ nộp vào và tỷ lệ trúng tuyển qua các tháng.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <CalendarRange className="w-3.5 h-3.5" /> Năm {currentYear}
                  </span>
                </div>
             </div>
             
             {/* Render Client Chart */}
             <DashboardAdmissionsChart data={chartData} />
             
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Draft Notification Widget */}
          {draftNewsCount > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 shadow-sm">
               <h3 className="font-bold text-amber-800 text-[15px] flex items-center gap-2">
                 <FileWarning className="w-4 h-4" /> Nhắc nhở công việc
               </h3>
               <p className="text-[13px] text-amber-700 font-medium mt-2 leading-relaxed mt-2">
                 Có <strong>{draftNewsCount} bài tin tức</strong> đang ở trạng thái bản nháp (Draft). Vui lòng kiểm tra và xuất bản.
               </p>
               <Link href="/admin/thong-bao" className="inline-block mt-4 text-[12px] font-bold text-amber-800 bg-amber-200/50 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors">
                 Tới kho bài viết
               </Link>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white/80 rounded-3xl border border-slate-200 p-6 flex-1 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold tracking-tight text-slate-800 text-[16px] flex items-center gap-2.5">
                   Hoạt động gần đây 
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
             </div>

             <div className="space-y-5 flex-1 relative mt-2 pl-2">
                <div className="absolute left-[13px] top-[10px] bottom-[10px] w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
                
                {rawActivities.length > 0 ? rawActivities.map((log, i) => (
                  <div key={i} className="flex gap-4 relative z-10 group">
                     {/* Node */}
                     <div className={`w-[11px] h-[11px] shrink-0 rounded-full border-[2px] border-white ring-2 z-10 mt-1 shadow-sm transition-all group-hover:scale-125
                        ${log.type === 'applicant' ? 'bg-[#10b981] ring-[#10b981]/20' : 
                          log.type === 'course' ? 'bg-[#005496] ring-[#005496]/20' : 'bg-slate-300 ring-slate-100'}`} 
                     />
                     <div className="-mt-1 flex flex-col">
                        <p className="text-[13px] font-semibold text-slate-700 leading-snug break-words">
                          {log.text}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {timeAgo(new Date(log.time))}
                        </span>
                     </div>
                  </div>
                )) : (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-500 font-medium">Chưa có hoạt động mới.</p>
                  </div>
                )}
             </div>
             
             <button className="w-full mt-6 bg-slate-50 hover:bg-[#005496]/5 border border-slate-200 hover:border-[#005496]/20 text-slate-600 hover:text-[#005496] font-bold text-[13px] py-2.5 rounded-xl transition-all">
                Xem toàn bộ lịch sử
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
