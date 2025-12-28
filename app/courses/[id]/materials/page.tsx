'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { FileText, Upload, Download, Trash2, ArrowLeft, File, Video, Music, Image } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Material {
  id: string
  title: string
  description: string | null
  materialType: string
  fileUrl: string
  fileName: string
  fileSize: number | null
  createdAt: string
}

interface Course {
  id: string
  title: string
  description: string | null
  teacherId: string
  teacher: {
    name: string
  }
}

export default function CourseMaterialsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const courseId = params.id as string

  const [materials, setMaterials] = useState<Material[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    materialType: 'PDF',
    file: null as File | null,
  })

  const isTeacher = session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMINISTRATOR'

  useEffect(() => {
    fetchCourse()
    fetchMaterials()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/materials?courseId=${courseId}`)
      if (res.ok) {
        const data = await res.json()
        setMaterials(data)
      } else {
        toast.error('FAILED TO LOAD MATERIALS')
      }
    } catch (error) {
      toast.error('ERROR LOADING MATERIALS')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file || !uploadData.title) {
      toast.error('TITLE AND FILE REQUIRED')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadData.file)
      formData.append('courseId', courseId)
      formData.append('title', uploadData.title)
      formData.append('description', uploadData.description)
      formData.append('materialType', uploadData.materialType)

      const res = await fetch('/api/materials', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        toast.success('MATERIAL UPLOADED!')
        setShowUploadForm(false)
        setUploadData({ title: '', description: '', materialType: 'PDF', file: null })
        fetchMaterials()
      } else {
        const data = await res.json()
        toast.error(data.error || 'UPLOAD FAILED')
      }
    } catch (error) {
      toast.error('UPLOAD ERROR')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (materialId: string) => {
    if (!confirm('Delete this material?')) return

    try {
      const res = await fetch(`/api/materials?id=${materialId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('MATERIAL DELETED')
        fetchMaterials()
      } else {
        toast.error('DELETE FAILED')
      }
    } catch (error) {
      toast.error('DELETE ERROR')
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-8 w-8 text-dr-black" />
      case 'AUDIO':
        return <Music className="h-8 w-8 text-dr-black" />
      case 'IMAGE':
        return <Image className="h-8 w-8 text-dr-black" />
      default:
        return <FileText className="h-8 w-8 text-dr-black" />
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Purple */}
      <header className="bg-dr-purple border-b-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}`}>
                <Button variant="white" size="sm">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  BACK TO COURSE
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-dr-black uppercase tracking-tight">
                  COURSE MATERIALS
                </h1>
                {course && (
                  <p className="text-dr-black text-sm font-bold">
                    {course.title} - {course.teacher.name}
                  </p>
                )}
              </div>
            </div>
            {isTeacher && !showUploadForm && (
              <Button variant="yellow" size="lg" onClick={() => setShowUploadForm(true)}>
                <Upload className="h-5 w-5 mr-2" />
                UPLOAD MATERIAL
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-12">
        {/* Upload Form */}
        {showUploadForm && isTeacher && (
          <SlideUp>
            <div className="bg-dr-yellow border-4 border-dr-black p-8 mb-8">
              <h2 className="font-display text-2xl text-dr-black uppercase mb-6">
                UPLOAD NEW MATERIAL
              </h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    TITLE *
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                    placeholder="Lecture Notes Week 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                    rows={3}
                    placeholder="Optional description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    MATERIAL TYPE *
                  </label>
                  <select
                    value={uploadData.materialType}
                    onChange={(e) => setUploadData({ ...uploadData, materialType: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                    required
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video</option>
                    <option value="AUDIO">Audio</option>
                    <option value="DOCUMENT">Document (Word, etc.)</option>
                    <option value="IMAGE">Image</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    FILE *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    className="w-full border-4 border-dr-black p-4 font-semibold bg-dr-white"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="black" size="lg" disabled={isUploading}>
                    {isUploading ? 'UPLOADING...' : 'UPLOAD MATERIAL'}
                  </Button>
                  <Button
                    type="button"
                    variant="white"
                    size="lg"
                    onClick={() => setShowUploadForm(false)}
                  >
                    CANCEL
                  </Button>
                </div>
              </form>
            </div>
          </SlideUp>
        )}

        {/* Materials List */}
        {isLoading ? (
          <div className="bg-dr-blue border-4 border-dr-black p-12 text-center">
            <p className="font-display text-2xl text-dr-white uppercase">
              LOADING MATERIALS...
            </p>
          </div>
        ) : materials.length === 0 ? (
          <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
            <FileText className="h-16 w-16 text-dr-black mx-auto mb-4" />
            <p className="font-display text-2xl text-dr-black uppercase">
              NO MATERIALS YET
            </p>
            {isTeacher && (
              <p className="font-bold text-dr-black mt-2">
                Upload your first course material above
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {materials.map((material, idx) => (
              <ScaleIn key={material.id} delay={idx * 0.1}>
                <div className="bg-dr-blue border-4 border-dr-black p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {getFileIcon(material.materialType)}
                      <div className="flex-1">
                        <h3 className="font-display text-xl text-dr-white uppercase mb-2">
                          {material.title}
                        </h3>
                        {material.description && (
                          <p className="text-dr-white font-bold mb-2">
                            {material.description}
                          </p>
                        )}
                        <div className="flex gap-4 text-sm font-bold text-dr-white">
                          <span>{material.materialType}</span>
                          <span>•</span>
                          <span>{formatFileSize(material.fileSize)}</span>
                          <span>•</span>
                          <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={material.fileUrl} download target="_blank">
                        <Button variant="yellow" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          DOWNLOAD
                        </Button>
                      </a>
                      {isTeacher && (
                        <Button
                          variant="white"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
