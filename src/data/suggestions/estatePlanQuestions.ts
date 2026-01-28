/**
 * Estate Plan Domain Questions
 * Questions about wills, trusts, powers of attorney, and beneficiary designations
 */

import type { GuidedQuestion } from '@/types/suggestions';

export const ESTATE_PLAN_QUESTIONS: GuidedQuestion[] = [
  {
    id: 'est_will',
    domain: 'ESTATE_PLAN',
    advisorQuestion: 'Does the client have a current will?',
    userQuestion: 'Do you have a current will?',
    explanation:
      'A will specifies how your assets are distributed, names guardians for minor children, and appoints an executor. Without one, state law determines distribution, which may not match your wishes.',
    analysisHint:
      'If you have a will, when was it last updated? Major life changes (marriage, divorce, children, moves, significant asset changes) should trigger a review. If you don\'t have one, this is a priority, especially with minor children.',
    inputType: 'select',
    options: [
      { value: 'current', label: 'Yes, current and reviewed recently' },
      { value: 'outdated', label: 'Yes, but needs updating' },
      { value: 'none', label: 'No will in place' },
    ],
    applicabilityConditions: [],
    order: 1,
  },
  {
    id: 'est_trust',
    domain: 'ESTATE_PLAN',
    advisorQuestion: 'Would a trust benefit this client\'s situation?',
    userQuestion: 'Have you evaluated whether you need a trust?',
    explanation:
      'Trusts can avoid probate, provide for minor children, protect assets from creditors, and manage distributions. Revocable living trusts are common; irrevocable trusts offer additional protection and tax benefits.',
    analysisHint:
      'Consider a trust if: you want to avoid probate, have minor children, have a blended family, own property in multiple states, want to control how heirs receive assets, or have significant wealth. An estate attorney can advise.',
    inputType: 'select',
    options: [
      { value: 'have_trust', label: 'Yes, I have an appropriate trust' },
      { value: 'need_trust', label: 'I likely need a trust' },
      { value: 'not_needed', label: 'Trust not needed for my situation' },
      { value: 'need_evaluation', label: 'Need professional evaluation' },
      { value: 'not_sure', label: 'Not sure what trusts are for' },
    ],
    applicabilityConditions: [],
    order: 2,
  },
  {
    id: 'est_poa_healthcare',
    domain: 'ESTATE_PLAN',
    advisorQuestion: 'Does the client have healthcare directives and power of attorney?',
    userQuestion: 'Do you have a healthcare power of attorney and living will/advance directive?',
    explanation:
      'A healthcare POA designates someone to make medical decisions if you cannot. A living will specifies your wishes for end-of-life care. Without these, family may face difficult decisions or court proceedings.',
    analysisHint:
      'These documents are essential for everyone over 18. Have you designated someone you trust? Have you discussed your wishes with them? Are the documents accessible in an emergency?',
    inputType: 'select',
    options: [
      { value: 'complete', label: 'Yes, both in place and communicated' },
      { value: 'partial', label: 'Have some documents but incomplete' },
      { value: 'none', label: 'No healthcare directives in place' },
    ],
    applicabilityConditions: [],
    order: 3,
  },
  {
    id: 'est_financial_poa',
    domain: 'ESTATE_PLAN',
    advisorQuestion: 'Does the client have a durable financial power of attorney?',
    userQuestion: 'Do you have a durable financial power of attorney?',
    explanation:
      'A durable financial POA allows someone to manage your finances if you become incapacitated. "Durable" means it remains in effect if you become mentally incompetent. Without one, a court must appoint a guardian.',
    analysisHint:
      'Consider: Who would pay your bills and manage investments if you were in a coma? Is your POA "durable" (continues if incapacitated) and "springing" (activates only upon incapacity) or immediate? Is it up to date?',
    inputType: 'select',
    options: [
      { value: 'in_place', label: 'Yes, durable financial POA in place' },
      { value: 'needs_update', label: 'Have one but may need updating' },
      { value: 'none', label: 'No financial POA in place' },
    ],
    applicabilityConditions: [],
    order: 4,
  },
  {
    id: 'est_beneficiaries',
    domain: 'ESTATE_PLAN',
    advisorQuestion: 'Are all beneficiary designations current and coordinated?',
    userQuestion: 'Are your beneficiary designations up to date on all accounts?',
    explanation:
      'Beneficiary designations on retirement accounts, life insurance, and transfer-on-death accounts override your will. Outdated beneficiaries (ex-spouses, deceased relatives) can cause assets to go to unintended people.',
    analysisHint:
      'Review beneficiaries on: 401k/TSP, IRAs, life insurance, annuities, bank accounts with POD, and brokerage accounts with TOD. Are primary and contingent beneficiaries listed? Do they match your current wishes?',
    inputType: 'select',
    options: [
      { value: 'current', label: 'Yes, reviewed and current' },
      { value: 'probably_outdated', label: 'Probably need to review' },
      { value: 'not_reviewed', label: 'Haven\'t reviewed in years' },
      { value: 'not_sure', label: 'Not sure what\'s on file' },
    ],
    applicabilityConditions: [],
    order: 5,
  },
];

/**
 * Get all estate plan questions
 */
export function getEstatePlanQuestions(): GuidedQuestion[] {
  return ESTATE_PLAN_QUESTIONS;
}
