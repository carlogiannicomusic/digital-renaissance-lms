import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  colorScheme?: 'yellow' | 'blue' | 'peach' | 'purple' | 'green' | 'black'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, colorScheme = 'black', ...props }, ref) => {
    const colorClasses = {
      yellow: 'border-dr-yellow focus:ring-dr-yellow',
      blue: 'border-dr-blue focus:ring-dr-blue',
      peach: 'border-dr-peach focus:ring-dr-peach',
      purple: 'border-dr-purple focus:ring-dr-purple',
      green: 'border-dr-green focus:ring-dr-green',
      black: 'border-dr-black focus:ring-dr-black',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold uppercase tracking-wide text-dr-black mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 border-2 ${colorClasses[colorScheme]} bg-dr-white text-dr-black focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
