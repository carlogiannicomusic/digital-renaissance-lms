import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { checkScheduleConflicts } from '@/lib/utils/conflict-detection'
import { DayOfWeek } from '@/app/generated/prisma/client'

interface RecurringScheduleRequest {
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
  endDate?: string
}

interface ClassToCreate {
  date: Date
  dayOfWeek: DayOfWeek
}

/**
 * Generate all class instances based on recurring schedule
 */
function generateClassInstances(data: RecurringScheduleRequest): ClassToCreate[] {
  const instances: ClassToCreate[] = []
  const startDate = new Date(data.startDate)

  let endDate: Date
  if (data.durationType === 'weeks') {
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (data.numberOfWeeks * 7))
  } else {
    endDate = new Date(data.endDate!)
  }

  // Convert day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayNameToNumber: Record<string, number> = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6,
  }

  const targetDayNumbers = data.daysOfWeek.map(day => dayNameToNumber[day])

  // Iterate through all days from start to end
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()

    // Check if this day is one of our target days
    if (targetDayNumbers.includes(dayOfWeek)) {
      const dayName = Object.keys(dayNameToNumber).find(
        key => dayNameToNumber[key] === dayOfWeek
      ) as DayOfWeek

      instances.push({
        date: new Date(currentDate),
        dayOfWeek: dayName,
      })
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return instances
}

/**
 * POST /api/classes/recurring
 * Create all classes in a recurring schedule
 */
export async function POST(request: NextRequest) {
  try {
    const body: RecurringScheduleRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.teacher || !body.room || !body.daysOfWeek.length ||
        !body.startTime || !body.endTime || !body.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if room exists, if not create it
    let room = await prisma.room.findUnique({
      where: { name: body.room },
    })

    if (!room) {
      room = await prisma.room.create({
        data: {
          name: body.room,
          capacity: 10,
          equipment: [],
        },
      })
    }

    // Generate all class instances
    const instances = generateClassInstances(body)

    const created: any[] = []
    const conflicts: any[] = []

    // Create each class with conflict checking
    for (const instance of instances) {
      try {
        // Check for conflicts
        const conflictCheck = await checkScheduleConflicts({
          teacherId: 'temp-id', // TODO: Get from auth session
          roomId: room.id,
          dayOfWeek: instance.dayOfWeek,
          startTime: body.startTime,
          endTime: body.endTime,
        })

        if (conflictCheck.hasConflict) {
          // Skip this class due to conflict
          conflicts.push({
            date: instance.date.toISOString().split('T')[0],
            dayOfWeek: instance.dayOfWeek,
            reason: conflictCheck.message,
            conflictDetails: conflictCheck.conflicts,
          })
          continue
        }

        // Create the class
        const newClass = await prisma.class.create({
          data: {
            title: body.title,
            teacherId: 'temp-id', // TODO: Get from auth session
            teacherName: body.teacher,
            roomId: room.id,
            dayOfWeek: instance.dayOfWeek,
            startTime: body.startTime,
            endTime: body.endTime,
            classType: body.type.toUpperCase() as 'GROUP' | 'PRIVATE',
            color: body.color,
          },
          include: {
            room: true,
          },
        })

        created.push(newClass)
      } catch (error) {
        console.error('Error creating class instance:', error)
        conflicts.push({
          date: instance.date.toISOString().split('T')[0],
          dayOfWeek: instance.dayOfWeek,
          reason: 'Failed to create class',
        })
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      total: instances.length,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      classes: created,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating recurring schedule:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create recurring schedule' },
      { status: 500 }
    )
  }
}
