import Link from 'next/link'

interface Resource {
  id: string
  type: 'SHEET_MUSIC' | 'AUDIO' | 'VIDEO' | 'LECTURE'
  title: string
  course?: string
  uploadedAt: Date
  size?: string
}

interface LibraryWidgetProps {
  resources: Resource[]
}

function ResourceItem({ resource }: { resource: Resource }) {
  const typeConfig = {
    SHEET_MUSIC: { icon: '🎼', color: 'from-dr-yellow/10 to-dr-yellow/5', label: 'Sheet Music' },
    AUDIO: { icon: '🎵', color: 'from-dr-blue/10 to-dr-blue/5', label: 'Audio' },
    VIDEO: { icon: '🎬', color: 'from-dr-peach/10 to-dr-peach/5', label: 'Video' },
    LECTURE: { icon: '📚', color: 'from-dr-purple/10 to-dr-purple/5', label: 'Lecture' },
  }

  const config = typeConfig[resource.type]

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all group">
      {/* Icon */}
      <div className={`bg-gradient-to-br ${config.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0`}>
        {config.icon}
      </div>

      {/* Resource Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-dr-black truncate">
          {resource.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium text-gray-500">
            {config.label}
          </span>
          {resource.course && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500 truncate">
                {resource.course}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0">
        {resource.type === 'AUDIO' || resource.type === 'VIDEO' ? (
          <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-dr-green hover:text-white transition-colors flex items-center justify-center">
            <span className="text-sm">▶️</span>
          </button>
        ) : (
          <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-dr-blue hover:text-white transition-colors flex items-center justify-center">
            <span className="text-sm">📥</span>
          </button>
        )}
      </div>
    </div>
  )
}

export function LibraryWidget({ resources }: LibraryWidgetProps) {
  const recentResources = resources
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    .slice(0, 5)

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-dr-black">
          Quick Resources
        </h3>
        <Link href="/dashboard/library">
          <button className="text-sm font-semibold text-dr-blue hover:text-dr-purple transition-colors">
            View All →
          </button>
        </Link>
      </div>

      {recentResources.length === 0 ? (
        <div className="bg-gradient-to-br from-dr-purple/10 to-dr-purple/5 border border-dr-purple/20 rounded-xl p-8 text-center">
          <p className="font-semibold text-dr-black mb-1">
            No resources yet
          </p>
          <p className="text-sm text-gray-500">
            Resources from your courses will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentResources.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Quick Upload Section */}
      <div className="mt-4 bg-gradient-to-br from-dr-green/10 to-dr-green/5 border border-dr-green/20 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-dr-black mb-1">
              Submit Practice Recording
            </h4>
            <p className="text-xs text-gray-500">
              Upload audio for instructor review
            </p>
          </div>
          <button className="px-4 py-2 bg-dr-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
            📤 Upload
          </button>
        </div>
      </div>
    </section>
  )
}
