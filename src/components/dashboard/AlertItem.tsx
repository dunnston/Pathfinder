/**
 * Alert Item Component
 * Standalone component for displaying a single alert with actions
 */

import type { Alert, AlertUrgencyLevel } from '@/types/dashboard';

interface AlertItemProps {
  /** The alert to display */
  alert: Alert;
  /** Callback when alert is acknowledged */
  onAcknowledge?: (alertId: string) => void;
  /** Callback when alert is completed */
  onComplete?: (alertId: string) => void;
  /** Callback when alert is dismissed */
  onDismiss?: (alertId: string) => void;
  /** Optional additional class name */
  className?: string;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Compact mode for smaller display */
  compact?: boolean;
}

const urgencyStyles: Record<AlertUrgencyLevel, {
  border: string;
  bg: string;
  icon: string;
  badge: string;
}> = {
  info: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  warning: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    icon: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  urgent: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
  },
};

function AlertIcon({ urgency }: { urgency: AlertUrgencyLevel }): JSX.Element {
  if (urgency === 'urgent') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  }

  if (urgency === 'warning') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function AlertItem({
  alert,
  onAcknowledge,
  onComplete,
  onDismiss,
  className = '',
  showActions = true,
  compact = false,
}: AlertItemProps): JSX.Element {
  const styles = urgencyStyles[alert.urgency];
  const isAcknowledged = !!alert.acknowledgedAt;
  const isCompleted = !!alert.completedAt;

  const formattedDueDate = alert.dueDate
    ? new Date(alert.dueDate).toLocaleDateString()
    : undefined;

  const formattedCreatedDate = alert.createdAt
    ? new Date(alert.createdAt).toLocaleDateString()
    : undefined;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border ${styles.border} ${styles.bg} p-3 ${className}`}
      >
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <AlertIcon urgency={alert.urgency} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
          {alert.urgency === 'urgent' ? 'Urgent' : alert.urgency === 'warning' ? 'Warning' : 'Info'}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4 ${className}`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <AlertIcon urgency={alert.urgency} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
              {alert.urgency === 'urgent' ? 'Urgent' : alert.urgency === 'warning' ? 'Warning' : 'Info'}
            </span>
            {isAcknowledged && !isCompleted && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                Acknowledged
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Completed
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {formattedDueDate && (
              <span>Due: {formattedDueDate}</span>
            )}
            {formattedCreatedDate && (
              <span>Created: {formattedCreatedDate}</span>
            )}
            {alert.frequency && (
              <span className="capitalize">Recurs: {alert.frequency.replace('_', ' ')}</span>
            )}
          </div>

          {showActions && !isCompleted && (
            <div className="mt-3 flex flex-wrap gap-2">
              {!isAcknowledged && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {onComplete && (
                <button
                  onClick={() => onComplete(alert.id)}
                  className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertItem;
