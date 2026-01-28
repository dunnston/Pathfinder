/**
 * Overview Card Component
 * Reusable card component for dashboard overview sections
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface OverviewCardProps {
  /** Card title */
  title: string;
  /** Optional icon element */
  icon?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Optional action link */
  action?: {
    label: string;
    href: string;
  };
  /** Optional additional class names */
  className?: string;
  /** Optional loading state */
  isLoading?: boolean;
}

export function OverviewCard({
  title,
  icon,
  children,
  action,
  className = '',
  isLoading = false,
}: OverviewCardProps): JSX.Element {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <div className="text-sm text-gray-600">{children}</div>
        )}

        {action && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to={action.href}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {action.label}
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Optional change indicator */
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  /** Optional icon */
  icon?: ReactNode;
  /** Optional class name */
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  className = '',
}: StatCardProps): JSX.Element {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p
              className={`mt-1 text-sm ${
                change.type === 'increase'
                  ? 'text-green-600'
                  : change.type === 'decrease'
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {change.type === 'increase' && '↑ '}
              {change.type === 'decrease' && '↓ '}
              {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface AlertCardProps {
  /** Alert title */
  title: string;
  /** Alert message */
  message: string;
  /** Urgency level */
  urgency: 'info' | 'warning' | 'urgent';
  /** Optional due date */
  dueDate?: string;
  /** Optional action buttons */
  actions?: ReactNode;
  /** Optional class name */
  className?: string;
}

const urgencyStyles = {
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

export function AlertCard({
  title,
  message,
  urgency,
  dueDate,
  actions,
  className = '',
}: AlertCardProps): JSX.Element {
  const styles = urgencyStyles[urgency];

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4 ${className}`}>
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {urgency === 'urgent' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : urgency === 'warning' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
              {urgency === 'urgent' ? 'Urgent' : urgency === 'warning' ? 'Warning' : 'Info'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
          {dueDate && (
            <p className="mt-1 text-xs text-gray-500">Due: {dueDate}</p>
          )}
          {actions && (
            <div className="mt-3 flex gap-2">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
