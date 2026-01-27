/**
 * Strategy Profile Types
 * Transforms Discovery data into planning posture and recommendations
 */

// ============================================================
// PART 1: STRATEGY PROFILE (PLANNING POSTURE)
// ============================================================

/** Income strategy orientation - how to balance growth vs stability */
export type IncomeStrategyOrientation =
  | 'STABILITY_FOCUSED' // Emphasize guarantees and predictable income
  | 'BALANCED' // Balance growth and safety
  | 'GROWTH_FOCUSED'; // Emphasize growth and optionality

/** How sensitive the plan is to timing disruptions */
export type TimingSensitivity =
  | 'HIGH' // Timing matters a lot (near-term goals, rigid timeline)
  | 'MEDIUM' // Moderate sensitivity
  | 'LOW'; // Goals flexible, long horizons

/** How adaptable the plan can be when conditions change */
export type PlanningFlexibility =
  | 'HIGH' // Goals and methods can change
  | 'MODERATE' // Some adaptability
  | 'LOW'; // Structure and certainty preferred

/** How much planning complexity the client can handle */
export type ComplexityTolerance =
  | 'SIMPLE' // Simple and predictable preferred
  | 'MODERATE' // Moderate complexity acceptable
  | 'ADVANCED'; // Comfortable with advanced strategies

/** How much guidance the client needs */
export type GuidanceLevel =
  | 'HIGH' // Needs structure, accountability, reassurance
  | 'MODERATE' // Some guidance helpful
  | 'LOW'; // Self-directed, comfortable making decisions

/** Strategy dimension with value and explanation */
export interface StrategyDimension<T> {
  value: T;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string; // Brief explanation of why this was determined
}

/** Complete Strategy Profile */
export interface StrategyProfile {
  /** Income strategy orientation */
  incomeStrategy: StrategyDimension<IncomeStrategyOrientation>;

  /** Timing sensitivity */
  timingSensitivity: StrategyDimension<TimingSensitivity>;

  /** Planning flexibility */
  planningFlexibility: StrategyDimension<PlanningFlexibility>;

  /** Complexity tolerance */
  complexityTolerance: StrategyDimension<ComplexityTolerance>;

  /** Decision support needs */
  guidanceLevel: StrategyDimension<GuidanceLevel>;

  /** Human-readable summary paragraph */
  summary: string;

  /** When this profile was generated */
  generatedAt: string;
}

// ============================================================
// PART 2: PLANNING FOCUS AREAS
// ============================================================

/** Core planning domains */
export type PlanningDomain =
  | 'RETIREMENT_INCOME'
  | 'INVESTMENT_STRATEGY'
  | 'TAX_OPTIMIZATION'
  | 'INSURANCE_RISK'
  | 'ESTATE_LEGACY'
  | 'CASH_FLOW_DEBT'
  | 'BENEFITS_OPTIMIZATION'
  | 'BUSINESS_CAREER'
  | 'HEALTHCARE_LTC';

/** Planning domain metadata */
export interface PlanningDomainInfo {
  id: PlanningDomain;
  name: string;
  description: string;
  /** Value categories that increase importance of this domain */
  relatedValueCategories: string[];
  /** Goal types that increase importance */
  relatedGoalTypes: string[];
}

/** Prioritized focus area */
export interface PlanningFocusArea {
  domain: PlanningDomain;
  priority: number; // 1 = highest
  importance: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  rationale: string; // Why this domain is prioritized
  valueConnections: string[]; // Which values support this
  goalConnections: string[]; // Which goals support this
  riskFactors?: string[]; // Risk exposure if ignored
}

/** Complete focus area ranking */
export interface PlanningFocusRanking {
  areas: PlanningFocusArea[];
  /** Top 3 critical areas */
  topPriorities: PlanningDomain[];
  generatedAt: string;
}

// ============================================================
// PART 3: ACTION RECOMMENDATIONS
// ============================================================

/** Action type categories */
export type ActionType =
  | 'EDUCATION' // Understand options and implications
  | 'DECISION_PREP' // Prepare for upcoming decision
  | 'STRUCTURAL' // Establish financial foundation
  | 'PROFESSIONAL_REVIEW' // Engage specialist
  | 'OPTIMIZATION'; // Fine-tune existing setup

/** Who should guide this action */
export type ActionGuidance =
  | 'SELF_GUIDED' // Client can do independently
  | 'ADVISOR_GUIDED' // Financial advisor should help
  | 'SPECIALIST_GUIDED'; // Tax, legal, or other specialist

