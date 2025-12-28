import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SlideUp, ScaleIn } from '@/components/page-transition'
import { Users, Calendar, BookOpen, FileText, LogOut, ShieldCheck, AlertCircle, Clock, MapPin } from 'lucide-react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { handleLogout } from './actions'

async function getStats() {
  try {
    const [
      totalUsers,
      pendingUsers,
      activeUsers,
      studentCount,
      teacherCount,
      totalCourses,
      totalClasses,
      totalRooms,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.course.count(),
      prisma.class.count(),
      prisma.room.count(),
    ])

    return {
      totalUsers,
      pendingUsers,
      activeUsers,
      studentCount,
      teacherCount,
      totalCourses,
      totalClasses,
      totalRooms,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return null
  }
}

async function getTodaySchedule() {
  try {
    const now = new Date()
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

    const todayClasses = await prisma.class.findMany({
      where: {
        dayOfWeek: today as any,
      },
      include: {
        room: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    })

    return todayClasses
  } catch (error) {
    console.error('Error fetching today schedule:', error)
    return []
  }
}

async function getWeekSchedule() {
  try {
    const weekClasses = await prisma.class.findMany({
      include: {
        room: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return weekClasses
  } catch (error) {
    console.error('Error fetching week schedule:', error)
    return []
  }
}

export default async function AdminDashboard() {
  // Mock session for demo - auth disabled
  const session = {
    user: {
      id: '1',
      email: 'admin@digitalrenaissance.com',
      name: 'Administrator',
      role: 'ADMINISTRATOR'
    }
  }

  const [stats, todaySchedule, weekSchedule] = await Promise.all([
    getStats(),
    getTodaySchedule(),
    getWeekSchedule(),
  ])

  return (
    <div className="min-h-screen bg-dr-white">
      {/* Header - Black */}
      <header className="bg-dr-black border-b-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
          <div className="flex justify-between items-start mb-6">
            {/* Logo */}
            <Link href="/dashboard" className="block hover:opacity-80 transition-opacity">
              <Image
                src="/logo-white.svg"
                alt="Digital Renaissance Institute for Creative Arts"
                width={250}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </Link>

            {/* Logout */}
            <form action={handleLogout}>
              <Button variant="yellow" size="lg">
                <LogOut className="h-5 w-5 mr-2" />
                LOGOUT
              </Button>
            </form>
          </div>

          {/* Title */}
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-dr-yellow" />
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-dr-yellow uppercase tracking-tight">
                ADMINISTRATOR PORTAL
              </h1>
              <p className="text-dr-white text-sm font-bold">
                Welcome, {session.user.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Pending Registrations Alert */}
      {stats && stats.pendingUsers > 0 && (
        <div className="bg-dr-peach border-b-4 border-dr-black">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-4">
            <Link href="/admin/users/pending">
              <div className="flex items-center justify-between hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-dr-black" />
                  <p className="font-display text-lg text-dr-black uppercase">
                    {stats.pendingUsers} NEW REGISTRATION{stats.pendingUsers !== 1 ? 'S' : ''} AWAITING APPROVAL
                  </p>
                </div>
                <Button variant="black" size="sm">
                  REVIEW NOW →
                </Button>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Overview - Yellow */}
      <SlideUp>
        <section className="bg-dr-yellow border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <h2 className="font-display text-3xl text-dr-black mb-6 uppercase">
              SYSTEM OVERVIEW
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <ScaleIn delay={0.1}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-4xl text-dr-black mb-2">
                    {stats?.totalUsers || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    TOTAL USERS
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.2}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-4xl text-dr-peach mb-2">
                    {stats?.pendingUsers || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    PENDING APPROVALS
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.3}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-4xl text-dr-black mb-2">
                    {stats?.totalCourses || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    COURSES
                  </p>
                </div>
              </ScaleIn>
              <ScaleIn delay={0.4}>
                <div className="bg-dr-white border-4 border-dr-black p-6">
                  <p className="font-display text-4xl text-dr-black mb-2">
                    {stats?.totalClasses || 0}
                  </p>
                  <p className="font-bold text-dr-black uppercase text-sm">
                    SCHEDULED CLASSES
                  </p>
                </div>
              </ScaleIn>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Weekly Calendar - Green */}
      <SlideUp delay={0.1}>
        <section className="bg-dr-green border-b-4 border-dr-black py-12">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-3xl text-dr-black uppercase">
                THIS WEEK'S CALENDAR
              </h2>
              <Link href="/admin/calendar">
                <Button variant="yellow">
                  VIEW FULL CALENDAR
                </Button>
              </Link>
            </div>

            {/* Compact Weekly Calendar Grid */}
            <div className="bg-dr-white border-4 border-dr-black overflow-hidden">
              <div className="grid grid-cols-7">
                {/* Header Row - Days */}
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="bg-dr-black border-r-4 border-dr-black last:border-r-0 p-3 text-center">
                    <span className="font-display text-sm text-dr-yellow uppercase">{day}</span>
                  </div>
                ))}

                {/* Calendar Body - Time Slots */}
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, dayIdx) => {
                  const dayClasses = weekSchedule.filter(c => c.dayOfWeek === day.toUpperCase() + 'DAY')
                  return (
                    <div
                      key={day}
                      className="border-r-4 border-dr-black last:border-r-0 min-h-[200px] p-2 bg-dr-white"
                    >
                      {dayClasses.length > 0 ? (
                        <div className="space-y-2">
                          {dayClasses.slice(0, 3).map((classItem) => (
                            <div
                              key={classItem.id}
                              className="bg-dr-yellow border-2 border-dr-black p-2 text-xs"
                            >
                              <div className="font-display uppercase text-dr-black mb-1 leading-tight">
                                {classItem.title}
                              </div>
                              <div className="font-bold text-dr-black flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{classItem.startTime}</span>
                              </div>
                              <div className="font-bold text-dr-black flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{classItem.room?.name}</span>
                              </div>
                            </div>
                          ))}
                          {dayClasses.length > 3 && (
                            <div className="text-center text-xs font-bold text-dr-black">
                              +{dayClasses.length - 3} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          No classes
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Quick Actions Grid - 2x2 */}
      <section className="py-16">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16">
          <h2 className="font-display text-3xl text-dr-black mb-8 uppercase">
            ADMINISTRATOR TOOLS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* User Management - Blue */}
            <ScaleIn delay={0.1}>
              <div className="bg-dr-blue border-4 border-dr-black p-8">
                <Users className="h-16 w-16 text-dr-black mb-4" />
                <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                  USER MANAGEMENT
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-dr-white border-2 border-dr-black p-3">
                    <p className="font-display text-2xl text-dr-black">
                      {stats?.studentCount || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Students</p>
                  </div>
                  <div className="bg-dr-white border-2 border-dr-black p-3">
                    <p className="font-display text-2xl text-dr-black">
                      {stats?.teacherCount || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Teachers</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Link href="/admin/users/invite">
                    <Button variant="green" className="w-full">
                      SEND INVITE
                    </Button>
                  </Link>
                  <Link href="/admin/users/new">
                    <Button variant="yellow" className="w-full">
                      CREATE USER
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="black" className="w-full">
                      VIEW ALL
                    </Button>
                  </Link>
                </div>
              </div>
            </ScaleIn>

            {/* Calendar - Purple */}
            <ScaleIn delay={0.2}>
              <div className="bg-dr-purple border-4 border-dr-black p-8">
                <Calendar className="h-16 w-16 text-dr-black mb-4" />
                <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                  MASTER CALENDAR
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-dr-white border-2 border-dr-black p-3">
                    <p className="font-display text-2xl text-dr-black">
                      {stats?.totalClasses || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Classes</p>
                  </div>
                  <div className="bg-dr-white border-2 border-dr-black p-3">
                    <p className="font-display text-2xl text-dr-black">
                      {stats?.totalRooms || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Rooms</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/admin/schedule/new" className="flex-1">
                    <Button variant="yellow" className="w-full">
                      SCHEDULE CLASS
                    </Button>
                  </Link>
                  <Link href="/admin/calendar" className="flex-1">
                    <Button variant="black" className="w-full">
                      VIEW CALENDAR
                    </Button>
                  </Link>
                </div>
              </div>
            </ScaleIn>

            {/* Courses - Peach */}
            <Link href="/courses">
              <ScaleIn delay={0.3}>
                <div className="bg-dr-peach border-4 border-dr-black p-8 hover:scale-105 transition-transform cursor-pointer">
                  <BookOpen className="h-16 w-16 text-dr-black mb-4" />
                  <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                    COURSE MANAGEMENT
                  </h3>
                  <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                    <p className="font-display text-3xl text-dr-black">
                      {stats?.totalCourses || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Total Courses</p>
                  </div>
                  <p className="font-bold text-dr-black">
                    View and manage all courses, teachers, enrollments →
                  </p>
                </div>
              </ScaleIn>
            </Link>

            {/* Reports - Green */}
            <Link href="/admin/reports">
              <ScaleIn delay={0.4}>
                <div className="bg-dr-green border-4 border-dr-black p-8 hover:scale-105 transition-transform cursor-pointer">
                  <FileText className="h-16 w-16 text-dr-black mb-4" />
                  <h3 className="font-display text-3xl text-dr-black uppercase mb-4">
                    REPORTS & ANALYTICS
                  </h3>
                  <div className="bg-dr-white border-2 border-dr-black p-4 mb-6">
                    <p className="font-display text-2xl text-dr-black">
                      {stats?.activeUsers || 0}
                    </p>
                    <p className="text-xs font-bold uppercase">Active Users</p>
                  </div>
                  <p className="font-bold text-dr-black">
                    View analytics, generate reports, track metrics →
                  </p>
                </div>
              </ScaleIn>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dr-black border-t-4 border-dr-yellow">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-8">
          <p className="font-display text-sm text-dr-white uppercase text-center">
            © 2024 DIGITAL RENAISSANCE INSTITUTE - ADMINISTRATOR PORTAL
          </p>
        </div>
      </footer>
    </div>
  )
}
