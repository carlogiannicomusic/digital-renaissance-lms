'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Upload, X, FileText, User, Mail, Phone, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMINISTRATOR']),
  phone: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).default('ACTIVE'),
})

const documentTypes = [
  'PASSPORT',
  'VISA',
  'CONTRACT',
  'CONSENT',
  'PHOTO',
  'EMIRATES_ID',
  'ADDRESS',
  'EMERGENCY_CONTACT',
  'PAYMENT',
  'ACADEMIC_INFO',
] as const

export default function NewUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR',
    phone: '',
    status: 'ACTIVE' as 'PENDING' | 'ACTIVE' | 'INACTIVE',
  })
  const [documents, setDocuments] = useState<Array<{ type: string; file: File | null; preview?: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAddDocument = () => {
    setDocuments([...documents, { type: 'PASSPORT', file: null }])
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleDocumentTypeChange = (index: number, type: string) => {
    const newDocs = [...documents]
    newDocs[index].type = type
    setDocuments(newDocs)
  }

  const handleFileChange = (index: number, file: File | null) => {
    const newDocs = [...documents]
    newDocs[index].file = file
    if (file) {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          newDocs[index].preview = reader.result as string
          setDocuments([...newDocs])
        }
        reader.readAsDataURL(file)
      }
    }
    setDocuments(newDocs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const result = createUserSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0].toString()] = error.message
        }
      })
      setErrors(newErrors)
      setIsSubmitting(false)
      toast.error('PLEASE FIX FORM ERRORS')
      return
    }

    try {
      // Create user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      }

      const user = await response.json()

      // Upload documents if any
      if (documents.length > 0) {
        for (const doc of documents) {
          if (doc.file) {
            const formData = new FormData()
            formData.append('file', doc.file)
            formData.append('documentType', doc.type)
            formData.append('userId', user.id)

            await fetch('/api/documents', {
              method: 'POST',
              body: formData,
            })
          }
        }
      }

      toast.success('USER CREATED SUCCESSFULLY!')
      setTimeout(() => {
        router.push('/admin/users')
      }, 500)
    } catch (error) {
      setIsSubmitting(false)
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'FAILED TO CREATE USER')
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin/users/pending" className="text-dr-yellow hover:text-dr-white text-sm font-bold uppercase mb-2 block transition-colors">
                ← BACK TO USERS
              </Link>
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                CREATE NEW USER
              </h1>
            </div>
          </div>
        </div>
      </header>

      <SlideUp>
        <section className="max-w-5xl mx-auto px-8 py-12">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="bg-dr-blue border-4 border-dr-black p-8 mb-8">
              <h2 className="font-display text-3xl text-dr-white mb-6 uppercase flex items-center gap-3">
                <User className="h-8 w-8" />
                PERSONAL INFORMATION
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold text-lg ${errors.name ? 'border-dr-peach bg-dr-peach/10' : 'border-dr-black'}`}
                    placeholder="e.g., John Smith"
                  />
                  {errors.name && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full border-4 p-4 font-semibold ${errors.email ? 'border-dr-peach bg-dr-peach/10' : 'border-dr-black'}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border-4 border-dr-black p-4 font-semibold"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                    PASSWORD *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold ${errors.password ? 'border-dr-peach bg-dr-peach/10' : 'border-dr-black'}`}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.password && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      ROLE *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full border-4 border-dr-black p-4 font-semibold"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMINISTRATOR">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      STATUS *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border-4 border-dr-black p-4 font-semibold"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PENDING">Pending</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-dr-purple border-4 border-dr-black p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-3xl text-dr-white uppercase flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  DOCUMENTS
                </h2>
                <Button
                  type="button"
                  variant="white"
                  size="lg"
                  onClick={handleAddDocument}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  ADD DOCUMENT
                </Button>
              </div>

              {documents.length === 0 ? (
                <div className="bg-dr-white border-4 border-dr-black p-8 text-center">
                  <FileText className="h-12 w-12 text-dr-black mx-auto mb-4" />
                  <p className="font-bold text-dr-black uppercase mb-2">NO DOCUMENTS ADDED</p>
                  <p className="text-sm text-dr-black">Click "ADD DOCUMENT" to upload user documents</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <ScaleIn key={index} delay={index * 0.05}>
                      <div className="bg-dr-white border-4 border-dr-black p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                                DOCUMENT TYPE
                              </label>
                              <select
                                value={doc.type}
                                onChange={(e) => handleDocumentTypeChange(index, e.target.value)}
                                className="w-full border-2 border-dr-black p-3 font-semibold"
                              >
                                {documentTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                                FILE
                              </label>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                className="w-full border-2 border-dr-black p-3 font-semibold"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              {doc.file && (
                                <p className="text-xs font-bold text-dr-black mt-1">
                                  {doc.file.name} ({(doc.file.size / 1024).toFixed(1)} KB)
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            className="bg-dr-peach border-2 border-dr-black p-2 hover:bg-dr-black hover:text-dr-peach transition-all"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {doc.preview && (
                          <div className="mt-4 border-2 border-dr-black p-2">
                            <img src={doc.preview} alt="Preview" className="max-h-40 mx-auto" />
                          </div>
                        )}
                      </div>
                    </ScaleIn>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="submit" variant="black" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'CREATING USER...' : 'CREATE USER'}
              </Button>
              <Link href="/admin/users/pending" className="flex-1">
                <Button type="button" variant="white" size="lg" className="w-full">
                  CANCEL
                </Button>
              </Link>
            </div>
          </form>
        </section>
      </SlideUp>

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
