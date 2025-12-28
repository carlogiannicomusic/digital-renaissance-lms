import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET all users with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // PENDING, ACTIVE, INACTIVE
    const role = searchParams.get('role') // STUDENT, TEACHER, ADMINISTRATOR

    const where: any = {}
    if (status) where.status = status
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            coursesTeaching: true,
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
