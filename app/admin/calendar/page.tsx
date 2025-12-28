'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ChevronLeft, ChevronRight, Plus, AlertTriangle, Edit2, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface ScheduledClass {
  id: string
  title: string
  teacherId: string
  teacher?: {
    id: string
    name: string
    email: string
  }
  roomId: string
  room?: {
    id: string
    name: string
  }
  startTime: string
  endTime: string
  day: string
  type: string
  colorCode?: string
}

interface EditModalData {
  classId: string
  day: string
  startTime: string
  endTime: string
}

export default function MasterCalendar() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [classes, setClasses] = useState<ScheduledClass[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedClass, setDraggedClass] = useState<ScheduledClass | null>(null)
  const [editModal, setEditModal] = useState<EditModalData | null>(null)
  const [editForm, setEditForm] = useState({ startTime: '', endTime: '' })
  const [conflicts, setConflicts] = useState<any[]>([])
  const [showConflictModal, setShowConflictModal] = useState(false)

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Failed to fetch classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast.error('FAILED TO LOAD CLASSES')
    } finally {
      setLoading(false)
    }
  }

  // Get the Monday of the current week + offset
  const getWeekStart = (weekOffset: number): Date => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = currentDay === 0 ? -6 : 1 - currentDay // Adjust if Sunday
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + (weekOffset * 7))
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  // Get array of dates for the week
  const getWeekDates = (weekOffset: number): Date[] => {
    const monday = getWeekStart(weekOffset)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      return date
    })
  }

  // Format date range for display
  const getWeekDateRange = (weekOffset: number): string => {
    const weekDates = getWeekDates(weekOffset)
    const start = weekDates[0]
    const end = weekDates[6]

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const getDayIndex = (day: string): number => {
    return days.indexOf(day.toUpperCase())
  }

  const getClassesForDayAndTime = (day: string, time: string) => {
    return classes.filter(cls => {
      const classHour = parseInt(cls.startTime.split(':')[0])
      const slotHour = parseInt(time.split(':')[0])
      return cls.day === day && classHour === slotHour
    })
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, classItem: ScheduledClass) => {
    setDraggedClass(classItem)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent<HTMLTableCellElement>, day: string, time: string) => {
    e.preventDefault()

    if (!draggedClass) return

    // Calculate new end time (same duration as original)
    const originalDuration = calculateDuration(draggedClass.startTime, draggedClass.endTime)
    const newEndTime = addMinutes(time, originalDuration)

    // Show edit modal to confirm/adjust time
    setEditModal({
      classId: draggedClass.id,
      day,
      startTime: time,
      endTime: newEndTime,
    })
    setEditForm({ startTime: time, endTime: newEndTime })
    setDraggedClass(null)
  }

  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)
    return (endHour * 60 + endMin) - (startHour * 60 + startMin)
  }

  const addMinutes = (time: string, minutes: number): string => {
    const [hour, min] = time.split(':').map(Number)
    const totalMinutes = hour * 60 + min + minutes
    const newHour = Math.floor(totalMinutes / 60)
    const newMin = totalMinutes % 60
    return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`
  }

  const handleUpdateClass = async () => {
    if (!editModal) return

    try {
      const response = await fetch(`/api/classes/${editModal.classId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: editModal.day,
          startTime: editForm.startTime,
          endTime: editForm.endTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle conflict errors (409)
        if (response.status === 409 && data.conflicts) {
          setConflicts(data.conflicts)
          setShowConflictModal(true)
          toast.error(data.message?.toUpperCase() || 'SCHEDULING CONFLICT DETECTED')
          return
        }

        throw new Error(data.error || 'Failed to update class')
      }

      toast.success('CLASS RESCHEDULED SUCCESSFULLY')
      setEditModal(null)
      fetchClasses()
    } catch (error) {
      console.error('Error updating class:', error)
      toast.error('FAILED TO UPDATE CLASS')
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete class')

      toast.success('CLASS DELETED')
      fetchClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      toast.error('FAILED TO DELETE CLASS')
    }
  }

  const getColorClass = (colorCode: string | undefined) => {
    switch (colorCode) {
      case 'blue': return 'bg-dr-blue'
      case 'purple': return 'bg-dr-purple'
      case 'green': return 'bg-dr-green'
      case 'peach': return 'bg-dr-peach'
      case 'yellow': return 'bg-dr-yellow'
      default: return 'bg-dr-blue'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dr-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-dr-yellow border-solid mx-auto mb-4"></div>
          <p className="font-display text-xl uppercase text-dr-black">
            LOADING CALENDAR...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="MASTER CALENDAR"
        backLink="/dashboard"
        backText="BACK TO DASHBOARD"
        variant="black"
        actions={
          <div className="flex gap-3">
            <Link href="/admin/schedule/recurring">
              <Button variant="blue" size="lg">
                <Calendar className="mr-2" size={20} />
                RECURRING SCHEDULE
              </Button>
            </Link>
            <Link href="/admin/schedule/new">
              <Button variant="yellow" size="lg">
                <Plus className="mr-2" size={20} />
                SINGLE CLASS
              </Button>
            </Link>
          </div>
        }
      />

      {/* Calendar Controls - Yellow */}
      <section className="bg-dr-yellow border-b-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 bg-dr-black text-dr-yellow hover:bg-dr-white hover:text-dr-black transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <h2 className="font-display text-xl text-dr-black uppercase">
                  {currentWeek === 0 ? 'CURRENT WEEK' : currentWeek > 0 ? `WEEK +${currentWeek}` : `WEEK ${currentWeek}`}
                </h2>
                <p className="text-sm font-bold text-dr-black mt-1">
                  {getWeekDateRange(currentWeek)}
                </p>
              </div>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 bg-dr-black text-dr-yellow hover:bg-dr-white hover:text-dr-black transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-dr-blue border-2 border-dr-black"></div>
                <span className="text-sm font-bold text-dr-black">BLUE</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-dr-purple border-2 border-dr-black"></div>
                <span className="text-sm font-bold text-dr-black">PURPLE</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-dr-green border-2 border-dr-black"></div>
                <span className="text-sm font-bold text-dr-black">GREEN</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-dr-peach border-2 border-dr-black"></div>
                <span className="text-sm font-bold text-dr-black">PEACH</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-dr-yellow border-2 border-dr-black"></div>
                <span className="text-sm font-bold text-dr-black">YELLOW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Text */}
      <div className="bg-dr-blue border-b-2 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-2">
          <p className="text-xs font-bold text-dr-white text-center uppercase">
            💡 DRAG & DROP TO RESCHEDULE • CLICK EDIT TO MODIFY • CLICK DELETE TO REMOVE
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <section className="max-w-[1800px] mx-auto p-4">
        <div className="border-2 border-dr-black bg-dr-white overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-dr-black">
                <th className="border-r border-dr-yellow p-2 w-20">
                  <span className="font-display text-dr-yellow uppercase text-xs">TIME</span>
                </th>
                {days.map((day, index) => {
                  const weekDates = getWeekDates(currentWeek)
                  const date = weekDates[index]
                  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                  return (
                    <th key={index} className="border-r border-dr-yellow p-2 last:border-r-0">
                      <div className="text-center">
                        <span className="font-display text-dr-yellow uppercase text-xs block">{day.substring(0, 3)}</span>
                        <span className="text-dr-yellow text-[10px] font-bold block mt-0.5">{dateStr}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr key={timeIndex} className="border-t border-dr-black">
                  <td className="border-r border-dr-black p-2 bg-gray-50">
                    <span className="font-bold text-dr-black text-xs">{time}</span>
                  </td>
                  {days.map((day, dayIndex) => {
                    const cellClasses = getClassesForDayAndTime(day, time)
                    return (
                      <td
                        key={dayIndex}
                        className="border-r border-dr-black p-1 align-top h-16 last:border-r-0 hover:bg-gray-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, time)}
                      >
                        <div className="space-y-1">
                          {cellClasses.map((cls) => (
                            <div
                              key={cls.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, cls)}
                              className={`${getColorClass(cls.colorCode)} border border-dr-black p-1.5 text-xs cursor-move hover:opacity-80 transition-opacity relative group`}
                            >
                              <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditModal({
                                      classId: cls.id,
                                      day: cls.day,
                                      startTime: cls.startTime,
                                      endTime: cls.endTime,
                                    })
                                    setEditForm({ startTime: cls.startTime, endTime: cls.endTime })
                                  }}
                                  className="bg-dr-white p-0.5 border border-dr-black hover:bg-dr-yellow transition-colors"
                                  title="Edit Time"
                                >
                                  <Edit2 size={8} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(cls.id)}
                                  className="bg-dr-white p-0.5 border border-dr-black hover:bg-red-500 hover:text-white transition-colors"
                                  title="Delete Class"
                                >
                                  <Trash2 size={8} />
                                </button>
                              </div>
                              <p className="font-display text-[10px] text-dr-black uppercase truncate pr-8 leading-tight">
                                {cls.title}
                              </p>
                              <p className="text-dr-black text-[9px] leading-tight mt-0.5">
                                {cls.startTime}-{cls.endTime}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Footer - Blue */}
      <section className="bg-dr-blue border-t-2 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-dr-white border border-dr-black p-4">
              <p className="text-[10px] font-bold uppercase text-dr-black mb-1">TOTAL CLASSES</p>
              <p className="text-2xl font-display text-dr-black">{classes.length}</p>
            </div>
            <div className="bg-dr-white border border-dr-black p-4">
              <p className="text-[10px] font-bold uppercase text-dr-black mb-1">THIS WEEK</p>
              <p className="text-2xl font-display text-dr-black">{classes.length}</p>
            </div>
            <div className="bg-dr-white border border-dr-black p-4">
              <p className="text-[10px] font-bold uppercase text-dr-black mb-1">MONDAY</p>
              <p className="text-2xl font-display text-dr-black">
                {classes.filter(c => c.day === 'MONDAY').length}
              </p>
            </div>
            <div className="bg-dr-white border border-dr-black p-4">
              <p className="text-[10px] font-bold uppercase text-dr-black mb-1">DRAG & DROP</p>
              <p className="text-2xl font-display text-dr-green">✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-dr-white border-4 border-dr-black max-w-md w-full">
            <div className="bg-dr-yellow p-6 border-b-4 border-dr-black">
              <h2 className="font-display text-2xl text-dr-black uppercase">
                UPDATE CLASS TIME
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-dr-black mb-2">
                  Day
                </label>
                <select
                  value={editModal.day}
                  onChange={(e) => setEditModal({ ...editModal, day: e.target.value })}
                  className="w-full border-2 border-dr-black p-3 font-semibold uppercase"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dr-black mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                  className="w-full border-2 border-dr-black p-3 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-dr-black mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={editForm.endTime}
                  onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                  className="w-full border-2 border-dr-black p-3 font-semibold"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="black"
                  className="flex-1"
                  onClick={handleUpdateClass}
                >
                  UPDATE CLASS
                </Button>
                <Button
                  variant="white"
                  className="flex-1"
                  onClick={() => setEditModal(null)}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-dr-white border-4 border-dr-black max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-dr-peach p-6 border-b-4 border-dr-black sticky top-0">
              <h2 className="font-display text-2xl text-dr-black uppercase flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                SCHEDULING CONFLICT DETECTED
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="font-bold text-dr-black uppercase">
                The following conflicts prevent this class from being rescheduled:
              </p>

              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="border-4 border-dr-black p-4 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-dr-black text-dr-yellow px-3 py-1 font-display text-sm">
                      {conflict.type.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-dr-black uppercase mb-2">
                        {conflict.conflictingClass.title}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-bold">Teacher:</span> {conflict.conflictingClass.teacherName}
                        </p>
                        <p>
                          <span className="font-bold">Room:</span> {conflict.conflictingClass.roomName}
                        </p>
                        <p>
                          <span className="font-bold">Time:</span> {conflict.conflictingClass.startTime} - {conflict.conflictingClass.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-dr-yellow border-4 border-dr-black p-4 mt-6">
                <p className="font-bold text-dr-black uppercase mb-2">💡 SUGGESTIONS:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Choose a different time slot</li>
                  <li>Select a different teacher or room</li>
                  <li>Schedule on a different day</li>
                  <li>Check available time slots in the calendar</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="black"
                  className="flex-1"
                  onClick={() => {
                    setShowConflictModal(false)
                    // Keep the edit modal open so user can modify
                  }}
                >
                  MODIFY TIME
                </Button>
                <Button
                  variant="white"
                  className="flex-1"
                  onClick={() => {
                    setShowConflictModal(false)
                    setEditModal(null)
                  }}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Black */}
      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE - MASTER CALENDAR
          </p>
        </div>
      </footer>
    </div>
  )
}
