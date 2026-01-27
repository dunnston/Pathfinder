import { memo, type ReactNode } from 'react'

interface QuestionCardProps {
  question: string
  helperText?: string
  whyItMatters?: string
  children: ReactNode
  className?: string
}

// SEC-10: Memoize to prevent unnecessary re-renders
export const QuestionCard = memo(function QuestionCard({
  question,
  helperText,
  whyItMatters,
  children,
  className = '',
}: QuestionCardProps): JSX.Element {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 ${className}`}
    >
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed">
          {question}
        </h3>
        {helperText && (
          <p className="mt-2 text-gray-500">
            {helperText}
          </p>
        )}
      </div>

      <div className="mb-6">{children}</div>

      {whyItMatters && (
        <div className="pt-4 border-t border-gray-100">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-90"
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
              Why this matters
            </summary>
            <p className="mt-2 ml-6 text-sm text-gray-600">
              {whyItMatters}
            </p>
          </details>
        </div>
      )}
    </div>
  )
})
