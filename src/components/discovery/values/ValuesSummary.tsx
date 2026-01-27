/**
 * Values Summary Component
 * Displays the completed values discovery results
 */

import { useMemo } from 'react';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import { getCardsByIds, CATEGORY_DISPLAY_NAMES } from '@/data/valueCards';
import { getCategorySummary } from '@/services/valuesLogic';
import { Button } from '@/components/common';

interface ValuesSummaryProps {
  data: ValuesDiscovery;
  onComplete: () => void;
  onBack: () => void;
  isAdvisorMode?: boolean;
}

export function ValuesSummary({
  data,
  onComplete,
  onBack,
  isAdvisorMode = false,
}: ValuesSummaryProps): JSX.Element {
  const top5Cards = useMemo(() => getCardsByIds(data.top5), [data.top5]);
  const categorySummary = useMemo(() => getCategorySummary(data.top5), [data.top5]);

  const dominant = data.derived?.dominantCategory;
  const secondary = data.derived?.secondaryCategory;

  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAdvisorMode ? "Client's Core Values Identified" : 'Your Core Values Identified'}
        </h2>
        <p className="text-gray-600">
          Here's a summary of what matters most when making financial decisions.
        </p>
      </div>

      {/* Top 5 Values */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
            5
          </span>
          Top Values
        </h3>
        <div className="space-y-3">
          {top5Cards.map((card, index) => (
            <div
              key={card.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <h4 className="font-medium text-gray-900">{card.title}</h4>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Value Categories
        </h3>
        <div className="space-y-3">
          {categorySummary.map(({ category, count, percentage }) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {CATEGORY_DISPLAY_NAMES[category]}
                </span>
                <span className="text-gray-500">
                  {count} value{count !== 1 ? 's' : ''} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driving Force */}
      {dominant && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Driving Force
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">{getCategoryIcon(dominant)}</span>
            </div>
            <div>
              <p className="font-bold text-xl text-primary">
                {CATEGORY_DISPLAY_NAMES[dominant]}
              </p>
              {secondary && (
                <p className="text-sm text-gray-600">
                  Supported by: {CATEGORY_DISPLAY_NAMES[secondary]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* What This Means */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          What This Means
        </h3>
        <p className="text-blue-800">
          {dominant && secondary
            ? `${isAdvisorMode ? 'The client\'s' : 'Your'} financial plan should emphasize ${CATEGORY_DISPLAY_NAMES[dominant].toLowerCase()}, while still supporting ${CATEGORY_DISPLAY_NAMES[secondary].toLowerCase()}.`
            : dominant
            ? `${isAdvisorMode ? 'The client\'s' : 'Your'} financial decisions are primarily driven by ${CATEGORY_DISPLAY_NAMES[dominant].toLowerCase()}.`
            : `These values will help guide ${isAdvisorMode ? 'the client\'s' : 'your'} financial decisions.`}
        </p>
        <p className="text-sm text-blue-700 mt-2">
          These insights will help prioritize recommendations and highlight important tradeoffs in the planning process.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}

/** Get icon for category */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    SECURITY: '\uD83D\uDD12',
    FREEDOM: '\uD83D\uDD4A\uFE0F',
    FAMILY: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67',
    GROWTH: '\uD83D\uDCC8',
    CONTRIBUTION: '\uD83E\uDD1D',
    PURPOSE: '\uD83C\uDFAF',
    CONTROL: '\uD83C\uDFDB\uFE0F',
    HEALTH: '\u2764\uFE0F',
    QUALITY_OF_LIFE: '\uD83C\uDF3F',
  };
  return icons[category] || '\u2B50';
}
