/**
 * System Goal Cards Component
 * Phase 2: User selects from system-suggested goal cards
 * Cards are shown in a shuffled order (not grouped by category)
 */

import { useState, useMemo, useCallback } from 'react';
import type { FinancialGoal } from '@/types/financialGoals';
import { GOAL_CARD_TEMPLATES, templateToGoal, type GoalCardTemplate } from '@/data/goalCards';
import { Button } from '@/components/common';

interface SystemGoalCardsProps {
  selectedGoals: FinancialGoal[];
  userGoals: FinancialGoal[];
  onSelectionChange: (goals: FinancialGoal[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function SystemGoalCards({
  selectedGoals,
  userGoals,
  onSelectionChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: SystemGoalCardsProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  // Get IDs of selected system goals
  const selectedIds = useMemo(
    () => new Set(selectedGoals.map((g) => g.id)),
    [selectedGoals]
  );

  // Shuffle cards once on mount (stable across re-renders via useMemo with empty deps simulation)
  const shuffledTemplates = useMemo(() => {
    const templates = [...GOAL_CARD_TEMPLATES];
    // Fisher-Yates shuffle
    for (let i = templates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [templates[i], templates[j]] = [templates[j], templates[i]];
    }
    return templates;
  }, []);

  // Filter templates by search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return shuffledTemplates;
    const query = searchQuery.toLowerCase();
    return shuffledTemplates.filter(
      (t) =>
        t.label.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [shuffledTemplates, searchQuery]);

  const handleToggleCard = useCallback(
    (template: GoalCardTemplate) => {
      if (selectedIds.has(template.id)) {
        // Remove
        onSelectionChange(selectedGoals.filter((g) => g.id !== template.id));
      } else {
        // Add
        const newGoal = templateToGoal(template);
        onSelectionChange([...selectedGoals, newGoal]);
      }
    },
    [selectedIds, selectedGoals, onSelectionChange]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const totalGoals = userGoals.length + selectedGoals.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isAdvisorMode ? 'Review Common Goals' : 'Review Common Goals'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Here are some common financial goals. Select any that apply to the client. Skip any that don't."
            : "Here are some common goals people often care about. Add any that matter to you. Skip any that don't."}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search goals..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search goal cards"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <span className="text-sm text-gray-600">
          {userGoals.length > 0 && (
            <span className="mr-4">
              <span className="font-medium text-gray-900">{userGoals.length}</span> personal goal{userGoals.length !== 1 && 's'}
            </span>
          )}
          <span className="font-medium text-primary">{selectedGoals.length}</span> common goal{selectedGoals.length !== 1 && 's'} selected
        </span>
        <span className="text-sm text-gray-500">
          {totalGoals} total
        </span>
      </div>

      {/* Goal cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isSelected = selectedIds.has(template.id);
          return (
            <button
              key={template.id}
              onClick={() => handleToggleCard(template)}
              className={`
                text-left p-4 rounded-lg border-2 transition-all
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center
                    ${isSelected ? 'bg-primary text-white' : 'border-2 border-gray-300'}
                  `}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{template.label}</div>
                  {template.description && (
                    <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty search state */}
      {filteredTemplates.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No goals match your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-primary hover:underline mt-2"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onComplete} variant="primary">
          Continue to Priorities
        </Button>
      </div>
    </div>
  );
}
