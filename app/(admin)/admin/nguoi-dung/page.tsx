import { auth } from '@/auth'
import connectToDatabase from '@/lib/db/mongodb'
import User from '@/models/User'
import UsersClient from './UsersClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await auth()
  
  // Bảo vệ route, chỉ ADMIN mới xem được
  const userRole = (session?.user as any)?.role
  if (!session?.user || userRole !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Truy cập bị từ chối</h1>
        <p className="text-slate-500 mt-2">Chỉ tài khoản ADMIN mới có quyền truy cập trang Quản lý Người dùng.</p>
      </div>
    )
  }

  await connectToDatabase()
  const users = await User.find({}).sort({ createdAt: -1 }).select('-passwordHash').lean()

  // Convert ObjectIds to string
  const plainUsers = users.map(u => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800 flex items-center gap-2">
            Quản trị Người dùng
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Quản lý tài khoản, phân quyền và giám sát hoạt động hệ thống.
          </p>
        </div>
      </div>

      <UsersClient initialUsers={plainUsers} currentUserId={session.user.id} />
    </div>
  )
}
