/**
 * Taxes Domain Questions
 * Questions about Roth conversions, tax efficiency, and capital gains management
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const TAXES_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'tax_roth_conversion',
    domain: 'TAXES',
    advisorQuestion: 'Would Roth conversions benefit this client?',
    userQuestion: 'Have you evaluated whether Roth conversions make sense for you?',
    explanation:
      'Roth conversions move money from Traditional (tax-deferred) accounts to Roth (tax-free) accounts. You pay taxes now to avoid them later. This can be valuable if you expect higher tax rates in retirement or want to reduce Required Minimum Distributions.',
    analysisHint:
      'Consider: Are you in a lower tax bracket now than you expect in retirement? Do you have large Traditional IRA/401k balances that will create big RMDs? Years between retirement and age 73 are often ideal for conversions. A CPA or advisor can model scenarios.',
    inputType: 'select',
    options: [
      { value: 'doing_conversions', label: 'Already doing Roth conversions' },
      { value: 'makes_sense', label: 'Yes, conversions would likely benefit me' },
      { value: 'not_beneficial', label: 'No, not beneficial in my situation' },
      { value: 'need_analysis', label: 'Need professional analysis' },
      { value: 'not_sure', label: 'Not familiar with Roth conversions' },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'tax_overpaying',
    domain: 'TAXES',
    advisorQuestion: 'Is the client potentially overpaying on taxes?',
    userQuestion: 'Are you potentially overpaying on taxes?',
    explanation:
      'Many people overpay taxes due to: not maximizing deductions, poor timing of income/deductions, not using tax-advantaged accounts, or not having a tax plan. A proactive approach can save thousands annually.',
    analysisHint:
      'Review your tax return: Are you maximizing retirement contributions? Using HSA if eligible? Timing deductions optimally? Consider working with a tax professional for a proactive review, especially if your situation is complex.',
    inputType: 'select',
    options: [
      { value: 'optimized', label: 'My tax situation is well-optimized' },
      { value: 'likely_overpaying', label: 'I think I may be overpaying' },
      { value: 'underpaying', label: 'I may be underpaying (penalties possible)' },
      { value: 'need_review', label: 'Need a professional review' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    applicabilityConditions: [],
    order: 2,
  },
  {
    id: 'tax_capital_gains',
    domain: 'TAXES',
    advisorQuestion: 'Are there capital gains management opportunities?',
    userQuestion: 'Do you have significant unrealized capital gains to manage?',
    explanation:
      'Large unrealized gains create future tax liability. Strategies include: tax-loss harvesting, donating appreciated shares, timing sales across years, or using the 0% capital gains bracket in lower-income years.',
    analysisHint:
      'Review your taxable brokerage accounts for unrealized gains. Consider: Are any positions highly appreciated? Could you harvest losses to offset gains? In retirement, you might access the 0% capital gains bracket if income is low enough.',
    inputType: 'select',
    options: [
      { value: 'well_managed', label: 'I actively manage capital gains' },
      { value: 'significant_gains', label: 'Yes, significant gains to address' },
      { value: 'minimal_gains', label: 'Minimal taxable gains' },
      { value: 'need_strategy', label: 'Need to develop a strategy' },
      { value: 'not_applicable', label: 'No taxable investment accounts' },
    ],
    applicabilityConditions: [],
    order: 3,
  },
  {
    id: 'tax_estate_planning',
    domain: 'TAXES',
    advisorQuestion: 'Are there estate tax or inheritance planning considerations?',
    userQuestion: 'Have you considered the tax implications for your heirs?',
    explanation:
      'How you structure accounts and pass assets affects the taxes your heirs pay. Roth accounts pass tax-free, Traditional accounts are taxable to heirs over 10 years, and taxable accounts get a step-up in basis at death.',
    analysisHint:
      'Consider the tax impact on heirs: Traditional IRAs must be distributed (and taxed) within 10 years. Roth IRAs are tax-free to heirs. Taxable accounts get a step-up in basis. This may affect which accounts you draw from vs. leave.',
    inputType: 'select',
    options: [
      { value: 'planned', label: 'Yes, I\'ve planned for tax-efficient inheritance' },
      { value: 'aware', label: 'I\'m aware but haven\'t optimized' },
      { value: 'not_considered', label: 'Haven\'t considered this yet' },
      { value: 'no_heirs', label: 'Not a concern for my situation' },
    ],
    applicabilityConditions: [],
    order: 4,
  },
];

/**
 * Get all taxes questions
 */
export function getTaxesQuestions(): GuidedQuestion[] {
  return TAXES_QUESTIONS;
}
