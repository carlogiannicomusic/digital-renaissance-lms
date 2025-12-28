interface StatCardProps {
  title: string
  value: number | string
  description?: string
  color: 'yellow' | 'blue' | 'peach' | 'purple' | 'green'
}

export function StatCard({ title, value, description, color }: StatCardProps) {
  const bgColors = {
    yellow: 'bg-dr-yellow',
    blue: 'bg-dr-blue',
    peach: 'bg-dr-peach',
    purple: 'bg-dr-purple',
    green: 'bg-dr-green',
  }

  return (
    <div className={`${bgColors[color]} p-8`}>
      <h3 className="text-sm font-bold uppercase tracking-wide text-dr-black mb-2">
        {title}
      </h3>
      <p className="text-5xl font-display text-dr-black mb-2">
        {value}
      </p>
      {description && (
        <p className="text-sm font-semibold text-dr-black opacity-80">
          {description}
        </p>
      )}
    </div>
  )
}
