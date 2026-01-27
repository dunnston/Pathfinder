/**
 * Discovery Section Page
 * Renders the appropriate discovery section based on URL param
 */

import { useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useProfileStore } from '@/stores'
import { WizardLayout } from '@/components/layout'
import { BasicContextForm, RetirementVisionForm, PlanningPreferencesForm, RiskComfortForm, FinancialSnapshotForm } from '@/components/discovery'
import { DISCOVERY_SECTIONS } from '@/types'
import type { ProfileSection, BasicContext, RetirementVision, PlanningPreferences, RiskComfort, FinancialSnapshot } from '@/types'

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

  // Initialize profile if needed (consumer mode uses a default user ID)
  useEffect(() => {
    if (!currentProfile) {
      initializeProfile('consumer')
    }
  }, [currentProfile, initializeProfile])

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

  const handleRetirementVisionSave = (data: RetirementVision): void => {
    updateSection('retirementVision', data)
    handleNext()
  }

  const handleRetirementVisionAutoSave = (data: Partial<RetirementVision>): void => {
    updateSection('retirementVision', data)
  }

  const handlePlanningPreferencesSave = (data: PlanningPreferences): void => {
    updateSection('planningPreferences', data)
    handleNext()
  }

  const handlePlanningPreferencesAutoSave = (data: Partial<PlanningPreferences>): void => {
    updateSection('planningPreferences', data)
  }

  const handleRiskComfortSave = (data: RiskComfort): void => {
    updateSection('riskComfort', data)
    handleNext()
  }

  const handleRiskComfortAutoSave = (data: Partial<RiskComfort>): void => {
    updateSection('riskComfort', data)
  }

  const handleFinancialSnapshotSave = (data: FinancialSnapshot): void => {
    updateSection('financialSnapshot', data)
    handleNext()
  }

  const handleFinancialSnapshotAutoSave = (data: Partial<FinancialSnapshot>): void => {
    updateSection('financialSnapshot', data)
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

      case 'retirementVision':
        return (
          <RetirementVisionForm
            initialData={currentProfile?.retirementVision}
            onSave={handleRetirementVisionSave}
            onAutoSave={handleRetirementVisionAutoSave}
            isAdvisorMode={false}
          />
        )

      case 'planningPreferences':
        return (
          <PlanningPreferencesForm
            initialData={currentProfile?.planningPreferences}
            onSave={handlePlanningPreferencesSave}
            onAutoSave={handlePlanningPreferencesAutoSave}
            isAdvisorMode={false}
          />
        )

      case 'riskComfort':
        return (
          <RiskComfortForm
            initialData={currentProfile?.riskComfort}
            onSave={handleRiskComfortSave}
            onAutoSave={handleRiskComfortAutoSave}
            isAdvisorMode={false}
          />
        )

      case 'financialSnapshot':
        return (
          <FinancialSnapshotForm
            initialData={currentProfile?.financialSnapshot}
            onSave={handleFinancialSnapshotSave}
            onAutoSave={handleFinancialSnapshotAutoSave}
            isAdvisorMode={false}
          />
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
      onNext={currentSectionId === 'basicContext' || currentSectionId === 'retirementVision' || currentSectionId === 'planningPreferences' || currentSectionId === 'riskComfort' || currentSectionId === 'financialSnapshot' ? undefined : handleNext}
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
