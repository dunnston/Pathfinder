/**
 * Task Card Component
 * Displays an action recommendation with status tracking
 */

import { useState } from 'react';
import type { ActionRecommendation, ActionUrgency } from '@/types';
import type { TaskStatus, TrackedTask } from '@/types/dashboard';
import { TASK_STATUS_LABELS } from '@/types/dashboard';
import { PLANNING_DOMAIN_LABELS } from '@/types/strategyProfile';
import { useDashboardStore } from '@/stores';
import { Button } from '@/components/common';

interface TaskCardProps {
  /** The action recommendation */
  recommendation: ActionRecommendation;
  /** Optional tracked task state (if already tracking) */
  trackedTask?: TrackedTask;
  /** Whether to show compact version */
  compact?: boolean;
  /** Optional class name */
  className?: string;
}

const URGENCY_STYLES: Record<ActionUrgency, { badge: string; dot: string }> = {
  IMMEDIATE: {
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
  NEAR_TERM: {
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  MEDIUM_TERM: {
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  ONGOING: {
    badge: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
  },
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-400',
};


export function TaskCard({
  recommendation,
  trackedTask,
  compact = false,
  className = '',
}: TaskCardProps): JSX.Element {
  const { startTask, completeTask, dismissTask, resetTask } = useDashboardStore();
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(trackedTask?.notes || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const status = trackedTask?.status || 'not_started';
  const urgencyStyle = URGENCY_STYLES[recommendation.urgency];

  const handleStart = () => {
    startTask(recommendation.id);
  };

  const handleComplete = () => {
    if (trackedTask) {
      completeTask(trackedTask.id, notes || undefined);
    }
    setShowNotes(false);
  };

  const handleDismiss = () => {
    if (trackedTask) {
      dismissTask(trackedTask.id);
    } else {
      // Create task just to dismiss it
      startTask(recommendation.id);
      // After creating, we need to dismiss it - the task will be created with the action ID
      // So we can find and dismiss it in the next render
      setTimeout(() => {
        const store = useDashboardStore.getState();
        const task = store.getTaskByActionId(recommendation.id);
        if (task) {
          store.updateTaskStatus(task.id, 'dismissed');
        }
      }, 0);
    }
  };

  const handleReset = () => {
    if (trackedTask) {
      resetTask(trackedTask.id);
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border bg-white ${className}`}>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${urgencyStyle.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{recommendation.title}</p>
          <p className="text-xs text-gray-500">{PLANNING_DOMAIN_LABELS[recommendation.domain]}</p>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_STYLES[status]}`}>
          {TASK_STATUS_LABELS[status]}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${urgencyStyle.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">{recommendation.title}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${urgencyStyle.badge}`}>
                {recommendation.urgency}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_STYLES[status]}`}>
                {TASK_STATUS_LABELS[status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{PLANNING_DOMAIN_LABELS[recommendation.domain]}</p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600">{recommendation.description}</p>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
            {/* Rationale */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Why It Matters</h4>
              <p className="mt-1 text-sm text-gray-700">{recommendation.rationale}</p>
            </div>

            {/* Outcome */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">What You&apos;ll Achieve</h4>
              <p className="mt-1 text-sm text-gray-700">{recommendation.outcome}</p>
            </div>

            {/* Value & Goal Connections */}
            {(recommendation.valueConnections.length > 0 || recommendation.goalConnections.length > 0) && (
              <div className="flex flex-wrap gap-4">
                {recommendation.valueConnections.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Connected Values</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recommendation.valueConnections.map((value) => (
                        <span
                          key={value}
                          className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {recommendation.goalConnections.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Connected Goals</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recommendation.goalConnections.map((goal) => (
                        <span
                          key={goal}
                          className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timestamps */}
            {trackedTask && (
              <div className="text-xs text-gray-400 space-y-1">
                {trackedTask.startedAt && (
                  <p>Started: {new Date(trackedTask.startedAt).toLocaleDateString()}</p>
                )}
                {trackedTask.completedAt && (
                  <p>Completed: {new Date(trackedTask.completedAt).toLocaleDateString()}</p>
                )}
              </div>
            )}

            {/* Notes input for completing */}
            {showNotes && status === 'in_progress' && (
              <div className="pt-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Completion Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={2}
                  placeholder="Add any notes about what you did..."
                />
              </div>
            )}

            {/* Existing notes display */}
            {trackedTask?.notes && status === 'completed' && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</h4>
                <p className="mt-1 text-sm text-gray-700 italic">{trackedTask.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
        {status === 'not_started' && (
          <>
            <Button size="sm" onClick={handleStart}>
              Start Task
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Dismiss
            </Button>
          </>
        )}

        {status === 'in_progress' && (
          <>
            {showNotes ? (
              <>
                <Button size="sm" onClick={handleComplete}>
                  Save & Complete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNotes(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => setShowNotes(true)}>
                  Complete
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  Dismiss
                </Button>
              </>
            )}
          </>
        )}

        {status === 'completed' && (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Reopen
          </Button>
        )}

        {status === 'dismissed' && (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Restore
          </Button>
        )}
      </div>
    </div>
  );
}
