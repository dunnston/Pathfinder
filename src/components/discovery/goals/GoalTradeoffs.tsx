/**
 * Goal Tradeoffs Component
 * Pairwise comparison of goals to validate priorities
 * Shows A vs B goal comparisons for high-priority goals
 */

import { useState, useMemo } from 'react';
import type { FinancialGoal, FinancialGoalTradeoff } from '@/types/financialGoals';
import { generateGoalTradeoffPairs } from '@/services/goalsLogic';
import { Button } from '@/components/common';

interface GoalTradeoffsProps {
  goals: FinancialGoal[];
  existingTradeoffs: FinancialGoalTradeoff[];
  onTradeoffChange: (tradeoff: FinancialGoalTradeoff) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

type TradeoffChoice = 'GOAL1' | 'GOAL2' | 'NEUTRAL';

export function GoalTradeoffs({
  goals,
  existingTradeoffs,
  onTradeoffChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: GoalTradeoffsProps): JSX.Element {
  // Generate tradeoff pairs
  const tradeoffPairs = useMemo(() => generateGoalTradeoffPairs(goals, 4), [goals]);

  // Track current pair index
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Find first unanswered pair
    const unansweredIndex = tradeoffPairs.findIndex(
      (pair) =>
        !existingTradeoffs.some(
          (t) =>
            (t.goalId1 === pair.goal1.id && t.goalId2 === pair.goal2.id) ||
            (t.goalId1 === pair.goal2.id && t.goalId2 === pair.goal1.id)
        )
    );
    return unansweredIndex >= 0 ? unansweredIndex : 0;
  });

  const currentPair = tradeoffPairs[currentIndex];

  // Get existing choice for current pair
  const getExistingChoice = (): TradeoffChoice | null => {
    if (!currentPair) return null;

    const existing = existingTradeoffs.find(
      (t) =>
        (t.goalId1 === currentPair.goal1.id && t.goalId2 === currentPair.goal2.id) ||
        (t.goalId1 === currentPair.goal2.id && t.goalId2 === currentPair.goal1.id)
    );

    if (!existing) return null;

    // Normalize the choice based on the order
    if (existing.goalId1 === currentPair.goal1.id) {
      return existing.choice;
    } else {
      // Flip the choice if the order is reversed
      if (existing.choice === 'GOAL1') return 'GOAL2';
      if (existing.choice === 'GOAL2') return 'GOAL1';
      return existing.choice;
    }
  };

  const [selectedChoice, setSelectedChoice] = useState<TradeoffChoice | null>(getExistingChoice);

  // Total pairs count
  const totalPairs = tradeoffPairs.length;

  const handleChoice = (choice: TradeoffChoice) => {
    if (!currentPair) return;

    setSelectedChoice(choice);

    // Create tradeoff record
    const tradeoff: FinancialGoalTradeoff = {
      goalId1: currentPair.goal1.id,
      goalId2: currentPair.goal2.id,
      choice,
    };

    onTradeoffChange(tradeoff);
  };

  const handleNext = () => {
    if (currentIndex < tradeoffPairs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      // Check if next pair has existing choice
      const nextPair = tradeoffPairs[currentIndex + 1];
      const existing = existingTradeoffs.find(
        (t) =>
          (t.goalId1 === nextPair.goal1.id && t.goalId2 === nextPair.goal2.id) ||
          (t.goalId1 === nextPair.goal2.id && t.goalId2 === nextPair.goal1.id)
      );
      if (existing) {
        if (existing.goalId1 === nextPair.goal1.id) {
          setSelectedChoice(existing.choice);
        } else {
          if (existing.choice === 'GOAL1') setSelectedChoice('GOAL2');
          else if (existing.choice === 'GOAL2') setSelectedChoice('GOAL1');
          else setSelectedChoice(existing.choice);
        }
      } else {
        setSelectedChoice(null);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Get existing choice for previous pair
      const prevPair = tradeoffPairs[currentIndex - 1];
      const existing = existingTradeoffs.find(
        (t) =>
          (t.goalId1 === prevPair.goal1.id && t.goalId2 === prevPair.goal2.id) ||
          (t.goalId1 === prevPair.goal2.id && t.goalId2 === prevPair.goal1.id)
      );
      if (existing) {
        if (existing.goalId1 === prevPair.goal1.id) {
          setSelectedChoice(existing.choice);
        } else {
          if (existing.choice === 'GOAL1') setSelectedChoice('GOAL2');
          else if (existing.choice === 'GOAL2') setSelectedChoice('GOAL1');
          else setSelectedChoice(existing.choice);
        }
      } else {
        setSelectedChoice(null);
      }
    }
  };

  // If no pairs to compare, skip this step
  if (tradeoffPairs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Tradeoffs Needed</h2>
          <p className="text-gray-600">
            {isAdvisorMode
              ? "There aren't enough high-priority goals to require tradeoff comparisons."
              : "You don't have enough high-priority goals to compare. This step is optional."}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onComplete}>Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Goal Tradeoffs</h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "When the client has to choose between these goals, which would they prioritize?"
            : 'When you have to choose between these goals, which would you prioritize?'}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Comparison</span>
          <span>
            {currentIndex + 1} of {totalPairs}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalPairs) * 100}%` }}
          />
        </div>
      </div>

      {/* Tradeoff Question */}
      {currentPair && (
        <div className="bg-white border rounded-xl p-6">
          <p className="text-center text-gray-700 mb-6">
            {isAdvisorMode
              ? 'If the client had to choose between these two goals, which would they lean toward?'
              : 'If you had to choose between these two goals, which would you lean toward?'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Goal 1 */}
            <button
              onClick={() => handleChoice('GOAL1')}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                selectedChoice === 'GOAL1'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedChoice === 'GOAL1'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedChoice === 'GOAL1' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{currentPair.goal1.label}</span>
                  {currentPair.goal1.source === 'user' && (
                    <span className="text-xs text-primary mt-1 inline-block">Your goal</span>
                  )}
                </div>
              </div>
            </button>

            {/* Goal 2 */}
            <button
              onClick={() => handleChoice('GOAL2')}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                selectedChoice === 'GOAL2'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedChoice === 'GOAL2'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedChoice === 'GOAL2' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{currentPair.goal2.label}</span>
                  {currentPair.goal2.source === 'user' && (
                    <span className="text-xs text-primary mt-1 inline-block">Your goal</span>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Neutral option */}
          <button
            onClick={() => handleChoice('NEUTRAL')}
            className={`mt-4 w-full p-4 rounded-xl border-2 text-center transition-all ${
              selectedChoice === 'NEUTRAL'
                ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200'
                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
            }`}
          >
            <span className={`font-medium ${selectedChoice === 'NEUTRAL' ? 'text-amber-700' : 'text-gray-600'}`}>
              {isAdvisorMode ? "They're equally important to the client" : "They're equally important to me"}
            </span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to Flexibility
          </Button>
          {currentIndex > 0 && (
            <Button variant="ghost" onClick={handlePrevious}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentIndex < tradeoffPairs.length - 1 ? (
            <Button onClick={handleNext} disabled={selectedChoice === null}>
              Next
            </Button>
          ) : (
            <Button onClick={onComplete} disabled={selectedChoice === null}>
              Continue to Summary
            </Button>
          )}
        </div>
      </div>

      {/* Skip option */}
      <p className="text-xs text-gray-500 text-center">
        Tip: These comparisons help us understand which goals to prioritize when resources are limited.
      </p>
    </div>
  );
}
