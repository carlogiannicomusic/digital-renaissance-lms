import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { updateGroupSchema } from '@/lib/validations/group'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const group = await prisma.studentGroup.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
        schedules: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' },
          ],
        },
        enrollments: {
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
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateGroupSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.maxCapacity !== undefined) updateData.maxCapacity = validatedData.maxCapacity

    const group = await prisma.studentGroup.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(group)
  } catch (error) {
    if (error instanceof Error) {
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
      { error: 'Failed to update group' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.studentGroup.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    )
  }
}
