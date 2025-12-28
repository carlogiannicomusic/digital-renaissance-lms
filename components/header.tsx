import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  title?: string
  subtitle?: string
  backLink?: string
  backText?: string
  actions?: React.ReactNode
  variant?: 'black' | 'yellow' | 'blue' | 'white'
}

export function Header({
  title,
  subtitle,
  backLink,
  backText,
  actions,
  variant = 'black',
}: HeaderProps) {
  const bgColors = {
    black: 'bg-dr-black',
    yellow: 'bg-dr-yellow',
    blue: 'bg-dr-blue',
    white: 'bg-dr-white',
  }

  const textColors = {
    black: 'text-dr-yellow',
    yellow: 'text-dr-black',
    blue: 'text-dr-white',
    white: 'text-dr-black',
  }

  const borderColors = {
    black: 'border-dr-yellow',
    yellow: 'border-dr-black',
    blue: 'border-dr-black',
    white: 'border-dr-black',
  }

  const logoSrc = variant === 'black' || variant === 'blue' ? '/logo-white.svg' : '/logo-black.svg'

  return (
    <header className={`${bgColors[variant]} border-b-4 ${borderColors[variant]}`}>
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-6">
        <div className="flex justify-between items-start mb-6">
          {/* Logo */}
          <Link href="/dashboard" className="block hover:opacity-80 transition-opacity">
            <Image
              src={logoSrc}
              alt="Digital Renaissance Institute for Creative Arts"
              width={250}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Actions (right side buttons) */}
          {actions && <div>{actions}</div>}
        </div>

        {/* Title and navigation */}
        {(title || backLink) && (
          <div>
            {backLink && (
              <Link
                href={backLink}
                className={`${textColors[variant]} hover:opacity-70 text-sm font-bold uppercase mb-2 block transition-opacity`}
              >
                ← {backText || 'BACK'}
              </Link>
            )}
            {title && (
              <>
                <h1 className={`font-display text-2xl md:text-3xl ${textColors[variant]} uppercase tracking-tight`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className={`${variant === 'black' || variant === 'blue' ? 'text-dr-white' : 'text-dr-black'} text-sm mt-2`}>
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
