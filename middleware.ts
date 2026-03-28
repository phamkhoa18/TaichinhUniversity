// ============================================================
// MIDDLEWARE — Bảo vệ các route Admin
// ============================================================
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/authConfig'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dùng NextAuth Edge-friendly
const { auth } = NextAuth(authConfig)

const protectedRoutes = ['/admin', '/api/admin']

export default auth((request: any) => {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtectedRoute) {
    const session = request.auth
    
    // Nếu chưa đăng nhập -> văng ra trang đăng nhập
    if (!session) {
      const loginUrl = new URL('/dang-nhap', request.url)
      loginUrl.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(loginUrl)
    }

    // Role STUDENT không thể vào /admin
    if (session?.user && (session.user as any).role === 'STUDENT') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  return NextResponse.next()
})

// Config matchers cho middleware
export const config = {
  matcher: ['/((?!api/public|_next/static|_next/image|favicon.ico|images|uploads).*)'],
}
