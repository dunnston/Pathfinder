/**
 * Tradeoff Anchor Step Component (Step 3)
 * Answer forced-choice questions to establish decision filters
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import type { TradeoffAnchor, TradeoffAxis } from '@/types/financialPurpose';
import { TRADEOFF_QUESTIONS } from '@/data/purposeTemplates';

interface TradeoffAnchorStepProps {
  tradeoffAnchors: TradeoffAnchor[];
  onAnchorsChange: (anchors: TradeoffAnchor[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function TradeoffAnchorStep({
  tradeoffAnchors,
  onAnchorsChange,
  onComplete,
  onBack,
  isAdvisorMode,
}: TradeoffAnchorStepProps): JSX.Element {
  // Initialize answers from existing anchors
  const [answers, setAnswers] = useState<Record<string, TradeoffAnchor>>(() => {
    const initial: Record<string, TradeoffAnchor> = {};
    tradeoffAnchors.forEach((anchor) => {
      const question = TRADEOFF_QUESTIONS.find((q) => q.axis === anchor.axis);
      if (question) {
        initial[question.id] = anchor;
      }
    });
    return initial;
  });

  // Update parent when answers change
  useEffect(() => {
    const anchors = Object.values(answers);
    onAnchorsChange(anchors);
  }, [answers, onAnchorsChange]);

  const handleAnswer = (
    questionId: string,
    axis: TradeoffAxis,
    lean: 'A' | 'B'
  ): void => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        axis,
        lean,
        strength: 3, // Default to moderate strength
      },
    }));
  };

  const handleStrengthChange = (questionId: string, strength: 1 | 2 | 3 | 4 | 5): void => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        strength,
      },
    }));
  };

  // Must answer at least 3 questions
  const answeredCount = Object.keys(answers).length;
  const canContinue = answeredCount >= 3;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          When choices are hard...
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "When the client faces tradeoffs, which direction should money decisions lean? Answer at least 3."
            : 'When you face tradeoffs, which direction do you want your money decisions to lean? Answer at least 3.'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        <span className={`text-sm ${canContinue ? 'text-green-600' : 'text-gray-500'}`}>
          {answeredCount}/{TRADEOFF_QUESTIONS.length} answered
        </span>
        {canContinue && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {TRADEOFF_QUESTIONS.map((question, index) => {
          const answer = answers[question.id];
          const hasAnswer = !!answer;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                hasAnswer ? 'border-primary/30' : 'border-gray-200'
              }`}
            >
              {/* Question number and text */}
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`
                    flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                    ${hasAnswer ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
                  `}
                >
                  {index + 1}
                </span>
                <p className="font-medium text-gray-900">{question.question}</p>
              </div>

              {/* Options */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {/* Option A */}
                <button
                  onClick={() => handleAnswer(question.id, question.axis, 'A')}
                  className={`
                    text-left p-4 rounded-lg border-2 transition-all
                    ${answer?.lean === 'A'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2
                        ${answer?.lean === 'A' ? 'border-primary bg-primary' : 'border-gray-300'}
                      `}
                    >
                      {answer?.lean === 'A' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <span className={`font-medium ${answer?.lean === 'A' ? 'text-primary' : 'text-gray-900'}`}>
                      {question.optionA.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 pl-6">
                    {question.optionA.description}
                  </p>
                </button>

                {/* Option B */}
                <button
                  onClick={() => handleAnswer(question.id, question.axis, 'B')}
                  className={`
                    text-left p-4 rounded-lg border-2 transition-all
                    ${answer?.lean === 'B'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2
                        ${answer?.lean === 'B' ? 'border-primary bg-primary' : 'border-gray-300'}
                      `}
                    >
                      {answer?.lean === 'B' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <span className={`font-medium ${answer?.lean === 'B' ? 'text-primary' : 'text-gray-900'}`}>
                      {question.optionB.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 pl-6">
                    {question.optionB.description}
                  </p>
                </button>
              </div>

              {/* Strength slider (only show if answered) */}
              {hasAnswer && (
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-sm text-gray-600 mb-2">
                    How strongly do you feel about this?
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Slight</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={answer.strength}
                      onChange={(e) =>
                        handleStrengthChange(question.id, Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                      }
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xs text-gray-400">Strong</span>
                    <span className="w-8 text-center text-sm font-medium text-primary">
                      {answer.strength}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
