/**
 * Zod Validation Schemas
 * Centralized validation for all discovery sections
 */

import { z } from 'zod'

// ============================================================
// String Length Limits (Security)
// ============================================================

/** Standard string length limits to prevent DoS and storage abuse */
export const STRING_LIMITS = {
  NAME: 100,
  SHORT_TEXT: 200,
  MEDIUM_TEXT: 1000,
  LONG_TEXT: 5000,
  EMAIL: 254,
  PHONE: 20,
  NOTES: 10000,
} as const

// ============================================================
// Common Validators
// ============================================================

/** Date for birth year (reasonable range) - handles both Date objects and strings */
const birthDate = z.preprocess(
  (val) => {
    // Handle Date objects, strings, and null/undefined
    if (val instanceof Date) return val
    if (typeof val === 'string' && val) return new Date(val)
    return val
  },
  z.date({ message: 'Please enter a valid birth date' })
).refine(
  (date) => {
    const year = date.getFullYear()
    const currentYear = new Date().getFullYear()
    return year >= 1920 && year <= currentYear
  },
  { message: 'Please enter a valid birth date' }
)

// ============================================================
// Section 1: Basic Context Schemas
// ============================================================

/** Marital status enum */
export const maritalStatusSchema = z.enum([
  'single',
  'married',
  'divorced',
  'widowed',
  'domestic_partnership',
])

/** Employment status enum */
export const employmentStatusSchema = z.enum([
  'employed_full_time',
  'employed_part_time',
  'self_employed',
  'unemployed',
  'retired',
  'homemaker',
  'disabled',
])

/** Retirement system enum */
export const retirementSystemSchema = z.enum([
  'FERS',
  'CSRS',
  'FERS_RAE',
  'FERS_FRAE',
])

/** Spouse information schema */
export const spouseInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(STRING_LIMITS.NAME, `Maximum ${STRING_LIMITS.NAME} characters`),
  birthDate: birthDate,
  employmentStatus: employmentStatusSchema,
  hasPension: z.boolean().default(false),
  pensionDetails: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Federal employee information schema */
export const federalEmployeeInfoSchema = z.object({
  agency: z.string().min(1, 'Agency is required').max(STRING_LIMITS.SHORT_TEXT, `Maximum ${STRING_LIMITS.SHORT_TEXT} characters`),
  yearsOfService: z.number()
    .min(0, 'Years of service cannot be negative')
    .max(50, 'Please check years of service'),
  retirementSystem: retirementSystemSchema,
  payGrade: z.string().min(1, 'Pay grade is required').max(20, 'Maximum 20 characters'),
  step: z.number().min(1).max(10),
  isLawEnforcement: z.boolean().default(false),
  hasMilitaryService: z.boolean().default(false),
  militaryServiceYears: z.number().min(0).max(40).optional(),
})

/** Dependent schema */
export const dependentSchema = z.object({
  relationship: z.string().min(1, 'Relationship is required').max(STRING_LIMITS.SHORT_TEXT, `Maximum ${STRING_LIMITS.SHORT_TEXT} characters`),
  birthDate: birthDate,
  financiallyDependent: z.boolean().default(true),
})

/** Complete Basic Context schema */
export const basicContextSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(STRING_LIMITS.NAME, `Maximum ${STRING_LIMITS.NAME} characters`),
  lastName: z.string().min(1, 'Last name is required').max(STRING_LIMITS.NAME, `Maximum ${STRING_LIMITS.NAME} characters`),
  birthDate: birthDate,
  maritalStatus: maritalStatusSchema,
  spouse: spouseInfoSchema.optional(),
  dependents: z.array(dependentSchema).max(20, 'Maximum 20 dependents').default([]),
  occupation: z.string().min(1, 'Occupation is required').max(STRING_LIMITS.SHORT_TEXT, `Maximum ${STRING_LIMITS.SHORT_TEXT} characters`),
  federalEmployee: federalEmployeeInfoSchema.nullable(),
  hobbiesInterests: z.array(z.string().max(STRING_LIMITS.SHORT_TEXT)).max(20, 'Maximum 20 items').optional(),
  communityInvolvement: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
}).refine(
  (data) => {
    // If married or domestic partnership, spouse should be provided
    if (data.maritalStatus === 'married' || data.maritalStatus === 'domestic_partnership') {
      return data.spouse !== undefined
    }
    return true
  },
  {
    message: 'Spouse information is required for married individuals',
    path: ['spouse'],
  }
)

