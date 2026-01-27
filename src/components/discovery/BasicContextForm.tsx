/**
 * Basic Context Form Component
 * Main form for Section 1 of the Discovery Wizard
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Input, Select, DateInput, TextArea, QuestionCard, Button } from '@/components/common'
import { FederalEmployeeFields } from './FederalEmployeeFields'
import { SpouseFields } from './SpouseFields'
import { DependentsList } from './DependentsList'
import {
  MARITAL_STATUS_OPTIONS,
  getQuestionLabel,
  shouldShowSpouseFields,
} from '@/data/basicContextQuestions'
import { validateBasicContext } from '@/services/validation'
import type { BasicContext, FederalEmployeeInfo, SpouseInfo, Dependent } from '@/types'

/** Form data type (dates as strings for form inputs) */
export interface BasicContextFormData {
  firstName: string
  lastName: string
  birthDate: string
  maritalStatus: string
  occupation: string
  isFederalEmployee: boolean
  federalEmployee: Partial<FederalEmployeeInfo>
  spouse: Partial<SpouseInfo>
  dependents: Dependent[]
  hobbiesInterests: string
  communityInvolvement: string
}

interface BasicContextFormProps {
  initialData?: Partial<BasicContext>
  onSave: (data: BasicContext) => void
  onAutoSave?: (data: Partial<BasicContext>) => void
  isAdvisorMode?: boolean
  clientName?: string
}

const defaultFormData: BasicContextFormData = {
  firstName: '',
  lastName: '',
  birthDate: '',
  maritalStatus: '',
  occupation: '',
  isFederalEmployee: false,
  federalEmployee: {},
  spouse: {},
  dependents: [],
  hobbiesInterests: '',
  communityInvolvement: '',
}

/**
 * Convert stored BasicContext to form data
 */
function toFormData(data?: Partial<BasicContext>): BasicContextFormData {
  if (!data) return defaultFormData

  return {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
    maritalStatus: data.maritalStatus || '',
    occupation: data.occupation || '',
    isFederalEmployee: data.federalEmployee !== null && data.federalEmployee !== undefined,
    federalEmployee: data.federalEmployee || {},
    spouse: data.spouse || {},
    dependents: data.dependents || [],
    hobbiesInterests: data.hobbiesInterests?.join(', ') || '',
    communityInvolvement: data.communityInvolvement || '',
  }
}

/**
 * Convert form data to BasicContext for storage
 */
function toBasicContext(formData: BasicContextFormData): BasicContext {
  const showSpouse = shouldShowSpouseFields(formData.maritalStatus)
  const hobbies = formData.hobbiesInterests
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)

  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    birthDate: new Date(formData.birthDate),
    maritalStatus: formData.maritalStatus as BasicContext['maritalStatus'],
    occupation: formData.occupation,
    federalEmployee: formData.isFederalEmployee
      ? (formData.federalEmployee as FederalEmployeeInfo)
      : null,
    spouse: showSpouse ? (formData.spouse as SpouseInfo) : undefined,
    dependents: formData.dependents,
    hobbiesInterests: hobbies.length > 0 ? hobbies : undefined,
    communityInvolvement: formData.communityInvolvement || undefined,
  }
}

