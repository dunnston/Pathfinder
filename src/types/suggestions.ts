/**
 * Suggestions Engine Types
 * Types for the guided suggestions workflow, domain exploration, and plan building
 */

// ============================================================
// SUGGESTION DOMAINS
// ============================================================

/** The 8 planning domains for the suggestions engine */
export type SuggestionDomain =
  | 'INVESTMENTS'
  | 'SAVINGS'
  | 'ANNUITIES'
  | 'INCOME_PLAN'
  | 'TAXES'
  | 'ESTATE_PLAN'
  | 'INSURANCE'
  | 'EMPLOYEE_BENEFITS';

/** Condition types for domain/question applicability */
export type ConditionType =
  | 'federal_employee'
  | 'has_spouse'
  | 'has_dependents'
  | 'near_retirement'
  | 'age_over'
  | 'age_under'
  | 'has_pension'
  | 'has_tsp'
  | 'has_ira'
  | 'has_401k'
  | 'answer_equals'
  | 'always';

/** Condition for domain relevance or question applicability */
export interface ApplicabilityCondition {
  /** Type of condition to check */
  type: ConditionType;
  /** For answer_equals: which question ID to check */
  questionId?: string;
  /** Value to compare against (for answer_equals, age_over, age_under) */
  value?: string | number | boolean;
  /** Invert the condition result */
  negate?: boolean;
}

/** Domain metadata */
export interface DomainInfo {
  /** Unique identifier */
  id: SuggestionDomain;
  /** Display name */
  name: string;
  /** Brief description */
  description: string;
  /** Icon name for UI (lucide icon) */
  icon: string;
  /** Conditions that determine relevance (all must be met, or domain is dimmed) */
  relevanceConditions: ApplicabilityCondition[];
  /** Order in the domain list */
  order: number;
}

// ============================================================
// GUIDED QUESTIONS
// ============================================================

/** Input types for capturing answers */
export type QuestionInputType =
  | 'yes_no'
  | 'yes_no_na'
  | 'scale'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select';

/** Option for select/multi_select inputs */
export interface QuestionOption {
  /** Value stored when selected */
  value: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
}

/** Configuration for scale inputs */
export interface ScaleConfig {
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Label for minimum end */
  minLabel: string;
  /** Label for maximum end */
  maxLabel: string;
  /** Step size (default 1) */
  step?: number;
}

/** A guided question within a domain */
export interface GuidedQuestion {
  /** Unique identifier */
  id: string;
  /** Domain this question belongs to */
  domain: SuggestionDomain;
  /** The advisor-facing question (internal thinking prompt) */
  advisorQuestion: string;
  /** User-facing version (what they see in the UI) */
  userQuestion: string;
  /** Detailed explanation of what this question explores */
  explanation: string;
  /** What external analysis/tool the user should use */
  analysisHint: string;
  /** Input type for capturing the answer */
  inputType: QuestionInputType;
  /** Options for select/multi_select types */
  options?: QuestionOption[];
  /** Scale configuration for scale type */
  scaleConfig?: ScaleConfig;
  /** Conditions that make this question applicable */
  applicabilityConditions: ApplicabilityCondition[];
  /** Questions that depend on this one (follow-ups shown if answered certain way) */
  followUpQuestionIds?: string[];
  /** Order within the domain */
  order: number;
}

// ============================================================
// ANSWERS
// ============================================================

/** User's answer to a guided question */
export interface QuestionAnswer {
  /** Reference to the question ID */
  questionId: string;
  /** Domain of the question */
  domain: SuggestionDomain;
  /** The answer value */
  value: string | number | boolean | string[];
  /** Optional notes about the analysis */
  notes?: string;
  /** Source of analysis (e.g., "Morningstar", "CPA", "Own calculation") */
  analysisSource?: string;
  /** When the answer was recorded */
  answeredAt: string;
}

// ============================================================
// SUGGESTIONS
// ============================================================

/** Priority levels for suggestions */
export type SuggestionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

/** Types of actions suggested */
export type SuggestionActionType =
  | 'IMPLEMENT'
  | 'INVESTIGATE'
  | 'MONITOR'
  | 'CONSULT_PROFESSIONAL';

/** Status of a suggestion */
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected' | 'modified';

