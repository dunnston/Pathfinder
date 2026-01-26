/**
 * Section 2: Retirement Vision types
 * Captures retirement goals, concerns, and priorities
 */

/** Retirement date flexibility */
export type Flexibility =
  | 'very_flexible' // Could adjust 3+ years
  | 'somewhat_flexible' // Could adjust 1-2 years
  | 'fixed'; // Specific date required

/** Types of retirement concerns */
export type ConcernType =
  | 'outliving_savings'
  | 'healthcare_costs'
  | 'spouse_security'
  | 'market_volatility'
  | 'inflation'
  | 'healthcare_coverage'
  | 'boredom_identity'
  | 'family_obligations'
  | 'unexpected_expenses'
  | 'other';

/** Severity level for concerns */
export type ConcernSeverity = 'high' | 'medium' | 'low';

/** A specific retirement concern with severity */
export interface RetirementConcern {
  concern: ConcernType;
  severity: ConcernSeverity;
  notes?: string;
}

/** A lifestyle priority with its ranking */
export interface LifestylePriority {
  priority: string;
  rank: number;
}

/** Complete retirement vision section */
export interface RetirementVision {
  targetRetirementAge: number | null;
  targetRetirementYear: number | null;
  retirementFlexibility: Flexibility;
  visionDescription: string;
  topConcerns: RetirementConcern[];
  mustHaveOutcomes: string[];
  niceToHaveOutcomes: string[];
  lifestylePriorities: LifestylePriority[];
  financialPurposeStatement?: string;
}
