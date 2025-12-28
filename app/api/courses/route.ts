import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createCourseSchema } from '@/lib/validations/course'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCourseSchema.parse(body)

    const course = await prisma.course.create({
      data: validatedData,
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            schedules: true,
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
