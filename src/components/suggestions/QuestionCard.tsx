/**
 * Question Card Component
 * Displays a single guided question with input and analysis hint
 */

import { useState } from 'react';
import type { GuidedQuestion, QuestionAnswer } from '@/types/suggestions';
import { Lightbulb, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/common';

interface QuestionCardProps {
  /** The question to display */
  question: GuidedQuestion;
  /** Current answer if exists */
  currentAnswer?: QuestionAnswer;
  /** Called when user submits an answer */
  onAnswer: (value: string | number | boolean | string[], notes?: string, source?: string) => void;
  /** Optional class name */
  className?: string;
}

export function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  className = '',
}: QuestionCardProps): JSX.Element {
  const [value, setValue] = useState<string | number | boolean | string[]>(
    currentAnswer?.value ?? ''
  );
  const [notes, setNotes] = useState(currentAnswer?.notes ?? '');
  const [source, setSource] = useState(currentAnswer?.analysisSource ?? '');
  const [showNotes, setShowNotes] = useState(!!currentAnswer?.notes);

  const handleSubmit = () => {
    if (value === '' || value === undefined) return;
    onAnswer(value, notes || undefined, source || undefined);
  };

  const renderInput = () => {
    switch (question.inputType) {
      case 'yes_no':
        return (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue('yes')}
              className={`
                flex-1 rounded-lg border-2 px-4 py-3 text-center font-medium transition-all
                ${value === 'yes'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setValue('no')}
              className={`
                flex-1 rounded-lg border-2 px-4 py-3 text-center font-medium transition-all
                ${value === 'no'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              No
            </button>
          </div>
        );

      case 'yes_no_na':
        return (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue('yes')}
              className={`
                flex-1 rounded-lg border-2 px-4 py-3 text-center font-medium transition-all
                ${value === 'yes'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setValue('no')}
              className={`
                flex-1 rounded-lg border-2 px-4 py-3 text-center font-medium transition-all
                ${value === 'no'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setValue('na')}
              className={`
                flex-1 rounded-lg border-2 px-4 py-3 text-center font-medium transition-all
                ${value === 'na'
                  ? 'border-gray-500 bg-gray-50 text-gray-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Not Sure
            </button>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue(option.value)}
                className={`
                  w-full rounded-lg border-2 px-4 py-3 text-left transition-all
                  ${value === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className={`font-medium ${value === option.value ? 'text-blue-700' : 'text-gray-900'}`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className={`mt-1 text-sm ${value === option.value ? 'text-blue-600' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        );

      case 'scale': {
        const config = question.scaleConfig || { min: 1, max: 5, minLabel: 'Low', maxLabel: 'High' };
        return (
          <div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step || 1}
              value={typeof value === 'number' ? value : config.min}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>{config.minLabel}</span>
              <span className="font-medium text-gray-900">{value || config.min}</span>
              <span>{config.maxLabel}</span>
            </div>
          </div>
        );
      }

      case 'text':
        return (
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your answer..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Enter a number..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Question header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">{question.userQuestion}</h3>
      </div>

      {/* Question body */}
      <div className="p-6">
        {/* Explanation */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
            <p className="text-sm text-gray-600">{question.explanation}</p>
          </div>
        </div>

        {/* Analysis hint */}
        <div className="mb-6 rounded-lg bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-amber-800">How to find this answer</p>
              <p className="mt-1 text-sm text-amber-700">{question.analysisHint}</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">{renderInput()}</div>

        {/* Optional notes section */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showNotes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Add notes or analysis source (optional)
          </button>

          {showNotes && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about your analysis..."
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Analysis Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Morningstar, CPA, Own calculation"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={value === '' || value === undefined}
          className="w-full"
        >
          {currentAnswer ? 'Update Answer' : 'Save Answer & Continue'}
        </Button>
      </div>
    </div>
  );
}
