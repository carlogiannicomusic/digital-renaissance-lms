'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/lessons'
import { PlayCircle, Clock, Edit, Trash2, Plus, ArrowLeft, GripVertical, Eye, EyeOff } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description?: string | null
  content?: string | null
  orderIndex: number
  duration?: number | null
  videoUrl?: string | null
  isPublished: boolean
}

export default function LessonsManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: courseId } = use(params)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [courseName, setCourseName] = useState<string>('')

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/lessons?courseId=${courseId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch lessons')
      }
      const data = await response.json()
      setLessons(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (response.ok) {
        const course = await response.json()
        setCourseName(course.title)
      }
    } catch (err) {
      console.error('Failed to fetch course:', err)
    }
  }

  useEffect(() => {
    fetchLessons()
    fetchCourse()
  }, [courseId])

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete lesson')
      }

      await fetchLessons()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete lesson')
    }
  }

  const togglePublished = async (lesson: Lesson) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !lesson.isPublished }),
      })

      if (!response.ok) {
        throw new Error('Failed to update lesson')
      }

      await fetchLessons()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update lesson')
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header */}
      <section className="bg-dr-purple">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
          <Link href={`/courses/${courseId}`}>
            <Button variant="black" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-dr-black uppercase">
            <PlayCircle className="inline h-10 w-10 mr-3" />
            MANAGE LESSONS
          </h1>
          {courseName && (
            <p className="text-dr-black font-semibold text-xl mt-2">{courseName}</p>
          )}
        </div>
      </section>

      {/* Actions Bar */}
      <section className="bg-dr-yellow border-b-4 border-dr-black py-6">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex justify-between items-center">
            <p className="text-dr-black font-bold">
              {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
            </p>
            {!showCreateForm && !editingLesson && (
              <Button onClick={() => setShowCreateForm(true)} variant="black">
                <Plus className="h-4 w-4 mr-2" />
                ADD LESSON
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-12">
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-dr-white p-8 border-4 border-dr-black mb-8">
            <LessonForm
              courseId={courseId}
              onSuccess={() => {
                setShowCreateForm(false)
                fetchLessons()
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Edit Form */}
        {editingLesson && (
          <div className="bg-dr-white p-8 border-4 border-dr-black mb-8">
            <LessonForm
              courseId={courseId}
              lesson={editingLesson}
              onSuccess={() => {
                setEditingLesson(null)
                fetchLessons()
              }}
              onCancel={() => setEditingLesson(null)}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-dr-black font-semibold text-center py-12">
            Loading lessons...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 text-red-700 px-6 py-4 font-semibold">
            Error: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && lessons.length === 0 && (
          <div className="bg-dr-peach p-12 border-4 border-dr-black text-center">
            <PlayCircle className="h-16 w-16 mx-auto mb-4 text-dr-black opacity-50" />
            <h3 className="font-display text-2xl text-dr-black mb-2">NO LESSONS YET</h3>
            <p className="text-dr-black opacity-70 mb-6">
              Start building your course by adding your first lesson.
            </p>
            {!showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)} variant="black">
                <Plus className="h-4 w-4 mr-2" />
                ADD YOUR FIRST LESSON
              </Button>
            )}
          </div>
        )}

        {/* Lessons List */}
        {!loading && !error && lessons.length > 0 && (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`bg-dr-white border-4 border-dr-black p-6 ${
                  !lesson.isPublished ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-dr-black opacity-30 cursor-grab" />
                    <div className="bg-dr-black text-dr-yellow font-bold text-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-dr-black uppercase">
                        {lesson.title}
                      </h3>
                      {!lesson.isPublished && (
                        <span className="text-xs bg-dr-peach px-3 py-1 font-bold uppercase">
                          Draft
                        </span>
                      )}
                      {lesson.isPublished && (
                        <span className="text-xs bg-dr-green px-3 py-1 font-bold uppercase">
                          Published
                        </span>
                      )}
                    </div>

                    {lesson.description && (
                      <p className="text-dr-black opacity-70 mb-3">
                        {lesson.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-dr-black">
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lesson.duration} minutes
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="flex items-center gap-1 text-dr-blue">
                          <PlayCircle className="h-4 w-4" />
                          Has video
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(lesson)}
                      className={`p-3 transition-colors ${
                        lesson.isPublished
                          ? 'bg-dr-green hover:bg-green-300'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {lesson.isPublished ? (
                        <Eye className="h-5 w-5 text-dr-black" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingLesson(lesson)}
                      className="p-3 bg-dr-yellow hover:bg-yellow-300 transition-colors"
                    >
                      <Edit className="h-5 w-5 text-dr-black" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-3 bg-gray-200 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="bg-dr-black py-12 mt-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-display text-sm text-dr-white">DIGITAL RENAISSANCE MUSIC INSTITUTE</p>
          <p className="text-dr-white text-xs mt-2 opacity-70">Dubai Knowledge Park, Block 13, Office G18</p>
        </div>
      </section>
    </div>
  )
}
