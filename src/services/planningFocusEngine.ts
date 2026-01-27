/**
 * Planning Focus Area Engine
 * Ranks financial planning domains by importance based on Discovery data
 *
 * Core Planning Domains:
 * - Retirement Income Strategy
 * - Investment Strategy
 * - Tax Optimization
 * - Insurance & Risk Management
 * - Estate & Legacy Planning
 * - Cash Flow & Debt Management
 * - Benefits Optimization
 * - Business & Career Strategy
 * - Healthcare & Long-Term Care
 */

import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery, ValueCategory } from '@/types/valuesDiscovery';
import type { FinancialGoals, GoalCategory } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';
import type {
  PlanningDomain,
  PlanningFocusArea,
  PlanningFocusRanking,
} from '@/types/strategyProfile';
import { computeDerivedInsights } from './valuesLogic';
import { getCardById } from '@/data/valueCards';

/** Input data for focus area prioritization */
export interface FocusAreaInput {
  basicContext?: Partial<BasicContext>;
  valuesDiscovery?: Partial<ValuesDiscovery>;
  financialGoals?: Partial<FinancialGoals>;
  financialPurpose?: Partial<FinancialPurpose>;
}

/** Domain scoring result */
interface DomainScore {
  domain: PlanningDomain;
  score: number;
  valueConnections: string[];
  goalConnections: string[];
  rationales: string[];
  riskFactors: string[];
}

// ============================================================
// VALUE-DOMAIN MAPPINGS
// ============================================================

/** Which value categories increase importance of each domain */
const VALUE_DOMAIN_MAP: Record<ValueCategory, PlanningDomain[]> = {
  SECURITY: ['RETIREMENT_INCOME', 'INSURANCE_RISK', 'CASH_FLOW_DEBT'],
  FREEDOM: ['INVESTMENT_STRATEGY', 'CASH_FLOW_DEBT', 'RETIREMENT_INCOME'],
  FAMILY: ['ESTATE_LEGACY', 'INSURANCE_RISK', 'HEALTHCARE_LTC'],
  GROWTH: ['INVESTMENT_STRATEGY', 'TAX_OPTIMIZATION', 'BUSINESS_CAREER'],
  CONTROL: ['CASH_FLOW_DEBT', 'TAX_OPTIMIZATION', 'INVESTMENT_STRATEGY'],
  HEALTH: ['HEALTHCARE_LTC', 'INSURANCE_RISK'],
  CONTRIBUTION: ['ESTATE_LEGACY', 'TAX_OPTIMIZATION'],
  PURPOSE: ['BUSINESS_CAREER', 'ESTATE_LEGACY'],
  QUALITY_OF_LIFE: ['RETIREMENT_INCOME', 'CASH_FLOW_DEBT', 'HEALTHCARE_LTC'],
};

// ============================================================
// GOAL-DOMAIN MAPPINGS
// ============================================================

