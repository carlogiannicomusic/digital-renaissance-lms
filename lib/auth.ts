import NextAuth, { type NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import type { User, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db/prisma'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        console.log('🔐 Login attempt:', credentials.email)
        console.log('👤 User found:', user ? `${user.email} (${user.role}, ${user.status})` : 'NOT FOUND')

        if (!user || user.status !== 'ACTIVE') {
          console.log('❌ User not found or not active')
          return null
        }

        // Compare hashed passwords with bcrypt
        const isValid = await bcrypt.compare(credentials.password as string, user.password)
        console.log('🔑 Password valid:', isValid)
        console.log('🔑 Hash in DB:', user.password.substring(0, 20) + '...')

        if (!isValid) {
          console.log('❌ Invalid password')
          return null
        }

        console.log('✅ Login successful')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}

export default NextAuth(authConfig)

// Helper function for server components
export async function auth() {
  return await getServerSession(authConfig)
}

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    id?: string
  }
}
