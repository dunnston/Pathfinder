/**
 * FlexibilityTestStep Component
 * Phase 5: Test goal flexibility for high priority goals
 * Determines which goals are Fixed (must happen), Flexible (can adjust), or Deferrable (can postpone)
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/common';
import type { FinancialGoal, GoalFlexibility } from '@/types/financialGoals';

interface FlexibilityTestStepProps {
  goals: FinancialGoal[];
  onFlexibilityChange: (goalId: string, flexibility: GoalFlexibility) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

const FLEXIBILITY_OPTIONS: { value: GoalFlexibility; label: string; description: string; color: 'red' | 'amber' | 'green' }[] = [
  {
    value: 'FIXED',
    label: 'Non-negotiable',
    description: 'This must happen as planned, regardless of other goals',
    color: 'red',
  },
  {
    value: 'FLEXIBLE',
    label: 'Important but flexible',
    description: 'This matters, but timing or specifics can adjust if needed',
    color: 'amber',
  },
  {
    value: 'DEFERRABLE',
    label: 'Would delay if needed',
    description: 'This can be postponed to achieve higher priorities',
    color: 'green',
  },
];

export function FlexibilityTestStep({
  goals,
  onFlexibilityChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: FlexibilityTestStepProps): JSX.Element {
  // Filter to only high priority goals
  const highPriorityGoals = useMemo(() =>
    goals.filter((g) => g.priority === 'HIGH'),
    [goals]
  );

  // Track current goal index
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Start at first goal without flexibility set
    const firstUnset = highPriorityGoals.findIndex((g) => !g.flexibility);
    return firstUnset >= 0 ? firstUnset : 0;
  });

  const currentGoal = highPriorityGoals[currentIndex];

  const answeredCount = highPriorityGoals.filter((g) => g.flexibility).length;
  const isAllAnswered = answeredCount === highPriorityGoals.length;
  const progress = highPriorityGoals.length > 0
    ? Math.round((answeredCount / highPriorityGoals.length) * 100)
    : 100;

  const handleSelect = (flexibility: GoalFlexibility): void => {
    if (!currentGoal) return;
    onFlexibilityChange(currentGoal.id, flexibility);

    // Auto-advance to next unanswered goal
    if (currentIndex < highPriorityGoals.length - 1) {
      const nextUnset = highPriorityGoals.findIndex((g, i) => i > currentIndex && !g.flexibility);
      if (nextUnset >= 0) {
        setCurrentIndex(nextUnset);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < highPriorityGoals.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // No high priority goals - skip this step
  if (highPriorityGoals.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No High Priority Goals
          </h2>
          <p className="text-gray-600">
            {isAdvisorMode
              ? "The client hasn't marked any goals as high priority."
              : "You haven't marked any goals as high priority."}
            {' '}This step requires at least one high priority goal.
          </p>
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back to Time Horizons
          </Button>
          <Button onClick={onComplete}>
            Continue to Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Goal Flexibility Test
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Determine how flexible the client is with each high-priority goal."
            : 'Determine how flexible you are with each of your high-priority goals.'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          This helps identify which goals define {isAdvisorMode ? 'their' : 'your'} strategy vs. which are aspirational.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Goal {currentIndex + 1} of {highPriorityGoals.length}
          </span>
          <span className="text-gray-500">{progress}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Goal card */}
      {currentGoal && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
              High Priority
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentGoal.label}
            </h3>
            {currentGoal.timeHorizon && (
              <p className="text-sm text-gray-500 mt-1">
                Time horizon: {currentGoal.timeHorizon === 'SHORT' ? 'Short-term (1-3 years)' :
                  currentGoal.timeHorizon === 'MID' ? 'Mid-term (3-7 years)' :
                  currentGoal.timeHorizon === 'LONG' ? 'Long-term (7+ years)' : 'Ongoing'}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            {isAdvisorMode
              ? "If achieving this goal required adjusting other plans, how flexible is the client with this goal?"
              : 'If achieving this goal required adjusting other plans, how flexible are you with this goal?'}
          </p>

          <div className="space-y-3">
            {FLEXIBILITY_OPTIONS.map((option) => {
              const isSelected = currentGoal.flexibility === option.value;
              const colorClasses = {
                red: isSelected ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'hover:border-red-200',
                amber: isSelected ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'hover:border-amber-200',
                green: isSelected ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'hover:border-green-200',
              };

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    ${isSelected ? colorClasses[option.color] : `border-gray-200 ${colorClasses[option.color]}`}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
                        ${isSelected
                          ? option.color === 'red' ? 'border-red-500 bg-red-500' :
                            option.color === 'amber' ? 'border-amber-500 bg-amber-500' :
                            'border-green-500 bg-green-500'
                          : 'border-gray-300'
                        }
                      `}
                    >
                      {isSelected && (
                        <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal dots */}
      <div className="flex justify-center gap-2">
        {highPriorityGoals.map((goal, idx) => {
          const hasFlexibility = !!goal.flexibility;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={goal.id}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${isCurrent
                  ? 'bg-primary scale-125'
                  : hasFlexibility
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
              aria-label={`Go to goal ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            Back to Time Horizons
          </Button>
          {currentIndex > 0 && (
            <Button variant="secondary" onClick={handlePrevious}>
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentIndex < highPriorityGoals.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!currentGoal?.flexibility}
            >
              Next Goal
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              disabled={!isAllAnswered}
            >
              Continue to Summary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
