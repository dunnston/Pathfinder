/**
 * Annuities Domain Questions
 * Questions about guaranteed income products: MYGAs, FIAs, RILAs, and income annuities
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const ANNUITIES_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'ann_myga_evaluation',
    domain: 'ANNUITIES',
    advisorQuestion: 'Would a Multi-Year Guaranteed Annuity (MYGA) make sense for this client?',
    userQuestion: 'Have you evaluated whether a MYGA (Multi-Year Guaranteed Annuity) makes sense for you?',
    explanation:
      'MYGAs are like CDs from insurance companies, offering guaranteed fixed rates for 3-10 years. They can offer higher rates than bank CDs and have tax-deferred growth. Best for money you won\'t need for several years.',
    analysisHint:
      'Compare current MYGA rates to CD rates and Treasury yields. Consider if you have money earmarked for safety that won\'t be needed for 3-10 years. MYGAs have surrender charges if accessed early.',
    inputType: 'select',
    options: [
      { value: 'good_fit', label: 'Yes, MYGA seems like a good fit' },
      { value: 'not_right_now', label: 'Not right now, but maybe later' },
      { value: 'not_applicable', label: "Doesn't fit my situation" },
      { value: 'need_research', label: 'Need to research this more' },
      { value: 'not_familiar', label: "Not familiar with MYGAs" },
    ],
    applicabilityConditions: [
      { type: 'age_over', value: 45 },
    ],
    order: 1,
  },
  {
    id: 'ann_fia_evaluation',
    domain: 'ANNUITIES',
    advisorQuestion: 'Would a Fixed Indexed Annuity (FIA) make sense for this client?',
    userQuestion: 'Have you evaluated whether a Fixed Indexed Annuity (FIA) makes sense for you?',
    explanation:
      'FIAs offer potential for higher returns than fixed annuities by linking growth to a market index, while protecting principal from market losses. They have caps and participation rates that limit upside.',
    analysisHint:
      'FIAs are complex products. Consider: Do you want some market-linked growth with downside protection? Are you comfortable with surrender periods of 5-10 years? Consult with a fee-only advisor for unbiased evaluation.',
    inputType: 'select',
    options: [
      { value: 'good_fit', label: 'Yes, FIA seems like a good fit' },
      { value: 'not_right_now', label: 'Not right now, but maybe later' },
      { value: 'not_applicable', label: "Doesn't fit my situation" },
      { value: 'need_research', label: 'Need to research this more' },
      { value: 'not_familiar', label: "Not familiar with FIAs" },
    ],
    applicabilityConditions: [
      { type: 'age_over', value: 50 },
    ],
    order: 2,
  },
  {
    id: 'ann_rila_evaluation',
    domain: 'ANNUITIES',
    advisorQuestion: 'Would a Registered Index-Linked Annuity (RILA) make sense for this client?',
    userQuestion: 'Have you evaluated whether a RILA (buffer annuity) makes sense for you?',
    explanation:
      'RILAs (also called buffer annuities) offer market-linked returns with a "buffer" protecting against the first 10-20% of losses. Unlike FIAs, you can lose money, but you get higher upside potential.',
    analysisHint:
      'RILAs are for those who want more growth potential than FIAs but more protection than direct market exposure. Consider your risk tolerance and timeline. These have surrender charges of typically 5-6 years.',
    inputType: 'select',
    options: [
      { value: 'good_fit', label: 'Yes, RILA seems like a good fit' },
      { value: 'not_right_now', label: 'Not right now, but maybe later' },
      { value: 'not_applicable', label: "Doesn't fit my situation" },
      { value: 'need_research', label: 'Need to research this more' },
      { value: 'not_familiar', label: "Not familiar with RILAs" },
    ],
    applicabilityConditions: [
      { type: 'age_over', value: 50 },
    ],
    order: 3,
  },
  {
    id: 'ann_income_annuity',
    domain: 'ANNUITIES',
    advisorQuestion: 'Does the client need an income annuity for guaranteed lifetime income?',
    userQuestion: 'Would guaranteed lifetime income from an income annuity benefit your plan?',
    explanation:
      'Income annuities (SPIAs, DIAs) convert a lump sum into guaranteed monthly income for life, like creating your own pension. They protect against outliving your money but reduce flexibility and inheritance.',
    analysisHint:
      'Consider: What percentage of essential expenses are covered by Social Security and pensions? Would you sleep better with more guaranteed income? Income annuities work best when purchased at or after retirement age.',
    inputType: 'select',
    options: [
      { value: 'would_help', label: 'Yes, more guaranteed income would help' },
      { value: 'already_covered', label: 'No, essential expenses already covered' },
      { value: 'prefer_flexibility', label: 'Prefer flexibility over guarantees' },
      { value: 'too_early', label: "Too early to decide - I'm not near retirement" },
      { value: 'need_analysis', label: 'Need to analyze my income gap' },
    ],
    applicabilityConditions: [
      { type: 'near_retirement' },
    ],
    order: 4,
  },
];

/**
 * Get all annuities questions
 */
export function getAnnuitiesQuestions(): GuidedQuestion[] {
  return ANNUITIES_QUESTIONS;
}
