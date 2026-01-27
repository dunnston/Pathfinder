/**
 * Classification Service
 * Calculates system classifications from profile data
 */

import type {
  PartialFinancialProfile,
  BasicContext,
  RetirementVision,
  PlanningPreferences,
  RiskComfort,
  FinancialSnapshot,
} from '@/types';
import type {
  PlanningStage,
  StrategyWeights,
  DecisionWindow,
  DecisionUrgency,
  SystemClassifications,
} from '@/types/systemClassifications';

/**
 * Calculate years until retirement based on profile data
 */
export function calculateYearsToRetirement(
  basicContext?: Partial<BasicContext>,
  retirementVision?: Partial<RetirementVision>
): number | null {
  const currentYear = new Date().getFullYear();

  // Try to use target retirement year first
  if (retirementVision?.targetRetirementYear) {
    return retirementVision.targetRetirementYear - currentYear;
  }

  // Otherwise calculate from birth date and target retirement age
  if (basicContext?.birthDate && retirementVision?.targetRetirementAge) {
    const birthYear = new Date(basicContext.birthDate).getFullYear();
    const currentAge = currentYear - birthYear;
    return retirementVision.targetRetirementAge - currentAge;
  }

  // Default estimate based on age if available
  if (basicContext?.birthDate) {
    const birthYear = new Date(basicContext.birthDate).getFullYear();
    const currentAge = currentYear - birthYear;
    // Assume retirement at 65 if no target specified
    return Math.max(0, 65 - currentAge);
  }

  return null;
}

/**
 * Determine the planning stage based on retirement timeline
 */
export function classifyPlanningStage(
  basicContext?: Partial<BasicContext>,
  retirementVision?: Partial<RetirementVision>
): PlanningStage {
  const yearsToRetirement = calculateYearsToRetirement(basicContext, retirementVision);

  // If we can't determine, default to mid_career
  if (yearsToRetirement === null) {
    return 'mid_career';
  }

  // Already retired
  if (yearsToRetirement < 0) {
    return 'post_retirement';
  }

  // Within 1 year
  if (yearsToRetirement <= 1) {
    return 'final_year';
  }

  // 1-3 years (pre-retirement phase for final planning)
  if (yearsToRetirement <= 3) {
    return 'pre_retirement';
  }

  // 3-10 years
  if (yearsToRetirement <= 10) {
    return 'mid_career';
  }

  // 10+ years
  return 'early_career';
}

/**
 * Calculate strategy weights from profile data (0-100 scale)
 */
export function calculateStrategyWeights(
  retirementVision?: Partial<RetirementVision>,
  planningPreferences?: Partial<PlanningPreferences>,
  riskComfort?: Partial<RiskComfort>
): StrategyWeights {
  // Security Focus: Higher if concerned about stability, outliving savings, healthcare
  let securityFocus = 50; // default

  if (riskComfort?.incomeStabilityPreference) {
    const stabilityMap: Record<string, number> = {
      strong_stability: 90,
      prefer_stability: 70,
      balanced: 50,
      prefer_growth: 30,
      strong_growth: 10,
    };
    securityFocus = stabilityMap[riskComfort.incomeStabilityPreference] ?? 50;
  }

  // Adjust based on concerns
  if (retirementVision?.topConcerns) {
    const securityConcerns = ['outliving_savings', 'healthcare_costs', 'spouse_security'];
    const highSecurityConcerns = retirementVision.topConcerns.filter(
      (c) => securityConcerns.includes(c.concern) && c.severity === 'high'
    );
    securityFocus = Math.min(100, securityFocus + highSecurityConcerns.length * 10);
  }

  // Growth Orientation: Inverse of security, adjusted by investment risk tolerance
  let growthOrientation = 100 - securityFocus;

  if (riskComfort?.investmentRiskTolerance) {
    // Scale is 1-5, map to 0-100
    growthOrientation = Math.round(
      (growthOrientation + (riskComfort.investmentRiskTolerance - 1) * 25) / 2
    );
  }

  // Complexity Tolerance: From planning preferences
  let complexityTolerance = 50;

  if (planningPreferences?.complexityTolerance) {
    // Scale is 1-5, map to 0-100
    complexityTolerance = (planningPreferences.complexityTolerance - 1) * 25;
  }

  if (planningPreferences?.financialProductComfort) {
    const comfortMap: Record<string, number> = {
      very_low: 10,
      low: 30,
      moderate: 50,
      high: 70,
      very_high: 90,
    };
    const comfortValue = comfortMap[planningPreferences.financialProductComfort] ?? 50;
    complexityTolerance = Math.round((complexityTolerance + comfortValue) / 2);
  }

  // Flexibility: Based on retirement flexibility and timing flexibility
  let flexibility = 50;

  if (retirementVision?.retirementFlexibility) {
    const flexMap: Record<string, number> = {
      very_flexible: 90,
      somewhat_flexible: 60,
      fixed: 20,
    };
    flexibility = flexMap[retirementVision.retirementFlexibility] ?? 50;
  }

  if (riskComfort?.retirementTimingFlexibility) {
    const timingFlex = riskComfort.retirementTimingFlexibility;
    let timingScore = 50;
    if (timingFlex.willingToDelay) {
      timingScore += 20;
      if (timingFlex.maxDelayYears && timingFlex.maxDelayYears >= 3) {
        timingScore += 10;
      }
    }
    if (timingFlex.willingToRetireEarly) {
      timingScore += 10;
    }
    flexibility = Math.round((flexibility + timingScore) / 2);
  }

  // Advisor Dependence: From planning preferences
  let advisorDependence = 50;

  if (planningPreferences?.advisorInvolvementDesire) {
    const involvementMap: Record<string, number> = {
      diy: 10,
      guidance: 40,
      collaborative: 60,
      delegated: 90,
    };
    advisorDependence = involvementMap[planningPreferences.advisorInvolvementDesire] ?? 50;
  }

  return {
    securityFocus: Math.round(Math.max(0, Math.min(100, securityFocus))),
    growthOrientation: Math.round(Math.max(0, Math.min(100, growthOrientation))),
    complexityTolerance: Math.round(Math.max(0, Math.min(100, complexityTolerance))),
    flexibility: Math.round(Math.max(0, Math.min(100, flexibility))),
    advisorDependence: Math.round(Math.max(0, Math.min(100, advisorDependence))),
  };
}

