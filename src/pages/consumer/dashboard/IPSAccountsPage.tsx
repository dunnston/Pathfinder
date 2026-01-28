/**
 * IPS Accounts Page
 * Manage investment accounts and holdings
 */

import { useState } from 'react';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { Button, LoadingSpinner } from '@/components/common';
import { AccountCard, AccountForm, HoldingForm } from '@/components/ips';
import { useDashboardStore } from '@/stores';
import type { IPSAccount } from '@/types/dashboard';

export function IPSAccountsPage(): JSX.Element {
  const { investmentPolicy, _hasHydrated } = useDashboardStore();
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IPSAccount | undefined>();
  const [showHoldingForm, setShowHoldingForm] = useState(false);
  const [holdingAccountId, setHoldingAccountId] = useState<string>('');

  const accounts = investmentPolicy?.accounts || [];

  const handleEditAccount = (account: IPSAccount) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const handleAddHolding = (accountId: string) => {
    setHoldingAccountId(accountId);
    setShowHoldingForm(true);
  };

  const handleCloseAccountForm = () => {
    setShowAccountForm(false);
    setEditingAccount(undefined);
  };

  const handleCloseHoldingForm = () => {
    setShowHoldingForm(false);
    setHoldingAccountId('');
  };

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalHoldings = accounts.reduce((sum, acc) => sum + acc.holdings.length, 0);

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Investment Accounts">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading accounts...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Investment Accounts"
      subtitle="Manage your accounts and holdings"
      headerActions={
        <Button onClick={() => setShowAccountForm(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Account
        </Button>
      }
    >
      <DashboardPage>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Accounts</p>
            <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Holdings</p>
            <p className="text-2xl font-bold text-gray-900">{totalHoldings}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Average Per Account</p>
            <p className="text-2xl font-bold text-gray-900">
              ${accounts.length > 0
                ? Math.round(totalBalance / accounts.length).toLocaleString()
                : '0'}
            </p>
          </div>
        </div>

        {/* Account List */}
        {accounts.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Accounts Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Add your investment accounts to track your portfolio allocation and get rebalancing recommendations.
            </p>
            <Button onClick={() => setShowAccountForm(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
                onAddHolding={handleAddHolding}
              />
            ))}
          </div>
        )}

        {/* Account Form Modal */}
        <AccountForm
          isOpen={showAccountForm}
          onClose={handleCloseAccountForm}
          editAccount={editingAccount}
        />

        {/* Holding Form Modal */}
        <HoldingForm
          isOpen={showHoldingForm}
          onClose={handleCloseHoldingForm}
          accountId={holdingAccountId}
        />
      </DashboardPage>
    </DashboardLayout>
  );
}

export default IPSAccountsPage;
