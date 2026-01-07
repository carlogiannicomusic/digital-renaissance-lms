import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CourseSchedule } from '@/components/courses/course-schedule'
import { ScheduleForm } from '@/components/courses/schedule-form'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import { FileText, Users, Clock, DollarSign, MapPin, GraduationCap, BookOpen } from 'lucide-react'
import { getCourseDetails, getCourseTeacher, ROOMS } from '@/lib/course-data'

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
  const courseDetails = getCourseDetails(course.title)
  const assignedTeacher = getCourseTeacher(course.title)

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'certificate': return 'CERTIFICATE PROGRAM'
      case 'short': return 'SHORT COURSE'
      case 'module': return 'SPECIALIZED MODULE'
      default: return 'COURSE'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'certificate': return 'bg-dr-purple'
      case 'short': return 'bg-dr-blue'
      case 'module': return 'bg-dr-peach'
      default: return 'bg-dr-purple'
    }
  }

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header */}
      <section className={courseDetails ? getCategoryColor(courseDetails.category) : 'bg-dr-purple'}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
          <Link href="/courses">
            <Button variant="black" size="sm" className="mb-8">
              ← Back to Courses
            </Button>
          </Link>

          {courseDetails && (
            <span className="inline-block bg-dr-black text-dr-white px-4 py-2 font-bold text-sm uppercase mb-4">
              {getCategoryLabel(courseDetails.category)}
            </span>
          )}

          <h1 className="font-display text-5xl md:text-6xl text-dr-black mb-6 uppercase leading-tight">
            {course.title}
          </h1>

          {courseDetails?.goal ? (
            <p className="text-xl text-dr-black font-semibold max-w-3xl mb-8">
              {courseDetails.goal}
            </p>
          ) : course.description && (
            <p className="text-xl text-dr-black font-semibold max-w-3xl mb-8">
              {course.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-dr-black font-bold uppercase text-sm">
            <span>Teacher: {assignedTeacher || course.teacher.name}</span>
            <span>•</span>
            <span>{course._count.enrollments} Students Enrolled</span>
          </div>
        </div>
      </section>

      {/* Course Info Bar - Yellow */}
      {courseDetails && (
        <section className="bg-dr-yellow border-b-4 border-dr-black">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-dr-black" />
                <div>
                  <p className="text-xs font-bold uppercase text-dr-black opacity-70">Duration</p>
                  <p className="font-bold text-dr-black">{courseDetails.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-dr-black" />
                <div>
                  <p className="text-xs font-bold uppercase text-dr-black opacity-70">Hours</p>
                  <p className="font-bold text-dr-black">{courseDetails.hours} Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-dr-black" />
                <div>
                  <p className="text-xs font-bold uppercase text-dr-black opacity-70">Fee</p>
                  <p className="font-bold text-dr-black">{courseDetails.fee}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-dr-black" />
                <div>
                  <p className="text-xs font-bold uppercase text-dr-black opacity-70">Format</p>
                  <p className="font-bold text-dr-black">{courseDetails.format}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions - Blue */}
      <section className="bg-dr-blue border-b-4 border-dr-black py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h2 className="font-display text-2xl text-dr-white uppercase mb-4">
            COURSE RESOURCES
          </h2>
          <div className="flex flex-wrap gap-4">
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

      {/* Course Modules/Curriculum */}
      {courseDetails && courseDetails.modules.length > 0 && (
        <section className="bg-dr-white border-b-4 border-dr-black">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
            <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8 uppercase">
              CURRICULUM & MODULES
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseDetails.modules.map((module, index) => (
                <div key={index} className="bg-dr-black p-6">
                  <div className="flex items-start gap-4">
                    <span className="bg-dr-yellow text-dr-black font-bold text-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-dr-white uppercase mb-2">
                        {module.name}
                      </h3>
                      <p className="text-dr-white text-sm opacity-80">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {courseDetails.outcome && (
              <div className="mt-8 bg-dr-green p-6">
                <h3 className="font-bold text-lg text-dr-black uppercase mb-2">
                  <GraduationCap className="inline h-5 w-5 mr-2" />
                  LEARNING OUTCOME
                </h3>
                <p className="text-dr-black font-semibold">{courseDetails.outcome}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Rooms/Facilities */}
      <section className="bg-dr-peach border-b-4 border-dr-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
          <h2 className="font-display text-3xl md:text-4xl text-dr-black mb-8 uppercase">
            FACILITIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ROOMS.map((room) => (
              <div key={room.code} className="bg-dr-black p-4 text-center">
                <p className="text-dr-yellow font-bold text-lg">{room.code}</p>
                <p className="text-dr-white text-sm">{room.name}</p>
              </div>
            ))}
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
          <ScheduleForm courseId={id} />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-dr-black py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-display text-sm text-dr-white">DIGITAL RENAISSANCE MUSIC INSTITUTE</p>
          <p className="text-dr-white text-xs mt-2 opacity-70">Dubai Knowledge Park, Block 13, Office G18</p>
        </div>
      </section>
    </div>
  )
}
