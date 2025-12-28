import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'
import { checkScheduleConflicts } from '@/lib/utils/conflict-detection'
import { DayOfWeek } from '@/app/generated/prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { day, startTime, endTime, roomId, teacherId } = body

    // Get the existing class first
    const existingClass = await prisma.class.findUnique({
      where: { id },
    })

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Use existing values if not provided in update
    const updatedTeacherId = teacherId || existingClass.teacherId
    const updatedRoomId = roomId || existingClass.roomId
    const updatedDayOfWeek = day ? (day.toUpperCase() as DayOfWeek) : existingClass.dayOfWeek
    const updatedStartTime = startTime || existingClass.startTime
    const updatedEndTime = endTime || existingClass.endTime

    // Check for scheduling conflicts (excluding the current class)
    const conflictCheck = await checkScheduleConflicts({
      teacherId: updatedTeacherId,
      roomId: updatedRoomId,
      dayOfWeek: updatedDayOfWeek,
      startTime: updatedStartTime,
      endTime: updatedEndTime,
      excludeClassId: id, // Exclude current class from conflict check
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

    // Update the class
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...(day && { dayOfWeek: updatedDayOfWeek }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(roomId && { roomId }),
        ...(teacherId && { teacherId }),
      },
      include: {
        room: true,
      },
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.class.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
