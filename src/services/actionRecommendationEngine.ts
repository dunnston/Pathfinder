/**
 * Action Recommendation Engine
 * Generates prioritized, actionable next steps from Discovery data and Focus Areas
 *
 * Principles:
 * - Each action supports a high-priority focus area
 * - Each action connects to specific goals or values
 * - Actions are understandable without jargon
 * - Limited to 3-7 recommendations at a time
 * - Avoids product recommendations and precise projections
 */

import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';
import type {
  PlanningDomain,
  PlanningFocusRanking,
  ActionRecommendation,
  ActionRecommendations,
  ActionType,
  ActionGuidance,
  ActionUrgency,
  StrategyProfile,
} from '@/types/strategyProfile';
import { getCardById } from '@/data/valueCards';

/** Input data for action generation */
export interface ActionInput {
  basicContext?: Partial<BasicContext>;
  valuesDiscovery?: Partial<ValuesDiscovery>;
  financialGoals?: Partial<FinancialGoals>;
  financialPurpose?: Partial<FinancialPurpose>;
  focusAreas: PlanningFocusRanking;
  strategyProfile: StrategyProfile;
}

// ============================================================
// ACTION TEMPLATES
// ============================================================

interface ActionTemplate {
  id: string;
  domain: PlanningDomain;
  title: string;
  description: string;
  type: ActionType;
  guidance: ActionGuidance;
  defaultUrgency: ActionUrgency;
  /** Conditions that make this action relevant */
  conditions: {
    requiresNearRetirement?: boolean;
    requiresFederalEmployee?: boolean;
    requiresDependents?: boolean;
    requiresMarried?: boolean;
    requiresHighPriorityGoalCategory?: string;
    requiresValueCategory?: string;
    minFocusAreaPriority?: number; // Only include if domain is in top N
  };
  /** What this action helps achieve */
  outcome: string;
  /** Template for rationale - can use {value} and {goal} placeholders */
  rationaleTemplate: string;
  dependencies?: string[]; // Other action IDs that should come first
}

