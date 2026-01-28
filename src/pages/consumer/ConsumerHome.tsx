import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '@/stores/profileStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { Button, Modal, ModalFooter } from '@/components/common'
import { WelcomeModal } from '@/components/layout'
import type { ProfileSection, PartialFinancialProfile } from '@/types'

// Section definitions with routes
const SECTIONS: { key: ProfileSection; label: string; route: string }[] = [
  { key: 'basicContext', label: 'Basic Context', route: '/consumer/discovery/basic-context' },
  { key: 'retirementVision', label: 'Retirement Vision', route: '/consumer/discovery/retirement-vision' },
  { key: 'planningPreferences', label: 'Planning Preferences', route: '/consumer/discovery/planning-preferences' },
  { key: 'riskComfort', label: 'Risk & Income Comfort', route: '/consumer/discovery/risk-comfort' },
  { key: 'financialSnapshot', label: 'Financial Snapshot', route: '/consumer/discovery/financial-snapshot' },
]

/**
 * Check if a date value is valid (not undefined, not an Invalid Date)
 */
function isValidDate(date: unknown): boolean {
  if (!date) return false
  if (date instanceof Date) {
    return !isNaN(date.getTime())
  }
  // Handle string dates
  if (typeof date === 'string') {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }
  return false
}

function isSectionComplete(profile: PartialFinancialProfile | null, section: ProfileSection): boolean {
  if (!profile) return false
  const data = profile[section]
  if (!data) return false

  // Check if section has meaningful data based on actual type fields
  switch (section) {
    case 'basicContext':
      // Must have a valid birthDate (not undefined, not an Invalid Date)
      return Boolean(data && 'birthDate' in data && isValidDate(data.birthDate))
    case 'retirementVision':
      return Boolean(data && 'targetRetirementAge' in data && data.targetRetirementAge)
    case 'planningPreferences':
      return Boolean(data && 'complexityTolerance' in data && data.complexityTolerance)
    case 'riskComfort':
      return Boolean(data && 'investmentRiskTolerance' in data && data.investmentRiskTolerance)
    case 'financialSnapshot':
      // FinancialSnapshot uses arrays - check if any have data
      return Boolean(
        data &&
        (('incomeSourcesCurrent' in data && Array.isArray(data.incomeSourcesCurrent) && data.incomeSourcesCurrent.length > 0) ||
         ('investmentAccounts' in data && Array.isArray(data.investmentAccounts) && data.investmentAccounts.length > 0))
      )
    default:
      return false
  }
}

export function ConsumerHome() {
  const navigate = useNavigate()
  const { currentProfile, clearProfile } = useProfileStore()
  const { alerts } = useDashboardStore()
  const [showClearModal, setShowClearModal] = useState(false)

  // Count active (non-acknowledged) alerts
  const activeAlertCount = useMemo(() => {
    return alerts.filter(a => !a.acknowledgedAt && !a.completedAt).length
  }, [alerts])

  // Calculate progress with useMemo for proper dependency tracking (UX-14)
  const { completedSections, progressPercent, hasProgress } = useMemo(() => {
    const completed = SECTIONS.filter(s => isSectionComplete(currentProfile, s.key))
    const percent = Math.round((completed.length / SECTIONS.length) * 100)
    return {
      completedSections: completed,
      progressPercent: percent,
      hasProgress: currentProfile !== null && completed.length > 0
    }
  }, [currentProfile])

  // Find first incomplete section for resume
  const firstIncomplete = SECTIONS.find(s => !isSectionComplete(currentProfile, s.key))
  const resumeRoute = firstIncomplete?.route ?? '/consumer/profile'

  const handleStartFresh = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    clearProfile()
    setShowClearModal(false)
  }

  const handleWelcomeComplete = () => {
    // Auto-navigate to start discovery after welcome
    navigate('/consumer/discovery/basic-context')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome modal for first-time users */}
      <WelcomeModal onComplete={handleWelcomeComplete} />
      {/* SEC-26: Accessibility banner landmark */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Pathfinder</h1>
          <nav aria-label="Mode navigation">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Switch Mode
            </button>
          </nav>
        </div>
      </header>
      {/* SEC-26: Accessibility main landmark */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="main" aria-labelledby="welcome-heading">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 id="welcome-heading" className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Financial Journey</h2>
          <p className="text-gray-600 mb-6">
            Let's start by building your Financial Decision Profile. This helps us understand your
            situation, goals, and preferences so we can guide you through important decisions.
          </p>

          {/* Progress Section */}
          {hasProgress && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Progress</span>
                <span className="text-sm text-gray-500">{progressPercent}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SECTIONS.map((section) => {
                  const isComplete = isSectionComplete(currentProfile, section.key)
                  return (
                    <div
                      key={section.key}
                      className={`text-xs p-2 rounded text-center ${
                        isComplete
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isComplete ? '✓ ' : ''}{section.label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {hasProgress ? (
              <>
                <Button
                  onClick={() => navigate(resumeRoute)}
                  variant="primary"
                  size="lg"
                >
                  {progressPercent === 100 ? 'View Profile Summary' : 'Continue Discovery'}
                </Button>
                <Button
                  onClick={handleStartFresh}
                  variant="secondary"
                  size="lg"
                >
                  Start Fresh
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/consumer/discovery/basic-context')}
                variant="primary"
                size="lg"
              >
                Start Discovery
              </Button>
            )}
          </div>

          {/* View Profile Link */}
          {progressPercent === 100 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Your profile is complete! You can view your summary or make changes to any section.
              </p>
              <button
                onClick={() => navigate('/consumer/profile')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Full Profile Summary →
              </button>
            </div>
          )}

          {/* Dashboard Card - shown when profile has progress */}
          {hasProgress && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Financial Dashboard</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Track recommendations, manage your investment policy, and monitor your progress.
                    </p>
                    {activeAlertCount > 0 && (
                      <p className="text-sm text-yellow-700 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {activeAlertCount} alert{activeAlertCount !== 1 ? 's' : ''} need{activeAlertCount === 1 ? 's' : ''} attention
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/consumer/dashboard')}
                  variant="primary"
                >
                  Open Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clear Progress Confirmation Modal (UX-23) */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Start Fresh?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700">
                This will permanently delete all your current progress and cannot be undone.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You have completed {completedSections.length} of {SECTIONS.length} sections.
              </p>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmClear} className="bg-red-600 hover:bg-red-700">
            Yes, Start Fresh
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
