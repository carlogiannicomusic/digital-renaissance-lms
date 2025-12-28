import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// PATCH - Approve user (set status to ACTIVE)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    })

    return NextResponse.json({
      message: 'User approved successfully',
      user,
    })
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    )
  }
}
