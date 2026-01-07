'use client'

import { useEffect, useState } from 'react'
import { PlayCircle, Clock, Edit, Trash2, Plus, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface LessonListProps {
  courseId: string
  editable?: boolean
}

export function LessonList({ courseId, editable = false }: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchLessons()
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

  if (loading) {
    return (
      <div className="text-dr-black font-semibold">
        Loading lessons...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dr-black text-dr-white px-6 py-4 font-semibold">
        Error: {error}
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="bg-dr-white p-8 border-4 border-dr-black text-center">
        <PlayCircle className="h-12 w-12 mx-auto mb-4 text-dr-black opacity-50" />
        <p className="text-dr-black font-semibold text-lg mb-2">
          No lessons created yet
        </p>
        <p className="text-dr-black opacity-70">
          Click &quot;Manage Lessons&quot; to add lessons to this course.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className={`bg-dr-white border-4 border-dr-black p-4 flex items-center gap-4 ${
            !lesson.isPublished ? 'opacity-60' : ''
          }`}
        >
          {editable && (
            <GripVertical className="h-5 w-5 text-dr-black opacity-50 cursor-grab" />
          )}
          <div className="bg-dr-black text-dr-yellow font-bold text-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-dr-black uppercase">
              {lesson.title}
              {!lesson.isPublished && (
                <span className="ml-2 text-xs bg-dr-peach px-2 py-1 normal-case">
                  Draft
                </span>
              )}
            </h3>
            {lesson.description && (
              <p className="text-dr-black text-sm opacity-70 mt-1">
                {lesson.description}
              </p>
            )}
          </div>
          {lesson.duration && (
            <div className="flex items-center gap-1 text-dr-black">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">{lesson.duration} min</span>
            </div>
          )}
          {lesson.videoUrl && (
            <PlayCircle className="h-5 w-5 text-dr-blue" />
          )}
          {editable && (
            <div className="flex gap-2">
              <button
                onClick={() => {/* TODO: Open edit modal */}}
                className="p-2 hover:bg-dr-yellow transition-colors"
              >
                <Edit className="h-4 w-4 text-dr-black" />
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="p-2 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
