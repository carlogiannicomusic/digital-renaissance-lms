import Link from 'next/link'

interface Course {
  id: string
  title: string
  instructor: string
  progress: number
  thumbnail: string
  nextLesson?: string
}

interface CoursesGridProps {
  courses: Course[]
}

function CourseCard({ course }: { course: Course }) {
  const colors = ['yellow', 'blue', 'peach', 'purple', 'green'] as const
  const colorIndex = parseInt(course.id.slice(-1), 16) % colors.length
  const color = colors[colorIndex]

  const gradients = {
    yellow: 'from-dr-yellow to-amber-300',
    blue: 'from-dr-blue to-cyan-300',
    peach: 'from-dr-peach to-orange-300',
    purple: 'from-dr-purple to-pink-300',
    green: 'from-dr-green to-emerald-300',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
      {/* Course Thumbnail */}
      <div className={`bg-gradient-to-br ${gradients[color]} h-40 flex items-center justify-center text-5xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors" />
        <span className="relative">{course.thumbnail}</span>
      </div>

      {/* Course Details */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-dr-black mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm font-medium text-gray-500 mb-4">
          {course.instructor}
        </p>

        {/* Next Lesson */}
        {course.nextLesson && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Up Next
            </p>
            <p className="text-sm font-medium text-dr-black">
              {course.nextLesson}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="mt-auto mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">
              Progress
            </span>
            <span className="text-sm font-semibold text-dr-purple">
              {course.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dr-purple to-dr-blue rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <Link href={`/dashboard/courses/${course.id}`}>
          <button className="w-full bg-dr-black text-white font-semibold py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-sm">
            Continue Course →
          </button>
        </Link>
      </div>
    </div>
  )
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dr-black mb-6">
          My Courses
        </h2>
        <div className="bg-gradient-to-br from-dr-yellow/10 to-dr-yellow/5 border border-dr-yellow/20 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-dr-yellow/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            📚
          </div>
          <p className="text-xl font-semibold text-dr-black mb-2">
            No courses yet
          </p>
          <p className="text-gray-600 mb-6">
            Start your musical journey by enrolling in a course
          </p>
          <Link href="/courses">
            <button className="px-6 py-3 bg-dr-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
              Browse Courses
            </button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-dr-black">
          My Courses
        </h2>
        <Link href="/courses">
          <button className="text-sm font-semibold text-dr-blue hover:text-dr-purple transition-colors">
            Browse All →
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}
