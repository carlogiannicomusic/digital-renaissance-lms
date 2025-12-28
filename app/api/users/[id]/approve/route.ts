import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendEmail, generateCredentialsEmail } from '@/lib/email/service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Update user status to ACTIVE
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    })

    // Send credentials email
    try {
      const credentialsEmail = generateCredentialsEmail(
        user.name,
        user.email,
        user.password // Note: In production, you'd generate a temporary password
      )

      await sendEmail({
        to: user.email,
        subject: 'Your Digital Renaissance Account is Approved!',
        html: credentialsEmail,
      })
    } catch (emailError) {
      console.error('Failed to send credentials email:', emailError)
      // Don't fail the approval if email fails
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    )
  }
}