const ACTION_TEMPLATES: ActionTemplate[] = [
  // RETIREMENT INCOME
  {
    id: 'retirement-income-sources',
    domain: 'RETIREMENT_INCOME',
    title: 'Review retirement income sources and timing',
    description: 'Understand all potential income sources (pensions, Social Security, investments) and when you can access them.',
    type: 'EDUCATION',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Clear picture of retirement income options and optimal claiming strategies',
    rationaleTemplate: 'This supports your priority of {value} and helps protect your goal of {goal}.',
  },
  {
    id: 'retirement-income-strategy',
    domain: 'RETIREMENT_INCOME',
    title: 'Compare retirement income strategies',
    description: 'Evaluate different approaches: guaranteed income vs. flexible withdrawals, timing of Social Security, pension options.',
    type: 'DECISION_PREP',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresNearRetirement: true, minFocusAreaPriority: 3 },
    outcome: 'Informed decision on income strategy that matches your priorities',
    rationaleTemplate: 'With retirement approaching, understanding income options now prevents costly decisions later.',
    dependencies: ['retirement-income-sources'],
  },
  {
    id: 'federal-retirement-analysis',
    domain: 'RETIREMENT_INCOME',
    title: 'Analyze federal retirement benefit options',
    description: 'Review FERS/CSRS benefits, TSP strategies, and timing considerations specific to federal employees.',
    type: 'EDUCATION',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresFederalEmployee: true, minFocusAreaPriority: 5 },
    outcome: 'Understanding of federal benefit optimization opportunities',
    rationaleTemplate: 'Federal benefits have unique rules that require specialized analysis to maximize.',
  },

  // INVESTMENT STRATEGY
  {
    id: 'investment-risk-review',
    domain: 'INVESTMENT_STRATEGY',
    title: 'Review investment allocation and risk level',
    description: 'Ensure your investment mix aligns with your time horizon, goals, and comfort with market fluctuations.',
    type: 'PROFESSIONAL_REVIEW',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Investment strategy aligned with your values and timeline',
    rationaleTemplate: 'Your {value} orientation suggests this review can ensure alignment.',
  },
  {
    id: 'investment-growth-focus',
    domain: 'INVESTMENT_STRATEGY',
    title: 'Evaluate growth opportunities in portfolio',
    description: 'Consider whether current allocation provides enough growth potential for your long-term goals.',
    type: 'OPTIMIZATION',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'MEDIUM_TERM',
    conditions: { requiresValueCategory: 'GROWTH', minFocusAreaPriority: 4 },
    outcome: 'Portfolio positioned for long-term growth while managing risk',
    rationaleTemplate: 'Growth is a core value, so ensuring your portfolio supports this is important.',
  },

  // TAX OPTIMIZATION
  {
    id: 'tax-strategy-review',
    domain: 'TAX_OPTIMIZATION',
    title: 'Review tax-efficient strategies',
    description: 'Identify opportunities like Roth conversions, tax-loss harvesting, or charitable giving strategies.',
    type: 'OPTIMIZATION',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'MEDIUM_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Reduced lifetime tax burden while supporting your goals',
    rationaleTemplate: 'Tax optimization can significantly impact long-term wealth and support {goal}.',
  },
  {
    id: 'roth-conversion-analysis',
    domain: 'TAX_OPTIMIZATION',
    title: 'Evaluate Roth conversion opportunities',
    description: 'Determine if converting pre-tax retirement funds to Roth makes sense in current or future low-income years.',
    type: 'DECISION_PREP',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresNearRetirement: true, minFocusAreaPriority: 4 },
    outcome: 'Strategic tax positioning for retirement years',
    rationaleTemplate: 'Pre-retirement years often offer conversion opportunities that disappear later.',
  },

  // INSURANCE & RISK
  {
    id: 'insurance-coverage-review',
    domain: 'INSURANCE_RISK',
    title: 'Review insurance coverage adequacy',
    description: 'Ensure life, disability, and property insurance appropriately protects your family and assets.',
    type: 'PROFESSIONAL_REVIEW',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Confidence that major risks are appropriately covered',
    rationaleTemplate: 'Protecting {goal} requires adequate insurance coverage.',
  },
  {
    id: 'life-insurance-needs',
    domain: 'INSURANCE_RISK',
    title: 'Calculate life insurance needs',
    description: 'Determine appropriate coverage amount based on dependents, debts, and income replacement needs.',
    type: 'DECISION_PREP',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'IMMEDIATE',
    conditions: { requiresDependents: true, minFocusAreaPriority: 4 },
    outcome: 'Right-sized life insurance to protect family',
    rationaleTemplate: 'With dependents relying on you, adequate life insurance is essential.',
  },

  // ESTATE & LEGACY
  {
    id: 'estate-documents-review',
    domain: 'ESTATE_LEGACY',
    title: 'Review estate planning documents',
    description: 'Ensure will, powers of attorney, healthcare directives, and beneficiary designations are current.',
    type: 'PROFESSIONAL_REVIEW',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Estate documents that reflect current wishes and family situation',
    rationaleTemplate: 'Your {value} values make estate planning particularly important.',
  },
  {
    id: 'beneficiary-audit',
    domain: 'ESTATE_LEGACY',
    title: 'Audit all beneficiary designations',
    description: 'Review beneficiaries on retirement accounts, life insurance, and other assets to ensure they match intentions.',
    type: 'STRUCTURAL',
    guidance: 'SELF_GUIDED',
    defaultUrgency: 'IMMEDIATE',
    conditions: { minFocusAreaPriority: 6 },
    outcome: 'Assets will transfer to intended recipients',
    rationaleTemplate: 'Outdated beneficiaries can override estate documents, causing unintended consequences.',
  },
  {
    id: 'legacy-planning',
    domain: 'ESTATE_LEGACY',
    title: 'Develop legacy and giving strategy',
    description: 'Consider how to incorporate charitable giving or family wealth transfer into your plan.',
    type: 'DECISION_PREP',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'MEDIUM_TERM',
    conditions: { requiresValueCategory: 'CONTRIBUTION', minFocusAreaPriority: 4 },
    outcome: 'Structured approach to legacy that reflects your values',
    rationaleTemplate: 'Contribution is a core value, so formalizing legacy plans supports what matters most.',
  },

  // CASH FLOW & DEBT
  {
    id: 'emergency-fund-target',
    domain: 'CASH_FLOW_DEBT',
    title: 'Establish emergency fund at target level',
    description: 'Build 3-6 months of expenses in accessible savings as a foundation for all other planning.',
    type: 'STRUCTURAL',
    guidance: 'SELF_GUIDED',
    defaultUrgency: 'IMMEDIATE',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Financial stability to handle unexpected expenses',
    rationaleTemplate: 'An emergency fund provides the {value} foundation that supports all other goals.',
  },
  {
    id: 'debt-payoff-strategy',
    domain: 'CASH_FLOW_DEBT',
    title: 'Create debt elimination strategy',
    description: 'Prioritize and plan payoff of high-interest debt before retirement.',
    type: 'STRUCTURAL',
    guidance: 'SELF_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresNearRetirement: true, minFocusAreaPriority: 5 },
    outcome: 'Reduced fixed expenses entering retirement',
    rationaleTemplate: 'Eliminating debt before retirement reduces income needs and increases flexibility.',
  },

  // BENEFITS OPTIMIZATION
  {
    id: 'federal-benefits-analysis',
    domain: 'BENEFITS_OPTIMIZATION',
    title: 'Complete federal benefits analysis',
    description: 'Review FEHB, FEGLI, TSP, and pension options for optimal retirement positioning.',
    type: 'EDUCATION',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresFederalEmployee: true, minFocusAreaPriority: 4 },
    outcome: 'Maximized federal retirement benefits',
    rationaleTemplate: 'Federal benefits require specialized knowledge to optimize effectively.',
  },
  {
    id: 'employer-benefits-review',
    domain: 'BENEFITS_OPTIMIZATION',
    title: 'Review employer benefit utilization',
    description: 'Ensure you are maximizing employer matches, HSA contributions, and other workplace benefits.',
    type: 'OPTIMIZATION',
    guidance: 'SELF_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { minFocusAreaPriority: 5 },
    outcome: 'Full utilization of available employer benefits',
    rationaleTemplate: 'Unused employer benefits represent lost compensation.',
  },

  // HEALTHCARE & LTC
  {
    id: 'healthcare-transition-plan',
    domain: 'HEALTHCARE_LTC',
    title: 'Plan healthcare coverage transition',
    description: 'Understand Medicare options, employer retiree coverage, or marketplace alternatives.',
    type: 'EDUCATION',
    guidance: 'SPECIALIST_GUIDED',
    defaultUrgency: 'NEAR_TERM',
    conditions: { requiresNearRetirement: true, minFocusAreaPriority: 4 },
    outcome: 'Seamless healthcare coverage through retirement transition',
    rationaleTemplate: 'Healthcare is one of the largest retirement expenses and requires advance planning.',
  },
  {
    id: 'ltc-insurance-evaluation',
    domain: 'HEALTHCARE_LTC',
    title: 'Evaluate long-term care planning options',
    description: 'Consider LTC insurance, self-insurance, or hybrid strategies for potential care needs.',
    type: 'DECISION_PREP',
    guidance: 'ADVISOR_GUIDED',
    defaultUrgency: 'MEDIUM_TERM',
    conditions: { requiresValueCategory: 'HEALTH', minFocusAreaPriority: 5 },
    outcome: 'Plan for potential long-term care needs',
    rationaleTemplate: 'Health is a priority value, and LTC planning protects both health and financial security.',
  },

  // BUSINESS & CAREER
  {
    id: 'career-transition-planning',
    domain: 'BUSINESS_CAREER',
    title: 'Develop career transition strategy',
    description: 'Plan for potential encore career, phased retirement, or full retirement transition.',
    type: 'DECISION_PREP',
    guidance: 'SELF_GUIDED',
    defaultUrgency: 'MEDIUM_TERM',
    conditions: { requiresValueCategory: 'PURPOSE', minFocusAreaPriority: 5 },
    outcome: 'Clear vision for work-life transition',
    rationaleTemplate: 'Purpose is a core value, so planning how work fits into your next chapter is important.',
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Calculate age from birth date */
function calculateAge(birthDate: Date | undefined): number | undefined {
  if (!birthDate) return undefined;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Get years to retirement */
function getYearsToRetirement(basicContext?: Partial<BasicContext>): number | undefined {
  const age = calculateAge(basicContext?.birthDate);
  if (age === undefined) return undefined;
  // Default target retirement age of 65
  const targetAge = 65;
  return Math.max(0, targetAge - age);
}

/** Check if near retirement (within 10 years) */
function isNearRetirement(basicContext?: Partial<BasicContext>): boolean {
  const years = getYearsToRetirement(basicContext);
  return years !== undefined && years <= 10;
}

/** Check if domain is in top N priority areas */
function isDomainInTopN(
  domain: PlanningDomain,
  focusAreas: PlanningFocusRanking,
  n: number
): boolean {
  const area = focusAreas.areas.find((a) => a.domain === domain);
  return area !== undefined && area.priority <= n;
}

/** Get primary value name for rationale */
function getPrimaryValueName(valuesDiscovery?: Partial<ValuesDiscovery>): string {
  if (!valuesDiscovery?.top5?.[0]) return 'financial security';
  const card = getCardById(valuesDiscovery.top5[0]);
  return card?.title.toLowerCase() || 'financial security';
}

/** Get primary goal name for rationale */
function getPrimaryGoalName(financialGoals?: Partial<FinancialGoals>): string {
  if (!financialGoals?.allGoals) return 'your financial goals';
  const highPriorityGoal = financialGoals.allGoals.find((g) => g.priority === 'HIGH');
  return highPriorityGoal?.label || 'your financial goals';
}

/** Check if a value category is present in top values */
function hasValueCategory(valuesDiscovery?: Partial<ValuesDiscovery>, category?: string): boolean {
  if (!valuesDiscovery?.top5 || !category) return false;
  for (const cardId of valuesDiscovery.top5) {
    const card = getCardById(cardId);
    if (card?.category === category) return true;
  }
  return false;
}

/** Check if a goal category is high priority */
function hasHighPriorityGoalCategory(financialGoals?: Partial<FinancialGoals>, category?: string): boolean {
  if (!financialGoals?.allGoals || !category) return false;
  return financialGoals.allGoals.some(
    (g) => g.category === category && g.priority === 'HIGH'
  );
}

// ============================================================
// ACTION GENERATION
// ============================================================

/** Check if an action template's conditions are met */
function meetsConditions(
  template: ActionTemplate,
  input: ActionInput
): boolean {
  const { basicContext, valuesDiscovery, financialGoals, focusAreas } = input;
  const conditions = template.conditions;

  // Check focus area priority
  if (conditions.minFocusAreaPriority !== undefined) {
    if (!isDomainInTopN(template.domain, focusAreas, conditions.minFocusAreaPriority)) {
      return false;
    }
  }

  // Check near retirement requirement
  if (conditions.requiresNearRetirement && !isNearRetirement(basicContext)) {
    return false;
  }

  // Check federal employee requirement
  if (conditions.requiresFederalEmployee && !basicContext?.federalEmployee?.retirementSystem) {
    return false;
  }

  // Check dependents requirement
  if (conditions.requiresDependents) {
    if (!basicContext?.dependents || basicContext.dependents.length === 0) {
      return false;
    }
  }

  // Check married requirement
  if (conditions.requiresMarried && basicContext?.maritalStatus !== 'married') {
    return false;
  }

  // Check value category requirement
  if (conditions.requiresValueCategory) {
    if (!hasValueCategory(valuesDiscovery, conditions.requiresValueCategory)) {
      return false;
    }
  }

  // Check goal category requirement
  if (conditions.requiresHighPriorityGoalCategory) {
    if (!hasHighPriorityGoalCategory(financialGoals, conditions.requiresHighPriorityGoalCategory)) {
      return false;
    }
  }

  return true;
}

/** Build personalized rationale from template */
function buildRationale(
  template: ActionTemplate,
  input: ActionInput
): string {
  const valueName = getPrimaryValueName(input.valuesDiscovery);
  const goalName = getPrimaryGoalName(input.financialGoals);

  return template.rationaleTemplate
    .replace('{value}', valueName)
    .replace('{goal}', goalName);
}

/** Get value connections for an action */
function getValueConnections(
  _template: ActionTemplate,
  input: ActionInput
): string[] {
  const connections: string[] = [];

  if (input.valuesDiscovery?.top5) {
    for (const cardId of input.valuesDiscovery.top5.slice(0, 2)) {
      const card = getCardById(cardId);
      if (card) connections.push(card.title);
    }
  }

  return connections;
}

/** Get goal connections for an action */
function getGoalConnections(
  _template: ActionTemplate,
  input: ActionInput
): string[] {
  const connections: string[] = [];

  if (input.financialGoals?.allGoals) {
    const highPriorityGoals = input.financialGoals.allGoals
      .filter((g) => g.priority === 'HIGH')
      .slice(0, 2);
    for (const goal of highPriorityGoals) {
      connections.push(goal.label);
    }
  }

  return connections;
}

/** Adjust urgency based on context */
function adjustUrgency(
  template: ActionTemplate,
  input: ActionInput
): ActionUrgency {
  // Near retirement increases urgency for retirement-related actions
  if (isNearRetirement(input.basicContext)) {
    if (['RETIREMENT_INCOME', 'HEALTHCARE_LTC', 'TAX_OPTIMIZATION'].includes(template.domain)) {
      if (template.defaultUrgency === 'MEDIUM_TERM') return 'NEAR_TERM';
      if (template.defaultUrgency === 'NEAR_TERM') return 'IMMEDIATE';
    }
  }

  return template.defaultUrgency;
}

/** Convert template to full action recommendation */
function templateToAction(
  template: ActionTemplate,
  input: ActionInput
): ActionRecommendation {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    rationale: buildRationale(template, input),
    outcome: template.outcome,
    type: template.type,
    guidance: template.guidance,
    urgency: adjustUrgency(template, input),
    domain: template.domain,
    valueConnections: getValueConnections(template, input),
    goalConnections: getGoalConnections(template, input),
    dependencies: template.dependencies,
  };
}

// ============================================================
// MAIN ENGINE FUNCTION
// ============================================================

/**
 * Generate Action Recommendations from Discovery data and Focus Areas
 */
export function generateActionRecommendations(input: ActionInput): ActionRecommendations {
  // Find all applicable actions
  const applicableActions: ActionRecommendation[] = [];

  for (const template of ACTION_TEMPLATES) {
    if (meetsConditions(template, input)) {
      applicableActions.push(templateToAction(template, input));
    }
  }

  // Sort by urgency and domain priority
  const urgencyOrder: Record<ActionUrgency, number> = {
    IMMEDIATE: 0,
    NEAR_TERM: 1,
    MEDIUM_TERM: 2,
    ONGOING: 3,
  };

  applicableActions.sort((a, b) => {
    // First by urgency
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;

    // Then by domain priority
    const aPriority = input.focusAreas.areas.find((f) => f.domain === a.domain)?.priority || 99;
    const bPriority = input.focusAreas.areas.find((f) => f.domain === b.domain)?.priority || 99;
    return aPriority - bPriority;
  });

  // Limit to 7 recommendations
  const recommendations = applicableActions.slice(0, 7);

  // Top actions (immediate and near-term)
  const topActions = recommendations
    .filter((a) => a.urgency === 'IMMEDIATE' || a.urgency === 'NEAR_TERM')
    .slice(0, 5)
    .map((a) => a.id);

  return {
    recommendations,
    topActions,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Check if there's enough data for meaningful action recommendations
 */
export function hasEnoughDataForActions(input: ActionInput): boolean {
  return input.focusAreas.areas.length > 0;
}
