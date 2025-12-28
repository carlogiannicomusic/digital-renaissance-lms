'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SlideUp } from '@/components/page-transition'
import { UserPlus, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(!!token)
  const [invitationValid, setInvitationValid] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
  })

  // Validate token on mount
  useEffect(() => {
    if (token) {
      validateToken(token)
    }
  }, [token])

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await fetch(`/api/invitations?token=${tokenValue}`)
      const data = await response.json()

      if (response.ok && data.valid) {
        setInvitationValid(true)
        setFormData((prev) => ({
          ...prev,
          email: data.email,
          role: data.role,
        }))
        toast.success('INVITATION VALID - PLEASE COMPLETE YOUR REGISTRATION')
      } else {
        toast.error(data.error || 'INVALID INVITATION LINK')
        // Redirect to login after error
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error) {
      toast.error('FAILED TO VALIDATE INVITATION')
      setTimeout(() => router.push('/login'), 2000)
    } finally {
      setIsValidatingToken(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'PENDING', // Always create as pending for approval
          invitationToken: token || undefined, // Include token if present
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'REGISTRATION FAILED')
        setIsLoading(false)
        return
      }

      toast.success('REGISTRATION SUBMITTED! AWAITING APPROVAL')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      toast.error('REGISTRATION FAILED')
      setIsLoading(false)
    }
  }

  // Show loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-dr-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-dr-yellow border-solid mx-auto mb-4"></div>
          <p className="font-display text-xl uppercase text-dr-black">
            VALIDATING INVITATION...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Black */}
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                DIGITAL RENAISSANCE
              </h1>
            </Link>
            <Link href="/login">
              <Button variant="yellow" size="sm">
                ALREADY REGISTERED? LOGIN
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="max-w-md mx-auto px-8 py-16">
          {/* Invitation Banner */}
          {invitationValid && (
            <div className="bg-dr-yellow border-4 border-dr-black p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dr-black" />
              <div>
                <p className="font-bold uppercase text-sm text-dr-black">
                  INVITATION ACCEPTED
                </p>
                <p className="text-xs text-dr-black">
                  You were invited by an administrator
                </p>
              </div>
            </div>
          )}

          {/* Registration Form - Green */}
          <div className="bg-dr-green border-4 border-dr-black p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="h-8 w-8 text-dr-black" />
              <h2 className="font-display text-3xl text-dr-black uppercase">
                {invitationValid ? `${formData.role} REGISTRATION` : 'STUDENT REGISTRATION'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dr-black" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                    required
                    disabled={invitationValid} // Disable if from invitation
                  />
                </div>
                {invitationValid && (
                  <p className="text-xs font-bold text-dr-black mt-2">
                    Email provided by invitation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dr-black" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold"
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  CREATE PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dr-black" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 pl-12 font-semibold"
                    placeholder="Enter a strong password"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs font-bold text-dr-black mt-2">
                  Minimum 6 characters
                </p>
              </div>

              <Button
                type="submit"
                variant="black"
                size="lg"
                className="w-full"
                disabled={isLoading || !invitationValid}
              >
                {isLoading ? 'SUBMITTING...' : invitationValid ? 'REGISTER NOW' : 'INVITATION REQUIRED'}
              </Button>

              {!invitationValid && !token && (
                <p className="text-center text-sm font-bold text-dr-black mt-4">
                  Registration is invitation-only. Contact an administrator for access.
                </p>
              )}
            </form>
          </div>

          {/* Info Box - Yellow */}
          <div className="bg-dr-yellow border-4 border-dr-black p-6 mt-6">
            <h3 className="font-display text-xl text-dr-black uppercase mb-3">
              {invitationValid ? 'REGISTRATION PROCESS' : 'INVITATION REQUIRED'}
            </h3>
            {invitationValid ? (
              <div className="space-y-2 text-sm font-bold text-dr-black">
                <p>1. Submit your registration details</p>
                <p>2. Administrator reviews your application</p>
                <p>3. You receive approval notification</p>
                <p>4. Login with your credentials</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm font-bold text-dr-black">
                <p>Registration requires an invitation from an administrator.</p>
                <p className="mt-3">If you believe you should have access, please contact:</p>
                <p className="mt-2 text-base">admin@digitalrenaissance.com</p>
              </div>
            )}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dr-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-dr-yellow border-solid mx-auto mb-4"></div>
          <p className="font-display text-xl uppercase text-dr-black">
            LOADING...
          </p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
