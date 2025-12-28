'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SlideUp } from '@/components/page-transition'
import { scheduleClassSchema } from '@/lib/validations'
import { toast } from 'sonner'

export default function NewSchedule() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    teacher: '',
    room: '',
    day: 'Monday',
    type: 'group' as 'group' | 'private',
    startTime: '',
    endTime: '',
    color: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [conflicts, setConflicts] = useState<any[]>([])
  const [showConflictModal, setShowConflictModal] = useState(false)

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color })
    setErrors({ ...errors, color: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const result = scheduleClassSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0].toString()] = error.message
        }
      })
      setErrors(newErrors)
      setIsSubmitting(false)
      toast.error('PLEASE FIX FORM ERRORS')
      return
    }

    // Call API to create class
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle conflict errors (409)
        if (response.status === 409 && data.conflicts) {
          setConflicts(data.conflicts)
          setShowConflictModal(true)
          setIsSubmitting(false)
          toast.error(data.message?.toUpperCase() || 'SCHEDULING CONFLICT DETECTED')
          return
        }

        throw new Error(data.error || 'Failed to create class')
      }

      // Show success message
      toast.success('CLASS SCHEDULED SUCCESSFULLY!')

      // Redirect to calendar
      setTimeout(() => {
        router.push('/admin/calendar')
      }, 500)
    } catch (error) {
      setIsSubmitting(false)
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'FAILED TO SCHEDULE CLASS')
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="SCHEDULE NEW CLASS"
        backLink="/admin/calendar"
        backText="BACK TO CALENDAR"
        variant="black"
      />

      <SlideUp>
        <section className="max-w-4xl mx-auto px-8 py-12">
          <form onSubmit={handleSubmit}>
            <div className="bg-dr-yellow border-4 border-dr-black p-8 mb-8">
              <h2 className="font-display text-3xl text-dr-black mb-4 uppercase">CLASS DETAILS</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    CLASS TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold text-lg ${errors.title ? 'border-dr-peach' : 'border-dr-black'}`}
                    placeholder="e.g., Piano Masterclass"
                  />
                  {errors.title && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.title}
                    </p>
                  )}
                </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    TEACHER
                  </label>
                  <select
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold ${errors.teacher ? 'border-dr-peach' : 'border-dr-black'}`}
                  >
                    <option value="">Select Teacher</option>
                    <option value="Maria Rodriguez">Maria Rodriguez</option>
                    <option value="Prof. Sarah Williams">Prof. Sarah Williams</option>
                    <option value="DJ Marcus Lee">DJ Marcus Lee</option>
                    <option value="Carlos Mendez">Carlos Mendez</option>
                  </select>
                  {errors.teacher && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.teacher}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    ROOM
                  </label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold ${errors.room ? 'border-dr-peach' : 'border-dr-black'}`}
                  >
                    <option value="">Select Room</option>
                    <option value="Studio 1">Studio 1</option>
                    <option value="Studio 2">Studio 2</option>
                    <option value="Studio 3">Studio 3</option>
                    <option value="Production Lab">Production Lab</option>
                    <option value="Room 201">Room 201</option>
                  </select>
                  {errors.room && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.room}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    CLASS TYPE
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'group' | 'private' })}
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                  >
                    <option value="group">Group Class</option>
                    <option value="private">Private Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    DAY OF WEEK
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full border-4 border-dr-black p-4 font-semibold"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    START TIME
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold text-lg ${errors.startTime ? 'border-dr-peach' : 'border-dr-black'}`}
                  />
                  {errors.startTime && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                    END TIME
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`w-full border-4 p-4 font-semibold text-lg ${errors.endTime ? 'border-dr-peach' : 'border-dr-black'}`}
                  />
                  {errors.endTime && (
                    <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-dr-black mb-2">
                  COLOR CODE
                </label>
                <div className="grid grid-cols-5 gap-4">
                  <button
                    type="button"
                    onClick={() => handleColorSelect('blue')}
                    className={`bg-dr-blue h-16 border-4 transition-all ${formData.color === 'blue' ? 'border-dr-yellow' : 'border-dr-black hover:border-dr-yellow'}`}
                  ></button>
                  <button
                    type="button"
                    onClick={() => handleColorSelect('purple')}
                    className={`bg-dr-purple h-16 border-4 transition-all ${formData.color === 'purple' ? 'border-dr-yellow' : 'border-dr-black hover:border-dr-yellow'}`}
                  ></button>
                  <button
                    type="button"
                    onClick={() => handleColorSelect('green')}
                    className={`bg-dr-green h-16 border-4 transition-all ${formData.color === 'green' ? 'border-dr-yellow' : 'border-dr-black hover:border-dr-yellow'}`}
                  ></button>
                  <button
                    type="button"
                    onClick={() => handleColorSelect('peach')}
                    className={`bg-dr-peach h-16 border-4 transition-all ${formData.color === 'peach' ? 'border-dr-yellow' : 'border-dr-black hover:border-dr-yellow'}`}
                  ></button>
                  <button
                    type="button"
                    onClick={() => handleColorSelect('yellow')}
                    className={`bg-dr-yellow h-16 border-4 transition-all ${formData.color === 'yellow' ? 'border-dr-blue' : 'border-dr-black hover:border-dr-blue'}`}
                  ></button>
                </div>
                {errors.color && (
                  <p className="text-dr-black bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                    {errors.color}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" variant="black" size="lg" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'SCHEDULING...' : 'SCHEDULE CLASS'}
                </Button>
                <Link href="/admin/calendar" className="flex-1">
                  <Button type="button" variant="white" size="lg" className="w-full">
                    CANCEL
                  </Button>
                </Link>
              </div>
              </div>
            </div>
          </form>
        </section>
      </SlideUp>

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
                The following conflicts prevent this class from being scheduled:
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
                  <li>Check the calendar for available slots</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="black"
                  className="flex-1"
                  onClick={() => setShowConflictModal(false)}
                >
                  MODIFY SCHEDULE
                </Button>
                <Link href="/admin/calendar" className="flex-1">
                  <Button variant="white" className="w-full">
                    BACK TO CALENDAR
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE
          </p>
        </div>
      </footer>
    </div>
  )
}
