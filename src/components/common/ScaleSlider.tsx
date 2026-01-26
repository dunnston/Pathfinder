interface ScaleSliderProps {
  label?: string
  helperText?: string
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  minLabel?: string
  maxLabel?: string
  showValue?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export function ScaleSlider({
  label,
  helperText,
  min = 1,
  max = 10,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
  showValue = true,
  valueFormatter,
  className = '',
}: ScaleSliderProps): JSX.Element {
  const percent = ((value - min) / (max - min)) * 100
  const displayValue = valueFormatter ? valueFormatter(value) : value.toString()

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-baseline mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-lg font-semibold text-primary">
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="relative py-2">
        {/* Track background */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Filled track */}
          <div
            className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Native range input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
        />

        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full shadow-md border-2 border-white pointer-events-none transition-all"
          style={{ left: `calc(${percent}% - 10px)` }}
        />
      </div>

      {/* Min/Max labels */}
      {(minLabel || maxLabel) && (
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>{minLabel || min}</span>
          <span>{maxLabel || max}</span>
        </div>
      )}

      {helperText && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

interface LikertScaleProps {
  label?: string
  options: { value: number; label: string }[]
  value: number | null
  onChange: (value: number) => void
  className?: string
}

export function LikertScale({
  label,
  options,
  value,
  onChange,
  className = '',
}: LikertScaleProps): JSX.Element {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      )}
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
              value === option.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
