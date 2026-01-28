/**
 * DeviationAlerts Component
 * Displays inline warnings when asset classes exceed rebalance threshold
 */

import { useState, useMemo } from 'react';
import type { RebalanceRecommendation } from '@/types/dashboard';
import { ASSET_CLASS_LABELS } from '@/types/dashboard';
import { getDeviationSeverity } from '@/services/alertService';

// ============================================================
// TYPES
// ============================================================

export interface DeviationAlertsProps {
  /** Rebalance recommendations with deviation data */
  recommendations: RebalanceRecommendation[];
  /** Rebalance threshold percentage */
  threshold: number;
  /** Optional: compact mode for smaller display */
  compact?: boolean;
  /** Optional: maximum alerts to show before "show more" */
  maxVisible?: number;
}

type DeviationSeverity = 'warning' | 'critical';

interface DeviationItem extends RebalanceRecommendation {
  severity: DeviationSeverity;
}

// ============================================================
// STYLES
// ============================================================

const severityStyles: Record<DeviationSeverity, {
  border: string;
  bg: string;
  icon: string;
  badge: string;
}> = {
  warning: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    icon: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  critical: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
  },
};

// ============================================================
// ICONS
// ============================================================

function WarningIcon(): JSX.Element {
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

function CriticalIcon(): JSX.Element {
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

function ArrowUpIcon(): JSX.Element {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon(): JSX.Element {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function DeviationAlerts({
  recommendations,
  threshold,
  compact = false,
  maxVisible = 3,
}: DeviationAlertsProps): JSX.Element | null {
  const [expanded, setExpanded] = useState(false);

  // Filter to only items with deviations above threshold, add severity
  const deviationItems = useMemo((): DeviationItem[] => {
    return recommendations
      .map((rec) => {
        const severity = getDeviationSeverity(rec.deviation, threshold);
        if (severity === 'none') return null;
        return {
          ...rec,
          severity: severity as DeviationSeverity,
        };
      })
      .filter((item): item is DeviationItem => item !== null)
      .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));
  }, [recommendations, threshold]);

  // Count by severity
  const severityCounts = useMemo(() => {
    return deviationItems.reduce(
      (acc, item) => {
        acc[item.severity]++;
        return acc;
      },
      { warning: 0, critical: 0 }
    );
  }, [deviationItems]);

  // If no deviations, don't render anything
  if (deviationItems.length === 0) {
    return null;
  }

  const visibleItems = expanded ? deviationItems : deviationItems.slice(0, maxVisible);
  const hiddenCount = deviationItems.length - maxVisible;

  return (
    <section aria-labelledby="deviation-alerts-heading">
      <h3 id="deviation-alerts-heading" className="sr-only">
        Portfolio Deviation Alerts
      </h3>

      {/* Summary Header */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="font-medium text-gray-900">
          {deviationItems.length} asset class{deviationItems.length !== 1 ? 'es' : ''} out of balance
        </span>
        {severityCounts.critical > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
            {severityCounts.critical} critical
          </span>
        )}
        {severityCounts.warning > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {severityCounts.warning} warning
          </span>
        )}
      </div>

      {/* Alert List */}
      <div
        role="list"
        aria-live="polite"
        className={compact ? 'space-y-2' : 'space-y-3'}
      >
        {visibleItems.map((item) => {
          const styles = severityStyles[item.severity];
          const label = ASSET_CLASS_LABELS[item.assetClass] || item.assetClass;
          const isOverweight = item.deviation > 0;
          const deviationLabel = isOverweight ? 'overweight' : 'underweight';
          const ariaLabel = `${label}: ${item.severity} deviation of ${Math.abs(item.deviation).toFixed(1)}%, ${deviationLabel}, recommend ${item.action}`;

          if (compact) {
            return (
              <div
                key={item.assetClass}
                role="listitem"
                aria-label={ariaLabel}
                className={`flex items-center gap-3 rounded-lg border ${styles.border} ${styles.bg} p-3`}
              >
                <div className={`flex-shrink-0 ${styles.icon}`}>
                  {item.severity === 'critical' ? <CriticalIcon /> : <WarningIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center text-sm font-medium ${isOverweight ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverweight ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {Math.abs(item.deviation).toFixed(1)}%
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                    {item.action.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.assetClass}
              role="listitem"
              aria-label={ariaLabel}
              className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}
            >
              <div className="flex gap-3">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                  {item.severity === 'critical' ? <CriticalIcon /> : <WarningIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                      {item.severity === 'critical' ? 'Critical' : 'Warning'}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Current:</span>{' '}
                      <span className="font-medium">{item.currentPercentage.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>{' '}
                      <span className="font-medium">{item.targetPercentage.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deviation:</span>{' '}
                      <span className={`font-medium flex items-center gap-0.5 inline-flex ${isOverweight ? 'text-red-600' : 'text-green-600'}`}>
                        {isOverweight ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        {Math.abs(item.deviation).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Action:</span>{' '}
                      <span className={`font-medium ${item.action === 'sell' ? 'text-red-600' : item.action === 'buy' ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.action.toUpperCase()} ${item.actionAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-3 min-h-[44px] px-4 py-2 text-sm font-medium text-primary hover:text-primary/80
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors"
        >
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </section>
  );
}

export default DeviationAlerts;
