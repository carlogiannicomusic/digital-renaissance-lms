import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const createLessonSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  videoUrl: z.string().url().nullable().optional().or(z.literal('')),
  isPublished: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLessonSchema.parse(body)

    // Get the next order index
    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId: validatedData.courseId },
      orderBy: { orderIndex: 'desc' },
    })
    const orderIndex = (lastLesson?.orderIndex ?? -1) + 1

    const lesson = await prisma.lesson.create({
      data: {
        courseId: validatedData.courseId,
        title: validatedData.title,
        description: validatedData.description || null,
        content: validatedData.content || null,
        duration: validatedData.duration || null,
        videoUrl: validatedData.videoUrl || null,
        isPublished: validatedData.isPublished,
        orderIndex,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}
