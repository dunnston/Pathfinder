import { Link } from 'react-router-dom'
import { useUserStore } from '@/stores'

interface HeaderProps {
  showModeSwitch?: boolean
  className?: string
}

export function Header({
  showModeSwitch = false,
  className = '',
}: HeaderProps): JSX.Element {
  const { mode } = useUserStore()
  const isAdvisor = mode === 'advisor'

  return (
    <header
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to={isAdvisor ? '/advisor' : '/consumer'}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Pathfinder
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Mode indicator */}
            {isAdvisor && (
              <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Advisor Mode
              </span>
            )}

            {/* Mode switch link */}
            {showModeSwitch && (
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Switch Mode
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

interface ConsumerHeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  className?: string
}

export function ConsumerHeader({
  title,
  showBack = false,
  onBack,
  className = '',
}: ConsumerHeaderProps): JSX.Element {
  return (
    <header
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Logo (small) */}
          <Link to="/consumer" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

interface AdvisorHeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function AdvisorHeader({
  title,
  subtitle,
  actions,
  className = '',
}: AdvisorHeaderProps): JSX.Element {
  return (
    <header
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  )
}
