import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroSectionProps {
  userName: string
  lastCourse?: {
    id: string
    title: string
    thumbnail: string
    progress: number
  }
}

export function HeroSection({ userName, lastCourse }: HeroSectionProps) {
  if (!lastCourse) {
    return (
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-dr-black mb-3">
          Welcome, {userName}
        </h1>
        <p className="text-gray-600 mb-6">
          Ready to start your musical journey?
        </p>
        <Link href="/courses">
          <Button variant="black" size="lg">
            Browse Courses
          </Button>
        </Link>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="grid md:grid-cols-5 gap-8 items-center">
        {/* Left: Welcome Text */}
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-dr-black mb-3">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-600 mb-1">
            Continue where you left off
          </p>
          <p className="text-sm text-gray-500">
            Keep up the great work on your musical journey
          </p>
        </div>

        {/* Right: Last Accessed Course Card */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-start gap-5 mb-5">
            {/* Course Thumbnail */}
            <div className="w-20 h-20 bg-gradient-to-br from-dr-purple to-dr-blue rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-sm">
              {lastCourse.thumbnail}
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Continue Learning
              </p>
              <h3 className="font-semibold text-lg text-dr-black mb-3 line-clamp-2">
                {lastCourse.title}
              </h3>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-dr-purple">
                    {lastCourse.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-dr-purple to-dr-blue rounded-full transition-all"
                    style={{ width: `${lastCourse.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Button */}
          <Link href={`/dashboard/courses/${lastCourse.id}`}>
            <button className="w-full bg-dr-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors">
              Resume Learning →
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
