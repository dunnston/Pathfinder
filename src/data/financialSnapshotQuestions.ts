/**
 * Financial Snapshot Section - Questions and Options
 * Section 5 of the Discovery Wizard
 * Collects light financial data using ranges, not exact amounts
 */

import type {
  IncomeSourceType,
  RetirementIncomeType,
  AccountType,
  BalanceRange,
  DebtType,
  AssetType,
  ReserveLocation,
  LifeInsuranceType,
} from '@/types/financialSnapshot'

/** Question metadata for rendering */
export interface QuestionConfig {
  id: string
  label: string
  helpText?: string
  required: boolean
  /** Mode-aware labels: [consumer, advisor] */
  modeLabels?: [string, string]
}

/** Current income source type options */
export const INCOME_SOURCE_OPTIONS: Array<{
  value: IncomeSourceType
  label: string
  description: string
}> = [
  {
    value: 'salary',
    label: 'Salary/Wages',
    description: 'Regular employment income',
  },
  {
    value: 'self_employment',
    label: 'Self-Employment',
    description: 'Business or freelance income',
  },
  {
    value: 'rental',
    label: 'Rental Income',
    description: 'Income from rental properties',
  },
  {
    value: 'pension',
    label: 'Pension',
    description: 'Current pension payments',
  },
  {
    value: 'social_security',
    label: 'Social Security',
    description: 'Social Security benefits',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Dividends, interest, or other income',
  },
]

/** Expected retirement income type options */
export const RETIREMENT_INCOME_OPTIONS: Array<{
  value: RetirementIncomeType
  label: string
  description: string
  isGuaranteed: boolean
}> = [
  {
    value: 'fers_pension',
    label: 'FERS Pension',
    description: 'Federal Employees Retirement System pension',
    isGuaranteed: true,
  },
  {
    value: 'csrs_pension',
    label: 'CSRS Pension',
    description: 'Civil Service Retirement System pension',
    isGuaranteed: true,
  },
  {
    value: 'social_security',
    label: 'Social Security',
    description: 'Expected Social Security benefits',
    isGuaranteed: true,
  },
  {
    value: 'tsp_withdrawals',
    label: 'TSP Withdrawals',
    description: 'Thrift Savings Plan distributions',
    isGuaranteed: false,
  },
  {
    value: 'other_pension',
    label: 'Other Pension',
    description: 'Private employer pension',
    isGuaranteed: true,
  },
  {
    value: 'rental_income',
    label: 'Rental Income',
    description: 'Expected income from rental properties',
    isGuaranteed: false,
  },
  {
    value: 'part_time_work',
    label: 'Part-Time Work',
    description: 'Expected income from part-time employment',
    isGuaranteed: false,
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Annuities, royalties, or other income',
    isGuaranteed: false,
  },
]

/** Investment account type options */
export const ACCOUNT_TYPE_OPTIONS: Array<{
  value: AccountType
  label: string
  description: string
  taxType: 'pre-tax' | 'post-tax' | 'taxable'
}> = [
  {
    value: 'tsp_traditional',
    label: 'TSP (Traditional)',
    description: 'Thrift Savings Plan - Traditional contributions',
    taxType: 'pre-tax',
  },
  {
    value: 'tsp_roth',
    label: 'TSP (Roth)',
    description: 'Thrift Savings Plan - Roth contributions',
    taxType: 'post-tax',
  },
  {
    value: 'traditional_ira',
    label: 'Traditional IRA',
    description: 'Individual Retirement Account - Traditional',
    taxType: 'pre-tax',
  },
  {
    value: 'roth_ira',
    label: 'Roth IRA',
    description: 'Individual Retirement Account - Roth',
    taxType: 'post-tax',
  },
  {
    value: '401k',
    label: '401(k)',
    description: 'Employer-sponsored retirement plan',
    taxType: 'pre-tax',
  },
  {
    value: 'taxable_brokerage',
    label: 'Taxable Brokerage',
    description: 'Non-retirement investment account',
    taxType: 'taxable',
  },
  {
    value: 'savings',
    label: 'Savings Account',
    description: 'Bank savings or money market',
    taxType: 'taxable',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other investment accounts',
    taxType: 'taxable',
  },
]

/** Balance range options */
export const BALANCE_RANGE_OPTIONS: Array<{
  value: BalanceRange
  label: string
  midpoint: number
}> = [
  { value: 'under_10k', label: 'Under $10,000', midpoint: 5000 },
  { value: '10k_50k', label: '$10,000 - $50,000', midpoint: 30000 },
  { value: '50k_100k', label: '$50,000 - $100,000', midpoint: 75000 },
  { value: '100k_250k', label: '$100,000 - $250,000', midpoint: 175000 },
  { value: '250k_500k', label: '$250,000 - $500,000', midpoint: 375000 },
  { value: '500k_1m', label: '$500,000 - $1 million', midpoint: 750000 },
  { value: '1m_2m', label: '$1 million - $2 million', midpoint: 1500000 },
  { value: 'over_2m', label: 'Over $2 million', midpoint: 3000000 },
]

/** Debt type options */
export const DEBT_TYPE_OPTIONS: Array<{
  value: DebtType
  label: string
  description: string
}> = [
  {
    value: 'mortgage',
    label: 'Mortgage',
    description: 'Home loan(s)',
  },
  {
    value: 'car',
    label: 'Auto Loan',
    description: 'Vehicle financing',
  },
  {
    value: 'student_loan',
    label: 'Student Loans',
    description: 'Education debt',
  },
  {
    value: 'credit_card',
    label: 'Credit Cards',
    description: 'Credit card balances',
  },
  {
    value: 'other',
    label: 'Other Debt',
    description: 'Personal loans, medical debt, etc.',
  },
]

