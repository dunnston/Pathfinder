import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClientStore, useProfileStore } from '@/stores'
import { AdvisorLayout, AdvisorPage } from '@/components/layout'
import { Button, Card, CardContent, TextArea } from '@/components/common'
import { SimpleProgress } from '@/components/common/ProgressIndicator'
import { BasicContextForm, RetirementVisionForm } from '@/components/discovery'
import { DISCOVERY_SECTIONS } from '@/types'
import type { DiscoverySection, BasicContext, RetirementVision } from '@/types'

// Map URL slugs to section IDs
const SLUG_TO_SECTION: Record<string, string> = {
  'basic-context': 'basicContext',
  'retirement-vision': 'retirementVision',
  'planning-preferences': 'planningPreferences',
  'risk-comfort': 'riskComfort',
  'financial-snapshot': 'financialSnapshot',
}

// Get section info by ID
function getSectionById(sectionId: string): DiscoverySection | undefined {
  return DISCOVERY_SECTIONS.find((s) => s.id === sectionId)
}

// Convert section ID to URL slug
function sectionToSlug(sectionId: string): string {
  return sectionId.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function ClientDiscovery(): JSX.Element {
  const { id, section: sectionSlug } = useParams<{ id: string; section: string }>()
  const navigate = useNavigate()
  const { getClient, updateClient, updateSectionProgress } = useClientStore()
  const { currentProfile, updateSection, initializeProfile } = useProfileStore()

  const client = id ? getClient(id) : null

  // Initialize or load profile for this client
  useEffect(() => {
    if (client && (!currentProfile || currentProfile.userId !== client.id)) {
      initializeProfile(client.id)
    }
  }, [client, currentProfile, initializeProfile])

  if (!client) {
    return (
      <AdvisorLayout title="Client Not Found">
        <AdvisorPage>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Client not found
            </h2>
            <p className="text-gray-500 mb-4">
              The client you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/advisor/clients')}>
              Back to Clients
            </Button>
          </div>
        </AdvisorPage>
      </AdvisorLayout>
    )
  }

  // Validate section slug
  if (!sectionSlug || !SLUG_TO_SECTION[sectionSlug]) {
    navigate(`/advisor/clients/${id}/discovery/basic-context`, { replace: true })
    return <></>
  }

  const currentSectionId = SLUG_TO_SECTION[sectionSlug]
  const currentSection = getSectionById(currentSectionId)
  const currentIndex = DISCOVERY_SECTIONS.findIndex((s) => s.id === currentSectionId)
  const isFirstSection = currentIndex === 0
  const isLastSection = currentIndex === DISCOVERY_SECTIONS.length - 1

  const handleNext = (): void => {
    // Mark current section as complete
    updateSectionProgress(client.id, currentSectionId, 1)

    // Update client status if needed
    if (client.status === 'pending') {
      updateClient(client.id, { status: 'active' })
    }

    if (isLastSection) {
      // Mark client as completed
      updateClient(client.id, { status: 'completed' })
      navigate(`/advisor/clients/${id}/profile`)
    } else {
      const nextSection = DISCOVERY_SECTIONS[currentIndex + 1]
      navigate(`/advisor/clients/${id}/discovery/${sectionToSlug(nextSection.id)}`)
    }
  }

  const handlePrevious = (): void => {
    if (!isFirstSection) {
      const prevSection = DISCOVERY_SECTIONS[currentIndex - 1]
      navigate(`/advisor/clients/${id}/discovery/${sectionToSlug(prevSection.id)}`)
    }
  }

  const handleSaveAndExit = (): void => {
    // Mark partial progress on current section
    const currentProgress = client.sectionProgress[currentSectionId] || 0
    if (currentProgress < 0.5) {
      updateSectionProgress(client.id, currentSectionId, 0.5)
    }
    navigate(`/advisor/clients/${id}`)
  }

  if (!currentSection) {
    return <></>
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

  // Render section-specific form
  const renderSectionContent = (): JSX.Element => {
    switch (currentSectionId) {
      case 'basicContext':
        return (
          <BasicContextForm
            initialData={currentProfile?.basicContext}
            onSave={handleBasicContextSave}
            onAutoSave={handleBasicContextAutoSave}
            isAdvisorMode={true}
            clientName={client.name}
          />
        )

      case 'retirementVision':
        return (
          <RetirementVisionForm
            initialData={currentProfile?.retirementVision}
            onSave={handleRetirementVisionSave}
            onAutoSave={handleRetirementVisionAutoSave}
            isAdvisorMode={true}
            clientName={client.name}
          />
        )

      // Placeholder for other sections
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
    <AdvisorLayout
      title={`Discovery: ${currentSection.title}`}
      subtitle={`Step ${currentIndex + 1} of ${DISCOVERY_SECTIONS.length}`}
      headerActions={
        <Button variant="ghost" onClick={handleSaveAndExit}>
          Save & Exit
        </Button>
      }
    >
      <AdvisorPage>
        {/* Progress indicator */}
        <div className="mb-6">
          <SimpleProgress current={currentIndex + 1} total={DISCOVERY_SECTIONS.length} />
        </div>

        {/* Advisor context banner */}
        <div className="mb-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm text-primary">
            <span className="font-medium">Advisor Mode:</span> You are completing this
            section for <span className="font-medium">{client.name}</span>
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Section header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{currentSection.title}</h1>
              <p className="mt-2 text-gray-600">{currentSection.description}</p>
              <p className="mt-1 text-sm text-gray-400">
                Estimated time: {currentSection.estimatedMinutes} minutes
              </p>
            </div>

            {/* Section navigation tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
              {DISCOVERY_SECTIONS.map((section, index) => {
                const isActive = section.id === currentSectionId
                const isCompleted = (client.sectionProgress[section.id] || 0) === 1
                const slug = sectionToSlug(section.id)

                return (
                  <Link
                    key={section.id}
                    to={`/advisor/clients/${client.id}/discovery/${slug}`}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : isCompleted
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs">
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    {section.title}
                  </Link>
                )
              })}
            </div>

            {/* Section form */}
            <div className="mb-8">
              {renderSectionContent()}
            </div>

            {/* Advisor notes field */}
            <div className="mb-8">
              <TextArea
                label="Advisor Notes (not visible to client)"
                placeholder="Add notes about this section..."
                rows={3}
                helperText="These notes will be saved with the client's profile"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isFirstSection}
              >
                ← Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleSaveAndExit}>
                  Save & Exit
                </Button>
                <Button onClick={handleNext}>
                  {isLastSection ? 'Complete Discovery' : 'Next →'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AdvisorPage>
    </AdvisorLayout>
  )
}
