/**
 * Federal Employee Fields Component
 * Conditional fields for federal employees in Basic Context section
 */

import { Select, NumberInput } from '@/components/common'
import {
  FEDERAL_AGENCY_OPTIONS,
  RETIREMENT_SYSTEM_OPTIONS,
  PAY_GRADE_OPTIONS,
  STEP_OPTIONS,
  getQuestionLabel,
} from '@/data/basicContextQuestions'
import type { FederalEmployeeInfo } from '@/types'

interface FederalEmployeeFieldsProps {
  data: Partial<FederalEmployeeInfo>
  errors: Record<string, string>
  onChange: (field: keyof FederalEmployeeInfo, value: unknown) => void
  isAdvisorMode?: boolean
}

export function FederalEmployeeFields({
  data,
  errors,
  onChange,
  isAdvisorMode = false,
}: FederalEmployeeFieldsProps): JSX.Element {
  return (
    <div className="space-y-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Federal Employment Details</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Agency */}
        <div className="sm:col-span-2">
          <Select
            label={getQuestionLabel('agency', isAdvisorMode)}
            options={FEDERAL_AGENCY_OPTIONS.map((agency) => ({ value: agency, label: agency }))}
            placeholder="Select agency..."
            value={data.agency || ''}
            onChange={(e) => onChange('agency', e.target.value)}
            error={errors.agency}
          />
        </div>

        {/* Years of Service */}
        <NumberInput
          label={getQuestionLabel('yearsOfService', isAdvisorMode)}
          min={0}
          max={50}
          value={data.yearsOfService ?? ''}
          onChange={(e) => onChange('yearsOfService', Number(e.target.value))}
          error={errors.yearsOfService}
          helperText="Include all creditable service time"
        />

        {/* Retirement System */}
        <Select
          label={getQuestionLabel('retirementSystem', isAdvisorMode)}
          options={RETIREMENT_SYSTEM_OPTIONS.map((sys) => ({
            value: sys.value,
            label: `${sys.label} - ${sys.description}`,
          }))}
          placeholder="Select retirement system..."
          value={data.retirementSystem || ''}
          onChange={(e) => onChange('retirementSystem', e.target.value)}
          error={errors.retirementSystem}
        />

        {/* Pay Grade */}
        <Select
          label={getQuestionLabel('payGrade', isAdvisorMode)}
          options={PAY_GRADE_OPTIONS.map((grade) => ({ value: grade, label: grade }))}
          placeholder="Select pay grade..."
          value={data.payGrade || ''}
          onChange={(e) => onChange('payGrade', e.target.value)}
          error={errors.payGrade}
        />

        {/* Step */}
        <Select
          label={getQuestionLabel('step', isAdvisorMode)}
          options={STEP_OPTIONS.map((step) => ({ value: String(step), label: `Step ${step}` }))}
          placeholder="Select step..."
          value={data.step ? String(data.step) : ''}
          onChange={(e) => onChange('step', Number(e.target.value))}
          error={errors.step}
        />
      </div>

      {/* Law Enforcement / Firefighter */}
      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isLawEnforcement || false}
            onChange={(e) => onChange('isLawEnforcement', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              {getQuestionLabel('isLawEnforcement', isAdvisorMode)}
            </span>
            <p className="text-sm text-gray-500">
              These positions have special early retirement provisions (6c coverage).
            </p>
          </div>
        </label>
      </div>

      {/* Military Service */}
      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hasMilitaryService || false}
            onChange={(e) => onChange('hasMilitaryService', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              {getQuestionLabel('hasMilitaryService', isAdvisorMode)}
            </span>
            <p className="text-sm text-gray-500">
              Military service may be creditable toward federal retirement.
            </p>
          </div>
        </label>

        {data.hasMilitaryService && (
          <div className="mt-4 ml-7">
            <NumberInput
              label={getQuestionLabel('militaryServiceYears', isAdvisorMode)}
              min={0}
              max={40}
              value={data.militaryServiceYears ?? ''}
              onChange={(e) => onChange('militaryServiceYears', Number(e.target.value))}
              error={errors.militaryServiceYears}
            />
          </div>
        )}
      </div>
    </div>
  )
}
