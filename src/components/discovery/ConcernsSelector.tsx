/**
 * Concerns Selector Component
 * Multi-select component for retirement concerns with severity rating
 */

import { Select } from '@/components/common'
import { CONCERN_OPTIONS } from '@/data/retirementVisionQuestions'
import type { RetirementConcern, ConcernType, ConcernSeverity } from '@/types'

interface ConcernsSelectorProps {
  value: RetirementConcern[]
  onChange: (concerns: RetirementConcern[]) => void
  maxSelections?: number
  error?: string
  isAdvisorMode?: boolean
}

const SEVERITY_OPTIONS: Array<{ value: ConcernSeverity; label: string }> = [
  { value: 'minor', label: 'Minor concern' },
  { value: 'moderate', label: 'Moderate concern' },
  { value: 'significant', label: 'Significant concern' },
  { value: 'major', label: 'Major concern' },
]

export function ConcernsSelector({
  value,
  onChange,
  maxSelections = 5,
  error,
  isAdvisorMode = false,
}: ConcernsSelectorProps): JSX.Element {
  const selectedTypes = new Set(value.map((c) => c.type))

  const handleToggleConcern = (concernType: ConcernType): void => {
    if (selectedTypes.has(concernType)) {
      // Remove the concern
      onChange(value.filter((c) => c.type !== concernType))
    } else if (value.length < maxSelections) {
      // Add the concern with default severity
      onChange([...value, { type: concernType, severity: 'moderate' }])
    }
  }

  const handleSeverityChange = (concernType: ConcernType, severity: ConcernSeverity): void => {
    onChange(
      value.map((c) =>
        c.type === concernType ? { ...c, severity } : c
      )
    )
  }

  const handleNotesChange = (concernType: ConcernType, notes: string): void => {
    onChange(
      value.map((c) =>
        c.type === concernType ? { ...c, notes: notes || undefined } : c
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Selection count indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {isAdvisorMode
            ? `Select the client's top concerns (${value.length}/${maxSelections})`
            : `Select your top concerns (${value.length}/${maxSelections})`}
        </span>
        {value.length >= maxSelections && (
          <span className="text-amber-600 font-medium">Maximum reached</span>
        )}
      </div>

      {/* Concern options grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {CONCERN_OPTIONS.map((option) => {
          const isSelected = selectedTypes.has(option.value)
          const isDisabled = !isSelected && value.length >= maxSelections

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggleConcern(option.value)}
              disabled={isDisabled}
              className={`relative text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Checkbox indicator */}
              <div className="absolute top-3 right-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="pr-8">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="mt-1 text-sm text-gray-500">{option.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected concerns with severity */}
      {value.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-gray-900">
            {isAdvisorMode ? "Rate the client's concern level:" : 'Rate your concern level:'}
          </h4>

          <div className="space-y-3">
            {value.map((concern) => {
              const option = CONCERN_OPTIONS.find((o) => o.value === concern.type)
              if (!option) return null

              return (
                <div
                  key={concern.type}
                  className="p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="mt-2">
                        <Select
                          options={SEVERITY_OPTIONS}
                          value={concern.severity}
                          onChange={(e) =>
                            handleSeverityChange(
                              concern.type,
                              e.target.value as ConcernSeverity
                            )
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleConcern(concern.type)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label={`Remove ${option.label}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Optional notes for "other" concern type */}
                  {concern.type === 'other' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={concern.notes || ''}
                        onChange={(e) => handleNotesChange(concern.type, e.target.value)}
                        placeholder="Please describe your concern..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
