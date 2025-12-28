import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { BookOpen, Calendar, Users, LogOut, GraduationCap, FileText } from 'lucide-react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { handleLogout } from './actions'

async function getTeacherStats(teacherId: string) {
  try {
    const [myCourses, myClasses, totalStudents] = await Promise.all([
      prisma.course.count({ where: { teacherId } }),
      prisma.class.count({ where: { teacherId } }),
      prisma.enrollment.count({
        where: {
          course: {
            teacherId,
          },
        },
      }),
    ])

    const upcomingClasses = await prisma.class.findMany({
      where: { teacherId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
      },
    })

    return {
      myCourses,
      myClasses,
      totalStudents,
      upcomingClasses,
    }
  } catch (error) {
    console.error('Error fetching teacher stats:', error)
    return null
  }
}

export default async function TeacherDashboard() {
  // Mock session for demo - auth disabled
  const session = {
    user: {
      id: '2',
      email: 'teacher@digitalrenaissance.com',
      name: 'Teacher',
      role: 'TEACHER'
    }
  }

  const stats = await getTeacherStats(session.user.id)

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Purple */}
      <header className="bg-dr-purple border-b-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-dr-black" />
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-dr-black uppercase tracking-tight">
                  TEACHER PORTAL
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

      {/* Stats Overview - Blue */}
      <SlideUp>
        <section className="bg-dr-blue border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-white mb-6 uppercase">
              MY TEACHING OVERVIEW
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ScaleIn delay={0.1}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-5xl text-dr-black mb-2">
                    {stats?.myCourses || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    MY COURSES
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.2}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-5xl text-dr-black mb-2">
                    {stats?.myClasses || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    SCHEDULED CLASSES
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.3}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-5xl text-dr-black mb-2">
                    {stats?.totalStudents || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    TOTAL STUDENTS
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
            TEACHER TOOLS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* My Courses - Yellow */}
            <Link href="/courses">
              <ScaleIn delay={0.1}>
                <div className="bg-dr-yellow border-4 border-dr-black p-8 hover:scale-105 transition-transform cursor-pointer">
                  <BookOpen className="h-16 w-16 text-dr-black mb-4" />
                  <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                    MY COURSES
                  </h3>
                  <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                    <p className="font-display text-4xl text-dr-black">
                      {stats?.myCourses || 0}
                    </p>
                    <p className="text-sm font-bold uppercase">Courses I Teach</p>
                  </div>
                  <p className="font-bold text-dr-black">
                    View and manage your courses, update materials →
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
                    <p className="font-display text-4xl text-dr-black">
                      {stats?.myClasses || 0}
                    </p>
                    <p className="text-sm font-bold uppercase">Upcoming Classes</p>
                  </div>
                  <p className="font-bold text-dr-black">
                    View your teaching schedule, class details →
                  </p>
                </div>
              </ScaleIn>
            </Link>

            {/* My Students - Green */}
            <ScaleIn delay={0.3}>
              <div className="bg-dr-green border-4 border-dr-black p-8">
                <Users className="h-16 w-16 text-dr-black mb-4" />
                <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                  MY STUDENTS
                </h3>
                <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                  <p className="font-display text-4xl text-dr-black">
                    {stats?.totalStudents || 0}
                  </p>
                  <p className="text-sm font-bold uppercase">Enrolled Students</p>
                </div>
                <p className="font-bold text-dr-black">
                  Track student progress and attendance
                </p>
              </div>
            </ScaleIn>

            {/* Course Materials - Purple */}
            <ScaleIn delay={0.4}>
              <div className="bg-dr-purple border-4 border-dr-black p-8">
                <FileText className="h-16 w-16 text-dr-white mb-4" />
                <h3 className="font-display text-3xl text-dr-white uppercase mb-4">
                  COURSE MATERIALS
                </h3>
                <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                  <p className="font-display text-4xl text-dr-black">0</p>
                  <p className="text-sm font-bold uppercase">Uploaded Files</p>
                </div>
                <p className="font-bold text-dr-white">
                  Upload and manage course materials
                </p>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Upcoming Classes - White */}
      <section className="bg-dr-white py-16">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">
            UPCOMING CLASSES
          </h2>
          <div className="space-y-4">
            {stats?.upcomingClasses && stats.upcomingClasses.length > 0 ? (
              stats.upcomingClasses.map((classItem, idx) => (
                <ScaleIn key={classItem.id} delay={idx * 0.1}>
                  <div className="bg-dr-yellow border-4 border-dr-black p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-display text-xl text-dr-black uppercase mb-2">
                        {classItem.title}
                      </h3>
                      <p className="font-bold text-dr-black">
                        {classItem.dayOfWeek} • {classItem.startTime} - {classItem.endTime} • {classItem.room?.name || 'TBA'}
                      </p>
                    </div>
                    <div className={`px-4 py-2 border-2 border-dr-black bg-dr-${classItem.color}`}>
                      <p className="font-bold text-dr-black uppercase text-sm">
                        {classItem.studentCount} Students
                      </p>
                    </div>
                  </div>
                </ScaleIn>
              ))
            ) : (
              <div className="bg-dr-white border-4 border-dr-black p-12 text-center">
                <p className="font-display text-2xl text-dr-black uppercase">
                  NO UPCOMING CLASSES
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dr-purple border-t-4 border-dr-black">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE - TEACHER PORTAL
          </p>
        </div>
      </footer>
    </div>
  )
}
