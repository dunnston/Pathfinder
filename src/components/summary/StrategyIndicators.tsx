/**
 * StrategyIndicators Component
 * Visual display of strategy weights
 */

import type { StrategyWeights } from '@/types/systemClassifications';
import { getWeightLabel } from '@/services/classification';
import { Card } from '@/components/common';

interface StrategyIndicatorsProps {
  weights: StrategyWeights;
}

const weightConfig: {
  key: keyof StrategyWeights;
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  color: string;
}[] = [
  {
    key: 'securityFocus',
    label: 'Security Focus',
    description: 'Preference for guaranteed income and protection',
    lowLabel: 'Growth-oriented',
    highLabel: 'Security-focused',
    color: 'blue',
  },
  {
    key: 'growthOrientation',
    label: 'Growth Orientation',
    description: 'Willingness to accept risk for higher returns',
    lowLabel: 'Conservative',
    highLabel: 'Growth-seeking',
    color: 'green',
  },
  {
    key: 'complexityTolerance',
    label: 'Complexity Tolerance',
    description: 'Comfort with sophisticated strategies',
    lowLabel: 'Keep it simple',
    highLabel: 'Embrace complexity',
    color: 'purple',
  },
  {
    key: 'flexibility',
    label: 'Flexibility',
    description: 'Willingness to adjust plans and timing',
    lowLabel: 'Fixed plans',
    highLabel: 'Highly adaptable',
    color: 'orange',
  },
  {
    key: 'advisorDependence',
    label: 'Advisor Dependence',
    description: 'Desire for professional guidance',
    lowLabel: 'Self-directed',
    highLabel: 'Advisor-guided',
    color: 'teal',
  },
];

export function StrategyIndicators({ weights }: StrategyIndicatorsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Profile</h3>
      <p className="text-sm text-gray-600 mb-6">
        These indicators help guide personalized recommendations based on your preferences and situation.
      </p>
      <div className="space-y-6">
        {weightConfig.map((config) => (
          <WeightIndicator
            key={config.key}
            value={weights[config.key]}
            {...config}
          />
        ))}
      </div>
    </Card>
  );
}

interface WeightIndicatorProps {
  label: string;
  description: string;
  value: number;
  lowLabel: string;
  highLabel: string;
  color: string;
}

function WeightIndicator({
  label,
  description,
  value,
  lowLabel,
  highLabel,
  color,
}: WeightIndicatorProps) {
  const colorClasses: Record<string, { bar: string; text: string }> = {
    blue: { bar: 'bg-blue-500', text: 'text-blue-700' },
    green: { bar: 'bg-green-500', text: 'text-green-700' },
    purple: { bar: 'bg-purple-500', text: 'text-purple-700' },
    orange: { bar: 'bg-orange-500', text: 'text-orange-700' },
    teal: { bar: 'bg-teal-500', text: 'text-teal-700' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-sm font-medium text-gray-900">{label}</span>
          <span className={`ml-2 text-sm font-semibold ${colors.text}`}>
            {getWeightLabel(value)}
          </span>
        </div>
        <span className="text-sm text-gray-500">{value}/100</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{description}</p>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all duration-300`}
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{lowLabel}</span>
          <span className="text-xs text-gray-400">{highLabel}</span>
        </div>
      </div>
    </div>
  );
}

/** Compact version for smaller displays */
export function StrategyIndicatorsCompact({ weights }: StrategyIndicatorsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {weightConfig.map((config) => (
        <div key={config.key} className="text-center">
          <div className="text-2xl font-bold text-gray-900">{weights[config.key]}</div>
          <div className="text-xs text-gray-500">{config.label}</div>
        </div>
      ))}
    </div>
  );
}
