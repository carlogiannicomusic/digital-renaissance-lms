import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()

    // Only admins can access stats
    if (!session?.user || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [
      totalUsers,
      pendingUsers,
      activeUsers,
      inactiveUsers,
      studentCount,
      teacherCount,
      adminCount,
      totalCourses,
      totalEnrollments,
      totalDocuments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'INACTIVE' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'ADMINISTRATOR' } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.document.count(),
    ])

    const stats = {
      users: {
        total: totalUsers,
        pending: pendingUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole: {
          students: studentCount,
          teachers: teacherCount,
          administrators: adminCount,
        },
      },
      courses: {
        total: totalCourses,
      },
      enrollments: {
        total: totalEnrollments,
      },
      documents: {
        total: totalDocuments,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
