import { NextRequest, NextResponse } from 'next/server'
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

/**
 * Generate preview of class instances without creating them
 */
function generatePreview(data: RecurringScheduleRequest) {
  const instances: { date: Date; dayOfWeek: DayOfWeek }[] = []
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
 * POST /api/classes/recurring/preview
 * Preview the classes that will be created
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

    // Generate preview instances
    const instances = generatePreview(body)

    // Group by week for easier viewing
    const weeklyBreakdown: Record<string, number> = {}
    instances.forEach(instance => {
      const weekStart = new Date(instance.date)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1) // Monday of that week
      const weekKey = weekStart.toISOString().split('T')[0]

      weeklyBreakdown[weekKey] = (weeklyBreakdown[weekKey] || 0) + 1
    })

    return NextResponse.json({
      totalClasses: instances.length,
      firstClass: instances[0]?.date.toISOString().split('T')[0],
      lastClass: instances[instances.length - 1]?.date.toISOString().split('T')[0],
      weeklyBreakdown,
      classesPerWeek: body.daysOfWeek.length,
      estimatedWeeks: Math.ceil(instances.length / body.daysOfWeek.length),
      schedule: {
        title: body.title,
        teacher: body.teacher,
        room: body.room,
        time: `${body.startTime} - ${body.endTime}`,
        days: body.daysOfWeek,
      },
    })

  } catch (error) {
    console.error('Error generating preview:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}
