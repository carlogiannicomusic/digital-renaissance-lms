import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }

    // Check if user has access to this course
    const hasAccess =
      session.user.role === 'ADMINISTRATOR' ||
      (session.user.role === 'TEACHER' && await prisma.course.findFirst({
        where: { id: courseId, teacherId: session.user.id }
      })) ||
      (session.user.role === 'STUDENT' && await prisma.enrollment.findFirst({
        where: { courseId, studentId: session.user.id }
      }))

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const materials = await prisma.courseMaterial.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const courseId = formData.get('courseId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const materialType = formData.get('materialType') as string

    if (!file || !courseId || !title || !materialType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify teacher owns this course (unless admin)
    if (session.user.role === 'TEACHER') {
      const course = await prisma.course.findFirst({
        where: { id: courseId, teacherId: session.user.id }
      })
      if (!course) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'materials')
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    // Save to database
    const material = await prisma.courseMaterial.create({
      data: {
        courseId,
        title,
        description: description || null,
        materialType: materialType as any,
        fileUrl: `/uploads/materials/${fileName}`,
        fileName: file.name,
        fileSize: file.size,
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error uploading material:', error)
    return NextResponse.json({ error: 'Failed to upload material' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMINISTRATOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('id')

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID required' }, { status: 400 })
    }

    // Verify ownership
    const material = await prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { course: true },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    if (session.user.role === 'TEACHER' && material.course.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await prisma.courseMaterial.delete({
      where: { id: materialId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 })
  }
}
