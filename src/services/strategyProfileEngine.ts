/**
 * Strategy Profile Engine
 * Transforms Discovery data into a Planning Posture (Strategy Profile)
 *
 * This is a deterministic, rule-based engine that analyzes:
 * - Values Discovery (top 5, non-negotiables, dominant category, tradeoff indices)
 * - Financial Goals (priorities, time horizons, flexibility)
 * - Financial Purpose (drivers, tradeoff anchors)
 * - Basic Context (age, retirement target)
 */

import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery, ValueCategory } from '@/types/valuesDiscovery';
import type { FinancialGoals, GoalFlexibility } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';
import type {
  StrategyProfile,
  StrategyDimension,
  IncomeStrategyOrientation,
  TimingSensitivity,
  PlanningFlexibility,
  ComplexityTolerance,
  GuidanceLevel,
} from '@/types/strategyProfile';
import { computeDerivedInsights } from './valuesLogic';

/** Input data for strategy profile generation */
export interface StrategyProfileInput {
  basicContext?: BasicContext;
  valuesDiscovery?: ValuesDiscovery;
  financialGoals?: FinancialGoals;
  financialPurpose?: FinancialPurpose;
}

/** Calculate years until retirement */
function getYearsToRetirement(basicContext?: BasicContext): number | undefined {
  if (!basicContext?.age || !basicContext?.targetRetirementAge) {
    return undefined;
  }
  return basicContext.targetRetirementAge - basicContext.age;
}

/** Check if a value category is dominant or present in top values */
function hasValueCategory(
  valuesDiscovery: ValuesDiscovery | undefined,
  category: ValueCategory
): boolean {
  if (!valuesDiscovery) return false;
  const derived = computeDerivedInsights(valuesDiscovery);
  return (
    derived.dominantCategory === category ||
    derived.secondaryCategory === category
  );
}

/** Get count of values in a category from top 5 */
function getTop5CategoryCount(
  valuesDiscovery: ValuesDiscovery | undefined,
  category: ValueCategory
): number {
  if (!valuesDiscovery) return 0;
  const derived = computeDerivedInsights(valuesDiscovery);
  return derived.categoryCounts.top5[category] || 0;
}

/** Count high priority goals */
function countHighPriorityGoals(goals?: FinancialGoals): number {
  if (!goals?.goals) return 0;
  return goals.goals.filter((g) => g.priority === 'HIGH').length;
}

/** Count goals with specific time horizon */
function countGoalsByHorizon(
  goals: FinancialGoals | undefined,
  horizon: 'SHORT' | 'MEDIUM' | 'LONG' | 'ONGOING'
): number {
  if (!goals?.goals) return 0;
  return goals.goals.filter((g) => g.timeHorizon === horizon).length;
}

/** Count goals with specific flexibility */
function countGoalsByFlexibility(
  goals: FinancialGoals | undefined,
  flexibility: GoalFlexibility
): number {
  if (!goals?.goals) return 0;
  return goals.goals.filter((g) => g.flexibility === flexibility).length;
}

/** Get tradeoff anchor value for an axis (-2 to +2 scale, 0 = neutral) */
function getTradeoffAnchorValue(
  purpose: FinancialPurpose | undefined,
  axis: string
): number {
  if (!purpose?.tradeoffAnchors) return 0;
  const anchor = purpose.tradeoffAnchors.find((a) => a.axis === axis);
  if (!anchor) return 0;

  // Convert choice + strength to -2 to +2 scale
  if (anchor.choice === 'A') {
    return anchor.strength === 1 ? -2 : -1;
  } else if (anchor.choice === 'B') {
    return anchor.strength === 5 ? 2 : 1;
  }
  return 0; // NEUTRAL
}

// ============================================================
// DIMENSION CALCULATORS
// ============================================================

/**
 * Calculate Income Strategy Orientation
 * Based on: Security vs Freedom/Growth values, retirement proximity, tradeoff preferences
 */
