/**
 * Income Sources List Component
 * Handles both current income and expected retirement income
 */

import { useState } from 'react'
import { Button, Select, Input } from '@/components/common'
import {
  INCOME_SOURCE_OPTIONS,
  RETIREMENT_INCOME_OPTIONS,
  formatCurrency,
} from '@/data/financialSnapshotQuestions'
import type {
  IncomeSource,
  IncomeSourceType,
  ExpectedRetirementIncome,
  RetirementIncomeType,
} from '@/types/financialSnapshot'

/** Props for current income list */
interface CurrentIncomeListProps {
  value: IncomeSource[]
  onChange: (sources: IncomeSource[]) => void
  isAdvisorMode?: boolean
  error?: string
}

/** Props for retirement income list */
interface RetirementIncomeListProps {
  value: ExpectedRetirementIncome[]
  onChange: (sources: ExpectedRetirementIncome[]) => void
  isAdvisorMode?: boolean
  error?: string
}

/**
 * Current Income Sources List
 */
export function CurrentIncomeList({
  value,
  onChange,
  error,
}: CurrentIncomeListProps): JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState<Partial<IncomeSource>>({ isPrimary: false })

  const handleAddSource = (): void => {
    if (newSource.type && newSource.annualAmount) {
      // If this is marked as primary, unset other primaries
      let updatedList = [...value]
      if (newSource.isPrimary) {
        updatedList = updatedList.map((s) => ({ ...s, isPrimary: false }))
      }

      onChange([
        ...updatedList,
        {
          type: newSource.type,
          description: newSource.description || '',
          annualAmount: newSource.annualAmount,
          isPrimary: newSource.isPrimary || false,
        },
      ])
      setNewSource({ isPrimary: false })
      setShowAddForm(false)
    }
  }

  const handleRemoveSource = (index: number): void => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  const handleSetPrimary = (index: number): void => {
    const updated = value.map((s, i) => ({
      ...s,
      isPrimary: i === index,
    }))
    onChange(updated)
  }

  // Calculate total income
  const totalIncome = value.reduce((sum, s) => sum + s.annualAmount, 0)

  return (
    <div className="space-y-4">
      {/* Income list */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((source, index) => {
            const sourceType = INCOME_SOURCE_OPTIONS.find((s) => s.value === source.type)

            return (
              <div
                key={`${source.type}-${index}`}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {sourceType?.label || source.type}
                    </span>
                    {source.isPrimary && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(source.annualAmount)}/year
                  </p>
                  {source.description && (
                    <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!source.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="text-sm text-gray-500 hover:text-primary"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove source"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <span className="font-medium text-gray-700">Total Annual Income</span>
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(totalIncome)}
            </span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Add Income Source</h4>

          <Select
            label="Income Type"
            options={INCOME_SOURCE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newSource.type || ''}
            onChange={(e) => setNewSource({ ...newSource, type: e.target.value as IncomeSourceType })}
            placeholder="Select income type..."
          />

          <Input
            label="Annual Amount"
            type="number"
            value={newSource.annualAmount?.toString() || ''}
            onChange={(e) => setNewSource({ ...newSource, annualAmount: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 75000"
            helperText="Approximate annual amount before taxes"
          />

          <Input
            label="Description (optional)"
            value={newSource.description || ''}
            onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
            placeholder="e.g., Federal GS-13 salary"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newSource.isPrimary || false}
              onChange={(e) => setNewSource({ ...newSource, isPrimary: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">This is the primary income source</span>
          </label>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddSource}
              disabled={!newSource.type || !newSource.annualAmount}
            >
              Add Source
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false)
                setNewSource({ isPrimary: false })
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Income Source
        </Button>
      )}

      {value.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-2">
          No income sources added yet.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

/**
 * Expected Retirement Income List
 */
export function RetirementIncomeList({
  value,
  onChange,
  error,
}: RetirementIncomeListProps): JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState<Partial<ExpectedRetirementIncome>>({})

  const handleAddSource = (): void => {
    if (newSource.type) {
      const sourceOption = RETIREMENT_INCOME_OPTIONS.find((o) => o.value === newSource.type)
      onChange([
        ...value,
        {
          type: newSource.type,
          estimatedAnnualAmount: newSource.estimatedAnnualAmount,
          startAge: newSource.startAge,
          isGuaranteed: sourceOption?.isGuaranteed || false,
          notes: newSource.notes,
        },
      ])
      setNewSource({})
      setShowAddForm(false)
    }
  }

  const handleRemoveSource = (index: number): void => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  // Calculate totals
  const guaranteedIncome = value
    .filter((s) => s.isGuaranteed)
    .reduce((sum, s) => sum + (s.estimatedAnnualAmount || 0), 0)
  const variableIncome = value
    .filter((s) => !s.isGuaranteed)
    .reduce((sum, s) => sum + (s.estimatedAnnualAmount || 0), 0)

  return (
    <div className="space-y-4">
      {/* Income list */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((source, index) => {
            const sourceType = RETIREMENT_INCOME_OPTIONS.find((s) => s.value === source.type)

            return (
              <div
                key={`${source.type}-${index}`}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {sourceType?.label || source.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        source.isGuaranteed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {source.isGuaranteed ? 'Guaranteed' : 'Variable'}
                    </span>
                  </div>
                  {source.estimatedAnnualAmount && (
                    <p className="text-sm text-gray-600 mt-1">
                      ~{formatCurrency(source.estimatedAnnualAmount)}/year
                    </p>
                  )}
                  {source.startAge && (
                    <p className="text-xs text-gray-500 mt-1">
                      Starting at age {source.startAge}
                    </p>
                  )}
                  {source.notes && (
                    <p className="text-xs text-gray-500 mt-1">{source.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSource(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove source"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}

          {/* Totals */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">Guaranteed Income</span>
              <p className="text-lg font-semibold text-green-800">
                {formatCurrency(guaranteedIncome)}/year
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-sm text-yellow-700">Variable Income</span>
              <p className="text-lg font-semibold text-yellow-800">
                {formatCurrency(variableIncome)}/year
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Add Expected Retirement Income</h4>

          <Select
            label="Income Type"
            options={RETIREMENT_INCOME_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} (${opt.isGuaranteed ? 'Guaranteed' : 'Variable'})`,
            }))}
            value={newSource.type || ''}
            onChange={(e) => setNewSource({ ...newSource, type: e.target.value as RetirementIncomeType })}
            placeholder="Select income type..."
          />

          <Input
            label="Estimated Annual Amount (optional)"
            type="number"
            value={newSource.estimatedAnnualAmount?.toString() || ''}
            onChange={(e) =>
              setNewSource({ ...newSource, estimatedAnnualAmount: parseInt(e.target.value) || undefined })
            }
            placeholder="e.g., 30000"
            helperText="Your best estimate - this can be refined later"
          />

          <Input
            label="Start Age (optional)"
            type="number"
            value={newSource.startAge?.toString() || ''}
            onChange={(e) =>
              setNewSource({ ...newSource, startAge: parseInt(e.target.value) || undefined })
            }
            placeholder="e.g., 62"
            helperText="Age when you expect to start receiving this income"
          />

          <Input
            label="Notes (optional)"
            value={newSource.notes || ''}
            onChange={(e) => setNewSource({ ...newSource, notes: e.target.value })}
            placeholder="Any additional details..."
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddSource}
              disabled={!newSource.type}
            >
              Add Source
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false)
                setNewSource({})
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Retirement Income Source
        </Button>
      )}

      {value.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-2">
          No retirement income sources added yet.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
