/**
 * Zod Validation Schemas
 * Centralized validation for all discovery sections
 */

import { z } from 'zod'

// ============================================================
// Common Validators
// ============================================================

/** Date for birth year (reasonable range) */
const birthDate = z.coerce.date().refine(
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
  firstName: z.string().min(1, 'First name is required'),
  birthDate: birthDate,
  employmentStatus: employmentStatusSchema,
  hasPension: z.boolean(),
  pensionDetails: z.string().optional(),
})

/** Federal employee information schema */
export const federalEmployeeInfoSchema = z.object({
  agency: z.string().min(1, 'Agency is required'),
  yearsOfService: z.number()
    .min(0, 'Years of service cannot be negative')
    .max(50, 'Please check years of service'),
  retirementSystem: retirementSystemSchema,
  payGrade: z.string().min(1, 'Pay grade is required'),
  step: z.number().min(1).max(10),
  isLawEnforcement: z.boolean(),
  hasMilitaryService: z.boolean(),
  militaryServiceYears: z.number().min(0).max(40).optional(),
})

/** Dependent schema */
export const dependentSchema = z.object({
  relationship: z.string().min(1, 'Relationship is required'),
  birthDate: birthDate,
  financiallyDependent: z.boolean(),
})

/** Complete Basic Context schema */
export const basicContextSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  birthDate: birthDate,
  maritalStatus: maritalStatusSchema,
  spouse: spouseInfoSchema.optional(),
  dependents: z.array(dependentSchema).default([]),
  occupation: z.string().min(1, 'Occupation is required'),
  federalEmployee: federalEmployeeInfoSchema.nullable(),
  hobbiesInterests: z.array(z.string()).optional(),
  communityInvolvement: z.string().optional(),
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
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  birthDate: birthDate,
  maritalStatus: maritalStatusSchema,
  occupation: z.string().min(1, 'Occupation is required'),
  // Federal employee fields
  agency: z.string().min(1, 'Agency is required'),
  yearsOfService: z.number().min(0, 'Years of service cannot be negative').max(50),
  retirementSystem: retirementSystemSchema,
  payGrade: z.string().min(1, 'Pay grade is required'),
  step: z.number().min(1).max(10),
  // Spouse fields
  spouseFirstName: z.string().min(1, 'First name is required'),
  spouseBirthDate: birthDate,
  spouseEmploymentStatus: employmentStatusSchema,
}

// ============================================================
// Validation Helpers
// ============================================================

/**
 * Validate a single field and return error message if invalid
 */
export function validateField<T>(
  schema: z.ZodType<T>,
  value: unknown
): string | null {
  const result = schema.safeParse(value)
  if (result.success) return null
  return result.error.errors[0]?.message || 'Invalid value'
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
  for (const error of result.error.errors) {
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
  'minor',
  'moderate',
  'significant',
  'major',
])

/** Retirement concern schema */
export const retirementConcernSchema = z.object({
  type: concernTypeSchema,
  severity: concernSeveritySchema,
  notes: z.string().optional(),
})

/** Lifestyle priority schema */
export const lifestylePrioritySchema = z.object({
  priority: z.string().min(1, 'Priority is required'),
  rank: z.number().min(1).max(10),
})

/** Complete Retirement Vision schema */
export const retirementVisionSchema = z.object({
  targetRetirementAge: z.number()
    .min(50, 'Target retirement age must be at least 50')
    .max(85, 'Target retirement age must be 85 or less'),
  targetRetirementYear: z.number().optional(),
  retirementFlexibility: flexibilitySchema,
  visionDescription: z.string().optional(),
  topConcerns: z.array(retirementConcernSchema)
    .min(1, 'Please select at least one concern')
    .max(5, 'Please select no more than 5 concerns'),
  mustHaveOutcomes: z.array(z.string())
    .min(1, 'Please add at least one must-have outcome'),
  niceToHaveOutcomes: z.array(z.string()).default([]),
  lifestylePriorities: z.array(lifestylePrioritySchema)
    .min(3, 'Please rank at least 3 priorities'),
  financialPurposeStatement: z.string().optional(),
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
  for (const error of result.error.errors) {
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
  tradeoff: z.string().min(1),
  preference: tradeoffPositionSchema,
  optionA: z.string().min(1),
  optionB: z.string().min(1),
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
  for (const error of result.error.errors) {
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
  conditions: z.string().optional(),
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
  for (const error of result.error.errors) {
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
  description: z.string(),
  annualAmount: z.number().min(0),
  isPrimary: z.boolean(),
})

/** Expected retirement income schema */
export const expectedRetirementIncomeSchema = z.object({
  type: retirementIncomeTypeSchema,
  estimatedAnnualAmount: z.number().min(0).optional(),
  startAge: z.number().min(50).max(85).optional(),
  isGuaranteed: z.boolean(),
  notes: z.string().optional(),
})

/** Account summary schema */
export const accountSummarySchema = z.object({
  type: accountTypeSchema,
  approximateBalance: balanceRangeSchema,
  notes: z.string().optional(),
})

/** Debt summary schema */
export const debtSummarySchema = z.object({
  type: debtTypeSchema,
  approximateBalance: balanceRangeSchema,
  yearsRemaining: z.number().min(0).optional(),
  notes: z.string().optional(),
})

/** Asset summary schema */
export const assetSummarySchema = z.object({
  type: assetTypeSchema,
  approximateValue: balanceRangeSchema.optional(),
  notes: z.string().optional(),
})

/** Emergency reserves schema */
export const emergencyReservesSchema = z.object({
  monthsOfExpenses: z.number().min(0),
  location: reserveLocationSchema,
})

/** Insurance summary schema */
export const insuranceSummarySchema = z.object({
  hasLifeInsurance: z.boolean(),
  lifeInsuranceType: lifeInsuranceTypeSchema.optional(),
  hasLongTermCare: z.boolean(),
  hasDisability: z.boolean(),
  notes: z.string().optional(),
})

/** Complete Financial Snapshot schema */
export const financialSnapshotSchema = z.object({
  incomeSourcesCurrent: z.array(incomeSourceSchema)
    .min(1, 'Please add at least one current income source'),
  incomeSourcesRetirement: z.array(expectedRetirementIncomeSchema)
    .min(1, 'Please add at least one expected retirement income source'),
  investmentAccounts: z.array(accountSummarySchema)
    .min(1, 'Please add at least one investment account'),
  debts: z.array(debtSummarySchema).default([]),
  majorAssets: z.array(assetSummarySchema).default([]),
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
  for (const error of result.error.errors) {
    const path = error.path.join('.')
    errors[path] = error.message
  }

  return { success: false, errors }
}