function calculateIncomeStrategy(
  input: StrategyProfileInput
): StrategyDimension<IncomeStrategyOrientation> {
  const { basicContext, valuesDiscovery, financialPurpose } = input;

  let stabilityScore = 0;
  let growthScore = 0;
  const rationales: string[] = [];

  // Factor 1: Dominant value categories
  if (hasValueCategory(valuesDiscovery, 'SECURITY')) {
    stabilityScore += 3;
    rationales.push('Security is a dominant value');
  }
  if (hasValueCategory(valuesDiscovery, 'FREEDOM')) {
    growthScore += 2;
    rationales.push('Freedom is a priority value');
  }
  if (hasValueCategory(valuesDiscovery, 'GROWTH')) {
    growthScore += 3;
    rationales.push('Growth is a dominant value');
  }

  // Factor 2: Retirement proximity
  const yearsToRetirement = getYearsToRetirement(basicContext);
  if (yearsToRetirement !== undefined) {
    if (yearsToRetirement <= 5) {
      stabilityScore += 3;
      rationales.push('Near retirement (5 years or less)');
    } else if (yearsToRetirement <= 10) {
      stabilityScore += 1;
      rationales.push('Approaching retirement (10 years or less)');
    } else if (yearsToRetirement > 20) {
      growthScore += 2;
      rationales.push('Long time horizon (20+ years)');
    }
  }

  // Factor 3: Tradeoff preferences (security vs growth axis)
  const securityVsGrowth = getTradeoffAnchorValue(financialPurpose, 'SECURITY_VS_GROWTH');
  if (securityVsGrowth <= -1) {
    stabilityScore += 2;
    rationales.push('Prefers certainty over upside');
  } else if (securityVsGrowth >= 1) {
    growthScore += 2;
    rationales.push('Accepts uncertainty for potential upside');
  }

  // Determine orientation
  const netScore = growthScore - stabilityScore;
  let value: IncomeStrategyOrientation;
  if (netScore >= 3) {
    value = 'GROWTH_FOCUSED';
  } else if (netScore <= -3) {
    value = 'STABILITY_FOCUSED';
  } else {
    value = 'BALANCED';
  }

  // Confidence based on strength of signal
  const confidence =
    Math.abs(netScore) >= 4 ? 'HIGH' : Math.abs(netScore) >= 2 ? 'MEDIUM' : 'LOW';

  return {
    value,
    confidence,
    rationale: rationales.length > 0 ? rationales.join('; ') : 'Based on available data',
  };
}

/**
 * Calculate Timing Sensitivity
 * Based on: Near-term goals, rigid retirement timing, fixed commitments
 */
function calculateTimingSensitivity(
  input: StrategyProfileInput
): StrategyDimension<TimingSensitivity> {
  const { basicContext, financialGoals } = input;

  let sensitivityScore = 0;
  const rationales: string[] = [];

  // Factor 1: Near-term high priority goals
  const shortTermGoals = countGoalsByHorizon(financialGoals, 'SHORT');

  if (shortTermGoals >= 2) {
    sensitivityScore += 2;
    rationales.push(`${shortTermGoals} short-term goals`);
  } else if (shortTermGoals === 1) {
    sensitivityScore += 1;
    rationales.push('1 short-term goal');
  }

  // Factor 2: Retirement proximity
  const yearsToRetirement = getYearsToRetirement(basicContext);
  if (yearsToRetirement !== undefined) {
    if (yearsToRetirement <= 5) {
      sensitivityScore += 3;
      rationales.push('Retirement within 5 years');
    } else if (yearsToRetirement <= 10) {
      sensitivityScore += 2;
      rationales.push('Retirement within 10 years');
    }
  }

  // Factor 3: Fixed goals (non-negotiable timing)
  const fixedGoals = countGoalsByFlexibility(financialGoals, 'FIXED');
  if (fixedGoals >= 2) {
    sensitivityScore += 2;
    rationales.push(`${fixedGoals} fixed/non-negotiable goals`);
  } else if (fixedGoals === 1) {
    sensitivityScore += 1;
    rationales.push('1 fixed goal');
  }

  // Factor 4: Flexible goals reduce sensitivity
  const deferrableGoals = countGoalsByFlexibility(financialGoals, 'DEFERRABLE');
  if (deferrableGoals >= 3) {
    sensitivityScore -= 1;
    rationales.push('Multiple deferrable goals');
  }

  // Determine sensitivity level
  let value: TimingSensitivity;
  if (sensitivityScore >= 5) {
    value = 'HIGH';
  } else if (sensitivityScore >= 2) {
    value = 'MEDIUM';
  } else {
    value = 'LOW';
  }

  const confidence =
    rationales.length >= 3 ? 'HIGH' : rationales.length >= 1 ? 'MEDIUM' : 'LOW';

  return {
    value,
    confidence,
    rationale: rationales.length > 0 ? rationales.join('; ') : 'Limited timing data available',
  };
}

