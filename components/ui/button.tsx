import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'blue' | 'peach' | 'purple' | 'green' | 'black' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'yellow', size = 'md', ...props }, ref) => {
    const baseStyles = 'font-bold uppercase tracking-tight transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95'

    // Digital Renaissance monochromatic approach
    const variants = {
      yellow: 'bg-dr-yellow text-dr-black hover:opacity-90',
      blue: 'bg-dr-blue text-dr-black hover:opacity-90',
      peach: 'bg-dr-peach text-dr-black hover:opacity-90',
      purple: 'bg-dr-purple text-dr-black hover:opacity-90',
      green: 'bg-dr-green text-dr-black hover:opacity-90',
      black: 'bg-dr-black text-dr-white hover:opacity-90',
      white: 'bg-dr-white text-dr-black border-2 border-dr-black hover:bg-dr-black hover:text-dr-white',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
