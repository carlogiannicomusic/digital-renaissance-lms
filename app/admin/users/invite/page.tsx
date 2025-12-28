'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Send, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { z } from 'zod'

const invitationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.enum(['STUDENT', 'TEACHER'], {
    message: 'Please select a role',
  }),
})

type InvitationForm = z.infer<typeof invitationSchema>

export default function InviteUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<InvitationForm>({
    email: '',
    role: 'STUDENT',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof InvitationForm, string>>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const validation = invitationSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof InvitationForm, string>> = {}
      validation.error.issues.forEach((error) => {
        const field = error.path[0] as keyof InvitationForm
        fieldErrors[field] = error.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to send invitation')
        return
      }

      toast.success(`INVITATION SENT TO ${formData.email.toUpperCase()}`)

      // Reset form
      setFormData({ email: '', role: 'STUDENT' })

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/users')
      }, 1500)
    } catch (error) {
      toast.error('An error occurred while sending invitation')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header */}
      <SlideUp delay={0}>
        <div className="bg-dr-yellow border-b-4 border-dr-black">
          <div className="max-w-[1800px] mx-auto px-8 py-8">
            <div className="flex items-center gap-6">
              <Link href="/admin/users">
                <Button variant="black" size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  BACK TO USERS
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <Mail className="w-10 h-10 text-dr-black" />
                <h1 className="font-display text-4xl uppercase">
                  SEND INVITATION
                </h1>
              </div>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Form Container */}
      <div className="max-w-[1800px] mx-auto px-8 py-12">
        <ScaleIn delay={0.1}>
          <div className="max-w-3xl mx-auto bg-dr-blue border-4 border-dr-black p-12">
            <div className="flex items-center gap-3 mb-8">
              <UserPlus className="w-8 h-8 text-dr-black" />
              <h2 className="font-display text-2xl uppercase text-dr-black">
                INVITATION DETAILS
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div>
                <label className="block mb-2 font-bold uppercase text-sm text-dr-black">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-6 py-4 border-4 font-bold text-lg ${
                    errors.email
                      ? 'border-dr-peach bg-dr-peach/10'
                      : 'border-dr-black'
                  }`}
                  placeholder="student@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-2 text-dr-peach font-bold text-sm uppercase">
                    {errors.email}
                  </p>
                )}
                <p className="mt-2 text-dr-black text-sm">
                  The invitation email will be sent to this address
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 font-bold uppercase text-sm text-dr-black">
                  ROLE *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'STUDENT' | 'TEACHER',
                    })
                  }
                  className={`w-full px-6 py-4 border-4 font-bold text-lg ${
                    errors.role
                      ? 'border-dr-peach bg-dr-peach/10'
                      : 'border-dr-black'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="TEACHER">TEACHER</option>
                </select>
                {errors.role && (
                  <p className="mt-2 text-dr-peach font-bold text-sm uppercase">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-dr-white border-4 border-dr-black p-6">
                <h3 className="font-bold uppercase text-sm mb-3 text-dr-black">
                  WHAT HAPPENS NEXT?
                </h3>
                <ol className="space-y-2 text-sm text-dr-black">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>
                      The invitee receives an email with a registration link
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>They complete the registration form</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>You receive a notification to approve their account</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>
                      After approval, they receive their login credentials
                    </span>
                  </li>
                </ol>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="yellow"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'SENDING...' : 'SEND INVITATION'}
                </Button>
                <Link href="/admin/users" className="flex-1">
                  <Button
                    type="button"
                    variant="white"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    CANCEL
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </ScaleIn>
      </div>

      {/* Footer */}
      <footer className="bg-dr-black text-dr-white py-8 mt-12">
        <div className="max-w-[1800px] mx-auto px-8 text-center">
          <p className="text-sm">
            © 2024 DIGITAL RENAISSANCE INSTITUTE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
