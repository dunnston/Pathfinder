/**
 * Planning Preferences Form Component
 * Section 3 of the Discovery Wizard - captures decision-making style and complexity tolerance
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Select, Button } from '@/components/common'
import { TradeoffExercise } from './TradeoffExercise'
import {
  COMPLEXITY_TOLERANCE_OPTIONS,
  COMFORT_LEVEL_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
  DECISION_STYLE_OPTIONS,
  EDUCATION_PREFERENCE_OPTIONS,
  getQuestionLabel,
} from '@/data/planningPreferencesQuestions'
import {
  validateField,
  planningPreferencesFieldSchemas,
  validatePlanningPreferences,
} from '@/services/validation'
import type { PlanningPreferences } from '@/types'

interface PlanningPreferencesFormProps {
  initialData?: Partial<PlanningPreferences>
  onSave: (data: PlanningPreferences) => void
  onAutoSave?: (data: Partial<PlanningPreferences>) => void
  isAdvisorMode?: boolean
}

export function PlanningPreferencesForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: PlanningPreferencesFormProps): JSX.Element {
  // Form state
  const [formData, setFormData] = useState<Partial<PlanningPreferences>>(() => ({
    complexityTolerance: undefined,
    financialProductComfort: undefined,
    advisorInvolvementDesire: undefined,
    decisionMakingStyle: undefined,
    educationPreference: undefined,
    valuesPriorities: [],
    tradeoffPreferences: [],
    ...initialData,
  }))

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Auto-save debounce
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  // Auto-save effect
  useEffect(() => {
    if (onAutoSave && Object.keys(formData).length > 0) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
      autoSaveTimeout.current = setTimeout(() => {
        onAutoSave(formData)
      }, 1000)
    }
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
    }
  }, [formData, onAutoSave])

  // Field change handler with validation
  const handleFieldChange = useCallback(
    <K extends keyof PlanningPreferences>(field: K, value: PlanningPreferences[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => new Set(prev).add(field))

      // Validate field if it has a schema
      const schema = planningPreferencesFieldSchemas[field as keyof typeof planningPreferencesFieldSchemas]
      if (schema) {
        const error = validateField(schema, value)
        setErrors((prev) => {
          const next = { ...prev }
          if (error) {
            next[field] = error
          } else {
            delete next[field]
          }
          return next
        })
      }
    },
    []
  )

  // Form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    const result = validatePlanningPreferences(formData)
    if (result.success && result.data) {
      onSave(result.data as PlanningPreferences)
    } else if (result.errors) {
      setErrors(result.errors)
      // Mark all fields as touched to show errors
      setTouched(new Set(Object.keys(formData)))
    }
  }

  const getFieldError = (field: string): string | undefined => {
    return touched.has(field) ? errors[field] : undefined
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Complexity & Comfort Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Financial Comfort Level
        </h3>

        {/* Complexity Tolerance */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('complexityTolerance', isAdvisorMode)}
          </label>
          <div className="grid gap-3 sm:grid-cols-5">
            {COMPLEXITY_TOLERANCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFieldChange('complexityTolerance', option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.complexityTolerance === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl font-bold text-center text-gray-900 mb-1">
                  {option.value}
                </div>
                <div className="text-xs text-center text-gray-600">{option.label}</div>
              </button>
            ))}
          </div>
          {formData.complexityTolerance && (
            <p className="text-sm text-gray-500">
              {COMPLEXITY_TOLERANCE_OPTIONS.find((o) => o.value === formData.complexityTolerance)?.description}
            </p>
          )}
          {getFieldError('complexityTolerance') && (
            <p className="text-sm text-red-600">{getFieldError('complexityTolerance')}</p>
          )}
        </div>

        {/* Financial Product Comfort */}
        <Select
          label={getQuestionLabel('financialProductComfort', isAdvisorMode)}
          options={COMFORT_LEVEL_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.financialProductComfort || ''}
          onChange={(e) =>
            handleFieldChange('financialProductComfort', e.target.value as PlanningPreferences['financialProductComfort'])
          }
          error={getFieldError('financialProductComfort')}
          placeholder="Select comfort level..."
        />
      </div>

      {/* Decision Style Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Decision-Making Style
        </h3>

        {/* Advisor Involvement */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('advisorInvolvementDesire', isAdvisorMode)}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {INVOLVEMENT_LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFieldChange('advisorInvolvementDesire', option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.advisorInvolvementDesire === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="mt-1 text-sm text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
          {getFieldError('advisorInvolvementDesire') && (
            <p className="text-sm text-red-600">{getFieldError('advisorInvolvementDesire')}</p>
          )}
        </div>

        {/* Decision Making Style */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('decisionMakingStyle', isAdvisorMode)}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {DECISION_STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFieldChange('decisionMakingStyle', option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.decisionMakingStyle === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="mt-1 text-sm text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
          {getFieldError('decisionMakingStyle') && (
            <p className="text-sm text-red-600">{getFieldError('decisionMakingStyle')}</p>
          )}
        </div>

        {/* Education Preference */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('educationPreference', isAdvisorMode)}
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EDUCATION_PREFERENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFieldChange('educationPreference', option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.educationPreference === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="mt-1 text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
          {getFieldError('educationPreference') && (
            <p className="text-sm text-red-600">{getFieldError('educationPreference')}</p>
          )}
        </div>
      </div>

      {/* Tradeoff Exercise Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Preference Tradeoffs
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {getQuestionLabel('tradeoffPreferences', isAdvisorMode)}
          </label>
          <TradeoffExercise
            value={formData.tradeoffPreferences || []}
            onChange={(preferences) => handleFieldChange('tradeoffPreferences', preferences)}
            error={getFieldError('tradeoffPreferences')}
            isAdvisorMode={isAdvisorMode}
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="pt-6 border-t border-gray-200">
        <Button type="submit" className="w-full sm:w-auto">
          Save & Continue
        </Button>
      </div>
    </form>
  )
}
