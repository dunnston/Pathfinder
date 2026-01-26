/**
 * Planning Preferences Section - Questions and Options
 * Section 3 of the Discovery Wizard
 */

import type {
  ComfortLevel,
  InvolvementLevel,
  DecisionStyle,
  ValueType,
  ToleranceLevel,
} from '@/types'
import type { EducationPreference } from '@/types/common'

/** Question metadata for rendering */
export interface QuestionConfig {
  id: string
  label: string
  helpText?: string
  required: boolean
  /** Mode-aware labels: [consumer, advisor] */
  modeLabels?: [string, string]
}

/** Complexity tolerance options (1-5 scale) */
export const COMPLEXITY_TOLERANCE_OPTIONS: Array<{
  value: ToleranceLevel
  label: string
  description: string
}> = [
  {
    value: 1,
    label: 'Keep it simple',
    description: 'I prefer straightforward options with minimal complexity',
  },
  {
    value: 2,
    label: 'Mostly simple',
    description: 'I can handle some complexity if needed',
  },
  {
    value: 3,
    label: 'Balanced',
    description: "I'm comfortable with moderate complexity",
  },
  {
    value: 4,
    label: 'Detail-oriented',
    description: 'I appreciate thorough analysis and options',
  },
  {
    value: 5,
    label: 'Full complexity',
    description: 'Give me all the details and sophisticated strategies',
  },
]

/** Comfort level with financial products */
export const COMFORT_LEVEL_OPTIONS: Array<{
  value: ComfortLevel
  label: string
  description: string
}> = [
  {
    value: 'very_low',
    label: 'Very Low',
    description: 'I find financial products confusing and intimidating',
  },
  {
    value: 'low',
    label: 'Low',
    description: 'I understand basics but feel uncertain about complex products',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'I have reasonable understanding of common financial products',
  },
  {
    value: 'high',
    label: 'High',
    description: 'I understand most financial products and their tradeoffs',
  },
  {
    value: 'very_high',
    label: 'Very High',
    description: 'I have deep knowledge of financial products and markets',
  },
]

/** Advisor involvement level options */
export const INVOLVEMENT_LEVEL_OPTIONS: Array<{
  value: InvolvementLevel
  label: string
  description: string
}> = [
  {
    value: 'diy',
    label: 'DIY',
    description: 'I want to manage things myself with occasional check-ins',
  },
  {
    value: 'guidance',
    label: 'Guidance',
    description: 'I want guidance on major decisions but handle day-to-day',
  },
  {
    value: 'collaborative',
    label: 'Collaborative',
    description: 'I want to work closely together on most decisions',
  },
  {
    value: 'delegated',
    label: 'Delegated',
    description: 'I want my advisor to handle most things and keep me informed',
  },
]

/** Decision-making style options */
export const DECISION_STYLE_OPTIONS: Array<{
  value: DecisionStyle
  label: string
  description: string
}> = [
  {
    value: 'analytical',
    label: 'Analytical',
    description: 'I want to see all the data, numbers, and projections',
  },
  {
    value: 'intuitive',
    label: 'Intuitive',
    description: 'I tend to go with my gut feeling after understanding the basics',
  },
  {
    value: 'consultative',
    label: 'Consultative',
    description: 'I like to discuss with family, friends, or advisors before deciding',
  },
  {
    value: 'deliberate',
    label: 'Deliberate',
    description: 'I take my time and carefully consider all angles before deciding',
  },
]

/** Education preference options */
export const EDUCATION_PREFERENCE_OPTIONS: Array<{
  value: EducationPreference
  label: string
  description: string
}> = [
  {
    value: 'minimal',
    label: 'Just the Bottom Line',
    description: 'Tell me what to do and spare me the details',
  },
  {
    value: 'summary',
    label: 'Key Highlights',
    description: 'Give me the main points and rationale',
  },
  {
    value: 'detailed',
    label: 'Full Explanation',
    description: 'Explain the reasoning so I understand the "why"',
  },
  {
    value: 'comprehensive',
    label: 'Deep Dive',
    description: 'I want to understand everything in depth',
  },
]

/** Core values for ranking */
export const VALUE_OPTIONS: Array<{
  value: ValueType
  label: string
  description: string
}> = [
  {
    value: 'family_security',
    label: 'Family Security',
    description: 'Ensuring my loved ones are protected and provided for',
  },
  {
    value: 'health_peace_of_mind',
    label: 'Health & Peace of Mind',
    description: 'Having good health care and freedom from financial worry',
  },
  {
    value: 'freedom_of_time',
    label: 'Freedom of Time',
    description: 'Having control over how I spend my time',
  },
  {
    value: 'enjoyment_experiences',
    label: 'Enjoyment & Experiences',
    description: 'Travel, hobbies, and memorable experiences',
  },
  {
    value: 'legacy_giving',
    label: 'Legacy & Giving',
    description: 'Leaving something behind or giving to causes I care about',
  },
  {
    value: 'financial_independence',
    label: 'Financial Independence',
    description: 'Never having to depend on others financially',
  },
  {
    value: 'helping_others',
    label: 'Helping Others',
    description: 'Supporting family, friends, and community',
  },
  {
    value: 'personal_growth',
    label: 'Personal Growth',
    description: 'Continued learning, new challenges, and self-improvement',
  },
]

