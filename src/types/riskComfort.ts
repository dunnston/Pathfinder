/**
 * Section 4: Risk & Income Comfort types
 * Captures risk tolerance and income preferences
 */

import type { ToleranceLevel } from './planningPreferences';

/** Income stability preference */
export type StabilityPreference =
  | 'strong_stability' // Must have predictable income
  | 'prefer_stability' // Prefer stable but some flex ok
  | 'balanced' // Mix of stable and variable
  | 'prefer_growth' // Willing to accept variability
  | 'strong_growth'; // Maximize upside, handle volatility

/** Response to market downturns */
export type DownturnResponse =
  | 'reduce_spending'
  | 'delay_retirement'
  | 'work_part_time'
  | 'stay_the_course'
  | 'unsure';

/** Importance level for financial concerns */
export type ImportanceLevel =
  | 'critical'
  | 'very_important'
  | 'somewhat_important'
  | 'not_important';

/** Willingness to make adjustments */
export type WillingnessLevel =
  | 'very_willing'
  | 'somewhat_willing'
  | 'reluctant'
  | 'unwilling';

/** Timing flexibility for retirement */
export interface TimingFlexibility {
  willingToDelay: boolean;
  maxDelayYears: number;
  willingToRetireEarly: boolean;
  conditions?: string;
}

/** Complete risk comfort section */
export interface RiskComfort {
  investmentRiskTolerance: ToleranceLevel;
  incomeStabilityPreference: StabilityPreference;
  marketDownturnResponse: DownturnResponse;
  guaranteedIncomeImportance: ImportanceLevel;
  flexibilityVsSecurityPreference: number; // -5 to +5 scale
  spendingAdjustmentWillingness: WillingnessLevel;
  retirementTimingFlexibility: TimingFlexibility;
}
