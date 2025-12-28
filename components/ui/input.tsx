import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  colorScheme?: 'yellow' | 'blue' | 'peach' | 'purple' | 'green' | 'black'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, colorScheme = 'black', ...props }, ref) => {
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
        <input
          ref={ref}
          className={`w-full px-4 py-3 border-2 ${colorClasses[colorScheme]} bg-dr-white text-dr-black placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
