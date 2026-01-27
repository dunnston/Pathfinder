/**
 * NonNegotiablesStep Component
 * Step 6: Select 1-3 non-negotiable values from the top 5
 * These are values the user would NOT compromise, even if it required changing plans.
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/common';
import { getCardById } from '@/data/valueCards';

interface NonNegotiablesStepProps {
  top5: string[];
  selectedNonNegotiables: string[];
  onSelectionChange: (nonNegotiables: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function NonNegotiablesStep({
  top5,
  selectedNonNegotiables,
  onSelectionChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: NonNegotiablesStepProps): JSX.Element {
  const [selection, setSelection] = useState<Set<string>>(new Set(selectedNonNegotiables));

  // Get card details for display
  const top5Cards = useMemo(() => {
    return top5.map((id) => ({
      id,
      card: getCardById(id),
    }));
  }, [top5]);

  const handleToggle = (cardId: string): void => {
    const newSelection = new Set(selection);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else if (newSelection.size < 3) {
      newSelection.add(cardId);
    }
    setSelection(newSelection);
    onSelectionChange(Array.from(newSelection));
  };

  const canContinue = selection.size >= 1 && selection.size <= 3;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isAdvisorMode ? "Client's Non-Negotiables" : 'Your Non-Negotiables'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Select up to 3 values the client would NOT compromise, even if it required changing their plans."
            : 'Select up to 3 values you would NOT compromise, even if it required changing your plans.'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          These represent your absolute priorities.
        </p>
      </div>

      {/* Selection counter */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
          <span className="text-sm font-medium text-gray-700">
            Selected: {selection.size}/3
          </span>
          {selection.size === 0 && (
            <span className="text-xs text-amber-600">(select at least 1)</span>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="space-y-3">
        {top5Cards.map(({ id, card }, index) => {
          const isSelected = selection.has(id);
          return (
            <button
              key={id}
              onClick={() => handleToggle(id)}
              disabled={!isSelected && selection.size >= 3}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                  : selection.size >= 3
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Rank badge */}
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>

                {/* Card content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {card?.title || id}
                    </h3>
                    {isSelected && (
                      <span className="text-amber-500 text-lg">★</span>
                    )}
                  </div>
                  {card?.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Selection indicator */}
                <div
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-gray-300'
                    }
                  `}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Help text */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          What are non-negotiables?
        </h4>
        <p className="text-sm text-blue-700">
          Non-negotiables are values you refuse to sacrifice, even when facing difficult tradeoffs.
          They serve as guardrails for financial decisions - if a plan would compromise these values,
          it's not the right plan for {isAdvisorMode ? 'the client' : 'you'}.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canContinue}>
          Continue to Summary
        </Button>
      </div>
    </div>
  );
}