/** Priority urgency */
export type ActionUrgency =
  | 'IMMEDIATE' // Do now
  | 'NEAR_TERM' // Within 3-6 months
  | 'MEDIUM_TERM' // Within 1 year
  | 'ONGOING'; // Continuous/periodic

/** Single action recommendation */
export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  /** Why this matters - ties to values and goals */
  rationale: string;
  /** What this helps decide or improve */
  outcome: string;
  type: ActionType;
  guidance: ActionGuidance;
  urgency: ActionUrgency;
  /** Related planning domain */
  domain: PlanningDomain;
  /** Connected values */
  valueConnections: string[];
  /** Connected goals */
  goalConnections: string[];
  /** Prerequisites - other action IDs that should come first */
  dependencies?: string[];
}

/** Complete action recommendation set */
export interface ActionRecommendations {
  recommendations: ActionRecommendation[];
  /** Top 3-5 immediate priorities */
  topActions: string[]; // Action IDs
  generatedAt: string;
}

// ============================================================
// COMBINED OUTPUT
// ============================================================

/** Complete discovery insights output */
export interface DiscoveryInsights {
  strategyProfile: StrategyProfile;
  focusAreas: PlanningFocusRanking;
  actions: ActionRecommendations;
  /** Input data summary used to generate insights */
  inputSummary: {
    hasValues: boolean;
    hasGoals: boolean;
    hasPurpose: boolean;
    hasBasicContext: boolean;
    completionPercentage: number;
  };
  generatedAt: string;
}

// ============================================================
// DISPLAY LABELS
// ============================================================

export const INCOME_STRATEGY_LABELS: Record<IncomeStrategyOrientation, string> = {
  STABILITY_FOCUSED: 'Stability Focused',
  BALANCED: 'Balanced',
  GROWTH_FOCUSED: 'Growth Focused',
};

export const TIMING_SENSITIVITY_LABELS: Record<TimingSensitivity, string> = {
  HIGH: 'High Sensitivity',
  MEDIUM: 'Medium Sensitivity',
  LOW: 'Low Sensitivity',
};

export const PLANNING_FLEXIBILITY_LABELS: Record<PlanningFlexibility, string> = {
  HIGH: 'Highly Flexible',
  MODERATE: 'Moderately Flexible',
  LOW: 'Low Flexibility',
};

export const COMPLEXITY_TOLERANCE_LABELS: Record<ComplexityTolerance, string> = {
  SIMPLE: 'Simple Preferred',
  MODERATE: 'Moderate Complexity',
  ADVANCED: 'Advanced Strategies',
};

export const GUIDANCE_LEVEL_LABELS: Record<GuidanceLevel, string> = {
  HIGH: 'High Guidance Needed',
  MODERATE: 'Moderate Guidance',
  LOW: 'Self-Directed',
};

export const PLANNING_DOMAIN_LABELS: Record<PlanningDomain, string> = {
  RETIREMENT_INCOME: 'Retirement Income Strategy',
  INVESTMENT_STRATEGY: 'Investment Strategy',
  TAX_OPTIMIZATION: 'Tax Optimization',
  INSURANCE_RISK: 'Insurance & Risk Management',
  ESTATE_LEGACY: 'Estate & Legacy Planning',
  CASH_FLOW_DEBT: 'Cash Flow & Debt Management',
  BENEFITS_OPTIMIZATION: 'Benefits Optimization',
  BUSINESS_CAREER: 'Business & Career Strategy',
  HEALTHCARE_LTC: 'Healthcare & Long-Term Care',
};

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  EDUCATION: 'Learn & Understand',
  DECISION_PREP: 'Prepare Decision',
  STRUCTURAL: 'Build Foundation',
  PROFESSIONAL_REVIEW: 'Professional Review',
  OPTIMIZATION: 'Optimize',
};

export const ACTION_GUIDANCE_LABELS: Record<ActionGuidance, string> = {
  SELF_GUIDED: 'Self-Guided',
  ADVISOR_GUIDED: 'Advisor-Guided',
  SPECIALIST_GUIDED: 'Specialist-Guided',
};

export const ACTION_URGENCY_LABELS: Record<ActionUrgency, string> = {
  IMMEDIATE: 'Do Now',
  NEAR_TERM: 'Within 3-6 Months',
  MEDIUM_TERM: 'Within 1 Year',
  ONGOING: 'Ongoing',
};
