/**
 * Recommendations Page
 * Task tracking for action recommendations with tabs and filters
 */

import { useMemo, useState } from 'react';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { TaskList, TaskListHeader } from '@/components/dashboard/TaskList';
import { LoadingSpinner } from '@/components/common';
import { useProfileStore, useDashboardStore } from '@/stores';
import { generateDiscoveryInsights } from '@/services/discoveryInsightsEngine';
import type { ActionUrgency, PlanningDomain } from '@/types';
import type { TaskStatus, TrackedTask } from '@/types/dashboard';

type TabType = 'all' | 'not_started' | 'in_progress' | 'completed';

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'not_started', label: 'Not Started' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export function RecommendationsPage(): JSX.Element {
  const { currentProfile, _hasHydrated: profileHydrated } = useProfileStore();
  const { trackedTasks, settings, _hasHydrated: dashboardHydrated } = useDashboardStore();

  // Filter state
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [domainFilter, setDomainFilter] = useState<PlanningDomain | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<ActionUrgency | 'all'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'domain' | 'status'>('urgency');

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

  // Get all recommendations
  const recommendations = useMemo(() => {
    if (!discoveryInsights?.actions?.recommendations) return [];
    return discoveryInsights.actions.recommendations;
  }, [discoveryInsights]);

  // Build tracked tasks map
  const trackedTasksMap = useMemo(() => {
    const map = new Map<string, TrackedTask>();
    trackedTasks.forEach((task) => {
      map.set(task.actionId, task);
    });
    return map;
  }, [trackedTasks]);

  // Count tasks by status
  const statusCounts = useMemo(() => {
    const counts = { not_started: 0, in_progress: 0, completed: 0, dismissed: 0 };
    recommendations.forEach((rec) => {
      const task = trackedTasksMap.get(rec.id);
      const status: TaskStatus = task?.status || 'not_started';
      counts[status]++;
    });
    return counts;
  }, [recommendations, trackedTasksMap]);

  // Filter recommendations based on active tab and settings
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const task = trackedTasksMap.get(rec.id);
      const status: TaskStatus = task?.status || 'not_started';

      // Filter out dismissed unless showDismissedTasks is true
      if (status === 'dismissed' && !settings.showDismissedTasks) {
        return false;
      }

      // Filter out completed unless showCompletedTasks is true (for 'all' tab)
      if (activeTab === 'all' && status === 'completed' && !settings.showCompletedTasks) {
        return false;
      }

      // Apply tab filter
      if (activeTab !== 'all' && status !== activeTab) {
        return false;
      }

      return true;
    });
  }, [recommendations, activeTab, settings, trackedTasksMap]);

  // Loading state
  if (!profileHydrated || !dashboardHydrated) {
    return (
      <DashboardLayout title="Recommendations">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading recommendations...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No profile state
  if (!currentProfile) {
    return (
      <DashboardLayout title="Recommendations" subtitle="Track and manage your action items">
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Discovery First</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Start the discovery process to generate personalized recommendations based on your values, goals, and financial situation.
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

  // No recommendations state
  if (recommendations.length === 0) {
    return (
      <DashboardLayout title="Recommendations" subtitle="Track and manage your action items">
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Continue completing your discovery profile to unlock personalized action recommendations.
            </p>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Recommendations" subtitle="Track and manage your action items">
      <DashboardPage>
        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{statusCounts.not_started}</div>
            <div className="text-xs text-gray-500 mt-1">Not Started</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{statusCounts.in_progress}</div>
            <div className="text-xs text-gray-500 mt-1">In Progress</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{statusCounts.completed}</div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              {TABS.map((tab) => {
                const count =
                  tab.id === 'all'
                    ? filteredRecommendations.length
                    : statusCounts[tab.id as keyof typeof statusCounts] || 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 py-4 px-4 text-center border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Filters */}
            <TaskListHeader
              totalCount={recommendations.length}
              filteredCount={filteredRecommendations.length}
              statusFilter={activeTab === 'all' ? 'all' : activeTab}
              domainFilter={domainFilter}
              urgencyFilter={urgencyFilter}
              sortBy={sortBy}
              onStatusChange={() => {}} // Status handled by tabs
              onDomainChange={setDomainFilter}
              onUrgencyChange={setUrgencyFilter}
              onSortChange={setSortBy}
            />

            {/* Task List */}
            <TaskList
              recommendations={filteredRecommendations}
              trackedTasks={trackedTasksMap}
              domainFilter={domainFilter}
              urgencyFilter={urgencyFilter}
              sortBy={sortBy}
              emptyMessage={
                activeTab === 'not_started'
                  ? 'All tasks have been started!'
                  : activeTab === 'in_progress'
                  ? 'No tasks in progress. Start working on your recommendations!'
                  : activeTab === 'completed'
                  ? 'No completed tasks yet. Keep going!'
                  : 'No recommendations match your filters.'
              }
            />
          </div>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default RecommendationsPage;
