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
