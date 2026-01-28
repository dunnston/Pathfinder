/**
 * Employee Benefits Domain Questions
 * Questions about employer benefits, FEGLI, TSP match, and pension optimization
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const EMPLOYEE_BENEFITS_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'ben_401k_match',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Is the client getting the full employer 401k/TSP match?',
    userQuestion: 'Are you contributing enough to get the full employer match?',
    explanation:
      'Employer matching is free money. Not getting the full match is leaving compensation on the table. Federal employees get an automatic 1% plus up to 4% matching in TSP. Private sector matches vary.',
    analysisHint:
      'Check your employer\'s match formula. For TSP: contribute at least 5% to get the full 5% match (1% automatic + 4% matching). For private 401k, check your plan details. This is typically the highest-return investment available.',
    inputType: 'select',
    options: [
      { value: 'getting_full', label: 'Yes, getting full match' },
      { value: 'not_full', label: 'No, not getting full match' },
      { value: 'no_match', label: 'Employer doesn\'t offer a match' },
      { value: 'not_sure', label: 'Not sure what the match is' },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'ben_fegli',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Has the client evaluated FEGLI vs. private life insurance?',
    userQuestion: 'Have you compared your FEGLI coverage to private life insurance options?',
    explanation:
      'FEGLI (Federal Employees Group Life Insurance) is convenient but becomes expensive as you age, especially Option B. Private term insurance is often much cheaper, especially if you\'re healthy. FEGLI may not be portable.',
    analysisHint:
      'Get quotes for private term insurance and compare to your FEGLI costs, especially Option B. FEGLI Option B costs increase every 5 years after age 35. Consider: Can you get better rates privately? Will you keep coverage into retirement?',
    inputType: 'select',
    options: [
      { value: 'compared', label: 'Yes, I\'ve compared options' },
      { value: 'fegli_optimal', label: 'Evaluated - FEGLI is best for me' },
      { value: 'private_better', label: 'Evaluated - private is better' },
      { value: 'not_compared', label: 'Haven\'t compared to private options' },
      { value: 'no_fegli', label: 'Don\'t have FEGLI' },
    ],
    applicabilityConditions: [
      { type: 'federal_employee' },
    ],
    order: 2,
  },
  {
    id: 'ben_fegli_portability',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Does the client understand FEGLI portability limitations?',
    userQuestion: 'Do you know what happens to your FEGLI coverage when you retire or leave?',
    explanation:
      'FEGLI Basic can continue into retirement but Option B coverage reduces at age 65 unless you pay the full premium (which is very expensive). Planning before retirement is essential if you need life insurance coverage.',
    analysisHint:
      'Review your FEGLI options at retirement. Basic continues with no cost after retirement if you\'ve had it 5+ years. Option B becomes expensive or reduces significantly. Consider locking in private coverage before retiring.',
    inputType: 'select',
    options: [
      { value: 'understand', label: 'Yes, I understand the options' },
      { value: 'not_clear', label: 'Not completely clear on this' },
      { value: 'not_applicable', label: 'Not planning to keep coverage' },
    ],
    applicabilityConditions: [
      { type: 'federal_employee' },
      { type: 'near_retirement' },
    ],
    order: 3,
  },
  {
    id: 'ben_survivor_benefits',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Has the client evaluated FERS survivor benefit options?',
    userQuestion: 'Have you decided on your FERS survivor benefit election?',
    explanation:
      'FERS offers survivor annuity options: Full survivor (50% of your annuity continues to spouse, costs 10% of annuity), partial (25%, costs 5%), or none. This decision is made at retirement and is generally irrevocable.',
    analysisHint:
      'Compare: The cost of survivor benefits vs. buying life insurance to protect your spouse. Consider your spouse\'s other income sources, health, and age. Run the numbers before your retirement date.',
    inputType: 'select',
    options: [
      { value: 'decided', label: 'Yes, I\'ve made this decision' },
      { value: 'leaning', label: 'Leaning toward an option but not final' },
      { value: 'not_evaluated', label: 'Haven\'t evaluated this yet' },
      { value: 'not_applicable', label: 'Not applicable (single or not FERS)' },
    ],
    applicabilityConditions: [
      { type: 'federal_employee' },
      { type: 'has_spouse' },
      { type: 'near_retirement' },
    ],
    order: 4,
  },
  {
    id: 'ben_pension_timing',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Has the client optimized their pension/retirement timing?',
    userQuestion: 'Have you analyzed the optimal timing for your retirement date?',
    explanation:
      'For federal employees, retirement timing affects: FERS pension amount, Social Security coordination, FEHB continuation, and the FERS supplement (if retiring before 62). Small timing differences can have significant impacts.',
    analysisHint:
      'Consider: Your MRA (Minimum Retirement Age), years of service for pension calculation, whether you\'ll get the FERS supplement, and the best time of year to retire (end of leave year to maximize leave payout). Use a federal retirement calculator.',
    inputType: 'select',
    options: [
      { value: 'analyzed', label: 'Yes, I\'ve run the numbers' },
      { value: 'general_idea', label: 'I have a general timeline' },
      { value: 'not_analyzed', label: 'Haven\'t done detailed analysis' },
      { value: 'too_far', label: 'Retirement is too far away to analyze' },
    ],
    applicabilityConditions: [
      { type: 'federal_employee' },
    ],
    order: 5,
  },
  {
    id: 'ben_tsp_allocation',
    domain: 'EMPLOYEE_BENEFITS',
    advisorQuestion: 'Is the client\'s TSP allocation appropriate?',
    userQuestion: 'Is your TSP allocation aligned with your investment strategy?',
    explanation:
      'TSP offers excellent low-cost funds (C, S, I, F, G, and Lifecycle funds). Your allocation should match your overall investment strategy and risk tolerance. Many people are too conservative in TSP (heavy G fund).',
    analysisHint:
      'Review your TSP allocation. Is it intentional or where you left it years ago? Does it fit your overall portfolio? Many people are too heavy in G fund. Consider L funds if you want automatic rebalancing.',
    inputType: 'select',
    options: [
      { value: 'intentional', label: 'Yes, intentionally allocated' },
      { value: 'too_conservative', label: 'May be too conservative' },
      { value: 'too_aggressive', label: 'May be too aggressive' },
      { value: 'not_reviewed', label: 'Haven\'t reviewed in a while' },
      { value: 'no_tsp', label: 'Don\'t have TSP' },
    ],
    applicabilityConditions: [
      { type: 'has_tsp' },
    ],
    order: 6,
  },
];

/**
 * Get all employee benefits questions
 */
export function getEmployeeBenefitsQuestions(): GuidedQuestion[] {
  return EMPLOYEE_BENEFITS_QUESTIONS;
}
