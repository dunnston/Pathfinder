/**
 * Values Discovery Logic
 * Category counting, dominant/secondary calculation, and derived insights
 */

import type {
  ValueCategory,
  CategoryCount,
  ValuesDiscoveryDerived,
  ValuesDiscovery,
} from '@/types/valuesDiscovery';
import { VALUE_CARDS, getCardById } from '@/data/valueCards';

/** All value categories */
const ALL_CATEGORIES: ValueCategory[] = [
  'SECURITY',
  'FREEDOM',
  'FAMILY',
  'GROWTH',
  'CONTRIBUTION',
  'PURPOSE',
  'CONTROL',
  'HEALTH',
  'QUALITY_OF_LIFE',
];

/** Create an empty category count */
export function createEmptyCategoryCount(): CategoryCount {
  return ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = 0;
    return acc;
  }, {} as CategoryCount);
}

/** Count categories from a list of card IDs */
export function countCategories(cardIds: string[]): CategoryCount {
  const counts = createEmptyCategoryCount();

  for (const cardId of cardIds) {
    const card = getCardById(cardId);
    if (card) {
      counts[card.category]++;
    }
  }

  return counts;
}

/** Get cards marked as IMPORTANT from piles */
export function getImportantCardIds(piles: Record<string, 'IMPORTANT' | 'UNSURE' | 'NOT_IMPORTANT'>): string[] {
  return Object.entries(piles)
    .filter(([, pile]) => pile === 'IMPORTANT')
    .map(([cardId]) => cardId);
}