/**
 * Identify upcoming decision windows based on profile data
 */
export function identifyDecisionWindows(
  basicContext?: Partial<BasicContext>,
  retirementVision?: Partial<RetirementVision>,
  financialSnapshot?: Partial<FinancialSnapshot>
): DecisionWindow[] {
  const windows: DecisionWindow[] = [];
  const yearsToRetirement = calculateYearsToRetirement(basicContext, retirementVision);
  const isFederalEmployee = !!basicContext?.federalEmployee;

  // Helper to determine urgency based on timeframe
  const getUrgency = (years: number): DecisionUrgency => {
    if (years <= 1) return 'immediate';
    if (years <= 3) return 'upcoming';
    return 'future';
  };

  // Retirement timing decision
  if (yearsToRetirement !== null && yearsToRetirement > 0 && yearsToRetirement <= 5) {
    windows.push({
      decision: 'Finalize retirement date',
      timeframe:
        yearsToRetirement <= 1
          ? 'Within 12 months'
          : `Within ${Math.ceil(yearsToRetirement)} years`,
      urgency: getUrgency(yearsToRetirement),
      relatedStrategies: ['Income planning', 'Benefits elections', 'Tax optimization'],
    });
  }

  // Federal employee specific decisions
  if (isFederalEmployee && yearsToRetirement !== null) {
    const fedInfo = basicContext!.federalEmployee!;

    // FERS/TSP withdrawal strategy
    if (yearsToRetirement <= 3) {
      windows.push({
        decision: 'TSP withdrawal strategy',
        timeframe: yearsToRetirement <= 1 ? 'Before retirement' : 'Next 1-3 years',
        urgency: getUrgency(yearsToRetirement),
        relatedStrategies: ['TSP annuity vs installments', 'Roth conversion ladder', 'Tax bracket management'],
      });
    }

    // Survivor benefit election
    if (yearsToRetirement <= 2 && basicContext?.maritalStatus === 'married') {
      windows.push({
        decision: 'FERS survivor benefit election',
        timeframe: 'At retirement',
        urgency: yearsToRetirement <= 1 ? 'immediate' : 'upcoming',
        relatedStrategies: ['Survivor annuity options', 'Life insurance alternatives'],
      });
    }

    // FEGLI decisions
    if (yearsToRetirement <= 3) {
      windows.push({
        decision: 'FEGLI continuation decision',
        timeframe: yearsToRetirement <= 1 ? 'Before retirement' : 'Next 1-3 years',
        urgency: getUrgency(yearsToRetirement),
        relatedStrategies: ['FEGLI cost analysis', 'Private insurance comparison'],
      });
    }

    // Special provisions for law enforcement
    if (fedInfo.isLawEnforcement) {
      const yearsOfService = fedInfo.yearsOfService || 0;
      if (yearsOfService >= 18 && yearsOfService < 20) {
        windows.push({
          decision: 'Special provision retirement eligibility',
          timeframe: `${20 - yearsOfService} years to minimum service`,
          urgency: 20 - yearsOfService <= 1 ? 'immediate' : 'upcoming',
          relatedStrategies: ['Early retirement planning', 'Supplemental income'],
        });
      }
    }
  }

  // Social Security timing
  if (basicContext?.birthDate) {
    const birthYear = new Date(basicContext.birthDate).getFullYear();
    const currentAge = new Date().getFullYear() - birthYear;
    const ssEarlyAge = 62;
    const yearsToSS = ssEarlyAge - currentAge;

    if (yearsToSS <= 5 && yearsToSS > 0) {
      windows.push({
        decision: 'Social Security claiming strategy',
        timeframe: yearsToSS <= 1 ? 'Within 12 months' : `In ${Math.ceil(yearsToSS)} years`,
        urgency: getUrgency(yearsToSS),
        relatedStrategies: ['Claiming age optimization', 'Spousal benefits', 'Tax implications'],
      });
    }
  }

  // Medicare enrollment
  if (basicContext?.birthDate) {
    const birthYear = new Date(basicContext.birthDate).getFullYear();
    const currentAge = new Date().getFullYear() - birthYear;
    const medicareAge = 65;
    const yearsToMedicare = medicareAge - currentAge;

    if (yearsToMedicare <= 3 && yearsToMedicare > 0) {
      windows.push({
        decision: 'Medicare enrollment',
        timeframe:
          yearsToMedicare <= 1 ? 'Within 12 months' : `In ${Math.ceil(yearsToMedicare)} years`,
        urgency: getUrgency(yearsToMedicare),
        relatedStrategies: ['Part A/B enrollment', 'Medigap vs Advantage', 'Part D coverage'],
      });
    }
  }

  // Debt payoff consideration
  if (financialSnapshot?.debts && financialSnapshot.debts.length > 0) {
    const hasMortgage = financialSnapshot.debts.some((d) => d.type === 'mortgage');
    if (hasMortgage && yearsToRetirement !== null && yearsToRetirement <= 5) {
      windows.push({
        decision: 'Mortgage payoff strategy',
        timeframe: 'Before retirement',
        urgency: yearsToRetirement <= 2 ? 'upcoming' : 'future',
        relatedStrategies: ['Accelerated payoff', 'Refinancing', 'Downsizing'],
      });
    }
  }

  // Sort by urgency
  const urgencyOrder: Record<DecisionUrgency, number> = {
    immediate: 1,
    upcoming: 2,
    future: 3,
  };
  windows.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return windows;
}

