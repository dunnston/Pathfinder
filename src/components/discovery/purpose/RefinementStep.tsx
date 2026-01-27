/**
 * Refinement Step Component (Step 6)
 * Reflection questions and final editing of the purpose statement
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import type { SoFPDraft } from '@/types/financialPurpose';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import { VALUE_CARDS } from '@/data/valueCards';
import { SOFP_MAX_LENGTH, REFINEMENT_QUESTIONS } from '@/data/purposeTemplates';

interface RefinementStepProps {
  drafts: SoFPDraft[];
  selectedDraftId?: string;
  finalText?: string;
  valuesData?: Partial<ValuesDiscovery>;
  onFinalTextChange: (text: string, missingValues?: string[], notes?: string) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function RefinementStep({
  drafts,
  selectedDraftId,
  finalText: existingFinalText,
  valuesData,
  onFinalTextChange,
  onComplete,
  onBack,
  isAdvisorMode,
}: RefinementStepProps): JSX.Element {
  // Get the selected draft text as starting point
  const selectedDraft = drafts.find((d) => d.id === selectedDraftId);
  const initialText = existingFinalText || selectedDraft?.text || '';

  const [finalText, setFinalText] = useState(initialText);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [motivatingWord, setMotivatingWord] = useState('');
  const [missingValue, setMissingValue] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Get top 5 values for missing value selection
  const top5Values = valuesData?.top5 || [];
  const top5ValueCards = top5Values
    .map((id) => VALUE_CARDS.find((card) => card.id === id))
    .filter(Boolean);

  // Update parent when final text changes
  useEffect(() => {
    const missingValues = missingValue ? [missingValue] : undefined;
    onFinalTextChange(finalText, missingValues, notes || undefined);
  }, [finalText, missingValue, notes, onFinalTextChange]);

  const handleAnswerChange = (questionId: string, answer: string): void => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleApplyWord = (): void => {
    if (motivatingWord.trim()) {
      // Try to incorporate the word if it's not already there
      const word = motivatingWord.trim().toLowerCase();
      if (!finalText.toLowerCase().includes(word)) {
        // Add it to the end before the period
        const trimmed = finalText.trim();
        if (trimmed.endsWith('.')) {
          setFinalText(trimmed.slice(0, -1) + `, with ${word}.`);
        } else {
          setFinalText(trimmed + ` with ${word}.`);
        }
      }
      setMotivatingWord('');
    }
  };

  const isTextChanged = finalText !== initialText;
  const characterCount = finalText.length;
  const isNearLimit = characterCount > SOFP_MAX_LENGTH * 0.9;
  const isOverLimit = characterCount > SOFP_MAX_LENGTH;

  const canContinue = finalText.trim().length >= 20;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Refine Your Statement
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Answer a few quick questions to ensure the statement truly reflects the client."
            : 'Answer a few quick questions to make sure this really sounds like you.'}
        </p>
      </div>

      {/* Current statement with edit */}
      <div className="bg-white rounded-xl border-2 border-primary/30 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Statement of Financial Purpose
        </label>
        <textarea
          value={finalText}
          onChange={(e) => setFinalText(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-lg"
          rows={4}
          maxLength={SOFP_MAX_LENGTH + 50} // Allow slight overflow for editing
        />
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs ${
              isOverLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-gray-400'
            }`}
          >
            {characterCount}/{SOFP_MAX_LENGTH} characters
            {isOverLimit && ' (over limit)'}
          </span>
          {isTextChanged && (
            <button
              onClick={() => setFinalText(initialText)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Reset to original
            </button>
          )}
        </div>
      </div>

      {/* Reflection questions */}
      <div className="space-y-4">
        {/* Question 1: Authenticity */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="font-medium text-gray-900 mb-3">
            {REFINEMENT_QUESTIONS[0].question}
          </p>
          <div className="flex gap-3">
            {['Sounds like me', 'Needs adjustment'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange('authenticity', option)}
                className={`
                  flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all
                  ${answers.authenticity === option
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
          {answers.authenticity === 'Needs adjustment' && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
              Take a moment to edit your statement above. Make it sound more like something you would actually say.
            </p>
          )}
        </div>

        {/* Question 2: Missing value */}
        {top5ValueCards.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="font-medium text-gray-900 mb-3">
              {REFINEMENT_QUESTIONS[1].question}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMissingValue(null)}
                className={`
                  py-1.5 px-3 rounded-full text-sm font-medium transition-all
                  ${missingValue === null
                    ? 'bg-green-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                None - all covered
              </button>
              {top5ValueCards.map((value) => (
                <button
                  key={value!.id}
                  onClick={() => setMissingValue(value!.id)}
                  className={`
                    py-1.5 px-3 rounded-full text-sm font-medium transition-all
                    ${missingValue === value!.id
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {value!.title}
                </button>
              ))}
            </div>
            {missingValue && (
              <p className="mt-3 text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
                Consider how you might incorporate this value into your statement, or note it as something to keep in mind alongside your purpose.
              </p>
            )}
          </div>
        )}

        {/* Question 3: Motivating word */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="font-medium text-gray-900 mb-3">
            {REFINEMENT_QUESTIONS[2].question}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={motivatingWord}
              onChange={(e) => setMotivatingWord(e.target.value)}
              placeholder="e.g., joy, freedom, peace..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              maxLength={30}
            />
            <Button
              variant="secondary"
              onClick={handleApplyWord}
              disabled={!motivatingWord.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Optional notes */}
      <div className="bg-gray-50 rounded-xl p-5">
        <label className="block font-medium text-gray-900 mb-2">
          Any notes for your advisor? (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything that was hard to express, or that you want to discuss..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          rows={2}
          maxLength={500}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canContinue}>
          View Final Statement
        </Button>
      </div>
    </div>
  );
}
