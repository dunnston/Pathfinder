import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  options: SelectOption[]
  placeholder?: string
  /** Shows a red asterisk next to the label */
  showRequired?: boolean
}

// Updated sizes to meet WCAG 44px minimum touch target
const sizeStyles = {
  sm: 'px-3 py-2.5 text-sm min-h-[44px]',
  md: 'px-4 py-3 text-base min-h-[44px]',
  lg: 'px-4 py-3.5 text-lg min-h-[48px]',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      options,
      placeholder,
      className = '',
      id,
      showRequired,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    const baseStyles =
      'w-full rounded-lg border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none cursor-pointer'
    const stateStyles = hasError
      ? 'border-error text-gray-900 focus:border-error focus:ring-error/30'
      : 'border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light/30'

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
          >
            {label}
            {showRequired && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`${baseStyles} ${stateStyles} ${sizeStyles[size]} pr-10 ${className}`}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
