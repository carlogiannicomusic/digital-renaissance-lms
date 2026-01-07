import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { assignStudentsSchema } from '@/lib/validations/group'

// Get students assigned to this group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const group = await prisma.studentGroup.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    const students = group.enrollments.map((e) => ({
      ...e.student,
      enrolledAt: e.enrolledAt,
    }))

    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch group students' },
      { status: 500 }
    )
  }
}

// Assign students to group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = assignStudentsSchema.parse(body)

    // Get the group to find its courseId
    const group = await prisma.studentGroup.findUnique({
      where: { id },
      select: { courseId: true },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Update enrollments to assign students to this group
    const result = await prisma.enrollment.updateMany({
      where: {
        courseId: group.courseId,
        studentId: {
          in: validatedData.studentIds,
        },
      },
      data: {
        groupId: id,
      },
    })

    return NextResponse.json({
      message: `${result.count} student(s) assigned to group`,
      count: result.count,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to assign students' },
      { status: 500 }
    )
  }
}

// Unassign students from group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = assignStudentsSchema.parse(body)

    // Get the group to find its courseId
    const group = await prisma.studentGroup.findUnique({
      where: { id },
      select: { courseId: true },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Remove students from this group (set groupId to null)
    const result = await prisma.enrollment.updateMany({
      where: {
        courseId: group.courseId,
        studentId: {
          in: validatedData.studentIds,
        },
        groupId: id,
      },
      data: {
        groupId: null,
      },
    })

    return NextResponse.json({
      message: `${result.count} student(s) removed from group`,
      count: result.count,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to unassign students' },
      { status: 500 }
    )
  }
}
