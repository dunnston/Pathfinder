/**
 * DecisionWindowsList Component
 * Displays upcoming decision windows with urgency indicators
 */

import type { DecisionWindow, DecisionUrgency } from '@/types/systemClassifications';
import { Card } from '@/components/common';

interface DecisionWindowsListProps {
  windows: DecisionWindow[];
}

const urgencyConfig: Record<DecisionUrgency, { label: string; color: string; bgColor: string }> = {
  immediate: {
    label: 'Immediate',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  upcoming: {
    label: 'Upcoming',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  future: {
    label: 'Future',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
};

export function DecisionWindowsList({ windows }: DecisionWindowsListProps) {
  if (windows.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Decisions</h3>
        <p className="text-gray-500">No immediate decisions identified based on your profile.</p>
      </Card>
    );
  }

  // Group by urgency
  const groupedWindows = windows.reduce(
    (acc, window) => {
      if (!acc[window.urgency]) {
        acc[window.urgency] = [];
      }
      acc[window.urgency].push(window);
      return acc;
    },
    {} as Record<DecisionUrgency, DecisionWindow[]>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Decisions</h3>
      <p className="text-sm text-gray-600 mb-6">
        Key decisions identified based on your timeline and situation.
      </p>

      <div className="space-y-6">
        {(['immediate', 'upcoming', 'future'] as DecisionUrgency[]).map((urgency) => {
          const windowsInGroup = groupedWindows[urgency];
          if (!windowsInGroup || windowsInGroup.length === 0) return null;

          const config = urgencyConfig[urgency];

          return (
            <div key={urgency}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}
                >
                  {config.label}
                </span>
                <span className="text-sm text-gray-500">
                  {windowsInGroup.length} decision{windowsInGroup.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {windowsInGroup.map((window, index) => (
                  <DecisionWindowCard key={index} window={window} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

interface DecisionWindowCardProps {
  window: DecisionWindow;
}

function DecisionWindowCard({ window }: DecisionWindowCardProps) {
  const config = urgencyConfig[window.urgency];

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{window.decision}</h4>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">Timeframe:</span> {window.timeframe}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      {window.relatedStrategies.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Related strategies:</p>
          <div className="flex flex-wrap gap-1">
            {window.relatedStrategies.map((strategy, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {strategy}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Timeline view of decision windows */
export function DecisionWindowsTimeline({ windows }: DecisionWindowsListProps) {
  if (windows.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {windows.map((window, index) => {
          const config = urgencyConfig[window.urgency];
          return (
            <div key={index} className="relative flex items-start pl-10">
              <div
                className={`absolute left-2.5 w-3 h-3 rounded-full ${config.bgColor} border-2 border-white`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{window.decision}</p>
                <p className="text-xs text-gray-500">{window.timeframe}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