export function BasicContextForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
  clientName,
}: BasicContextFormProps): JSX.Element {
  const [formData, setFormData] = useState<BasicContextFormData>(() => toFormData(initialData))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Refs for auto-save management
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formDataRef = useRef(formData)
  const onAutoSaveRef = useRef(onAutoSave)

  // Keep refs updated
  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    onAutoSaveRef.current = onAutoSave
  }, [onAutoSave])

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!onAutoSave) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const partialData = toBasicContext(formData)
      onAutoSave(partialData)
    }, 1000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [formData, onAutoSave])

  // Flush auto-save on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      // Flush final save on unmount
      if (onAutoSaveRef.current) {
        const partialData = toBasicContext(formDataRef.current)
        onAutoSaveRef.current(partialData)
      }
    }
  }, [])

  // Update a single field
  const updateField = useCallback((field: keyof BasicContextFormData, value: unknown): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => new Set(prev).add(field))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [errors])

  // Handle birth date change with validation
  const handleBirthDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setTouched((prev) => new Set(prev).add('birthDate'))

    if (!value) {
      setFormData((prev) => ({ ...prev, birthDate: '' }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next.birthDate
        return next
      })
      return
    }

    const date = new Date(value)
    const today = new Date()
    const minDate = new Date('1900-01-01')

    if (date > today) {
      setErrors((prev) => ({ ...prev, birthDate: 'Birth date cannot be in the future' }))
      return
    }

    if (date < minDate) {
      setErrors((prev) => ({ ...prev, birthDate: 'Please enter a valid birth date' }))
      return
    }

    setFormData((prev) => ({ ...prev, birthDate: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.birthDate
      return next
    })
  }, [])

  // Update federal employee fields
  const updateFederalField = useCallback((field: keyof FederalEmployeeInfo, value: unknown): void => {
    setFormData((prev) => ({
      ...prev,
      federalEmployee: { ...prev.federalEmployee, [field]: value },
    }))
    setTouched((prev) => new Set(prev).add(`federalEmployee.${field}`))
  }, [])

  // Update spouse fields
  const updateSpouseField = useCallback((field: keyof SpouseInfo, value: unknown): void => {
    setFormData((prev) => ({
      ...prev,
      spouse: { ...prev.spouse, [field]: value },
    }))
    setTouched((prev) => new Set(prev).add(`spouse.${field}`))
  }, [])

  // Validate and submit
  const handleSubmit = (): void => {
    const dataToValidate = toBasicContext(formData)
    const result = validateBasicContext(dataToValidate)

    if (result.success && result.data) {
      onSave(result.data as BasicContext)
    } else if (result.errors) {
      setErrors(result.errors)
      // Mark all fields as touched to show errors
      setTouched(new Set(Object.keys(result.errors)))
    }
  }

  // Check if we should show spouse fields
  const showSpouse = shouldShowSpouseFields(formData.maritalStatus)

  // Get mode-aware pronoun
  const youOrClient = isAdvisorMode ? (clientName || 'the client') : 'you'

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <QuestionCard
        question={isAdvisorMode ? "Client's Personal Information" : "Your Personal Information"}
        helperText="This information helps us personalize your retirement planning experience."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={getQuestionLabel('firstName', isAdvisorMode)}
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            error={touched.has('firstName') ? errors.firstName : undefined}
            placeholder="First name"
          />
          <Input
            label={getQuestionLabel('lastName', isAdvisorMode)}
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            error={touched.has('lastName') ? errors.lastName : undefined}
            placeholder="Last name"
          />
          <DateInput
            label={getQuestionLabel('birthDate', isAdvisorMode)}
            value={formData.birthDate}
            onChange={handleBirthDateChange}
            error={touched.has('birthDate') ? errors.birthDate : undefined}
            helperText="This helps us calculate retirement eligibility and timelines."
            max={new Date().toISOString().split('T')[0]}
            showRequired
          />
          <Select
            label={getQuestionLabel('maritalStatus', isAdvisorMode)}
            options={MARITAL_STATUS_OPTIONS}
            placeholder="Select status..."
            value={formData.maritalStatus}
            onChange={(e) => updateField('maritalStatus', e.target.value)}
            error={touched.has('maritalStatus') ? errors.maritalStatus : undefined}
            helperText="This affects benefits eligibility and survivor planning."
          />
        </div>
      </QuestionCard>

      {/* Spouse Information - Conditional */}
      {showSpouse && (
        <QuestionCard
          question={`Tell us about ${isAdvisorMode ? "the client's" : 'your'} spouse or partner`}
          helperText="Understanding your spouse's situation helps us plan for combined retirement income."
        >
          <SpouseFields
            data={formData.spouse}
            errors={errors}
            onChange={updateSpouseField}
            isAdvisorMode={isAdvisorMode}
          />
        </QuestionCard>
      )}

      {/* Employment Information */}
      <QuestionCard
        question={`${isAdvisorMode ? "Client's" : 'Your'} Employment`}
        helperText="This helps us understand your current financial situation and retirement benefits."
      >
        <div className="space-y-6">
          <Input
            label={getQuestionLabel('occupation', isAdvisorMode)}
            value={formData.occupation}
            onChange={(e) => updateField('occupation', e.target.value)}
            error={touched.has('occupation') ? errors.occupation : undefined}
            placeholder="e.g., Program Analyst, Engineer, Administrative Specialist"
          />

          {/* Federal Employee Toggle */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFederalEmployee}
                onChange={(e) => updateField('isFederalEmployee', e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-base font-medium text-gray-900">
                  {getQuestionLabel('isFederalEmployee', isAdvisorMode)}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Federal employees have unique retirement benefits we can help optimize,
                  including FERS/CSRS pensions, TSP, and FEHB.
                </p>
              </div>
            </label>
          </div>

          {/* Federal Employee Fields - Conditional */}
          {formData.isFederalEmployee && (
            <FederalEmployeeFields
              data={formData.federalEmployee}
              errors={errors}
              onChange={updateFederalField}
              isAdvisorMode={isAdvisorMode}
            />
          )}
        </div>
      </QuestionCard>

      {/* Dependents */}
      <QuestionCard
        question="Dependents"
        helperText={`People who rely on ${youOrClient} financially may affect retirement planning.`}
      >
        <DependentsList
          dependents={formData.dependents}
          errors={errors}
          onChange={(deps) => updateField('dependents', deps)}
          isAdvisorMode={isAdvisorMode}
        />
      </QuestionCard>

      {/* Optional: Lifestyle Information */}
      <QuestionCard
        question="Lifestyle & Interests (Optional)"
        helperText="This helps us understand what retirement lifestyle you envision."
      >
        <div className="space-y-4">
          <Input
            label={getQuestionLabel('hobbiesInterests', isAdvisorMode)}
            value={formData.hobbiesInterests}
            onChange={(e) => updateField('hobbiesInterests', e.target.value)}
            placeholder="e.g., Travel, Golf, Volunteering, Gardening"
            helperText="Separate multiple interests with commas"
          />
          <TextArea
            label={getQuestionLabel('communityInvolvement', isAdvisorMode)}
            value={formData.communityInvolvement}
            onChange={(e) => updateField('communityInvolvement', e.target.value)}
            placeholder="Church, civic organizations, volunteer work..."
            rows={2}
            helperText="Optional - only if relevant to your planning philosophy"
          />
        </div>
      </QuestionCard>

      {/* Form-level errors */}
      {Object.keys(errors).length > 0 && touched.size > 0 && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm font-medium text-error">Please correct the following errors:</p>
          <ul className="mt-2 text-sm text-error list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-6 border-t border-gray-200">
        <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
          {isAdvisorMode ? 'Save & Continue' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  )
}

