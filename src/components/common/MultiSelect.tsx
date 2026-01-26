import { useState, useRef, useEffect } from 'react'

interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface MultiSelectProps {
  label?: string
  helperText?: string
  error?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxSelections?: number
  className?: string
}

export function MultiSelect({
  label,
  helperText,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  maxSelections,
  className = '',
}: MultiSelectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const hasError = Boolean(error)
  const inputId = label?.toLowerCase().replace(/\s+/g, '-')
  const canSelectMore = !maxSelections || value.length < maxSelections

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (optionValue: string): void => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else if (canSelectMore) {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string): void => {
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean)

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={inputId}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[42px] px-4 py-2 text-left rounded-lg border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            hasError
              ? 'border-error focus:border-error focus:ring-error/30'
              : 'border-gray-300 focus:border-primary-light focus:ring-primary-light/30'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedLabels.map((labelText, index) => (
                <span
                  key={value[index]}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light/10 text-primary-dark text-sm rounded-md"
                >
                  {labelText}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(value[index])
                    }}
                    className="hover:text-error transition-colors"
                    aria-label={`Remove ${labelText}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = option.disabled || (!isSelected && !canSelectMore)

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  onClick={() => !isDisabled && handleToggle(option.value)}
                  className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-gray-900">{option.label}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
      {maxSelections && (
        <p className="mt-1 text-xs text-gray-400">
          {value.length} / {maxSelections} selected
        </p>
      )}
    </div>
  )
}
