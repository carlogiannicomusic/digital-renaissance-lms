'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface ScheduleFormProps {
  courseId: string
  onSuccess?: () => void
}

const DAYS_OF_WEEK = [
  { value: '', label: 'Select Day' },
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' },
]

export function ScheduleForm({ courseId, onSuccess }: ScheduleFormProps) {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          startTime,
          endTime,
          dayOfWeek,
          location: location || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create schedule')
      }

      setStartTime('')
      setEndTime('')
      setDayOfWeek('')
      setLocation('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
        CREATE SCHEDULE
      </h2>

      {error && (
        <div className="bg-dr-black text-dr-white px-6 py-4 font-semibold">
          {error}
        </div>
      )}

      <Input
        type="datetime-local"
        label="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <Input
        type="datetime-local"
        label="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />

      <Select
        label="Day of Week"
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
        options={DAYS_OF_WEEK}
        required
      />

      <Input
        type="text"
        label="Location (Optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., Room 101, Building A"
      />

      <Button type="submit" disabled={loading} variant="black" className="w-full">
        {loading ? 'CREATING...' : 'CREATE SCHEDULE'}
      </Button>
    </form>
  )
}
