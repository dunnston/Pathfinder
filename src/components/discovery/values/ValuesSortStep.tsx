/**
 * Values Sort Step (Step 1)
 * One-card-at-a-time sorting into three piles: Important, Unsure, Not Important
 * Supports click-to-sort and keyboard shortcuts (1, 2, 3)
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Pile } from '@/types/valuesDiscovery';
import { VALUE_CARDS } from '@/data/valueCards';
import { Button } from '@/components/common';

interface ValuesSortStepProps {
  piles: Record<string, Pile>;
  onPileChange: (cardId: string, pile: Pile) => void;
  onComplete: () => void;
  isAdvisorMode?: boolean;
}

export function ValuesSortStep({
  piles,
  onPileChange,
  onComplete,
  isAdvisorMode = false,
}: ValuesSortStepProps): JSX.Element {
  // Get unsorted cards (cards not yet assigned to a pile)
  const unsortedCards = useMemo(() => {
    return VALUE_CARDS.filter((card) => !piles[card.id]);
  }, [piles]);

  // Current card index within unsorted cards
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation state for card transition
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<Pile | null>(null);

  // Current card to display
  const currentCard = unsortedCards[currentIndex] || null;

  // Progress stats
  const stats = useMemo(() => {
    const important = Object.values(piles).filter((p) => p === 'IMPORTANT').length;
    const unsure = Object.values(piles).filter((p) => p === 'UNSURE').length;
    const notImportant = Object.values(piles).filter((p) => p === 'NOT_IMPORTANT').length;
    const reviewed = important + unsure + notImportant;
    return { important, unsure, notImportant, reviewed };
  }, [piles]);

  const progressPercent = Math.round((stats.reviewed / VALUE_CARDS.length) * 100);
  const canProceed = stats.important >= 5;
  const allSorted = unsortedCards.length === 0;

  // Handle sorting a card to a pile
  const handleSort = useCallback((pile: Pile) => {
    if (!currentCard || isAnimating) return;

    // Start animation
    setIsAnimating(true);
    setAnimationDirection(pile);

    // After animation, update the pile
    setTimeout(() => {
      onPileChange(currentCard.id, pile);
      setIsAnimating(false);
      setAnimationDirection(null);
      // Reset index to 0 since the card will be removed from unsorted
      setCurrentIndex(0);
    }, 300);
  }, [currentCard, isAnimating, onPileChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
          handleSort('IMPORTANT');
          break;
        case '2':
          handleSort('UNSURE');
          break;
        case '3':
          handleSort('NOT_IMPORTANT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSort]);

  // Animation classes for card
  const getCardAnimationClass = (): string => {
    if (!isAnimating || !animationDirection) return 'translate-y-0 opacity-100';

    switch (animationDirection) {
      case 'IMPORTANT':
        return '-translate-x-full opacity-0';
      case 'NOT_IMPORTANT':
        return 'translate-x-full opacity-0';
      case 'UNSURE':
        return 'translate-y-full opacity-0';
      default:
        return 'translate-y-0 opacity-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions - compact */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          {isAdvisorMode
            ? "Sort each value by importance to the client's financial decisions."
            : 'Sort each value by how important it is to your financial decisions.'}
          <span className="ml-2 text-blue-600 font-medium">
            Use keyboard: 1 = Important, 2 = Unsure, 3 = Not Important
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{stats.reviewed} of {VALUE_CARDS.length} sorted</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-green-700">Important: {stats.important}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-amber-700">Unsure: {stats.unsure}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-600">Not Important: {stats.notImportant}</span>
          </span>
        </div>
      </div>

      {/* Main card sorting area */}
      {!allSorted && currentCard ? (
        <div className="relative">
          {/* Current card */}
          <div
            className={`
              mx-auto max-w-md bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6
              transition-all duration-300 ease-out
              ${getCardAnimationClass()}
            `}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {currentCard.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {currentCard.description}
              </p>
              <p className="text-xs text-gray-400">
                {unsortedCards.length} cards remaining
              </p>
            </div>
          </div>

          {/* Three pile targets */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {/* Important pile */}
            <button
              type="button"
              onClick={() => handleSort('IMPORTANT')}
              disabled={isAnimating}
              className={`
                p-6 rounded-xl border-2 border-dashed transition-all
                ${animationDirection === 'IMPORTANT'
                  ? 'border-green-500 bg-green-100 scale-105'
                  : 'border-green-300 bg-green-50 hover:border-green-500 hover:bg-green-100'}
              `}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                  1
                </div>
                <div className="font-semibold text-green-700">Important</div>
                <div className="text-xs text-green-600 mt-1">
                  Matters for decisions
                </div>
                <div className="mt-2 text-sm font-medium text-green-800">
                  {stats.important} cards
                </div>
              </div>
            </button>

            {/* Unsure pile */}
            <button
              type="button"
              onClick={() => handleSort('UNSURE')}
              disabled={isAnimating}
              className={`
                p-6 rounded-xl border-2 border-dashed transition-all
                ${animationDirection === 'UNSURE'
                  ? 'border-amber-500 bg-amber-100 scale-105'
                  : 'border-amber-300 bg-amber-50 hover:border-amber-500 hover:bg-amber-100'}
              `}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                  2
                </div>
                <div className="font-semibold text-amber-700">Unsure</div>
                <div className="text-xs text-amber-600 mt-1">
                  Decide later
                </div>
                <div className="mt-2 text-sm font-medium text-amber-800">
                  {stats.unsure} cards
                </div>
              </div>
            </button>

            {/* Not Important pile */}
            <button
              type="button"
              onClick={() => handleSort('NOT_IMPORTANT')}
              disabled={isAnimating}
              className={`
                p-6 rounded-xl border-2 border-dashed transition-all
                ${animationDirection === 'NOT_IMPORTANT'
                  ? 'border-gray-500 bg-gray-200 scale-105'
                  : 'border-gray-300 bg-gray-100 hover:border-gray-500 hover:bg-gray-200'}
              `}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                  3
                </div>
                <div className="font-semibold text-gray-700">Not Important</div>
                <div className="text-xs text-gray-600 mt-1">
                  Not a priority
                </div>
                <div className="mt-2 text-sm font-medium text-gray-800">
                  {stats.notImportant} cards
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* All cards sorted - show summary */
        <div className="text-center py-12 bg-green-50 rounded-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            All values sorted!
          </h3>
          <p className="text-green-700">
            You've sorted all {VALUE_CARDS.length} values. Ready to continue.
          </p>
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {canProceed ? (
            <span className="text-green-600">
              Ready to continue with {stats.important} important values
            </span>
          ) : (
            <span>
              Mark at least 5 values as Important to continue ({5 - stats.important} more needed)
            </span>
          )}
        </div>
        <Button onClick={onComplete} disabled={!canProceed}>
          Continue to Top 10
        </Button>
      </div>
    </div>
  );
}
