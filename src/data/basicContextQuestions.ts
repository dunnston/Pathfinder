/**
 * Basic Context Section - Questions and Options
 * Section 1 of the Discovery Wizard
 */

import type { MaritalStatus, RetirementSystem } from '@/types'
import type { EmploymentStatus } from '@/types'

/** Question metadata for rendering */
export interface QuestionConfig {
  id: string
  label: string
  helpText?: string
  required: boolean
  /** Mode-aware labels: [consumer, advisor] */
  modeLabels?: [string, string]
}

/** Marital status options with labels */
export const MARITAL_STATUS_OPTIONS: Array<{ value: MaritalStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'domestic_partnership', label: 'Domestic Partnership' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

/** Employment status options with labels */
export const EMPLOYMENT_STATUS_OPTIONS: Array<{ value: EmploymentStatus; label: string }> = [
  { value: 'employed_full_time', label: 'Employed Full-Time' },
  { value: 'employed_part_time', label: 'Employed Part-Time' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'disabled', label: 'Disabled' },
]

/** Federal retirement system options with labels */
export const RETIREMENT_SYSTEM_OPTIONS: Array<{ value: RetirementSystem; label: string; description: string }> = [
  {
    value: 'FERS',
    label: 'FERS',
    description: 'Federal Employees Retirement System (hired after 1983)'
  },
  {
    value: 'CSRS',
    label: 'CSRS',
    description: 'Civil Service Retirement System (hired before 1984)'
  },
  {
    value: 'FERS_RAE',
    label: 'FERS-RAE',
    description: 'FERS Revised Annuity Employee (hired 2013-2014)'
  },
  {
    value: 'FERS_FRAE',
    label: 'FERS-FRAE',
    description: 'FERS Further Revised Annuity Employee (hired 2014+)'
  },
]

/** Common federal agency options */
export const FEDERAL_AGENCY_OPTIONS: string[] = [
  'Department of Defense',
  'Department of Veterans Affairs',
  'Department of Homeland Security',
  'Department of Justice',
  'Department of the Treasury',
  'Department of Agriculture',
  'Department of Health and Human Services',
  'Social Security Administration',
  'Department of the Interior',
  'Department of Transportation',
  'Department of State',
  'Department of Energy',
  'Department of Labor',
  'Department of Education',
  'Department of Housing and Urban Development',
  'Department of Commerce',
  'Environmental Protection Agency',
  'National Aeronautics and Space Administration',
  'General Services Administration',
  'Office of Personnel Management',
  'Other',
]

/** Common dependent relationships */
export const DEPENDENT_RELATIONSHIP_OPTIONS: string[] = [
  'Child',
  'Stepchild',
  'Grandchild',
  'Parent',
  'Grandparent',
  'Sibling',
  'Other Relative',
  'Other',
]

/** Pay grade options for federal employees */
export const PAY_GRADE_OPTIONS: string[] = [
  'GS-1', 'GS-2', 'GS-3', 'GS-4', 'GS-5', 'GS-6', 'GS-7', 'GS-8',
  'GS-9', 'GS-10', 'GS-11', 'GS-12', 'GS-13', 'GS-14', 'GS-15',
  'SES', 'SL', 'ST', 'WG', 'WL', 'WS', 'Other',
]

/** Step options (1-10 for most federal positions) */
export const STEP_OPTIONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/** Question configurations for the Basic Context section */
export const BASIC_CONTEXT_QUESTIONS: Record<string, QuestionConfig> = {
  firstName: {
    id: 'firstName',
    label: 'First Name',
    modeLabels: ['What is your first name?', "What is the client's first name?"],
    required: true,
  },
  lastName: {
    id: 'lastName',
    label: 'Last Name',
    modeLabels: ['What is your last name?', "What is the client's last name?"],
    required: true,
  },
  birthDate: {
    id: 'birthDate',
    label: 'Date of Birth',
    modeLabels: ['When were you born?', "When was the client born?"],
    helpText: 'This helps us calculate retirement eligibility and timelines.',
    required: true,
  },
  maritalStatus: {
    id: 'maritalStatus',
    label: 'Marital Status',
    modeLabels: ['What is your marital status?', "What is the client's marital status?"],
    helpText: 'This affects benefits eligibility and survivor planning.',
    required: true,
  },
  occupation: {
    id: 'occupation',
    label: 'Current Occupation',
    modeLabels: ['What is your current occupation?', "What is the client's current occupation?"],
    required: true,
  },
  isFederalEmployee: {
    id: 'isFederalEmployee',
    label: 'Federal Employee',
    modeLabels: ['Are you a federal employee?', 'Is the client a federal employee?'],
    helpText: 'Federal employees have unique retirement benefits we can help optimize.',
    required: true,
  },
  // Federal Employee Fields
  agency: {
    id: 'agency',
    label: 'Federal Agency',
    modeLabels: ['Which agency do you work for?', 'Which agency does the client work for?'],
    required: true,
  },
  yearsOfService: {
    id: 'yearsOfService',
    label: 'Years of Federal Service',
    modeLabels: ['How many years of federal service do you have?', 'How many years of federal service does the client have?'],
    helpText: 'Include all creditable service time.',
    required: true,
  },
  retirementSystem: {
    id: 'retirementSystem',
    label: 'Retirement System',
    modeLabels: ['Which retirement system are you under?', 'Which retirement system is the client under?'],
    helpText: 'This determines your pension calculation and benefits.',
    required: true,
  },
  payGrade: {
    id: 'payGrade',
    label: 'Pay Grade',
    modeLabels: ['What is your current pay grade?', "What is the client's current pay grade?"],
    required: true,
  },
  step: {
    id: 'step',
    label: 'Step',
    modeLabels: ['What is your current step?', "What is the client's current step?"],
    required: true,
  },
  isLawEnforcement: {
    id: 'isLawEnforcement',
    label: 'Law Enforcement or Firefighter',
    modeLabels: [
      'Are you in a law enforcement or firefighter position?',
      'Is the client in a law enforcement or firefighter position?'
    ],
    helpText: 'These positions have special early retirement provisions.',
    required: true,
  },
  hasMilitaryService: {
    id: 'hasMilitaryService',
    label: 'Military Service',
    modeLabels: ['Do you have military service?', 'Does the client have military service?'],
    helpText: 'Military service may be creditable toward federal retirement.',
    required: true,
  },
  militaryServiceYears: {
    id: 'militaryServiceYears',
    label: 'Years of Military Service',
    modeLabels: ['How many years of military service?', 'How many years of military service does the client have?'],
    required: false,
  },
  // Spouse Fields
  spouseFirstName: {
    id: 'spouseFirstName',
    label: "Spouse's First Name",
    modeLabels: ["What is your spouse's first name?", "What is the spouse's first name?"],
    required: true,
  },
  spouseBirthDate: {
    id: 'spouseBirthDate',
    label: "Spouse's Date of Birth",
    modeLabels: ["When was your spouse born?", "When was the spouse born?"],
    required: true,
  },
  spouseEmploymentStatus: {
    id: 'spouseEmploymentStatus',
    label: "Spouse's Employment Status",
    modeLabels: ["What is your spouse's employment status?", "What is the spouse's employment status?"],
    required: true,
  },
  spouseHasPension: {
    id: 'spouseHasPension',
    label: 'Spouse Has Pension',
    modeLabels: ['Does your spouse have a pension?', 'Does the spouse have a pension?'],
    helpText: 'This helps us plan for combined retirement income.',
    required: true,
  },
  spousePensionDetails: {
    id: 'spousePensionDetails',
    label: 'Pension Details',
    modeLabels: ['Tell us about the pension', 'Describe the pension details'],
    helpText: 'Type of pension, approximate value, etc.',
    required: false,
  },
  // Dependents
  dependents: {
    id: 'dependents',
    label: 'Dependents',
    modeLabels: ['Do you have any dependents?', 'Does the client have any dependents?'],
    helpText: 'Children, parents, or others who depend on you financially.',
    required: false,
  },
  // Optional fields
  hobbiesInterests: {
    id: 'hobbiesInterests',
    label: 'Hobbies & Interests',
    modeLabels: [
      'What hobbies or interests do you plan to pursue in retirement?',
      'What hobbies or interests does the client plan to pursue?'
    ],
    helpText: 'This helps us understand what retirement lifestyle you envision.',
    required: false,
  },
  communityInvolvement: {
    id: 'communityInvolvement',
    label: 'Community Involvement',
    modeLabels: [
      'Are you involved in any community, religious, or volunteer organizations?',
      'Is the client involved in any community organizations?'
    ],
    helpText: 'Optional - only if relevant to your planning philosophy.',
    required: false,
  },
}

/**
 * Get the mode-appropriate label for a question
 */
export function getQuestionLabel(questionId: string, isAdvisorMode: boolean): string {
  const question = BASIC_CONTEXT_QUESTIONS[questionId]
  if (!question) return questionId

  if (question.modeLabels) {
    return isAdvisorMode ? question.modeLabels[1] : question.modeLabels[0]
  }
  return question.label
}

/**
 * Check if spouse fields should be shown based on marital status
 */
export function shouldShowSpouseFields(maritalStatus: string | undefined): boolean {
  return maritalStatus === 'married' || maritalStatus === 'domestic_partnership'
}
