/**
 * Allocation Editor Component
 * Editable list of target allocations by asset class with validation
 */

import { useState, useEffect, useMemo } from 'react';
import type { AssetClass, TargetAllocation } from '@/types/dashboard';
import { ASSET_CLASS_LABELS, ASSET_CLASS_CATEGORIES } from '@/types/dashboard';
import { ASSET_CLASS_INFO } from '@/data/assetClasses';
import { Button } from '@/components/common';

interface AllocationEditorProps {
  /** Current allocations */
  allocations: TargetAllocation[];
  /** Save handler */
  onSave: (allocations: TargetAllocation[]) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Whether in read-only mode */
  readOnly?: boolean;
}

const ALL_ASSET_CLASSES: AssetClass[] = [
  'us_large_cap',
  'us_mid_cap',
  'us_small_cap',
  'international_developed',
  'emerging_markets',
  'us_bonds',
  'international_bonds',
  'tips',
  'real_estate',
  'cash',
  'other',
];

const CATEGORY_LABELS = {
  equity: 'Equities',
  fixed_income: 'Fixed Income',
  alternative: 'Alternatives',
  cash: 'Cash',
};

export function AllocationEditor({
  allocations,
  onSave,
  onCancel,
  readOnly = false,
}: AllocationEditorProps): JSX.Element {
  // Initialize local state with all asset classes
  const [localAllocations, setLocalAllocations] = useState<Record<AssetClass, number>>(() => {
    const initial: Record<AssetClass, number> = {} as Record<AssetClass, number>;
    ALL_ASSET_CLASSES.forEach((ac) => {
      const existing = allocations.find((a) => a.assetClass === ac);
      initial[ac] = existing?.targetPercentage || 0;
    });
    return initial;
  });

  // Sync with props when allocations change
  useEffect(() => {
    const updated: Record<AssetClass, number> = {} as Record<AssetClass, number>;
    ALL_ASSET_CLASSES.forEach((ac) => {
      const existing = allocations.find((a) => a.assetClass === ac);
      updated[ac] = existing?.targetPercentage || 0;
    });
    setLocalAllocations(updated);
  }, [allocations]);

  // Calculate total
  const total = useMemo(() => {
    return Object.values(localAllocations).reduce((sum, val) => sum + val, 0);
  }, [localAllocations]);

  // Check if valid (total = 100%)
  const isValid = Math.abs(total - 100) < 0.01;

  // Group by category
  const groupedAssetClasses = useMemo(() => {
    const groups: Record<string, AssetClass[]> = {
      equity: [],
      fixed_income: [],
      alternative: [],
      cash: [],
    };

    ALL_ASSET_CLASSES.forEach((ac) => {
      const category = ASSET_CLASS_CATEGORIES[ac];
      groups[category].push(ac);
    });

    return groups;
  }, []);

  const handleChange = (assetClass: AssetClass, value: string) => {
    const numValue = parseFloat(value) || 0;
    // Clamp between 0 and 100
    const clamped = Math.max(0, Math.min(100, numValue));
    setLocalAllocations((prev) => ({
      ...prev,
      [assetClass]: clamped,
    }));
  };

  const handleSliderChange = (assetClass: AssetClass, value: number) => {
    setLocalAllocations((prev) => ({
      ...prev,
      [assetClass]: value,
    }));
  };

  const handleSave = () => {
    if (!isValid) return;

    // Convert to TargetAllocation array, filtering out zeros
    const result: TargetAllocation[] = ALL_ASSET_CLASSES
      .filter((ac) => localAllocations[ac] > 0)
      .map((ac) => ({
        assetClass: ac,
        targetPercentage: localAllocations[ac],
      }));

    onSave(result);
  };

  const handleReset = () => {
    const reset: Record<AssetClass, number> = {} as Record<AssetClass, number>;
    ALL_ASSET_CLASSES.forEach((ac) => {
      reset[ac] = 0;
    });
    setLocalAllocations(reset);
  };

  // Quick presets
  const applyPreset = (preset: 'conservative' | 'moderate' | 'aggressive') => {
    const presets: Record<string, Record<AssetClass, number>> = {
      conservative: {
        us_large_cap: 20,
        us_mid_cap: 5,
        us_small_cap: 5,
        international_developed: 10,
        emerging_markets: 0,
        us_bonds: 35,
        international_bonds: 10,
        tips: 5,
        real_estate: 5,
        cash: 5,
        other: 0,
      },
      moderate: {
        us_large_cap: 30,
        us_mid_cap: 10,
        us_small_cap: 5,
        international_developed: 15,
        emerging_markets: 5,
        us_bonds: 20,
        international_bonds: 5,
        tips: 0,
        real_estate: 5,
        cash: 5,
        other: 0,
      },
      aggressive: {
        us_large_cap: 35,
        us_mid_cap: 15,
        us_small_cap: 10,
        international_developed: 20,
        emerging_markets: 10,
        us_bonds: 5,
        international_bonds: 0,
        tips: 0,
        real_estate: 5,
        cash: 0,
        other: 0,
      },
    };

    setLocalAllocations(presets[preset]);
  };

  return (
    <div className="space-y-6">
      {/* Total & Status */}
      <div className={`p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Total Allocation: </span>
            <span className={`text-lg font-bold ${isValid ? 'text-green-700' : 'text-yellow-700'}`}>
              {total.toFixed(1)}%
            </span>
          </div>
          {!isValid && (
            <span className="text-sm text-yellow-700">
              {total < 100 ? `${(100 - total).toFixed(1)}% remaining` : `${(total - 100).toFixed(1)}% over`}
            </span>
          )}
          {isValid && (
            <span className="text-sm text-green-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Valid
            </span>
          )}
        </div>
      </div>

      {/* Quick Presets */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Quick presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('conservative')}
            className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Conservative
          </button>
          <button
            type="button"
            onClick={() => applyPreset('moderate')}
            className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
          >
            Moderate
          </button>
          <button
            type="button"
            onClick={() => applyPreset('aggressive')}
            className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
          >
            Aggressive
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Asset Class Groups */}
      {Object.entries(groupedAssetClasses).map(([category, assetClasses]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
          </h3>
          <div className="space-y-3">
            {assetClasses.map((ac) => {
              const info = ASSET_CLASS_INFO[ac];
              const value = localAllocations[ac];

              return (
                <div key={ac} className="flex items-center gap-4">
                  <div className="w-48 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      {ASSET_CLASS_LABELS[ac]}
                    </span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      info.riskLevel === 'low'
                        ? 'bg-green-100 text-green-700'
                        : info.riskLevel === 'moderate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {info.riskLevel}
                    </span>
                  </div>

                  {!readOnly && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={value}
                      onChange={(e) => handleSliderChange(ac, parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  )}

                  <div className="w-20 flex-shrink-0">
                    {readOnly ? (
                      <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}%</span>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={value || ''}
                          onChange={(e) => handleChange(ac, e.target.value)}
                          className="w-full px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <span className="absolute right-2 top-1 text-xs text-gray-400">%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Actions */}
      {!readOnly && (
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={!isValid ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Save Allocations
          </Button>
        </div>
      )}
    </div>
  );
}
