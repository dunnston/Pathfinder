/**
 * Time Horizon Step Component
 * Phase 4: User assigns time horizons to HIGH and MEDIUM priority goals
 */

import { useMemo, useCallback } from 'react';
import type { FinancialGoal, GoalTimeHorizon } from '@/types/financialGoals';
import { TIME_HORIZON_DISPLAY, PRIORITY_DISPLAY } from '@/data/goalCards';
import { Button } from '@/components/common';

interface TimeHorizonStepProps {
  goals: FinancialGoal[];
  onTimeHorizonChange: (goalId: string, timeHorizon: GoalTimeHorizon) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

const TIME_HORIZONS: GoalTimeHorizon[] = ['SHORT', 'MID', 'LONG', 'ONGOING'];

const HORIZON_COLORS: Record<GoalTimeHorizon, { bg: string; border: string; text: string }> = {
  SHORT: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-700',
  },
  MID: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  LONG: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  ONGOING: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
};

export function TimeHorizonStep({
  goals,
  onTimeHorizonChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: TimeHorizonStepProps): JSX.Element {
  // Separate goals by priority (HIGH goals first, then MEDIUM)
  const { highPriorityGoals, mediumPriorityGoals } = useMemo(() => {
    const high: FinancialGoal[] = [];
    const medium: FinancialGoal[] = [];
    goals.forEach((goal) => {
      if (goal.priority === 'HIGH') {
        high.push(goal);
      } else if (goal.priority === 'MEDIUM') {
        medium.push(goal);
      }
    });
    return { highPriorityGoals: high, mediumPriorityGoals: medium };
  }, [goals]);

  // Count goals without time horizon
  const unassignedCount = goals.filter((g) => !g.timeHorizon).length;
  const allAssigned = unassignedCount === 0;

  const handleTimeHorizonSelect = useCallback(
    (goalId: string, timeHorizon: GoalTimeHorizon) => {
      onTimeHorizonChange(goalId, timeHorizon);
    },
    [onTimeHorizonChange]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isAdvisorMode ? 'Set Time Horizons' : 'When Do You Want to Achieve These?'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "For each high and medium priority goal, specify when the client ideally wants to achieve it."
            : "For each of your priority goals, specify when you'd ideally like to achieve it."}
        </p>
      </div>

      {/* Time horizon legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {TIME_HORIZONS.map((horizon) => {
          const display = TIME_HORIZON_DISPLAY[horizon];
          const colors = HORIZON_COLORS[horizon];
          return (
            <div
              key={horizon}
              className={`px-3 py-1.5 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {display.label}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
        {allAssigned ? (
          <span className="text-green-600 font-medium">
            All time horizons set!
          </span>
        ) : (
          <span className="text-gray-600">
            <span className="font-medium text-gray-900">{unassignedCount}</span> goal{unassignedCount !== 1 && 's'} need timing
          </span>
        )}
      </div>

      {/* High priority goals */}
      {highPriorityGoals.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>{PRIORITY_DISPLAY.HIGH.emoji}</span>
            High Priority Goals
          </h3>
          <div className="space-y-3">
            {highPriorityGoals.map((goal) => (
              <GoalTimeCard
                key={goal.id}
                goal={goal}
                onTimeHorizonSelect={handleTimeHorizonSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Medium priority goals */}
      {mediumPriorityGoals.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>{PRIORITY_DISPLAY.MEDIUM.emoji}</span>
            Medium Priority Goals
          </h3>
          <div className="space-y-3">
            {mediumPriorityGoals.map((goal) => (
              <GoalTimeCard
                key={goal.id}
                goal={goal}
                onTimeHorizonSelect={handleTimeHorizonSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* No goals message */}
      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No high or medium priority goals to set timing for.</p>
          <p className="text-sm mt-1">You can go back and adjust your priorities.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onComplete}
          variant="primary"
          disabled={!allAssigned}
        >
          {allAssigned ? 'View Summary' : 'Set All Timings First'}
        </Button>
      </div>
    </div>
  );
}

/** Individual goal card with time horizon selection */
interface GoalTimeCardProps {
  goal: FinancialGoal;
  onTimeHorizonSelect: (goalId: string, timeHorizon: GoalTimeHorizon) => void;
}

function GoalTimeCard({ goal, onTimeHorizonSelect }: GoalTimeCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* Goal label */}
      <div className="mb-3">
        <span className="text-gray-900 font-medium">{goal.label}</span>
        {goal.source === 'user' && (
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            Personal
          </span>
        )}
      </div>

      {/* Time horizon options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TIME_HORIZONS.map((horizon) => {
          const display = TIME_HORIZON_DISPLAY[horizon];
          const colors = HORIZON_COLORS[horizon];
          const isSelected = goal.timeHorizon === horizon;

          return (
            <button
              key={horizon}
              onClick={() => onTimeHorizonSelect(goal.id, horizon)}
              className={`
                px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
              aria-pressed={isSelected}
            >
              <div className="text-center">
                <div>{display.years}</div>
                <div className="text-xs opacity-75">
                  {horizon === 'ONGOING' ? 'years' : 'years'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
