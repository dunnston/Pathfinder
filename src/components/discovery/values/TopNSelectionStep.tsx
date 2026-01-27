/**
 * Top N Selection Step (Steps 3-4)
 * Reusable component for narrowing values: Important -> Top 10 -> Top 5
 */

import { useMemo } from 'react';
import type { ValueCard } from '@/types/valuesDiscovery';
import { getCardsByIds } from '@/data/valueCards';
import { Button } from '@/components/common';

interface TopNSelectionStepProps {
  /** Card IDs available for selection */
  availableCardIds: string[];
  /** Currently selected card IDs */
  selectedCardIds: string[];
  /** Target number to select */
  targetCount: number;
  /** Called when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Called when step is complete */
  onComplete: () => void;
  /** Called to go back */
  onBack: () => void;
  /** Title for this step */
  title: string;
  /** Subtitle/prompt for this step */
  prompt: string;
  /** Label for the continue button */
  continueLabel?: string;
  /** Whether in advisor mode (for future use) */
  isAdvisorMode?: boolean;
}

export function TopNSelectionStep({
  availableCardIds,
  selectedCardIds,
  targetCount,
  onSelectionChange,
  onComplete,
  onBack,
  title,
  prompt,
  continueLabel = 'Continue',
  // isAdvisorMode reserved for future use
}: TopNSelectionStepProps): JSX.Element {
  const availableCards = useMemo(() => getCardsByIds(availableCardIds), [availableCardIds]);
  const selectedSet = new Set(selectedCardIds);

  const handleToggle = (cardId: string): void => {
    if (selectedSet.has(cardId)) {
      // Remove from selection
      onSelectionChange(selectedCardIds.filter((id) => id !== cardId));
    } else if (selectedCardIds.length < targetCount) {
      // Add to selection
      onSelectionChange([...selectedCardIds, cardId]);
    }
  };

  const canProceed = selectedCardIds.length === targetCount;
  const remaining = targetCount - selectedCardIds.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{prompt}</p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
          <span className="text-2xl font-bold text-primary">{selectedCardIds.length}</span>
          <span className="text-gray-500">of</span>
          <span className="text-2xl font-bold text-gray-700">{targetCount}</span>
          <span className="text-gray-500">selected</span>
        </div>
      </div>

      {/* Selection dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: targetCount }).map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx < selectedCardIds.length ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableCards.map((card) => {
          const isSelected = selectedSet.has(card.id);
          const isDisabled = !isSelected && selectedCardIds.length >= targetCount;

          return (
            <SelectableCard
              key={card.id}
              card={card}
              isSelected={isSelected}
              isDisabled={isDisabled}
              selectionIndex={isSelected ? selectedCardIds.indexOf(card.id) + 1 : undefined}
              onToggle={() => handleToggle(card.id)}
            />
          );
        })}
      </div>

      {availableCards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No values available. Please go back and mark values as Important.
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {canProceed ? (
              <span className="text-green-600">
                Selection complete
              </span>
            ) : (
              <span>
                Select {remaining} more value{remaining !== 1 ? 's' : ''}
              </span>
            )}
          </span>
          <Button onClick={onComplete} disabled={!canProceed}>
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SelectableCardProps {
  card: ValueCard;
  isSelected: boolean;
  isDisabled: boolean;
  selectionIndex?: number;
  onToggle: () => void;
}

function SelectableCard({
  card,
  isSelected,
  isDisabled,
  selectionIndex,
  onToggle,
}: SelectableCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      className={`
        relative text-left rounded-lg border-2 p-4 transition-all
        ${
          isSelected
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
            : isDisabled
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm'
        }
      `}
    >
      {/* Selection badge */}
      {isSelected && selectionIndex && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
          {selectionIndex}
        </div>
      )}

      {/* Checkbox indicator */}
      <div className="flex items-start gap-3">
        <div
          className={`
            mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
            ${
              isSelected
                ? 'border-primary bg-primary'
                : 'border-gray-300 bg-white'
            }
          `}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900">{card.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{card.description}</p>
        </div>
      </div>
    </button>
  );
}
