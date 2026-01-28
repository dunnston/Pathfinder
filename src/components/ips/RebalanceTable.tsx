/**
 * Rebalance Table Component
 * Displays rebalance recommendations with buy/sell/hold actions
 */

import type { RebalanceRecommendation } from '@/types/dashboard';
import { ASSET_CLASS_LABELS } from '@/types/dashboard';

interface RebalanceTableProps {
  /** Rebalance recommendations */
  recommendations: RebalanceRecommendation[];
  /** Rebalance threshold percentage */
  threshold: number;
  /** Total portfolio value */
  totalValue: number;
}

const ACTION_STYLES = {
  buy: {
    badge: 'bg-green-100 text-green-700',
    text: 'text-green-600',
  },
  sell: {
    badge: 'bg-red-100 text-red-700',
    text: 'text-red-600',
  },
  hold: {
    badge: 'bg-gray-100 text-gray-600',
    text: 'text-gray-500',
  },
};

export function RebalanceTable({
  recommendations,
  threshold,
  totalValue,
}: RebalanceTableProps): JSX.Element {
  // Sort by deviation magnitude (largest deviations first)
  const sortedRecs = [...recommendations].sort(
    (a, b) => Math.abs(b.deviation) - Math.abs(a.deviation)
  );

  const needsRebalancing = recommendations.some((r) => r.action !== 'hold');

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th scope="col" className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Class
            </th>
            <th scope="col" className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current %
            </th>
            <th scope="col" className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target %
            </th>
            <th scope="col" className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deviation
            </th>
            <th scope="col" className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedRecs.map((rec) => {
            const styles = ACTION_STYLES[rec.action];
            const exceedsThreshold = Math.abs(rec.deviation) > threshold;

            return (
              <tr
                key={rec.assetClass}
                className={exceedsThreshold ? 'bg-yellow-50' : ''}
              >
                <th scope="row" className="py-4 px-4 font-medium text-gray-900">
                  {ASSET_CLASS_LABELS[rec.assetClass]}
                </th>
                <td className="py-4 px-4 text-right">
                  <span className="text-gray-900">{rec.currentPercentage.toFixed(1)}%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-gray-600">{rec.targetPercentage.toFixed(1)}%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`font-medium ${
                      rec.deviation > 0
                        ? 'text-red-600'
                        : rec.deviation < 0
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {rec.deviation > 0 ? '+' : ''}
                    {rec.deviation.toFixed(1)}%
                  </span>
                  {exceedsThreshold && (
                    <span
                      className="ml-1 text-yellow-600"
                      title="Exceeds threshold"
                      aria-label="Exceeds rebalance threshold"
                      role="img"
                    >
                      !
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
                    {rec.action.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {rec.action !== 'hold' ? (
                    <span className={`font-medium ${styles.text}`}>
                      ${rec.actionAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-gray-200">
          <tr>
            <th scope="row" className="py-4 px-4 font-semibold text-gray-900 text-left">Total</th>
            <td className="py-4 px-4 text-right font-medium text-gray-900">
              {recommendations.reduce((sum, r) => sum + r.currentPercentage, 0).toFixed(1)}%
            </td>
            <td className="py-4 px-4 text-right font-medium text-gray-600">
              {recommendations.reduce((sum, r) => sum + r.targetPercentage, 0).toFixed(1)}%
            </td>
            <td colSpan={3} className="py-4 px-4 text-right">
              <span className="text-sm text-gray-500">
                Portfolio Value: ${totalValue.toLocaleString()}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Summary Message */}
      <div className={`mt-4 p-4 rounded-lg ${needsRebalancing ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
        {needsRebalancing ? (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800">Rebalancing Recommended</p>
              <p className="text-sm text-yellow-700 mt-1">
                Some asset classes exceed your {threshold}% deviation threshold. Consider rebalancing to stay aligned with your target allocation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-green-800">Portfolio is Balanced</p>
              <p className="text-sm text-green-700 mt-1">
                All asset classes are within your {threshold}% deviation threshold. No rebalancing needed at this time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
