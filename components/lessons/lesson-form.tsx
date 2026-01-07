'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

interface LessonFormProps {
  courseId: string
  lesson?: Lesson
  onSuccess: () => void
  onCancel: () => void
}

export function LessonForm({ courseId, lesson, onSuccess, onCancel }: LessonFormProps) {
  const [title, setTitle] = useState(lesson?.title || '')
  const [description, setDescription] = useState(lesson?.description || '')
  const [content, setContent] = useState(lesson?.content || '')
  const [duration, setDuration] = useState(lesson?.duration?.toString() || '')
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || '')
  const [isPublished, setIsPublished] = useState(lesson?.isPublished ?? false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const url = lesson ? `/api/lessons/${lesson.id}` : '/api/lessons'
      const method = lesson ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          title,
          description: description || null,
          content: content || null,
          duration: duration ? parseInt(duration) : null,
          videoUrl: videoUrl || null,
          isPublished,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save lesson')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-display text-2xl text-dr-black uppercase mb-4">
        {lesson ? 'EDIT LESSON' : 'ADD NEW LESSON'}
      </h3>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-semibold">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Introduction to Music Theory"
        required
      />

      <div>
        <label className="block text-sm font-bold uppercase mb-2 text-dr-black">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the lesson..."
          className="w-full px-4 py-3 border-2 border-dr-black bg-white text-dr-black font-semibold focus:outline-none focus:ring-2 focus:ring-dr-yellow"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2 text-dr-black">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Lesson content, notes, or transcript..."
          className="w-full px-4 py-3 border-2 border-dr-black bg-white text-dr-black font-semibold focus:outline-none focus:ring-2 focus:ring-dr-yellow"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 45"
          min="1"
        />

        <Input
          type="url"
          label="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-bold text-dr-black uppercase">
            Published (visible to students)
          </span>
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={submitting} variant="black" className="flex-1">
          {submitting ? 'SAVING...' : lesson ? 'UPDATE LESSON' : 'ADD LESSON'}
        </Button>
        <Button type="button" onClick={onCancel} variant="white" className="flex-1">
          CANCEL
        </Button>
      </div>
    </form>
  )
}
