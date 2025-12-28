'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Schedule {
  id: string
  startTime: string
  endTime: string
  dayOfWeek: string
  location?: string
  course: {
    title: string
    teacher: {
      name: string
    }
  }
}

interface CourseScheduleProps {
  courseId: string
}

export function CourseSchedule({ courseId }: CourseScheduleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/schedules?courseId=${courseId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch schedules')
      }
      const data = await response.json()
      setSchedules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [courseId])

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete schedule')
      }

      await fetchSchedules()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete schedule')
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDay = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase()
  }

  if (loading) {
    return (
      <div>
        <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
          SCHEDULES
        </h2>
        <p className="text-dr-black font-semibold">Loading schedules...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
          SCHEDULES
        </h2>
        <div className="bg-dr-black text-dr-white px-6 py-4 font-semibold">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
        SCHEDULES
      </h2>

      {schedules.length === 0 ? (
        <p className="text-dr-black font-semibold">No schedules found for this course.</p>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-dr-black p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-dr-white uppercase">
                  {formatDay(schedule.dayOfWeek)}
                </h3>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="text-dr-white hover:text-dr-peach font-bold uppercase text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
              <p className="text-dr-white font-semibold text-lg mb-2">
                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
              </p>
              {schedule.location && (
                <p className="text-dr-white text-sm mb-1">
                  📍 {schedule.location}
                </p>
              )}
              <p className="text-dr-white text-sm opacity-80">
                Teacher: {schedule.course.teacher.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
