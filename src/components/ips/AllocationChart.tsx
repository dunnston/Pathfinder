/**
 * AllocationChart Component
 * Displays portfolio allocation as pie or bar chart using Recharts
 */

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { AssetClass, TargetAllocation } from '@/types/dashboard';
import { ASSET_CLASS_LABELS, ASSET_CLASS_CATEGORIES } from '@/types/dashboard';

// ============================================================
// TYPES
// ============================================================

export interface AllocationDataItem {
  assetClass: AssetClass;
  value: number;
  percentage: number;
}

export interface AllocationChartProps {
  /** Current allocation data */
  currentAllocation: AllocationDataItem[];
  /** Optional target allocation for comparison */
  targetAllocation?: TargetAllocation[];
  /** Total portfolio value */
  totalValue: number;
  /** Chart type: 'pie' or 'bar' */
  chartType?: 'pie' | 'bar';
  /** Show legend */
  showLegend?: boolean;
  /** Show target overlay (for bar chart) */
  showTargetOverlay?: boolean;
  /** Rebalance threshold for deviation highlighting */
  rebalanceThreshold?: number;
}

// ============================================================
// COLOR PALETTE
// ============================================================

// Colors by category for visual grouping
const CATEGORY_COLORS: Record<string, string[]> = {
  equity: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  fixed_income: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  alternative: ['#8B5CF6', '#A78BFA'],
  cash: ['#6B7280', '#9CA3AF'],
};

// Track color index per category to ensure variety
function getColorForAssetClass(assetClass: AssetClass, usedColors: Map<string, number>): string {
  const category = ASSET_CLASS_CATEGORIES[assetClass];
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.cash;
  const usedIndex = usedColors.get(category) || 0;
  const color = colors[usedIndex % colors.length];
  usedColors.set(category, usedIndex + 1);
  return color;
}

// ============================================================
// TOOLTIP COMPONENTS
// ============================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      assetClass: AssetClass;
      value: number;
      percentage: number;
      targetPercentage?: number;
    };
  }>;
}

function PieTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const label = ASSET_CLASS_LABELS[data.assetClass] || data.assetClass;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">
        {data.percentage.toFixed(1)}% (${data.value.toLocaleString()})
      </p>
    </div>
  );
}

function BarTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const label = ASSET_CLASS_LABELS[data.assetClass] || data.assetClass;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">
        Current: {data.percentage.toFixed(1)}%
      </p>
      {data.targetPercentage !== undefined && (
        <p className="text-sm text-gray-500">
          Target: {data.targetPercentage.toFixed(1)}%
        </p>
      )}
      <p className="text-sm text-gray-600">
        Value: ${data.value.toLocaleString()}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function AllocationChart({
  currentAllocation,
  targetAllocation,
  totalValue,
  chartType = 'pie',
  showLegend = true,
  showTargetOverlay = false,
  rebalanceThreshold = 5,
}: AllocationChartProps): JSX.Element {
  // Build color map based on category
  const colorMap = useMemo(() => {
    const map = new Map<AssetClass, string>();
    const usedColors = new Map<string, number>();

    currentAllocation.forEach((item) => {
      map.set(item.assetClass, getColorForAssetClass(item.assetClass, usedColors));
    });

    return map;
  }, [currentAllocation]);

  // Prepare data for bar chart with targets
  const barChartData = useMemo(() => {
    return currentAllocation.map((item) => {
      const target = targetAllocation?.find((t) => t.assetClass === item.assetClass);
      const deviation = target ? item.percentage - target.targetPercentage : 0;

      return {
        ...item,
        name: ASSET_CLASS_LABELS[item.assetClass] || item.assetClass,
        targetPercentage: target?.targetPercentage,
        deviation,
        exceedsThreshold: Math.abs(deviation) > rebalanceThreshold,
      };
    });
  }, [currentAllocation, targetAllocation, rebalanceThreshold]);

  // Prepare data for pie chart
  const pieChartData = useMemo(() => {
    return currentAllocation.map((item) => ({
      ...item,
      name: ASSET_CLASS_LABELS[item.assetClass] || item.assetClass,
    }));
  }, [currentAllocation]);

  // Screen reader accessible data description
  const chartDescription = useMemo(() => {
    const items = currentAllocation
      .map((item) => {
        const label = ASSET_CLASS_LABELS[item.assetClass] || item.assetClass;
        return `${label}: ${item.percentage.toFixed(1)}%`;
      })
      .join(', ');
    return `Portfolio allocation totaling $${totalValue.toLocaleString()}: ${items}`;
  }, [currentAllocation, totalValue]);

  if (currentAllocation.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No allocation data to display
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={chartDescription}
      className="w-full"
    >
      {chartType === 'pie' ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="percentage"
                nameKey="name"
                label={({ percentage }) => `${percentage.toFixed(0)}%`}
                labelLine={false}
              >
                {pieChartData.map((entry) => (
                  <Cell
                    key={entry.assetClass}
                    fill={colorMap.get(entry.assetClass) || '#6B7280'}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              {showLegend && (
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value: string) => (
                    <span className="text-sm text-gray-700">{value}</span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          {/* Center label showing total */}
          <div className="text-center -mt-48 pointer-events-none">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-gray-900">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={110}
              />
              <Tooltip content={<BarTooltip />} />
              {showTargetOverlay && <ReferenceLine x={0} stroke="#E5E7EB" />}
              <Bar
                dataKey="percentage"
                name="Current"
                radius={[0, 4, 4, 0]}
              >
                {barChartData.map((entry) => (
                  <Cell
                    key={entry.assetClass}
                    fill={colorMap.get(entry.assetClass) || '#6B7280'}
                    stroke={entry.exceedsThreshold ? '#EAB308' : 'transparent'}
                    strokeWidth={entry.exceedsThreshold ? 2 : 0}
                  />
                ))}
              </Bar>
              {showTargetOverlay && targetAllocation && targetAllocation.length > 0 && (
                <Bar
                  dataKey="targetPercentage"
                  name="Target"
                  fill="transparent"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  radius={[0, 4, 4, 0]}
                />
              )}
              {showLegend && <Legend />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Screen reader accessible data table */}
      <table className="sr-only">
        <caption>Portfolio Allocation Data</caption>
        <thead>
          <tr>
            <th scope="col">Asset Class</th>
            <th scope="col">Current %</th>
            {targetAllocation && <th scope="col">Target %</th>}
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {currentAllocation.map((item) => {
            const target = targetAllocation?.find((t) => t.assetClass === item.assetClass);
            return (
              <tr key={item.assetClass}>
                <td>{ASSET_CLASS_LABELS[item.assetClass] || item.assetClass}</td>
                <td>{item.percentage.toFixed(1)}%</td>
                {targetAllocation && (
                  <td>{target?.targetPercentage.toFixed(1) ?? 'N/A'}%</td>
                )}
                <td>${item.value.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AllocationChart;
