/**
 * Purpose Intro Component (Step 0)
 * Explains the Statement of Financial Purpose and shows examples
 */

import { Button } from '@/components/common';
import { EXAMPLE_SOFP_STATEMENTS } from '@/data/purposeTemplates';

interface PurposeIntroProps {
  onStart: () => void;
  isAdvisorMode: boolean;
}

export function PurposeIntro({ onStart, isAdvisorMode }: PurposeIntroProps): JSX.Element {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isAdvisorMode ? 'Statement of Financial Purpose' : 'Create Your Financial Purpose'}
        </h2>
        <p className="text-lg text-gray-600">
          {isAdvisorMode
            ? "This exercise creates a 1-2 sentence statement that captures the client's 'why' for money and guides planning decisions."
            : "This is your 'why' for money. We'll create a 1-2 sentence statement to guide your decisions and help navigate tradeoffs."}
        </p>
      </div>

      {/* Example statements */}
      <div className="bg-gray-50 rounded-xl p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Example statements:</h3>
        <div className="space-y-4">
          {EXAMPLE_SOFP_STATEMENTS.slice(0, 3).map((statement, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200 text-gray-700 italic"
            >
              "{statement}"
            </div>
          ))}
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-gray-50 rounded-xl p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What to expect:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              1
            </span>
            <span className="text-gray-600">
              <strong>Review your inputs</strong> - Confirm your values and goals
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              2
            </span>
            <span className="text-gray-600">
              <strong>Choose what money enables</strong> - Select what matters most
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              3
            </span>
            <span className="text-gray-600">
              <strong>Set decision anchors</strong> - Define your tradeoff preferences
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              4
            </span>
            <span className="text-gray-600">
              <strong>Build your statement</strong> - Choose and refine your purpose
            </span>
          </li>
        </ul>
      </div>

      {/* Time estimate */}
      <p className="text-sm text-gray-500">
        Estimated time: 5-8 minutes
      </p>

      {/* Start button */}
      <Button onClick={onStart} className="px-8">
        Start Purpose Discovery
      </Button>
    </div>
  );
}
