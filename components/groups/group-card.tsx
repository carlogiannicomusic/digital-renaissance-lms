'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GroupScheduleForm } from './group-schedule-form'

interface Schedule {
  id: string
  startTime: string
  endTime: string
  dayOfWeek: string
  location?: string | null
}

interface GroupCardProps {
  group: {
    id: string
    name: string
    description?: string | null
    maxCapacity?: number | null
    schedules: Schedule[]
    _count: {
      enrollments: number
    }
  }
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onRefresh: () => void
}

export function GroupCard({ group, onEdit, onDuplicate, onDelete, onRefresh }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDay = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase()
  }

  const getScheduleSummary = () => {
    if (group.schedules.length === 0) return 'No schedules'
    const days = [...new Set(group.schedules.map(s => formatDay(s.dayOfWeek)))]
    return days.join(', ')
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      const response = await fetch(`/api/group-schedules/${scheduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete schedule')
      }

      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete schedule')
    }
  }

  const handleDuplicateSchedule = async (schedule: Schedule) => {
    try {
      const response = await fetch(`/api/group-schedules/${schedule.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate schedule')
      }

      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate schedule')
    }
  }

  return (
    <div className="border-4 border-dr-black">
      {/* Collapsed Header */}
      <div
        className="bg-dr-black p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-dr-white uppercase">
              {group.name}
            </h3>
            <p className="text-dr-white text-sm opacity-80 mt-1">
              {group._count.enrollments} student{group._count.enrollments !== 1 ? 's' : ''} • {getScheduleSummary()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-dr-white text-2xl">
              {isExpanded ? '−' : '+'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-dr-peach p-6">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <Button onClick={onEdit} variant="white" className="text-sm">
              EDIT
            </Button>
            <Button onClick={onDuplicate} variant="white" className="text-sm">
              DUPLICATE
            </Button>
            <Button onClick={onDelete} variant="black" className="text-sm">
              DELETE
            </Button>
          </div>

          {group.description && (
            <p className="text-dr-black mb-4">{group.description}</p>
          )}

          {group.maxCapacity && (
            <p className="text-dr-black text-sm mb-4">
              Max Capacity: {group.maxCapacity}
            </p>
          )}

          {/* Schedules Section */}
          <div className="mb-6">
            <h4 className="font-bold text-lg text-dr-black uppercase mb-4">
              SCHEDULES
            </h4>

            {group.schedules.length === 0 ? (
              <p className="text-dr-black opacity-70">No schedules added yet.</p>
            ) : (
              <div className="space-y-3">
                {group.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-dr-black p-4 flex justify-between items-center"
                  >
                    {editingSchedule?.id === schedule.id ? (
                      <div className="w-full">
                        <GroupScheduleForm
                          groupId={group.id}
                          schedule={schedule}
                          onSuccess={() => {
                            setEditingSchedule(null)
                            onRefresh()
                          }}
                          onCancel={() => setEditingSchedule(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-dr-white font-bold">
                            {formatDay(schedule.dayOfWeek)}
                          </p>
                          <p className="text-dr-white text-sm">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </p>
                          {schedule.location && (
                            <p className="text-dr-white text-sm opacity-70">
                              📍 {schedule.location}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSchedule(schedule)}
                            className="text-dr-white hover:text-dr-yellow text-sm font-bold uppercase"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateSchedule(schedule)}
                            className="text-dr-white hover:text-dr-yellow text-sm font-bold uppercase"
                          >
                            Dup
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-dr-white hover:text-dr-peach text-sm font-bold uppercase"
                          >
                            Del
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Schedule Form */}
            {showScheduleForm ? (
              <div className="mt-4 bg-dr-white p-4 border-2 border-dr-black">
                <GroupScheduleForm
                  groupId={group.id}
                  onSuccess={() => {
                    setShowScheduleForm(false)
                    onRefresh()
                  }}
                  onCancel={() => setShowScheduleForm(false)}
                />
              </div>
            ) : (
              <Button
                onClick={() => setShowScheduleForm(true)}
                variant="yellow"
                className="mt-4 text-sm"
              >
                + ADD SCHEDULE
              </Button>
            )}
          </div>

          {/* Students Section */}
          <div>
            <h4 className="font-bold text-lg text-dr-black uppercase mb-2">
              STUDENTS ({group._count.enrollments})
            </h4>
            <Button variant="black" className="text-sm">
              MANAGE STUDENTS
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
