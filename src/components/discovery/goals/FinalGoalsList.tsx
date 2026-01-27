/**
 * Final Goals List Component
 * Phase 6: Summary of goals with core planning goals highlighted
 * Users can toggle which goals are considered "core planning goals"
 */

import { useMemo } from 'react';
import type { FinancialGoal } from '@/types/financialGoals';
import { PRIORITY_DISPLAY, TIME_HORIZON_DISPLAY } from '@/data/goalCards';
import { Button } from '@/components/common';

interface FinalGoalsListProps {
  allGoals: FinancialGoal[];
  onCoreToggle: (goalId: string, isCore: boolean) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function FinalGoalsList({
  allGoals,
  onCoreToggle,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: FinalGoalsListProps): JSX.Element {
  // Separate core planning goals from others
  const { coreGoals, otherGoals } = useMemo(() => {
    const core: FinancialGoal[] = [];
    const other: FinancialGoal[] = [];
    allGoals.forEach((goal) => {
      if (goal.isCorePlanningGoal) {
        core.push(goal);
      } else {
        other.push(goal);
      }
    });
    // Sort core goals by priority then time horizon
    core.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, NA: 3 };
      const timeOrder = { SHORT: 0, MID: 1, LONG: 2, ONGOING: 3 };
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      const aTime = a.timeHorizon ? timeOrder[a.timeHorizon] : 4;
      const bTime = b.timeHorizon ? timeOrder[b.timeHorizon] : 4;
      return aTime - bTime;
    });
    // Sort other goals by priority
    other.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, NA: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return { coreGoals: core, otherGoals: other };
  }, [allGoals]);

  // Count goals by priority
  const goalCounts = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0, NA: 0 };
    allGoals.forEach((goal) => {
      counts[goal.priority]++;
    });
    return counts;
  }, [allGoals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isAdvisorMode ? 'Goal Summary' : 'Your Financial Goals'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "These are the goals that will guide the client's financial plan. Verify the core planning goals below."
            : "These are the goals your financial plan will focus on first. Does this feel right?"}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{goalCounts.HIGH}</div>
          <div className="text-sm text-red-600">High Priority</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{goalCounts.MEDIUM}</div>
          <div className="text-sm text-yellow-600">Medium Priority</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{goalCounts.LOW}</div>
          <div className="text-sm text-blue-600">Low Priority</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{coreGoals.length}</div>
          <div className="text-sm text-primary">Core Planning</div>
        </div>
      </div>

      {/* Core planning goals section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Core Planning Goals
          </h3>
          <span className="text-sm text-gray-500">
            {coreGoals.length} goal{coreGoals.length !== 1 && 's'}
          </span>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          {coreGoals.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No core planning goals selected yet. Add goals from below.
            </p>
          ) : (
            <div className="space-y-2">
              {coreGoals.map((goal) => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  isCore={true}
                  onToggle={(isCore) => onCoreToggle(goal.id, isCore)}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Core planning goals are HIGH priority with SHORT or MID-term horizons.
          Click the star to add or remove goals from core planning.
        </p>
      </div>

      {/* Other goals section */}
      {otherGoals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Other Goals
            </h3>
            <span className="text-sm text-gray-500">
              {otherGoals.length} goal{otherGoals.length !== 1 && 's'}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="space-y-2">
              {otherGoals.map((goal) => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  isCore={false}
                  onToggle={(isCore) => onCoreToggle(goal.id, isCore)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onComplete} variant="primary">
          Complete Goal Discovery
        </Button>
      </div>
    </div>
  );
}

/** Individual goal row with core toggle */
interface GoalRowProps {
  goal: FinancialGoal;
  isCore: boolean;
  onToggle: (isCore: boolean) => void;
}

function GoalRow({ goal, isCore, onToggle }: GoalRowProps): JSX.Element {
  const priorityDisplay = PRIORITY_DISPLAY[goal.priority];
  const timeDisplay = goal.timeHorizon ? TIME_HORIZON_DISPLAY[goal.timeHorizon] : null;

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2">
      {/* Core toggle (star) */}
      <button
        onClick={() => onToggle(!isCore)}
        className={`
          flex-shrink-0 p-1 rounded transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
          ${isCore ? 'text-primary' : 'text-gray-300 hover:text-gray-400'}
        `}
        aria-label={isCore ? 'Remove from core planning goals' : 'Add to core planning goals'}
        aria-pressed={isCore}
      >
        <svg
          className="w-5 h-5"
          fill={isCore ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      {/* Goal info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{goal.label}</span>
          {goal.source === 'user' && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
              Personal
            </span>
          )}
        </div>
      </div>

      {/* Priority & time badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: goal.priority === 'HIGH' ? '#FEE2E2' :
                           goal.priority === 'MEDIUM' ? '#FEF3C7' :
                           goal.priority === 'LOW' ? '#DBEAFE' : '#F3F4F6',
            color: goal.priority === 'HIGH' ? '#B91C1C' :
                   goal.priority === 'MEDIUM' ? '#B45309' :
                   goal.priority === 'LOW' ? '#1D4ED8' : '#6B7280',
          }}
        >
          {priorityDisplay.emoji} {goal.priority}
        </span>
        {timeDisplay && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {timeDisplay.years}
          </span>
        )}
      </div>
    </div>
  );
}
