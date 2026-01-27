import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '@/stores/profileStore'
import { Button } from '@/components/common'
import type { ProfileSection } from '@/types'

// Section definitions with routes
const SECTIONS: { key: ProfileSection; label: string; route: string }[] = [
  { key: 'basicContext', label: 'Basic Context', route: '/consumer/discovery/basic-context' },
  { key: 'retirementVision', label: 'Retirement Vision', route: '/consumer/discovery/retirement-vision' },
  { key: 'planningPreferences', label: 'Planning Preferences', route: '/consumer/discovery/planning-preferences' },
  { key: 'riskComfort', label: 'Risk & Income Comfort', route: '/consumer/discovery/risk-comfort' },
  { key: 'financialSnapshot', label: 'Financial Snapshot', route: '/consumer/discovery/financial-snapshot' },
]

function isSectionComplete(profile: ReturnType<typeof useProfileStore>['currentProfile'], section: ProfileSection): boolean {
  if (!profile) return false
  const data = profile[section]
  if (!data) return false

  // Check if section has meaningful data based on actual type fields
  switch (section) {
    case 'basicContext':
      return Boolean(data && 'birthDate' in data && data.birthDate)
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

  // Calculate progress
  const completedSections = SECTIONS.filter(s => isSectionComplete(currentProfile, s.key))
  const progressPercent = Math.round((completedSections.length / SECTIONS.length) * 100)
  const hasProgress = currentProfile && completedSections.length > 0

  // Find first incomplete section for resume
  const firstIncomplete = SECTIONS.find(s => !isSectionComplete(currentProfile, s.key))
  const resumeRoute = firstIncomplete?.route ?? '/consumer/profile-summary'

  const handleStartFresh = () => {
    if (confirm('This will clear your current progress. Are you sure?')) {
      clearProfile()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Pathfinder</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Switch Mode
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Financial Journey</h2>
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
                onClick={() => navigate('/consumer/profile-summary')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Full Profile Summary →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
