/**
 * Suggestions Filter Service
 * Determines domain relevance and question applicability based on user profile
 */

import type { PartialFinancialProfile } from '@/types/profile';
import type {
  SuggestionDomain,
  ApplicabilityCondition,
  GuidedQuestion,
  QuestionAnswer,
} from '@/types/suggestions';
import { DOMAIN_INFO, getAllDomains } from '@/data/suggestions/domains';

// ============================================================
// PROFILE EVALUATION HELPERS
// ============================================================

/**
 * Calculate user's age from birth date
 */
function calculateAge(birthDate: Date | string | undefined): number | null {
  if (!birthDate) return null;

  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if user is near retirement (within 10 years of age 65, or already retired)
 */
function isNearRetirement(profile: PartialFinancialProfile | null): boolean {
  if (!profile?.basicContext?.birthDate) return false;

  const age = calculateAge(profile.basicContext.birthDate);
  if (age === null) return false;

  // Near retirement if 55+ or already past 65
  return age >= 55;
}

/**
 * Check if user is a federal employee
 */
function isFederalEmployee(profile: PartialFinancialProfile | null): boolean {
  return profile?.basicContext?.federalEmployee !== null &&
    profile?.basicContext?.federalEmployee !== undefined;
}

/**
 * Check if user has a spouse/partner
 */
function hasSpouse(profile: PartialFinancialProfile | null): boolean {
  const maritalStatus = profile?.basicContext?.maritalStatus;
  return maritalStatus === 'married' || maritalStatus === 'domestic_partnership';
}

/**
 * Check if user has dependents
 */
function hasDependents(profile: PartialFinancialProfile | null): boolean {
  const dependents = profile?.basicContext?.dependents;
  return Array.isArray(dependents) && dependents.length > 0;
}

/**
 * Check if user has a pension (federal or other)
 */
function hasPension(profile: PartialFinancialProfile | null): boolean {
  // Check federal employee pension
  if (isFederalEmployee(profile)) return true;

  // Check if spouse has pension
  if (profile?.basicContext?.spouse?.hasPension) return true;

  // Check retirement income sources for pension
  const retirementIncome = profile?.financialSnapshot?.incomeSourcesRetirement;
  if (retirementIncome) {
    return retirementIncome.some(
      (source) =>
        source.type === 'fers_pension' ||
        source.type === 'csrs_pension' ||
        source.type === 'other_pension'
    );
  }

  return false;
}

/**
 * Check if user has TSP accounts
 */
function hasTSP(profile: PartialFinancialProfile | null): boolean {
  const accounts = profile?.financialSnapshot?.investmentAccounts;
  if (!accounts) return false;

  return accounts.some(
    (account) => account.type === 'tsp_traditional' || account.type === 'tsp_roth'
  );
}

/**
 * Check if user has IRA accounts
 */
function hasIRA(profile: PartialFinancialProfile | null): boolean {
  const accounts = profile?.financialSnapshot?.investmentAccounts;
  if (!accounts) return false;

  return accounts.some(
    (account) => account.type === 'traditional_ira' || account.type === 'roth_ira'
  );
}

/**
 * Check if user has 401k accounts
 */
function has401k(profile: PartialFinancialProfile | null): boolean {
  const accounts = profile?.financialSnapshot?.investmentAccounts;
  if (!accounts) return false;

  return accounts.some((account) => account.type === '401k');
}

// ============================================================
// CONDITION EVALUATION
// ============================================================

/**
 * Evaluate a single applicability condition against the profile
 */
export function evaluateCondition(
  condition: ApplicabilityCondition,
  profile: PartialFinancialProfile | null,
  previousAnswers?: QuestionAnswer[]
): boolean {
  let result: boolean;

  switch (condition.type) {
    case 'always':
      result = true;
      break;

    case 'federal_employee':
      result = isFederalEmployee(profile);
      break;

    case 'has_spouse':
      result = hasSpouse(profile);
      break;

    case 'has_dependents':
      result = hasDependents(profile);
      break;

    case 'near_retirement':
      result = isNearRetirement(profile);
      break;

    case 'has_pension':
      result = hasPension(profile);
      break;

    case 'has_tsp':
      result = hasTSP(profile);
      break;

    case 'has_ira':
      result = hasIRA(profile);
      break;

    case 'has_401k':
      result = has401k(profile);
      break;

    case 'age_over': {
      if (!profile?.basicContext?.birthDate || condition.value === undefined) {
        result = false;
        break;
      }
      const age = calculateAge(profile.basicContext.birthDate);
      result = age !== null && age > (condition.value as number);
      break;
    }

    case 'age_under': {
      if (!profile?.basicContext?.birthDate || condition.value === undefined) {
        result = false;
        break;
      }
      const age = calculateAge(profile.basicContext.birthDate);
      result = age !== null && age < (condition.value as number);
      break;
    }

    case 'answer_equals': {
      if (!condition.questionId || !previousAnswers) {
        result = false;
        break;
      }
      const answer = previousAnswers.find((a) => a.questionId === condition.questionId);
      if (!answer) {
        result = false;
        break;
      }
      result = answer.value === condition.value;
      break;
    }

    default:
      result = false;
  }

  // Apply negation if specified
  return condition.negate ? !result : result;
}

/**
 * Evaluate all conditions (AND logic - all must be true)
 */
export function evaluateAllConditions(
  conditions: ApplicabilityCondition[],
  profile: PartialFinancialProfile | null,
  previousAnswers?: QuestionAnswer[]
): boolean {
  // If no conditions, default to true
  if (conditions.length === 0) return true;

  return conditions.every((condition) =>
    evaluateCondition(condition, profile, previousAnswers)
  );
}

/**
 * Evaluate any conditions (OR logic - at least one must be true)
 */
export function evaluateAnyCondition(
  conditions: ApplicabilityCondition[],
  profile: PartialFinancialProfile | null,
  previousAnswers?: QuestionAnswer[]
): boolean {
  // If no conditions, default to true
  if (conditions.length === 0) return true;

  return conditions.some((condition) =>
    evaluateCondition(condition, profile, previousAnswers)
  );
}

// ============================================================
// DOMAIN RELEVANCE
// ============================================================

/**
 * Check if a domain is relevant for the given profile
 * Domains are always accessible but can be dimmed if not relevant
 */
export function isDomainRelevant(
  domain: SuggestionDomain,
  profile: PartialFinancialProfile | null
): boolean {
  const domainInfo = DOMAIN_INFO[domain];

  // If no relevance conditions, always relevant
  if (domainInfo.relevanceConditions.length === 0) return true;

  // At least one condition must be met
  return evaluateAnyCondition(domainInfo.relevanceConditions, profile);
}

/**
 * Get domain relevance status for all domains
 */
export function getDomainRelevanceMap(
  profile: PartialFinancialProfile | null
): Record<SuggestionDomain, boolean> {
  const domains = getAllDomains();
  const relevanceMap: Record<SuggestionDomain, boolean> = {} as Record<SuggestionDomain, boolean>;

  for (const domain of domains) {
    relevanceMap[domain.id] = isDomainRelevant(domain.id, profile);
  }

  return relevanceMap;
}

// ============================================================
// QUESTION FILTERING
// ============================================================

/**
 * Check if a question is applicable based on profile and previous answers
 */
export function isQuestionApplicable(
  question: GuidedQuestion,
  profile: PartialFinancialProfile | null,
  previousAnswers: QuestionAnswer[]
): boolean {
  // All conditions must be met
  return evaluateAllConditions(
    question.applicabilityConditions,
    profile,
    previousAnswers
  );
}

/**
 * Filter questions by applicability
 */
export function getApplicableQuestions(
  questions: GuidedQuestion[],
  profile: PartialFinancialProfile | null,
  previousAnswers: QuestionAnswer[] = []
): GuidedQuestion[] {
  return questions
    .filter((q) => isQuestionApplicable(q, profile, previousAnswers))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get the next unanswered applicable question
 */
export function getNextUnansweredQuestion(
  questions: GuidedQuestion[],
  profile: PartialFinancialProfile | null,
  previousAnswers: QuestionAnswer[]
): GuidedQuestion | null {
  const applicable = getApplicableQuestions(questions, profile, previousAnswers);
  const answeredIds = new Set(previousAnswers.map((a) => a.questionId));

  return applicable.find((q) => !answeredIds.has(q.id)) || null;
}

/**
 * Calculate completion progress for a domain
 */
export function calculateDomainProgress(
  questions: GuidedQuestion[],
  profile: PartialFinancialProfile | null,
  answers: QuestionAnswer[]
): { answered: number; total: number; percentage: number } {
  const applicable = getApplicableQuestions(questions, profile, answers);
  const answeredIds = new Set(answers.map((a) => a.questionId));
  const answered = applicable.filter((q) => answeredIds.has(q.id)).length;

  return {
    answered,
    total: applicable.length,
    percentage: applicable.length > 0 ? Math.round((answered / applicable.length) * 100) : 0,
  };
}

// ============================================================
// PROFILE SUMMARY FOR FILTERING
// ============================================================

/**
 * Get a summary of profile characteristics for filtering
 */
export function getProfileFilteringContext(
  profile: PartialFinancialProfile | null
): {
  isFederalEmployee: boolean;
  hasSpouse: boolean;
  hasDependents: boolean;
  isNearRetirement: boolean;
  hasPension: boolean;
  hasTSP: boolean;
  hasIRA: boolean;
  has401k: boolean;
  age: number | null;
} {
  return {
    isFederalEmployee: isFederalEmployee(profile),
    hasSpouse: hasSpouse(profile),
    hasDependents: hasDependents(profile),
    isNearRetirement: isNearRetirement(profile),
    hasPension: hasPension(profile),
    hasTSP: hasTSP(profile),
    hasIRA: hasIRA(profile),
    has401k: has401k(profile),
    age: profile?.basicContext?.birthDate
      ? calculateAge(profile.basicContext.birthDate)
      : null,
  };
}
