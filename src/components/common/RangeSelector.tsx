interface RangeOption {
  value: string
  label: string
  description?: string
}

interface RangeSelectorProps {
  label?: string
  helperText?: string
  error?: string
  options: RangeOption[]
  value: string | null
  onChange: (value: string) => void
  columns?: 1 | 2 | 3
  className?: string
}

export function RangeSelector({
  label,
  helperText,
  error,
  options,
  value,
  onChange,
  columns = 1,
  className = '',
}: RangeSelectorProps): JSX.Element {
  const hasError = Boolean(error)

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      )}

      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              value === option.value
                ? 'border-primary bg-primary/5'
                : hasError
                  ? 'border-error/50 hover:border-error'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={value === option.value}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  value === option.value
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}
              >
                {value === option.value && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </span>
              <div>
                <span className="font-medium text-gray-900">{option.label}</span>
                {option.description && (
                  <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

interface FinancialRange {
  min: number
  max: number | null
  label: string
}

interface FinancialRangeSelectorProps {
  label?: string
  helperText?: string
  error?: string
  ranges: FinancialRange[]
  value: string | null
  onChange: (value: string) => void
  formatCurrency?: (amount: number) => string
  className?: string
}

const defaultFormatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function FinancialRangeSelector({
  label,
  helperText,
  error,
  ranges,
  value,
  onChange,
  formatCurrency = defaultFormatCurrency,
  className = '',
}: FinancialRangeSelectorProps): JSX.Element {
  const options: RangeOption[] = ranges.map((range) => {
    const rangeValue = `${range.min}-${range.max ?? 'plus'}`
    const rangeLabel = range.max
      ? `${formatCurrency(range.min)} - ${formatCurrency(range.max)}`
      : `${formatCurrency(range.min)}+`

    return {
      value: rangeValue,
      label: range.label || rangeLabel,
    }
  })

  return (
    <RangeSelector
      label={label}
      helperText={helperText}
      error={error}
      options={options}
      value={value}
      onChange={onChange}
      columns={2}
      className={className}
    />
  )
}
