/**
 * Risk & Income Comfort Section - Questions and Options
 * Section 4 of the Discovery Wizard
 */

import type {
  StabilityPreference,
  DownturnResponse,
  ImportanceLevel,
  WillingnessLevel,
} from '@/types/riskComfort'
import type { ToleranceLevel } from '@/types/planningPreferences'

/** Question metadata for rendering */
export interface QuestionConfig {
  id: string
  label: string
  helpText?: string
  required: boolean
  /** Mode-aware labels: [consumer, advisor] */
  modeLabels?: [string, string]
}

/** Investment risk tolerance options (1-5 scale) */
export const INVESTMENT_RISK_OPTIONS: Array<{
  value: ToleranceLevel
  label: string
  description: string
}> = [
  {
    value: 1,
    label: 'Very Conservative',
    description: 'Preserve what I have, accept minimal growth',
  },
  {
    value: 2,
    label: 'Conservative',
    description: 'Prioritize stability with modest growth potential',
  },
  {
    value: 3,
    label: 'Moderate',
    description: 'Balance between stability and growth',
  },
  {
    value: 4,
    label: 'Growth-Oriented',
    description: 'Accept more volatility for better growth potential',
  },
  {
    value: 5,
    label: 'Aggressive',
    description: 'Maximize growth potential, comfortable with significant swings',
  },
]

/** Income stability preference options */
export const STABILITY_PREFERENCE_OPTIONS: Array<{
  value: StabilityPreference
  label: string
  description: string
}> = [
  {
    value: 'strong_stability',
    label: 'Strong Stability',
    description: 'Must have predictable, guaranteed income every month',
  },
  {
    value: 'prefer_stability',
    label: 'Prefer Stability',
    description: 'Prefer stable income, but some flexibility is acceptable',
  },
  {
    value: 'balanced',
    label: 'Balanced Approach',
    description: 'Comfortable with a mix of stable and variable income sources',
  },
  {
    value: 'prefer_growth',
    label: 'Prefer Growth',
    description: 'Willing to accept income variability for better long-term growth',
  },
  {
    value: 'strong_growth',
    label: 'Strong Growth',
    description: 'Maximize upside potential, can handle significant income variation',
  },
]

/** Market downturn response options */
export const DOWNTURN_RESPONSE_OPTIONS: Array<{
  value: DownturnResponse
  label: string
  description: string
}> = [
  {
    value: 'reduce_spending',
    label: 'Reduce Spending',
    description: 'Cut back on expenses until markets recover',
  },
  {
    value: 'delay_retirement',
    label: 'Delay Retirement',
    description: 'Work longer to give investments time to recover',
  },
  {
    value: 'work_part_time',
    label: 'Work Part-Time',
    description: 'Take on part-time work to supplement reduced portfolio income',
  },
  {
    value: 'stay_the_course',
    label: 'Stay the Course',
    description: 'Maintain current plan and ride out the downturn',
  },
  {
    value: 'unsure',
    label: 'Unsure',
    description: "I don't know how I would respond",
  },
]

/** Guaranteed income importance options */
export const IMPORTANCE_LEVEL_OPTIONS: Array<{
  value: ImportanceLevel
  label: string
  description: string
}> = [
  {
    value: 'critical',
    label: 'Critical',
    description: 'Must have guaranteed income covering all basic expenses',
  },
  {
    value: 'very_important',
    label: 'Very Important',
    description: 'Want guaranteed income for most regular expenses',
  },
  {
    value: 'somewhat_important',
    label: 'Somewhat Important',
    description: 'Nice to have some guaranteed income, but not essential',
  },
  {
    value: 'not_important',
    label: 'Not Important',
    description: 'Comfortable relying on portfolio withdrawals and flexibility',
  },
]

/** Spending adjustment willingness options */
export const WILLINGNESS_LEVEL_OPTIONS: Array<{
  value: WillingnessLevel
  label: string
  description: string
}> = [
  {
    value: 'very_willing',
    label: 'Very Willing',
    description: 'Happy to adjust spending based on market conditions',
  },
  {
    value: 'somewhat_willing',
    label: 'Somewhat Willing',
    description: 'Can adjust spending if needed, but prefer not to',
  },
  {
    value: 'reluctant',
    label: 'Reluctant',
    description: 'Would rather not adjust lifestyle, but could if necessary',
  },
  {
    value: 'unwilling',
    label: 'Unwilling',
    description: 'Need a fixed lifestyle budget regardless of market conditions',
  },
]

