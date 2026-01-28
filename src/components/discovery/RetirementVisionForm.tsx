/**
 * Retirement Vision Form Component
 * Section 2 of the Discovery Wizard - captures retirement goals and concerns
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Select, TextArea, Button } from '@/components/common'
import { ConcernsSelector } from './ConcernsSelector'
import { LifestylePrioritiesRanking } from './LifestylePrioritiesRanking'
import {
  FLEXIBILITY_OPTIONS,
  VISION_PROMPTS,
  MUST_HAVE_SUGGESTIONS,
  NICE_TO_HAVE_SUGGESTIONS,
  getQuestionLabel,
} from '@/data/retirementVisionQuestions'
import { validateField, retirementVisionFieldSchemas, validateRetirementVision } from '@/services/validation'
import type { RetirementVision } from '@/types'

interface RetirementVisionFormProps {
  initialData?: Partial<RetirementVision>
  onSave: (data: RetirementVision) => void
  onAutoSave?: (data: Partial<RetirementVision>) => void
  isAdvisorMode?: boolean
  clientName?: string
  /** Birth date from Basic Context - used to calculate target retirement year */
  birthDate?: Date | string
}

/**
 * Safely extract birth year from a Date or string
 * Returns null if the date is invalid or undefined
 */
function getBirthYear(birthDate: Date | string | undefined): number | null {
  if (!birthDate) return null
  const dateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  // Check if the date is valid before accessing getFullYear
  if (isNaN(dateObj.getTime())) return null
  return dateObj.getFullYear()
}

