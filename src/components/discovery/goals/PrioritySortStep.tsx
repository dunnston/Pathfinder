/**
 * Priority Sort Step Component
 * Phase 3: User sorts goals into priority buckets (High/Medium/Low/NA)
 */

import { useMemo, useCallback } from 'react';
import type { FinancialGoal, GoalPriority } from '@/types/financialGoals';
import { PRIORITY_DISPLAY } from '@/data/goalCards';
import { Button } from '@/components/common';

interface PrioritySortStepProps {
  goals: FinancialGoal[];
  onPriorityChange: (goalId: string, priority: GoalPriority) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

const PRIORITY_ORDER: GoalPriority[] = ['HIGH', 'MEDIUM', 'LOW', 'NA'];

const PRIORITY_COLORS: Record<GoalPriority, { bg: string; border: string; text: string; button: string }> = {
  HIGH: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    button: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200',
  },
  MEDIUM: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200',
  },
  LOW: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200',
  },
  NA: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    button: 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200',
  },
};

export function PrioritySortStep({
  goals,
  onPriorityChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: PrioritySortStepProps): JSX.Element {
  // Group goals by priority
  const goalsByPriority = useMemo(() => {
    const groups: Record<GoalPriority, FinancialGoal[]> = {
      HIGH: [],
      MEDIUM: [],
      LOW: [],
      NA: [],
    };
    goals.forEach((goal) => {
      groups[goal.priority].push(goal);
    });
    return groups;
  }, [goals]);

  // Count unsorted goals
  const unsortedCount = goalsByPriority.NA.length;
  const allSorted = unsortedCount === 0;

  const handlePrioritySelect = useCallback(
    (goalId: string, priority: GoalPriority) => {
      onPriorityChange(goalId, priority);
    },
    [onPriorityChange]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isAdvisorMode ? 'Prioritize Goals' : 'Prioritize Your Goals'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "If the client had to decide where their financial energy should go first, how would they sort these?"
            : "If you had to decide where your financial energy should go first, how would you sort these?"}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
        {allSorted ? (
          <span className="text-green-600 font-medium">
            All goals sorted! Review the buckets below.
          </span>
        ) : (
          <span className="text-gray-600">
            <span className="font-medium text-gray-900">{unsortedCount}</span> goal{unsortedCount !== 1 && 's'} to sort
          </span>
        )}
      </div>

      {/* Priority buckets */}
      <div className="space-y-6">
        {PRIORITY_ORDER.map((priority) => {
          const goalsInBucket = goalsByPriority[priority];
          const colors = PRIORITY_COLORS[priority];
          const display = PRIORITY_DISPLAY[priority];
          const isUnsorted = priority === 'NA';

          return (
            <div
              key={priority}
              className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4`}
            >
              {/* Bucket header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{display.emoji}</span>
                <h3 className={`font-semibold ${colors.text}`}>
                  {isUnsorted ? 'Unsorted' : display.label}
                </h3>
                <span className="text-sm text-gray-500">
                  ({goalsInBucket.length})
                </span>
              </div>

              {/* Goals in bucket */}
              {goalsInBucket.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  {isUnsorted
                    ? 'All goals have been sorted!'
                    : 'Drag goals here or click a goal below to assign this priority'}
                </p>
              ) : (
                <div className="space-y-2">
                  {goalsInBucket.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      currentPriority={priority}
                      onPrioritySelect={handlePrioritySelect}
                      isUnsorted={isUnsorted}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onComplete}
          variant="primary"
          disabled={!allSorted}
        >
          {allSorted ? 'Continue to Timing' : 'Sort All Goals First'}
        </Button>
      </div>
    </div>
  );
}

/** Individual goal card with priority selection */
interface GoalCardProps {
  goal: FinancialGoal;
  currentPriority: GoalPriority;
  onPrioritySelect: (goalId: string, priority: GoalPriority) => void;
  isUnsorted: boolean;
}

function GoalCard({
  goal,
  currentPriority,
  onPrioritySelect,
  isUnsorted,
}: GoalCardProps): JSX.Element {
  const otherPriorities = PRIORITY_ORDER.filter((p) => p !== currentPriority);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
      <div className="flex items-center justify-between gap-3">
        {/* Goal label */}
        <div className="flex-1 min-w-0">
          <span className="text-gray-900">{goal.label}</span>
          {goal.source === 'user' && (
            <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              Personal
            </span>
          )}
        </div>

        {/* Priority buttons */}
        <div className="flex gap-1 flex-shrink-0">
          {(isUnsorted ? PRIORITY_ORDER.filter((p) => p !== 'NA') : otherPriorities).map((priority) => {
            const colors = PRIORITY_COLORS[priority];
            const display = PRIORITY_DISPLAY[priority];
            return (
              <button
                key={priority}
                onClick={() => onPrioritySelect(goal.id, priority)}
                className={`
                  px-2 py-1 text-xs font-medium rounded border transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                  ${colors.button}
                `}
                title={display.label}
                aria-label={`Set ${goal.label} to ${display.label}`}
              >
                {display.emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
