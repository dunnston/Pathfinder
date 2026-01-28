/**
 * Task List Component
 * Displays a filtered list of task cards
 */

import type { ActionRecommendation, PlanningDomain, ActionUrgency } from '@/types';
import type { TaskStatus, TrackedTask } from '@/types/dashboard';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  /** Action recommendations to display */
  recommendations: ActionRecommendation[];
  /** Tracked tasks map (actionId -> TrackedTask) */
  trackedTasks: Map<string, TrackedTask>;
  /** Filter by status (if not provided, shows all) */
  statusFilter?: TaskStatus | 'all';
  /** Filter by domain (if not provided, shows all) */
  domainFilter?: PlanningDomain | 'all';
  /** Filter by urgency (if not provided, shows all) */
  urgencyFilter?: ActionUrgency | 'all';
  /** Sort by field */
  sortBy?: 'urgency' | 'domain' | 'status';
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Whether to show compact cards */
  compact?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Optional class name */
  className?: string;
}

const URGENCY_ORDER: Record<ActionUrgency, number> = {
  IMMEDIATE: 0,
  NEAR_TERM: 1,
  MEDIUM_TERM: 2,
  ONGOING: 3,
};

const STATUS_ORDER: Record<TaskStatus, number> = {
  in_progress: 0,
  not_started: 1,
  completed: 2,
  dismissed: 3,
};

export function TaskList({
  recommendations,
  trackedTasks,
  statusFilter = 'all',
  domainFilter = 'all',
  urgencyFilter = 'all',
  sortBy = 'urgency',
  sortDirection = 'asc',
  compact = false,
  emptyMessage = 'No tasks to display.',
  className = '',
}: TaskListProps): JSX.Element {
  // Get status for a recommendation
  const getStatus = (rec: ActionRecommendation): TaskStatus => {
    const task = trackedTasks.get(rec.id);
    return task?.status || 'not_started';
  };

  // Filter recommendations
  const filteredRecs = recommendations.filter((rec) => {
    const status = getStatus(rec);

    // Status filter
    if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }

    // Domain filter
    if (domainFilter !== 'all' && rec.domain !== domainFilter) {
      return false;
    }

    // Urgency filter
    if (urgencyFilter !== 'all' && rec.urgency !== urgencyFilter) {
      return false;
    }

    return true;
  });

  // Sort recommendations
  const sortedRecs = [...filteredRecs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'urgency':
        comparison = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency];
        break;
      case 'domain':
        comparison = a.domain.localeCompare(b.domain);
        break;
      case 'status':
        comparison = STATUS_ORDER[getStatus(a)] - STATUS_ORDER[getStatus(b)];
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (sortedRecs.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {sortedRecs.map((rec) => (
        <TaskCard
          key={rec.id}
          recommendation={rec}
          trackedTask={trackedTasks.get(rec.id)}
          compact={compact}
        />
      ))}
    </div>
  );
}

interface TaskListHeaderProps {
  /** Total count of tasks */
  totalCount: number;
  /** Current filtered count */
  filteredCount: number;
  /** Status filter value */
  statusFilter: TaskStatus | 'all';
  /** Domain filter value */
  domainFilter: PlanningDomain | 'all';
  /** Urgency filter value */
  urgencyFilter: ActionUrgency | 'all';
  /** Sort by value */
  sortBy: 'urgency' | 'domain' | 'status';
  /** Callbacks */
  onStatusChange: (status: TaskStatus | 'all') => void;
  onDomainChange: (domain: PlanningDomain | 'all') => void;
  onUrgencyChange: (urgency: ActionUrgency | 'all') => void;
  onSortChange: (sort: 'urgency' | 'domain' | 'status') => void;
}

export function TaskListHeader({
  totalCount,
  filteredCount,
  statusFilter,
  domainFilter,
  urgencyFilter,
  sortBy,
  onStatusChange,
  onDomainChange,
  onUrgencyChange,
  onSortChange,
}: TaskListHeaderProps): JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="text-sm text-gray-500">
        Showing {filteredCount} of {totalCount} recommendations
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="all">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="dismissed">Dismissed</option>
        </select>

        {/* Domain Filter */}
        <select
          value={domainFilter}
          onChange={(e) => onDomainChange(e.target.value as PlanningDomain | 'all')}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="all">All Domains</option>
          <option value="RETIREMENT_INCOME">Retirement Income</option>
          <option value="INVESTMENT_STRATEGY">Investment Strategy</option>
          <option value="TAX_OPTIMIZATION">Tax Optimization</option>
          <option value="INSURANCE_RISK">Insurance & Risk</option>
          <option value="ESTATE_LEGACY">Estate & Legacy</option>
          <option value="CASH_FLOW_DEBT">Cash Flow & Debt</option>
          <option value="BENEFITS_OPTIMIZATION">Benefits</option>
          <option value="BUSINESS_CAREER">Business & Career</option>
          <option value="HEALTHCARE_LTC">Healthcare & LTC</option>
        </select>

        {/* Urgency Filter */}
        <select
          value={urgencyFilter}
          onChange={(e) => onUrgencyChange(e.target.value as ActionUrgency | 'all')}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="all">All Urgencies</option>
          <option value="IMMEDIATE">Immediate</option>
          <option value="NEAR_TERM">Near Term</option>
          <option value="MEDIUM_TERM">Medium Term</option>
          <option value="ONGOING">Ongoing</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'urgency' | 'domain' | 'status')}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="urgency">Sort by Urgency</option>
          <option value="domain">Sort by Domain</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>
    </div>
  );
}
