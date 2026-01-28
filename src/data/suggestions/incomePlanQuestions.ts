/**
 * Income Plan Domain Questions
 * Questions about retirement income strategy, bucket approach, and withdrawal planning
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const INCOME_PLAN_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'inc_bucket_strategy',
    domain: 'INCOME_PLAN',
    advisorQuestion: 'Would a bucket strategy help this client manage retirement income?',
    userQuestion: 'Have you considered using a bucket strategy for retirement income?',
    explanation:
      'A bucket strategy divides retirement assets into time-based segments: Bucket 1 (1-2 years in cash/short-term), Bucket 2 (3-7 years in bonds), Bucket 3 (8+ years in stocks). This provides peace of mind during market downturns while maintaining growth potential.',
    analysisHint:
      'Consider: How would you feel during a 30% market drop if all your money was invested? A bucket strategy helps by knowing years 1-2 of income are safe in cash regardless of markets. Calculate 2 years of expenses for Bucket 1.',
    inputType: 'select',
    options: [
      { value: 'using', label: 'Already using a bucket approach' },
      { value: 'interested', label: 'Interested - this sounds helpful' },
      { value: 'not_needed', label: 'Prefer a different approach' },
      { value: 'too_early', label: 'Not in retirement yet - will consider later' },
      { value: 'need_learn', label: 'Need to learn more about this' },
    ],
    applicabilityConditions: [
      { type: 'near_retirement' },
    ],
    order: 1,
  },
  {
    id: 'inc_withdrawal_strategy',
    domain: 'INCOME_PLAN',
    advisorQuestion: 'Does the client have a clear withdrawal strategy and income policy statement?',
    userQuestion: 'Do you have a written plan for how you\'ll draw income in retirement?',
    explanation:
      'An Income Policy Statement (IPS) documents your withdrawal strategy: which accounts to draw from, in what order, and how to adjust for market conditions. It provides a roadmap and reduces emotional decision-making.',
    analysisHint:
      'Consider: Which accounts will you draw from first? (Usually taxable, then tax-deferred, then Roth - but this varies.) What\'s your withdrawal rate? How will you adjust if markets drop? Having this written down helps during stressful times.',
    inputType: 'select',
    options: [
      { value: 'documented', label: 'Yes, I have a written plan' },
      { value: 'informal', label: 'I have a general idea but nothing written' },
      { value: 'no_plan', label: "No, I haven't created a withdrawal strategy" },
      { value: 'too_early', label: 'Not in retirement yet' },
    ],
    applicabilityConditions: [
      { type: 'near_retirement' },
    ],
    order: 2,
  },
  {
    id: 'inc_social_security_timing',
    domain: 'INCOME_PLAN',
    advisorQuestion: 'Has the client optimized their Social Security claiming strategy?',
    userQuestion: 'Have you analyzed when to claim Social Security benefits?',
    explanation:
      'Social Security benefits increase about 8% per year for each year you delay from 62 to 70. For many, delaying is optimal, but it depends on health, other income, and spousal benefits. This is often the most valuable income decision.',
    analysisHint:
      'Use the SSA website to get your estimated benefits at different ages. Consider: your health and longevity expectations, spouse\'s benefits, and whether you have other income to bridge the gap if you delay.',
    inputType: 'select',
    options: [
      { value: 'optimized', label: 'Yes, I\'ve analyzed and have a plan' },
      { value: 'basic_understanding', label: 'I understand the basics but haven\'t analyzed deeply' },
      { value: 'not_analyzed', label: "No, I haven't analyzed this yet" },
      { value: 'already_claiming', label: 'Already claiming benefits' },
      { value: 'too_early', label: 'Too far from eligibility to decide' },
    ],
    applicabilityConditions: [
      { type: 'age_over', value: 55 },
    ],
    order: 3,
  },
];

/**
 * Get all income plan questions
 */
export function getIncomePlanQuestions(): GuidedQuestion[] {
  return INCOME_PLAN_QUESTIONS;
}
