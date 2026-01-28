/**
 * Plan Builder Component
 * Main interface for assembling and managing the user's financial plan
 */

import { useMemo, useState } from 'react';
import type { SuggestionDomain, PlanItemStatus } from '@/types/suggestions';
import { SUGGESTION_DOMAIN_LABELS, SUGGESTION_DOMAINS, PLAN_ITEM_STATUS_LABELS } from '@/types/suggestions';
import { useSuggestionsStore } from '@/stores/suggestionsStore';
import { PlanItemCard } from './PlanItemCard';
import { CustomRecommendationForm } from './CustomRecommendationForm';
import { Button } from '@/components/common';
import {
  ClipboardList,
  Filter,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  Sparkles,
} from 'lucide-react';

interface PlanBuilderProps {
  /** Optional class name */
  className?: string;
}

type ViewMode = 'all' | 'by-domain' | 'by-status';
type FilterStatus = 'all' | PlanItemStatus;
type FilterDomain = 'all' | SuggestionDomain;

export function PlanBuilder({ className = '' }: PlanBuilderProps): JSX.Element {
  const planItems = useSuggestionsStore((state) => state.planItems);
  const customRecommendations = useSuggestionsStore((state) => state.customRecommendations);
  const domainStates = useSuggestionsStore((state) => state.domainStates);
  const addSuggestionToPlan = useSuggestionsStore((state) => state.addSuggestionToPlan);
  const addCustomToPlan = useSuggestionsStore((state) => state.addCustomToPlan);
  const addCustomRecommendation = useSuggestionsStore((state) => state.addCustomRecommendation);
  const updatePlanItemStatus = useSuggestionsStore((state) => state.updatePlanItemStatus);
  const updatePlanItem = useSuggestionsStore((state) => state.updatePlanItem);
  const removePlanItem = useSuggestionsStore((state) => state.removePlanItem);

  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterDomain, setFilterDomain] = useState<FilterDomain>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Get accepted suggestions from domainStates (avoids returning new array on each render)
  const acceptedSuggestions = useMemo(() => {
    const accepted = [];
    for (const domain of SUGGESTION_DOMAINS) {
      const suggestions = domainStates[domain]?.suggestions || [];
      for (const s of suggestions) {
        if (s.status === 'accepted' || s.status === 'modified') {
          accepted.push(s);
        }
      }
    }
    return accepted;
  }, [domainStates]);

  // Get suggestions not yet in plan
  const suggestionsNotInPlan = useMemo(() => {
    const planSourceIds = new Set(
      planItems.filter((p) => p.type === 'suggestion').map((p) => p.sourceId)
    );
    return acceptedSuggestions.filter((s) => !planSourceIds.has(s.id));
  }, [acceptedSuggestions, planItems]);

  // Get custom recommendations not yet in plan
  const customNotInPlan = useMemo(() => {
    const planSourceIds = new Set(
      planItems.filter((p) => p.type === 'custom').map((p) => p.sourceId)
    );
    return customRecommendations.filter((c) => !planSourceIds.has(c.id));
  }, [customRecommendations, planItems]);

  // Filtered plan items
  const filteredItems = useMemo(() => {
    return planItems
      .filter((item) => {
        if (filterStatus !== 'all' && item.status !== filterStatus) return false;
        if (filterDomain !== 'all' && item.domain !== filterDomain) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [planItems, filterStatus, filterDomain]);

  // Group items by domain or status
  const groupedItems = useMemo(() => {
    if (viewMode === 'by-domain') {
      const groups: Partial<Record<SuggestionDomain, typeof filteredItems>> = {};
      SUGGESTION_DOMAINS.forEach((domain) => {
        const items = filteredItems.filter((i) => i.domain === domain);
        if (items.length > 0) {
          groups[domain] = items;
        }
      });
      return groups;
    }
    if (viewMode === 'by-status') {
      const statuses: PlanItemStatus[] = ['planned', 'in_progress', 'completed', 'deferred'];
      const groups: Partial<Record<PlanItemStatus, typeof filteredItems>> = {};
      statuses.forEach((status) => {
        const items = filteredItems.filter((i) => i.status === status);
        if (items.length > 0) {
          groups[status] = items;
        }
      });
      return groups;
    }
    return null;
  }, [filteredItems, viewMode]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: planItems.length,
      planned: planItems.filter((i) => i.status === 'planned').length,
      inProgress: planItems.filter((i) => i.status === 'in_progress').length,
      completed: planItems.filter((i) => i.status === 'completed').length,
      deferred: planItems.filter((i) => i.status === 'deferred').length,
      pendingToAdd: suggestionsNotInPlan.length + customNotInPlan.length,
    };
  }, [planItems, suggestionsNotInPlan, customNotInPlan]);

  const handleAddSuggestion = (suggestionId: string) => {
    addSuggestionToPlan(suggestionId);
  };

  const handleAddCustom = (customId: string) => {
    addCustomToPlan(customId);
  };

  const handleAddNewCustom = (data: Parameters<typeof addCustomRecommendation>[0]) => {
    const id = addCustomRecommendation(data);
    addCustomToPlan(id);
    setShowAddForm(false);
  };

  const handleStatusChange = (itemId: string, status: PlanItemStatus, notes?: string) => {
    updatePlanItemStatus(itemId, status, notes);
  };

  const handleEditItem = (itemId: string, updates: Parameters<typeof updatePlanItem>[1]) => {
    updatePlanItem(itemId, updates);
  };

  const handleRemoveItem = (itemId: string) => {
    removePlanItem(itemId);
  };

  const handleExportPlan = () => {
    const planData = planItems.map((item) => ({
      domain: SUGGESTION_DOMAIN_LABELS[item.domain],
      title: item.title,
      description: item.description,
      priority: item.priority,
      status: PLAN_ITEM_STATUS_LABELS[item.status],
      notes: item.notes || '',
    }));

    const csvContent = [
      ['Domain', 'Title', 'Description', 'Priority', 'Status', 'Notes'],
      ...planData.map((row) => [
        row.domain,
        `"${row.title.replace(/"/g, '""')}"`,
        `"${row.description.replace(/"/g, '""')}"`,
        row.priority,
        row.status,
        `"${row.notes.replace(/"/g, '""')}"`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial-plan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Empty state
  if (planItems.length === 0 && suggestionsNotInPlan.length === 0 && customNotInPlan.length === 0) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-8 text-center ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ClipboardList className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Plan Items Yet</h3>
        <p className="mt-2 text-gray-500">
          Accept suggestions from the guided exploration or add custom recommendations to build your plan.
        </p>
        <Button onClick={() => setShowAddForm(true)} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Recommendation
        </Button>

        {showAddForm && (
          <div className="mt-6">
            <CustomRecommendationForm
              onSubmit={handleAddNewCustom}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with stats and actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Plan</h2>
            <p className="mt-1 text-sm text-gray-500">
              {stats.total} item{stats.total !== 1 ? 's' : ''} in your plan
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPlan}
              disabled={planItems.length === 0}
            >
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-5 gap-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xl font-semibold text-gray-900">{stats.planned}</span>
            </div>
            <div className="text-xs text-gray-500">Planned</div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <PlayCircle className="h-4 w-4 text-blue-500" />
              <span className="text-xl font-semibold text-blue-700">{stats.inProgress}</span>
            </div>
            <div className="text-xs text-blue-600">In Progress</div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xl font-semibold text-green-700">{stats.completed}</span>
            </div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <PauseCircle className="h-4 w-4 text-amber-500" />
              <span className="text-xl font-semibold text-amber-700">{stats.deferred}</span>
            </div>
            <div className="text-xs text-amber-600">Deferred</div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xl font-semibold text-purple-700">{stats.pendingToAdd}</span>
            </div>
            <div className="text-xs text-purple-600">Ready to Add</div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">View</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Items</option>
                  <option value="by-domain">By Domain</option>
                  <option value="by-status">By Status</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="deferred">Deferred</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Domain</label>
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value as FilterDomain)}
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Domains</option>
                  {SUGGESTION_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {SUGGESTION_DOMAIN_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items ready to add */}
      {(suggestionsNotInPlan.length > 0 || customNotInPlan.length > 0) && (
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-medium text-purple-900">
            <Sparkles className="h-5 w-5" />
            Items Ready to Add to Plan
          </h3>
          <div className="space-y-2">
            {suggestionsNotInPlan.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{suggestion.modifiedTitle || suggestion.title}</p>
                  <p className="text-sm text-gray-500">{SUGGESTION_DOMAIN_LABELS[suggestion.domain]}</p>
                </div>
                <Button size="sm" onClick={() => handleAddSuggestion(suggestion.id)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            ))}
            {customNotInPlan.map((custom) => (
              <div
                key={custom.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{custom.title}</p>
                  <p className="text-sm text-gray-500">
                    {SUGGESTION_DOMAIN_LABELS[custom.domain]} (Custom)
                  </p>
                </div>
                <Button size="sm" onClick={() => handleAddCustom(custom.id)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan items */}
      {viewMode === 'all' ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <PlanItemCard
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onRemove={handleRemoveItem}
              onEdit={handleEditItem}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems || {}).map(([key, items]) => (
            <div key={key}>
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                {viewMode === 'by-domain'
                  ? SUGGESTION_DOMAIN_LABELS[key as SuggestionDomain]
                  : PLAN_ITEM_STATUS_LABELS[key as PlanItemStatus]}
                {' '}({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <PlanItemCard
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemoveItem}
                    onEdit={handleEditItem}
                    compact
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state for filtered results */}
      {filteredItems.length === 0 && planItems.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-500">No items match your current filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterStatus('all');
              setFilterDomain('all');
            }}
            className="mt-3"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Add custom recommendation */}
      <div className="mt-6">
        <CustomRecommendationForm onSubmit={handleAddNewCustom} />
      </div>
    </div>
  );
}
