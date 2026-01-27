/**
 * Risk & Income Comfort Form Component
 * Section 4 of the Discovery Wizard - captures risk tolerance and income preferences
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Select, Button } from '@/components/common'
import { ScenarioChoice } from './ScenarioChoice'
import { TimingFlexibilityFields } from './TimingFlexibilityFields'
import {
  INVESTMENT_RISK_OPTIONS,
  STABILITY_PREFERENCE_OPTIONS,
  DOWNTURN_RESPONSE_OPTIONS,
  IMPORTANCE_LEVEL_OPTIONS,
  WILLINGNESS_LEVEL_OPTIONS,
  FLEXIBILITY_SCALE_LABELS,
  RISK_SCENARIOS,
  RISK_COMFORT_QUESTIONS,
  getQuestionLabel,
  calculateRiskScoreFromScenarios,
} from '@/data/riskComfortQuestions'
import { validateField, riskComfortFieldSchemas, validateRiskComfort } from '@/services/validation'
import type { RiskComfort, TimingFlexibility, StabilityPreference, DownturnResponse, ImportanceLevel, WillingnessLevel } from '@/types/riskComfort'
import type { ToleranceLevel } from '@/types/planningPreferences'

interface RiskComfortFormProps {
  initialData?: Partial<RiskComfort>
  onSave: (data: RiskComfort) => void
  onAutoSave?: (data: Partial<RiskComfort>) => void
  isAdvisorMode?: boolean
  clientName?: string
}

/** Extended form state to include scenario responses */
interface FormState extends Partial<RiskComfort> {
  scenarioResponses?: Record<string, string>
}