/** Scenario-based questions for risk assessment */
export const RISK_SCENARIOS: Array<{
  id: string
  scenario: string
  modeScenario?: [string, string]
  options: Array<{
    value: string
    label: string
    description: string
    riskScore: number // Higher = more risk tolerant
  }>
}> = [
  {
    id: 'market_drop_30',
    scenario: 'Your retirement portfolio drops 30% six months before your planned retirement date. What would you do?',
    modeScenario: [
      'Your retirement portfolio drops 30% six months before your planned retirement date. What would you do?',
      "The client's retirement portfolio drops 30% six months before their planned retirement date. What would they do?",
    ],
    options: [
      {
        value: 'delay_significantly',
        label: 'Delay retirement 2+ years',
        description: 'Wait for full recovery before retiring',
        riskScore: 1,
      },
      {
        value: 'delay_some',
        label: 'Delay retirement 6-12 months',
        description: 'Give some time for recovery',
        riskScore: 2,
      },
      {
        value: 'retire_reduced',
        label: 'Retire as planned with reduced spending',
        description: 'Adjust lifestyle to lower budget',
        riskScore: 3,
      },
      {
        value: 'retire_as_planned',
        label: 'Retire as planned, adjust later if needed',
        description: 'Trust the long-term plan',
        riskScore: 4,
      },
    ],
  },
  {
    id: 'extra_income_opportunity',
    scenario: 'You have an opportunity to receive additional income. Would you prefer:',
    modeScenario: [
      'You have an opportunity to receive additional income. Would you prefer:',
      'The client has an opportunity to receive additional income. Would they prefer:',
    ],
    options: [
      {
        value: 'guaranteed_lower',
        label: '$2,000/month guaranteed for life',
        description: 'Predictable income you can count on',
        riskScore: 1,
      },
      {
        value: 'variable_medium',
        label: '$2,500/month average with ±20% variation',
        description: 'Higher average but some fluctuation',
        riskScore: 2,
      },
      {
        value: 'variable_higher',
        label: '$3,000/month average with ±40% variation',
        description: 'Much higher average but significant fluctuation',
        riskScore: 3,
      },
      {
        value: 'growth_focused',
        label: 'Growth-focused with potential for $4,000+/month later',
        description: 'Lower now, potentially much higher later',
        riskScore: 4,
      },
    ],
  },
  {
    id: 'healthcare_emergency',
    scenario: 'An unexpected healthcare expense of $50,000 comes up. How prepared would you want to be?',
    modeScenario: [
      'An unexpected healthcare expense of $50,000 comes up. How prepared would you want to be?',
      'An unexpected healthcare expense of $50,000 comes up. How prepared would the client want to be?',
    ],
    options: [
      {
        value: 'fully_liquid',
        label: 'Have it fully available in cash reserves',
        description: 'Complete liquidity for emergencies',
        riskScore: 1,
      },
      {
        value: 'mostly_liquid',
        label: 'Have most in liquid savings, some in investments',
        description: 'Mostly accessible, some growth potential',
        riskScore: 2,
      },
      {
        value: 'access_investments',
        label: 'Keep invested but have access if needed',
        description: 'Accept potential timing risk for better returns',
        riskScore: 3,
      },
      {
        value: 'line_of_credit',
        label: 'Use line of credit or loans, keep investments working',
        description: 'Leverage for emergencies, maximize growth',
        riskScore: 4,
      },
    ],
  },
  {
    id: 'retirement_income_choice',
    scenario: 'For your primary retirement income strategy, which approach appeals most?',
    modeScenario: [
      'For your primary retirement income strategy, which approach appeals most?',
      'For the client\'s primary retirement income strategy, which approach appeals most?',
    ],
    options: [
      {
        value: 'all_guaranteed',
        label: 'Maximize guaranteed income sources',
        description: 'Social Security, pension, annuities cover all needs',
        riskScore: 1,
      },
      {
        value: 'mostly_guaranteed',
        label: 'Guaranteed income for essentials, investments for extras',
        description: 'Core expenses covered, flexibility for discretionary',
        riskScore: 2,
      },
      {
        value: 'balanced_sources',
        label: 'Balanced mix of guaranteed and investment income',
        description: 'Some stability with growth potential',
        riskScore: 3,
      },
      {
        value: 'primarily_investments',
        label: 'Primarily rely on investment portfolio withdrawals',
        description: 'Maximize flexibility and growth potential',
        riskScore: 4,
      },
    ],
  },
]

/** Flexibility vs Security scale labels */
export const FLEXIBILITY_SCALE_LABELS: Array<{
  value: number
  label: string
  shortLabel: string
}> = [
  { value: -5, label: 'Strongly prefer security', shortLabel: 'Security' },
  { value: -4, label: 'Prefer security', shortLabel: '' },
  { value: -3, label: 'Lean toward security', shortLabel: '' },
  { value: -2, label: 'Slight security preference', shortLabel: '' },
  { value: -1, label: 'Slight security lean', shortLabel: '' },
  { value: 0, label: 'Balanced', shortLabel: 'Balanced' },
  { value: 1, label: 'Slight flexibility lean', shortLabel: '' },
  { value: 2, label: 'Slight flexibility preference', shortLabel: '' },
  { value: 3, label: 'Lean toward flexibility', shortLabel: '' },
  { value: 4, label: 'Prefer flexibility', shortLabel: '' },
  { value: 5, label: 'Strongly prefer flexibility', shortLabel: 'Flexibility' },
]

