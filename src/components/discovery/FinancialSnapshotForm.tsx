/**
 * Financial Snapshot Form Component
 * Section 5 of the Discovery Wizard - captures light financial data
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Select, Button } from '@/components/common'
import { AccountsList } from './AccountsList'
import { CurrentIncomeList, RetirementIncomeList } from './IncomeSourcesList'
import { DebtList, AssetList } from './DebtAssetsList'
import {
  RESERVE_LOCATION_OPTIONS,
  MONTHS_OF_EXPENSES_OPTIONS,
  LIFE_INSURANCE_OPTIONS,
  FINANCIAL_SNAPSHOT_QUESTIONS,
  getQuestionLabel,
} from '@/data/financialSnapshotQuestions'
import { validateField, financialSnapshotFieldSchemas, validateFinancialSnapshot } from '@/services/validation'
import type {
  FinancialSnapshot,
  EmergencyReserves,
  InsuranceSummary,
  ReserveLocation,
  LifeInsuranceType,
} from '@/types/financialSnapshot'

interface FinancialSnapshotFormProps {
  initialData?: Partial<FinancialSnapshot>
  onSave: (data: FinancialSnapshot) => void
  onAutoSave?: (data: Partial<FinancialSnapshot>) => void
  isAdvisorMode?: boolean
  clientName?: string
}

export function FinancialSnapshotForm({
  initialData,
  onSave,
  onAutoSave,
  isAdvisorMode = false,
}: FinancialSnapshotFormProps): JSX.Element {
  // Form state
  const [formData, setFormData] = useState<Partial<FinancialSnapshot>>(() => ({
    incomeSourcesCurrent: [],
    incomeSourcesRetirement: [],
    investmentAccounts: [],
    debts: [],
    majorAssets: [],
    emergencyReserves: {
      monthsOfExpenses: 0,
      location: 'savings',
    },
    insuranceCoverage: {
      hasLifeInsurance: false,
      hasLongTermCare: false,
      hasDisability: false,
    },
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
    <K extends keyof FinancialSnapshot>(field: K, value: FinancialSnapshot[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => new Set(prev).add(field))

      // Validate field if it has a schema
      const schema = financialSnapshotFieldSchemas[field as keyof typeof financialSnapshotFieldSchemas]
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

  // Handle emergency reserves changes
  const handleEmergencyReservesChange = (updates: Partial<EmergencyReserves>): void => {
    setFormData((prev) => ({
      ...prev,
      emergencyReserves: {
        ...prev.emergencyReserves,
        ...updates,
      } as EmergencyReserves,
    }))
    setTouched((prev) => new Set(prev).add('emergencyReserves'))
  }

  // Handle insurance coverage changes
  const handleInsuranceChange = (updates: Partial<InsuranceSummary>): void => {
    setFormData((prev) => ({
      ...prev,
      insuranceCoverage: {
        ...prev.insuranceCoverage,
        ...updates,
      } as InsuranceSummary,
    }))
    setTouched((prev) => new Set(prev).add('insuranceCoverage'))
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    const result = validateFinancialSnapshot(formData)
    if (result.success && result.data) {
      onSave(result.data as FinancialSnapshot)
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Current Income Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Current Income
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.incomeSourcesCurrent.helpText}
        </p>

        <CurrentIncomeList
          value={formData.incomeSourcesCurrent || []}
          onChange={(sources) => handleFieldChange('incomeSourcesCurrent', sources)}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('incomeSourcesCurrent')}
        />
      </div>

      {/* Expected Retirement Income Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Expected Retirement Income
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.incomeSourcesRetirement.helpText}
        </p>

        <RetirementIncomeList
          value={formData.incomeSourcesRetirement || []}
          onChange={(sources) => handleFieldChange('incomeSourcesRetirement', sources)}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('incomeSourcesRetirement')}
        />
      </div>

      {/* Investment Accounts Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Investment Accounts
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.investmentAccounts.helpText}
        </p>

        <AccountsList
          value={formData.investmentAccounts || []}
          onChange={(accounts) => handleFieldChange('investmentAccounts', accounts)}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('investmentAccounts')}
        />
      </div>

      {/* Debts Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Debts & Liabilities
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.debts.helpText}
        </p>

        <DebtList
          value={formData.debts || []}
          onChange={(debts) => handleFieldChange('debts', debts)}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('debts')}
        />
      </div>

      {/* Major Assets Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Major Assets
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.majorAssets.helpText}
        </p>

        <AssetList
          value={formData.majorAssets || []}
          onChange={(assets) => handleFieldChange('majorAssets', assets)}
          isAdvisorMode={isAdvisorMode}
          error={getFieldError('majorAssets')}
        />
      </div>

      {/* Emergency Reserves Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Emergency Reserves
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.emergencyReserves.helpText}
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label={getQuestionLabel('emergencyReserves', isAdvisorMode)}
            options={MONTHS_OF_EXPENSES_OPTIONS.map((opt) => ({
              value: opt.value.toString(),
              label: opt.label,
            }))}
            value={formData.emergencyReserves?.monthsOfExpenses?.toString() || '0'}
            onChange={(e) =>
              handleEmergencyReservesChange({ monthsOfExpenses: parseInt(e.target.value) })
            }
            placeholder="Select..."
          />

          <Select
            label="Where are reserves held?"
            options={RESERVE_LOCATION_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            value={formData.emergencyReserves?.location || 'savings'}
            onChange={(e) =>
              handleEmergencyReservesChange({ location: e.target.value as ReserveLocation })
            }
            placeholder="Select location..."
          />
        </div>
        {getFieldError('emergencyReserves') && (
          <p className="text-sm text-red-600">{getFieldError('emergencyReserves')}</p>
        )}
      </div>

      {/* Insurance Coverage Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Insurance Coverage
        </h3>
        <p className="text-sm text-gray-500">
          {FINANCIAL_SNAPSHOT_QUESTIONS.insuranceCoverage.helpText}
        </p>

        <div className="space-y-4">
          {/* Life Insurance */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.insuranceCoverage?.hasLifeInsurance || false}
                onChange={(e) => handleInsuranceChange({ hasLifeInsurance: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-medium text-gray-900">Life Insurance</span>
            </label>

            {formData.insuranceCoverage?.hasLifeInsurance && (
              <Select
                label="Type of Life Insurance"
                options={LIFE_INSURANCE_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: `${opt.label} - ${opt.description}`,
                }))}
                value={formData.insuranceCoverage?.lifeInsuranceType || ''}
                onChange={(e) =>
                  handleInsuranceChange({ lifeInsuranceType: e.target.value as LifeInsuranceType })
                }
                placeholder="Select type..."
              />
            )}
          </div>

          {/* Long-Term Care */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.insuranceCoverage?.hasLongTermCare || false}
                onChange={(e) => handleInsuranceChange({ hasLongTermCare: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <span className="font-medium text-gray-900">Long-Term Care Insurance</span>
                <p className="text-sm text-gray-500">
                  Coverage for nursing home, assisted living, or in-home care
                </p>
              </div>
            </label>
          </div>

          {/* Disability */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.insuranceCoverage?.hasDisability || false}
                onChange={(e) => handleInsuranceChange({ hasDisability: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <span className="font-medium text-gray-900">Disability Insurance</span>
                <p className="text-sm text-gray-500">
                  Income protection if unable to work due to illness or injury
                </p>
              </div>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Notes (optional)
            </label>
            <input
              type="text"
              value={formData.insuranceCoverage?.notes || ''}
              onChange={(e) => handleInsuranceChange({ notes: e.target.value })}
              placeholder="Any additional details about coverage..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        {getFieldError('insuranceCoverage') && (
          <p className="text-sm text-red-600">{getFieldError('insuranceCoverage')}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-6 border-t border-gray-200">
        <Button type="submit" className="w-full sm:w-auto">
          Complete Discovery
        </Button>
      </div>
    </form>
  )
}