/**
 * Calculate Planning Flexibility
 * Based on: Goal flexibility scores, control values, non-negotiables
 */
function calculatePlanningFlexibility(
  input: StrategyProfileInput
): StrategyDimension<PlanningFlexibility> {
  const { valuesDiscovery, financialGoals } = input;

  let flexibilityScore = 0;
  const rationales: string[] = [];

  // Factor 1: Goal flexibility distribution
  const fixedGoals = countGoalsByFlexibility(financialGoals, 'FIXED');
  const flexibleGoals = countGoalsByFlexibility(financialGoals, 'FLEXIBLE');
  const deferrableGoals = countGoalsByFlexibility(financialGoals, 'DEFERRABLE');

  if (deferrableGoals >= 3) {
    flexibilityScore += 2;
    rationales.push('Multiple deferrable goals');
  }
  if (flexibleGoals >= 3) {
    flexibilityScore += 1;
    rationales.push('Several flexible goals');
  }
  if (fixedGoals >= 3) {
    flexibilityScore -= 2;
    rationales.push('Multiple fixed/rigid goals');
  }

  // Factor 2: Control-oriented values (reduce flexibility)
  if (hasValueCategory(valuesDiscovery, 'CONTROL')) {
    flexibilityScore -= 2;
    rationales.push('Control is a priority value');
  }

  // Factor 3: Freedom values (increase flexibility)
  if (hasValueCategory(valuesDiscovery, 'FREEDOM')) {
    flexibilityScore += 2;
    rationales.push('Freedom is a priority value');
  }

  // Factor 4: Non-negotiables count
  const nonNegotiablesCount = valuesDiscovery?.nonNegotiables?.length || 0;
  if (nonNegotiablesCount >= 3) {
    flexibilityScore -= 1;
    rationales.push('3 non-negotiable values');
  }

  // Determine flexibility level
  let value: PlanningFlexibility;
  if (flexibilityScore >= 2) {
    value = 'HIGH';
  } else if (flexibilityScore <= -2) {
    value = 'LOW';
  } else {
    value = 'MODERATE';
  }

  const confidence =
    Math.abs(flexibilityScore) >= 3 ? 'HIGH' : Math.abs(flexibilityScore) >= 1 ? 'MEDIUM' : 'LOW';

  return {
    value,
    confidence,
    rationale: rationales.length > 0 ? rationales.join('; ') : 'Based on available data',
  };
}

/**
 * Calculate Complexity Tolerance
 * Based on: Control values, financial confidence, education preferences
 */
