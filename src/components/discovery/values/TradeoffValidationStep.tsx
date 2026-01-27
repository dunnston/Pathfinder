/**
 * TradeoffValidationStep Component
 * Step 5: Validate priorities through scenario-based tradeoff questions
 * 3-6 questions based on categories present in top 5
 */

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/common';
import type { TradeoffResponse, TradeoffChoice, TradeoffStrength, ValueCategory } from '@/types/valuesDiscovery';
import { getCardById } from '@/data/valueCards';

/** Tradeoff question template */
interface TradeoffTemplate {
  id: string;
  categoryA: ValueCategory;
  categoryB: ValueCategory;
  question: string;
  optionA: string;
  optionB: string;
}

/** All available tradeoff templates */
const TRADEOFF_TEMPLATES: TradeoffTemplate[] = [
  {
    id: 'security_vs_freedom',
    categoryA: 'SECURITY',
    categoryB: 'FREEDOM',
    question: 'When planning for the future:',
    optionA: "I'd rather work longer or spend less to feel more secure.",
    optionB: "I'd rather accept more uncertainty to gain freedom sooner.",
  },
  {
    id: 'security_vs_growth',
    categoryA: 'SECURITY',
    categoryB: 'GROWTH',
    question: 'With investments and opportunities:',
    optionA: 'I prefer safer, steadier outcomes even if growth is lower.',
    optionB: 'I prefer higher upside even if results vary.',
  },
  {
    id: 'control_vs_freedom',
    categoryA: 'CONTROL',
    categoryB: 'FREEDOM',
    question: 'With my financial plan:',
    optionA: 'I want a detailed plan and tight oversight to avoid surprises.',
    optionB: 'I want flexibility even if outcomes are less predictable.',
  },
  {
    id: 'quality_vs_security',
    categoryA: 'QUALITY_OF_LIFE',
    categoryB: 'SECURITY',
    question: 'Balancing lifestyle and safety:',
    optionA: "I'd reduce lifestyle spending to build a stronger safety buffer.",
    optionB: "I'd keep lifestyle spending and accept a smaller buffer.",
  },
  {
    id: 'family_vs_freedom',
    categoryA: 'FAMILY',
    categoryB: 'FREEDOM',
    question: 'When family needs conflict with personal goals:',
    optionA: 'Supporting family is worth sacrificing personal flexibility.',
    optionB: 'I need flexibility even if it limits support I can provide.',
  },
  {
    id: 'health_vs_growth',
    categoryA: 'HEALTH',
    categoryB: 'GROWTH',
    question: 'Prioritizing health versus other goals:',
    optionA: "I'd prioritize health-related spending even if it slows other goals.",
    optionB: "I'd keep health spending minimal to accelerate other goals.",
  },
  {
    id: 'contribution_vs_security',
    categoryA: 'CONTRIBUTION',
    categoryB: 'SECURITY',
    question: 'Giving versus security:',
    optionA: "I'd give more generously even with less personal cushion.",
    optionB: "I'd build security first and give when I have surplus.",
  },
  {
    id: 'purpose_vs_quality',
    categoryA: 'PURPOSE',
    categoryB: 'QUALITY_OF_LIFE',
    question: 'Meaning versus comfort:',
    optionA: "I'd accept a simpler lifestyle to do meaningful work.",
    optionB: "I'd prioritize comfort and find meaning in other ways.",
  },
];

