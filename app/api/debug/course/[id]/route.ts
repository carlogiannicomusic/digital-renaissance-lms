import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// This is the exact same query used in the course page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('Debug: Querying course with ID:', id)

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        schedules: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    })

    console.log('Debug: Course result:', course ? 'Found' : 'Not found')

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found', id },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        teacher: course.teacher,
        schedulesCount: course.schedules.length,
        enrollmentsCount: course._count.enrollments,
      }
    })
  } catch (error) {
    console.error('Debug: Error:', error)
    return NextResponse.json(
      {
        error: 'Query failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
