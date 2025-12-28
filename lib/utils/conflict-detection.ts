import { prisma } from '@/lib/db/prisma'
import { DayOfWeek } from '@/app/generated/prisma/client'

export interface ConflictCheckParams {
  teacherId: string
  roomId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  excludeClassId?: string // Used when updating an existing class
}

export interface ConflictResult {
  hasConflict: boolean
  conflicts: {
    type: 'teacher' | 'room'
    conflictingClass: {
      id: string
      title: string
      teacherName: string
      roomName: string
      startTime: string
      endTime: string
    }
  }[]
  message?: string
}

/**
 * Checks if two time ranges overlap
 * @param start1 First range start time (HH:MM format)
 * @param end1 First range end time (HH:MM format)
 * @param start2 Second range start time (HH:MM format)
 * @param end2 Second range end time (HH:MM format)
 * @returns true if the time ranges overlap
 */
export function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  // Convert times to minutes for easier comparison
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const start1Min = toMinutes(start1)
  const end1Min = toMinutes(end1)
  const start2Min = toMinutes(start2)
  const end2Min = toMinutes(end2)

  // Two ranges overlap if: start1 < end2 AND end1 > start2
  return start1Min < end2Min && end1Min > start2Min
}

/**
 * Checks for scheduling conflicts (teacher conflicts and room conflicts)
 * @param params Conflict check parameters
 * @returns ConflictResult with conflict details
 */
export async function checkScheduleConflicts(
  params: ConflictCheckParams
): Promise<ConflictResult> {
  const { teacherId, roomId, dayOfWeek, startTime, endTime, excludeClassId } = params

  const result: ConflictResult = {
    hasConflict: false,
    conflicts: [],
  }

  // Build where clause to exclude the current class if updating
  const whereClause = excludeClassId
    ? { NOT: { id: excludeClassId } }
    : {}

  // Find all classes on the same day
  const classesOnSameDay = await prisma.class.findMany({
    where: {
      ...whereClause,
      dayOfWeek,
    },
    include: {
      room: true,
    },
  })

  // Check for teacher conflicts
  const teacherConflicts = classesOnSameDay.filter(
    (cls) =>
      cls.teacherId === teacherId &&
      timeRangesOverlap(startTime, endTime, cls.startTime, cls.endTime)
  )

  // Check for room conflicts
  const roomConflicts = classesOnSameDay.filter(
    (cls) =>
      cls.roomId === roomId &&
      timeRangesOverlap(startTime, endTime, cls.startTime, cls.endTime)
  )

  // Add teacher conflicts to result
  for (const conflict of teacherConflicts) {
    result.conflicts.push({
      type: 'teacher',
      conflictingClass: {
        id: conflict.id,
        title: conflict.title,
        teacherName: conflict.teacherName,
        roomName: conflict.room.name,
        startTime: conflict.startTime,
        endTime: conflict.endTime,
      },
    })
  }

  // Add room conflicts to result
  for (const conflict of roomConflicts) {
    result.conflicts.push({
      type: 'room',
      conflictingClass: {
        id: conflict.id,
        title: conflict.title,
        teacherName: conflict.teacherName,
        roomName: conflict.room.name,
        startTime: conflict.startTime,
        endTime: conflict.endTime,
      },
    })
  }

  result.hasConflict = result.conflicts.length > 0

  // Generate user-friendly message
  if (result.hasConflict) {
    const messages: string[] = []

    const teacherConflictCount = result.conflicts.filter((c) => c.type === 'teacher').length
    const roomConflictCount = result.conflicts.filter((c) => c.type === 'room').length

    if (teacherConflictCount > 0) {
      messages.push(
        `Teacher is already scheduled for ${teacherConflictCount} class${
          teacherConflictCount > 1 ? 'es' : ''
        } at this time`
      )
    }

    if (roomConflictCount > 0) {
      messages.push(
        `Room is already booked for ${roomConflictCount} class${
          roomConflictCount > 1 ? 'es' : ''
        } at this time`
      )
    }

    result.message = messages.join('. ')
  }

  return result
}

/**
 * Gets available time slots for a teacher on a specific day
 * @param teacherId Teacher ID
 * @param dayOfWeek Day of week
 * @param startHour Starting hour (default: 8)
 * @param endHour Ending hour (default: 20)
 * @returns Array of available time slots
 */
export async function getAvailableTimeSlots(
  teacherId: string,
  dayOfWeek: DayOfWeek,
  startHour: number = 8,
  endHour: number = 20
): Promise<{ startTime: string; endTime: string }[]> {
  const classes = await prisma.class.findMany({
    where: {
      teacherId,
      dayOfWeek,
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  const availableSlots: { startTime: string; endTime: string }[] = []
  let currentTime = `${String(startHour).padStart(2, '0')}:00`

  for (const cls of classes) {
    // If there's a gap before this class, add it as available
    if (currentTime < cls.startTime) {
      availableSlots.push({
        startTime: currentTime,
        endTime: cls.startTime,
      })
    }
    currentTime = cls.endTime
  }

  // Add remaining time slot after the last class
  const endTime = `${String(endHour).padStart(2, '0')}:00`
  if (currentTime < endTime) {
    availableSlots.push({
      startTime: currentTime,
      endTime,
    })
  }

  return availableSlots
}
