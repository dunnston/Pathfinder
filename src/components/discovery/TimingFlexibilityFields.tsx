/**
 * Timing Flexibility Fields Component
 * Captures retirement timing flexibility preferences
 */

import { Select, TextArea } from '@/components/common'
import { TIMING_FLEXIBILITY_OPTIONS } from '@/data/riskComfortQuestions'
import type { TimingFlexibility } from '@/types/riskComfort'

interface TimingFlexibilityFieldsProps {
  value: Partial<TimingFlexibility>
  onChange: (value: Partial<TimingFlexibility>) => void
  isAdvisorMode?: boolean
  errors?: Record<string, string>
}

export function TimingFlexibilityFields({
  value,
  onChange,
  isAdvisorMode = false,
  errors,
}: TimingFlexibilityFieldsProps): JSX.Element {
  const handleChange = <K extends keyof TimingFlexibility>(
    field: K,
    fieldValue: TimingFlexibility[K]
  ): void => {
    onChange({ ...value, [field]: fieldValue })
  }

  const youOrClient = isAdvisorMode ? 'the client' : 'you'
  const yourOrClients = isAdvisorMode ? "the client's" : 'your'

  return (
    <div className="space-y-6">
      {/* Willing to Delay */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Would {youOrClient} be willing to delay retirement if circumstances required?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('willingToDelay', true)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              value.willingToDelay === true
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value.willingToDelay === true
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}
              >
                {value.willingToDelay === true && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">Yes</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleChange('willingToDelay', false)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              value.willingToDelay === false
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value.willingToDelay === false
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}
              >
                {value.willingToDelay === false && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">No</span>
            </div>
          </button>
        </div>
        {errors?.willingToDelay && (
          <p className="text-sm text-red-600">{errors.willingToDelay}</p>
        )}
      </div>

      {/* Max Delay Years - only show if willing to delay */}
      {value.willingToDelay && (
        <Select
          label={`If needed, how long would ${youOrClient} be willing to delay retirement?`}
          options={TIMING_FLEXIBILITY_OPTIONS.maxDelayYears.map((opt) => ({
            value: opt.value.toString(),
            label: opt.label,
          }))}
          value={value.maxDelayYears?.toString() || ''}
          onChange={(e) => handleChange('maxDelayYears', parseInt(e.target.value))}
          error={errors?.maxDelayYears}
          placeholder="Select maximum delay..."
        />
      )}

      {/* Willing to Retire Early */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Would {youOrClient} consider retiring earlier if financial circumstances allowed?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('willingToRetireEarly', true)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              value.willingToRetireEarly === true
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value.willingToRetireEarly === true
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}
              >
                {value.willingToRetireEarly === true && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">Yes</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleChange('willingToRetireEarly', false)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              value.willingToRetireEarly === false
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value.willingToRetireEarly === false
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}
              >
                {value.willingToRetireEarly === false && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">No</span>
            </div>
          </button>
        </div>
        {errors?.willingToRetireEarly && (
          <p className="text-sm text-red-600">{errors.willingToRetireEarly}</p>
        )}
      </div>

      {/* Conditions - optional field */}
      <TextArea
        label={`Any specific conditions that would affect ${yourOrClients} retirement timing?`}
        value={value.conditions || ''}
        onChange={(e) => handleChange('conditions', e.target.value)}
        placeholder={
          isAdvisorMode
            ? 'e.g., Client needs to keep healthcare coverage until spouse turns 65, wants to wait until mortgage is paid off...'
            : 'e.g., I need to keep healthcare coverage until my spouse turns 65, want to wait until the mortgage is paid off...'
        }
        rows={3}
        helperText="Optional - note any life events or milestones that affect timing"
        error={errors?.conditions}
      />
    </div>
  )
}
