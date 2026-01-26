/**
 * Debt and Assets List Components
 * Handles adding/removing debts and major assets with balance ranges
 */

import { useState } from 'react'
import { Button, Select, Input } from '@/components/common'
import {
  DEBT_TYPE_OPTIONS,
  ASSET_TYPE_OPTIONS,
  BALANCE_RANGE_OPTIONS,
  estimateTotalFromRanges,
  formatCurrency,
} from '@/data/financialSnapshotQuestions'
import type {
  DebtSummary,
  DebtType,
  AssetSummary,
  AssetType,
  BalanceRange,
} from '@/types/financialSnapshot'

/** Props for debt list */
interface DebtListProps {
  value: DebtSummary[]
  onChange: (debts: DebtSummary[]) => void
  isAdvisorMode?: boolean
  error?: string
}

/** Props for asset list */
interface AssetListProps {
  value: AssetSummary[]
  onChange: (assets: AssetSummary[]) => void
  isAdvisorMode?: boolean
  error?: string
}

/**
 * Debt List Component
 */
export function DebtList({
  value,
  onChange,
  isAdvisorMode = false,
  error,
}: DebtListProps): JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDebt, setNewDebt] = useState<Partial<DebtSummary>>({})

  const handleAddDebt = (): void => {
    if (newDebt.type && newDebt.approximateBalance) {
      onChange([
        ...value,
        {
          type: newDebt.type,
          approximateBalance: newDebt.approximateBalance,
          yearsRemaining: newDebt.yearsRemaining,
          notes: newDebt.notes,
        },
      ])
      setNewDebt({})
      setShowAddForm(false)
    }
  }

  const handleRemoveDebt = (index: number): void => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  // Calculate estimated total debt
  const estimatedTotal = estimateTotalFromRanges(value)

  return (
    <div className="space-y-4">
      {/* Debt list */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((debt, index) => {
            const debtType = DEBT_TYPE_OPTIONS.find((d) => d.value === debt.type)
            const balanceRange = BALANCE_RANGE_OPTIONS.find(
              (b) => b.value === debt.approximateBalance
            )

            return (
              <div
                key={`${debt.type}-${index}`}
                className="flex items-start gap-4 p-4 bg-red-50/50 rounded-lg border border-red-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {debtType?.label || debt.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {balanceRange?.label || debt.approximateBalance}
                  </p>
                  {debt.yearsRemaining && (
                    <p className="text-xs text-gray-500 mt-1">
                      ~{debt.yearsRemaining} years remaining
                    </p>
                  )}
                  {debt.notes && (
                    <p className="text-xs text-gray-500 mt-1">{debt.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDebt(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove debt"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}

          {/* Estimated total */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="font-medium text-red-700">Estimated Total Debt</span>
            <span className="text-lg font-semibold text-red-800">
              ~{formatCurrency(estimatedTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Add Debt</h4>

          <Select
            label="Debt Type"
            options={DEBT_TYPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            value={newDebt.type || ''}
            onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value as DebtType })}
            placeholder="Select debt type..."
          />

          <Select
            label="Approximate Balance"
            options={BALANCE_RANGE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newDebt.approximateBalance || ''}
            onChange={(e) =>
              setNewDebt({ ...newDebt, approximateBalance: e.target.value as BalanceRange })
            }
            placeholder="Select balance range..."
          />

          <Input
            label="Years Remaining (optional)"
            type="number"
            value={newDebt.yearsRemaining?.toString() || ''}
            onChange={(e) =>
              setNewDebt({ ...newDebt, yearsRemaining: parseInt(e.target.value) || undefined })
            }
            placeholder="e.g., 15"
            helperText="Approximate years until paid off"
          />

          <Input
            label="Notes (optional)"
            value={newDebt.notes || ''}
            onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
            placeholder="Any additional details..."
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddDebt}
              disabled={!newDebt.type || !newDebt.approximateBalance}
            >
              Add Debt
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false)
                setNewDebt({})
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
          Add Debt
        </Button>
      )}

      {value.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-2">
          No debts added. Click above if {isAdvisorMode ? 'the client has' : 'you have'} any debts.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

/**
 * Major Assets List Component
 */
export function AssetList({
  value,
  onChange,
  error,
}: AssetListProps): JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAsset, setNewAsset] = useState<Partial<AssetSummary>>({})

  const handleAddAsset = (): void => {
    if (newAsset.type) {
      onChange([
        ...value,
        {
          type: newAsset.type,
          approximateValue: newAsset.approximateValue,
          notes: newAsset.notes,
        },
      ])
      setNewAsset({})
      setShowAddForm(false)
    }
  }

  const handleRemoveAsset = (index: number): void => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  // Calculate estimated total assets
  const estimatedTotal = estimateTotalFromRanges(
    value.map((a) => ({ approximateBalance: a.approximateValue }))
  )

  return (
    <div className="space-y-4">
      {/* Asset list */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((asset, index) => {
            const assetType = ASSET_TYPE_OPTIONS.find((a) => a.value === asset.type)
            const valueRange = asset.approximateValue
              ? BALANCE_RANGE_OPTIONS.find((b) => b.value === asset.approximateValue)
              : null

            return (
              <div
                key={`${asset.type}-${index}`}
                className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {assetType?.label || asset.type}
                    </span>
                  </div>
                  {valueRange && (
                    <p className="text-sm text-gray-600 mt-1">{valueRange.label}</p>
                  )}
                  {asset.notes && (
                    <p className="text-xs text-gray-500 mt-1">{asset.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAsset(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove asset"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}

          {/* Estimated total */}
          {estimatedTotal > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-700">Estimated Total Assets</span>
              <span className="text-lg font-semibold text-blue-800">
                ~{formatCurrency(estimatedTotal)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Add Major Asset</h4>

          <Select
            label="Asset Type"
            options={ASSET_TYPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            value={newAsset.type || ''}
            onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as AssetType })}
            placeholder="Select asset type..."
          />

          <Select
            label="Approximate Value (optional)"
            options={BALANCE_RANGE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newAsset.approximateValue || ''}
            onChange={(e) =>
              setNewAsset({ ...newAsset, approximateValue: e.target.value as BalanceRange })
            }
            placeholder="Select value range..."
          />

          <Input
            label="Notes (optional)"
            value={newAsset.notes || ''}
            onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
            placeholder="e.g., Primary residence in Austin, TX"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddAsset}
              disabled={!newAsset.type}
            >
              Add Asset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false)
                setNewAsset({})
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
          Add Major Asset
        </Button>
      )}

      {value.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-2">
          No major assets added. Click above to add property, vehicles, or other significant assets.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
