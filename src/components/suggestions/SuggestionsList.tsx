/**
 * Suggestions List Component
 * Displays all generated suggestions for a domain with filtering and actions
 */

import { useState, useMemo } from 'react';
import type { Suggestion, SuggestionDomain, SuggestionPriority, SuggestionStatus } from '@/types/suggestions';
import { SUGGESTION_DOMAIN_LABELS, SUGGESTION_PRIORITY_LABELS } from '@/types/suggestions';
import { SuggestionCard } from './SuggestionCard';
import { Button } from '@/components/common';
import { Filter, Clock, Sparkles } from 'lucide-react';

interface SuggestionsListProps {
  /** Suggestions to display */
  suggestions: Suggestion[];
  /** Domain being displayed (for header) */
  domain?: SuggestionDomain;
  /** Called when user accepts a suggestion */
  onAccept: (suggestionId: string, notes?: string) => void;
  /** Called when user rejects a suggestion */
  onReject: (suggestionId: string) => void;
  /** Called when user modifies a suggestion */
  onModify: (suggestionId: string, title: string, description: string) => void;
  /** Whether to show domain header */
  showHeader?: boolean;
  /** Optional class name */
  className?: string;
}

type FilterStatus = 'all' | SuggestionStatus;
type FilterPriority = 'all' | SuggestionPriority;

export function SuggestionsList({
  suggestions,
  domain,
  onAccept,
  onReject,
  onModify,
  showHeader = true,
  className = '',
}: SuggestionsListProps): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
      return true;
    });
  }, [suggestions, statusFilter, priorityFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: suggestions.length,
      pending: suggestions.filter((s) => s.status === 'pending').length,
      accepted: suggestions.filter((s) => s.status === 'accepted' || s.status === 'modified').length,
      rejected: suggestions.filter((s) => s.status === 'rejected').length,
      highPriority: suggestions.filter((s) => s.priority === 'HIGH').length,
    };
  }, [suggestions]);

  // Group suggestions by priority for display
  const groupedSuggestions = useMemo(() => {
    const groups: Record<SuggestionPriority, Suggestion[]> = {
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    };

    filteredSuggestions.forEach((s) => {
      groups[s.priority].push(s);
    });

    return groups;
  }, [filteredSuggestions]);

  if (suggestions.length === 0) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-8 text-center ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Sparkles className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Suggestions Yet</h3>
        <p className="mt-2 text-gray-500">
          Complete the guided questions in this domain to generate personalized suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {domain ? `${SUGGESTION_DOMAIN_LABELS[domain]} Suggestions` : 'Suggestions'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {stats.total} suggestion{stats.total !== 1 ? 's' : ''} generated based on your answers
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
              <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
              <div className="text-2xl font-semibold text-green-700">{stats.accepted}</div>
              <div className="text-xs text-green-600">Accepted</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <div className="text-2xl font-semibold text-red-700">{stats.rejected}</div>
              <div className="text-xs text-red-600">Rejected</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
              <div className="text-2xl font-semibold text-amber-700">{stats.highPriority}</div>
              <div className="text-xs text-amber-600">High Priority</div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                    className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="modified">Modified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
                    className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions grouped by priority */}
      <div className="space-y-6">
        {(['HIGH', 'MEDIUM', 'LOW'] as SuggestionPriority[]).map((priority) => {
          const group = groupedSuggestions[priority];
          if (group.length === 0) return null;

          return (
            <div key={priority}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                <span
                  className={`h-2 w-2 rounded-full ${
                    priority === 'HIGH'
                      ? 'bg-red-500'
                      : priority === 'MEDIUM'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                />
                {SUGGESTION_PRIORITY_LABELS[priority]} Priority ({group.length})
              </h3>
              <div className="space-y-3">
                {group.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={onAccept}
                    onReject={onReject}
                    onModify={onModify}
                    compact
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state for filtered results */}
      {filteredSuggestions.length === 0 && suggestions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-500">No suggestions match your current filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="mt-3"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Quick actions summary */}
      {stats.pending > 0 && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                {stats.pending} suggestion{stats.pending !== 1 ? 's' : ''} awaiting your review
              </p>
              <p className="text-sm text-blue-700">
                Accept suggestions to add them to your plan, or reject to dismiss.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
