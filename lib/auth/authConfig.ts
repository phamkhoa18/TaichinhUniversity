import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/dang-nhap',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPath = nextUrl.pathname.startsWith('/admin')
      if (isAdminPath) return isLoggedIn
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  providers: [], // Thêm Providers ở file auth.ts (Node.js/Server API)
} satisfies NextAuthConfig;
