import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db/prisma'

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        schedules: true,
        _count: {
          select: {
            enrollments: true,
            schedules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

const courseColors = ['yellow', 'blue', 'peach', 'purple', 'green'] as const

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Blue Monochromatic */}
      <section className="bg-dr-blue">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <div className="flex justify-between items-start mb-4">
            <h1 className="font-display text-5xl md:text-6xl text-dr-black">
              COURSES
            </h1>
            <Link href="/dashboard">
              <Button variant="black" size="sm">
                ← DASHBOARD
              </Button>
            </Link>
          </div>
          <p className="text-lg text-dr-black font-semibold max-w-3xl">
            Explore our diverse range of courses designed for modern learners
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-16">
        {courses.length === 0 ? (
          <div className="bg-dr-yellow p-12 text-center">
            <h2 className="font-display text-3xl text-dr-black mb-4">
              NO COURSES AVAILABLE YET
            </h2>
            <p className="text-lg text-dr-black font-semibold">
              Check back later or contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: {
              id: string
              title: string
              description?: string | null
              teacher: { name: string }
              _count: { schedules: number; enrollments: number }
            }, index: number) => {
              const colorIndex = index % courseColors.length
              const color = courseColors[colorIndex]
              const bgColors = {
                yellow: 'bg-dr-yellow',
                blue: 'bg-dr-blue',
                peach: 'bg-dr-peach',
                purple: 'bg-dr-purple',
                green: 'bg-dr-green',
              }

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className={`block ${bgColors[color]} p-8 md:p-10 min-h-[320px] hover:opacity-90 transition-opacity flex flex-col justify-between`}
                >
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-dr-black mb-3 uppercase leading-tight">
                      {course.title}
                    </h2>
                    {course.description && (
                      <p className="text-base text-dr-black font-semibold mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-dr-black font-bold uppercase tracking-wide">
                      {course.teacher.name}
                    </p>
                    <div className="flex gap-4 text-sm text-dr-black font-semibold">
                      <span>{course._count.schedules} Schedules</span>
                      <span>{course._count.enrollments} Students</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
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