/** A suggestion generated from answers */
export interface Suggestion {
  /** Unique identifier */
  id: string;
  /** Domain this suggestion belongs to */
  domain: SuggestionDomain;
  /** Title of the suggestion */
  title: string;
  /** Detailed description */
  description: string;
  /** Why this suggestion was generated */
  rationale: string;
  /** Priority level */
  priority: SuggestionPriority;
  /** Type of action */
  actionType: SuggestionActionType;
  /** Which answers contributed to this suggestion */
  sourceAnswerIds: string[];
  /** Current status */
  status: SuggestionStatus;
  /** If modified, the user's custom text */
  modifiedTitle?: string;
  /** If modified, the user's custom description */
  modifiedDescription?: string;
  /** User notes */
  userNotes?: string;
  /** When the suggestion was generated */
  generatedAt: string;
  /** When status was last changed */
  statusChangedAt?: string;
}

// ============================================================
// CUSTOM RECOMMENDATIONS
// ============================================================

/** Who created the custom recommendation */
export type RecommendationCreator = 'user' | 'advisor';

/** A custom recommendation added by user/advisor */
export interface CustomRecommendation {
  /** Unique identifier */
  id: string;
  /** Domain this applies to */
  domain: SuggestionDomain;
  /** Title */
  title: string;
  /** Detailed description */
  description: string;
  /** Priority level */
  priority: SuggestionPriority;
  /** Who created this */
  createdBy: RecommendationCreator;
  /** Advisor name if created by advisor */
  advisorName?: string;
  /** When created */
  createdAt: string;
  /** When last updated */
  updatedAt?: string;
}

// ============================================================
// PLAN ITEMS
// ============================================================

/** Type of plan item source */
export type PlanItemType = 'suggestion' | 'custom';

/** Status of a plan item */
export type PlanItemStatus = 'planned' | 'in_progress' | 'completed' | 'deferred';

/** A final plan item (accepted suggestion or custom recommendation) */
export interface PlanItem {
  /** Unique identifier */
  id: string;
  /** Type of source */
  type: PlanItemType;
  /** Reference to source (Suggestion.id or CustomRecommendation.id) */
  sourceId: string;
  /** Domain */
  domain: SuggestionDomain;
  /** Title (may be modified from source) */
  title: string;
  /** Description (may be modified from source) */
  description: string;
  /** Priority */
  priority: SuggestionPriority;
  /** Current status */
  status: PlanItemStatus;
  /** Implementation notes */
  notes?: string;
  /** Target completion date */
  targetDate?: string;
  /** When added to plan */
  addedAt: string;
  /** When started */
  startedAt?: string;
  /** When completed */
  completedAt?: string;
  /** When deferred */
  deferredAt?: string;
  /** Order in the plan (for user sorting) */
  order: number;
}

// ============================================================
// DOMAIN EXPLORATION STATE
// ============================================================

/** Status of domain exploration */
export type DomainExplorationStatus = 'not_started' | 'in_progress' | 'completed';

/** Exploration state for a single domain */
export interface DomainExplorationState {
  /** Domain being explored */
  domain: SuggestionDomain;
  /** Current status */
  status: DomainExplorationStatus;
  /** When exploration started */
  startedAt?: string;
  /** When exploration completed */
  completedAt?: string;
  /** Current question index (for resuming) */
  currentQuestionIndex: number;
  /** Answers provided */
  answers: QuestionAnswer[];
  /** Suggestions generated for this domain */
  suggestions: Suggestion[];
}

// ============================================================
// SUGGESTIONS STATE
// ============================================================

/** Complete suggestions engine state */
export interface SuggestionsState {
  /** Exploration state per domain */
  domainStates: Record<SuggestionDomain, DomainExplorationState>;
  /** Custom recommendations */
  customRecommendations: CustomRecommendation[];
  /** Final plan items */
  planItems: PlanItem[];
  /** When last updated */
  updatedAt: string;
}

// ============================================================
// SUGGESTION TEMPLATES (for generation)
// ============================================================

/** Trigger condition for suggestion generation */
export interface SuggestionTrigger {
  /** Question ID to check */
  questionId: string;
  /** Comparison operator */
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  /** Value to compare against */
  value: string | number | boolean;
}

