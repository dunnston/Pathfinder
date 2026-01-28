/**
 * Focus Areas Page
 * Display all planning domains ranked by priority with value/goal connections
 */

import { useMemo } from 'react';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { LoadingSpinner } from '@/components/common';
import { useProfileStore } from '@/stores';
import { generateDiscoveryInsights } from '@/services/discoveryInsightsEngine';
import type { PlanningFocusArea, PlanningDomain } from '@/types';
import { PLANNING_DOMAIN_LABELS } from '@/types/strategyProfile';

const DOMAIN_DESCRIPTIONS: Record<PlanningDomain, string> = {
  RETIREMENT_INCOME: 'Planning for financial independence and retirement income',
  INVESTMENT_STRATEGY: 'Building and managing investment portfolios',
  TAX_OPTIMIZATION: 'Optimizing tax efficiency across all financial decisions',
  INSURANCE_RISK: 'Managing insurance and protecting against financial risks',
  ESTATE_LEGACY: 'Protecting and transferring wealth to future generations',
  CASH_FLOW_DEBT: 'Managing income, expenses, savings, and debt',
  BENEFITS_OPTIMIZATION: 'Maximizing employer and government benefits',
  BUSINESS_CAREER: 'Business and career strategy planning',
  HEALTHCARE_LTC: 'Healthcare and long-term care planning',
};

const IMPORTANCE_STYLES = {
  CRITICAL: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    border: 'border-l-red-500',
    bg: 'bg-red-50',
  },
  HIGH: {
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-50',
  },
  MODERATE: {
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
  },
  LOW: {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    border: 'border-l-gray-400',
    bg: 'bg-gray-50',
  },
};

interface FocusAreaCardProps {
  area: PlanningFocusArea;
  isTopPriority: boolean;
}

function FocusAreaCard({ area, isTopPriority }: FocusAreaCardProps): JSX.Element {
  const styles = IMPORTANCE_STYLES[area.importance];

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm overflow-hidden ${
        isTopPriority ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className={`border-l-4 ${styles.border}`}>
        <div className={`p-4 sm:p-6 ${isTopPriority ? styles.bg : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                {area.priority}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {PLANNING_DOMAIN_LABELS[area.domain]}
                </h3>
                <p className="text-sm text-gray-500">{DOMAIN_DESCRIPTIONS[area.domain]}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles.badge}`}>
                {area.importance}
              </span>
              {isTopPriority && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Top Priority
                </span>
              )}
            </div>
          </div>

          {/* Rationale */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Why This Matters
            </h4>
            <p className="text-sm text-gray-700">{area.rationale}</p>
          </div>

          {/* Connections */}
          <div className="mt-4 flex flex-wrap gap-4">
            {area.valueConnections.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Connected Values
                </h4>
                <div className="flex flex-wrap gap-1">
                  {area.valueConnections.map((value) => (
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
            {area.goalConnections.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Connected Goals
                </h4>
                <div className="flex flex-wrap gap-1">
                  {area.goalConnections.map((goal) => (
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

          {/* Risk Factors */}
          {area.riskFactors && area.riskFactors.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h4 className="text-xs font-medium text-yellow-800 uppercase tracking-wide mb-1">
                Risk Factors to Consider
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {area.riskFactors.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">!</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FocusAreasPage(): JSX.Element {
  const { currentProfile, _hasHydrated } = useProfileStore();

  // Generate insights
  const discoveryInsights = useMemo(() => {
    if (!currentProfile) return null;
    return generateDiscoveryInsights({
      basicContext: currentProfile.basicContext,
      valuesDiscovery: currentProfile.valuesDiscovery,
      financialGoals: currentProfile.financialGoals,
      financialPurpose: currentProfile.financialPurpose,
    });
  }, [currentProfile]);

  // Get focus areas
  const focusAreas = useMemo(() => {
    if (!discoveryInsights?.focusAreas?.areas) return [];
    return discoveryInsights.focusAreas.areas;
  }, [discoveryInsights]);

  // Get top priorities
  const topPriorities = useMemo(() => {
    if (!discoveryInsights?.focusAreas?.topPriorities) return [];
    return discoveryInsights.focusAreas.topPriorities;
  }, [discoveryInsights]);

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Focus Areas">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading focus areas...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No profile state
  if (!currentProfile) {
    return (
      <DashboardLayout title="Focus Areas" subtitle="Your prioritized planning domains">
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Discovery First</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Start the discovery process to identify which planning areas matter most to you based on your values and goals.
            </p>
            <a
              href="/consumer/discovery"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Start Discovery
            </a>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No focus areas
  if (focusAreas.length === 0) {
    return (
      <DashboardLayout title="Focus Areas" subtitle="Your prioritized planning domains">
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Focus Areas Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Continue completing your discovery profile to generate focus area rankings.
            </p>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Focus Areas" subtitle="Your prioritized planning domains">
      <DashboardPage>
        {/* Summary */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 border border-primary/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Planning Priorities</h2>
          <p className="text-gray-600 mb-4">
            Based on your values, goals, and financial situation, here are your {focusAreas.length} planning
            domains ranked by importance. Focus on the top priorities first.
          </p>
          {topPriorities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Top Priorities:</span>
              {topPriorities.map((domain) => (
                <span
                  key={domain}
                  className="px-3 py-1 text-sm font-medium bg-primary text-white rounded-full"
                >
                  {PLANNING_DOMAIN_LABELS[domain]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Focus Area Cards */}
        <div className="space-y-4">
          {focusAreas.map((area) => (
            <FocusAreaCard
              key={area.domain}
              area={area}
              isTopPriority={topPriorities.includes(area.domain)}
            />
          ))}
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default FocusAreasPage;