function calculateComplexityTolerance(
  input: StrategyProfileInput
): StrategyDimension<ComplexityTolerance> {
  const { basicContext, valuesDiscovery } = input;

  let complexityScore = 0;
  const rationales: string[] = [];

  // Factor 1: Control values (more control = can handle complexity)
  if (hasValueCategory(valuesDiscovery, 'CONTROL')) {
    complexityScore += 2;
    rationales.push('Values having control over finances');
  }

  // Factor 2: Education level / sophistication proxy
  // (Using retirement system as a proxy - federal employees often have more complex benefits)
  if (basicContext?.federalEmployee?.retirementSystem) {
    complexityScore += 1;
    rationales.push('Familiar with complex benefit systems');
  }

  // Factor 3: Security values (prefer simpler, more predictable)
  if (hasValueCategory(valuesDiscovery, 'SECURITY')) {
    complexityScore -= 1;
    rationales.push('Security-focused (simpler may be preferred)');
  }

  // Factor 4: Growth values (often comfortable with more strategies)
  const growthCount = getTop5CategoryCount(valuesDiscovery, 'GROWTH');
  if (growthCount >= 2) {
    complexityScore += 1;
    rationales.push('Growth-oriented mindset');
  }

  // Determine complexity tolerance
  let value: ComplexityTolerance;
  if (complexityScore >= 2) {
    value = 'ADVANCED';
  } else if (complexityScore <= -1) {
    value = 'SIMPLE';
  } else {
    value = 'MODERATE';
  }

  const confidence =
    Math.abs(complexityScore) >= 3 ? 'HIGH' : rationales.length >= 2 ? 'MEDIUM' : 'LOW';

  return {
    value,
    confidence,
    rationale: rationales.length > 0 ? rationales.join('; ') : 'Default moderate complexity',
  };
}

/**
 * Calculate Guidance Level Needed
 * Based on: Control values, confidence indicators, decision style
 */
function calculateGuidanceLevel(
  input: StrategyProfileInput
): StrategyDimension<GuidanceLevel> {
  const { valuesDiscovery, financialGoals, financialPurpose } = input;

  let guidanceScore = 0; // Higher = more guidance needed
  const rationales: string[] = [];

  // Factor 1: Control values (less guidance needed)
  if (hasValueCategory(valuesDiscovery, 'CONTROL')) {
    guidanceScore -= 2;
    rationales.push('Values control and self-direction');
  }

  // Factor 2: Many non-negotiables (knows what they want = less guidance)
  const nonNegotiablesCount = valuesDiscovery?.nonNegotiables?.length || 0;
  if (nonNegotiablesCount >= 2) {
    guidanceScore -= 1;
    rationales.push('Clear non-negotiable priorities');
  }

  // Factor 3: Many high-priority goals (clear direction = less guidance)
  const highPriorityGoals = countHighPriorityGoals(financialGoals);
  if (highPriorityGoals >= 3) {
    guidanceScore -= 1;
    rationales.push('Clear goal priorities');
  }

  // Factor 4: Security values (may want more reassurance)
  if (hasValueCategory(valuesDiscovery, 'SECURITY')) {
    guidanceScore += 1;
    rationales.push('Security-focused (may value reassurance)');
  }

  // Factor 5: Incomplete purpose statement (still clarifying)
  if (!financialPurpose?.finalStatement) {
    guidanceScore += 1;
    rationales.push('Still clarifying financial purpose');
  }

  // Factor 6: Many neutral tradeoff choices (uncertain preferences)
  const neutralAnchors =
    financialPurpose?.tradeoffAnchors?.filter((a) => a.choice === 'NEUTRAL').length || 0;
  if (neutralAnchors >= 2) {
    guidanceScore += 1;
    rationales.push('Several uncertain tradeoff preferences');
  }

  // Determine guidance level
  let value: GuidanceLevel;
  if (guidanceScore >= 2) {
    value = 'HIGH';
  } else if (guidanceScore <= -2) {
    value = 'LOW';
  } else {
    value = 'MODERATE';
  }

  const confidence = rationales.length >= 3 ? 'HIGH' : rationales.length >= 1 ? 'MEDIUM' : 'LOW';

  return {
    value,
    confidence,
    rationale: rationales.length > 0 ? rationales.join('; ') : 'Default moderate guidance',
  };
}

