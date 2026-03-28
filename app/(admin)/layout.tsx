import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminShell from '@/components/layout/AdminShell'
import { SessionUser } from '@/types/auth'

export const metadata = {
  title: 'Admin Dashboard | UFM',
  description: 'Hệ thống Quản trị Đào tạo Sau Đại học UFM',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/dang-nhap')
  }

  const user = session.user as SessionUser

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  )
}
