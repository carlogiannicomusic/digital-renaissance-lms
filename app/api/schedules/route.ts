import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createScheduleSchema } from '@/lib/validations/schedule'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createScheduleSchema.parse(body)

    const schedule = await prisma.courseSchedule.create({
      data: {
        courseId: validatedData.courseId,
        startTime: new Date(validatedData.startTime),
        endTime: new Date(validatedData.endTime),
        dayOfWeek: validatedData.dayOfWeek,
        location: validatedData.location,
      },
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
    const courseId = searchParams.get('courseId')

    const where = courseId ? { courseId } : {}

    const schedules = await prisma.courseSchedule.findMany({
      where,
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
