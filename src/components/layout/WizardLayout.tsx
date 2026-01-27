import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConsumerHeader } from './Header'
import { SimpleFooter } from './Footer'
import { Button } from '@/components/common'
import { SimpleProgress } from '@/components/common/ProgressIndicator'

interface WizardLayoutProps {
  children: ReactNode
  title: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  nextLabel?: string
  backLabel?: string
  showSkip?: boolean
  skipLabel?: string
  isNextDisabled?: boolean
  isLoading?: boolean
  showProgress?: boolean
  className?: string
}

export function WizardLayout({
  children,
  title,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  nextLabel = 'Continue',
  backLabel = 'Back',
  showSkip = false,
  skipLabel = 'Skip for now',
  isNextDisabled = false,
  isLoading = false,
  showProgress = true,
  className = '',
}: WizardLayoutProps): JSX.Element {
  const navigate = useNavigate()

  const handleBack = (): void => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ConsumerHeader
        title={title}
        showBack={!isFirstStep}
        onBack={handleBack}
      />

      {/* Progress bar */}
      {showProgress && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <SimpleProgress current={currentStep} total={totalSteps} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`flex-1 ${className}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>

      {/* Navigation footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Left side - Back button or skip */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button variant="ghost" onClick={handleBack}>
                {backLabel}
              </Button>
            )}
            {showSkip && onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                {skipLabel}
              </Button>
            )}
          </div>

          {/* Right side - Next button (only show when onNext is provided) */}
          {onNext && (
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              isLoading={isLoading}
            >
              {isLastStep ? 'Complete' : nextLabel}
            </Button>
          )}
        </div>
      </div>

      <SimpleFooter className="bg-white" />
    </div>
  )
}

interface WizardStepProps {
  children: ReactNode
  className?: string
}

export function WizardStep({
  children,
  className = '',
}: WizardStepProps): JSX.Element {
  return <div className={`space-y-6 ${className}`}>{children}</div>
}