// ============================================================
// SUMMARY GENERATOR
// ============================================================

/**
 * Generate human-readable summary paragraph
 */
function generateSummary(
  incomeStrategy: StrategyDimension<IncomeStrategyOrientation>,
  timingSensitivity: StrategyDimension<TimingSensitivity>,
  planningFlexibility: StrategyDimension<PlanningFlexibility>,
  complexityTolerance: StrategyDimension<ComplexityTolerance>,
  guidanceLevel: StrategyDimension<GuidanceLevel>
): string {
  const parts: string[] = [];

  // Income strategy
  switch (incomeStrategy.value) {
    case 'STABILITY_FOCUSED':
      parts.push('Planning should prioritize income stability over growth');
      break;
    case 'GROWTH_FOCUSED':
      parts.push('Planning can emphasize growth and optionality');
      break;
    case 'BALANCED':
      parts.push('Planning should balance income stability with growth opportunities');
      break;
  }

  // Timing sensitivity
  switch (timingSensitivity.value) {
    case 'HIGH':
      parts.push('with high sensitivity to timing and market conditions');
      break;
    case 'MEDIUM':
      parts.push('with moderate sensitivity to timing');
      break;
    case 'LOW':
      parts.push('with flexibility around timing');
      break;
  }

  // Planning flexibility
  switch (planningFlexibility.value) {
    case 'HIGH':
      parts.push('The plan can be highly adaptable to changing conditions.');
      break;
    case 'MODERATE':
      parts.push('The plan should maintain some structure while allowing adjustments.');
      break;
    case 'LOW':
      parts.push('and limited flexibility for major changes.');
      break;
  }

  // Complexity tolerance
  switch (complexityTolerance.value) {
    case 'SIMPLE':
      parts.push('Simple, predictable strategies are preferred.');
      break;
    case 'MODERATE':
      parts.push('Moderate complexity in strategies is acceptable.');
      break;
    case 'ADVANCED':
      parts.push('Advanced strategies can be considered.');
      break;
  }

  // Guidance level
  switch (guidanceLevel.value) {
    case 'HIGH':
      parts.push('Clear structure and ongoing guidance will be beneficial.');
      break;
    case 'MODERATE':
      parts.push('Some guidance on key decisions will be helpful.');
      break;
    case 'LOW':
      parts.push('Self-directed decision-making is comfortable.');
      break;
  }

  return parts.join(', ').replace(/, The/g, '. The').replace(/, Simple/g, '. Simple');
}

// ============================================================
// MAIN ENGINE FUNCTION
// ============================================================

/**
 * Generate a complete Strategy Profile from Discovery data
 */
export function generateStrategyProfile(input: StrategyProfileInput): StrategyProfile {
  const incomeStrategy = calculateIncomeStrategy(input);
  const timingSensitivity = calculateTimingSensitivity(input);
  const planningFlexibility = calculatePlanningFlexibility(input);
  const complexityTolerance = calculateComplexityTolerance(input);
  const guidanceLevel = calculateGuidanceLevel(input);

  const summary = generateSummary(
    incomeStrategy,
    timingSensitivity,
    planningFlexibility,
    complexityTolerance,
    guidanceLevel
  );

  return {
    incomeStrategy,
    timingSensitivity,
    planningFlexibility,
    complexityTolerance,
    guidanceLevel,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Check if there's enough data to generate a meaningful profile
 */
export function hasEnoughDataForProfile(input: StrategyProfileInput): boolean {
  const { basicContext, valuesDiscovery, financialGoals } = input;

  // Need at least one of: values with top 5, or goals with priorities
  const hasValues = valuesDiscovery?.top5 && valuesDiscovery.top5.length >= 3;
  const hasGoals = financialGoals?.goals && financialGoals.goals.some((g) => g.priority);
  const hasBasicContext = basicContext?.age !== undefined;

  return (hasValues || hasGoals) && hasBasicContext;
}
