/**
 * Spouse Fields Component
 * Conditional fields for spouse/partner information in Basic Context section
 */

import { Input, Select, DateInput, TextArea } from '@/components/common'
import { EMPLOYMENT_STATUS_OPTIONS, getQuestionLabel } from '@/data/basicContextQuestions'
import type { SpouseInfo } from '@/types'

interface SpouseFieldsProps {
  data: Partial<SpouseInfo>
  errors: Record<string, string>
  onChange: (field: keyof SpouseInfo, value: unknown) => void
  isAdvisorMode?: boolean
}

export function SpouseFields({
  data,
  errors,
  onChange,
  isAdvisorMode = false,
}: SpouseFieldsProps): JSX.Element {
  // Format date for input
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Spouse/Partner Information</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Understanding your spouse's situation helps us plan for combined retirement income and survivor benefits.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* First Name */}
        <Input
          label={getQuestionLabel('spouseFirstName', isAdvisorMode)}
          value={data.firstName || ''}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={errors['spouse.firstName'] || errors.firstName}
          placeholder="First name"
        />

        {/* Birth Date */}
        <DateInput
          label={getQuestionLabel('spouseBirthDate', isAdvisorMode)}
          value={formatDateForInput(data.birthDate)}
          onChange={(e) => onChange('birthDate', new Date(e.target.value))}
          error={errors['spouse.birthDate'] || errors.birthDate}
          max={new Date().toISOString().split('T')[0]}
        />

        {/* Employment Status */}
        <div className="sm:col-span-2">
          <Select
            label={getQuestionLabel('spouseEmploymentStatus', isAdvisorMode)}
            options={EMPLOYMENT_STATUS_OPTIONS.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            placeholder="Select employment status..."
            value={data.employmentStatus || ''}
            onChange={(e) => onChange('employmentStatus', e.target.value)}
            error={errors['spouse.employmentStatus'] || errors.employmentStatus}
          />
        </div>
      </div>

      {/* Pension */}
      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hasPension || false}
            onChange={(e) => onChange('hasPension', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              {getQuestionLabel('spouseHasPension', isAdvisorMode)}
            </span>
            <p className="text-sm text-gray-500">
              This helps us plan for combined retirement income.
            </p>
          </div>
        </label>

        {data.hasPension && (
          <div className="mt-4 ml-7">
            <TextArea
              label={getQuestionLabel('spousePensionDetails', isAdvisorMode)}
              value={data.pensionDetails || ''}
              onChange={(e) => onChange('pensionDetails', e.target.value)}
              error={errors['spouse.pensionDetails'] || errors.pensionDetails}
              placeholder="Type of pension, approximate value, vesting status, etc."
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  )
}
