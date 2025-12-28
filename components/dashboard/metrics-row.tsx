interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  color: 'blue' | 'peach' | 'purple' | 'green'
}

function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const accentColors = {
    blue: 'from-dr-blue/10 to-dr-blue/5 border-dr-blue/20',
    peach: 'from-dr-peach/10 to-dr-peach/5 border-dr-peach/20',
    purple: 'from-dr-purple/10 to-dr-purple/5 border-dr-purple/20',
    green: 'from-dr-green/10 to-dr-green/5 border-dr-green/20',
  }

  const iconBgColors = {
    blue: 'bg-dr-blue/10',
    peach: 'bg-dr-peach/10',
    purple: 'bg-dr-purple/10',
    green: 'bg-dr-green/10',
  }

  return (
    <div className={`bg-gradient-to-br ${accentColors[color]} border rounded-2xl p-6 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-3">
            {title}
          </h3>
          <p className="text-4xl font-semibold text-dr-black mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm font-medium text-gray-500 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`${iconBgColors[color]} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

interface MetricsRowProps {
  practiceStreak: number
  totalHours: number
  assignmentsDue: number
  coursesEnrolled: number
}

export function MetricsRow({
  practiceStreak,
  totalHours,
  assignmentsDue,
  coursesEnrolled,
}: MetricsRowProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-dr-black mb-6">
        Your Progress
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Practice Streak"
          value={practiceStreak}
          subtitle={practiceStreak === 1 ? 'day in a row' : 'days in a row'}
          icon="🔥"
          color="peach"
        />
        <MetricCard
          title="Practice Hours"
          value={totalHours}
          subtitle="This month"
          icon="⏱️"
          color="blue"
        />
        <MetricCard
          title="Assignments Due"
          value={assignmentsDue}
          subtitle={assignmentsDue === 0 ? 'All caught up!' : 'Pending'}
          icon="📝"
          color="purple"
        />
        <MetricCard
          title="Courses Enrolled"
          value={coursesEnrolled}
          subtitle="Active learning"
          icon="📚"
          color="green"
        />
      </div>
    </section>
  )
}
