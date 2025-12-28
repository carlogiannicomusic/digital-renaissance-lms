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

// GET - Fetch attendance records
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

    const attendance = await prisma.attendance.findMany({
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
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create attendance record
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, courseId, date, status, notes } = body

    if (!studentId || !courseId || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        courseId,
        date: new Date(date),
        status,
        notes,
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
      },
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error('Create attendance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update attendance record
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, notes } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        notes,
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
      },
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error('Update attendance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
