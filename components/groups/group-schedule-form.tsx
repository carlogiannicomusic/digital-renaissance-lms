'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface GroupScheduleFormProps {
  groupId: string
  schedule?: {
    id: string
    startTime: string
    endTime: string
    dayOfWeek: string
    location?: string | null
  }
  onSuccess?: () => void
  onCancel?: () => void
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

export function GroupScheduleForm({ groupId, schedule, onSuccess, onCancel }: GroupScheduleFormProps) {
  const formatDatetimeLocal = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  const [startTime, setStartTime] = useState(schedule ? formatDatetimeLocal(schedule.startTime) : '')
  const [endTime, setEndTime] = useState(schedule ? formatDatetimeLocal(schedule.endTime) : '')
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.dayOfWeek || '')
  const [location, setLocation] = useState(schedule?.location || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!schedule

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEditing ? `/api/group-schedules/${schedule.id}` : '/api/group-schedules'
      const method = isEditing ? 'PATCH' : 'POST'

      const body: Record<string, unknown> = {
        startTime,
        endTime,
        dayOfWeek,
        location: location || undefined,
      }

      if (!isEditing) {
        body.groupId = groupId
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} schedule`)
      }

      if (!isEditing) {
        setStartTime('')
        setEndTime('')
        setDayOfWeek('')
        setLocation('')
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-dr-black text-dr-white px-4 py-3 font-semibold text-sm">
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
        placeholder="e.g., Room 101"
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} variant="black" className="flex-1">
          {loading ? 'SAVING...' : isEditing ? 'UPDATE' : 'ADD SCHEDULE'}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="white" className="flex-1">
            CANCEL
          </Button>
        )}
      </div>
    </form>
  )
}
