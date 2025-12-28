import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { scheduleClassSchema } from '@/lib/validations'
import { checkScheduleConflicts } from '@/lib/utils/conflict-detection'
import { DayOfWeek } from '@/app/generated/prisma/client'

// GET all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        room: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

// POST create a new class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = scheduleClassSchema.parse(body)

    // Check if room exists, if not create it
    let room = await prisma.room.findUnique({
      where: { name: validatedData.room },
    })

    if (!room) {
      room = await prisma.room.create({
        data: {
          name: validatedData.room,
          capacity: 10, // Default capacity
          equipment: [],
        },
      })
    }

    // Convert day string to DayOfWeek enum
    const dayOfWeek = validatedData.day.toUpperCase() as DayOfWeek

    // Check for scheduling conflicts
    const conflictCheck = await checkScheduleConflicts({
      teacherId: 'temp-id', // TODO: Get from auth session
      roomId: room.id,
      dayOfWeek,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
    })

    // If there are conflicts, return error with details
    if (conflictCheck.hasConflict) {
      return NextResponse.json(
        {
          error: 'Scheduling conflict detected',
          message: conflictCheck.message,
          conflicts: conflictCheck.conflicts,
        },
        { status: 409 } // 409 Conflict
      )
    }

    // Create the class
    const newClass = await prisma.class.create({
      data: {
        title: validatedData.title,
        teacherId: 'temp-id', // TODO: Get from auth session
        teacherName: validatedData.teacher,
        roomId: room.id,
        dayOfWeek: dayOfWeek,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        classType: validatedData.type.toUpperCase() as 'GROUP' | 'PRIVATE',
        color: validatedData.color,
      },
      include: {
        room: true,
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
