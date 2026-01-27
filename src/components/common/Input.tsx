import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  /** Shows a red asterisk next to the label */
  showRequired?: boolean
}

// Updated sizes to meet WCAG 44px minimum touch target
const sizeStyles = {
  sm: 'px-3 py-2.5 text-sm min-h-[44px]',
  md: 'px-4 py-3 text-base min-h-[44px]',
  lg: 'px-4 py-3.5 text-lg min-h-[48px]',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      className = '',
      id,
      showRequired,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    const baseStyles =
      'w-full rounded-lg border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'
    const stateStyles = hasError
      ? 'border-error text-gray-900 focus:border-error focus:ring-error/30'
      : 'border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light/30'

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
          >
            {label}
            {showRequired && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${stateStyles} ${sizeStyles[size]} ${className}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  /** Shows a red asterisk next to the label */
  showRequired?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      className = '',
      id,
      rows = 4,
      showRequired,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    const baseStyles =
      'w-full rounded-lg border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-y'
    const stateStyles = hasError
      ? 'border-error text-gray-900 focus:border-error focus:ring-error/30'
      : 'border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light/30'

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5"
          >
            {label}
            {showRequired && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`${baseStyles} ${stateStyles} ${sizeStyles[size]} ${className}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  min?: number
  max?: number
  step?: number
  /** Allow decimal values (default: true) */
  allowDecimals?: boolean
  /** Allow negative values (default: false) */
  allowNegative?: boolean
  /** Custom onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// UX-17: Sanitize number inputs to prevent invalid characters
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ allowDecimals = true, allowNegative = false, onChange, onKeyDown, ...props }, ref) => {
    // Prevent invalid characters on keydown
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      // Allow: backspace, delete, tab, escape, enter, arrows
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
      if (allowedKeys.includes(e.key)) {
        onKeyDown?.(e)
        return
      }

      // Allow Ctrl/Cmd + A, C, V, X
      if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        onKeyDown?.(e)
        return
      }

      // Allow decimal point (only once)
      if (e.key === '.' && allowDecimals) {
        const value = (e.target as HTMLInputElement).value
        if (!value.includes('.')) {
          onKeyDown?.(e)
          return
        }
      }

      // Allow minus sign (only at start)
      if (e.key === '-' && allowNegative) {
        const input = e.target as HTMLInputElement
        if (input.selectionStart === 0 && !input.value.includes('-')) {
          onKeyDown?.(e)
          return
        }
      }

      // Allow numbers
      if (/^[0-9]$/.test(e.key)) {
        onKeyDown?.(e)
        return
      }

      // Block everything else (including 'e', 'E', '+')
      e.preventDefault()
    }

    // Sanitize pasted content
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value

      // Build regex pattern based on options
      let pattern = allowNegative ? '^-?' : '^'
      pattern += allowDecimals ? '\\d*\\.?\\d*$' : '\\d*$'
      const regex = new RegExp(pattern)

      // Only allow valid numeric values
      if (value === '' || value === '-' || regex.test(value)) {
        onChange?.(e)
      }
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

interface DateInputProps extends Omit<InputProps, 'type'> {
  min?: string
  max?: string
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ ...props }, ref) => {
    return <Input ref={ref} type="date" {...props} />
  }
)

DateInput.displayName = 'DateInput'
