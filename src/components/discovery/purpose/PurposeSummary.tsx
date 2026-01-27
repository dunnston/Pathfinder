/**
 * Purpose Summary Component
 * Displays the final Statement of Financial Purpose with decision filters
 */

import { Button } from '@/components/common';
import type { FinancialPurpose, TradeoffAnchor } from '@/types/financialPurpose';
import {
  getTradeoffPhrases,
  TRADEOFF_AXIS_DISPLAY,
  PURPOSE_DRIVER_DISPLAY,
} from '@/data/purposeTemplates';

interface PurposeSummaryProps {
  data: FinancialPurpose;
  tradeoffAnchors: TradeoffAnchor[];
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode: boolean;
}

export function PurposeSummary({
  data,
  tradeoffAnchors,
  onComplete,
  onBack,
  isAdvisorMode,
}: PurposeSummaryProps): JSX.Element {
  // Get strong tradeoff leans (strength >= 4)
  const strongLeans = tradeoffAnchors.filter((a) => a.strength >= 4);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAdvisorMode ? "Client's Statement of Financial Purpose" : 'Your Statement of Financial Purpose'}
        </h2>
        <p className="text-gray-600">
          {isAdvisorMode
            ? "This statement will guide planning decisions and help navigate tradeoffs."
            : 'This is your financial "why" - use it to guide decisions and stay focused on what matters.'}
        </p>
      </div>

      {/* Main statement card */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <blockquote className="flex-1 text-xl text-gray-800 font-medium italic leading-relaxed">
            "{data.finalText}"
          </blockquote>
        </div>
      </div>

      {/* Decision filters */}
      {strongLeans.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Decision Filters
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            When tradeoffs come up, your preferences lean toward:
          </p>
          <div className="space-y-3">
            {strongLeans.map((anchor) => {
              const { leanPhrase } = getTradeoffPhrases(anchor.axis, anchor.lean);
              const axisName = TRADEOFF_AXIS_DISPLAY[anchor.axis];

              return (
                <div
                  key={anchor.axis}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Leans toward: <span className="text-primary">{leanPhrase}</span>
                    </p>
                    <p className="text-xs text-gray-500">{axisName}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-4 rounded-sm ${
                          level <= anchor.strength ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purpose drivers */}
      {(data.primaryDriver || data.secondaryDriver) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            What Money Enables
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.primaryDriver && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {PURPOSE_DRIVER_DISPLAY[data.primaryDriver]}
              </span>
            )}
            {data.secondaryDriver && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {PURPOSE_DRIVER_DISPLAY[data.secondaryDriver]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Vision anchors */}
      {data.visionAnchors && data.visionAnchors.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Vision
          </h3>
          <div className="space-y-2">
            {data.visionAnchors.map((anchor, index) => (
              <p key={index} className="text-gray-700 italic">
                "{anchor}"
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {data.notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Notes
          </h3>
          <p className="text-amber-800 text-sm">{data.notes}</p>
        </div>
      )}

      {/* How to use this */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How to use your purpose statement:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Reference it when making financial decisions or facing tradeoffs
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Share it with your financial advisor to guide recommendations
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Revisit it periodically to see if your priorities have shifted
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onBack}>
          Edit Statement
        </Button>
        <Button onClick={onComplete}>
          Complete
        </Button>
      </div>
    </div>
  );
}
