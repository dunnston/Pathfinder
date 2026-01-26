import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores'
import type { UserMode } from '@/types'

interface ModeSelectorProps {
  className?: string
}

export function ModeSelector({ className = '' }: ModeSelectorProps): JSX.Element {
  const navigate = useNavigate()
  const { setMode } = useUserStore()

  const handleSelectMode = (mode: UserMode): void => {
    setMode(mode)
    navigate(mode === 'advisor' ? '/advisor' : '/consumer')
  }

  return (
    <div className={`grid md:grid-cols-2 gap-6 max-w-4xl mx-auto ${className}`}>
      {/* Consumer Mode Card */}
      <button
        type="button"
        onClick={() => handleSelectMode('consumer')}
        className="group p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left"
      >
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          I&apos;m planning for myself
        </h3>
        <p className="text-gray-500 mb-4">
          Create your personal financial profile and discover what matters most
          for your retirement journey.
        </p>
        <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
          Get Started
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </button>

      {/* Advisor Mode Card */}
      <button
        type="button"
        onClick={() => handleSelectMode('advisor')}
        className="group p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left"
      >
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          I&apos;m a financial advisor
        </h3>
        <p className="text-gray-500 mb-4">
          Manage multiple client profiles, guide discovery sessions, and generate
          comprehensive financial profiles.
        </p>
        <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
          Advisor Dashboard
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  )
}
