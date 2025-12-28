'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SlideUp } from '@/components/page-transition'
import { toast } from 'sonner'
import { Calendar, Check } from 'lucide-react'

interface RecurringScheduleForm {
  title: string
  teacher: string
  room: string
  daysOfWeek: string[]
  startTime: string
  endTime: string
  type: 'group' | 'private'
  color: string
  startDate: string
  durationType: 'weeks' | 'endDate'
  numberOfWeeks: number
  endDate: string
}

export default function RecurringSchedule() {
  const router = useRouter()
  const [formData, setFormData] = useState<RecurringScheduleForm>({
    title: '',
    teacher: '',
    room: '',
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    type: 'group',
    color: '',
    startDate: '',
    durationType: 'weeks',
    numberOfWeeks: 12,
    endDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const daysOptions = [
    { value: 'MONDAY', label: 'Mon' },
    { value: 'TUESDAY', label: 'Tue' },
    { value: 'WEDNESDAY', label: 'Wed' },
    { value: 'THURSDAY', label: 'Thu' },
    { value: 'FRIDAY', label: 'Fri' },
    { value: 'SATURDAY', label: 'Sat' },
    { value: 'SUNDAY', label: 'Sun' },
  ]

  const toggleDay = (day: string) => {
    const newDays = formData.daysOfWeek.includes(day)
      ? formData.daysOfWeek.filter((d) => d !== day)
      : [...formData.daysOfWeek, day]
    setFormData({ ...formData, daysOfWeek: newDays })
    setErrors({ ...errors, daysOfWeek: '' })
  }

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color })
    setErrors({ ...errors, color: '' })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Class title is required'
    if (!formData.teacher) newErrors.teacher = 'Please select a teacher'
    if (!formData.room) newErrors.room = 'Please select a room'
    if (formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Select at least one day'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }
    if (!formData.color) newErrors.color = 'Please select a color'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (formData.durationType === 'weeks' && formData.numberOfWeeks < 1) {
      newErrors.numberOfWeeks = 'Number of weeks must be at least 1'
    }
    if (formData.durationType === 'endDate' && !formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = async () => {
    if (!validateForm()) {
      toast.error('PLEASE FIX FORM ERRORS')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/classes/recurring/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate preview')
      }

      setPreview(data)
      setShowPreview(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'FAILED TO GENERATE PREVIEW')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreate = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/classes/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create recurring schedule')
      }

      toast.success(`${data.created} CLASSES CREATED SUCCESSFULLY!`)

      if (data.conflicts && data.conflicts.length > 0) {
        toast.warning(`${data.conflicts.length} CLASSES SKIPPED DUE TO CONFLICTS`)
      }

      setTimeout(() => {
        router.push('/admin/calendar')
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      toast.error(error instanceof Error ? error.message.toUpperCase() : 'FAILED TO CREATE SCHEDULE')
    }
  }

  const calculateTotalClasses = () => {
    if (formData.daysOfWeek.length === 0) return 0

    if (formData.durationType === 'weeks') {
      return formData.daysOfWeek.length * formData.numberOfWeeks
    }

    // For end date, we'd need to calculate weeks between dates
    // For now, show approximate
    return formData.daysOfWeek.length * formData.numberOfWeeks
  }

  return (
    <div className="min-h-screen bg-dr-white">
      <Header
        title="RECURRING CLASS SCHEDULER"
        subtitle="Schedule multiple classes at once for the entire term"
        backLink="/admin/calendar"
        backText="BACK TO CALENDAR"
        variant="black"
      />

      <SlideUp>
        <section className="max-w-5xl mx-auto px-8 py-12">
          {!showPreview ? (
            <form onSubmit={(e) => { e.preventDefault(); handlePreview(); }}>
              {/* Class Details */}
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
                      placeholder="e.g., Piano Basic - Spring 2025"
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
                </div>
              </div>

              {/* Schedule Pattern */}
              <div className="bg-dr-blue border-4 border-dr-black p-8 mb-8">
                <h2 className="font-display text-3xl text-dr-white mb-4 uppercase">SCHEDULE PATTERN</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      DAYS OF WEEK (SELECT MULTIPLE)
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {daysOptions.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`p-4 border-4 font-bold uppercase transition-all ${
                            formData.daysOfWeek.includes(day.value)
                              ? 'bg-dr-yellow text-dr-black border-dr-black'
                              : 'bg-dr-white text-dr-black border-dr-black hover:border-dr-yellow'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {errors.daysOfWeek && (
                      <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                        {errors.daysOfWeek}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                        START TIME
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className={`w-full border-4 p-4 font-semibold text-lg ${errors.startTime ? 'border-dr-peach' : 'border-dr-black'}`}
                      />
                      {errors.startTime && (
                        <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                          {errors.startTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                        END TIME
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className={`w-full border-4 p-4 font-semibold text-lg ${errors.endTime ? 'border-dr-peach' : 'border-dr-black'}`}
                      />
                      {errors.endTime && (
                        <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
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
                      <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                        {errors.color}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-dr-purple border-4 border-dr-black p-8 mb-8">
                <h2 className="font-display text-3xl text-dr-white mb-4 uppercase">DURATION</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      START DATE
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full border-4 p-4 font-semibold ${errors.startDate ? 'border-dr-peach' : 'border-dr-black'}`}
                    />
                    {errors.startDate && (
                      <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                      DURATION TYPE
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, durationType: 'weeks' })}
                        className={`p-4 border-4 font-bold uppercase transition-all ${
                          formData.durationType === 'weeks'
                            ? 'bg-dr-yellow text-dr-black border-dr-black'
                            : 'bg-dr-white text-dr-black border-dr-black hover:border-dr-yellow'
                        }`}
                      >
                        NUMBER OF WEEKS
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, durationType: 'endDate' })}
                        className={`p-4 border-4 font-bold uppercase transition-all ${
                          formData.durationType === 'endDate'
                            ? 'bg-dr-yellow text-dr-black border-dr-black'
                            : 'bg-dr-white text-dr-black border-dr-black hover:border-dr-yellow'
                        }`}
                      >
                        END DATE
                      </button>
                    </div>
                  </div>

                  {formData.durationType === 'weeks' ? (
                    <div>
                      <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                        NUMBER OF WEEKS
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={formData.numberOfWeeks}
                        onChange={(e) => setFormData({ ...formData, numberOfWeeks: parseInt(e.target.value) || 1 })}
                        className={`w-full border-4 p-4 font-semibold text-lg ${errors.numberOfWeeks ? 'border-dr-peach' : 'border-dr-black'}`}
                      />
                      {errors.numberOfWeeks && (
                        <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                          {errors.numberOfWeeks}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold uppercase text-dr-white mb-2">
                        END DATE
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={`w-full border-4 p-4 font-semibold ${errors.endDate ? 'border-dr-peach' : 'border-dr-black'}`}
                      />
                      {errors.endDate && (
                        <p className="text-dr-white bg-dr-peach border-2 border-dr-black px-3 py-1 mt-2 text-sm font-bold uppercase">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-dr-yellow border-4 border-dr-black p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={24} className="text-dr-black" />
                      <h3 className="font-display text-xl text-dr-black uppercase">SCHEDULE SUMMARY</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-bold text-dr-black">DAYS PER WEEK:</p>
                        <p className="text-dr-black">{formData.daysOfWeek.length || 0} days</p>
                      </div>
                      <div>
                        <p className="font-bold text-dr-black">TOTAL WEEKS:</p>
                        <p className="text-dr-black">{formData.numberOfWeeks} weeks</p>
                      </div>
                      <div>
                        <p className="font-bold text-dr-black">ESTIMATED CLASSES:</p>
                        <p className="text-dr-black text-2xl font-display">{calculateTotalClasses()}</p>
                      </div>
                      <div>
                        <p className="font-bold text-dr-black">TIME SLOT:</p>
                        <p className="text-dr-black">{formData.startTime || '--:--'} - {formData.endTime || '--:--'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="black"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'GENERATING...' : 'PREVIEW SCHEDULE'}
                </Button>
                <Link href="/admin/calendar" className="flex-1">
                  <Button type="button" variant="white" size="lg" className="w-full">
                    CANCEL
                  </Button>
                </Link>
              </div>
            </form>
          ) : (
            /* Preview Screen */
            <div>
              <div className="bg-dr-green border-4 border-dr-black p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Check size={32} className="text-dr-white" />
                  <h2 className="font-display text-3xl text-dr-white uppercase">SCHEDULE PREVIEW</h2>
                </div>

                <div className="bg-dr-white border-4 border-dr-black p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-dr-black mb-1">CLASS</p>
                      <p className="text-lg font-bold text-dr-black">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-dr-black mb-1">TEACHER</p>
                      <p className="text-lg font-bold text-dr-black">{formData.teacher}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-dr-black mb-1">ROOM</p>
                      <p className="text-lg font-bold text-dr-black">{formData.room}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-dr-black mb-1">TIME</p>
                      <p className="text-lg font-bold text-dr-black">{formData.startTime} - {formData.endTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-dr-black mb-1">DAYS</p>
                    <div className="flex gap-2 flex-wrap">
                      {formData.daysOfWeek.map((day) => (
                        <span key={day} className="bg-dr-yellow px-3 py-1 text-sm font-bold border-2 border-dr-black">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {preview && (
                    <div className="border-t-4 border-dr-black pt-4 mt-4">
                      <p className="font-display text-2xl text-dr-black mb-2">
                        {preview.totalClasses} CLASSES WILL BE CREATED
                      </p>
                      {preview.conflicts && preview.conflicts.length > 0 && (
                        <p className="text-dr-peach font-bold">
                          ⚠️ {preview.conflicts.length} conflicts detected - those classes will be skipped
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="black"
                  size="lg"
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'CREATING...' : 'CREATE ALL CLASSES'}
                </Button>
                <Button
                  variant="white"
                  size="lg"
                  className="flex-1"
                  onClick={() => setShowPreview(false)}
                  disabled={isSubmitting}
                >
                  MODIFY
                </Button>
              </div>
            </div>
          )}
        </section>
      </SlideUp>

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
