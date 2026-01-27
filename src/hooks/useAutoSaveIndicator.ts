/**
 * Auto-Save Indicator Hook
 * Shows feedback after auto-save operations (UX-18)
 */

import { useState, useCallback, useRef, useEffect } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveIndicatorOptions {
  /** How long to show "Saved" status (ms) */
  savedDuration?: number
  /** Minimum time to show "Saving" status (ms) */
  minSavingDuration?: number
}

interface UseAutoSaveIndicatorReturn {
  /** Current save status */
  status: SaveStatus
  /** Trigger saving state */
  startSaving: () => void
  /** Mark save as complete */
  completeSave: () => void
  /** Mark save as failed */
  failSave: () => void
  /** Reset to idle */
  reset: () => void
  /** Whether currently saving */
  isSaving: boolean
  /** Whether just saved */
  isSaved: boolean
  /** Whether save failed */
  isError: boolean
}

export function useAutoSaveIndicator(
  options: UseAutoSaveIndicatorOptions = {}
): UseAutoSaveIndicatorReturn {
  const { savedDuration = 2000, minSavingDuration = 300 } = options

  const [status, setStatus] = useState<SaveStatus>('idle')
  const savingStartRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startSaving = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    savingStartRef.current = Date.now()
    setStatus('saving')
  }, [])

  const completeSave = useCallback(() => {
    const elapsed = Date.now() - savingStartRef.current
    const remainingTime = Math.max(0, minSavingDuration - elapsed)

    // Ensure minimum saving duration for visual feedback
    timeoutRef.current = setTimeout(() => {
      setStatus('saved')

      // Reset to idle after showing "Saved"
      timeoutRef.current = setTimeout(() => {
        setStatus('idle')
      }, savedDuration)
    }, remainingTime)
  }, [minSavingDuration, savedDuration])

  const failSave = useCallback(() => {
    setStatus('error')

    // Reset to idle after showing error
    timeoutRef.current = setTimeout(() => {
      setStatus('idle')
    }, savedDuration)
  }, [savedDuration])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setStatus('idle')
  }, [])

  return {
    status,
    startSaving,
    completeSave,
    failSave,
    reset,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    isError: status === 'error',
  }
}

/**
 * Create auto-save wrapper function
 * Automatically manages save status indicator
 */
export function createAutoSaveHandler<T>(
  onSave: (data: T) => void | Promise<void>,
  indicator: UseAutoSaveIndicatorReturn
): (data: T) => void {
  return (data: T) => {
    indicator.startSaving()

    try {
      const result = onSave(data)

      // Handle async saves
      if (result instanceof Promise) {
        result
          .then(() => indicator.completeSave())
          .catch(() => indicator.failSave())
      } else {
        indicator.completeSave()
      }
    } catch {
      indicator.failSave()
    }
  }
}