/**
 * Calculate profile completeness percentage (0-100)
 */
export function calculateProfileCompleteness(
  profile: PartialFinancialProfile
): number {
  const sections = [
    { data: profile.basicContext, weight: 20 },
    { data: profile.retirementVision, weight: 25 },
    { data: profile.planningPreferences, weight: 20 },
    { data: profile.riskComfort, weight: 20 },
    { data: profile.financialSnapshot, weight: 15 },
  ];

  let totalScore = 0;

  for (const section of sections) {
    if (!section.data) continue;

    const completeness = calculateSectionCompleteness(section.data);
    totalScore += completeness * section.weight;
  }

  return Math.round(totalScore);
}

/**
 * Calculate completeness of a single section
 */
function calculateSectionCompleteness(data: Record<string, unknown>): number {
  const entries = Object.entries(data);
  if (entries.length === 0) return 0;

  let filledFields = 0;
  let totalFields = 0;

  for (const [key, value] of entries) {
    // Skip internal fields
    if (key.startsWith('_')) continue;

    totalFields++;

    if (isFieldFilled(value)) {
      filledFields++;
    }
  }

  return totalFields > 0 ? filledFields / totalFields : 0;
}

/**
 * Check if a field value is considered "filled"
 */
function isFieldFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && Object.keys(value as object).length === 0) return false;
  return true;
}

/**
 * Generate complete system classifications from profile data
 */
export function generateSystemClassifications(
  profile: PartialFinancialProfile
): SystemClassifications {
  const planningStage = classifyPlanningStage(
    profile.basicContext,
    profile.retirementVision
  );

  const strategyWeights = calculateStrategyWeights(
    profile.retirementVision,
    profile.planningPreferences,
    profile.riskComfort
  );

  const upcomingDecisionWindows = identifyDecisionWindows(
    profile.basicContext,
    profile.retirementVision,
    profile.financialSnapshot
  );

  const profileCompleteness = calculateProfileCompleteness(profile);

  return {
    planningStage,
    upcomingDecisionWindows,
    strategyWeights,
    profileCompleteness,
    lastUpdated: new Date(),
  };
}

/**
 * Get human-readable label for planning stage
 */
export function getPlanningStageLabel(stage: PlanningStage): string {
  const labels: Record<PlanningStage, string> = {
    early_career: 'Early Career (10+ years to retirement)',
    mid_career: 'Mid-Career (5-10 years to retirement)',
    pre_retirement: 'Pre-Retirement (3-5 years to retirement)',
    final_year: 'Final Year (within 1 year)',
    post_retirement: 'Post-Retirement',
  };
  return labels[stage];
}

/**
 * Get human-readable label for strategy weight
 */
export function getWeightLabel(value: number): string {
  if (value >= 80) return 'Very High';
  if (value >= 60) return 'High';
  if (value >= 40) return 'Moderate';
  if (value >= 20) return 'Low';
  return 'Very Low';
}
