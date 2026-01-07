import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { duplicateScheduleSchema } from '@/lib/validations/group'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = duplicateScheduleSchema.parse(body)

    // Get the original schedule
    const originalSchedule = await prisma.groupSchedule.findUnique({
      where: { id },
    })

    if (!originalSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Create the duplicate with optional new values
    const newSchedule = await prisma.groupSchedule.create({
      data: {
        groupId: originalSchedule.groupId,
        startTime: validatedData.newStartTime
          ? new Date(validatedData.newStartTime)
          : originalSchedule.startTime,
        endTime: validatedData.newEndTime
          ? new Date(validatedData.newEndTime)
          : originalSchedule.endTime,
        dayOfWeek: validatedData.newDayOfWeek || originalSchedule.dayOfWeek,
        location: originalSchedule.location,
      },
      include: {
        group: {
          select: {
            name: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(newSchedule, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to duplicate schedule' },
      { status: 500 }
    )
  }
}
