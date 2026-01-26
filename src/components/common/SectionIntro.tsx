import type { ReactNode } from 'react'

interface SectionIntroProps {
  title: string
  description: string
  icon?: ReactNode
  estimatedTime?: string
  className?: string
}

export function SectionIntro({
  title,
  description,
  icon,
  estimatedTime,
  className = '',
}: SectionIntroProps): JSX.Element {
  return (
    <div className={`text-center max-w-2xl mx-auto py-8 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-light/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      )}

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
        {title}
      </h2>

      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>

      {estimatedTime && (
        <p className="mt-4 text-sm text-gray-400 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          About {estimatedTime}
        </p>
      )}
    </div>
  )
}
