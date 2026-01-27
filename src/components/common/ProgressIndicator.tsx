/**
 * Progress Indicator Component
 * UX-26: Improved mobile support with responsive variants
 */

interface ProgressStep {
  id: string
  label: string
  completed: boolean
  current: boolean
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  className?: string
  variant?: 'dots' | 'bar' | 'steps'
  /** Show labels on mobile (default: false for 'steps' variant) */
  showLabelsOnMobile?: boolean
}

export function ProgressIndicator({
  steps,
  className = '',
  variant = 'dots',
  showLabelsOnMobile = false,
}: ProgressIndicatorProps): JSX.Element {
  const completedCount = steps.filter((s) => s.completed).length
  const progressPercent = (completedCount / steps.length) * 100
  const currentStepIndex = steps.findIndex((s) => s.current)
  const currentStep = steps[currentStepIndex]

  if (variant === 'bar') {
    return (
      <div className={`w-full ${className}`} role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={steps.length}>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {completedCount} of {steps.length} complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    )
  }

  if (variant === 'steps') {
    return (
      <nav className={`w-full ${className}`} aria-label="Progress steps">
        {/* Mobile: Compact view with current step indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {completedCount} completed
            </span>
          </div>
          {/* Mobile progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Current step label on mobile */}
          {currentStep && (
            <p className="text-sm text-primary font-medium text-center">
              {currentStep.label}
            </p>
          )}
          {/* Optional: Show all step dots on mobile */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step.completed
                    ? 'bg-primary'
                    : step.current
                      ? 'bg-primary ring-2 ring-primary/30'
                      : 'bg-gray-300'
                }`}
                aria-label={`${step.label} - ${step.completed ? 'completed' : step.current ? 'current' : 'not started'}`}
                aria-current={step.current ? 'step' : undefined}
                role="listitem"
              />
            ))}
          </div>
        </div>

        {/* Desktop: Full step indicator */}
        <ol className="hidden md:flex items-center">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex items-center">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 transition-colors ${
                    step.completed
                      ? 'bg-primary border-primary text-white'
                      : step.current
                        ? 'bg-white border-primary text-primary'
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}
                  aria-current={step.current ? 'step' : undefined}
                >
                  {step.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      step.completed ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
              {/* Labels - hidden on mobile by default, shown on lg and up */}
              <span
                className={`absolute -bottom-6 left-0 w-max text-xs transition-colors ${
                  showLabelsOnMobile ? '' : 'hidden lg:block'
                } ${
                  step.current ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Default: dots variant (mobile-friendly by design)
  return (
    <div
      className={`flex items-center justify-center gap-2 flex-wrap ${className}`}
      role="list"
      aria-label="Progress steps"
    >
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
            step.completed
              ? 'bg-primary'
              : step.current
                ? 'bg-primary-light ring-2 ring-primary-light/30 ring-offset-2'
                : 'bg-gray-300'
          }`}
          aria-label={`${step.label} - ${step.completed ? 'completed' : step.current ? 'current' : 'not started'}`}
          aria-current={step.current ? 'step' : undefined}
        />
      ))}
    </div>
  )
}

interface SimpleProgressProps {
  current: number
  total: number
  className?: string
}

export function SimpleProgress({
  current,
  total,
  className = '',
}: SimpleProgressProps): JSX.Element {
  const percent = Math.round((current / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">
          Question {current} of {total}
        </span>
        <span className="text-sm text-gray-400">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