/** Tradeoff pairs for preference exercise */
export const TRADEOFF_PAIRS: Array<{
  id: string
  optionA: string
  optionB: string
  descriptionA: string
  descriptionB: string
}> = [
  {
    id: 'security_vs_growth',
    optionA: 'Guaranteed income',
    optionB: 'Growth potential',
    descriptionA: 'Lower but guaranteed returns that provide stable income',
    descriptionB: 'Higher potential returns with more variability',
  },
  {
    id: 'now_vs_later',
    optionA: 'Enjoy now',
    optionB: 'Save for later',
    descriptionA: 'Spend more now while you can enjoy it',
    descriptionB: 'Save more now for a better future',
  },
  {
    id: 'simple_vs_optimized',
    optionA: 'Simple strategy',
    optionB: 'Optimized strategy',
    descriptionA: 'Easier to understand and manage',
    descriptionB: 'More complex but potentially better results',
  },
  {
    id: 'flexibility_vs_structure',
    optionA: 'Flexibility',
    optionB: 'Structure',
    descriptionA: 'Keep options open, adjust as needed',
    descriptionB: 'Clear plan with defined milestones',
  },
  {
    id: 'legacy_vs_lifestyle',
    optionA: 'Leave more behind',
    optionB: 'Better lifestyle now',
    descriptionA: 'Prioritize inheritance and charitable giving',
    descriptionB: 'Prioritize your own comfort and experiences',
  },
  {
    id: 'active_vs_passive',
    optionA: 'Active involvement',
    optionB: 'Hands-off approach',
    descriptionA: 'Be involved in financial decisions regularly',
    descriptionB: 'Set it and check in occasionally',
  },
]

/** Question configurations for the Planning Preferences section */
export const PLANNING_PREFERENCES_QUESTIONS: Record<string, QuestionConfig> = {
  complexityTolerance: {
    id: 'complexityTolerance',
    label: 'Complexity Tolerance',
    modeLabels: [
      'How comfortable are you with complex financial strategies?',
      "How comfortable is the client with complex financial strategies?",
    ],
    helpText: 'This helps us tailor recommendations to your comfort level.',
    required: true,
  },
  financialProductComfort: {
    id: 'financialProductComfort',
    label: 'Financial Product Comfort',
    modeLabels: [
      'How would you rate your comfort level with financial products?',
      "How would you rate the client's comfort level with financial products?",
    ],
    helpText: 'Stocks, bonds, annuities, insurance products, etc.',
    required: true,
  },
  advisorInvolvementDesire: {
    id: 'advisorInvolvementDesire',
    label: 'Advisor Involvement',
    modeLabels: [
      'How much involvement do you want from your advisor?',
      'How much involvement does the client want from their advisor?',
    ],
    helpText: 'There is no wrong answer - we adapt to your preferences.',
    required: true,
  },
  decisionMakingStyle: {
    id: 'decisionMakingStyle',
    label: 'Decision-Making Style',
    modeLabels: [
      'How do you typically make important financial decisions?',
      'How does the client typically make important financial decisions?',
    ],
    helpText: 'Understanding your style helps us present information effectively.',
    required: true,
  },
  educationPreference: {
    id: 'educationPreference',
    label: 'Education Preference',
    modeLabels: [
      'How much detail do you want in explanations?',
      'How much detail does the client want in explanations?',
    ],
    helpText: 'We can adjust how we communicate recommendations.',
    required: true,
  },
  valuesPriorities: {
    id: 'valuesPriorities',
    label: 'Values & Priorities',
    modeLabels: [
      'Rank these values from most to least important to you:',
      "Rank the client's values from most to least important:",
    ],
    helpText: 'Drag to reorder based on importance.',
    required: true,
  },
  tradeoffPreferences: {
    id: 'tradeoffPreferences',
    label: 'Tradeoff Preferences',
    modeLabels: [
      'For each pair, indicate which option you lean toward:',
      'For each pair, indicate which option the client leans toward:',
    ],
    helpText: 'These help us understand your priorities when trade-offs are necessary.',
    required: true,
  },
}

/**
 * Get the mode-appropriate label for a question
 */
export function getQuestionLabel(questionId: string, isAdvisorMode: boolean): string {
  const question = PLANNING_PREFERENCES_QUESTIONS[questionId]
  if (!question) return questionId

  if (question.modeLabels) {
    return isAdvisorMode ? question.modeLabels[1] : question.modeLabels[0]
  }
  return question.label
}
