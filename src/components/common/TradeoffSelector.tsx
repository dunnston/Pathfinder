interface TradeoffOption {
  label: string
  description?: string
}

type TradeoffValue = -2 | -1 | 0 | 1 | 2

interface TradeoffSelectorProps {
  optionA: TradeoffOption
  optionB: TradeoffOption
  value: TradeoffValue | null
  onChange: (value: TradeoffValue) => void
  className?: string
}

const labels: Record<TradeoffValue, string> = {
  [-2]: 'Strongly prefer',
  [-1]: 'Lean toward',
  [0]: 'Neutral',
  [1]: 'Lean toward',
  [2]: 'Strongly prefer',
}

export function TradeoffSelector({
  optionA,
  optionB,
  value,
  onChange,
  className = '',
}: TradeoffSelectorProps): JSX.Element {
  const positions: TradeoffValue[] = [-2, -1, 0, 1, 2]

  return (
    <div className={`w-full ${className}`}>
      {/* Option Cards */}
      <div className="flex gap-4 mb-6">
        <div
          className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
            value !== null && value < 0
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 bg-white'
          }`}
        >
          <h4 className="font-medium text-gray-900">{optionA.label}</h4>
          {optionA.description && (
            <p className="mt-1 text-sm text-gray-500">{optionA.description}</p>
          )}
        </div>

        <div className="flex items-center text-gray-400 font-medium">vs</div>

        <div
          className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
            value !== null && value > 0
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 bg-white'
          }`}
        >
          <h4 className="font-medium text-gray-900">{optionB.label}</h4>
          {optionB.description && (
            <p className="mt-1 text-sm text-gray-500">{optionB.description}</p>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative py-4">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Active track */}
          {value !== null && (
            <div
              className="absolute top-4 h-2 bg-primary/30 rounded-full transition-all"
              style={{
                left: value < 0 ? `${50 + value * 12.5}%` : '50%',
                right: value > 0 ? `${50 - value * 12.5}%` : '50%',
              }}
            />
          )}
        </div>

        {/* Position buttons */}
        <div className="absolute inset-x-0 top-2 flex justify-between">
          {positions.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => onChange(pos)}
              className={`w-6 h-6 rounded-full border-2 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 ${
                value === pos
                  ? 'bg-primary border-primary scale-125'
                  : 'bg-white border-gray-300 hover:border-primary-light'
              }`}
              aria-label={`${pos < 0 ? optionA.label : pos > 0 ? optionB.label : 'Neutral'} - ${labels[pos]}`}
              aria-pressed={value === pos}
            />
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-6 text-xs text-gray-500">
        <span>Strongly prefer<br />{optionA.label}</span>
        <span className="text-center">Lean<br />A</span>
        <span className="text-center">Neutral</span>
        <span className="text-center">Lean<br />B</span>
        <span className="text-right">Strongly prefer<br />{optionB.label}</span>
      </div>

      {/* Current selection feedback */}
      {value !== null && (
        <div className="mt-4 text-center text-sm text-gray-600">
          {value === 0
            ? "You're neutral between these options"
            : `You ${labels[value].toLowerCase()} ${value < 0 ? optionA.label : optionB.label}`}
        </div>
      )}
    </div>
  )
}
