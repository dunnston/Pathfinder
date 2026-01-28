/**
 * Suggestions Data Barrel Export
 * Central export for all suggestion-related data
 */

// Domain definitions
export { DOMAIN_INFO, getAllDomains, getDomainInfo, getDomainsOrderedByRelevance, DOMAIN_QUESTION_COUNTS, getTotalQuestionCount } from './domains';

// Question banks by domain
export { INVESTMENTS_QUESTIONS, getInvestmentsQuestions } from './investmentsQuestions';
export { SAVINGS_QUESTIONS, getSavingsQuestions } from './savingsQuestions';
export { ANNUITIES_QUESTIONS, getAnnuitiesQuestions } from './annuitiesQuestions';
export { INCOME_PLAN_QUESTIONS, getIncomePlanQuestions } from './incomePlanQuestions';
export { TAXES_QUESTIONS, getTaxesQuestions } from './taxesQuestions';
export { ESTATE_PLAN_QUESTIONS, getEstatePlanQuestions } from './estatePlanQuestions';
export { INSURANCE_QUESTIONS, getInsuranceQuestions } from './insuranceQuestions';
export { EMPLOYEE_BENEFITS_QUESTIONS, getEmployeeBenefitsQuestions } from './employeeBenefitsQuestions';

import type { SuggestionDomain, GuidedQuestion } from '@/types/suggestions';
import { INVESTMENTS_QUESTIONS } from './investmentsQuestions';
import { SAVINGS_QUESTIONS } from './savingsQuestions';
import { ANNUITIES_QUESTIONS } from './annuitiesQuestions';
import { INCOME_PLAN_QUESTIONS } from './incomePlanQuestions';
import { TAXES_QUESTIONS } from './taxesQuestions';
import { ESTATE_PLAN_QUESTIONS } from './estatePlanQuestions';
import { INSURANCE_QUESTIONS } from './insuranceQuestions';
import { EMPLOYEE_BENEFITS_QUESTIONS } from './employeeBenefitsQuestions';

/**
 * Map of all questions by domain
 */
export const QUESTIONS_BY_DOMAIN: Record<SuggestionDomain, GuidedQuestion[]> = {
  INVESTMENTS: INVESTMENTS_QUESTIONS,
  SAVINGS: SAVINGS_QUESTIONS,
  ANNUITIES: ANNUITIES_QUESTIONS,
  INCOME_PLAN: INCOME_PLAN_QUESTIONS,
  TAXES: TAXES_QUESTIONS,
  ESTATE_PLAN: ESTATE_PLAN_QUESTIONS,
  INSURANCE: INSURANCE_QUESTIONS,
  EMPLOYEE_BENEFITS: EMPLOYEE_BENEFITS_QUESTIONS,
};

/**
 * Get all questions for a specific domain
 */
export function getQuestionsByDomain(domain: SuggestionDomain): GuidedQuestion[] {
  return QUESTIONS_BY_DOMAIN[domain] || [];
}

/**
 * Get a specific question by ID
 */
export function getQuestionById(questionId: string): GuidedQuestion | undefined {
  for (const questions of Object.values(QUESTIONS_BY_DOMAIN)) {
    const question = questions.find(q => q.id === questionId);
    if (question) return question;
  }
  return undefined;
}

/**
 * Get total number of questions across all domains
 */
export function getTotalQuestions(): number {
  return Object.values(QUESTIONS_BY_DOMAIN).reduce(
    (total, questions) => total + questions.length,
    0
  );
}

/**
 * Get question counts by domain
 */
export function getQuestionCountsByDomain(): Record<SuggestionDomain, number> {
  const counts = {} as Record<SuggestionDomain, number>;
  for (const [domain, questions] of Object.entries(QUESTIONS_BY_DOMAIN)) {
    counts[domain as SuggestionDomain] = questions.length;
  }
  return counts;
}
