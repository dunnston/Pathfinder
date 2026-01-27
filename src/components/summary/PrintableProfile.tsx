/**
 * PrintableProfile Component
 * Clean, print-optimized layout for the Financial Decision Profile
 */

import type { PartialFinancialProfile } from '@/types';
import type { SystemClassifications } from '@/types/systemClassifications';
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
import { getPlanningStageLabel, getWeightLabel } from '@/services/classification';

interface PrintableProfileProps {
  profile: PartialFinancialProfile;
  classifications: SystemClassifications;
  clientName?: string;
}

export function PrintableProfile({ profile, classifications, clientName }: PrintableProfileProps) {
  const { basicContext, retirementVision, planningPreferences, riskComfort, financialSnapshot } = profile;

  const displayName = clientName ||
    (basicContext?.firstName ? `${basicContext.firstName} ${basicContext.lastName}` : 'Financial Decision Profile');

  return (
    <div className="print-profile bg-white text-black p-8 max-w-4xl mx-auto">
      {/* Print Styles */}
      <style>{`
        @media print {
          .print-profile {
            font-size: 11pt;
            line-height: 1.4;
          }
          .print-profile h1 { font-size: 18pt; }
          .print-profile h2 { font-size: 14pt; page-break-after: avoid; }
          .print-profile h3 { font-size: 12pt; }
          .print-section { page-break-inside: avoid; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
        <p className="text-sm text-gray-600 mt-1">Financial Decision Profile</p>
        <div className="flex justify-between mt-4 text-sm">
          <div>
            <span className="font-medium">Planning Stage:</span>{' '}
            {getPlanningStageLabel(classifications.planningStage)}
          </div>
          <div>
            <span className="font-medium">Profile Completeness:</span>{' '}
            {classifications.profileCompleteness}%
          </div>
          <div>
            <span className="font-medium">Generated:</span>{' '}
            {formatDate(new Date())}
          </div>
        </div>
      </header>

      {/* Basic Context */}
      {basicContext && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Basic Context
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <PrintRow label="Name" value={`${basicContext.firstName} ${basicContext.lastName}`} />
            <PrintRow
              label="Date of Birth"
              value={basicContext.birthDate ? `${formatDate(basicContext.birthDate)} (Age ${calculateAge(basicContext.birthDate)})` : undefined}
            />
            <PrintRow
              label="Marital Status"
              value={basicContext.maritalStatus ? MARITAL_STATUS_LABELS[basicContext.maritalStatus] : undefined}
            />
            <PrintRow label="Occupation" value={basicContext.occupation} />
            {basicContext.federalEmployee && (
              <>
                <PrintRow label="Federal Agency" value={basicContext.federalEmployee.agency} />
                <PrintRow label="Years of Service" value={basicContext.federalEmployee.yearsOfService?.toString()} />
                <PrintRow label="Retirement System" value={basicContext.federalEmployee.retirementSystem} />
                <PrintRow
                  label="Pay Grade"
                  value={`${basicContext.federalEmployee.payGrade}-${basicContext.federalEmployee.step}`}
                />
              </>
            )}
            {basicContext.spouse && (
              <>
                <PrintRow label="Spouse" value={basicContext.spouse.firstName} />
                <PrintRow label="Spouse Has Pension" value={basicContext.spouse.hasPension ? 'Yes' : 'No'} />
              </>
            )}
            <PrintRow
              label="Dependents"
              value={basicContext.dependents?.length ? `${basicContext.dependents.length}` : 'None'}
            />
          </div>
        </section>
      )}

      {/* Retirement Vision */}
      {retirementVision && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Retirement Vision
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <PrintRow label="Target Retirement Age" value={retirementVision.targetRetirementAge?.toString()} />
            <PrintRow label="Target Year" value={retirementVision.targetRetirementYear?.toString()} />
            <PrintRow
              label="Flexibility"
              value={retirementVision.retirementFlexibility ? FLEXIBILITY_LABELS[retirementVision.retirementFlexibility] : undefined}
            />
          </div>
          {retirementVision.visionDescription && (
            <div className="mt-3">
              <p className="font-medium text-sm">Vision Statement:</p>
              <p className="text-sm mt-1 italic">{retirementVision.visionDescription}</p>
            </div>
          )}
          {retirementVision.topConcerns && retirementVision.topConcerns.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-sm">Top Concerns:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {retirementVision.topConcerns.map((c, i) => (
                  <li key={i}>{CONCERN_LABELS[c.concern]} ({SEVERITY_LABELS[c.severity]})</li>
                ))}
              </ul>
            </div>
          )}
          {retirementVision.mustHaveOutcomes && retirementVision.mustHaveOutcomes.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-sm">Must-Have Outcomes:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {retirementVision.mustHaveOutcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Planning Preferences */}
      {planningPreferences && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Planning Preferences
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <PrintRow
              label="Complexity Tolerance"
              value={planningPreferences.complexityTolerance ? TOLERANCE_LABELS[planningPreferences.complexityTolerance] : undefined}
            />
            <PrintRow
              label="Financial Product Comfort"
              value={planningPreferences.financialProductComfort ? COMFORT_LABELS[planningPreferences.financialProductComfort] : undefined}
            />
            <PrintRow
              label="Advisor Involvement"
              value={planningPreferences.advisorInvolvementDesire ? INVOLVEMENT_LABELS[planningPreferences.advisorInvolvementDesire] : undefined}
            />
            <PrintRow
              label="Decision Style"
              value={planningPreferences.decisionMakingStyle ? DECISION_STYLE_LABELS[planningPreferences.decisionMakingStyle] : undefined}
            />
          </div>
          {planningPreferences.valuesPriorities && planningPreferences.valuesPriorities.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-sm">Values (Ranked):</p>
              <ol className="list-decimal list-inside text-sm mt-1">
                {[...planningPreferences.valuesPriorities]
                  .sort((a, b) => a.rank - b.rank)
                  .map((v, i) => (
                    <li key={i}>{VALUE_LABELS[v.value]}</li>
                  ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* Risk & Income Comfort */}
      {riskComfort && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Risk & Income Comfort
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <PrintRow
              label="Investment Risk Tolerance"
              value={riskComfort.investmentRiskTolerance ? TOLERANCE_LABELS[riskComfort.investmentRiskTolerance] : undefined}
            />
            <PrintRow
              label="Income Stability Preference"
              value={riskComfort.incomeStabilityPreference ? STABILITY_LABELS[riskComfort.incomeStabilityPreference] : undefined}
            />
            <PrintRow
              label="Market Downturn Response"
              value={riskComfort.marketDownturnResponse ? DOWNTURN_LABELS[riskComfort.marketDownturnResponse] : undefined}
            />
            <PrintRow
              label="Guaranteed Income Importance"
              value={riskComfort.guaranteedIncomeImportance ? IMPORTANCE_LABELS[riskComfort.guaranteedIncomeImportance] : undefined}
            />
            <PrintRow
              label="Spending Adjustment Willingness"
              value={riskComfort.spendingAdjustmentWillingness ? WILLINGNESS_LABELS[riskComfort.spendingAdjustmentWillingness] : undefined}
            />
            {riskComfort.retirementTimingFlexibility && (
              <>
                <PrintRow
                  label="Willing to Delay Retirement"
                  value={riskComfort.retirementTimingFlexibility.willingToDelay ? 'Yes' : 'No'}
                />
                <PrintRow
                  label="Willing to Retire Early"
                  value={riskComfort.retirementTimingFlexibility.willingToRetireEarly ? 'Yes' : 'No'}
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* Financial Snapshot */}
      {financialSnapshot && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Financial Snapshot
          </h2>

          {financialSnapshot.investmentAccounts && financialSnapshot.investmentAccounts.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm">Investment Accounts:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {financialSnapshot.investmentAccounts.map((a, i) => (
                  <li key={i}>{formatAccountType(a.type)} - {formatBalanceRange(a.approximateBalance)}</li>
                ))}
              </ul>
            </div>
          )}

          {financialSnapshot.incomeSourcesRetirement && financialSnapshot.incomeSourcesRetirement.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm">Expected Retirement Income:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {financialSnapshot.incomeSourcesRetirement.map((inc, i) => (
                  <li key={i}>
                    {formatIncomeType(inc.type)}
                    {inc.estimatedAnnualAmount && ` - $${inc.estimatedAnnualAmount.toLocaleString()}/year`}
                    {inc.isGuaranteed && ' (Guaranteed)'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {financialSnapshot.debts && financialSnapshot.debts.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm">Debts:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {financialSnapshot.debts.map((d, i) => (
                  <li key={i}>{formatDebtType(d.type)} - {formatBalanceRange(d.approximateBalance)}</li>
                ))}
              </ul>
            </div>
          )}

          {financialSnapshot.majorAssets && financialSnapshot.majorAssets.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm">Major Assets:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {financialSnapshot.majorAssets.map((a, i) => (
                  <li key={i}>
                    {formatAssetType(a.type)}
                    {a.approximateValue && ` - ${formatBalanceRange(a.approximateValue)}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mt-3">
            {financialSnapshot.emergencyReserves && (
              <PrintRow
                label="Emergency Reserves"
                value={`${financialSnapshot.emergencyReserves.monthsOfExpenses} months`}
              />
            )}
            {financialSnapshot.insuranceCoverage && (
              <>
                <PrintRow
                  label="Life Insurance"
                  value={financialSnapshot.insuranceCoverage.hasLifeInsurance ? 'Yes' : 'No'}
                />
                <PrintRow
                  label="Long-Term Care"
                  value={financialSnapshot.insuranceCoverage.hasLongTermCare ? 'Yes' : 'No'}
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* Strategy Profile */}
      <section className="print-section mb-6">
        <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
          Strategy Profile
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <PrintRow
            label="Security Focus"
            value={`${classifications.strategyWeights.securityFocus}/100 (${getWeightLabel(classifications.strategyWeights.securityFocus)})`}
          />
          <PrintRow
            label="Growth Orientation"
            value={`${classifications.strategyWeights.growthOrientation}/100 (${getWeightLabel(classifications.strategyWeights.growthOrientation)})`}
          />
          <PrintRow
            label="Complexity Tolerance"
            value={`${classifications.strategyWeights.complexityTolerance}/100 (${getWeightLabel(classifications.strategyWeights.complexityTolerance)})`}
          />
          <PrintRow
            label="Flexibility"
            value={`${classifications.strategyWeights.flexibility}/100 (${getWeightLabel(classifications.strategyWeights.flexibility)})`}
          />
          <PrintRow
            label="Advisor Dependence"
            value={`${classifications.strategyWeights.advisorDependence}/100 (${getWeightLabel(classifications.strategyWeights.advisorDependence)})`}
          />
        </div>
      </section>

      {/* Upcoming Decisions */}
      {classifications.upcomingDecisionWindows.length > 0 && (
        <section className="print-section mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Upcoming Decisions
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1 font-medium">Decision</th>
                <th className="text-left py-1 font-medium">Timeframe</th>
                <th className="text-left py-1 font-medium">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {classifications.upcomingDecisionWindows.map((w, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-1">{w.decision}</td>
                  <td className="py-1">{w.timeframe}</td>
                  <td className="py-1 capitalize">{w.urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
        <p>Generated by Pathfinder - Financial Decision Platform</p>
        <p>This profile is for planning purposes only and does not constitute financial advice.</p>
      </footer>
    </div>
  );
}

/** Helper component for print rows */
function PrintRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex">
      <span className="font-medium w-40 flex-shrink-0">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

/** Print button component */
export function PrintProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 no-print"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Profile
    </button>
  );
}
