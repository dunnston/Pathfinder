/**
 * Tradeoff Exercise Component
 * Series of A vs B choices on a 5-point preference scale
 */

import { TRADEOFF_PAIRS } from '@/data/planningPreferencesQuestions'
import type { TradeoffPreference, TradeoffPosition } from '@/types'

interface TradeoffExerciseProps {
  value: TradeoffPreference[]
  onChange: (preferences: TradeoffPreference[]) => void
  error?: string
  isAdvisorMode?: boolean
}

const POSITION_OPTIONS: Array<{
  value: TradeoffPosition
  labelA: string
  labelB: string
}> = [
  { value: 'strongly_a', labelA: 'Strongly prefer', labelB: '' },
  { value: 'lean_a', labelA: 'Lean toward', labelB: '' },
  { value: 'neutral', labelA: '', labelB: '' },
  { value: 'lean_b', labelA: '', labelB: 'Lean toward' },
  { value: 'strongly_b', labelA: '', labelB: 'Strongly prefer' },
]

export function TradeoffExercise({
  value,
  onChange,
  error,
  isAdvisorMode = false,
}: TradeoffExerciseProps): JSX.Element {
  // Initialize preferences if empty
  if (value.length === 0) {
    const initialPreferences = TRADEOFF_PAIRS.map((pair) => ({
      tradeoff: pair.id,
      preference: 'neutral' as TradeoffPosition,
      optionA: pair.optionA,
      optionB: pair.optionB,
    }))
    onChange(initialPreferences)
    return <div className="animate-pulse">Loading...</div>
  }

  const handlePreferenceChange = (tradeoffId: string, position: TradeoffPosition): void => {
    onChange(
      value.map((pref) =>
        pref.tradeoff === tradeoffId ? { ...pref, preference: position } : pref
      )
    )
  }

  const getPreference = (tradeoffId: string): TradeoffPosition => {
    const pref = value.find((p) => p.tradeoff === tradeoffId)
    return pref?.preference || 'neutral'
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">
        {isAdvisorMode
          ? "For each pair of options, indicate which the client prefers. There are no right or wrong answers."
          : 'For each pair of options, indicate which you prefer. There are no right or wrong answers.'}
      </p>

      {TRADEOFF_PAIRS.map((pair, index) => {
        const currentPosition = getPreference(pair.id)

        return (
          <div
            key={pair.id}
            className="p-6 rounded-lg border border-gray-200 bg-white"
          >
            {/* Question number */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-sm text-gray-500">Tradeoff {index + 1} of {TRADEOFF_PAIRS.length}</span>
            </div>

            {/* Options header */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Option A */}
              <div className={`p-4 rounded-lg transition-colors ${
                currentPosition === 'strongly_a' || currentPosition === 'lean_a'
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="font-semibold text-gray-900">{pair.optionA}</div>
                <div className="mt-1 text-sm text-gray-600">{pair.descriptionA}</div>
              </div>

              {/* Option B */}
              <div className={`p-4 rounded-lg transition-colors ${
                currentPosition === 'strongly_b' || currentPosition === 'lean_b'
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="font-semibold text-gray-900">{pair.optionB}</div>
                <div className="mt-1 text-sm text-gray-600">{pair.descriptionB}</div>
              </div>
            </div>

            {/* Scale selector */}
            <div className="relative">
              {/* Labels */}
              <div className="flex justify-between mb-2 text-xs text-gray-500">
                <span>Strongly prefer A</span>
                <span>Neutral</span>
                <span>Strongly prefer B</span>
              </div>

              {/* Scale buttons */}
              <div className="flex items-center justify-between gap-2">
                {POSITION_OPTIONS.map((option) => {
                  const isSelected = currentPosition === option.value
                  const isOptionA = option.value === 'strongly_a' || option.value === 'lean_a'
                  const isOptionB = option.value === 'strongly_b' || option.value === 'lean_b'

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePreferenceChange(pair.id, option.value)}
                      className={`flex-1 h-12 rounded-lg border-2 transition-all ${
                        isSelected
                          ? isOptionA
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : isOptionB
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-gray-500 border-gray-500 text-white'
                          : 'bg-white border-gray-200 hover:border-gray-300 text-gray-400'
                      }`}
                      aria-label={
                        option.value === 'neutral'
                          ? 'Neutral'
                          : option.value.includes('_a')
                            ? `${option.labelA} ${pair.optionA}`
                            : `${option.labelB} ${pair.optionB}`
                      }
                    >
                      {isSelected && (
                        <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Position indicator */}
              <div className="mt-2 text-center text-sm font-medium">
                {currentPosition === 'strongly_a' && (
                  <span className="text-blue-600">Strongly prefer: {pair.optionA}</span>
                )}
                {currentPosition === 'lean_a' && (
                  <span className="text-blue-600">Lean toward: {pair.optionA}</span>
                )}
                {currentPosition === 'neutral' && (
                  <span className="text-gray-500">No preference</span>
                )}
                {currentPosition === 'lean_b' && (
                  <span className="text-green-600">Lean toward: {pair.optionB}</span>
                )}
                {currentPosition === 'strongly_b' && (
                  <span className="text-green-600">Strongly prefer: {pair.optionB}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
