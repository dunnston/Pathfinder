/**
 * Free Recall Step Component
 * Phase 1: User enters their own goals in free-form text
 */

import { useState, useCallback } from 'react';
import type { FinancialGoal } from '@/types/financialGoals';
import { createUserGoal } from '@/data/goalCards';
import { Button } from '@/components/common';

interface FreeRecallStepProps {
  goals: FinancialGoal[];
  onGoalsChange: (goals: FinancialGoal[]) => void;
  onComplete: () => void;
  isAdvisorMode?: boolean;
}

const MAX_GOALS = 20;
const MAX_GOAL_LENGTH = 200;

export function FreeRecallStep({
  goals,
  onGoalsChange,
  onComplete,
  isAdvisorMode = false,
}: FreeRecallStepProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_GOAL_LENGTH);
    setInputValue(value);
    setError(null);
  }, []);

  const handleAddGoal = useCallback(() => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Please enter a goal');
      return;
    }

    if (goals.length >= MAX_GOALS) {
      setError(`Maximum ${MAX_GOALS} goals allowed`);
      return;
    }

    // Check for duplicates
    const isDuplicate = goals.some(
      (g) => g.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError('This goal has already been added');
      return;
    }

    const newGoal = createUserGoal(trimmed);
    onGoalsChange([...goals, newGoal]);
    setInputValue('');
    setError(null);
  }, [inputValue, goals, onGoalsChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddGoal();
      }
    },
    [handleAddGoal]
  );

  const handleRemoveGoal = useCallback(
    (goalId: string) => {
      onGoalsChange(goals.filter((g) => g.id !== goalId));
    },
    [goals, onGoalsChange]
  );

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isAdvisorMode ? "What Are The Client's Goals?" : "What Are Your Goals?"}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "When the client thinks about their future and money, what do they hope to do, buy, protect, or accomplish?"
            : "When you think about your future and your money, what are some things you hope to do, buy, protect, or accomplish?"}
        </p>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "Pay off the house", "Travel more", "Help kids with college"'
            className={`
              flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
              ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}
            `}
            maxLength={MAX_GOAL_LENGTH}
            aria-label="Enter a financial goal"
            aria-describedby={error ? 'goal-error' : undefined}
          />
          <Button
            onClick={handleAddGoal}
            disabled={!inputValue.trim()}
            variant="primary"
          >
            Add
          </Button>
        </div>
        {error && (
          <p id="goal-error" className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Press Enter or click Add to add each goal. {goals.length}/{MAX_GOALS} goals added.
        </p>
      </div>

      {/* Goals list */}
      {goals.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            {isAdvisorMode ? "Client's Goals:" : 'Your Goals:'}
          </h3>
          <ul className="space-y-2" role="list" aria-label="Added goals">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
              >
                <span className="text-gray-800">{goal.label}</span>
                <button
                  onClick={() => handleRemoveGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                  aria-label={`Remove goal: ${goal.label}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state hint */}
      {goals.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Not sure where to start?</p>
              <p>
                Think about things like: retirement plans, travel dreams, helping family,
                paying off debt, or anything else that matters to you financially.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} variant="primary">
          {goals.length === 0 ? 'Skip to Common Goals' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
