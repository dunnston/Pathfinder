/**
 * Account Card Component
 * Displays an IPS account with expandable holdings
 */

import { useState } from 'react';
import type { IPSAccount } from '@/types/dashboard';
import { ASSET_CLASS_LABELS } from '@/types/dashboard';
import { Button } from '@/components/common';
import { useDashboardStore } from '@/stores';

interface AccountCardProps {
  /** The account to display */
  account: IPSAccount;
  /** Edit handler */
  onEdit: (account: IPSAccount) => void;
  /** Add holding handler */
  onAddHolding: (accountId: string) => void;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  tsp_traditional: 'TSP (Traditional)',
  tsp_roth: 'TSP (Roth)',
  traditional_ira: 'Traditional IRA',
  roth_ira: 'Roth IRA',
  '401k': '401(k)',
  taxable_brokerage: 'Taxable Brokerage',
  savings: 'Savings',
  other: 'Other',
};

export function AccountCard({ account, onEdit, onAddHolding }: AccountCardProps): JSX.Element {
  const { removeIPSAccount, removeHolding } = useDashboardStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    removeIPSAccount(account.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteHolding = (holdingId: string) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      removeHolding(account.id, holdingId);
    }
  };

  const holdingsValue = account.holdings.reduce((sum, h) => sum + h.currentValue, 0);

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
              </span>
            </div>
            {account.custodian && (
              <p className="mt-1 text-sm text-gray-500">{account.custodian}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">
              ${account.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">
              as of {new Date(account.asOfDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{account.holdings.length} holdings</span>
          </div>
          {holdingsValue > 0 && holdingsValue !== account.currentBalance && (
            <div className="text-yellow-600">
              Holdings total: ${holdingsValue.toLocaleString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(account)}>
            Edit
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onAddHolding(account.id)}>
            Add Holding
          </Button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? 'Hide' : 'Show'} Holdings
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-red-600">Delete this account?</span>
              <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="ml-auto text-sm text-gray-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Expandable Holdings Section */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Holdings</h4>
          {account.holdings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No holdings added yet. Click &quot;Add Holding&quot; to track individual investments.
            </p>
          ) : (
            <div className="space-y-2">
              {account.holdings.map((holding) => (
                <div
                  key={holding.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{holding.name}</span>
                      {holding.symbol && (
                        <span className="text-xs text-gray-500">({holding.symbol})</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {ASSET_CLASS_LABELS[holding.assetClass]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      ${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => handleDeleteHolding(holding.id)}
                      className="text-gray-400 hover:text-red-600"
                      aria-label="Remove holding"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
