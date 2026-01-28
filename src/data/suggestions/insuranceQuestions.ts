/**
 * Insurance Domain Questions
 * Questions about life, health, disability, and long-term care coverage
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const INSURANCE_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'ins_health_coverage',
    domain: 'INSURANCE',
    advisorQuestion: 'Is the client\'s health insurance coverage adequate and cost-effective?',
    userQuestion: 'Is your health insurance coverage adequate and affordable?',
    explanation:
      'Health insurance is critical for protecting against catastrophic medical costs. Coverage should balance premiums with out-of-pocket maximums. Those approaching 65 need to plan for Medicare.',
    analysisHint:
      'Review: Is your out-of-pocket maximum manageable if you had a major illness? Are you overpaying for coverage you don\'t need? If nearing 65, have you researched Medicare options? If retiring before 65, what\'s your bridge coverage plan?',
    inputType: 'select',
    options: [
      { value: 'adequate_affordable', label: 'Adequate coverage at good value' },
      { value: 'adequate_expensive', label: 'Adequate but overpaying' },
      { value: 'inadequate', label: 'Coverage may be insufficient' },
      { value: 'need_review', label: 'Need to review coverage' },
      { value: 'gap_before_medicare', label: 'Concerned about pre-Medicare gap' },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'ins_life_insurance',
    domain: 'INSURANCE',
    advisorQuestion: 'Does the client have appropriate life insurance coverage?',
    userQuestion: 'Do you have the right amount of life insurance?',
    explanation:
      'Life insurance protects dependents from financial hardship if you die. Need typically decreases as you build wealth and dependents become independent. Term insurance is usually most cost-effective.',
    analysisHint:
      'Calculate: How much would your family need if you died? (Typically 10-12x income, or enough to cover debts + income replacement until kids are independent.) Compare to current coverage. As you near retirement with no dependents, need may decrease.',
    inputType: 'select',
    options: [
      { value: 'adequate', label: 'Have appropriate coverage' },
      { value: 'underinsured', label: 'May need more coverage' },
      { value: 'overinsured', label: 'Probably have too much' },
      { value: 'no_need', label: 'No dependents, don\'t need coverage' },
      { value: 'need_analysis', label: 'Need to analyze my needs' },
    ],
    applicabilityConditions: [],
    order: 2,
  },
  {
    id: 'ins_disability',
    domain: 'INSURANCE',
    advisorQuestion: 'Does the client have adequate disability insurance?',
    userQuestion: 'Do you have disability insurance that would replace your income?',
    explanation:
      'Disability insurance replaces income if you can\'t work due to illness or injury. During working years, the risk of disability is higher than death. Many people are underinsured or rely only on limited employer coverage.',
    analysisHint:
      'Review: Does your employer provide disability coverage? What percentage of income does it replace? Is it "own occupation" (can\'t do your job) or "any occupation" (can\'t do any job)? Consider supplemental coverage if employer coverage is limited.',
    inputType: 'select',
    options: [
      { value: 'adequate', label: 'Have adequate disability coverage' },
      { value: 'employer_only', label: 'Only have employer coverage (may be limited)' },
      { value: 'none', label: 'No disability coverage' },
      { value: 'near_retirement', label: 'Near retirement, less concerned' },
      { value: 'need_review', label: 'Need to review my coverage' },
    ],
    applicabilityConditions: [
      { type: 'age_under', value: 60 },
    ],
    order: 3,
  },
  {
    id: 'ins_ltc',
    domain: 'INSURANCE',
    advisorQuestion: 'Has the client evaluated long-term care insurance needs?',
    userQuestion: 'Have you considered how you would pay for long-term care if needed?',
    explanation:
      'Long-term care (nursing home, assisted living, home care) costs $50,000-$100,000+ annually and isn\'t covered by Medicare. Options include: traditional LTC insurance, hybrid life/LTC policies, self-insuring, or Medicaid planning.',
    analysisHint:
      'Consider: Could you afford $100k+/year for care? Do you have family who could provide care? LTC insurance is most affordable if purchased in your 50s. Hybrid policies (life + LTC) are increasingly popular. What\'s your plan?',
    inputType: 'select',
    options: [
      { value: 'have_ltc', label: 'Have LTC or hybrid policy' },
      { value: 'self_insure', label: 'Plan to self-insure with savings' },
      { value: 'need_coverage', label: 'Should evaluate LTC coverage' },
      { value: 'too_young', label: 'Not thinking about this yet' },
      { value: 'not_sure', label: 'Haven\'t considered this' },
    ],
    applicabilityConditions: [
      { type: 'age_over', value: 45 },
    ],
    order: 4,
  },
  {
    id: 'ins_pension_max',
    domain: 'INSURANCE',
    advisorQuestion: 'If the client has a pension, should they evaluate pension maximization?',
    userQuestion: 'If you have a pension, have you evaluated "pension max" vs. survivor benefits?',
    explanation:
      'Pension max strategy: Take the higher single-life pension and buy life insurance to protect your spouse, instead of the reduced joint-and-survivor option. This can provide more income if you\'re healthy and insurable.',
    analysisHint:
      'Compare: Single-life pension amount vs. joint-survivor amount. Get life insurance quotes to cover your spouse if you choose single-life. If you\'re healthy and insurable, pension max may provide more total income. Consult an advisor.',
    inputType: 'select',
    options: [
      { value: 'evaluated', label: 'Yes, I\'ve evaluated this' },
      { value: 'not_evaluated', label: 'No, haven\'t considered this' },
      { value: 'no_pension', label: 'Don\'t have a pension' },
      { value: 'not_applicable', label: 'Not applicable (single, no survivor needs)' },
    ],
    applicabilityConditions: [
      { type: 'has_pension' },
      { type: 'has_spouse' },
    ],
    order: 5,
  },
];

/**
 * Get all insurance questions
 */
export function getInsuranceQuestions(): GuidedQuestion[] {
  return INSURANCE_QUESTIONS;
}
