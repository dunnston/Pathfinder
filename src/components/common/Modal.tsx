import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

// Focusable element selector for focus trap
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps): JSX.Element | null {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap handler (UX-16)
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    // Focus trap - Tab and Shift+Tab
    if (e.key === 'Tab' && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!focusableElements.length) return

      // Shift+Tab on first element -> go to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
      // Tab on last element -> go to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Store currently focused element to restore on close
      previousActiveElement.current = document.activeElement as HTMLElement

      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''

      // Restore focus to previous element on close
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Focus the first focusable element, or the modal itself
      const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      } else {
        contentRef.current.focus()
      }
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`${sizeStyles[size]} w-full bg-white rounded-lg shadow-xl outline-none`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({
  children,
  className = '',
}: ModalFooterProps): JSX.Element {
  return (
    <div className={`flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}
