/**
 * Confirm Inputs Step Component (Step 1)
 * Shows values and goals from previous sections for confirmation
 */

import { Button } from '@/components/common';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import { VALUE_CARDS } from '@/data/valueCards';

interface ConfirmInputsStepProps {
  valuesData?: ValuesDiscovery;
  goalsData?: FinancialGoals;
  onComplete: () => void;
  isAdvisorMode: boolean;
}

export function ConfirmInputsStep({
  valuesData,
  goalsData,
  onComplete,
  isAdvisorMode,
}: ConfirmInputsStepProps): JSX.Element {
  // Check if prerequisites are met
  const hasValues = valuesData?.state === 'COMPLETED' && valuesData.top5 && valuesData.top5.length > 0;
  const hasGoals = goalsData?.state === 'COMPLETED' && goalsData.coreGoals && goalsData.coreGoals.length > 0;
  const canProceed = hasValues && hasGoals;

  // Get top 5 value cards
  const top5Values = hasValues
    ? valuesData.top5.map((id) => VALUE_CARDS.find((card) => card.id === id)).filter(Boolean)
    : [];

  // Get non-negotiables
  const nonNegotiables = valuesData?.nonNegotiables || [];
  const nonNegotiableValues = nonNegotiables
    .map((id) => VALUE_CARDS.find((card) => card.id === id))
    .filter(Boolean);

  // Get core goals
  const coreGoals = goalsData?.coreGoals || [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isAdvisorMode ? "Review Client's Foundation" : 'Review Your Foundation'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "These values and goals will shape the client's purpose statement."
            : 'Your purpose statement will build on these values and goals.'}
        </p>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Core Values</h3>
            <p className="text-sm text-gray-500">
              {hasValues ? `${top5Values.length} top values identified` : 'Not yet completed'}
            </p>
          </div>
        </div>

        {hasValues ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {top5Values.map((value) => (
                <span
                  key={value!.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-medium"
                >
                  {value!.title}
                </span>
              ))}
            </div>
            {nonNegotiableValues.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Non-negotiables:</p>
                <div className="flex flex-wrap gap-2">
                  {nonNegotiableValues.map((value) => (
                    <span
                      key={value!.id}
                      className="inline-flex items-center px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-medium"
                    >
                      {value!.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 text-amber-800 rounded-lg p-4 text-sm">
            <strong>Values Discovery not completed.</strong> Complete the Values Discovery section first to build a strong purpose statement.
          </div>
        )}
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Core Goals</h3>
            <p className="text-sm text-gray-500">
              {hasGoals ? `${coreGoals.length} core planning goals` : 'Not yet completed'}
            </p>
          </div>
        </div>

        {hasGoals ? (
          <div className="space-y-2">
            {coreGoals.slice(0, 5).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-blue-900 flex-1">{goal.label}</span>
                {goal.priority === 'HIGH' && (
                  <span className="text-xs text-blue-600 font-medium whitespace-nowrap">High Priority</span>
                )}
              </div>
            ))}
            {coreGoals.length > 5 && (
              <p className="text-xs text-gray-500 pl-5">
                + {coreGoals.length - 5} more goals
              </p>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 text-amber-800 rounded-lg p-4 text-sm">
            <strong>Financial Goals not completed.</strong> Complete the Financial Goals section first to build a strong purpose statement.
          </div>
        )}
      </div>

      {/* Warning if prerequisites not met */}
      {!canProceed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-amber-900 mb-2">
            Prerequisites Required
          </h3>
          <p className="text-amber-700 text-sm mb-4">
            To write a strong purpose statement, please complete:
          </p>
          <ul className="text-left text-sm text-amber-700 space-y-2 inline-block">
            {!hasValues && (
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Values Discovery section
              </li>
            )}
            {!hasGoals && (
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Financial Goals section
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onComplete}
          disabled={!canProceed}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