/** Get sorted categories by count (descending) */
function getSortedCategories(counts: CategoryCount): Array<{ category: ValueCategory; count: number }> {
  return ALL_CATEGORIES
    .map((category) => ({ category, count: counts[category] }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Find dominant and secondary categories with tie-breaking logic
 * Tie-breaker order:
 * 1. Most represented in nonNegotiables
 * 2. Most represented in top10
 * 3. First alphabetically (fallback)
 */
export function findDominantCategories(
  top5Counts: CategoryCount,
  nonNegotiablesCounts: CategoryCount,
  top10Counts: CategoryCount
): { dominant?: ValueCategory; secondary?: ValueCategory } {
  const sorted = getSortedCategories(top5Counts);

  // No cards? No dominant category
  if (sorted[0].count === 0) {
    return {};
  }

  // Helper to break ties between categories with same count
  const breakTie = (categories: ValueCategory[]): ValueCategory => {
    if (categories.length === 1) return categories[0];

    // Try nonNegotiables first
    const byNonNeg = categories.sort(
      (a, b) => nonNegotiablesCounts[b] - nonNegotiablesCounts[a]
    );
    if (nonNegotiablesCounts[byNonNeg[0]] > nonNegotiablesCounts[byNonNeg[1]]) {
      return byNonNeg[0];
    }

    // Try top10
    const byTop10 = categories.sort((a, b) => top10Counts[b] - top10Counts[a]);
    if (top10Counts[byTop10[0]] > top10Counts[byTop10[1]]) {
      return byTop10[0];
    }

    // Alphabetical fallback
    return categories.sort()[0];
  };

  // Find dominant (highest count)
  const maxCount = sorted[0].count;
  const tiedForFirst = sorted
    .filter((s) => s.count === maxCount)
    .map((s) => s.category);
  const dominant = breakTie(tiedForFirst);

  // Find secondary (second highest, excluding dominant)
  const remaining = sorted.filter((s) => s.category !== dominant);
  if (remaining[0].count === 0) {
    return { dominant };
  }

  const secondMaxCount = remaining[0].count;
  const tiedForSecond = remaining
    .filter((s) => s.count === secondMaxCount)
    .map((s) => s.category);
  const secondary = breakTie(tiedForSecond);

  return { dominant, secondary };
}

/**
 * Known conflict pairs for detecting value tensions
 */
const CONFLICT_PAIRS: Array<[ValueCategory, ValueCategory]> = [
  ['SECURITY', 'FREEDOM'],
  ['SECURITY', 'GROWTH'],
  ['CONTROL', 'FREEDOM'],
  ['FAMILY', 'FREEDOM'],
  ['QUALITY_OF_LIFE', 'SECURITY'],
];

/**
 * Detect conflict flags based on categories in top5 and nonNegotiables
 * Flag if both categories appear in top5, or one is dominant and the other in nonNegotiables
 */
export function detectConflictFlags(
  top5CardIds: string[],
  nonNegotiableIds: string[],
  dominant?: ValueCategory
): string[] {
  const flags: string[] = [];
  const top5Categories = new Set(
    top5CardIds.map((id) => getCardById(id)?.category).filter(Boolean)
  );
  const nonNegCategories = new Set(
    nonNegotiableIds.map((id) => getCardById(id)?.category).filter(Boolean)
  );

  for (const [catA, catB] of CONFLICT_PAIRS) {
    // Both in top5
    if (top5Categories.has(catA) && top5Categories.has(catB)) {
      flags.push(`${catA}_vs_${catB}`);
      continue;
    }
    // Dominant vs other in nonNegotiables
    if (dominant === catA && nonNegCategories.has(catB)) {
      flags.push(`${catA}_vs_${catB}`);
      continue;
    }
    if (dominant === catB && nonNegCategories.has(catA)) {
      flags.push(`${catA}_vs_${catB}`);
    }
  }

  return flags;
}

/**
 * Compute tradeoff scoring indices from tradeoff responses
 * Returns 0-100 scale where:
 * - 0 = fully prefer category A (e.g., SECURITY)
 * - 100 = fully prefer category B (e.g., GROWTH)
 * - 50 = neutral/balanced
 */
export function computeTradeoffIndex(
  responses: ValuesDiscovery['tradeoffResponses'],
  categoryA: ValueCategory,
  categoryB: ValueCategory
): number | undefined {
  // Find responses that involve these two categories
  const relevantResponses = responses.filter(
    (r) =>
      (r.categoryA === categoryA && r.categoryB === categoryB) ||
      (r.categoryA === categoryB && r.categoryB === categoryA)
  );

  if (relevantResponses.length === 0) {
    return undefined;
  }

  let totalPoints = 0;

  for (const response of relevantResponses) {
    // Determine which way the response leans relative to categoryA vs categoryB
    const isNormalOrder = response.categoryA === categoryA;

    if (response.choice === 'NEUTRAL') {
      totalPoints += 50;
    } else if (response.choice === 'A') {
      // Points toward categoryA (lower index)
      const strengthPoints = response.strength === 1 ? 0 : response.strength === 2 ? 25 : 50;
      totalPoints += isNormalOrder ? strengthPoints : 100 - strengthPoints;
    } else {
      // Points toward categoryB (higher index)
      const strengthPoints = response.strength === 5 ? 100 : response.strength === 4 ? 75 : 50;
      totalPoints += isNormalOrder ? strengthPoints : 100 - strengthPoints;
    }
  }

  return Math.round(totalPoints / relevantResponses.length);
}

/**
 * Compute all derived insights from values discovery data
 */
export function computeDerivedInsights(data: ValuesDiscovery): ValuesDiscoveryDerived {
  // Category counts at each phase
  const importantCardIds = getImportantCardIds(data.piles);
  const step1ImportantCounts = countCategories(importantCardIds);
  const top10Counts = countCategories(data.top10);
  const top5Counts = countCategories(data.top5);
  const nonNegotiablesCounts = countCategories(data.nonNegotiables);

  // Dominant and secondary categories
  const { dominant, secondary } = findDominantCategories(
    top5Counts,
    nonNegotiablesCounts,
    top10Counts
  );

  // Driving force (same as dominant for MVP)
  const drivingForce = dominant;

  // Conflict flags
  const conflictFlags = detectConflictFlags(data.top5, data.nonNegotiables, dominant);

  // Tradeoff scoring indices
  const tradeoffResponses = data.tradeoffResponses || [];
  const securityVsGrowthIndex = computeTradeoffIndex(tradeoffResponses, 'SECURITY', 'GROWTH');
  const controlVsFreedomIndex = computeTradeoffIndex(tradeoffResponses, 'CONTROL', 'FREEDOM');

  return {
    categoryCounts: {
      step1Important: step1ImportantCounts,
      top10: top10Counts,
      top5: top5Counts,
      nonNegotiables: nonNegotiablesCounts,
    },
    dominantCategory: dominant,
    secondaryCategory: secondary,
    drivingForce,
    conflictFlags: conflictFlags.length > 0 ? conflictFlags : undefined,
    securityVsGrowthIndex,
    controlVsFreedomIndex,
  };
}

/**
 * Check if Step 1 (broad sort) has enough data to proceed
 * User must sort all cards (or skip remaining to UNSURE)
 */
export function isStep1Complete(piles: Record<string, 'IMPORTANT' | 'UNSURE' | 'NOT_IMPORTANT'>): boolean {
  // Must have sorted at least the majority of cards
  const sortedCount = Object.keys(piles).length;
  return sortedCount >= VALUE_CARDS.length * 0.9; // Allow 10% unsorted as "skipped"
}

/**
 * Check if there are enough IMPORTANT cards to proceed to top 10
 */
export function hasEnoughImportant(piles: Record<string, 'IMPORTANT' | 'UNSURE' | 'NOT_IMPORTANT'>): boolean {
  const importantCount = Object.values(piles).filter((p) => p === 'IMPORTANT').length;
  return importantCount >= 5; // Need at least 5 to form a top 5
}

/**
 * Get the count of IMPORTANT cards
 */
export function getImportantCount(piles: Record<string, 'IMPORTANT' | 'UNSURE' | 'NOT_IMPORTANT'>): number {
  return Object.values(piles).filter((p) => p === 'IMPORTANT').length;
}

/**
 * Get category summary for display
 */
export function getCategorySummary(cardIds: string[]): Array<{ category: ValueCategory; count: number; percentage: number }> {
  const counts = countCategories(cardIds);
  const total = cardIds.length || 1;

  return getSortedCategories(counts)
    .filter((c) => c.count > 0)
    .map((c) => ({
      ...c,
      percentage: Math.round((c.count / total) * 100),
    }));
}
