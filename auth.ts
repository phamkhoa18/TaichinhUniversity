// ============================================================
// AUTH.TS — NextAuth entry point (Node.js API)
// ============================================================
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from '@/lib/auth/authConfig'
import connectToDatabase from '@/lib/db/mongodb'
import User from '@/models/User'
import { comparePassword } from '@/lib/auth/passwordUtils'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        if (!email || !password) return null

        // Kết nối MongoDB
        await connectToDatabase()

        // Tìm user trong database
        const user = await User.findOne({ email }).lean()
        if (!user) return null

        // So sánh Password
        const isValid = await comparePassword(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
  ],
})
