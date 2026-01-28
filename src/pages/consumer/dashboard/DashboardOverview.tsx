/**
 * Dashboard Overview Page
 * Central hub showing progress, alerts, and quick actions
 */

import { useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { OverviewCard, AlertCard } from '@/components/dashboard';
import { Button, LoadingSpinner } from '@/components/common';
import { useProfileStore, useDashboardStore, useUIStore } from '@/stores';
import { generateDiscoveryInsights } from '@/services/discoveryInsightsEngine';
import { generateSystemClassifications } from '@/services/classification';
import { DISCOVERY_SECTIONS } from '@/types';
import type { AlertUrgencyLevel, DecisionUrgency } from '@/types';

export function DashboardOverview(): JSX.Element {
  const { currentProfile, _hasHydrated: profileHydrated } = useProfileStore();
  const { alerts, trackedTasks, investmentPolicy, _hasHydrated: dashboardHydrated } = useDashboardStore();
  const { acknowledgeAlert, completeAlert, dismissAlert, checkAndTriggerAlerts } = useDashboardStore();
  const { addNotification } = useUIStore();

  // Track previous alert count to detect new alerts
  const prevAlertCountRef = useRef<number>(alerts.length);

  // Check and trigger any due alerts on mount
  useEffect(() => {
    if (dashboardHydrated) {
      checkAndTriggerAlerts();
    }
  }, [dashboardHydrated, checkAndTriggerAlerts]);

  // Show toast notification when new alerts are added
  useEffect(() => {
    const prevCount = prevAlertCountRef.current;
    const currentCount = alerts.filter((a) => !a.completedAt).length;

    if (currentCount > prevCount && dashboardHydrated) {
      const newAlerts = alerts
        .filter((a) => !a.completedAt)
        .slice(0, currentCount - prevCount);

      newAlerts.forEach((alert) => {
        const toastType = alert.urgency === 'urgent' ? 'warning' : 'info';
        addNotification({
          type: toastType,
          message: `New alert: ${alert.title}`,
          duration: 5000,
        });
      });
    }

    prevAlertCountRef.current = currentCount;
  }, [alerts, dashboardHydrated, addNotification]);

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    if (!currentProfile) return { completed: 0, total: DISCOVERY_SECTIONS.length, percentage: 0 };

    const completedSections = DISCOVERY_SECTIONS.filter((section) => {
      const sectionData = currentProfile[section.id as keyof typeof currentProfile];
      return sectionData !== undefined && sectionData !== null;
    }).length;

    return {
      completed: completedSections,
      total: DISCOVERY_SECTIONS.length,
      percentage: Math.round((completedSections / DISCOVERY_SECTIONS.length) * 100),
    };
  }, [currentProfile]);

  // Generate insights for recommendations
  const discoveryInsights = useMemo(() => {
    if (!currentProfile) return null;
    return generateDiscoveryInsights({
      basicContext: currentProfile.basicContext,
      valuesDiscovery: currentProfile.valuesDiscovery,
      financialGoals: currentProfile.financialGoals,
      financialPurpose: currentProfile.financialPurpose,
    });
  }, [currentProfile]);

  // Get top recommendations
  const topRecommendations = useMemo(() => {
    if (!discoveryInsights?.actions?.recommendations) return [];
    return discoveryInsights.actions.recommendations.slice(0, 3);
  }, [discoveryInsights]);

  // Get active alerts (not completed or acknowledged)
  const activeAlerts = useMemo(() => {
    return alerts.filter((a) => !a.completedAt).slice(0, 3);
  }, [alerts]);

  // Task stats
  const taskStats = useMemo(() => {
    const notStarted = trackedTasks.filter((t) => t.status === 'not_started').length;
    const inProgress = trackedTasks.filter((t) => t.status === 'in_progress').length;
    const completed = trackedTasks.filter((t) => t.status === 'completed').length;
    return { notStarted, inProgress, completed, total: trackedTasks.length };
  }, [trackedTasks]);

  // IPS summary
  const ipsSummary = useMemo(() => {
    if (!investmentPolicy) return null;
    const totalValue = investmentPolicy.accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    return {
      accountCount: investmentPolicy.accounts.length,
      totalValue,
      lastRebalance: investmentPolicy.lastRebalanceDate,
    };
  }, [investmentPolicy]);

  // System classifications for upcoming decisions
  const classifications = useMemo(() => {
    if (!currentProfile) return null;
    return generateSystemClassifications(currentProfile);
  }, [currentProfile]);

  // Upcoming decisions (limited to top 3)
  const upcomingDecisions = useMemo(() => {
    if (!classifications?.upcomingDecisionWindows) return [];
    return classifications.upcomingDecisionWindows.slice(0, 3);
  }, [classifications]);

  // Loading state
  if (!profileHydrated || !dashboardHydrated) {
    return (
      <DashboardLayout title="Dashboard">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Your financial planning overview"
    >
      <DashboardPage>
        {/* Welcome section for first-time users */}
        {!currentProfile && (
          <div className="mb-8 rounded-xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <h2 className="text-xl font-bold">Welcome to Pathfinder</h2>
            <p className="mt-2 text-primary-50">
              Start your financial discovery journey to get personalized insights and recommendations.
            </p>
            <Link to="/consumer/discovery">
              <Button variant="secondary" className="mt-4 bg-white text-primary hover:bg-gray-100">
                Start Discovery
              </Button>
            </Link>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  title={alert.title}
                  message={alert.message}
                  urgency={alert.urgency as AlertUrgencyLevel}
                  dueDate={alert.dueDate ? new Date(alert.dueDate).toLocaleDateString() : undefined}
                  actions={
                    <>
                      {!alert.acknowledgedAt && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => completeAlert(alert.id)}
                        className="text-xs font-medium text-green-600 hover:text-green-700"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600"
                      >
                        Dismiss
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Progress Card */}
          <OverviewCard
            title="Profile Progress"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            action={{ label: 'View Profile', href: '/consumer/profile' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {profileCompletion.percentage}%
                </span>
                <span className="text-gray-500">
                  {profileCompletion.completed} of {profileCompletion.total} sections
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
              {profileCompletion.percentage < 100 && (
                <Link
                  to="/consumer/discovery"
                  className="inline-block text-sm text-primary hover:text-primary-dark"
                >
                  Continue Discovery
                </Link>
              )}
            </div>
          </OverviewCard>

          {/* Recommendations Card */}
          <OverviewCard
            title="Top Recommendations"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
            action={{ label: 'View All', href: '/consumer/dashboard/recommendations' }}
          >
            {topRecommendations.length > 0 ? (
              <ul className="space-y-2">
                {topRecommendations.map((rec, i) => (
                  <li key={rec.id || i} className="flex items-start gap-2">
                    <span
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        rec.urgency === 'IMMEDIATE'
                          ? 'bg-red-500'
                          : rec.urgency === 'NEAR_TERM'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-gray-700 line-clamp-2">{rec.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Complete your discovery to get personalized recommendations.
              </p>
            )}
          </OverviewCard>

          {/* Focus Areas Card */}
          <OverviewCard
            title="Focus Areas"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            action={{ label: 'View All', href: '/consumer/dashboard/focus-areas' }}
          >
            {discoveryInsights?.focusAreas ? (
              <div className="space-y-2">
                {discoveryInsights.focusAreas.areas.slice(0, 3).map((area, i) => (
                  <div key={area.domain} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 capitalize">{area.domain.replace(/_/g, ' ')}</span>
                    <span
                      className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                        area.importance === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : area.importance === 'HIGH'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {area.importance.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Complete your discovery to see your priority focus areas.
              </p>
            )}
          </OverviewCard>

          {/* Upcoming Decisions Card */}
          <OverviewCard
            title="Upcoming Decisions"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            action={{ label: 'View Profile', href: '/consumer/profile' }}
          >
            {upcomingDecisions.length > 0 ? (
              <div className="space-y-2">
                {upcomingDecisions.map((decision, i) => {
                  const urgencyColors: Record<DecisionUrgency, string> = {
                    immediate: 'bg-red-100 text-red-700',
                    upcoming: 'bg-yellow-100 text-yellow-700',
                    future: 'bg-blue-100 text-blue-700',
                  };
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${urgencyColors[decision.urgency]}`}
                      >
                        {decision.urgency}
                      </span>
                      <span className="text-gray-700 text-sm line-clamp-2">{decision.decision}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                Complete your discovery to identify upcoming decisions.
              </p>
            )}
          </OverviewCard>

          {/* Investment Policy Card */}
          <OverviewCard
            title="Investment Policy"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            }
            action={{ label: 'Manage', href: '/consumer/dashboard/ips' }}
          >
            {ipsSummary ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Accounts</span>
                  <span className="font-medium text-gray-900">{ipsSummary.accountCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Value</span>
                  <span className="font-medium text-gray-900">
                    ${ipsSummary.totalValue.toLocaleString()}
                  </span>
                </div>
                {ipsSummary.lastRebalance && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Rebalance</span>
                    <span className="text-gray-600">
                      {new Date(ipsSummary.lastRebalance).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                Set up your investment policy to track accounts and allocations.
              </p>
            )}
          </OverviewCard>

          {/* Task Progress Card */}
          <OverviewCard
            title="Task Progress"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            action={{ label: 'View Tasks', href: '/consumer/dashboard/recommendations' }}
          >
            {taskStats.total > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-400">{taskStats.notStarted}</div>
                    <div className="text-xs text-gray-500">Not Started</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{taskStats.inProgress}</div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{taskStats.completed}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Start tracking recommendations to see your progress here.
              </p>
            )}
          </OverviewCard>

          {/* Settings Card */}
          <OverviewCard
            title="Settings"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            action={{ label: 'Configure', href: '/consumer/dashboard/settings' }}
          >
            <p className="text-gray-500">
              Customize notification frequencies, display preferences, and more.
            </p>
          </OverviewCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/consumer/discovery">
              <Button variant="secondary" size="sm">
                Continue Discovery
              </Button>
            </Link>
            <Link to="/consumer/insights">
              <Button variant="secondary" size="sm">
                View Full Insights
              </Button>
            </Link>
            <Link to="/consumer/dashboard/ips/accounts">
              <Button variant="secondary" size="sm">
                Add Account
              </Button>
            </Link>
            <Link to="/consumer/dashboard/ips/rebalance">
              <Button variant="secondary" size="sm">
                Check Rebalancing
              </Button>
            </Link>
          </div>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default DashboardOverview;
