'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { ArrowLeft, Save, Upload, FileText, Trash2, Download, User, Mail, Phone } from 'lucide-react'

type Document = {
  id: string
  fileName: string
  fileUrl: string
  documentType: string
  uploadedAt: string
}

type UserData = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  phone: string | null
  instrument: string | null
  createdAt: string
}

const documentTypes = [
  'ID_CARD',
  'PASSPORT',
  'BIRTH_CERTIFICATE',
  'PROOF_OF_ADDRESS',
  'MEDICAL_CERTIFICATE',
  'INSURANCE',
  'EMERGENCY_CONTACT',
  'ENROLLMENT_FORM',
  'CONSENT_FORM',
  'OTHER',
]

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<UserData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    status: 'ACTIVE',
    instrument: '',
  })

  const [newDocument, setNewDocument] = useState({
    documentType: 'ID_CARD',
    file: null as File | null,
  })

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch user details
      const userRes = await fetch(`/api/users/${userId}`)
      if (!userRes.ok) throw new Error('Failed to fetch user')
      const userData = await userRes.json()
      setUser(userData)

      // Populate form
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'STUDENT',
        status: userData.status || 'ACTIVE',
        instrument: userData.instrument || '',
      })

      // Fetch user documents
      const docsRes = await fetch(`/api/documents?userId=${userId}`)
      if (!docsRes.ok) throw new Error('Failed to fetch documents')
      const docsData = await docsRes.json()
      setDocuments(docsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('FAILED TO LOAD DATA')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
      }

      toast.success('USER UPDATED SUCCESSFULLY')
      fetchData()
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'UPDATE FAILED')
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument({ ...newDocument, file: e.target.files[0] })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDocument.file) {
      toast.error('PLEASE SELECT A FILE')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', newDocument.file)
      formData.append('documentType', newDocument.documentType)
      formData.append('userId', userId)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      toast.success('DOCUMENT UPLOADED SUCCESSFULLY')
      setNewDocument({ documentType: 'ID_CARD', file: null })

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Refresh documents list
      fetchData()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'UPLOAD FAILED')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId: string, fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      toast.success('DOCUMENT DELETED')
      fetchData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('DELETE FAILED')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dr-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dr-black"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dr-white flex items-center justify-center">
        <p className="text-xl text-dr-black font-bold">USER NOT FOUND</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header */}
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
          <Link href="/admin">
            <Button variant="yellow" className="mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              BACK TO ADMIN
            </Button>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-dr-yellow uppercase mb-2">
            EDIT USER
          </h1>
          <p className="text-lg text-dr-yellow font-semibold">
            {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>
      </header>

      {/* User Details Form - Blue */}
      <SlideUp>
        <section className="bg-dr-blue border-b-4 border-dr-black py-12">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-white uppercase mb-6">
              <User className="inline-block w-8 h-8 mr-3" />
              USER INFORMATION
            </h2>

            <form onSubmit={handleUpdateUser} className="bg-dr-white border-4 border-dr-black p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold uppercase text-sm"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold uppercase text-sm"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Instrument (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.instrument}
                    onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-blue font-bold"
                    placeholder="e.g., Piano, Guitar, Vocals"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="black"
                disabled={saving}
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </form>
          </div>
        </section>
      </SlideUp>

      {/* Document Upload - Yellow */}
      <SlideUp delay={0.1}>
        <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black uppercase mb-6">
              <Upload className="inline-block w-8 h-8 mr-3" />
              ADD DOCUMENT
            </h2>

            <form onSubmit={handleUpload} className="bg-dr-white border-4 border-dr-black p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Document Type
                  </label>
                  <select
                    value={newDocument.documentType}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, documentType: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-yellow font-bold uppercase text-sm"
                  >
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-dr-black uppercase mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border-2 border-dr-black focus:outline-none focus:border-dr-yellow font-bold"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="black"
                disabled={uploading || !newDocument.file}
              >
                <Upload className="w-5 h-5 mr-2" />
                {uploading ? 'UPLOADING...' : 'UPLOAD DOCUMENT'}
              </Button>
            </form>
          </div>
        </section>
      </SlideUp>

      {/* Documents List - Purple */}
      <SlideUp delay={0.2}>
        <section className="bg-dr-purple border-b-4 border-dr-black py-12">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-white uppercase mb-6">
              <FileText className="inline-block w-8 h-8 mr-3" />
              USER DOCUMENTS ({documents.length})
            </h2>

            {documents.length === 0 ? (
              <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-xl text-gray-400 font-bold uppercase">
                  NO DOCUMENTS UPLOADED YET
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => (
                  <div key={doc.id}>
                    <ScaleIn delay={index * 0.1}>
                      <div className="bg-dr-white border-4 border-dr-black p-6 h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                          <FileText className="w-8 h-8 text-dr-purple flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-dr-black uppercase text-sm mb-2 truncate">
                              {doc.documentType.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-dr-black text-xs break-all">
                              {doc.fileName}
                            </p>
                          </div>
                        </div>

                        <p className="text-dr-black text-xs mb-4">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-auto">
                          <a
                            href={doc.fileUrl}
                            download
                            className="flex-1"
                          >
                            <Button variant="blue" className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              DOWNLOAD
                            </Button>
                          </a>
                          <Button
                            variant="black"
                            onClick={() => handleDelete(doc.id, doc.fileName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </ScaleIn>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </SlideUp>

      {/* Footer */}
      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-yellow uppercase text-center">
            USER CREATED: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  )
}
