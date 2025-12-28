import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }

    // Verify access
    if (session.user.role === 'TEACHER') {
      const course = await prisma.course.findFirst({
        where: { id: courseId, teacherId: session.user.id }
      })
      if (!course) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Fetch enrollments with student details
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    // Transform data
    const students = enrollments.map((enrollment) => ({
      id: enrollment.student.id,
      name: enrollment.student.name,
      email: enrollment.student.email,
      phone: enrollment.student.phone,
      enrolledAt: enrollment.enrolledAt,
    }))

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}
