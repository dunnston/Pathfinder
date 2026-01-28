/**
 * IPS Page
 * Investment Policy Statement overview with portfolio summary
 */

import { useMemo, useState } from 'react';
import { DashboardLayout, DashboardPage } from '@/components/layout';
import { OverviewCard } from '@/components/dashboard';
import { LoadingSpinner } from '@/components/common';
import { AllocationChart, DeviationAlerts } from '@/components/ips';
import { useDashboardStore } from '@/stores';
import { DEFAULT_REBALANCE_THRESHOLD } from '@/types/dashboard';
import type { AssetClass } from '@/types/dashboard';

export function IPSPage(): JSX.Element {
  const { investmentPolicy, calculateRebalanceRecommendations, _hasHydrated } = useDashboardStore();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showTargetOverlay, setShowTargetOverlay] = useState(true);

  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    if (!investmentPolicy) {
      return {
        totalValue: 0,
        accountCount: 0,
        holdingCount: 0,
        allocationCount: 0,
        lastRebalance: null,
      };
    }

    const totalValue = investmentPolicy.accounts.reduce(
      (sum, acc) => sum + acc.currentBalance,
      0
    );
    const holdingCount = investmentPolicy.accounts.reduce(
      (sum, acc) => sum + acc.holdings.length,
      0
    );

    return {
      totalValue,
      accountCount: investmentPolicy.accounts.length,
      holdingCount,
      allocationCount: investmentPolicy.targetAllocations.length,
      lastRebalance: investmentPolicy.lastRebalanceDate,
    };
  }, [investmentPolicy]);

  // Calculate current allocation by asset class
  const currentAllocation = useMemo(() => {
    if (!investmentPolicy || portfolioStats.totalValue === 0) return [];

    const byAssetClass = new Map<AssetClass, number>();

    investmentPolicy.accounts.forEach((account) => {
      account.holdings.forEach((holding) => {
        const current = byAssetClass.get(holding.assetClass) || 0;
        byAssetClass.set(holding.assetClass, current + holding.currentValue);
      });
    });

    return Array.from(byAssetClass.entries())
      .map(([assetClass, value]) => ({
        assetClass,
        value,
        percentage: (value / portfolioStats.totalValue) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [investmentPolicy, portfolioStats.totalValue]);

  // Calculate rebalance recommendations for deviation alerts
  const rebalanceRecommendations = useMemo(() => {
    return calculateRebalanceRecommendations();
  }, [calculateRebalanceRecommendations]);

  // Get threshold for deviation alerts
  const rebalanceThreshold = investmentPolicy?.rebalanceThreshold ?? DEFAULT_REBALANCE_THRESHOLD;

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Investment Policy Statement">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading IPS...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Investment Policy Statement"
      subtitle="Manage your investment accounts and target allocations"
    >
      <DashboardPage>
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Portfolio</p>
            <p className="text-xl font-bold text-gray-900">
              ${portfolioStats.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Accounts</p>
            <p className="text-xl font-bold text-gray-900">{portfolioStats.accountCount}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Holdings</p>
            <p className="text-xl font-bold text-gray-900">{portfolioStats.holdingCount}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Last Rebalance</p>
            <p className="text-xl font-bold text-gray-900">
              {portfolioStats.lastRebalance
                ? new Date(portfolioStats.lastRebalance).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <OverviewCard
            title="Accounts"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            }
            action={{ label: 'Manage Accounts', href: '/consumer/dashboard/ips/accounts' }}
          >
            <p className="text-gray-600">
              Add and manage your investment accounts and holdings to track your portfolio.
            </p>
          </OverviewCard>

          <OverviewCard
            title="Target Allocations"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            }
            action={{ label: 'Edit Targets', href: '/consumer/dashboard/ips/allocations' }}
          >
            <p className="text-gray-600">
              Set your ideal asset allocation percentages to guide rebalancing decisions.
            </p>
          </OverviewCard>

          <OverviewCard
            title="Rebalance"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
            action={{ label: 'View Rebalance', href: '/consumer/dashboard/ips/rebalance' }}
          >
            <p className="text-gray-600">
              Compare current vs target allocation and get buy/sell recommendations.
            </p>
          </OverviewCard>
        </div>

        {/* Current Allocation Display */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Allocation</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Based on holdings in your accounts
                </p>
              </div>

              {/* Chart Type Toggle */}
              {currentAllocation.length > 0 && (
                <div className="flex items-center gap-2">
                  <div role="group" aria-label="Chart type selection" className="flex rounded-lg border border-gray-200 p-1">
                    <button
                      type="button"
                      onClick={() => setChartType('pie')}
                      aria-pressed={chartType === 'pie'}
                      className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-md text-sm font-medium transition-colors
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${chartType === 'pie' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <span className="sr-only">Pie chart view</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartType('bar')}
                      aria-pressed={chartType === 'bar'}
                      className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-md text-sm font-medium transition-colors
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${chartType === 'bar' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <span className="sr-only">Bar chart view</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Target Overlay Toggle (only for bar chart) */}
                  {chartType === 'bar' && portfolioStats.allocationCount > 0 && (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer min-h-[44px] px-2">
                      <input
                        type="checkbox"
                        checked={showTargetOverlay}
                        onChange={(e) => setShowTargetOverlay(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      Show targets
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Deviation Alerts */}
          {currentAllocation.length > 0 && portfolioStats.allocationCount > 0 && (
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
              <DeviationAlerts
                recommendations={rebalanceRecommendations}
                threshold={rebalanceThreshold}
                maxVisible={3}
              />
            </div>
          )}

          <div className="p-4 sm:p-6">
            {currentAllocation.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Add holdings to your accounts to see your current allocation breakdown.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Allocation Chart */}
                <AllocationChart
                  currentAllocation={currentAllocation}
                  targetAllocation={investmentPolicy?.targetAllocations}
                  totalValue={portfolioStats.totalValue}
                  chartType={chartType}
                  showTargetOverlay={showTargetOverlay}
                  rebalanceThreshold={rebalanceThreshold}
                />

                {/* Target Allocation Reminder */}
                {portfolioStats.allocationCount === 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      You haven&apos;t set target allocations yet.{' '}
                      <a
                        href="/consumer/dashboard/ips/allocations"
                        className="font-medium text-yellow-900 underline"
                      >
                        Set targets
                      </a>{' '}
                      to see how your current allocation compares.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default IPSPage;
