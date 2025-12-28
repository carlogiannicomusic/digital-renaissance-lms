import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { BookOpen, Calendar, FileText, LogOut, User, GraduationCap } from 'lucide-react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { handleLogout } from './actions'

async function getStudentStats(studentId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            teacher: true,
            schedules: true,
          },
        },
      },
    })

    const totalEnrolledCourses = enrollments.length
    const totalSchedules = enrollments.reduce(
      (acc, e) => acc + (e.course.schedules?.length || 0),
      0
    )

    return {
      totalEnrolledCourses,
      totalSchedules,
      enrollments,
    }
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return null
  }
}

export default async function StudentDashboard() {
  // Mock session for demo - auth disabled
  const session = {
    user: {
      id: '3',
      email: 'student@digitalrenaissance.com',
      name: 'Student',
      role: 'STUDENT'
    }
  }

  const stats = await getStudentStats(session.user.id)

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Green */}
      <header className="bg-dr-green border-b-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-dr-black" />
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-dr-black uppercase tracking-tight">
                  STUDENT PORTAL
                </h1>
                <p className="text-dr-black text-sm font-bold">
                  Welcome, {session.user.name}
                </p>
              </div>
            </div>
            <form action={handleLogout}>
              <Button variant="black" size="lg">
                <LogOut className="h-5 w-5 mr-2" />
                LOGOUT
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Stats Overview - Yellow */}
      <SlideUp>
        <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black mb-6 uppercase">
              MY LEARNING OVERVIEW
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ScaleIn delay={0.1}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-6xl text-dr-black mb-2">
                    {stats?.totalEnrolledCourses || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    ENROLLED COURSES
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.2}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-6xl text-dr-black mb-2">
                    {stats?.totalSchedules || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    WEEKLY CLASSES
                  </p>
                </div>
              </ScaleIn>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Quick Actions - 2x2 Grid */}
      <section className="py-16">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">
            STUDENT TOOLS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* My Courses - Blue */}
            <Link href="/courses">
              <ScaleIn delay={0.1}>
                <div className="bg-dr-blue border-4 border-dr-black p-8 hover:scale-105 transition-transform cursor-pointer">
                  <BookOpen className="h-16 w-16 text-dr-black mb-4" />
                  <h3 className="font-display text-3xl text-dr-white uppercase mb-4">
                    MY COURSES
                  </h3>
                  <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                    <p className="font-display text-5xl text-dr-black">
                      {stats?.totalEnrolledCourses || 0}
                    </p>
                    <p className="text-sm font-bold uppercase">Active Courses</p>
                  </div>
                  <p className="font-bold text-dr-white">
                    View course details, materials, and progress →
                  </p>
                </div>
              </ScaleIn>
            </Link>

            {/* My Schedule - Peach */}
            <Link href="/admin/calendar">
              <ScaleIn delay={0.2}>
                <div className="bg-dr-peach border-4 border-dr-black p-8 hover:scale-105 transition-transform cursor-pointer">
                  <Calendar className="h-16 w-16 text-dr-black mb-4" />
                  <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                    MY SCHEDULE
                  </h3>
                  <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                    <p className="font-display text-5xl text-dr-black">
                      {stats?.totalSchedules || 0}
                    </p>
                    <p className="text-sm font-bold uppercase">Weekly Classes</p>
                  </div>
                  <p className="font-bold text-dr-black">
                    View your class schedule and upcoming lessons →
                  </p>
                </div>
              </ScaleIn>
            </Link>

            {/* Course Materials - Purple */}
            <ScaleIn delay={0.3}>
              <div className="bg-dr-purple border-4 border-dr-black p-8">
                <FileText className="h-16 w-16 text-dr-white mb-4" />
                <h3 className="font-display text-3xl text-dr-white uppercase mb-4">
                  COURSE MATERIALS
                </h3>
                <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                  <p className="font-display text-5xl text-dr-black">0</p>
                  <p className="text-sm font-bold uppercase">Available Materials</p>
                </div>
                <p className="font-bold text-dr-white">
                  Access course materials and resources
                </p>
              </div>
            </ScaleIn>

            {/* My Progress - Green */}
            <ScaleIn delay={0.4}>
              <div className="bg-dr-green border-4 border-dr-black p-8">
                <GraduationCap className="h-16 w-16 text-dr-black mb-4" />
                <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                  MY PROGRESS
                </h3>
                <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                  <p className="font-display text-5xl text-dr-black">-</p>
                  <p className="text-sm font-bold uppercase">Overall Grade</p>
                </div>
                <p className="font-bold text-dr-black">
                  Track your progress and achievements
                </p>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* My Enrolled Courses - White */}
      <section className="bg-dr-white py-16">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">
            MY ENROLLED COURSES
          </h2>
          <div className="space-y-4">
            {stats?.enrollments && stats.enrollments.length > 0 ? (
              stats.enrollments.map((enrollment, idx) => (
                <ScaleIn key={enrollment.id} delay={idx * 0.1}>
                  <Link href={`/courses/${enrollment.course.id}`}>
                    <div className="bg-dr-blue border-4 border-dr-black p-6 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display text-2xl text-dr-white uppercase mb-2">
                            {enrollment.course.title}
                          </h3>
                          <p className="font-bold text-dr-white mb-1">
                            Instructor: {enrollment.course.teacher?.name || 'TBA'}
                          </p>
                          {enrollment.course.schedules && enrollment.course.schedules.length > 0 && (
                            <p className="font-bold text-dr-white">
                              {enrollment.course.schedules.length} classes per week
                            </p>
                          )}
                        </div>
                        <div className="bg-dr-white border-2 border-dr-black px-4 py-2">
                          <p className="font-bold text-dr-black uppercase text-sm">
                            ENROLLED
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScaleIn>
              ))
            ) : (
              <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
                <p className="font-display text-2xl text-dr-black uppercase mb-4">
                  NO COURSES ENROLLED
                </p>
                <Link href="/courses">
                  <Button variant="yellow" size="lg">
                    <BookOpen className="h-5 w-5 mr-2" />
                    BROWSE COURSES
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dr-green border-t-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-black uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE - STUDENT PORTAL
          </p>
        </div>
      </footer>
    </div>
  )
}
