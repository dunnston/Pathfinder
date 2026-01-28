/**
 * IPS Allocations Page
 * Set and manage target asset allocations
 */

import { DashboardLayout, DashboardPage } from '@/components/layout';
import { LoadingSpinner } from '@/components/common';
import { AllocationEditor } from '@/components/ips';
import { useDashboardStore } from '@/stores';
import type { TargetAllocation } from '@/types/dashboard';

export function IPSAllocationsPage(): JSX.Element {
  const { investmentPolicy, updateTargetAllocations, _hasHydrated } = useDashboardStore();

  const currentAllocations = investmentPolicy?.targetAllocations || [];

  const handleSave = (allocations: TargetAllocation[]) => {
    updateTargetAllocations(allocations);
  };

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Target Allocations">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading allocations...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Target Allocations"
      subtitle="Set your ideal portfolio allocation by asset class"
    >
      <DashboardPage>
        <div className="max-w-3xl">
          {/* Instructions */}
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-900">How to set your target allocation</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Use the sliders or input fields to set your target percentage for each asset class.
                  The total must equal 100%. You can use the quick presets as a starting point, then
                  customize to match your risk tolerance and investment goals.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          {currentAllocations.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Target</h3>
              <div className="flex flex-wrap gap-2">
                {currentAllocations.map((alloc) => (
                  <span
                    key={alloc.assetClass}
                    className="px-2 py-1 text-xs bg-white border rounded-full"
                  >
                    {alloc.assetClass.replace(/_/g, ' ')}: {alloc.targetPercentage}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allocation Editor */}
          <div className="rounded-lg border bg-white shadow-sm p-6">
            <AllocationEditor
              allocations={currentAllocations}
              onSave={handleSave}
            />
          </div>

          {/* Help Text */}
          <div className="mt-6 text-sm text-gray-500">
            <h4 className="font-medium text-gray-700 mb-2">Asset Class Guidelines</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Equities</strong> - Higher growth potential, higher volatility</li>
              <li><strong>Fixed Income</strong> - Steady income, lower volatility</li>
              <li><strong>Alternatives</strong> - Diversification benefits, varies by type</li>
              <li><strong>Cash</strong> - Stability and liquidity, lowest returns</li>
            </ul>
          </div>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default IPSAllocationsPage;