/** Template for generating suggestions */
export interface SuggestionTemplate {
  /** Unique identifier */
  id: string;
  /** Domain this template belongs to */
  domain: SuggestionDomain;
  /** Title (can include {placeholder} syntax) */
  titleTemplate: string;
  /** Description template */
  descriptionTemplate: string;
  /** Rationale template */
  rationaleTemplate: string;
  /** Priority */
  priority: SuggestionPriority;
  /** Action type */
  actionType: SuggestionActionType;
  /** Conditions that trigger this suggestion (all must be met) */
  triggerConditions: SuggestionTrigger[];
  /** Conditions based on profile (optional, for enhanced relevance) */
  profileConditions?: ApplicabilityCondition[];
}

// ============================================================
// DISPLAY LABELS
// ============================================================

export const SUGGESTION_DOMAIN_LABELS: Record<SuggestionDomain, string> = {
  INVESTMENTS: 'Investments',
  SAVINGS: 'Savings',
  ANNUITIES: 'Annuities',
  INCOME_PLAN: 'Income Plan',
  TAXES: 'Taxes',
  ESTATE_PLAN: 'Estate Plan',
  INSURANCE: 'Insurance',
  EMPLOYEE_BENEFITS: 'Employee Benefits',
};

export const SUGGESTION_DOMAIN_ICONS: Record<SuggestionDomain, string> = {
  INVESTMENTS: 'TrendingUp',
  SAVINGS: 'PiggyBank',
  ANNUITIES: 'Shield',
  INCOME_PLAN: 'Wallet',
  TAXES: 'Receipt',
  ESTATE_PLAN: 'FileText',
  INSURANCE: 'Umbrella',
  EMPLOYEE_BENEFITS: 'Briefcase',
};

export const SUGGESTION_DOMAIN_DESCRIPTIONS: Record<SuggestionDomain, string> = {
  INVESTMENTS: 'Portfolio alignment, diversification, costs, and fund selection',
  SAVINGS: 'Retirement savings targets, account types, and emergency funds',
  ANNUITIES: 'Guaranteed income products: MYGAs, FIAs, RILAs, and income annuities',
  INCOME_PLAN: 'Retirement income strategy, bucket approach, and withdrawal planning',
  TAXES: 'Roth conversions, tax efficiency, and capital gains management',
  ESTATE_PLAN: 'Wills, trusts, powers of attorney, and beneficiary designations',
  INSURANCE: 'Life, health, disability, and long-term care coverage',
  EMPLOYEE_BENEFITS: 'Employer benefits, FEGLI, TSP match, and pension optimization',
};

export const SUGGESTION_PRIORITY_LABELS: Record<SuggestionPriority, string> = {
  HIGH: 'High Priority',
  MEDIUM: 'Medium Priority',
  LOW: 'Low Priority',
};

export const SUGGESTION_ACTION_TYPE_LABELS: Record<SuggestionActionType, string> = {
  IMPLEMENT: 'Ready to Implement',
  INVESTIGATE: 'Needs Investigation',
  MONITOR: 'Monitor & Review',
  CONSULT_PROFESSIONAL: 'Consult Professional',
};

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  pending: 'Pending Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  modified: 'Modified',
};

export const DOMAIN_EXPLORATION_STATUS_LABELS: Record<DomainExplorationStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const PLAN_ITEM_STATUS_LABELS: Record<PlanItemStatus, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
  deferred: 'Deferred',
};

// ============================================================
// DEFAULT VALUES
// ============================================================

/** Create a default domain exploration state */
export function createDefaultDomainState(domain: SuggestionDomain): DomainExplorationState {
  return {
    domain,
    status: 'not_started',
    currentQuestionIndex: 0,
    answers: [],
    suggestions: [],
  };
}

/** All suggestion domains in order */
export const SUGGESTION_DOMAINS: SuggestionDomain[] = [
  'INVESTMENTS',
  'SAVINGS',
  'ANNUITIES',
  'INCOME_PLAN',
  'TAXES',
  'ESTATE_PLAN',
  'INSURANCE',
  'EMPLOYEE_BENEFITS',
];

/** Create default suggestions state */
export function createDefaultSuggestionsState(): SuggestionsState {
  const domainStates = {} as Record<SuggestionDomain, DomainExplorationState>;
  for (const domain of SUGGESTION_DOMAINS) {
    domainStates[domain] = createDefaultDomainState(domain);
  }
  return {
    domainStates,
    customRecommendations: [],
    planItems: [],
    updatedAt: new Date().toISOString(),
  };
}
