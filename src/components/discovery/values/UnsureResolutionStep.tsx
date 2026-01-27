/**
 * Unsure Resolution Step Component
 * Step 2: Resolve "Unsure" cards with scenario-based prompts
 * Presents each unsure card one at a time with a scenario question
 */

import { useState, useMemo } from 'react';
import type { Pile, UnsureResolution } from '@/types/valuesDiscovery';
import { getCardsByIds } from '@/data/valueCards';
import { Button } from '@/components/common';

interface UnsureResolutionStepProps {
  piles: Record<string, Pile>;
  unsureResolutions: UnsureResolution[];
  onResolution: (cardId: string, newPile: 'IMPORTANT' | 'NOT_IMPORTANT' | 'UNSURE') => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function UnsureResolutionStep({
  piles,
  unsureResolutions,
  onResolution,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: UnsureResolutionStepProps): JSX.Element {
  // Get unsure cards that haven't been resolved yet
  const unsureCardIds = useMemo(() => {
    return Object.entries(piles)
      .filter(([, pile]) => pile === 'UNSURE')
      .map(([cardId]) => cardId)
      .filter((cardId) => {
        // Check if already resolved
        const resolution = unsureResolutions.find((r) => r.cardId === cardId);
        return !resolution || resolution.to === 'UNSURE';
      });
  }, [piles, unsureResolutions]);

  const unsureCards = useMemo(() => getCardsByIds(unsureCardIds), [unsureCardIds]);

  // Track current card index
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCard = unsureCards[currentIndex];

  // Track if user wants to keep remaining as unsure
  const remainingCount = unsureCards.length - currentIndex;
  const resolvedCount = currentIndex;

  const handleChoice = (choice: 'IMPORTANT' | 'NOT_IMPORTANT' | 'UNSURE') => {
    if (!currentCard) return;

    onResolution(currentCard.id, choice);

    // Move to next card
    if (currentIndex < unsureCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkipRemaining = () => {
    // Mark all remaining as still unsure and complete
    for (let i = currentIndex; i < unsureCards.length; i++) {
      onResolution(unsureCards[i].id, 'UNSURE');
    }
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
  };

  // If no unsure cards, show skip option
  if (unsureCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Unsure Values</h2>
          <p className="text-gray-600">
            {isAdvisorMode
              ? "The client didn't mark any values as unsure. You can continue to the next step."
              : "You didn't mark any values as unsure. You can continue to the next step."}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleComplete}>Continue</Button>
        </div>
      </div>
    );
  }

  // If we've gone through all cards
  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review Complete</h2>
          <p className="text-gray-600">
            {isAdvisorMode
              ? `You've reviewed all ${resolvedCount} unsure values.`
              : `You've reviewed all ${resolvedCount} unsure values.`}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleComplete}>Continue to Top 10</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Resolve Uncertain Values</h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Help the client decide about each value they were unsure about."
            : "Let's help you decide about each value you were unsure about."}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {resolvedCount + 1} of {unsureCards.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((resolvedCount + 1) / unsureCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Card */}
      <div className="bg-white border-2 border-primary/20 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{currentCard.title}</h3>
          <p className="text-gray-600 mt-1">{currentCard.description}</p>
        </div>

        {/* Scenario Prompt */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-amber-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">Consider this scenario:</p>
              <p className="text-sm text-amber-700">{currentCard.scenarioPrompt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleChoice('IMPORTANT')}
          className="w-full p-4 text-left rounded-xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-900">Yes, this matters to me</span>
              <p className="text-sm text-gray-500">Move to "Important" pile</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleChoice('NOT_IMPORTANT')}
          className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-900">No, not a priority</span>
              <p className="text-sm text-gray-500">Move to "Not Important" pile</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleChoice('UNSURE')}
          className="w-full p-4 text-left rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-900">Still unsure</span>
              <p className="text-sm text-gray-500">Keep in "Unsure" and move on</p>
            </div>
          </div>
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Sorting
        </Button>

        {remainingCount > 1 && (
          <Button variant="ghost" onClick={handleSkipRemaining}>
            Skip remaining ({remainingCount - 1})
          </Button>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 text-center">
        Tip: It's okay to keep some values as "unsure" - they just won't be included when selecting your
        top values.
      </p>
    </div>
  );
}