/** Type inferred from the schema */
export type BasicContextFormData = z.infer<typeof basicContextSchema>

// ============================================================
// Form Field Schemas (for individual field validation)
// ============================================================

export const basicContextFieldSchemas = {
  firstName: z.string().min(1, 'First name is required').max(STRING_LIMITS.NAME),
  lastName: z.string().min(1, 'Last name is required').max(STRING_LIMITS.NAME),
  birthDate: birthDate,
  maritalStatus: maritalStatusSchema,
  occupation: z.string().min(1, 'Occupation is required').max(STRING_LIMITS.SHORT_TEXT),
  // Federal employee fields
  agency: z.string().min(1, 'Agency is required').max(STRING_LIMITS.SHORT_TEXT),
  yearsOfService: z.number().min(0, 'Years of service cannot be negative').max(50),
  retirementSystem: retirementSystemSchema,
  payGrade: z.string().min(1, 'Pay grade is required').max(20),
  step: z.number().min(1).max(10),
  // Spouse fields
  spouseFirstName: z.string().min(1, 'First name is required').max(STRING_LIMITS.NAME),
  spouseBirthDate: birthDate,
  spouseEmploymentStatus: employmentStatusSchema,
}

// ============================================================
// Validation Helpers
// ============================================================

/**
 * Validate a single field and return error message if invalid
 */
export function validateField(
  schema: z.ZodTypeAny,
  value: unknown
): string | null {
  const result = schema.safeParse(value)
  if (result.success) return null
  return result.error.issues[0]?.message || 'Invalid value'
}

/**
 * Validate the complete Basic Context form
 */
export function validateBasicContext(data: unknown): {
  success: boolean
  data?: BasicContextFormData
  errors?: Record<string, string>
} {
  const result = basicContextSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}

// ============================================================
// Section 2: Retirement Vision Schemas
// ============================================================

/** Flexibility enum */
export const flexibilitySchema = z.enum([
  'very_flexible',
  'somewhat_flexible',
  'fixed',
])

/** Concern type enum */
export const concernTypeSchema = z.enum([
  'outliving_savings',
  'healthcare_costs',
  'healthcare_coverage',
  'spouse_security',
  'market_volatility',
  'inflation',
  'boredom_identity',
  'family_obligations',
  'unexpected_expenses',
  'other',
])

/** Concern severity enum */
export const concernSeveritySchema = z.enum([
  'low',
  'medium',
  'high',
])

/** Retirement concern schema */
export const retirementConcernSchema = z.object({
  concern: concernTypeSchema,
  severity: concernSeveritySchema,
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Lifestyle priority schema */
export const lifestylePrioritySchema = z.object({
  priority: z.string().min(1, 'Priority is required').max(STRING_LIMITS.SHORT_TEXT, `Maximum ${STRING_LIMITS.SHORT_TEXT} characters`),
  rank: z.number().min(1).max(10),
})

/** Complete Retirement Vision schema */
export const retirementVisionSchema = z.object({
  targetRetirementAge: z.number()
    .min(50, 'Target retirement age must be at least 50')
    .max(85, 'Target retirement age must be 85 or less'),
  targetRetirementYear: z.number().optional(),
  retirementFlexibility: flexibilitySchema,
  visionDescription: z.string().max(STRING_LIMITS.LONG_TEXT, `Maximum ${STRING_LIMITS.LONG_TEXT} characters`).optional(),
  topConcerns: z.array(retirementConcernSchema)
    .min(1, 'Please select at least one concern')
    .max(5, 'Please select no more than 5 concerns'),
  mustHaveOutcomes: z.array(z.string().max(STRING_LIMITS.MEDIUM_TEXT))
    .min(1, 'Please add at least one must-have outcome')
    .max(10, 'Maximum 10 outcomes'),
  niceToHaveOutcomes: z.array(z.string().max(STRING_LIMITS.MEDIUM_TEXT)).max(10, 'Maximum 10 outcomes').default([]),
  lifestylePriorities: z.array(lifestylePrioritySchema)
    .min(3, 'Please rank at least 3 priorities')
    .max(10, 'Maximum 10 priorities'),
})

/** Type inferred from the schema */
export type RetirementVisionFormData = z.infer<typeof retirementVisionSchema>

/** Individual field schemas for Retirement Vision */
export const retirementVisionFieldSchemas = {
  targetRetirementAge: z.number()
    .min(50, 'Must be at least 50')
    .max(85, 'Must be 85 or less'),
  targetRetirementYear: z.number().optional(),
  retirementFlexibility: flexibilitySchema,
  visionDescription: z.string().optional(),
}

/**
 * Validate the complete Retirement Vision form
 */
export function validateRetirementVision(data: unknown): {
  success: boolean
  data?: RetirementVisionFormData
  errors?: Record<string, string>
} {
  const result = retirementVisionSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}

// ============================================================
// Section 3: Planning Preferences Schemas
// ============================================================

/** Tolerance level (1-5 scale) */
export const toleranceLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])