interface TradeoffValidationStepProps {
  top5: string[];
  existingResponses: TradeoffResponse[];
  onResponsesChange: (responses: TradeoffResponse[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function TradeoffValidationStep({
  top5,
  existingResponses,
  onResponsesChange,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: TradeoffValidationStepProps): JSX.Element {
  // Get categories present in top 5
  const top5Categories = useMemo(() => {
    const categories = new Set<ValueCategory>();
    for (const cardId of top5) {
      const card = getCardById(cardId);
      if (card) {
        categories.add(card.category);
      }
    }
    return categories;
  }, [top5]);

  // Generate relevant tradeoff questions (3-6 based on categories)
  const relevantQuestions = useMemo(() => {
    const questions: TradeoffTemplate[] = [];

    for (const template of TRADEOFF_TEMPLATES) {
      // Include if both categories are in top5, or at least one with high relevance
      const hasA = top5Categories.has(template.categoryA);
      const hasB = top5Categories.has(template.categoryB);

      if (hasA && hasB) {
        questions.push(template);
      } else if ((hasA || hasB) && questions.length < 4) {
        // Include some partial matches if we don't have enough
        questions.push(template);
      }

      if (questions.length >= 6) break;
    }

    // Ensure at least 3 questions
    if (questions.length < 3) {
      for (const template of TRADEOFF_TEMPLATES) {
        if (!questions.includes(template)) {
          questions.push(template);
          if (questions.length >= 3) break;
        }
      }
    }

    return questions.slice(0, 6);
  }, [top5Categories]);

  // Track current question index
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Start from the first unanswered question
    const answeredIds = new Set(existingResponses.map((r) => r.id));
    const firstUnanswered = relevantQuestions.findIndex((q) => !answeredIds.has(q.id));
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  });

  // Track responses
  const [responses, setResponses] = useState<Map<string, TradeoffResponse>>(() => {
    const map = new Map<string, TradeoffResponse>();
    for (const r of existingResponses) {
      map.set(r.id, r);
    }
    return map;
  });

  const currentQuestion = relevantQuestions[currentIndex];
  const currentResponse = currentQuestion ? responses.get(currentQuestion.id) : undefined;

  const handleAnswer = useCallback((choice: TradeoffChoice, strength: TradeoffStrength) => {
    if (!currentQuestion) return;

    const response: TradeoffResponse = {
      id: currentQuestion.id,
      categoryA: currentQuestion.categoryA,
      categoryB: currentQuestion.categoryB,
      choice,
      strength,
      createdAt: new Date().toISOString(),
    };

    const newResponses = new Map(responses);
    newResponses.set(currentQuestion.id, response);
    setResponses(newResponses);
    onResponsesChange(Array.from(newResponses.values()));
  }, [currentQuestion, responses, onResponsesChange]);

  const handleNext = useCallback(() => {
    if (currentIndex < relevantQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, relevantQuestions.length]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const isAllAnswered = relevantQuestions.every((q) => responses.has(q.id));
  const progress = Math.round((responses.size / relevantQuestions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Tradeoff Validation
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "These questions help clarify how the client weighs competing priorities."
            : 'These questions help clarify how you weigh competing priorities.'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Question {currentIndex + 1} of {relevantQuestions.length}
          </span>
          <span className="text-gray-500">{progress}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      {currentQuestion && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4">
            {/* Option A */}
            <TradeoffOption
              label="A"
              text={currentQuestion.optionA}
              isSelected={currentResponse?.choice === 'A'}
              strength={currentResponse?.choice === 'A' ? currentResponse.strength : undefined}
              onSelect={(strength) => handleAnswer('A', strength)}
            />

            {/* Neutral option */}
            <button
              onClick={() => handleAnswer('NEUTRAL', 3)}
              className={`
                w-full p-4 rounded-lg border-2 text-center transition-all
                ${currentResponse?.choice === 'NEUTRAL'
                  ? 'border-gray-500 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-gray-600">
                Both are equally important / No preference
              </span>
            </button>

            {/* Option B */}
            <TradeoffOption
              label="B"
              text={currentQuestion.optionB}
              isSelected={currentResponse?.choice === 'B'}
              strength={currentResponse?.choice === 'B' ? currentResponse.strength : undefined}
              onSelect={(strength) => handleAnswer('B', strength)}
            />
          </div>
        </div>
      )}

      {/* Question dots */}
      <div className="flex justify-center gap-2">
        {relevantQuestions.map((q, idx) => {
          const hasResponse = responses.has(q.id);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${isCurrent
                  ? 'bg-primary scale-125'
                  : hasResponse
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
              aria-label={`Go to question ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            Back to Top 5
          </Button>
          {currentIndex > 0 && (
            <Button variant="secondary" onClick={handlePrevQuestion}>
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentIndex < relevantQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!currentResponse}
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              disabled={!isAllAnswered}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Individual tradeoff option with strength slider */
interface TradeoffOptionProps {
  label: 'A' | 'B';
  text: string;
  isSelected: boolean;
  strength?: TradeoffStrength;
  onSelect: (strength: TradeoffStrength) => void;
}

function TradeoffOption({
  label,
  text,
  isSelected,
  strength,
  onSelect,
}: TradeoffOptionProps): JSX.Element {
  // For A, strength 1 = strong, 2 = mild
  // For B, strength 4 = mild, 5 = strong
  const relevantStrengths: TradeoffStrength[] = label === 'A' ? [1, 2] : [4, 5];

  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all
        ${isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center">
          {label}
        </span>
        <div className="flex-1">
          <p className="text-gray-900">{text}</p>

          {/* Strength buttons */}
          <div className="flex gap-2 mt-3">
            {relevantStrengths.map((s) => {
              const isStrong = s === 1 || s === 5;
              return (
                <button
                  key={s}
                  onClick={() => onSelect(s)}
                  className={`
                    px-3 py-1.5 text-sm rounded-full transition-all
                    ${isSelected && strength === s
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {isStrong ? 'Strongly' : 'Somewhat'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
