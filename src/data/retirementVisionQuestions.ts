/**
 * Retirement Vision Section - Questions and Options
 * Section 2 of the Discovery Wizard
 */

import type { ConcernType, Flexibility } from '@/types'

/** Question metadata for rendering */
export interface QuestionConfig {
  id: string
  label: string
  helpText?: string
  required: boolean
  /** Mode-aware labels: [consumer, advisor] */
  modeLabels?: [string, string]
}

/** Flexibility options with labels */
export const FLEXIBILITY_OPTIONS: Array<{ value: Flexibility; label: string; description: string }> = [
  {
    value: 'very_flexible',
    label: 'Very Flexible',
    description: 'Could adjust retirement date by 3+ years if needed',
  },
  {
    value: 'somewhat_flexible',
    label: 'Somewhat Flexible',
    description: 'Could adjust by 1-2 years if beneficial',
  },
  {
    value: 'fixed',
    label: 'Fixed Date',
    description: 'Have a specific retirement date in mind',
  },
]

/** Concern types with labels and descriptions */
export const CONCERN_OPTIONS: Array<{ value: ConcernType; label: string; description: string }> = [
  {
    value: 'outliving_savings',
    label: 'Outliving Savings',
    description: 'Running out of money in retirement',
  },
  {
    value: 'healthcare_costs',
    label: 'Healthcare Costs',
    description: 'Rising medical and prescription expenses',
  },
  {
    value: 'healthcare_coverage',
    label: 'Healthcare Coverage',
    description: 'Maintaining health insurance before Medicare',
  },
  {
    value: 'spouse_security',
    label: 'Spouse/Family Security',
    description: 'Ensuring loved ones are provided for',
  },
  {
    value: 'market_volatility',
    label: 'Market Volatility',
    description: 'Investment losses affecting retirement income',
  },
  {
    value: 'inflation',
    label: 'Inflation',
    description: 'Purchasing power decreasing over time',
  },
  {
    value: 'boredom_identity',
    label: 'Purpose & Identity',
    description: 'Finding meaning and fulfillment without work',
  },
  {
    value: 'family_obligations',
    label: 'Family Obligations',
    description: 'Supporting children, parents, or grandchildren',
  },
  {
    value: 'unexpected_expenses',
    label: 'Unexpected Expenses',
    description: 'Major repairs, emergencies, or unplanned costs',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other concerns not listed above',
  },
]

/** Default lifestyle priorities for ranking */
export const DEFAULT_LIFESTYLE_PRIORITIES: string[] = [
  'Travel and exploration',
  'Time with family and friends',
  'Health and wellness',
  'Hobbies and personal interests',
  'Volunteering and giving back',
  'Continued learning and growth',
  'Relaxation and leisure',
  'Financial security and peace of mind',
]

/** Vision prompts to help users articulate their retirement vision */
export const VISION_PROMPTS: string[] = [
  'Where do you see yourself living?',
  'What does a typical day look like?',
  'Who are you spending time with?',
  'What activities bring you joy?',
  'How are you contributing to others?',
]

/** Common must-have outcomes suggestions */
export const MUST_HAVE_SUGGESTIONS: string[] = [
  'Maintain current standard of living',
  'Affordable healthcare coverage',
  'Debt-free retirement',
  'Leave inheritance for family',
  'Stay in current home',
  'Have emergency fund',
  'Spouse is financially secure if I pass first',
]

/** Common nice-to-have outcomes suggestions */
export const NICE_TO_HAVE_SUGGESTIONS: string[] = [
  'Travel internationally',
  'Buy vacation property',
  'Help grandchildren with education',
  'Start a small business or hobby income',
  'Upgrade home or relocate',
  'Support charitable causes',
  'Leave larger inheritance',
]

/** Question configurations for the Retirement Vision section */
export const RETIREMENT_VISION_QUESTIONS: Record<string, QuestionConfig> = {
  targetRetirementAge: {
    id: 'targetRetirementAge',
    label: 'Target Retirement Age',
    modeLabels: ['At what age would you ideally like to retire?', 'At what age does the client want to retire?'],
    helpText: 'This helps us understand your retirement timeline.',
    required: true,
  },
  targetRetirementYear: {
    id: 'targetRetirementYear',
    label: 'Target Retirement Year',
    modeLabels: ['What year are you targeting for retirement?', 'What year is the client targeting?'],
    helpText: 'Optional - we can calculate this from your age.',
    required: false,
  },
  retirementFlexibility: {
    id: 'retirementFlexibility',
    label: 'Retirement Date Flexibility',
    modeLabels: [
      'How flexible is your retirement timeline?',
      "How flexible is the client's retirement timeline?",
    ],
    helpText: 'Flexibility can open up more planning strategies.',
    required: true,
  },
  visionDescription: {
    id: 'visionDescription',
    label: 'Retirement Vision',
    modeLabels: [
      'Describe your ideal retirement...',
      "Describe the client's ideal retirement...",
    ],
    helpText: 'Paint a picture of what a fulfilling retirement looks like.',
    required: false,
  },
  topConcerns: {
    id: 'topConcerns',
    label: 'Top Concerns',
    modeLabels: [
      'What concerns you most about retirement?',
      'What are the client\'s top retirement concerns?',
    ],
    helpText: 'Select and rank your most pressing concerns.',
    required: true,
  },
  mustHaveOutcomes: {
    id: 'mustHaveOutcomes',
    label: 'Must-Have Outcomes',
    modeLabels: [
      'What are your non-negotiable retirement outcomes?',
      "What are the client's must-have outcomes?",
    ],
    helpText: 'These are the things you absolutely need in retirement.',
    required: true,
  },
  niceToHaveOutcomes: {
    id: 'niceToHaveOutcomes',
    label: 'Nice-to-Have Outcomes',
    modeLabels: [
      'What would be nice to have but not essential?',
      "What are the client's nice-to-have outcomes?",
    ],
    helpText: "Things you'd love to have if finances allow.",
    required: false,
  },
  lifestylePriorities: {
    id: 'lifestylePriorities',
    label: 'Lifestyle Priorities',
    modeLabels: [
      'Rank these lifestyle priorities in order of importance to you:',
      "Rank the client's lifestyle priorities:",
    ],
    helpText: 'Drag to reorder from most to least important.',
    required: true,
  },
  financialPurposeStatement: {
    id: 'financialPurposeStatement',
    label: 'Financial Purpose Statement',
    modeLabels: [
      'In one sentence, what is your money for in retirement?',
      "In one sentence, what is the client's money for in retirement?",
    ],
    helpText: 'This statement can guide future financial decisions.',
    required: false,
  },
}

/**
 * Get the mode-appropriate label for a question
 */
export function getQuestionLabel(questionId: string, isAdvisorMode: boolean): string {
  const question = RETIREMENT_VISION_QUESTIONS[questionId]
  if (!question) return questionId

  if (question.modeLabels) {
    return isAdvisorMode ? question.modeLabels[1] : question.modeLabels[0]
  }
  return question.label
}