/** Comfort level enum */
export const comfortLevelSchema = z.enum([
  'very_low',
  'low',
  'moderate',
  'high',
  'very_high',
])

/** Involvement level enum */
export const involvementLevelSchema = z.enum([
  'diy',
  'guidance',
  'collaborative',
  'delegated',
])

/** Decision style enum */
export const decisionStyleSchema = z.enum([
  'analytical',
  'intuitive',
  'consultative',
  'deliberate',
])

/** Education preference enum */
export const educationPreferenceSchema = z.enum([
  'minimal',
  'summary',
  'detailed',
  'comprehensive',
])

/** Value type enum */
export const valueTypeSchema = z.enum([
  'family_security',
  'health_peace_of_mind',
  'freedom_of_time',
  'enjoyment_experiences',
  'legacy_giving',
  'financial_independence',
  'helping_others',
  'personal_growth',
])

/** Value ranking schema */
export const valueRankingSchema = z.object({
  value: valueTypeSchema,
  rank: z.number().min(1).max(8),
})

/** Tradeoff position enum */
export const tradeoffPositionSchema = z.enum([
  'strongly_a',
  'lean_a',
  'neutral',
  'lean_b',
  'strongly_b',
])

/** Tradeoff preference schema */
export const tradeoffPreferenceSchema = z.object({
  tradeoff: z.string().min(1).max(STRING_LIMITS.SHORT_TEXT),
  preference: tradeoffPositionSchema,
  optionA: z.string().min(1).max(STRING_LIMITS.SHORT_TEXT),
  optionB: z.string().min(1).max(STRING_LIMITS.SHORT_TEXT),
})

/** Complete Planning Preferences schema */
export const planningPreferencesSchema = z.object({
  complexityTolerance: toleranceLevelSchema,
  financialProductComfort: comfortLevelSchema,
  advisorInvolvementDesire: involvementLevelSchema,
  decisionMakingStyle: decisionStyleSchema,
  educationPreference: educationPreferenceSchema,
  valuesPriorities: z.array(valueRankingSchema)
    .min(1, 'Please rank at least one value'),
  tradeoffPreferences: z.array(tradeoffPreferenceSchema)
    .min(1, 'Please complete at least one tradeoff'),
})

/** Type inferred from the schema */
export type PlanningPreferencesFormData = z.infer<typeof planningPreferencesSchema>

/** Individual field schemas for Planning Preferences */
export const planningPreferencesFieldSchemas = {
  complexityTolerance: toleranceLevelSchema,
  financialProductComfort: comfortLevelSchema,
  advisorInvolvementDesire: involvementLevelSchema,
  decisionMakingStyle: decisionStyleSchema,
  educationPreference: educationPreferenceSchema,
}

/**
 * Validate the complete Planning Preferences form
 */
export function validatePlanningPreferences(data: unknown): {
  success: boolean
  data?: PlanningPreferencesFormData
  errors?: Record<string, string>
} {
  const result = planningPreferencesSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}

// ============================================================
// Section 4: Risk & Income Comfort Schemas
// ============================================================

