/**
 * Client Profile Page (Advisor Mode)
 * Displays the complete Financial Decision Profile for a client
 */

import { useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClientStore, useProfileStore } from '@/stores'
import { AdvisorLayout, AdvisorPage } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/common'
import {
  ProfileSectionCard,
  DataRow,
  DataList,
  RankedList,
  StrategyIndicators,
  DecisionWindowsList,
} from '@/components/summary'
import {
  generateSystemClassifications,
  getPlanningStageLabel,
} from '@/services/classification'
import {
  MARITAL_STATUS_LABELS,
  FLEXIBILITY_LABELS,
  CONCERN_LABELS,
  SEVERITY_LABELS,
  TOLERANCE_LABELS,
  COMFORT_LABELS,
  INVOLVEMENT_LABELS,
  DECISION_STYLE_LABELS,
  VALUE_LABELS,
  STABILITY_LABELS,
  DOWNTURN_LABELS,
  IMPORTANCE_LABELS,
  WILLINGNESS_LABELS,
  formatDate,
  calculateAge,
  formatBalanceRange,
  formatAccountType,
  formatDebtType,
  formatAssetType,
} from '@/services/displayHelpers'
import { DISCOVERY_SECTIONS } from '@/types'

export function ClientProfile(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClient } = useClientStore()
  const { currentProfile, initializeProfile } = useProfileStore()

  const client = id ? getClient(id) : null

  // Initialize profile for this client
  useEffect(() => {
    if (client && (!currentProfile || currentProfile.userId !== client.id)) {
      initializeProfile(client.id)
    }
  }, [client, currentProfile, initializeProfile])

  // Generate system classifications
  const classifications = useMemo(() => {
    if (!currentProfile) return null
    return generateSystemClassifications(currentProfile)
  }, [currentProfile])

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

  const completionPercent = Math.round(client.profileCompletion * 100)
  const hasProfileData = currentProfile && currentProfile.userId === client.id

  const handleExportJSON = (): void => {
    if (!currentProfile) return

    const exportData = {
      clientName: client.name,
      ...currentProfile,
      systemClassifications: classifications,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${client.name.replace(/\s+/g, '_')}_profile.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const { basicContext, retirementVision, planningPreferences, riskComfort, financialSnapshot } = currentProfile || {}

  return (
    <AdvisorLayout
      title="Financial Decision Profile"
      subtitle={client.name}
      headerActions={
        <div className="flex items-center gap-2">
          <Link to={`/advisor/clients/${client.id}`}>
            <Button variant="ghost">Back to Client</Button>
          </Link>
          <Link to={`/advisor/clients/${client.id}/discovery/basic-context`}>
            <Button variant="secondary">Edit Profile</Button>
          </Link>
          <Button onClick={handleExportJSON}>Export JSON</Button>
        </div>
      }
    >
      <AdvisorPage>
        <div className="space-y-6">
          {/* Profile Status Overview */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Profile Status</span>
                    <div className="mt-1">
                      <ProfileStatusBadge status={client.status} />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <span className="text-sm text-gray-500">Completion</span>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{completionPercent}%</p>
                  </div>
                  {classifications && (
                    <>
                      <div className="h-8 w-px bg-gray-200" />
                      <div>
                        <span className="text-sm text-gray-500">Planning Stage</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {getPlanningStageLabel(classifications.planningStage)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(client.updatedAt)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Sections with Data */}
          {hasProfileData ? (
            <>
              {/* Basic Context Section */}
              <ProfileSectionCard
                title="Basic Context"
                isComplete={!!basicContext?.firstName}
                defaultExpanded={true}
              >
                {basicContext ? (
                  <dl className="divide-y divide-gray-100">
                    <DataRow label="Name" value={`${basicContext.firstName} ${basicContext.lastName}`} />
                    <DataRow
                      label="Date of Birth"
                      value={
                        basicContext.birthDate
                          ? `${formatDate(basicContext.birthDate)} (Age ${calculateAge(basicContext.birthDate)})`
                          : undefined
                      }
                    />
                    <DataRow
                      label="Marital Status"
                      value={basicContext.maritalStatus ? MARITAL_STATUS_LABELS[basicContext.maritalStatus] : undefined}
                    />
                    {basicContext.spouse && (
                      <>
                        <DataRow label="Spouse Name" value={basicContext.spouse.firstName} />
                        <DataRow
                          label="Spouse Birth Date"
                          value={formatDate(basicContext.spouse.birthDate)}
                        />
                        <DataRow
                          label="Spouse Has Pension"
                          value={basicContext.spouse.hasPension ? 'Yes' : 'No'}
                        />
                      </>
                    )}
                    <DataRow label="Occupation" value={basicContext.occupation} />
                    {basicContext.federalEmployee && (
                      <>
                        <DataRow label="Federal Agency" value={basicContext.federalEmployee.agency} />
                        <DataRow label="Years of Service" value={basicContext.federalEmployee.yearsOfService?.toString()} />
                        <DataRow label="Retirement System" value={basicContext.federalEmployee.retirementSystem} />
                        <DataRow
                          label="Pay Grade"
                          value={`${basicContext.federalEmployee.payGrade}-${basicContext.federalEmployee.step}`}
                        />
                        <DataRow
                          label="Law Enforcement"
                          value={basicContext.federalEmployee.isLawEnforcement ? 'Yes' : 'No'}
                        />
                      </>
                    )}
                    <DataRow
                      label="Dependents"
                      value={
                        basicContext.dependents && basicContext.dependents.length > 0
                          ? `${basicContext.dependents.length} dependent(s)`
                          : 'None'
                      }
                    />
                  </dl>
                ) : (
                  <p className="text-gray-500 italic">Not completed</p>
                )}
              </ProfileSectionCard>

              {/* Retirement Vision Section */}
              <ProfileSectionCard
                title="Retirement Vision"
                isComplete={!!retirementVision?.targetRetirementAge || !!retirementVision?.visionDescription}
              >
                {retirementVision ? (
                  <dl className="divide-y divide-gray-100">
                    <DataRow label="Target Retirement Age" value={retirementVision.targetRetirementAge?.toString()} />
                    <DataRow label="Target Year" value={retirementVision.targetRetirementYear?.toString()} />
                    <DataRow
                      label="Flexibility"
                      value={retirementVision.retirementFlexibility ? FLEXIBILITY_LABELS[retirementVision.retirementFlexibility] : undefined}
                    />
                    <DataRow label="Vision" value={retirementVision.visionDescription} />
                    {retirementVision.topConcerns && retirementVision.topConcerns.length > 0 && (
                      <DataList
                        label="Top Concerns"
                        items={retirementVision.topConcerns.map(
                          (c) => `${CONCERN_LABELS[c.concern]} (${SEVERITY_LABELS[c.severity]})`
                        )}
                      />
                    )}
                    <DataList label="Must-Have Outcomes" items={retirementVision.mustHaveOutcomes || []} />
                    <DataList label="Nice-to-Have Outcomes" items={retirementVision.niceToHaveOutcomes || []} />
                    {retirementVision.lifestylePriorities && retirementVision.lifestylePriorities.length > 0 && (
                      <RankedList
                        label="Lifestyle Priorities"
                        items={retirementVision.lifestylePriorities.map((p) => ({
                          rank: p.rank,
                          label: p.priority,
                        }))}
                      />
                    )}
                    <DataRow label="Purpose Statement" value={retirementVision.financialPurposeStatement} />
                  </dl>
                ) : (
                  <p className="text-gray-500 italic">Not completed</p>
                )}
              </ProfileSectionCard>

              {/* Planning Preferences Section */}
              <ProfileSectionCard
                title="Planning Preferences"
                isComplete={!!planningPreferences?.complexityTolerance}
              >
                {planningPreferences ? (
                  <dl className="divide-y divide-gray-100">
                    <DataRow
                      label="Complexity Tolerance"
                      value={planningPreferences.complexityTolerance ? TOLERANCE_LABELS[planningPreferences.complexityTolerance] : undefined}
                    />
                    <DataRow
                      label="Financial Product Comfort"
                      value={planningPreferences.financialProductComfort ? COMFORT_LABELS[planningPreferences.financialProductComfort] : undefined}
                    />
                    <DataRow
                      label="Advisor Involvement"
                      value={planningPreferences.advisorInvolvementDesire ? INVOLVEMENT_LABELS[planningPreferences.advisorInvolvementDesire] : undefined}
                    />
                    <DataRow
                      label="Decision-Making Style"
                      value={planningPreferences.decisionMakingStyle ? DECISION_STYLE_LABELS[planningPreferences.decisionMakingStyle] : undefined}
                    />
                    {planningPreferences.valuesPriorities && planningPreferences.valuesPriorities.length > 0 && (
                      <RankedList
                        label="Values Priorities"
                        items={planningPreferences.valuesPriorities.map((v) => ({
                          rank: v.rank,
                          label: VALUE_LABELS[v.value],
                        }))}
                      />
                    )}
                  </dl>
                ) : (
                  <p className="text-gray-500 italic">Not completed</p>
                )}
              </ProfileSectionCard>

              {/* Risk & Income Comfort Section */}
              <ProfileSectionCard
                title="Risk & Income Comfort"
                isComplete={!!riskComfort?.investmentRiskTolerance}
              >
                {riskComfort ? (
                  <dl className="divide-y divide-gray-100">
                    <DataRow
                      label="Investment Risk Tolerance"
                      value={riskComfort.investmentRiskTolerance ? TOLERANCE_LABELS[riskComfort.investmentRiskTolerance] : undefined}
                    />
                    <DataRow
                      label="Income Stability Preference"
                      value={riskComfort.incomeStabilityPreference ? STABILITY_LABELS[riskComfort.incomeStabilityPreference] : undefined}
                    />
                    <DataRow
                      label="Market Downturn Response"
                      value={riskComfort.marketDownturnResponse ? DOWNTURN_LABELS[riskComfort.marketDownturnResponse] : undefined}
                    />
                    <DataRow
                      label="Guaranteed Income Importance"
                      value={riskComfort.guaranteedIncomeImportance ? IMPORTANCE_LABELS[riskComfort.guaranteedIncomeImportance] : undefined}
                    />
                    <DataRow
                      label="Spending Adjustment Willingness"
                      value={riskComfort.spendingAdjustmentWillingness ? WILLINGNESS_LABELS[riskComfort.spendingAdjustmentWillingness] : undefined}
                    />
                    {riskComfort.retirementTimingFlexibility && (
                      <>
                        <DataRow
                          label="Willing to Delay Retirement"
                          value={riskComfort.retirementTimingFlexibility.willingToDelay ? 'Yes' : 'No'}
                        />
                        <DataRow
                          label="Willing to Retire Early"
                          value={riskComfort.retirementTimingFlexibility.willingToRetireEarly ? 'Yes' : 'No'}
                        />
                      </>
                    )}
                  </dl>
                ) : (
                  <p className="text-gray-500 italic">Not completed</p>
                )}
              </ProfileSectionCard>

              {/* Financial Snapshot Section */}
              <ProfileSectionCard
                title="Financial Snapshot"
                isComplete={!!(financialSnapshot?.investmentAccounts && financialSnapshot.investmentAccounts.length > 0)}
              >
                {financialSnapshot ? (
                  <dl className="divide-y divide-gray-100">
                    {financialSnapshot.investmentAccounts && financialSnapshot.investmentAccounts.length > 0 && (
                      <div className="py-2">
                        <dt className="text-sm font-medium text-gray-500">Investment Accounts</dt>
                        <dd className="mt-2 space-y-1">
                          {financialSnapshot.investmentAccounts.map((account, i) => (
                            <div key={i} className="text-sm text-gray-900">
                              {formatAccountType(account.type)} - {formatBalanceRange(account.approximateBalance)}
                            </div>
                          ))}
                        </dd>
                      </div>
                    )}
                    {financialSnapshot.debts && financialSnapshot.debts.length > 0 && (
                      <div className="py-2">
                        <dt className="text-sm font-medium text-gray-500">Debts</dt>
                        <dd className="mt-2 space-y-1">
                          {financialSnapshot.debts.map((debt, i) => (
                            <div key={i} className="text-sm text-gray-900">
                              {formatDebtType(debt.type)} - {formatBalanceRange(debt.approximateBalance)}
                            </div>
                          ))}
                        </dd>
                      </div>
                    )}
                    {financialSnapshot.majorAssets && financialSnapshot.majorAssets.length > 0 && (
                      <div className="py-2">
                        <dt className="text-sm font-medium text-gray-500">Major Assets</dt>
                        <dd className="mt-2 space-y-1">
                          {financialSnapshot.majorAssets.map((asset, i) => (
                            <div key={i} className="text-sm text-gray-900">
                              {formatAssetType(asset.type)}
                              {asset.approximateValue && ` - ${formatBalanceRange(asset.approximateValue)}`}
                            </div>
                          ))}
                        </dd>
                      </div>
                    )}
                    {financialSnapshot.emergencyReserves && (
                      <DataRow
                        label="Emergency Reserves"
                        value={`${financialSnapshot.emergencyReserves.monthsOfExpenses} months of expenses`}
                      />
                    )}
                  </dl>
                ) : (
                  <p className="text-gray-500 italic">Not completed</p>
                )}
              </ProfileSectionCard>

              {/* Strategy Indicators */}
              {classifications && (
                <StrategyIndicators weights={classifications.strategyWeights} />
              )}

              {/* Decision Windows */}
              {classifications && (
                <DecisionWindowsList windows={classifications.upcomingDecisionWindows} />
              )}
            </>
          ) : (
            /* Show section cards without data when profile not loaded */
            DISCOVERY_SECTIONS.map((section) => {
              const sectionProgress = client.sectionProgress[section.id] || 0
              const isComplete = sectionProgress === 1
              const slug = section.id.replace(/([A-Z])/g, '-$1').toLowerCase()

              return (
                <Card key={section.id}>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                        {isComplete ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Complete
                          </span>
                        ) : sectionProgress > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                            {Math.round(sectionProgress * 100)}% complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                            Not started
                          </span>
                        )}
                      </div>
                      <Link to={`/advisor/clients/${client.id}/discovery/${slug}`}>
                        <Button variant="ghost" size="sm">
                          {isComplete ? 'Edit' : 'Start'}
                        </Button>
                      </Link>
                    </div>
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                      <p className="text-gray-400">
                        Complete the discovery to see profile data
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}

          {/* Advisor Notes */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Advisor Notes</h2>
              {client.advisorNotes ? (
                <p className="text-gray-600 whitespace-pre-wrap">{client.advisorNotes}</p>
              ) : (
                <p className="text-gray-400 italic">No notes added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </AdvisorPage>
    </AdvisorLayout>
  )
}

function ProfileStatusBadge({ status }: { status: string }): JSX.Element {
  const styles: Record<string, string> = {
    active: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-gray-100 text-gray-600',
    completed: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  }

  const labels: Record<string, string> = {
    active: 'In Progress',
    pending: 'Not Started',
    completed: 'Complete',
    archived: 'Archived',
  }

  return (
    <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}
