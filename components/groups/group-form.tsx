'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GroupFormProps {
  courseId: string
  group?: {
    id: string
    name: string
    description?: string | null
    maxCapacity?: number | null
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function GroupForm({ courseId, group, onSuccess, onCancel }: GroupFormProps) {
  const [name, setName] = useState(group?.name || '')
  const [description, setDescription] = useState(group?.description || '')
  const [maxCapacity, setMaxCapacity] = useState(group?.maxCapacity?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!group

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEditing ? `/api/groups/${group.id}` : '/api/groups'
      const method = isEditing ? 'PATCH' : 'POST'

      const body: Record<string, unknown> = {
        name,
        description: description || undefined,
        maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
      }

      if (!isEditing) {
        body.courseId = courseId
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
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} group`)
      }

      if (!isEditing) {
        setName('')
        setDescription('')
        setMaxCapacity('')
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-display text-2xl md:text-3xl text-dr-black mb-6">
        {isEditing ? 'EDIT GROUP' : 'CREATE GROUP'}
      </h2>

      {error && (
        <div className="bg-dr-black text-dr-white px-6 py-4 font-semibold">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Section A, Morning Group"
        required
      />

      <Input
        type="text"
        label="Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Beginner level, Weekday schedule"
      />

      <Input
        type="number"
        label="Max Capacity (Optional)"
        value={maxCapacity}
        onChange={(e) => setMaxCapacity(e.target.value)}
        placeholder="e.g., 20"
        min="1"
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} variant="black" className="flex-1">
          {loading ? 'SAVING...' : isEditing ? 'UPDATE GROUP' : 'CREATE GROUP'}
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