/** Which goal categories increase importance of each domain */
const GOAL_DOMAIN_MAP: Record<GoalCategory, PlanningDomain[]> = {
  RETIREMENT: ['RETIREMENT_INCOME', 'INVESTMENT_STRATEGY', 'TAX_OPTIMIZATION'],
  FAMILY_LEGACY: ['ESTATE_LEGACY', 'INSURANCE_RISK', 'CASH_FLOW_DEBT'],
  LIFESTYLE: ['CASH_FLOW_DEBT', 'INVESTMENT_STRATEGY'],
  SECURITY_PROTECTION: ['INSURANCE_RISK', 'CASH_FLOW_DEBT', 'RETIREMENT_INCOME'],
  GIVING: ['ESTATE_LEGACY', 'TAX_OPTIMIZATION'],
  CAREER_GROWTH: ['BUSINESS_CAREER', 'BENEFITS_OPTIMIZATION'],
  HEALTH: ['HEALTHCARE_LTC', 'INSURANCE_RISK'],
  MAJOR_PURCHASES: ['CASH_FLOW_DEBT', 'INVESTMENT_STRATEGY'],
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Get top value categories from discovery */
function getTopValueCategories(valuesDiscovery?: Partial<ValuesDiscovery>): ValueCategory[] {
  if (!valuesDiscovery?.top5 || valuesDiscovery.top5.length === 0) return [];

  // computeDerivedInsights needs a full ValuesDiscovery, so we need to cast safely
  const derived = computeDerivedInsights(valuesDiscovery as ValuesDiscovery);
  const categories: ValueCategory[] = [];

  if (derived.dominantCategory) categories.push(derived.dominantCategory);
  if (derived.secondaryCategory && derived.secondaryCategory !== derived.dominantCategory) {
    categories.push(derived.secondaryCategory);
  }

  return categories;
}

/** Get top value card titles for display */
function getTop5ValueTitles(valuesDiscovery?: Partial<ValuesDiscovery>): string[] {
  if (!valuesDiscovery?.top5) return [];
  return valuesDiscovery.top5
    .map((id) => getCardById(id)?.title || id)
    .slice(0, 5);
}

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

/** Calculate years to retirement */
function getYearsToRetirement(basicContext?: Partial<BasicContext>): number | undefined {
  const age = calculateAge(basicContext?.birthDate);
  if (age === undefined) return undefined;
  // Default target retirement age of 65
  const targetAge = 65;
  return Math.max(0, targetAge - age);
}

// ============================================================
// DOMAIN SCORING
// ============================================================

/** Initialize all domain scores */
function initializeDomainScores(): Map<PlanningDomain, DomainScore> {
  const domains: PlanningDomain[] = [
    'RETIREMENT_INCOME',
    'INVESTMENT_STRATEGY',
    'TAX_OPTIMIZATION',
    'INSURANCE_RISK',
    'ESTATE_LEGACY',
    'CASH_FLOW_DEBT',
    'BENEFITS_OPTIMIZATION',
    'BUSINESS_CAREER',
    'HEALTHCARE_LTC',
  ];

  const scores = new Map<PlanningDomain, DomainScore>();
  for (const domain of domains) {
    scores.set(domain, {
      domain,
      score: 0,
      valueConnections: [],
      goalConnections: [],
      rationales: [],
      riskFactors: [],
    });
  }
  return scores;
}

/** Score domains based on value categories */
function scoreFromValues(
  scores: Map<PlanningDomain, DomainScore>,
  valuesDiscovery?: Partial<ValuesDiscovery>
): void {
  if (!valuesDiscovery?.top5) return;

  const valueTitles = getTop5ValueTitles(valuesDiscovery);
  const categories = getTopValueCategories(valuesDiscovery);

  for (const category of categories) {
    const relatedDomains = VALUE_DOMAIN_MAP[category] || [];
    for (const domain of relatedDomains) {
      const score = scores.get(domain);
      if (score) {
        score.score += 2;
        score.valueConnections.push(category);
        score.rationales.push(`${category} values emphasize this area`);
      }
    }
  }

  // Add top value titles to connections for display
  for (const score of scores.values()) {
    if (score.valueConnections.length > 0) {
      const topValueNames = valueTitles.slice(0, 2);
      score.valueConnections = [...new Set([...score.valueConnections, ...topValueNames])];
    }
  }
}

/** Score domains based on financial goals */
function scoreFromGoals(
  scores: Map<PlanningDomain, DomainScore>,
  financialGoals?: Partial<FinancialGoals>
): void {
  if (!financialGoals?.allGoals) return;

  const highPriorityGoals = financialGoals.allGoals.filter((g) => g.priority === 'HIGH');

  for (const goal of highPriorityGoals) {
    const relatedDomains = GOAL_DOMAIN_MAP[goal.category] || [];
    for (const domain of relatedDomains) {
      const score = scores.get(domain);
      if (score) {
        score.score += 3; // Goals weighted more heavily
        if (!score.goalConnections.includes(goal.label)) {
          score.goalConnections.push(goal.label);
        }
        score.rationales.push(`Supports goal: ${goal.label}`);
      }
    }

    // Short-term high priority goals increase urgency
    if (goal.timeHorizon === 'SHORT') {
      const domains = GOAL_DOMAIN_MAP[goal.category] || [];
      for (const domain of domains) {
        const score = scores.get(domain);
        if (score) {
          score.score += 2;
          score.rationales.push(`Near-term goal: ${goal.label}`);
        }
      }
    }
  }
}

/** Score domains based on timing and life stage */
function scoreFromContext(
  scores: Map<PlanningDomain, DomainScore>,
  basicContext?: Partial<BasicContext>
): void {
  if (!basicContext) return;

  const yearsToRetirement = getYearsToRetirement(basicContext);

  // Near retirement boosts retirement-related domains
  if (yearsToRetirement !== undefined) {
    if (yearsToRetirement <= 5) {
      const retirementScore = scores.get('RETIREMENT_INCOME');
      if (retirementScore) {
        retirementScore.score += 5;
        retirementScore.rationales.push('Retirement within 5 years');
        retirementScore.riskFactors.push('Critical timing - income strategy decisions are imminent');
      }

      const healthcareScore = scores.get('HEALTHCARE_LTC');
      if (healthcareScore) {
        healthcareScore.score += 3;
        healthcareScore.rationales.push('Healthcare planning critical before retirement');
      }

      const taxScore = scores.get('TAX_OPTIMIZATION');
      if (taxScore) {
        taxScore.score += 2;
        taxScore.rationales.push('Tax strategy important during retirement transition');
      }
    } else if (yearsToRetirement <= 10) {
      const retirementScore = scores.get('RETIREMENT_INCOME');
      if (retirementScore) {
        retirementScore.score += 3;
        retirementScore.rationales.push('Retirement within 10 years');
      }
    }
  }

  // Federal employee benefits optimization
  if (basicContext.federalEmployee?.retirementSystem) {
    const benefitsScore = scores.get('BENEFITS_OPTIMIZATION');
    if (benefitsScore) {
      benefitsScore.score += 4;
      benefitsScore.rationales.push('Federal employee with complex benefit structure');
      benefitsScore.riskFactors.push('Federal benefits require specialized optimization');
    }
  }

  // Dependents increase family-related domains
  if (basicContext.dependents && basicContext.dependents.length > 0) {
    const insuranceScore = scores.get('INSURANCE_RISK');
    if (insuranceScore) {
      insuranceScore.score += 2;
      insuranceScore.rationales.push(`${basicContext.dependents.length} dependents to protect`);
      insuranceScore.riskFactors.push('Dependents require adequate protection');
    }

    const estateScore = scores.get('ESTATE_LEGACY');
    if (estateScore) {
      estateScore.score += 2;
      estateScore.rationales.push('Estate planning important with dependents');
    }
  }

  // Married couples need coordinated planning
  if (basicContext.maritalStatus === 'married' && basicContext.spouse) {
    const estateScore = scores.get('ESTATE_LEGACY');
    if (estateScore) {
      estateScore.score += 1;
      estateScore.rationales.push('Married - coordinated estate planning beneficial');
    }
  }
}

/** Add risk factors for domains with low scores but high potential impact */
function addRiskFactors(scores: Map<PlanningDomain, DomainScore>): void {
  // Insurance is always important if score is low
  const insuranceScore = scores.get('INSURANCE_RISK');
  if (insuranceScore && insuranceScore.score < 3) {
    insuranceScore.riskFactors.push('Underinsurance poses significant financial risk');
  }

  // Estate planning is important for everyone
  const estateScore = scores.get('ESTATE_LEGACY');
  if (estateScore && estateScore.score < 3) {
    estateScore.riskFactors.push('Lack of estate documents can cause complications');
  }

  // Cash flow is foundational
  const cashFlowScore = scores.get('CASH_FLOW_DEBT');
  if (cashFlowScore && cashFlowScore.score < 2) {
    cashFlowScore.riskFactors.push('Cash flow management is foundational to all planning');
  }
}

// ============================================================
// MAIN ENGINE FUNCTION
// ============================================================

/** Convert score to importance level */
function scoreToImportance(score: number): 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' {
  if (score >= 8) return 'CRITICAL';
  if (score >= 5) return 'HIGH';
  if (score >= 2) return 'MODERATE';
  return 'LOW';
}

