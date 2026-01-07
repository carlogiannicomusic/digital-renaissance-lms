import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { duplicateGroupSchema } from '@/lib/validations/group'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = duplicateGroupSchema.parse(body)

    // Get the original group with all its data
    const originalGroup = await prisma.studentGroup.findUnique({
      where: { id },
      include: {
        schedules: true,
        enrollments: true,
      },
    })

    if (!originalGroup) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Create the new group
    const newGroup = await prisma.studentGroup.create({
      data: {
        courseId: originalGroup.courseId,
        name: validatedData.newName,
        description: originalGroup.description,
        maxCapacity: originalGroup.maxCapacity,
      },
    })

    // Copy schedules if requested
    if (validatedData.copySchedules && originalGroup.schedules.length > 0) {
      await prisma.groupSchedule.createMany({
        data: originalGroup.schedules.map((schedule) => ({
          groupId: newGroup.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          dayOfWeek: schedule.dayOfWeek,
          location: schedule.location,
        })),
      })
    }

    // Copy student assignments if requested
    if (validatedData.copyStudents && originalGroup.enrollments.length > 0) {
      await prisma.enrollment.updateMany({
        where: {
          courseId: originalGroup.courseId,
          studentId: {
            in: originalGroup.enrollments.map((e) => e.studentId),
          },
          groupId: id,
        },
        data: {
          groupId: newGroup.id,
        },
      })
    }

    // Fetch the complete new group
    const completeGroup = await prisma.studentGroup.findUnique({
      where: { id: newGroup.id },
      include: {
        schedules: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' },
          ],
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    })

    return NextResponse.json(completeGroup, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A group with this name already exists for this course' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to duplicate group' },
      { status: 500 }
    )
  }
}
