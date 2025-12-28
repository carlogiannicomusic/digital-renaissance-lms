import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { updateScheduleSchema } from '@/lib/validations/schedule'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateScheduleSchema.parse({ id, ...body })

    const updateData: Record<string, unknown> = {}
    if (validatedData.startTime) updateData.startTime = new Date(validatedData.startTime)
    if (validatedData.endTime) updateData.endTime = new Date(validatedData.endTime)
    if (validatedData.dayOfWeek) updateData.dayOfWeek = validatedData.dayOfWeek
    if (validatedData.location !== undefined) updateData.location = validatedData.location

    const schedule = await prisma.courseSchedule.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            title: true,
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.courseSchedule.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Schedule deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}
