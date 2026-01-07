import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createGroupScheduleSchema } from '@/lib/validations/group'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createGroupScheduleSchema.parse(body)

    const schedule = await prisma.groupSchedule.create({
      data: {
        groupId: validatedData.groupId,
        startTime: new Date(validatedData.startTime),
        endTime: new Date(validatedData.endTime),
        dayOfWeek: validatedData.dayOfWeek,
        location: validatedData.location,
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

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return NextResponse.json(
        { error: 'groupId is required' },
        { status: 400 }
      )
    }

    const schedules = await prisma.groupSchedule.findMany({
      where: { groupId },
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
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    })

    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}
