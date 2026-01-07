'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GroupCard } from './group-card'
import { GroupForm } from './group-form'
import { Input } from '@/components/ui/input'

interface Schedule {
  id: string
  startTime: string
  endTime: string
  dayOfWeek: string
  location?: string | null
}

interface Group {
  id: string
  name: string
  description?: string | null
  maxCapacity?: number | null
  schedules: Schedule[]
  _count: {
    enrollments: number
  }
}

interface GroupListProps {
  courseId: string
}

export function GroupList({ courseId }: GroupListProps) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [duplicatingGroup, setDuplicatingGroup] = useState<Group | null>(null)
  const [duplicateName, setDuplicateName] = useState('')
  const [copySchedules, setCopySchedules] = useState(true)
  const [duplicating, setDuplicating] = useState(false)

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/groups?courseId=${courseId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      const data = await response.json()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [courseId])

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? Students will be unassigned but remain enrolled in the course.')) return

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete group')
      }

      await fetchGroups()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete group')
    }
  }

  const handleDuplicate = async () => {
    if (!duplicatingGroup || !duplicateName.trim()) return

    try {
      setDuplicating(true)
      const response = await fetch(`/api/groups/${duplicatingGroup.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newName: duplicateName,
          copySchedules,
          copyStudents: false,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to duplicate group')
      }

      setDuplicatingGroup(null)
      setDuplicateName('')
      setCopySchedules(true)
      await fetchGroups()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate group')
    } finally {
      setDuplicating(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-dr-green p-8">
        <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
          COURSE GROUPS
        </h2>
        <p className="text-dr-black font-semibold">Loading groups...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dr-green p-8">
        <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8">
          COURSE GROUPS
        </h2>
        <div className="bg-dr-black text-dr-white px-6 py-4 font-semibold">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dr-green p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-dr-black">
          COURSE GROUPS
        </h2>
        {!showCreateForm && !editingGroup && (
          <Button onClick={() => setShowCreateForm(true)} variant="yellow">
            + NEW GROUP
          </Button>
        )}
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="bg-dr-white p-6 border-4 border-dr-black mb-6">
          <GroupForm
            courseId={courseId}
            onSuccess={() => {
              setShowCreateForm(false)
              fetchGroups()
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Edit Group Form */}
      {editingGroup && (
        <div className="bg-dr-white p-6 border-4 border-dr-black mb-6">
          <GroupForm
            courseId={courseId}
            group={editingGroup}
            onSuccess={() => {
              setEditingGroup(null)
              fetchGroups()
            }}
            onCancel={() => setEditingGroup(null)}
          />
        </div>
      )}

      {/* Duplicate Group Modal */}
      {duplicatingGroup && (
        <div className="fixed inset-0 bg-dr-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dr-white p-8 border-4 border-dr-black max-w-md w-full mx-4">
            <h3 className="font-display text-2xl text-dr-black mb-6">
              DUPLICATE GROUP
            </h3>
            <p className="text-dr-black mb-4">
              Duplicating: <strong>{duplicatingGroup.name}</strong>
            </p>
            <Input
              type="text"
              label="New Group Name"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              placeholder="e.g., Section B"
              required
            />
            <div className="mt-4">
              <label className="flex items-center gap-2 text-dr-black font-semibold">
                <input
                  type="checkbox"
                  checked={copySchedules}
                  onChange={(e) => setCopySchedules(e.target.checked)}
                  className="w-5 h-5"
                />
                Copy schedules
              </label>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleDuplicate}
                disabled={!duplicateName.trim() || duplicating}
                variant="black"
                className="flex-1"
              >
                {duplicating ? 'DUPLICATING...' : 'DUPLICATE'}
              </Button>
              <Button
                onClick={() => {
                  setDuplicatingGroup(null)
                  setDuplicateName('')
                  setCopySchedules(true)
                }}
                variant="white"
                className="flex-1"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="bg-dr-white p-6 border-4 border-dr-black">
          <p className="text-dr-black font-semibold text-center">
            No groups created yet. Create your first group to organize students into sections with their own schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={() => setEditingGroup(group)}
              onDuplicate={() => {
                setDuplicatingGroup(group)
                setDuplicateName(`${group.name} (Copy)`)
              }}
              onDelete={() => handleDelete(group.id)}
              onRefresh={fetchGroups}
            />
          ))}
        </div>
      )}
    </div>
  )
}