/** Timing flexibility options for retirement */
export const TIMING_FLEXIBILITY_OPTIONS = {
  maxDelayYears: [
    { value: 0, label: 'Not willing to delay' },
    { value: 1, label: 'Up to 1 year' },
    { value: 2, label: 'Up to 2 years' },
    { value: 3, label: 'Up to 3 years' },
    { value: 5, label: 'Up to 5 years' },
    { value: 10, label: '5+ years if needed' },
  ],
}

/** Question configurations for the Risk & Income Comfort section */
export const RISK_COMFORT_QUESTIONS: Record<string, QuestionConfig> = {
  investmentRiskTolerance: {
    id: 'investmentRiskTolerance',
    label: 'Investment Risk Tolerance',
    modeLabels: [
      'How much investment risk are you comfortable with?',
      'How much investment risk is the client comfortable with?',
    ],
    helpText: 'This refers to the volatility you can accept in your investment portfolio.',
    required: true,
  },
  incomeStabilityPreference: {
    id: 'incomeStabilityPreference',
    label: 'Income Stability Preference',
    modeLabels: [
      'How important is having stable, predictable income in retirement?',
      'How important is stable, predictable income for the client in retirement?',
    ],
    helpText: 'Consider both your needs and comfort level with income variation.',
    required: true,
  },
  marketDownturnResponse: {
    id: 'marketDownturnResponse',
    label: 'Market Downturn Response',
    modeLabels: [
      'If markets dropped significantly near or during retirement, what would you most likely do?',
      'If markets dropped significantly near or during retirement, what would the client most likely do?',
    ],
    helpText: 'There is no wrong answer - this helps us understand your flexibility.',
    required: true,
  },
  guaranteedIncomeImportance: {
    id: 'guaranteedIncomeImportance',
    label: 'Guaranteed Income Importance',
    modeLabels: [
      'How important is having guaranteed income (like a pension or annuity) in retirement?',
      'How important is guaranteed income for the client in retirement?',
    ],
    helpText: 'Guaranteed income provides stability but typically offers less growth potential.',
    required: true,
  },
  flexibilityVsSecurityPreference: {
    id: 'flexibilityVsSecurityPreference',
    label: 'Flexibility vs. Security',
    modeLabels: [
      'On a scale from security to flexibility, where do you fall?',
      'On a scale from security to flexibility, where does the client fall?',
    ],
    helpText: 'Security means predictable, locked-in plans. Flexibility means adaptable, adjustable approaches.',
    required: true,
  },
  spendingAdjustmentWillingness: {
    id: 'spendingAdjustmentWillingness',
    label: 'Spending Adjustment Willingness',
    modeLabels: [
      'How willing are you to adjust your spending based on market conditions?',
      'How willing is the client to adjust spending based on market conditions?',
    ],
    helpText: 'This affects the types of withdrawal strategies that may work for you.',
    required: true,
  },
  retirementTimingFlexibility: {
    id: 'retirementTimingFlexibility',
    label: 'Retirement Timing Flexibility',
    modeLabels: [
      'How flexible is your retirement timing?',
      'How flexible is the client\'s retirement timing?',
    ],
    helpText: 'Flexibility in timing can provide more options for your overall strategy.',
    required: true,
  },
  riskScenarios: {
    id: 'riskScenarios',
    label: 'Risk Scenarios',
    modeLabels: [
      'Consider these scenarios to help us understand your risk tolerance:',
      'Consider these scenarios to understand the client\'s risk tolerance:',
    ],
    helpText: 'Choose the response that best matches how you would actually react.',
    required: true,
  },
}

/**
 * Get the mode-appropriate label for a question
 */
export function getQuestionLabel(questionId: string, isAdvisorMode: boolean): string {
  const question = RISK_COMFORT_QUESTIONS[questionId]
  if (!question) return questionId

  if (question.modeLabels) {
    return isAdvisorMode ? question.modeLabels[1] : question.modeLabels[0]
  }
  return question.label
}

/**
 * Get the mode-appropriate scenario text
 */
export function getScenarioText(scenarioId: string, isAdvisorMode: boolean): string {
  const scenario = RISK_SCENARIOS.find((s) => s.id === scenarioId)
  if (!scenario) return scenarioId

  if (scenario.modeScenario) {
    return isAdvisorMode ? scenario.modeScenario[1] : scenario.modeScenario[0]
  }
  return scenario.scenario
}

/**
 * Calculate an aggregate risk score from scenario responses
 * Returns a value from 1-4 representing overall risk tolerance
 */
export function calculateRiskScoreFromScenarios(
  responses: Record<string, string>
): number {
  const scores: number[] = []

  for (const scenario of RISK_SCENARIOS) {
    const response = responses[scenario.id]
    if (response) {
      const option = scenario.options.find((o) => o.value === response)
      if (option) {
        scores.push(option.riskScore)
      }
    }
  }

  if (scores.length === 0) return 2.5 // Default to moderate

  const average = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(average * 10) / 10
}
