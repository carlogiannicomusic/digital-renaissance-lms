import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CourseSchedule } from '@/components/courses/course-schedule'
import { ScheduleForm } from '@/components/courses/schedule-form'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import { FileText, Users } from 'lucide-react'

async function getCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        schedules: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    })

    if (!course) {
      notFound()
    }

    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    notFound()
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = await getCourse(id)

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Purple Monochromatic */}
      <section className="bg-dr-purple">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <Link href="/courses">
            <Button variant="black" size="sm" className="mb-8">
              ← Back to Courses
            </Button>
          </Link>

          <h1 className="font-display text-5xl md:text-6xl text-dr-black mb-6 uppercase leading-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-xl text-dr-black font-semibold max-w-3xl mb-8">
              {course.description}
            </p>
          )}
          <div className="flex flex-wrap gap-6 text-dr-black font-bold uppercase text-sm">
            <span>Teacher: {course.teacher.name}</span>
            <span>•</span>
            <span>{course._count.enrollments} Students</span>
          </div>
        </div>
      </section>

      {/* Quick Actions - Blue */}
      <section className="bg-dr-blue border-b-4 border-dr-black py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h2 className="font-display text-2xl text-dr-white uppercase mb-4">
            COURSE RESOURCES
          </h2>
          <div className="flex gap-4">
            <Link href={`/courses/${id}/materials`}>
              <Button variant="yellow" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                COURSE MATERIALS
              </Button>
            </Link>
            <Link href={`/courses/${id}/roster`}>
              <Button variant="white" size="lg">
                <Users className="h-5 w-5 mr-2" />
                CLASS ROSTER
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule Management Grid */}
      <section className="grid lg:grid-cols-2">
        {/* Schedule Display - Peach */}
        <div className="bg-dr-peach p-8 md:p-12">
          <CourseSchedule courseId={id} />
        </div>

        {/* Schedule Form - Yellow */}
        <div className="bg-dr-yellow p-8 md:p-12">
          <ScheduleForm
            courseId={id}
            onSuccess={() => {
              window.location.reload()
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-dr-black py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-display text-sm text-dr-white">DIGITAL RENAISSANCE</p>
        </div>
      </section>
    </div>
  )
}
