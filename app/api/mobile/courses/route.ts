import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'

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

// GET - Fetch courses based on user role
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let courses

    if (user.role === 'STUDENT') {
      // Get courses the student is enrolled in
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.userId },
        include: {
          course: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
        },
      })

      courses = enrollments.map(e => e.course)
    } else if (user.role === 'TEACHER') {
      // Get courses taught by the teacher
      courses = await prisma.course.findMany({
        where: { teacherId: user.userId },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      })
    } else {
      // Administrators can see all courses
      courses = await prisma.course.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      })
    }

    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
