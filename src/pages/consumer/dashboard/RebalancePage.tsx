/**
 * Rebalance Page
 * Portfolio rebalancing recommendations
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { Button, LoadingSpinner } from '@/components/common';
import { RebalanceTable } from '@/components/ips';
import { useDashboardStore } from '@/stores';

export function RebalancePage(): JSX.Element {
  const {
    investmentPolicy,
    calculateRebalanceRecommendations,
    recordRebalance,
    _hasHydrated,
  } = useDashboardStore();

  // Calculate rebalance recommendations
  const recommendations = useMemo(() => {
    return calculateRebalanceRecommendations();
  }, [calculateRebalanceRecommendations]);

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    if (!investmentPolicy) return 0;
    return investmentPolicy.accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  }, [investmentPolicy]);

  const threshold = investmentPolicy?.rebalanceThreshold || 5;
  const lastRebalance = investmentPolicy?.lastRebalanceDate;
  const needsRebalancing = recommendations.some((r) => r.action !== 'hold');

  const handleMarkRebalanced = () => {
    if (window.confirm('Mark this portfolio as rebalanced? This will update your last rebalance date.')) {
      recordRebalance();
    }
  };

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Portfolio Rebalance">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading rebalance data...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No accounts state
  if (!investmentPolicy || investmentPolicy.accounts.length === 0) {
    return (
      <DashboardLayout
        title="Portfolio Rebalance"
        subtitle="Review allocation and rebalancing recommendations"
      >
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Accounts First</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Add your investment accounts and holdings to see rebalancing recommendations based on your target allocation.
            </p>
            <Link to="/consumer/dashboard/ips/accounts">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Accounts
              </Button>
            </Link>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No target allocations state
  if (investmentPolicy.targetAllocations.length === 0) {
    return (
      <DashboardLayout
        title="Portfolio Rebalance"
        subtitle="Review allocation and rebalancing recommendations"
      >
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Set Target Allocations</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Define your target asset allocation to see how your current portfolio compares and get rebalancing recommendations.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              (Target allocation feature coming soon)
            </p>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  // No holdings state
  const hasHoldings = investmentPolicy.accounts.some((acc) => acc.holdings.length > 0);
  if (!hasHoldings) {
    return (
      <DashboardLayout
        title="Portfolio Rebalance"
        subtitle="Review allocation and rebalancing recommendations"
      >
        <DashboardPage>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Holdings to Your Accounts</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Add individual holdings to your accounts with their asset class to calculate your current allocation and get rebalancing recommendations.
            </p>
            <Link to="/consumer/dashboard/ips/accounts">
              <Button>Go to Accounts</Button>
            </Link>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Portfolio Rebalance"
      subtitle="Review allocation and rebalancing recommendations"
      headerActions={
        needsRebalancing ? (
          <Button onClick={handleMarkRebalanced}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark Rebalanced
          </Button>
        ) : undefined
      }
    >
      <DashboardPage>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Rebalance Threshold</p>
            <p className="text-xl font-bold text-gray-900">{threshold}%</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Asset Classes</p>
            <p className="text-xl font-bold text-gray-900">{recommendations.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Last Rebalance</p>
            <p className="text-xl font-bold text-gray-900">
              {lastRebalance ? new Date(lastRebalance).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Rebalance Table */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Rebalancing Recommendations</h2>
            <p className="text-sm text-gray-500 mt-1">
              Based on your current holdings vs. target allocation
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <RebalanceTable
              recommendations={recommendations}
              threshold={threshold}
              totalValue={totalValue}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/consumer/dashboard/ips/accounts">
            <Button variant="secondary" size="sm">
              Manage Accounts
            </Button>
          </Link>
          <Link to="/consumer/dashboard/settings">
            <Button variant="secondary" size="sm">
              Change Threshold
            </Button>
          </Link>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default RebalancePage;
