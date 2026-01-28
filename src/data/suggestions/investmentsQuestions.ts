/**
 * Investments Domain Questions
 * Questions about portfolio alignment, diversification, costs, and fund selection
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const INVESTMENTS_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'inv_risk_alignment',
    domain: 'INVESTMENTS',
    advisorQuestion: "Is the portfolio aligned with the client's risk tolerance?",
    userQuestion: 'Is your portfolio aligned with your risk tolerance?',
    explanation:
      'Your portfolio allocation should match your stated risk tolerance. A mismatch could mean taking too much risk (causing anxiety during downturns) or too little risk (potentially limiting growth).',
    analysisHint:
      'Use a portfolio analysis tool like Morningstar X-Ray, your brokerage\'s portfolio analyzer, or review your current stock/bond allocation. Compare it to your risk profile from the discovery section.',
    inputType: 'select',
    options: [
      { value: 'aligned', label: 'Yes, well aligned' },
      { value: 'too_aggressive', label: 'No, too aggressive for my comfort' },
      { value: 'too_conservative', label: 'No, too conservative for my goals' },
      { value: 'unsure', label: 'Not sure - need to analyze' },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'inv_diversification',
    domain: 'INVESTMENTS',
    advisorQuestion: 'Is the portfolio properly diversified across asset classes?',
    userQuestion: 'Is your portfolio diversified across different asset classes?',
    explanation:
      'Diversification reduces risk by spreading investments across different asset types (stocks, bonds, international, real estate, etc.). Over-concentration in one area increases vulnerability.',
    analysisHint:
      'Review your holdings to check exposure to: US stocks, international stocks, bonds, real estate, and other asset classes. Look for any single position exceeding 10-15% of your total portfolio.',
    inputType: 'select',
    options: [
      { value: 'well_diversified', label: 'Well diversified across asset classes' },
      { value: 'somewhat', label: 'Some diversification but gaps exist' },
      { value: 'concentrated', label: 'Concentrated in few holdings or sectors' },
      { value: 'unsure', label: 'Not sure - need to analyze' },
    ],
    applicabilityConditions: [],
    order: 2,
  },
  {
    id: 'inv_overlap',
    domain: 'INVESTMENTS',
    advisorQuestion: 'Is there significant fund overlap in the portfolio?',
    userQuestion: 'Do your investment funds have significant overlap?',
    explanation:
      'Multiple funds may hold the same underlying stocks, creating unintended concentration. For example, owning a total market fund and an S&P 500 fund creates significant overlap.',
    analysisHint:
      'Use Morningstar\'s Fund Overlap tool or similar to check if your funds hold similar stocks. Look for funds with the same top holdings.',
    inputType: 'select',
    options: [
      { value: 'no_overlap', label: 'No significant overlap' },
      { value: 'some_overlap', label: 'Some overlap but manageable' },
      { value: 'significant_overlap', label: 'Yes, significant overlap exists' },
      { value: 'unsure', label: 'Not sure - need to check' },
    ],
    applicabilityConditions: [],
    order: 3,
  },
  {
    id: 'inv_fund_quality',
    domain: 'INVESTMENTS',
    advisorQuestion: 'Are the individual funds the best options available?',
    userQuestion: 'Are your funds the best options in their category?',
    explanation:
      'Within each asset class, some funds perform better or have lower costs than others. Regularly evaluating fund quality ensures you\'re getting good value.',
    analysisHint:
      'Compare each fund to alternatives in its category. Check Morningstar ratings, expense ratios, and long-term performance relative to benchmarks.',
    inputType: 'select',
    options: [
      { value: 'optimal', label: 'Yes, using best-in-class funds' },
      { value: 'adequate', label: 'Adequate but could be better' },
      { value: 'suboptimal', label: 'Some funds should be replaced' },
      { value: 'unsure', label: 'Not sure - need to research' },
    ],
    applicabilityConditions: [],
    order: 4,
  },
  {
    id: 'inv_cost_efficiency',
    domain: 'INVESTMENTS',
    advisorQuestion: 'Is the portfolio cost-efficient (expense ratios)?',
    userQuestion: 'Are your investment costs (expense ratios) competitive?',
    explanation:
      'High fees reduce returns over time. Even a 0.5% difference in expense ratios can cost tens of thousands over a career. Index funds typically charge 0.03-0.20%, while actively managed funds often charge 0.50-1.50%.',
    analysisHint:
      'Check the expense ratio of each fund. Calculate your weighted average expense ratio. Compare to low-cost alternatives (Vanguard, Fidelity, Schwab index funds typically charge 0.03-0.20%).',
    inputType: 'select',
    options: [
      { value: 'very_low', label: 'Very low costs (under 0.20% average)' },
      { value: 'reasonable', label: 'Reasonable costs (0.20-0.50% average)' },
      { value: 'high', label: 'High costs (over 0.50% average)' },
      { value: 'unsure', label: 'Not sure - need to calculate' },
    ],
    applicabilityConditions: [],
    order: 5,
  },
  {
    id: 'inv_excess_cash',
    domain: 'INVESTMENTS',
    advisorQuestion: 'Is there too much uninvested cash sitting idle?',
    userQuestion: 'Do you have excess cash sitting uninvested?',
    explanation:
      'Beyond your emergency fund (typically 3-6 months of expenses), excess cash may be losing purchasing power to inflation. However, some cash may be appropriate if you have near-term needs.',
    analysisHint:
      'Review cash positions across all accounts. Compare to your emergency fund target. Consider any planned major expenses in the next 1-2 years.',
    inputType: 'select',
    options: [
      { value: 'appropriate', label: 'Cash levels are appropriate' },
      { value: 'too_much', label: 'More cash than needed' },
      { value: 'too_little', label: 'Less cash than needed for emergencies' },
      { value: 'unsure', label: 'Not sure' },
    ],
    applicabilityConditions: [],
    order: 6,
  },
];

/**
 * Get all investments questions
 */
export function getInvestmentsQuestions(): GuidedQuestion[] {
  return INVESTMENTS_QUESTIONS;
}