/** Asset type options */
export const ASSET_TYPE_OPTIONS: Array<{
  value: AssetType
  label: string
  description: string
}> = [
  {
    value: 'primary_home',
    label: 'Primary Home',
    description: 'Your main residence',
  },
  {
    value: 'rental_property',
    label: 'Rental Property',
    description: 'Investment real estate',
  },
  {
    value: 'business',
    label: 'Business Interest',
    description: 'Ownership in a business',
  },
  {
    value: 'vehicle',
    label: 'Vehicles',
    description: 'Cars, boats, RVs',
  },
  {
    value: 'other',
    label: 'Other Assets',
    description: 'Collectibles, jewelry, etc.',
  },
]

/** Emergency reserve location options */
export const RESERVE_LOCATION_OPTIONS: Array<{
  value: ReserveLocation
  label: string
  description: string
}> = [
  {
    value: 'savings',
    label: 'Savings Account',
    description: 'Bank savings account',
  },
  {
    value: 'money_market',
    label: 'Money Market',
    description: 'Money market account or fund',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'Combination of accounts',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'CDs, bonds, or other low-risk investments',
  },
]

/** Months of expenses options for emergency reserves */
export const MONTHS_OF_EXPENSES_OPTIONS = [
  { value: 0, label: 'Less than 1 month' },
  { value: 1, label: '1-2 months' },
  { value: 3, label: '3-4 months' },
  { value: 6, label: '5-6 months' },
  { value: 9, label: '7-9 months' },
  { value: 12, label: '10-12 months' },
  { value: 18, label: 'More than 1 year' },
]

/** Life insurance type options */
export const LIFE_INSURANCE_OPTIONS: Array<{
  value: LifeInsuranceType
  label: string
  description: string
}> = [
  {
    value: 'fegli',
    label: 'FEGLI',
    description: 'Federal Employees Group Life Insurance',
  },
  {
    value: 'private_term',
    label: 'Private Term',
    description: 'Private term life insurance',
  },
  {
    value: 'private_whole',
    label: 'Private Whole/Universal',
    description: 'Permanent life insurance policy',
  },
  {
    value: 'mixed',
    label: 'Multiple Policies',
    description: 'Combination of different policies',
  },
]

/** Question configurations for the Financial Snapshot section */
export const FINANCIAL_SNAPSHOT_QUESTIONS: Record<string, QuestionConfig> = {
  incomeSourcesCurrent: {
    id: 'incomeSourcesCurrent',
    label: 'Current Income Sources',
    modeLabels: [
      'What are your current sources of income?',
      "What are the client's current sources of income?",
    ],
    helpText: 'Include all regular income sources. Approximate amounts are fine.',
    required: true,
  },
  incomeSourcesRetirement: {
    id: 'incomeSourcesRetirement',
    label: 'Expected Retirement Income',
    modeLabels: [
      'What income sources do you expect in retirement?',
      'What income sources does the client expect in retirement?',
    ],
    helpText: 'Include pensions, Social Security, and other expected income. Estimates are okay.',
    required: true,
  },
  investmentAccounts: {
    id: 'investmentAccounts',
    label: 'Investment Accounts',
    modeLabels: [
      'What investment accounts do you have?',
      'What investment accounts does the client have?',
    ],
    helpText: 'Select balance ranges - we don\'t need exact amounts.',
    required: true,
  },
  debts: {
    id: 'debts',
    label: 'Debts & Liabilities',
    modeLabels: [
      'What debts or liabilities do you have?',
      'What debts or liabilities does the client have?',
    ],
    helpText: 'Include mortgages, loans, and other debts.',
    required: false,
  },
  majorAssets: {
    id: 'majorAssets',
    label: 'Major Assets',
    modeLabels: [
      'What major assets do you own?',
      'What major assets does the client own?',
    ],
    helpText: 'Include property, vehicles, and other significant assets.',
    required: false,
  },
  emergencyReserves: {
    id: 'emergencyReserves',
    label: 'Emergency Reserves',
    modeLabels: [
      'How much do you have in emergency reserves?',
      'How much does the client have in emergency reserves?',
    ],
    helpText: 'Approximate months of expenses you could cover with liquid savings.',
    required: true,
  },
  insuranceCoverage: {
    id: 'insuranceCoverage',
    label: 'Insurance Coverage',
    modeLabels: [
      'What insurance coverage do you have?',
      'What insurance coverage does the client have?',
    ],
    helpText: 'Include life, long-term care, and disability insurance.',
    required: true,
  },
}

/**
 * Get the mode-appropriate label for a question
 */
export function getQuestionLabel(questionId: string, isAdvisorMode: boolean): string {
  const question = FINANCIAL_SNAPSHOT_QUESTIONS[questionId]
  if (!question) return questionId

  if (question.modeLabels) {
    return isAdvisorMode ? question.modeLabels[1] : question.modeLabels[0]
  }
  return question.label
}

/**
 * Calculate approximate total from balance ranges
 * Returns a midpoint estimate for display purposes
 */
export function estimateTotalFromRanges(
  items: Array<{ approximateBalance?: BalanceRange }>
): number {
  let total = 0
  for (const item of items) {
    if (item.approximateBalance) {
      const range = BALANCE_RANGE_OPTIONS.find((r) => r.value === item.approximateBalance)
      if (range) {
        total += range.midpoint
      }
    }
  }
  return total
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get a label for the balance range
 */
export function getBalanceRangeLabel(range: BalanceRange): string {
  const option = BALANCE_RANGE_OPTIONS.find((r) => r.value === range)
  return option?.label || range
}
