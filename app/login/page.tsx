'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SlideUp } from '@/components/page-transition'
import { LogIn, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('INVALID CREDENTIALS')
        setIsLoading(false)
        return
      }

      // Immediate redirect without toast to prevent overlay blocking
      window.location.href = '/dashboard'
    } catch (error) {
      toast.error('LOGIN FAILED')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Black */}
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <Link href="/">
            <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
              DIGITAL RENAISSANCE
            </h1>
          </Link>
        </div>
      </header>

      <SlideUp>
        <section className="max-w-md mx-auto px-8 py-16">
          {/* Login Form - Yellow */}
          <div className="bg-dr-yellow border-4 border-dr-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <LogIn className="h-8 w-8 text-dr-black" />
              <h2 className="font-display text-3xl text-dr-black uppercase">
                LOGIN
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dr-black" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dr-black" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="black"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
            </form>
          </div>

          {/* Test Credentials - Blue */}
          <div className="bg-dr-blue border-4 border-dr-black p-6 mt-6">
            <h3 className="font-display text-xl text-dr-black uppercase mb-4">
              TEST CREDENTIALS
            </h3>
            <div className="space-y-3 text-sm font-bold text-dr-black">
              <div className="bg-dr-white border-2 border-dr-black p-3">
                <p className="uppercase mb-1">ADMINISTRATOR</p>
                <p>Email: admin@digitalrenaissance.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="bg-dr-white border-2 border-dr-black p-3">
                <p className="uppercase mb-1">TEACHER</p>
                <p>Email: teacher@digitalrenaissance.com</p>
                <p>Password: teacher123</p>
              </div>
              <div className="bg-dr-white border-2 border-dr-black p-3">
                <p className="uppercase mb-1">STUDENT</p>
                <p>Email: student@digitalrenaissance.com</p>
                <p>Password: student123</p>
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Footer - Black */}
      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE
          </p>
        </div>
      </footer>
    </div>
  )
}
