/**
 * Display Helpers Service
 * Formats profile data for human-readable display
 */

import type { Flexibility, ConcernType, ConcernSeverity } from '@/types/retirementVision';
import type { ToleranceLevel, ComfortLevel, InvolvementLevel, DecisionStyle, ValueType } from '@/types/planningPreferences';
import type { StabilityPreference, DownturnResponse, ImportanceLevel, WillingnessLevel } from '@/types/riskComfort';
import type { MaritalStatus } from '@/types/basicContext';

/** Marital status display labels */
export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  single: 'Single',
  married: 'Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  domestic_partnership: 'Domestic Partnership',
};

/** Flexibility display labels */
export const FLEXIBILITY_LABELS: Record<Flexibility, string> = {
  very_flexible: 'Very Flexible (3+ years)',
  somewhat_flexible: 'Somewhat Flexible (1-2 years)',
  fixed: 'Fixed Date Required',
};

/** Concern type display labels */
export const CONCERN_LABELS: Record<ConcernType, string> = {
  outliving_savings: 'Running out of money',
  healthcare_costs: 'Healthcare costs',
  spouse_security: 'Spouse/partner security',
  market_volatility: 'Market volatility',
  inflation: 'Inflation',
  healthcare_coverage: 'Healthcare coverage',
  boredom_identity: 'Boredom/loss of identity',
  family_obligations: 'Family obligations',
  unexpected_expenses: 'Unexpected expenses',
  other: 'Other',
};

/** Severity display labels */
export const SEVERITY_LABELS: Record<ConcernSeverity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/** Tolerance level display labels */
export const TOLERANCE_LABELS: Record<ToleranceLevel, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
};

/** Comfort level display labels */
export const COMFORT_LABELS: Record<ComfortLevel, string> = {
  very_low: 'Very Low',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  very_high: 'Very High',
};

/** Involvement level display labels */
export const INVOLVEMENT_LABELS: Record<InvolvementLevel, string> = {
  diy: 'Self-Directed (DIY)',
  guidance: 'Guidance on Major Decisions',
  collaborative: 'Collaborative Partnership',
  delegated: 'Advisor-Managed',
};

/** Decision style display labels */
export const DECISION_STYLE_LABELS: Record<DecisionStyle, string> = {
  analytical: 'Analytical (wants all the data)',
  intuitive: 'Intuitive (goes with gut feeling)',
  consultative: 'Consultative (seeks others\' opinions)',
  deliberate: 'Deliberate (takes time to decide)',
};

/** Value type display labels */
export const VALUE_LABELS: Record<ValueType, string> = {
  family_security: 'Family Security',
  health_peace_of_mind: 'Health & Peace of Mind',
  freedom_of_time: 'Freedom of Time',
  enjoyment_experiences: 'Enjoyment & Experiences',
  legacy_giving: 'Legacy & Giving',
  financial_independence: 'Financial Independence',
  helping_others: 'Helping Others',
  personal_growth: 'Personal Growth',
};

/** Stability preference display labels */
export const STABILITY_LABELS: Record<StabilityPreference, string> = {
  strong_stability: 'Strong preference for stability',
  prefer_stability: 'Prefer stability',
  balanced: 'Balanced approach',
  prefer_growth: 'Prefer growth potential',
  strong_growth: 'Strong growth orientation',
};

/** Downturn response display labels */
export const DOWNTURN_LABELS: Record<DownturnResponse, string> = {
  reduce_spending: 'Reduce spending',
  delay_retirement: 'Delay retirement',
  work_part_time: 'Work part-time',
  stay_the_course: 'Stay the course',
  unsure: 'Unsure',
};

/** Importance level display labels */
export const IMPORTANCE_LABELS: Record<ImportanceLevel, string> = {
  critical: 'Critical',
  very_important: 'Very Important',
  somewhat_important: 'Somewhat Important',
  not_important: 'Not Important',
};

/** Willingness level display labels */
export const WILLINGNESS_LABELS: Record<WillingnessLevel, string> = {
  very_willing: 'Very Willing',
  somewhat_willing: 'Somewhat Willing',
  reluctant: 'Reluctant',
  unwilling: 'Unwilling',
};

/**
 * Format a date for display
 */
export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string | undefined | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format a balance range for display
 */
export function formatBalanceRange(range: string | undefined | null): string {
  if (!range) return '';
  const rangeLabels: Record<string, string> = {
    under_10k: 'Under $10,000',
    '10k_50k': '$10,000 - $50,000',
    '50k_100k': '$50,000 - $100,000',
    '100k_250k': '$100,000 - $250,000',
    '250k_500k': '$250,000 - $500,000',
    '500k_1m': '$500,000 - $1 million',
    '1m_2m': '$1 million - $2 million',
    over_2m: 'Over $2 million',
  };
  return rangeLabels[range] || range;
}

/**
 * Format an account type for display
 */
export function formatAccountType(type: string | undefined | null): string {
  if (!type) return '';
  const typeLabels: Record<string, string> = {
    tsp_traditional: 'TSP (Traditional)',
    tsp_roth: 'TSP (Roth)',
    traditional_ira: 'Traditional IRA',
    roth_ira: 'Roth IRA',
    '401k': '401(k)',
    '403b': '403(b)',
    taxable_brokerage: 'Taxable Brokerage',
    savings: 'Savings Account',
    other: 'Other',
  };
  return typeLabels[type] || type;
}

/**
 * Format income source type for display
 */
export function formatIncomeType(type: string | undefined | null): string {
  if (!type) return '';
  const typeLabels: Record<string, string> = {
    salary: 'Salary/Wages',
    self_employment: 'Self-Employment Income',
    rental: 'Rental Income',
    pension: 'Pension',
    social_security: 'Social Security',
    fers_pension: 'FERS Pension',
    csrs_pension: 'CSRS Pension',
    tsp_withdrawals: 'TSP Withdrawals',
    other_pension: 'Other Pension',
    part_time_work: 'Part-Time Work',
    other: 'Other',
  };
  return typeLabels[type] || type;
}

/**
 * Format debt type for display
 */
export function formatDebtType(type: string | undefined | null): string {
  if (!type) return '';
  const typeLabels: Record<string, string> = {
    mortgage: 'Mortgage',
    car: 'Auto Loan',
    student_loan: 'Student Loan',
    credit_card: 'Credit Card',
    personal_loan: 'Personal Loan',
    other: 'Other',
  };
  return typeLabels[type] || type;
}

/**
 * Format asset type for display
 */
export function formatAssetType(type: string | undefined | null): string {
  if (!type) return '';
  const typeLabels: Record<string, string> = {
    primary_home: 'Primary Home',
    rental_property: 'Rental Property',
    business: 'Business',
    vehicle: 'Vehicle',
    other: 'Other',
  };
  return typeLabels[type] || type;
}
