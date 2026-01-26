/**
 * Discovery Section Page
 * Renders the appropriate discovery section based on URL param
 */

import { useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useProfileStore, useUserStore } from '@/stores'
import { WizardLayout } from '@/components/layout'
import { BasicContextForm } from '@/components/discovery'
import { DISCOVERY_SECTIONS } from '@/types'
import type { ProfileSection, BasicContext } from '@/types'

// Map URL slugs to section IDs
const SLUG_TO_SECTION: Record<string, ProfileSection> = {
  'basic-context': 'basicContext',
  'retirement-vision': 'retirementVision',
  'planning-preferences': 'planningPreferences',
  'risk-comfort': 'riskComfort',
  'financial-snapshot': 'financialSnapshot',
}

// Map section IDs to URL slugs
const SECTION_TO_SLUG: Record<ProfileSection, string> = {
  basicContext: 'basic-context',
  retirementVision: 'retirement-vision',
  planningPreferences: 'planning-preferences',
  riskComfort: 'risk-comfort',
  financialSnapshot: 'financial-snapshot',
}

export function DiscoverySection(): JSX.Element {
  const { section: sectionSlug } = useParams<{ section: string }>()
  const navigate = useNavigate()
  const { currentProfile, updateSection, initializeProfile } = useProfileStore()
  const { currentUser } = useUserStore()

  // Initialize profile if needed
  useEffect(() => {
    if (!currentProfile && currentUser) {
      initializeProfile(currentUser.id)
    }
  }, [currentProfile, currentUser, initializeProfile])

  // Validate section slug
  if (!sectionSlug || !SLUG_TO_SECTION[sectionSlug]) {
    return <Navigate to="/consumer/discovery" replace />
  }

  const currentSectionId = SLUG_TO_SECTION[sectionSlug]
  const currentSection = DISCOVERY_SECTIONS.find((s) => s.id === currentSectionId)
  const currentIndex = DISCOVERY_SECTIONS.findIndex((s) => s.id === currentSectionId)
  const isFirstSection = currentIndex === 0
  const isLastSection = currentIndex === DISCOVERY_SECTIONS.length - 1

  if (!currentSection) {
    return <Navigate to="/consumer/discovery" replace />
  }

  const handleNext = (): void => {
    if (isLastSection) {
      navigate('/consumer/profile')
    } else {
      const nextSection = DISCOVERY_SECTIONS[currentIndex + 1]
      navigate(`/consumer/discovery/${SECTION_TO_SLUG[nextSection.id]}`)
    }
  }

  const handlePrevious = (): void => {
    if (!isFirstSection) {
      const prevSection = DISCOVERY_SECTIONS[currentIndex - 1]
      navigate(`/consumer/discovery/${SECTION_TO_SLUG[prevSection.id]}`)
    }
  }

  const handleSaveAndExit = (): void => {
    navigate('/consumer')
  }

  // Handle section-specific form saves
  const handleBasicContextSave = (data: BasicContext): void => {
    updateSection('basicContext', data)
    handleNext()
  }

  const handleBasicContextAutoSave = (data: Partial<BasicContext>): void => {
    updateSection('basicContext', data)
  }

  // Render section-specific form
  const renderSectionContent = (): JSX.Element => {
    switch (currentSectionId) {
      case 'basicContext':
        return (
          <BasicContextForm
            initialData={currentProfile?.basicContext}
            onSave={handleBasicContextSave}
            onAutoSave={handleBasicContextAutoSave}
            isAdvisorMode={false}
          />
        )

      // Placeholder for other sections
      case 'retirementVision':
      case 'planningPreferences':
      case 'riskComfort':
      case 'financialSnapshot':
        return (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {currentSection.title} Form
            </p>
            <p className="mt-2 text-sm text-gray-400">
              This form will be implemented in a later phase.
              For now, you can navigate through sections to test the flow.
            </p>
          </div>
        )

      default:
        return <div>Unknown section</div>
    }
  }

  return (
    <WizardLayout
      title={currentSection.title}
      currentStep={currentIndex + 1}
      totalSteps={DISCOVERY_SECTIONS.length}
      onBack={isFirstSection ? undefined : handlePrevious}
      onNext={currentSectionId === 'basicContext' ? undefined : handleNext}
      onSkip={handleSaveAndExit}
      nextLabel={isLastSection ? 'Complete' : 'Continue'}
      showSkip={true}
      skipLabel="Save & Exit"
      isNextDisabled={false}
    >
      <div className="space-y-6">
        {/* Section intro */}
        <div className="text-center mb-8">
          <p className="text-gray-600">{currentSection.description}</p>
          <p className="text-sm text-gray-400 mt-1">
            Estimated time: {currentSection.estimatedMinutes} minutes
          </p>
        </div>

        {/* Section form */}
        {renderSectionContent()}
      </div>
    </WizardLayout>
  )
}
