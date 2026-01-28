/**
 * Suggestion Domain Definitions
 * Metadata for the 8 planning domains in the suggestions engine
 */

import type { SuggestionDomain, DomainInfo, ApplicabilityCondition } from '@/types/suggestions';

// ============================================================
// DOMAIN DEFINITIONS
// ============================================================

export const DOMAIN_INFO: Record<SuggestionDomain, DomainInfo> = {
  INVESTMENTS: {
    id: 'INVESTMENTS',
    name: 'Investments',
    description: 'Portfolio alignment, diversification, costs, and fund selection',
    icon: 'TrendingUp',
    relevanceConditions: [], // Always relevant
    order: 1,
  },
  SAVINGS: {
    id: 'SAVINGS',
    name: 'Savings',
    description: 'Retirement savings targets, account types, and emergency funds',
    icon: 'PiggyBank',
    relevanceConditions: [], // Always relevant
    order: 2,
  },
  ANNUITIES: {
    id: 'ANNUITIES',
    name: 'Annuities',
    description: 'Guaranteed income products: MYGAs, FIAs, RILAs, and income annuities',
    icon: 'Shield',
    relevanceConditions: [
      { type: 'age_over', value: 45 }, // More relevant for those closer to retirement
    ],
    order: 3,
  },
  INCOME_PLAN: {
    id: 'INCOME_PLAN',
    name: 'Income Plan',
    description: 'Retirement income strategy, bucket approach, and withdrawal planning',
    icon: 'Wallet',
    relevanceConditions: [
      { type: 'near_retirement' }, // Most relevant near or in retirement
    ],
    order: 4,
  },
  TAXES: {
    id: 'TAXES',
    name: 'Taxes',
    description: 'Roth conversions, tax efficiency, and capital gains management',
    icon: 'Receipt',
    relevanceConditions: [], // Always relevant
    order: 5,
  },
  ESTATE_PLAN: {
    id: 'ESTATE_PLAN',
    name: 'Estate Plan',
    description: 'Wills, trusts, powers of attorney, and beneficiary designations',
    icon: 'FileText',
    relevanceConditions: [], // Always relevant, especially with dependents
    order: 6,
  },
  INSURANCE: {
    id: 'INSURANCE',
    name: 'Insurance',
    description: 'Life, health, disability, and long-term care coverage',
    icon: 'Umbrella',
    relevanceConditions: [], // Always relevant
    order: 7,
  },
  EMPLOYEE_BENEFITS: {
    id: 'EMPLOYEE_BENEFITS',
    name: 'Employee Benefits',
    description: 'Employer benefits, FEGLI, TSP match, and pension optimization',
    icon: 'Briefcase',
    relevanceConditions: [
      { type: 'federal_employee' }, // Especially relevant for federal employees
    ],
    order: 8,
  },
};

// ============================================================
// DOMAIN HELPERS
// ============================================================

/**
 * Get all domains in order
 */
export function getAllDomains(): DomainInfo[] {
  return Object.values(DOMAIN_INFO).sort((a, b) => a.order - b.order);
}

/**
 * Get domain info by ID
 */
export function getDomainInfo(domain: SuggestionDomain): DomainInfo {
  return DOMAIN_INFO[domain];
}

/**
 * Get domains ordered by relevance for a given profile
 * Domains with met conditions come first
 */
export function getDomainsOrderedByRelevance(
  meetsCondition: (condition: ApplicabilityCondition) => boolean
): DomainInfo[] {
  const domains = getAllDomains();

  // Separate into relevant and less relevant
  const relevant: DomainInfo[] = [];
  const lessRelevant: DomainInfo[] = [];

  for (const domain of domains) {
    // If no conditions, always relevant
    if (domain.relevanceConditions.length === 0) {
      relevant.push(domain);
      continue;
    }

    // Check if any conditions are met
    const anyConditionMet = domain.relevanceConditions.some(meetsCondition);
    if (anyConditionMet) {
      relevant.push(domain);
    } else {
      lessRelevant.push(domain);
    }
  }

  // Return relevant first, then less relevant (both maintaining their original order)
  return [...relevant, ...lessRelevant];
}

// ============================================================
// DOMAIN QUESTION COUNTS (for progress tracking)
// ============================================================

/**
 * Expected question counts per domain (approximate)
 * These should match the actual question counts in the question files
 */
export const DOMAIN_QUESTION_COUNTS: Record<SuggestionDomain, number> = {
  INVESTMENTS: 5,
  SAVINGS: 7,
  ANNUITIES: 4,
  INCOME_PLAN: 2,
  TAXES: 4,
  ESTATE_PLAN: 4,
  INSURANCE: 5,
  EMPLOYEE_BENEFITS: 5,
};

/**
 * Get total question count across all domains
 */
export function getTotalQuestionCount(): number {
  return Object.values(DOMAIN_QUESTION_COUNTS).reduce((sum, count) => sum + count, 0);
}
