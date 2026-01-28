/**
 * Alerts Panel Component
 * Displays a list of alerts with filtering and actions
 */

import { useState, useMemo } from 'react';
import { AlertItem } from './AlertItem';
import type { Alert, AlertType, AlertUrgencyLevel } from '@/types/dashboard';

interface AlertsPanelProps {
  /** List of alerts to display */
  alerts: Alert[];
  /** Callback when an alert is acknowledged */
  onAcknowledge?: (alertId: string) => void;
  /** Callback when an alert is completed */
  onComplete?: (alertId: string) => void;
  /** Callback when an alert is dismissed */
  onDismiss?: (alertId: string) => void;
  /** Optional title for the panel */
  title?: string;
  /** Whether to show completed alerts */
  showCompleted?: boolean;
  /** Maximum number of alerts to display (0 = unlimited) */
  maxAlerts?: number;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Optional additional class name */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
}

type FilterType = 'all' | AlertType;
type UrgencyFilter = 'all' | AlertUrgencyLevel;

export function AlertsPanel({
  alerts,
  onAcknowledge,
  onComplete,
  onDismiss,
  title = 'Alerts',
  showCompleted = false,
  maxAlerts = 0,
  showFilters = false,
  className = '',
  emptyMessage = 'No alerts to display.',
}: AlertsPanelProps): JSX.Element {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Filter out completed if not showing them
    if (!showCompleted) {
      filtered = filtered.filter((a) => !a.completedAt);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }

    // Apply urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter((a) => a.urgency === urgencyFilter);
    }

    // Sort by urgency (urgent first, then warning, then info)
    filtered.sort((a, b) => {
      const urgencyOrder: Record<AlertUrgencyLevel, number> = {
        urgent: 0,
        warning: 1,
        info: 2,
      };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    // Limit if maxAlerts is set
    if (maxAlerts > 0) {
      filtered = filtered.slice(0, maxAlerts);
    }

    return filtered;
  }, [alerts, showCompleted, typeFilter, urgencyFilter, maxAlerts]);

  // Count stats
  const alertStats = useMemo(() => {
    const activeAlerts = alerts.filter((a) => !a.completedAt);
    return {
      total: activeAlerts.length,
      urgent: activeAlerts.filter((a) => a.urgency === 'urgent').length,
      warning: activeAlerts.filter((a) => a.urgency === 'warning').length,
      info: activeAlerts.filter((a) => a.urgency === 'info').length,
    };
  }, [alerts]);

  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {alertStats.total > 0 && (
              <div className="flex items-center gap-2">
                {alertStats.urgent > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    {alertStats.urgent} urgent
                  </span>
                )}
                {alertStats.warning > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    {alertStats.warning} warning
                  </span>
                )}
              </div>
            )}
          </div>
          {alertStats.total > 0 && (
            <span className="text-sm text-gray-500">
              {alertStats.total} active alert{alertStats.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Filters */}
        {showFilters && alerts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="rebalance_due">Rebalance Due</option>
              <option value="beneficiary_review">Beneficiary Review</option>
              <option value="annual_review">Annual Review</option>
              <option value="action_reminder">Action Reminder</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as UrgencyFilter)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Urgencies</option>
              <option value="urgent">Urgent</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="p-4">
        {filteredAlerts.length > 0 ? (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={onAcknowledge}
                onComplete={onComplete}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;
