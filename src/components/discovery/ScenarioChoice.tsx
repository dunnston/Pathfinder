/**
 * Scenario Choice Component
 * Displays a scenario with multiple choice options for risk assessment
 */

import { useState } from 'react'

interface ScenarioOption {
  value: string
  label: string
  description: string
  riskScore: number
}

interface Scenario {
  id: string
  scenario: string
  modeScenario?: [string, string]
  options: ScenarioOption[]
}

interface ScenarioChoiceProps {
  scenarios: Scenario[]
  values: Record<string, string>
  onChange: (scenarioId: string, value: string) => void
  isAdvisorMode?: boolean
  error?: string
}

export function ScenarioChoice({
  scenarios,
  values,
  onChange,
  isAdvisorMode = false,
  error,
}: ScenarioChoiceProps): JSX.Element {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(
    scenarios[0]?.id || null
  )

  const getScenarioText = (scenario: Scenario): string => {
    if (scenario.modeScenario) {
      return isAdvisorMode ? scenario.modeScenario[1] : scenario.modeScenario[0]
    }
    return scenario.scenario
  }

  const handleOptionSelect = (scenarioId: string, optionValue: string): void => {
    onChange(scenarioId, optionValue)

    // Auto-advance to next unanswered scenario
    const currentIndex = scenarios.findIndex((s) => s.id === scenarioId)
    const nextUnanswered = scenarios.find(
      (s, i) => i > currentIndex && !values[s.id]
    )
    if (nextUnanswered) {
      setExpandedScenario(nextUnanswered.id)
    }
  }

  const completedCount = scenarios.filter((s) => values[s.id]).length

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>
          {completedCount} of {scenarios.length} scenarios completed
        </span>
        <div className="flex gap-1">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`w-3 h-3 rounded-full ${
                values[scenario.id] ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-4">
        {scenarios.map((scenario, index) => {
          const isExpanded = expandedScenario === scenario.id
          const selectedValue = values[scenario.id]
          const selectedOption = scenario.options.find(
            (o) => o.value === selectedValue
          )

          return (
            <div
              key={scenario.id}
              className={`border rounded-lg transition-all duration-200 ${
                isExpanded
                  ? 'border-primary bg-white shadow-sm'
                  : selectedValue
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 bg-white'
              }`}
            >
              {/* Scenario header - clickable to expand */}
              <button
                type="button"
                onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                className="w-full px-4 py-3 text-left flex items-start gap-3"
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedValue
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {selectedValue ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      isExpanded ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {getScenarioText(scenario)}
                  </p>
                  {!isExpanded && selectedOption && (
                    <p className="text-sm text-primary mt-1">
                      Selected: {selectedOption.label}
                    </p>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded options */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {scenario.options.map((option) => {
                      const isSelected = selectedValue === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleOptionSelect(scenario.id, option.value)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-medium text-sm ${
                                  isSelected ? 'text-primary' : 'text-gray-900'
                                }`}
                              >
                                {option.label}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}
