import Link from 'next/link'

interface Event {
  id: string
  type: 'LESSON' | 'MASTERCLASS' | 'PRACTICE'
  title: string
  dateTime: Date
  instructor?: string
  location?: string
  canJoin?: boolean
}

interface ScheduleWidgetProps {
  events: Event[]
}

function EventCard({ event }: { event: Event }) {
  const now = new Date()
  const eventDate = new Date(event.dateTime)
  const minutesUntil = Math.floor((eventDate.getTime() - now.getTime()) / 60000)
  const canJoinSoon = minutesUntil <= 5 && minutesUntil >= -5

  const typeConfig = {
    LESSON: { color: 'from-dr-blue/10 to-dr-blue/5', icon: '👨‍🏫', label: 'Lesson' },
    MASTERCLASS: { color: 'from-dr-purple/10 to-dr-purple/5', icon: '🎼', label: 'Masterclass' },
    PRACTICE: { color: 'from-dr-green/10 to-dr-green/5', icon: '🎵', label: 'Practice' },
  }

  const config = typeConfig[event.type]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Icon & Type Badge */}
        <div className={`bg-gradient-to-br ${config.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0`}>
          {config.icon}
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {config.label}
              </p>
              <h4 className="font-semibold text-sm text-dr-black">{event.title}</h4>
            </div>
            {canJoinSoon && event.canJoin && (
              <span className="bg-dr-peach/20 text-dr-peach text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                Live Soon
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <p className="text-xs font-medium text-gray-500">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })} at {eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            {event.instructor && (
              <p className="text-xs font-medium text-gray-500">
                {event.instructor}
              </p>
            )}
            {event.location && (
              <p className="text-xs font-medium text-gray-500">
                📍 {event.location}
              </p>
            )}
          </div>

          {/* Join Button */}
          {canJoinSoon && event.canJoin ? (
            <button className="w-full bg-dr-green text-white font-semibold py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
              Join Now →
            </button>
          ) : minutesUntil > 0 ? (
            <p className="text-xs font-semibold text-dr-purple">
              Starts in {minutesUntil < 60 ? `${minutesUntil}m` : `${Math.floor(minutesUntil / 60)}h`}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function ScheduleWidget({ events }: ScheduleWidgetProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.dateTime) > new Date()
  ).slice(0, 5)

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-dr-black">
          Upcoming Schedule
        </h3>
        <Link href="/dashboard/schedule">
          <button className="text-sm font-semibold text-dr-blue hover:text-dr-purple transition-colors">
            View All →
          </button>
        </Link>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="bg-gradient-to-br from-dr-peach/10 to-dr-peach/5 border border-dr-peach/20 rounded-xl p-8 text-center">
          <p className="font-semibold text-dr-black mb-1">
            No upcoming events
          </p>
          <p className="text-sm text-gray-500">
            Check back later for new lessons
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
