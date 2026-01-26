/**
 * Accounts List Component
 * Allows adding/removing investment accounts with balance ranges
 */

import { useState } from 'react'
import { Button, Select } from '@/components/common'
import {
  ACCOUNT_TYPE_OPTIONS,
  BALANCE_RANGE_OPTIONS,
  estimateTotalFromRanges,
  formatCurrency,
} from '@/data/financialSnapshotQuestions'
import type { AccountSummary, AccountType, BalanceRange } from '@/types/financialSnapshot'

interface AccountsListProps {
  value: AccountSummary[]
  onChange: (accounts: AccountSummary[]) => void
  isAdvisorMode?: boolean
  error?: string
}

export function AccountsList({
  value,
  onChange,
  isAdvisorMode = false,
  error,
}: AccountsListProps): JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState<Partial<AccountSummary>>({})

  const handleAddAccount = (): void => {
    if (newAccount.type && newAccount.approximateBalance) {
      onChange([
        ...value,
        {
          type: newAccount.type,
          approximateBalance: newAccount.approximateBalance,
          notes: newAccount.notes,
        },
      ])
      setNewAccount({})
      setShowAddForm(false)
    }
  }

  const handleRemoveAccount = (index: number): void => {
    const updated = [...value]
    updated.splice(index, 1)
    onChange(updated)
  }

  // Get already selected account types
  const selectedTypes = value.map((a) => a.type)
  const availableTypes = ACCOUNT_TYPE_OPTIONS.filter(
    (opt) => !selectedTypes.includes(opt.value)
  )

  // Calculate estimated total
  const estimatedTotal = estimateTotalFromRanges(value)

  return (
    <div className="space-y-4">
      {/* Account list */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((account, index) => {
            const accountType = ACCOUNT_TYPE_OPTIONS.find((a) => a.value === account.type)
            const balanceRange = BALANCE_RANGE_OPTIONS.find(
              (b) => b.value === account.approximateBalance
            )

            return (
              <div
                key={`${account.type}-${index}`}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        accountType?.taxType === 'pre-tax'
                          ? 'bg-blue-100 text-blue-700'
                          : accountType?.taxType === 'post-tax'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {accountType?.taxType === 'pre-tax'
                        ? 'Pre-tax'
                        : accountType?.taxType === 'post-tax'
                          ? 'Tax-free'
                          : 'Taxable'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {accountType?.label || account.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {balanceRange?.label || account.approximateBalance}
                  </p>
                  {account.notes && (
                    <p className="text-xs text-gray-500 mt-1">{account.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAccount(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove account"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}

          {/* Estimated total */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <span className="font-medium text-gray-700">Estimated Total</span>
            <span className="text-lg font-semibold text-primary">
              ~{formatCurrency(estimatedTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Add account form */}
      {showAddForm ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Add Account</h4>

          <Select
            label="Account Type"
            options={availableTypes.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            value={newAccount.type || ''}
            onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as AccountType })}
            placeholder="Select account type..."
          />

          <Select
            label="Approximate Balance"
            options={BALANCE_RANGE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newAccount.approximateBalance || ''}
            onChange={(e) =>
              setNewAccount({ ...newAccount, approximateBalance: e.target.value as BalanceRange })
            }
            placeholder="Select balance range..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={newAccount.notes || ''}
              onChange={(e) => setNewAccount({ ...newAccount, notes: e.target.value })}
              placeholder="Any additional details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddAccount}
              disabled={!newAccount.type || !newAccount.approximateBalance}
            >
              Add Account
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false)
                setNewAccount({})
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
          disabled={availableTypes.length === 0}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Investment Account
        </Button>
      )}

      {value.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 text-center py-2">
          No accounts added yet. Click above to add {isAdvisorMode ? "the client's" : 'your'} investment accounts.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
