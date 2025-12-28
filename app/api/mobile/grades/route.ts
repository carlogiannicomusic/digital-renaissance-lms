import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'

// Helper function to verify JWT and get user
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

// GET - Fetch grades
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')

    const where: any = {}

    if (user.role === 'STUDENT') {
      where.studentId = user.userId
    } else if (studentId) {
      where.studentId = studentId
    }

    if (courseId) {
      where.courseId = courseId
    }

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: grades })
  } catch (error) {
    console.error('Get grades error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create grade
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, courseId, assignmentId, grade, maxGrade = 10, feedback } = body

    if (!studentId || !courseId || grade === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const gradeRecord = await prisma.grade.create({
      data: {
        studentId,
        courseId,
        assignmentId,
        grade: parseFloat(grade),
        maxGrade: parseFloat(maxGrade),
        feedback,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: gradeRecord })
  } catch (error) {
    console.error('Create grade error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update grade
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, grade, maxGrade, feedback } = body

    if (!id || grade === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const gradeRecord = await prisma.grade.update({
      where: { id },
      data: {
        grade: parseFloat(grade),
        ...(maxGrade !== undefined && { maxGrade: parseFloat(maxGrade) }),
        ...(feedback !== undefined && { feedback }),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: gradeRecord })
  } catch (error) {
    console.error('Update grade error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