/** Generate unique rationale from multiple sources */
function generateRationale(score: DomainScore): string {
  const uniqueRationales = [...new Set(score.rationales)].slice(0, 3);
  return uniqueRationales.join('; ') || 'General planning area';
}

/**
 * Generate Planning Focus Area Ranking from Discovery data
 */
export function generateFocusAreaRanking(input: FocusAreaInput): PlanningFocusRanking {
  const scores = initializeDomainScores();

  // Apply scoring from each data source
  scoreFromValues(scores, input.valuesDiscovery);
  scoreFromGoals(scores, input.financialGoals);
  scoreFromContext(scores, input.basicContext);
  addRiskFactors(scores);

  // Convert to sorted array
  const sortedScores = Array.from(scores.values()).sort((a, b) => b.score - a.score);

  // Build focus areas
  const areas: PlanningFocusArea[] = sortedScores.map((score, index) => ({
    domain: score.domain,
    priority: index + 1,
    importance: scoreToImportance(score.score),
    rationale: generateRationale(score),
    valueConnections: [...new Set(score.valueConnections)].slice(0, 3),
    goalConnections: [...new Set(score.goalConnections)].slice(0, 3),
    riskFactors: score.riskFactors.length > 0 ? score.riskFactors : undefined,
  }));

  // Top 3 priorities (critical or high importance)
  const topPriorities = areas
    .filter((a) => a.importance === 'CRITICAL' || a.importance === 'HIGH')
    .slice(0, 3)
    .map((a) => a.domain);

  return {
    areas,
    topPriorities,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Check if there's enough data for meaningful focus area ranking
 */
export function hasEnoughDataForFocusAreas(input: FocusAreaInput): boolean {
  const { basicContext, valuesDiscovery, financialGoals } = input;

  const hasValues = Boolean(valuesDiscovery?.top5 && valuesDiscovery.top5.length >= 3);
  const hasGoals = Boolean(financialGoals?.allGoals && financialGoals.allGoals.length >= 1);
  const hasContext = calculateAge(basicContext?.birthDate) !== undefined;

  return (hasValues || hasGoals) && hasContext;
}
