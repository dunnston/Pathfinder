/**
 * Vision Anchor Step Component (Step 4)
 * Select vivid phrases that describe the life being built toward
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import { VISION_ANCHOR_OPTIONS } from '@/data/purposeTemplates';

interface VisionAnchorStepProps {
  selectedAnchors: string[];
  onAnchorsChange: (anchors: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function VisionAnchorStep({
  selectedAnchors,
  onAnchorsChange,
  onComplete,
  onBack,
  isAdvisorMode,
}: VisionAnchorStepProps): JSX.Element {
  const [selected, setSelected] = useState<string[]>(selectedAnchors);
  const [customAnchor, setCustomAnchor] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Update parent when selection changes
  useEffect(() => {
    onAnchorsChange(selected);
  }, [selected, onAnchorsChange]);

  const handleToggle = (anchorText: string): void => {
    setSelected((prev) => {
      if (prev.includes(anchorText)) {
        return prev.filter((a) => a !== anchorText);
      } else if (prev.length < 2) {
        return [...prev, anchorText];
      } else {
        // Replace the second one
        return [prev[0], anchorText];
      }
    });
  };

  const handleAddCustom = (): void => {
    if (customAnchor.trim() && selected.length < 2) {
      setSelected((prev) => [...prev, customAnchor.trim()]);
      setCustomAnchor('');
      setShowCustomInput(false);
    }
  };

  const canContinue = selected.length >= 1;

  // Check if a selection is custom (not from predefined options)
  const isCustomAnchor = (text: string): boolean => {
    return !VISION_ANCHOR_OPTIONS.some((opt) => opt.text === text);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          What life are you building toward?
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "Which of these feels most like the life the client is working toward? Select 1-2 phrases."
            : 'Which of these feels most like the life you\'re building toward? Select 1-2 phrases.'}
        </p>
      </div>

      {/* Selection count */}
      <div className="flex items-center justify-center gap-2">
        <span className={`text-sm ${canContinue ? 'text-green-600' : 'text-gray-500'}`}>
          {selected.length}/2 selected
        </span>
        {selected.length >= 1 && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Vision anchor cards */}
      <div className="grid gap-3">
        {VISION_ANCHOR_OPTIONS.map((anchor) => {
          const isSelected = selected.includes(anchor.text);

          return (
            <button
              key={anchor.id}
              onClick={() => handleToggle(anchor.text)}
              className={`
                text-left p-4 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center
                    ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
                  `}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Text */}
                <p className={`flex-1 ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>
                  "{anchor.text}"
                </p>
              </div>
            </button>
          );
        })}

        {/* Custom anchors that were added */}
        {selected.filter(isCustomAnchor).map((customText) => (
          <div
            key={customText}
            className="text-left p-4 rounded-xl border-2 border-primary bg-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-primary bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="flex-1 text-primary font-medium">
                "{customText}"
              </p>
              <button
                onClick={() => setSelected((prev) => prev.filter((a) => a !== customText))}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <span className="inline-block mt-2 text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
              Custom
            </span>
          </div>
        ))}

        {/* Add custom option */}
        {!showCustomInput && selected.length < 2 && (
          <button
            onClick={() => setShowCustomInput(true)}
            className="text-left p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="flex-1 text-gray-500">
                Write your own...
              </p>
            </div>
          </button>
        )}

        {/* Custom input */}
        {showCustomInput && (
          <div className="p-4 rounded-xl border-2 border-gray-300 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the life you're building toward:
            </label>
            <textarea
              value={customAnchor}
              onChange={(e) => setCustomAnchor(e.target.value)}
              placeholder="e.g., 'A life where I can work when I want and spend winters somewhere warm'"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows={2}
              maxLength={200}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                {customAnchor.length}/200 characters
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomAnchor('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddCustom}
                  disabled={!customAnchor.trim() || selected.length >= 2}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected preview */}
      {selected.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2">Your vision:</p>
          <div className="space-y-2">
            {selected.map((anchor, index) => (
              <div key={anchor} className="flex items-start gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 italic">"{anchor}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
