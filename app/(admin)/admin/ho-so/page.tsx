import { auth } from '@/auth'
import connectToDatabase from '@/lib/db/mongodb'
import User from '@/models/User'
import ProfileClient from './ProfileClient'
import { redirect } from 'next/navigation'
import { SessionUser } from '@/types/auth'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/dang-nhap')
  }

  await connectToDatabase()
  
  // Fetch real user data from DB using the ID in session
  const user = await User.findById(session.user.id).select('-passwordHash').lean()
  
  if (!user) {
    redirect('/dang-nhap')
  }

  // Convert ObjectId to string to pass down to Client Component
  const plainUser = {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-6 pb-12">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-800">
          Hồ sơ cá nhân
        </h1>
        <p className="text-[14px] text-slate-500 mt-1">
          Quản lý thông tin bảo mật và tài khoản của bạn trên hệ thống.
        </p>
      </div>

      <ProfileClient initialData={plainUser} />
    </div>
  )
}
