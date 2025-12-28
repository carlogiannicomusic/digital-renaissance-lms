'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { ArrowLeft, Upload, FileText, Trash2, Download } from 'lucide-react'

type Document = {
  id: string
  fileName: string
  fileUrl: string
  documentType: string
  uploadedAt: string
}

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
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

export default function UserDocumentsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

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
      <header className="bg-dr-purple border-b-4 border-dr-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
          <Link href="/admin">
            <Button variant="white" className="mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              BACK TO ADMIN
            </Button>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-dr-white uppercase mb-2">
            MANAGE DOCUMENTS
          </h1>
          <p className="text-lg text-dr-white font-semibold">
            {user.firstName} {user.lastName} ({user.email})
          </p>
          <div className="mt-2">
            <span className="inline-block bg-dr-white text-dr-purple px-4 py-1 border-2 border-dr-black font-bold text-sm uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* Upload Form */}
      <SlideUp>
        <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black uppercase mb-6">
              <Upload className="inline-block w-8 h-8 mr-3" />
              UPLOAD NEW DOCUMENT
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

      {/* Documents List */}
      <SlideUp delay={0.1}>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black uppercase mb-6">
              <FileText className="inline-block w-8 h-8 mr-3" />
              EXISTING DOCUMENTS ({documents.length})
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
                      <div className="bg-dr-blue border-4 border-dr-black p-6 h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                          <FileText className="w-8 h-8 text-dr-white flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-dr-white uppercase text-sm mb-2 truncate">
                              {doc.documentType.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-dr-white text-xs break-all">
                              {doc.fileName}
                            </p>
                          </div>
                        </div>

                        <p className="text-dr-white text-xs mb-4">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-auto">
                          <a
                            href={doc.fileUrl}
                            download
                            className="flex-1"
                          >
                            <Button variant="white" className="w-full">
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
    </div>
  )
}
