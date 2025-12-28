import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, generateInvitationEmail } from '@/lib/email/service'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const invitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['STUDENT', 'TEACHER'], {
    message: 'Role must be STUDENT or TEACHER',
  }),
})

// POST /api/invitations - Create invitation and send email
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    // Only admins can send invitations
    if (!session?.user || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validation = invitationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, role } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.invitationToken.findFirst({
      where: {
        email,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'A pending invitation already exists for this email' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = randomBytes(32).toString('hex')

    // Create invitation (expires in 7 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await prisma.invitationToken.create({
      data: {
        email,
        token,
        role,
        invitedBy: session.user.email,
        expiresAt,
      },
    })

    // Send invitation email
    const inviterName = session.user.name || 'Administrator'
    const emailHtml = generateInvitationEmail(email, token, inviterName)

    await sendEmail({
      to: email,
      subject: 'Invitation to Digital Renaissance Music Institute',
      html: emailHtml,
    })

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    })
  } catch (error) {
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    )
  }
}

// GET /api/invitations?token=xxx - Validate invitation token
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const invitation = await prisma.invitationToken.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      )
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      await prisma.invitationToken.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      })

      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      )
    }

    // Check if already accepted
    if (invitation.status === 'ACCEPTED') {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      role: invitation.role,
    })
  } catch (error) {
    console.error('Error validating invitation:', error)
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    )
  }
}
