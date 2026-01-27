/**
 * Profile Summary Page
 * Displays the completed Financial Decision Profile with classifications
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '@/stores';
import { Button, Card } from '@/components/common';
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
  formatDate,
  calculateAge,
  formatBalanceRange,
  formatAccountType,
  formatIncomeType,
  formatDebtType,
  formatAssetType,
} from '@/services/displayHelpers';

export function ProfileSummary() {
  const { currentProfile } = useProfileStore();

  // Generate system classifications
  const classifications = useMemo(() => {
    if (!currentProfile) return null;
    return generateSystemClassifications(currentProfile);
  }, [currentProfile]);

  // Export profile as JSON
  const handleExportJSON = () => {
    if (!currentProfile) return;

    const exportData = {
      ...currentProfile,
      systemClassifications: classifications,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_profile_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Profile Found</h1>
          <p className="mt-4 text-gray-600">
            You haven't started your discovery process yet.
          </p>
          <Link
            to="/consumer/discovery"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start Discovery
          </Link>
        </div>
      </div>
    );
  }

  const { basicContext, retirementVision, planningPreferences, riskComfort, financialSnapshot } = currentProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Financial Decision Profile
              </h1>
              {basicContext?.firstName && (
                <p className="mt-1 text-lg text-gray-600">
                  {basicContext.firstName} {basicContext.lastName}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link to="/consumer/discovery/basic-context">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
              <Button onClick={handleExportJSON}>Export JSON</Button>
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
        </div>

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
    </div>
  );
}
