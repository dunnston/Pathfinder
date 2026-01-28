/**
 * Savings Domain Questions
 * Questions about retirement savings targets, account types, and emergency funds
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const SAVINGS_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'sav_retirement_target',
    domain: 'SAVINGS',
    advisorQuestion: 'How much does the client need to have saved to meet their retirement goal?',
    userQuestion: 'Do you know how much you need saved to retire comfortably?',
    explanation:
      'A retirement savings target helps you track progress and adjust your savings rate. This number depends on your expected expenses, other income sources, and how long you expect to be retired.',
    analysisHint:
      'Use a retirement calculator (Fidelity, Vanguard, or T. Rowe Price offer good ones) or consult with a financial planner. Input your expected expenses, Social Security, pensions, and desired retirement age.',
    inputType: 'select',
    options: [
      { value: 'know_target', label: 'Yes, I have a specific target number' },
      { value: 'rough_idea', label: 'I have a rough idea' },
      { value: 'no_target', label: "No, I haven't calculated this" },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'sav_expense_estimate',
    domain: 'SAVINGS',
    advisorQuestion: 'What are the client\'s total expected retirement expenses?',
    userQuestion: 'Do you know your expected annual expenses in retirement?',
    explanation:
      'Understanding your retirement expenses is foundational to planning. Many people spend 70-80% of pre-retirement income, but this varies based on lifestyle, healthcare needs, and debt status.',
    analysisHint:
      'Review your current spending and adjust for retirement changes. Consider: no more work-related costs, potentially higher healthcare costs, travel plans, and whether your mortgage will be paid off.',
    inputType: 'select',
    options: [
      { value: 'detailed', label: 'Yes, I have a detailed budget' },
      { value: 'estimate', label: 'I have a rough estimate' },
      { value: 'unknown', label: "I haven't figured this out yet" },
    ],
    applicabilityConditions: [],
    order: 2,
  },
  {
    id: 'sav_guaranteed_coverage',
    domain: 'SAVINGS',
    advisorQuestion: 'How much of total expenses are covered by guaranteed income?',
    userQuestion: 'What percentage of your retirement expenses will be covered by guaranteed income?',
    explanation:
      'Guaranteed income (Social Security, pensions, annuities) that covers essential expenses provides security. The "gap" between guaranteed income and total expenses is what your savings must cover.',
    analysisHint:
      'Add up expected Social Security, pension income, and any annuities. Compare to your essential expenses (housing, food, healthcare, utilities). What percentage is covered?',
    inputType: 'select',
    options: [
      { value: 'fully_covered', label: 'All essential expenses covered (100%+)' },
      { value: 'mostly_covered', label: 'Most essentials covered (75-99%)' },
      { value: 'partially_covered', label: 'Some covered (50-74%)' },
      { value: 'minimal_coverage', label: 'Minimal coverage (under 50%)' },
      { value: 'unsure', label: 'Not sure - need to calculate' },
    ],
    applicabilityConditions: [],
    order: 3,
  },
  {
    id: 'sav_current_savings',
    domain: 'SAVINGS',
    advisorQuestion: 'Is the client on track with current savings?',
    userQuestion: 'Are you on track to meet your retirement savings goal?',
    explanation:
      'Comparing your current savings to where you "should be" at your age helps identify if you need to adjust your savings rate or retirement timeline.',
    analysisHint:
      'Compare your current total retirement savings to your target. A common rule of thumb: save 1x salary by 30, 3x by 40, 6x by 50, 8x by 60. Or use a retirement calculator to check your specific situation.',
    inputType: 'select',
    options: [
      { value: 'ahead', label: 'Ahead of schedule' },
      { value: 'on_track', label: 'On track' },
      { value: 'behind', label: 'Behind but catchable' },
      { value: 'significantly_behind', label: 'Significantly behind' },
      { value: 'unsure', label: 'Not sure' },
    ],
    applicabilityConditions: [],
    order: 4,
  },
  {
    id: 'sav_savings_rate',
    domain: 'SAVINGS',
    advisorQuestion: 'Is the client saving enough annually?',
    userQuestion: 'Are you saving enough each year toward retirement?',
    explanation:
      'Most experts recommend saving 15-20% of income for retirement (including employer match). If you started late or are behind, you may need to save more.',
    analysisHint:
      'Calculate your total annual retirement savings (401k/TSP contributions + IRA + employer match + other). Divide by your gross income. Is it 15%+ or do you have a catch-up plan?',
    inputType: 'select',
    options: [
      { value: 'exceeds_target', label: 'Saving more than 20% of income' },
      { value: 'meets_target', label: 'Saving 15-20% of income' },
      { value: 'below_target', label: 'Saving 10-15% of income' },
      { value: 'minimal', label: 'Saving less than 10% of income' },
      { value: 'unsure', label: 'Not sure' },
    ],
    applicabilityConditions: [],
    order: 5,
  },
  {
    id: 'sav_account_types',
    domain: 'SAVINGS',
    advisorQuestion: 'Is the client using the right types of accounts (tax-free, taxable, tax-deferred)?',
    userQuestion: 'Are you saving in the right types of accounts?',
    explanation:
      'The mix of Roth (tax-free), Traditional (tax-deferred), and taxable accounts affects your tax flexibility in retirement. Having money in all three "buckets" provides options.',
    analysisHint:
      'Review your savings by account type. Do you have: (1) Tax-deferred (Traditional 401k, Traditional IRA, TSP), (2) Tax-free (Roth 401k, Roth IRA, Roth TSP), and (3) Taxable accounts? Consider your current vs. expected future tax bracket.',
    inputType: 'select',
    options: [
      { value: 'balanced', label: 'Good mix across account types' },
      { value: 'mostly_deferred', label: 'Mostly tax-deferred accounts' },
      { value: 'mostly_roth', label: 'Mostly Roth accounts' },
      { value: 'need_diversify', label: 'Need more tax diversification' },
      { value: 'unsure', label: 'Not sure which is best for me' },
    ],
    applicabilityConditions: [],
    order: 6,
  },
  {
    id: 'sav_emergency_fund',
    domain: 'SAVINGS',
    advisorQuestion: 'Does the client have an adequate emergency fund?',
    userQuestion: 'Do you have an adequate emergency fund?',
    explanation:
      'An emergency fund (typically 3-6 months of expenses in a savings account) protects you from needing to sell investments or take on debt during unexpected events.',
    analysisHint:
      'Calculate your monthly essential expenses. Multiply by 3-6 months. Compare to your liquid savings (not retirement accounts). If you have a stable job and good insurance, 3 months may be enough. If self-employed or variable income, aim for 6+ months.',
    inputType: 'select',
    options: [
      { value: 'exceeds', label: '6+ months of expenses saved' },
      { value: 'adequate', label: '3-6 months of expenses saved' },
      { value: 'building', label: 'Less than 3 months, but building it' },
      { value: 'insufficient', label: 'Insufficient emergency fund' },
    ],
    applicabilityConditions: [],
    order: 7,
  },
];

/**
 * Get all savings questions
 */
export function getSavingsQuestions(): GuidedQuestion[] {
  return SAVINGS_QUESTIONS;
}