export function RiskComfortForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: RiskComfortFormProps): JSX.Element {
  // Form state
  const [formData, setFormData] = useState<FormState>(() => ({
    investmentRiskTolerance: undefined,
    incomeStabilityPreference: undefined,
    marketDownturnResponse: undefined,
    guaranteedIncomeImportance: undefined,
    flexibilityVsSecurityPreference: 0,
    spendingAdjustmentWillingness: undefined,
    retirementTimingFlexibility: undefined,
    scenarioResponses: {},
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { scenarioResponses, ...dataToSave } = formData
        onAutoSave(dataToSave)
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
    <K extends keyof RiskComfort>(field: K, value: RiskComfort[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => new Set(prev).add(field))

      // Validate field if it has a schema
      const schema = riskComfortFieldSchemas[field as keyof typeof riskComfortFieldSchemas]
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

  // Handle scenario response changes
  const handleScenarioChange = (scenarioId: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      scenarioResponses: {
        ...prev.scenarioResponses,
        [scenarioId]: value,
      },
    }))
    setTouched((prev) => new Set(prev).add('riskScenarios'))
  }

  // Handle timing flexibility changes
  const handleTimingFlexibilityChange = (value: Partial<TimingFlexibility>): void => {
    setFormData((prev) => ({
      ...prev,
      retirementTimingFlexibility: {
        ...prev.retirementTimingFlexibility,
        ...value,
      } as TimingFlexibility,
    }))
    setTouched((prev) => new Set(prev).add('retirementTimingFlexibility'))
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { scenarioResponses, ...dataToValidate } = formData
    const result = validateRiskComfort(dataToValidate)
    if (result.success && result.data) {
      onSave(result.data as RiskComfort)
    } else if (result.errors) {
      setErrors(result.errors)
      // Mark all fields as touched to show errors
      setTouched(new Set(Object.keys(formData)))
    }
  }

  const getFieldError = (field: string): string | undefined => {
    return touched.has(field) ? errors[field] : undefined
  }

  // Calculate risk score for display
  const riskScore = calculateRiskScoreFromScenarios(formData.scenarioResponses || {})
  const completedScenarios = Object.keys(formData.scenarioResponses || {}).length

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Investment Risk Tolerance Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Investment Risk Tolerance
        </h3>

        <Select
          label={getQuestionLabel('investmentRiskTolerance', isAdvisorMode)}
          options={INVESTMENT_RISK_OPTIONS.map((opt) => ({
            value: opt.value.toString(),
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.investmentRiskTolerance?.toString() || ''}
          onChange={(e) => handleFieldChange('investmentRiskTolerance', parseInt(e.target.value) as ToleranceLevel)}
          error={getFieldError('investmentRiskTolerance')}
          placeholder="Select risk tolerance..."
          helperText={RISK_COMFORT_QUESTIONS.investmentRiskTolerance.helpText}
        />
      </div>

      {/* Income Stability Preference Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Income Stability Preference
        </h3>

        <Select
          label={getQuestionLabel('incomeStabilityPreference', isAdvisorMode)}
          options={STABILITY_PREFERENCE_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.incomeStabilityPreference || ''}
          onChange={(e) => handleFieldChange('incomeStabilityPreference', e.target.value as StabilityPreference)}
          error={getFieldError('incomeStabilityPreference')}
          placeholder="Select preference..."
          helperText={RISK_COMFORT_QUESTIONS.incomeStabilityPreference.helpText}
        />

        <Select
          label={getQuestionLabel('guaranteedIncomeImportance', isAdvisorMode)}
          options={IMPORTANCE_LEVEL_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.guaranteedIncomeImportance || ''}
          onChange={(e) => handleFieldChange('guaranteedIncomeImportance', e.target.value as ImportanceLevel)}
          error={getFieldError('guaranteedIncomeImportance')}
          placeholder="Select importance..."
          helperText={RISK_COMFORT_QUESTIONS.guaranteedIncomeImportance.helpText}
        />
      </div>

      {/* Market Response Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Market & Spending Flexibility
        </h3>

        <Select
          label={getQuestionLabel('marketDownturnResponse', isAdvisorMode)}
          options={DOWNTURN_RESPONSE_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.marketDownturnResponse || ''}
          onChange={(e) => handleFieldChange('marketDownturnResponse', e.target.value as DownturnResponse)}
          error={getFieldError('marketDownturnResponse')}
          placeholder="Select response..."
          helperText={RISK_COMFORT_QUESTIONS.marketDownturnResponse.helpText}
        />

        <Select
          label={getQuestionLabel('spendingAdjustmentWillingness', isAdvisorMode)}
          options={WILLINGNESS_LEVEL_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.spendingAdjustmentWillingness || ''}
          onChange={(e) => handleFieldChange('spendingAdjustmentWillingness', e.target.value as WillingnessLevel)}
          error={getFieldError('spendingAdjustmentWillingness')}
          placeholder="Select willingness..."
          helperText={RISK_COMFORT_QUESTIONS.spendingAdjustmentWillingness.helpText}
        />
      </div>

      {/* Flexibility vs Security Scale */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Flexibility vs. Security Preference
        </h3>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('flexibilityVsSecurityPreference', isAdvisorMode)}
          </label>
          <p className="text-sm text-gray-500">
            {RISK_COMFORT_QUESTIONS.flexibilityVsSecurityPreference.helpText}
          </p>

          {/* Scale slider */}
          <div className="px-2">
            <input
              type="range"
              min={-5}
              max={5}
              step={1}
              value={formData.flexibilityVsSecurityPreference ?? 0}
              onChange={(e) => handleFieldChange('flexibilityVsSecurityPreference', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium text-gray-600">Security</span>
              <span className="text-sm font-medium text-gray-600">Balanced</span>
              <span className="text-sm font-medium text-gray-600">Flexibility</span>
            </div>
          </div>

          {/* Current value display */}
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm">
              {FLEXIBILITY_SCALE_LABELS.find((l) => l.value === formData.flexibilityVsSecurityPreference)?.label ||
                'Balanced'}
            </span>
          </div>
          {getFieldError('flexibilityVsSecurityPreference') && (
            <p className="text-sm text-red-600">{getFieldError('flexibilityVsSecurityPreference')}</p>
          )}
        </div>
      </div>

      {/* Risk Scenarios Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Risk Tolerance Scenarios
        </h3>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            {getQuestionLabel('riskScenarios', isAdvisorMode)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {RISK_COMFORT_QUESTIONS.riskScenarios.helpText}
          </p>
        </div>

        <ScenarioChoice
          scenarios={RISK_SCENARIOS}
          values={formData.scenarioResponses || {}}
          onChange={handleScenarioChange}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('riskScenarios')}
        />

        {/* Risk score indicator (only show when some scenarios are answered) */}
        {completedScenarios > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Calculated Risk Tolerance Score
              </span>
              <span className="text-lg font-semibold text-primary">
                {riskScore.toFixed(1)} / 4.0
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {completedScenarios} of {RISK_SCENARIOS.length} scenarios completed.
              {riskScore <= 1.5 && ' Indicates conservative approach.'}
              {riskScore > 1.5 && riskScore <= 2.5 && ' Indicates moderate approach.'}
              {riskScore > 2.5 && riskScore <= 3.5 && ' Indicates growth-oriented approach.'}
              {riskScore > 3.5 && ' Indicates aggressive approach.'}
            </p>
          </div>
        )}
      </div>

      {/* Retirement Timing Flexibility Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Retirement Timing Flexibility
        </h3>

        <p className="text-sm text-gray-500">
          {RISK_COMFORT_QUESTIONS.retirementTimingFlexibility.helpText}
        </p>

        <TimingFlexibilityFields
          value={formData.retirementTimingFlexibility || {}}
          onChange={handleTimingFlexibilityChange}
          isAdvisorMode={isAdvisorMode}
          errors={
            getFieldError('retirementTimingFlexibility')
              ? { general: getFieldError('retirementTimingFlexibility') as string }
              : undefined
          }
        />
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
