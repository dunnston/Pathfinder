/**
 * Discovery Insights Engine
 * Main orchestrator that combines all engines to generate complete insights
 *
 * Transforms Discovery data into:
 * 1. Strategy Profile (Planning Posture)
 * 2. Planning Focus Areas (prioritized domains)
 * 3. Action Recommendations (next steps)
 */

import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';
import type { DiscoveryInsights } from '@/types/strategyProfile';

import {
  generateStrategyProfile,
  type StrategyProfileInput,
} from './strategyProfileEngine';

import {
  generateFocusAreaRanking,
  type FocusAreaInput,
} from './planningFocusEngine';

import {
  generateActionRecommendations,
  type ActionInput,
} from './actionRecommendationEngine';

/** Input data for discovery insights generation */
export interface DiscoveryInsightsInput {
  basicContext?: BasicContext;
  valuesDiscovery?: ValuesDiscovery;
  financialGoals?: FinancialGoals;
  financialPurpose?: FinancialPurpose;
}

/**
 * Calculate completion percentage based on available data
 */
function calculateCompletionPercentage(input: DiscoveryInsightsInput): number {
  let score = 0;
  let total = 0;

  // Basic Context (25% weight)
  total += 25;
  if (input.basicContext?.age) score += 10;
  if (input.basicContext?.targetRetirementAge) score += 10;
  if (input.basicContext?.maritalStatus) score += 5;

  // Values Discovery (25% weight)
  total += 25;
  if (input.valuesDiscovery?.top5?.length === 5) score += 15;
  else if (input.valuesDiscovery?.top5?.length) score += 5;
  if (input.valuesDiscovery?.nonNegotiables?.length) score += 5;
  if (input.valuesDiscovery?.tradeoffResponses?.length) score += 5;

  // Financial Goals (25% weight)
  total += 25;
  if (input.financialGoals?.goals?.length) {
    const goalsWithPriority = input.financialGoals.goals.filter((g) => g.priority);
    if (goalsWithPriority.length >= 3) score += 15;
    else if (goalsWithPriority.length >= 1) score += 8;

    const goalsWithTimeline = input.financialGoals.goals.filter((g) => g.timeHorizon);
    if (goalsWithTimeline.length >= 3) score += 5;
    else if (goalsWithTimeline.length >= 1) score += 2;

    const goalsWithFlexibility = input.financialGoals.goals.filter((g) => g.flexibility);
    if (goalsWithFlexibility.length >= 3) score += 5;
    else if (goalsWithFlexibility.length >= 1) score += 2;
  }

  // Financial Purpose (25% weight)
  total += 25;
  if (input.financialPurpose?.primaryDriver) score += 10;
  if (input.financialPurpose?.tradeoffAnchors?.length) score += 5;
  if (input.financialPurpose?.finalStatement) score += 10;

  return Math.round((score / total) * 100);
}

/**
 * Check if there's enough data to generate meaningful insights
 */
export function hasEnoughDataForInsights(input: DiscoveryInsightsInput): boolean {
  const completion = calculateCompletionPercentage(input);
  return completion >= 25; // Need at least 25% completion
}

/**
 * Generate complete Discovery Insights from all available data
 */
export function generateDiscoveryInsights(input: DiscoveryInsightsInput): DiscoveryInsights | null {
  if (!hasEnoughDataForInsights(input)) {
    return null;
  }

  // Generate Strategy Profile
  const profileInput: StrategyProfileInput = {
    basicContext: input.basicContext,
    valuesDiscovery: input.valuesDiscovery,
    financialGoals: input.financialGoals,
    financialPurpose: input.financialPurpose,
  };

  const strategyProfile = generateStrategyProfile(profileInput);

  // Generate Focus Areas
  const focusInput: FocusAreaInput = {
    basicContext: input.basicContext,
    valuesDiscovery: input.valuesDiscovery,
    financialGoals: input.financialGoals,
    financialPurpose: input.financialPurpose,
  };

  const focusAreas = generateFocusAreaRanking(focusInput);

  // Generate Action Recommendations
  const actionInput: ActionInput = {
    basicContext: input.basicContext,
    valuesDiscovery: input.valuesDiscovery,
    financialGoals: input.financialGoals,
    financialPurpose: input.financialPurpose,
    focusAreas,
    strategyProfile,
  };

  const actions = generateActionRecommendations(actionInput);

  // Build input summary
  const inputSummary = {
    hasValues: Boolean(input.valuesDiscovery?.top5?.length),
    hasGoals: Boolean(input.financialGoals?.goals?.length),
    hasPurpose: Boolean(input.financialPurpose?.finalStatement),
    hasBasicContext: Boolean(input.basicContext?.age),
    completionPercentage: calculateCompletionPercentage(input),
  };

  return {
    strategyProfile,
    focusAreas,
    actions,
    inputSummary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get a brief status message about insight readiness
 */
export function getInsightsStatusMessage(input: DiscoveryInsightsInput): string {
  const completion = calculateCompletionPercentage(input);

  if (completion < 25) {
    return 'Complete more discovery sections to generate planning insights.';
  } else if (completion < 50) {
    return 'Basic insights available. Complete more sections for deeper analysis.';
  } else if (completion < 75) {
    return 'Good foundation for insights. Additional sections will refine recommendations.';
  } else {
    return 'Comprehensive data available for detailed planning insights.';
  }
}

/**
 * Get list of missing data that would improve insights
 */
export function getMissingDataSuggestions(input: DiscoveryInsightsInput): string[] {
  const suggestions: string[] = [];

  if (!input.basicContext?.age) {
    suggestions.push('Add your age and retirement target');
  }

  if (!input.valuesDiscovery?.top5?.length) {
    suggestions.push('Complete Values Discovery to identify your core values');
  } else if (input.valuesDiscovery.top5.length < 5) {
    suggestions.push('Select all 5 top values in Values Discovery');
  }

  if (!input.valuesDiscovery?.nonNegotiables?.length) {
    suggestions.push('Identify your non-negotiable values');
  }

  if (!input.financialGoals?.goals?.length) {
    suggestions.push('Add financial goals');
  } else {
    const goalsWithPriority = input.financialGoals.goals.filter((g) => g.priority);
    if (goalsWithPriority.length < input.financialGoals.goals.length) {
      suggestions.push('Set priorities for all your goals');
    }

    const goalsWithTimeline = input.financialGoals.goals.filter((g) => g.timeHorizon);
    if (goalsWithTimeline.length < input.financialGoals.goals.length) {
      suggestions.push('Add time horizons to your goals');
    }
  }

  if (!input.financialPurpose?.finalStatement) {
    suggestions.push('Complete your Statement of Financial Purpose');
  }

  return suggestions;
}
