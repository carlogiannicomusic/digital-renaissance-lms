import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createGroupSchema } from '@/lib/validations/group'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createGroupSchema.parse(body)

    const group = await prisma.studentGroup.create({
      data: {
        courseId: validatedData.courseId,
        name: validatedData.name,
        description: validatedData.description,
        maxCapacity: validatedData.maxCapacity,
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            schedules: true,
            enrollments: true,
          },
        },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      // Handle unique constraint violation
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
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    const groups = await prisma.studentGroup.findMany({
      where: { courseId },
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
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