export function RetirementVisionForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
  birthDate,
}: RetirementVisionFormProps): JSX.Element {
  // Calculate birth year from birthDate prop (safely handles invalid dates)
  const birthYear = getBirthYear(birthDate)
  // Form state
  const [formData, setFormData] = useState<Partial<RetirementVision>>(() => ({
    targetRetirementAge: undefined,
    targetRetirementYear: undefined,
    retirementFlexibility: undefined,
    visionDescription: '',
    topConcerns: [],
    mustHaveOutcomes: [],
    niceToHaveOutcomes: [],
    lifestylePriorities: [],
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

  // Calculate targetRetirementYear when birthYear or targetRetirementAge changes
  useEffect(() => {
    if (birthYear && formData.targetRetirementAge) {
      const calculatedYear = birthYear + formData.targetRetirementAge
      if (formData.targetRetirementYear !== calculatedYear) {
        setFormData((prev) => ({ ...prev, targetRetirementYear: calculatedYear }))
      }
    }
  }, [birthYear, formData.targetRetirementAge, formData.targetRetirementYear])

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
    <K extends keyof RetirementVision>(field: K, value: RetirementVision[K]) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value }

        // Auto-calculate targetRetirementYear when targetRetirementAge changes
        if (field === 'targetRetirementAge' && birthYear && typeof value === 'number') {
          updated.targetRetirementYear = birthYear + value
        }

        return updated
      })
      setTouched((prev) => new Set(prev).add(field))

      // Validate field if it has a schema
      const schema = retirementVisionFieldSchemas[field as keyof typeof retirementVisionFieldSchemas]
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
    [birthYear]
  )

  // Handle must-have outcome changes
  const handleMustHaveChange = (outcomes: string[]): void => {
    handleFieldChange('mustHaveOutcomes', outcomes)
  }

  const handleAddMustHave = (outcome: string): void => {
    if (outcome && !formData.mustHaveOutcomes?.includes(outcome)) {
      handleMustHaveChange([...(formData.mustHaveOutcomes || []), outcome])
    }
  }

  const handleRemoveMustHave = (outcome: string): void => {
    handleMustHaveChange((formData.mustHaveOutcomes || []).filter((o) => o !== outcome))
  }

  // Handle nice-to-have outcome changes
  const handleNiceToHaveChange = (outcomes: string[]): void => {
    handleFieldChange('niceToHaveOutcomes', outcomes)
  }

  const handleAddNiceToHave = (outcome: string): void => {
    if (outcome && !formData.niceToHaveOutcomes?.includes(outcome)) {
      handleNiceToHaveChange([...(formData.niceToHaveOutcomes || []), outcome])
    }
  }

  const handleRemoveNiceToHave = (outcome: string): void => {
    handleNiceToHaveChange((formData.niceToHaveOutcomes || []).filter((o) => o !== outcome))
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    const result = validateRetirementVision(formData)
    if (result.success && result.data) {
      onSave(result.data as RetirementVision)
    } else if (result.errors) {
      setErrors(result.errors)
      // Mark all fields as touched to show errors
      setTouched(new Set(Object.keys(formData)))
    }
  }

  const getFieldError = (field: string): string | undefined => {
    return touched.has(field) ? errors[field] : undefined
  }

  // Custom input for outcomes
  const [newMustHave, setNewMustHave] = useState('')
  const [newNiceToHave, setNewNiceToHave] = useState('')

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Retirement Timeline Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Retirement Timeline
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Target Retirement Age */}
          <Input
            label={getQuestionLabel('targetRetirementAge', isAdvisorMode)}
            type="number"
            value={formData.targetRetirementAge?.toString() || ''}
            onChange={(e) => handleFieldChange('targetRetirementAge', e.target.value ? parseInt(e.target.value) : null)}
            error={getFieldError('targetRetirementAge')}
            placeholder="e.g., 65"
            min={50}
            max={85}
            helperText="Between 50 and 85"
          />

          {/* Target Retirement Year - Calculated */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Target Retirement Year
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
              {formData.targetRetirementYear ? (
                <span className="font-medium">{formData.targetRetirementYear}</span>
              ) : birthYear && formData.targetRetirementAge ? (
                <span className="font-medium">{birthYear + formData.targetRetirementAge}</span>
              ) : (
                <span className="text-gray-400 italic">
                  {birthYear ? 'Enter target age above' : 'Calculated from birth date & target age'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {birthYear
                ? 'Automatically calculated from your birth date'
                : 'Complete Basic Context section to enable calculation'}
            </p>
          </div>
        </div>

        {/* Retirement Flexibility */}
        <Select
          label={getQuestionLabel('retirementFlexibility', isAdvisorMode)}
          options={FLEXIBILITY_OPTIONS.map((opt) => ({
            value: opt.value,
            label: `${opt.label} - ${opt.description}`,
          }))}
          value={formData.retirementFlexibility || ''}
          onChange={(e) => handleFieldChange('retirementFlexibility', e.target.value as RetirementVision['retirementFlexibility'])}
          error={getFieldError('retirementFlexibility')}
          placeholder="Select flexibility..."
        />
      </div>

      {/* Vision Description Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          {isAdvisorMode ? "Client's Retirement Vision" : 'Your Retirement Vision'}
        </h3>

        {/* Vision prompts */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Consider these questions as you describe {isAdvisorMode ? 'the client\'s' : 'your'} ideal retirement:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            {VISION_PROMPTS.map((prompt) => (
              <li key={prompt}>• {prompt}</li>
            ))}
          </ul>
        </div>

        <TextArea
          label={getQuestionLabel('visionDescription', isAdvisorMode)}
          value={formData.visionDescription || ''}
          onChange={(e) => handleFieldChange('visionDescription', e.target.value)}
          error={getFieldError('visionDescription')}
          placeholder={
            isAdvisorMode
              ? "Describe the client's ideal retirement..."
              : 'Paint a picture of your ideal retirement...'
          }
          rows={5}
        />
      </div>

      {/* Concerns Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Retirement Concerns
        </h3>

        <ConcernsSelector
          value={formData.topConcerns || []}
          onChange={(concerns) => handleFieldChange('topConcerns', concerns)}
          error={getFieldError('topConcerns')}
          isAdvisorMode={isAdvisorMode}
        />
      </div>

      {/* Outcomes Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Retirement Outcomes
        </h3>

        {/* Must-Have Outcomes */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('mustHaveOutcomes', isAdvisorMode)}
          </label>

          {/* Selected must-haves */}
          {formData.mustHaveOutcomes && formData.mustHaveOutcomes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.mustHaveOutcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {outcome}
                  <button
                    type="button"
                    onClick={() => handleRemoveMustHave(outcome)}
                    className="ml-1 hover:text-primary-dark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="text-sm text-gray-500 mb-2">Suggestions (click to add):</div>
          <div className="flex flex-wrap gap-2">
            {MUST_HAVE_SUGGESTIONS.filter((s) => !formData.mustHaveOutcomes?.includes(s)).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddMustHave(suggestion)}
                className="px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMustHave}
              onChange={(e) => setNewMustHave(e.target.value)}
              placeholder="Add custom outcome..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddMustHave(newMustHave)
                  setNewMustHave('')
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                handleAddMustHave(newMustHave)
                setNewMustHave('')
              }}
              disabled={!newMustHave}
            >
              Add
            </Button>
          </div>
          {getFieldError('mustHaveOutcomes') && (
            <p className="text-sm text-red-600">{getFieldError('mustHaveOutcomes')}</p>
          )}
        </div>

        {/* Nice-to-Have Outcomes */}
        <div className="space-y-3 pt-4">
          <label className="block text-sm font-medium text-gray-700">
            {getQuestionLabel('niceToHaveOutcomes', isAdvisorMode)}
          </label>

          {/* Selected nice-to-haves */}
          {formData.niceToHaveOutcomes && formData.niceToHaveOutcomes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.niceToHaveOutcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                >
                  {outcome}
                  <button
                    type="button"
                    onClick={() => handleRemoveNiceToHave(outcome)}
                    className="ml-1 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="text-sm text-gray-500 mb-2">Suggestions (click to add):</div>
          <div className="flex flex-wrap gap-2">
            {NICE_TO_HAVE_SUGGESTIONS.filter((s) => !formData.niceToHaveOutcomes?.includes(s)).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddNiceToHave(suggestion)}
                className="px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newNiceToHave}
              onChange={(e) => setNewNiceToHave(e.target.value)}
              placeholder="Add custom outcome..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddNiceToHave(newNiceToHave)
                  setNewNiceToHave('')
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                handleAddNiceToHave(newNiceToHave)
                setNewNiceToHave('')
              }}
              disabled={!newNiceToHave}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Lifestyle Priorities Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Lifestyle Priorities
        </h3>

        <LifestylePrioritiesRanking
          value={formData.lifestylePriorities || []}
          onChange={(priorities) => handleFieldChange('lifestylePriorities', priorities)}
          error={getFieldError('lifestylePriorities')}
          isAdvisorMode={isAdvisorMode}
        />
      </div>

      {/* Submit button */}
      <div className="pt-6 border-t border-gray-200">
        <Button type="submit" className="w-full sm:w-auto">
          {isAdvisorMode ? 'Save & Continue' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  )
}