/** Stability preference enum */
export const stabilityPreferenceSchema = z.enum([
  'strong_stability',
  'prefer_stability',
  'balanced',
  'prefer_growth',
  'strong_growth',
])

/** Downturn response enum */
export const downturnResponseSchema = z.enum([
  'reduce_spending',
  'delay_retirement',
  'work_part_time',
  'stay_the_course',
  'unsure',
])

/** Importance level enum */
export const importanceLevelSchema = z.enum([
  'critical',
  'very_important',
  'somewhat_important',
  'not_important',
])

/** Willingness level enum */
export const willingnessLevelSchema = z.enum([
  'very_willing',
  'somewhat_willing',
  'reluctant',
  'unwilling',
])

/** Timing flexibility schema */
export const timingFlexibilitySchema = z.object({
  willingToDelay: z.boolean(),
  maxDelayYears: z.number().min(0).max(10),
  willingToRetireEarly: z.boolean(),
  conditions: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Complete Risk Comfort schema */
export const riskComfortSchema = z.object({
  investmentRiskTolerance: toleranceLevelSchema,
  incomeStabilityPreference: stabilityPreferenceSchema,
  marketDownturnResponse: downturnResponseSchema,
  guaranteedIncomeImportance: importanceLevelSchema,
  flexibilityVsSecurityPreference: z.number()
    .min(-5, 'Must be between -5 and 5')
    .max(5, 'Must be between -5 and 5'),
  spendingAdjustmentWillingness: willingnessLevelSchema,
  retirementTimingFlexibility: timingFlexibilitySchema,
})

/** Type inferred from the schema */
export type RiskComfortFormData = z.infer<typeof riskComfortSchema>

/** Individual field schemas for Risk Comfort */
export const riskComfortFieldSchemas = {
  investmentRiskTolerance: toleranceLevelSchema,
  incomeStabilityPreference: stabilityPreferenceSchema,
  marketDownturnResponse: downturnResponseSchema,
  guaranteedIncomeImportance: importanceLevelSchema,
  flexibilityVsSecurityPreference: z.number().min(-5).max(5),
  spendingAdjustmentWillingness: willingnessLevelSchema,
}

/**
 * Validate the complete Risk Comfort form
 */
export function validateRiskComfort(data: unknown): {
  success: boolean
  data?: RiskComfortFormData
  errors?: Record<string, string>
} {
  const result = riskComfortSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}

// ============================================================
// Section 5: Financial Snapshot Schemas
// ============================================================

/** Income source type enum */
export const incomeSourceTypeSchema = z.enum([
  'salary',
  'self_employment',
  'rental',
  'pension',
  'social_security',
  'other',
])

/** Retirement income type enum */
export const retirementIncomeTypeSchema = z.enum([
  'fers_pension',
  'csrs_pension',
  'social_security',
  'tsp_withdrawals',
  'other_pension',
  'rental_income',
  'part_time_work',
  'other',
])

/** Account type enum */
export const accountTypeSchema = z.enum([
  'tsp_traditional',
  'tsp_roth',
  'traditional_ira',
  'roth_ira',
  '401k',
  'taxable_brokerage',
  'savings',
  'other',
])

/** Balance range enum */
export const balanceRangeSchema = z.enum([
  'under_10k',
  '10k_50k',
  '50k_100k',
  '100k_250k',
  '250k_500k',
  '500k_1m',
  '1m_2m',
  'over_2m',
])

/** Debt type enum */
export const debtTypeSchema = z.enum([
  'mortgage',
  'car',
  'student_loan',
  'credit_card',
  'other',
])

/** Asset type enum */
export const assetTypeSchema = z.enum([
  'primary_home',
  'rental_property',
  'business',
  'vehicle',
  'other',
])

/** Reserve location enum */
export const reserveLocationSchema = z.enum([
  'savings',
  'money_market',
  'mixed',
  'other',
])

/** Life insurance type enum */
export const lifeInsuranceTypeSchema = z.enum([
  'fegli',
  'private_term',
  'private_whole',
  'mixed',
])

/** Income source schema */
export const incomeSourceSchema = z.object({
  type: incomeSourceTypeSchema,
  description: z.string().max(STRING_LIMITS.SHORT_TEXT, `Maximum ${STRING_LIMITS.SHORT_TEXT} characters`),
  annualAmount: z.number().min(0).max(100000000, 'Please enter a valid amount'),
  isPrimary: z.boolean(),
})

/** Expected retirement income schema */
export const expectedRetirementIncomeSchema = z.object({
  type: retirementIncomeTypeSchema,
  estimatedAnnualAmount: z.number().min(0).max(100000000, 'Please enter a valid amount').optional(),
  startAge: z.number().min(50).max(85).optional(),
  isGuaranteed: z.boolean(),
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Account summary schema */
export const accountSummarySchema = z.object({
  type: accountTypeSchema,
  approximateBalance: balanceRangeSchema,
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Debt summary schema */
export const debtSummarySchema = z.object({
  type: debtTypeSchema,
  approximateBalance: balanceRangeSchema,
  yearsRemaining: z.number().min(0).max(100, 'Please enter a valid number of years').optional(),
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Asset summary schema */
export const assetSummarySchema = z.object({
  type: assetTypeSchema,
  approximateValue: balanceRangeSchema.optional(),
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Emergency reserves schema */
export const emergencyReservesSchema = z.object({
  monthsOfExpenses: z.number().min(0).max(120, 'Please enter a valid number of months'),
  location: reserveLocationSchema,
})

/** Insurance summary schema */
export const insuranceSummarySchema = z.object({
  hasLifeInsurance: z.boolean(),
  lifeInsuranceType: lifeInsuranceTypeSchema.optional(),
  hasLongTermCare: z.boolean(),
  hasDisability: z.boolean(),
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT, `Maximum ${STRING_LIMITS.MEDIUM_TEXT} characters`).optional(),
})

/** Complete Financial Snapshot schema */
export const financialSnapshotSchema = z.object({
  incomeSourcesCurrent: z.array(incomeSourceSchema)
    .min(1, 'Please add at least one current income source')
    .max(20, 'Maximum 20 income sources'),
  incomeSourcesRetirement: z.array(expectedRetirementIncomeSchema)
    .min(1, 'Please add at least one expected retirement income source')
    .max(20, 'Maximum 20 retirement income sources'),
  investmentAccounts: z.array(accountSummarySchema)
    .min(1, 'Please add at least one investment account')
    .max(50, 'Maximum 50 investment accounts'),
  debts: z.array(debtSummarySchema).max(30, 'Maximum 30 debt entries').default([]),
  majorAssets: z.array(assetSummarySchema).max(30, 'Maximum 30 asset entries').default([]),
  emergencyReserves: emergencyReservesSchema,
  insuranceCoverage: insuranceSummarySchema,
})

/** Type inferred from the schema */
export type FinancialSnapshotFormData = z.infer<typeof financialSnapshotSchema>

/** Individual field schemas for Financial Snapshot */
export const financialSnapshotFieldSchemas = {
  incomeSourcesCurrent: z.array(incomeSourceSchema).min(1),
  incomeSourcesRetirement: z.array(expectedRetirementIncomeSchema).min(1),
  investmentAccounts: z.array(accountSummarySchema).min(1),
  debts: z.array(debtSummarySchema),
  majorAssets: z.array(assetSummarySchema),
  emergencyReserves: emergencyReservesSchema,
  insuranceCoverage: insuranceSummarySchema,
}

/**
 * Validate the complete Financial Snapshot form
 */
export function validateFinancialSnapshot(data: unknown): {
  success: boolean
  data?: FinancialSnapshotFormData
  errors?: Record<string, string>
} {
  const result = financialSnapshotSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}

// ============================================================
// Values Discovery Schemas
// ============================================================

/** Value category enum */
export const valueCategorySchema = z.enum([
  'SECURITY',
  'FREEDOM',
  'FAMILY',
  'GROWTH',
  'CONTRIBUTION',
  'PURPOSE',
  'CONTROL',
  'HEALTH',
  'QUALITY_OF_LIFE',
])

/** Pile assignment enum */
export const pileSchema = z.enum(['IMPORTANT', 'UNSURE', 'NOT_IMPORTANT'])

/** Values discovery state enum */
export const valuesDiscoveryStateSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])

/** Tradeoff choice enum */
export const valuesTradeoffChoiceSchema = z.enum(['A', 'B', 'NEUTRAL'])

/** Tradeoff strength (1-5) */
export const valuesTradeoffStrengthSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])

/** Values tradeoff response schema */
export const valuesTradeoffResponseSchema = z.object({
  id: z.string().min(1).max(100),
  categoryA: valueCategorySchema,
  categoryB: valueCategorySchema,
  choice: valuesTradeoffChoiceSchema,
  strength: valuesTradeoffStrengthSchema,
  createdAt: z.string(),
})

/** Unsure resolution schema */
export const unsureResolutionSchema = z.object({
  cardId: z.string().min(1).max(100),
  from: z.literal('UNSURE'),
  to: z.enum(['IMPORTANT', 'NOT_IMPORTANT', 'UNSURE']),
  answeredAt: z.string(),
})

/** Complete Values Discovery schema */
export const valuesDiscoverySchema = z.object({
  state: valuesDiscoveryStateSchema,
  piles: z.record(z.string(), pileSchema).default({}),
  step1CompletedAt: z.string().optional(),
  unsureResolutions: z.array(unsureResolutionSchema).max(100).default([]),
  step2CompletedAt: z.string().optional(),
  top10: z.array(z.string().max(100)).max(10).default([]),
  top5: z.array(z.string().max(100)).max(5).default([]),
  step4CompletedAt: z.string().optional(),
  tradeoffResponses: z.array(valuesTradeoffResponseSchema).max(10).default([]),
  step5CompletedAt: z.string().optional(),
  nonNegotiables: z.array(z.string().max(100)).max(3).default([]),
  step6CompletedAt: z.string().optional(),
  completedAt: z.string().optional(),
})

/** Type inferred from the schema */
export type ValuesDiscoveryFormData = z.infer<typeof valuesDiscoverySchema>

// ============================================================
// Financial Goals Schemas
// ============================================================

/** Goal category enum */
export const goalCategorySchema = z.enum([
  'LIFESTYLE',
  'SECURITY_PROTECTION',
  'FAMILY_LEGACY',
  'CAREER_GROWTH',
  'RETIREMENT',
  'HEALTH',
  'MAJOR_PURCHASES',
  'GIVING',
])

/** Goal priority enum */
export const goalPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW', 'NA'])

/** Goal time horizon enum */
export const goalTimeHorizonSchema = z.enum(['SHORT', 'MID', 'LONG', 'ONGOING'])

/** Goal flexibility enum */
export const goalFlexibilitySchema = z.enum(['FIXED', 'FLEXIBLE', 'DEFERABLE'])

/** Financial goals state enum */
export const financialGoalsStateSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])

/** Goal source enum */
export const goalSourceSchema = z.enum(['user', 'system'])

/** Financial goal schema */
export const financialGoalSchema = z.object({
  id: z.string().min(1).max(100),
  label: z.string().min(1).max(STRING_LIMITS.SHORT_TEXT),
  source: goalSourceSchema,
  priority: goalPrioritySchema,
  timeHorizon: goalTimeHorizonSchema.optional(),
  flexibility: goalFlexibilitySchema.optional(),
  isCorePlanningGoal: z.boolean(),
  category: goalCategorySchema,
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT).optional(),
  createdAt: z.string(),
})

/** Goal tradeoff schema */
export const goalTradeoffSchema = z.object({
  goalId1: z.string().min(1).max(100),
  goalId2: z.string().min(1).max(100),
  choice: z.enum(['GOAL1', 'GOAL2', 'NEUTRAL']),
  reasoning: z.string().max(STRING_LIMITS.MEDIUM_TEXT).optional(),
})

/** Complete Financial Goals schema */
export const financialGoalsSchema = z.object({
  state: financialGoalsStateSchema,
  userGeneratedGoals: z.array(financialGoalSchema).max(20).default([]),
  phase1CompletedAt: z.string().optional(),
  systemSelectedGoals: z.array(financialGoalSchema).max(50).default([]),
  phase2CompletedAt: z.string().optional(),
  allGoals: z.array(financialGoalSchema).max(70).default([]),
  phase3CompletedAt: z.string().optional(),
  phase4CompletedAt: z.string().optional(),
  tradeoffs: z.array(goalTradeoffSchema).max(20).default([]),
  phase5CompletedAt: z.string().optional(),
  coreGoals: z.array(financialGoalSchema).max(10).default([]),
  phase6CompletedAt: z.string().optional(),
  completedAt: z.string().optional(),
})

/** Type inferred from the schema */
export type FinancialGoalsFormData = z.infer<typeof financialGoalsSchema>

// ============================================================
// Financial Purpose Schemas
// ============================================================

/** Purpose driver enum */
export const purposeDriverSchema = z.enum([
  'PROTECT_FAMILY',
  'FREEDOM_OPTIONS',
  'STABILITY_PEACE',
  'HEALTH_QUALITY',
  'IMPACT_GIVING',
  'MEANING_PURPOSE',
  'CONTROL_CONFIDENCE',
  'GROWTH_OPPORTUNITY',
])

/** Tradeoff axis enum */
export const tradeoffAxisSchema = z.enum([
  'SECURITY_VS_GROWTH',
  'FREEDOM_SOONER_VS_CERTAINTY_LATER',
  'LIFESTYLE_NOW_VS_BUFFER_FIRST',
  'CONTROL_STRUCTURE_VS_FLEXIBILITY',
])

/** Financial purpose state enum */
export const financialPurposeStateSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])

