import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { updateGroupScheduleSchema } from '@/lib/validations/group'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const schedule = await prisma.groupSchedule.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateGroupScheduleSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validatedData.startTime) updateData.startTime = new Date(validatedData.startTime)
    if (validatedData.endTime) updateData.endTime = new Date(validatedData.endTime)
    if (validatedData.dayOfWeek) updateData.dayOfWeek = validatedData.dayOfWeek
    if (validatedData.location !== undefined) updateData.location = validatedData.location

    const schedule = await prisma.groupSchedule.update({
      where: { id },
      data: updateData,
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

    await prisma.groupSchedule.delete({
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
