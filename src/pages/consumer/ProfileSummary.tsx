/**
 * Profile Summary Page
 * Displays the completed Financial Decision Profile with classifications
 */

import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '@/stores';
import { Button, Card, LoadingSpinner, Modal, ModalFooter } from '@/components/common';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Toast notification for export status
interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}
import {
  ProfileSectionCard,
  DataRow,
  DataList,
  RankedList,
  StrategyIndicators,
  DecisionWindowsList,
} from '@/components/summary';
import {
  generateSystemClassifications,
  getPlanningStageLabel,
} from '@/services/classification';
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
  VALUE_CATEGORY_LABELS,
  GOAL_PRIORITY_LABELS,
  GOAL_TIME_HORIZON_LABELS,
  PURPOSE_DRIVER_LABELS,
  formatDate,
  calculateAge,
  formatBalanceRange,
  formatAccountType,
  formatIncomeType,
  formatDebtType,
  formatAssetType,
} from '@/services/displayHelpers';
import { VALUE_CARDS } from '@/data/valueCards';

export function ProfileSummary() {
  const { currentProfile, _hasHydrated } = useProfileStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfirmed, setExportConfirmed] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' });

  // Auto-hide toast after 5 seconds
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  }, []);

  // Generate system classifications
  const classifications = useMemo(() => {
    if (!currentProfile) return null;
    return generateSystemClassifications(currentProfile);
  }, [currentProfile]);

  // Check if profile has minimum required data
  const hasMinimalData = useMemo(() => {
    if (!currentProfile) return false;
    return !!(
      currentProfile.basicContext?.firstName ||
      currentProfile.retirementVision?.targetRetirementAge
    );
  }, [currentProfile]);

  // Open export confirmation modal - defined before early returns
  const handleExportClick = useCallback(() => {
    setExportConfirmed(false);
    setShowExportModal(true);
  }, []);

  // Export profile as JSON after confirmation - defined before early returns
  const handleConfirmExport = useCallback(() => {
    if (!currentProfile || !exportConfirmed) return;

    try {
      const exportData = {
        ...currentProfile,
        systemClassifications: classifications,
        exportedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial_profile_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowExportModal(false);
      showToast('success', 'Profile exported successfully');
    } catch (error) {
      setShowExportModal(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showToast('error', `Export failed: ${errorMessage}`);
    }
  }, [currentProfile, exportConfirmed, classifications, showToast]);

  // Show loading state while hydrating from localStorage
  if (!_hasHydrated) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentProfile) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Profile Found</h1>
          <p className="mt-4 text-gray-600">
            You haven't started your discovery process yet.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/consumer/dashboard"
              className="inline-block rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-300"
            >
              Dashboard
            </Link>
            <Link
              to="/consumer/discovery"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Start Discovery
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show incomplete profile state
  if (!hasMinimalData) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Incomplete</h1>
          <p className="mt-4 text-gray-600">
            Please complete at least the Basic Context section to view your profile summary.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/consumer/dashboard"
              className="inline-block rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-300"
            >
              Dashboard
            </Link>
            <Link
              to="/consumer/discovery/basic-context"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Continue Discovery
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { basicContext, retirementVision, valuesDiscovery, financialGoals, financialPurpose, planningPreferences, riskComfort, financialSnapshot } = currentProfile;

  return (
    <DashboardLayout>
      {/* SEC-26: Main landmark for accessibility */}
      <div className="mx-auto max-w-4xl px-4 py-8" role="main" aria-labelledby="profile-title">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 id="profile-title" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Financial Decision Profile
              </h1>
              {basicContext?.firstName && (
                <p className="mt-1 text-base sm:text-lg text-gray-600">
                  {basicContext.firstName} {basicContext.lastName}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/consumer/dashboard">
                <Button variant="secondary" fullWidth className="sm:w-auto">Dashboard</Button>
              </Link>
              <Link to="/consumer/discovery/basic-context">
                <Button variant="secondary" fullWidth className="sm:w-auto">Edit Profile</Button>
              </Link>
              <Button onClick={handleExportClick} fullWidth className="sm:w-auto">Export JSON</Button>
            </div>
          </div>

          {/* Progress Bar */}
          {classifications && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Profile Completeness
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {classifications.profileCompleteness}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${classifications.profileCompleteness}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Planning Stage Badge */}
        {classifications && (
          <Card className="mb-6 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Planning Stage</span>
                <p className="text-lg font-semibold text-gray-900">
                  {getPlanningStageLabel(classifications.planningStage)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Last Updated</span>
                <p className="text-sm text-gray-700">
                  {formatDate(currentProfile.updatedAt)}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {/* Basic Context Section */}
          <ProfileSectionCard
            title="Basic Context"
            isComplete={!!basicContext?.firstName}
            defaultExpanded={true}
            editLink="/consumer/discovery/basic-context"
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
            editLink="/consumer/discovery/retirement-vision"
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
              </dl>
            ) : (
              <p className="text-gray-500 italic">Not completed</p>
            )}
          </ProfileSectionCard>

          {/* Values Discovery Section */}
          <ProfileSectionCard
            title="Values Discovery"
            isComplete={valuesDiscovery?.state === 'COMPLETED'}
            editLink="/consumer/discovery/values-discovery"
          >
            {valuesDiscovery && valuesDiscovery.state === 'COMPLETED' ? (
              <dl className="divide-y divide-gray-100">
                {valuesDiscovery.top5 && valuesDiscovery.top5.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Top 5 Core Values</dt>
                    <dd className="mt-2 space-y-2">
                      {valuesDiscovery.top5.map((cardId, i) => {
                        const card = VALUE_CARDS.find((c) => c.id === cardId);
                        return (
                          <div key={cardId} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                              {i + 1}
                            </span>
                            <div>
                              <span className="font-medium text-gray-900">{card?.title || cardId}</span>
                              {card?.description && (
                                <p className="text-sm text-gray-500">{card.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </dd>
                  </div>
                )}
                {valuesDiscovery.nonNegotiables && valuesDiscovery.nonNegotiables.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Non-Negotiables</dt>
                    <dd className="mt-2">
                      <ul className="space-y-1">
                        {valuesDiscovery.nonNegotiables.map((cardId) => {
                          const card = VALUE_CARDS.find((c) => c.id === cardId);
                          return (
                            <li key={cardId} className="text-sm text-gray-900 flex items-center gap-2">
                              <span className="text-amber-500">★</span>
                              {card?.title || cardId}
                            </li>
                          );
                        })}
                      </ul>
                    </dd>
                  </div>
                )}
                {valuesDiscovery.derived?.dominantCategory && (
                  <DataRow
                    label="Dominant Category"
                    value={VALUE_CATEGORY_LABELS[valuesDiscovery.derived.dominantCategory]}
                  />
                )}
                {valuesDiscovery.derived?.secondaryCategory && (
                  <DataRow
                    label="Secondary Category"
                    value={VALUE_CATEGORY_LABELS[valuesDiscovery.derived.secondaryCategory]}
                  />
                )}
                {valuesDiscovery.derived?.conflictFlags && valuesDiscovery.derived.conflictFlags.length > 0 && (
                  <DataList label="Potential Value Tensions" items={valuesDiscovery.derived.conflictFlags} />
                )}
              </dl>
            ) : (
              <p className="text-gray-500 italic">Not completed</p>
            )}
          </ProfileSectionCard>

          {/* Financial Goals Section */}
          <ProfileSectionCard
            title="Financial Goals"
            isComplete={financialGoals?.state === 'COMPLETED'}
            editLink="/consumer/discovery/financial-goals"
          >
            {financialGoals && financialGoals.state === 'COMPLETED' ? (
              <dl className="divide-y divide-gray-100">
                {financialGoals.coreGoals && financialGoals.coreGoals.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Core Planning Goals</dt>
                    <dd className="mt-2 space-y-3">
                      {financialGoals.coreGoals.map((goal) => (
                        <div key={goal.id} className="border-l-2 border-blue-500 pl-3">
                          <div className="font-medium text-gray-900">{goal.label}</div>
                          <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                              {GOAL_PRIORITY_LABELS[goal.priority]}
                            </span>
                            {goal.timeHorizon && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                {GOAL_TIME_HORIZON_LABELS[goal.timeHorizon]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                {financialGoals.allGoals && financialGoals.allGoals.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">All Goals by Priority</dt>
                    <dd className="mt-2 space-y-2">
                      {(['HIGH', 'MEDIUM', 'LOW'] as const).map((priority) => {
                        const goalsAtPriority = (financialGoals.allGoals ?? []).filter((g) => g.priority === priority);
                        if (goalsAtPriority.length === 0) return null;
                        return (
                          <div key={priority}>
                            <span className="text-xs font-medium text-gray-400 uppercase">{priority}</span>
                            <ul className="mt-1 space-y-1">
                              {goalsAtPriority.map((goal) => (
                                <li key={goal.id} className="text-sm text-gray-900">
                                  • {goal.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-gray-500 italic">Not completed</p>
            )}
          </ProfileSectionCard>

          {/* Financial Purpose Section */}
          <ProfileSectionCard
            title="Statement of Financial Purpose"
            isComplete={financialPurpose?.state === 'COMPLETED'}
            editLink="/consumer/discovery/financial-purpose"
          >
            {financialPurpose && financialPurpose.state === 'COMPLETED' ? (
              <dl className="divide-y divide-gray-100">
                {financialPurpose.finalText && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Your Financial Purpose</dt>
                    <dd className="mt-2">
                      <blockquote className="text-gray-900 italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                        "{financialPurpose.finalText}"
                      </blockquote>
                    </dd>
                  </div>
                )}
                {financialPurpose.primaryDriver && (
                  <DataRow
                    label="Primary Driver"
                    value={PURPOSE_DRIVER_LABELS[financialPurpose.primaryDriver]}
                  />
                )}
                {financialPurpose.secondaryDriver && (
                  <DataRow
                    label="Secondary Driver"
                    value={PURPOSE_DRIVER_LABELS[financialPurpose.secondaryDriver]}
                  />
                )}
                {financialPurpose.visionAnchors && financialPurpose.visionAnchors.length > 0 && (
                  <DataList label="Vision Anchors" items={financialPurpose.visionAnchors} />
                )}
              </dl>
            ) : (
              <p className="text-gray-500 italic">Not completed</p>
            )}
          </ProfileSectionCard>

          {/* Planning Preferences Section */}
          <ProfileSectionCard
            title="Planning Preferences"
            isComplete={!!planningPreferences?.complexityTolerance}
            editLink="/consumer/discovery/planning-preferences"
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
                {planningPreferences.tradeoffPreferences && planningPreferences.tradeoffPreferences.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Tradeoff Preferences</dt>
                    <dd className="mt-2 space-y-2">
                      {planningPreferences.tradeoffPreferences.map((t, i) => (
                        <div key={i} className="text-sm text-gray-900">
                          <span className="font-medium">{t.optionA}</span>
                          <span className="text-gray-500"> vs </span>
                          <span className="font-medium">{t.optionB}</span>
                          <span className="text-gray-500">: </span>
                          <span className="capitalize">{t.preference.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </dd>
                  </div>
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
            editLink="/consumer/discovery/risk-comfort"
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
                  label="Flexibility vs Security"
                  value={
                    riskComfort.flexibilityVsSecurityPreference !== undefined
                      ? `${riskComfort.flexibilityVsSecurityPreference > 0 ? '+' : ''}${riskComfort.flexibilityVsSecurityPreference} (${riskComfort.flexibilityVsSecurityPreference < 0 ? 'Security-leaning' : riskComfort.flexibilityVsSecurityPreference > 0 ? 'Flexibility-leaning' : 'Balanced'})`
                      : undefined
                  }
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
                    {riskComfort.retirementTimingFlexibility.willingToDelay && (
                      <DataRow
                        label="Max Delay Years"
                        value={riskComfort.retirementTimingFlexibility.maxDelayYears?.toString()}
                      />
                    )}
                    <DataRow
                      label="Willing to Retire Early"
                      value={riskComfort.retirementTimingFlexibility.willingToRetireEarly ? 'Yes' : 'No'}
                    />
                    <DataRow label="Conditions" value={riskComfort.retirementTimingFlexibility.conditions} />
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
            isComplete={
              !!(financialSnapshot?.investmentAccounts && financialSnapshot.investmentAccounts.length > 0)
            }
            editLink="/consumer/discovery/financial-snapshot"
          >
            {financialSnapshot ? (
              <dl className="divide-y divide-gray-100">
                {/* Current Income */}
                {financialSnapshot.incomeSourcesCurrent && financialSnapshot.incomeSourcesCurrent.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Current Income Sources</dt>
                    <dd className="mt-2 space-y-1">
                      {financialSnapshot.incomeSourcesCurrent.map((income, i) => (
                        <div key={i} className="text-sm text-gray-900">
                          {formatIncomeType(income.type)}
                          {income.annualAmount && ` - $${income.annualAmount.toLocaleString()}/year`}
                          {income.isPrimary && ' (Primary)'}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}

                {/* Retirement Income */}
                {financialSnapshot.incomeSourcesRetirement && financialSnapshot.incomeSourcesRetirement.length > 0 && (
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500">Expected Retirement Income</dt>
                    <dd className="mt-2 space-y-1">
                      {financialSnapshot.incomeSourcesRetirement.map((income, i) => (
                        <div key={i} className="text-sm text-gray-900">
                          {formatIncomeType(income.type)}
                          {income.estimatedAnnualAmount && ` - $${income.estimatedAnnualAmount.toLocaleString()}/year`}
                          {income.isGuaranteed && ' (Guaranteed)'}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}

                {/* Investment Accounts */}
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

                {/* Debts */}
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

                {/* Assets */}
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

                {/* Emergency Reserves */}
                {financialSnapshot.emergencyReserves && (
                  <DataRow
                    label="Emergency Reserves"
                    value={`${financialSnapshot.emergencyReserves.monthsOfExpenses} months of expenses`}
                  />
                )}

                {/* Insurance */}
                {financialSnapshot.insuranceCoverage && (
                  <>
                    <DataRow
                      label="Life Insurance"
                      value={financialSnapshot.insuranceCoverage.hasLifeInsurance ? 'Yes' : 'No'}
                    />
                    <DataRow
                      label="Long-Term Care Insurance"
                      value={financialSnapshot.insuranceCoverage.hasLongTermCare ? 'Yes' : 'No'}
                    />
                    <DataRow
                      label="Disability Insurance"
                      value={financialSnapshot.insuranceCoverage.hasDisability ? 'Yes' : 'No'}
                    />
                  </>
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

          {/* Advisor Notes (if any) */}
          {currentProfile.advisorNotes && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advisor Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{currentProfile.advisorNotes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-opacity ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
          role="alert"
          aria-live="polite"
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-2 text-white/80 hover:text-white"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Export Confirmation Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Financial Profile"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-amber-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Sensitive Data Warning
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  This export contains sensitive personal and financial information including:
                </p>
                <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                  <li>Personal identifying information</li>
                  <li>Financial account details</li>
                  <li>Income and asset information</li>
                  <li>Retirement planning data</li>
                </ul>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={exportConfirmed}
              onChange={(e) => setExportConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              I understand this file contains sensitive financial data and I will store it securely.
            </span>
          </label>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmExport} disabled={!exportConfirmed}>
            Download Export
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