/** Tradeoff anchor schema */
export const tradeoffAnchorSchema = z.object({
  axis: tradeoffAxisSchema,
  lean: z.enum(['A', 'B', 'NEUTRAL']),
  strength: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
})

/** SoFP draft schema */
export const sofpDraftSchema = z.object({
  id: z.string().min(1).max(100),
  templateId: z.string().min(1).max(100),
  text: z.string().max(STRING_LIMITS.MEDIUM_TEXT),
  createdAt: z.string(),
  editedByUser: z.boolean().optional(),
})

/** Complete Financial Purpose schema */
export const financialPurposeSchema = z.object({
  state: financialPurposeStateSchema,
  primaryDriver: purposeDriverSchema.optional(),
  secondaryDriver: purposeDriverSchema.optional(),
  step2CompletedAt: z.string().optional(),
  tradeoffAnchors: z.array(tradeoffAnchorSchema).max(10).default([]),
  step3CompletedAt: z.string().optional(),
  visionAnchors: z.array(z.string().max(STRING_LIMITS.SHORT_TEXT)).max(5).default([]),
  step4CompletedAt: z.string().optional(),
  drafts: z.array(sofpDraftSchema).max(10).default([]),
  selectedDraftId: z.string().max(100).optional(),
  step5CompletedAt: z.string().optional(),
  finalText: z.string().max(STRING_LIMITS.SHORT_TEXT).optional(),
  step6CompletedAt: z.string().optional(),
  missingValues: z.array(z.string().max(100)).max(10).optional(),
  notes: z.string().max(STRING_LIMITS.MEDIUM_TEXT).optional(),
  completedAt: z.string().optional(),
})

/** Type inferred from the schema */
export type FinancialPurposeFormData = z.infer<typeof financialPurposeSchema>

// ============================================================
// Form Utilities
// ============================================================

/**
 * Scroll to the first validation error on the page.
 * Tries multiple strategies to find the error element.
 */
export function scrollToFirstError(errors: Record<string, string>): void {
  const firstErrorKey = Object.keys(errors)[0]
  if (!firstErrorKey) return

  // Convert dot notation to dash for HTML IDs (e.g., "spouse.firstName" -> "spouse-firstName")
  const htmlId = firstErrorKey.replace(/\./g, '-')

  // Try multiple strategies to find the element
  const element =
    document.getElementById(firstErrorKey) ||
    document.getElementById(htmlId) ||
    document.querySelector(`[name="${firstErrorKey}"]`) ||
    document.querySelector(`[id*="${firstErrorKey}"]`)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Focus the element if it's focusable
    if (element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement) {
      setTimeout(() => element.focus(), 300)
    }
  }
}
