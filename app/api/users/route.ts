import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMINISTRATOR']),
  phone: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).default('ACTIVE'),
  invitationToken: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = createUserSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user (in production, you should hash the password using bcrypt)
    // For now, we're storing plain text password (NOT RECOMMENDED for production)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // TODO: Hash password with bcrypt in production
        role: data.role,
        phone: data.phone || null,
        status: data.status,
      },
    })

    // If invitation token provided, mark it as ACCEPTED
    if (data.invitationToken) {
      await prisma.invitationToken.updateMany({
        where: {
          token: data.invitationToken,
          status: 'PENDING',
        },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    const where: any = {}
    if (role) where.role = role
    if (status) where.status = status

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
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
