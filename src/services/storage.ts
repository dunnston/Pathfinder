/**
 * Storage Service
 * Provides localStorage monitoring, quota management (SEC-12), and retry logic (SEC-25)
 */

import { STORAGE_RETRY } from '@/config/constants'
import { logger } from './logger'

// Estimated localStorage quota (5MB is typical browser limit)
const ESTIMATED_QUOTA_BYTES = 5 * 1024 * 1024

// Warning threshold (80% of quota)
const WARNING_THRESHOLD = 0.8

// ============================================
// Retry Logic (SEC-25)
// ============================================

interface RetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  onRetry?: (attempt: number, error: Error) => void
}

/**
 * Execute an operation with exponential backoff retry
 *
 * @param operation - Async operation to execute
 * @param options - Retry configuration
 * @returns Result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T> | T,
  options?: RetryOptions
): Promise<T> {
  const {
    maxAttempts = STORAGE_RETRY.maxAttempts,
    baseDelayMs = STORAGE_RETRY.baseDelayMs,
    maxDelayMs = STORAGE_RETRY.maxDelayMs,
    onRetry,
  } = options || {}

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        logger.error('Operation failed after max retries', {
          attempt,
          error: lastError.message,
        })
        throw lastError
      }

      // Calculate exponential backoff delay
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt - 1),
        maxDelayMs
      )

      logger.warn('Operation failed, retrying', {
        attempt,
        nextAttemptIn: delay,
        error: lastError.message,
      })

      onRetry?.(attempt, lastError)

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown error in retry')
}

/**
 * Safe localStorage getItem with retry
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    logger.error('Failed to get item from localStorage', { key, error })
    return null
  }
}

/**
 * Safe localStorage setItem with retry and quota handling
 *
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Retry options
 * @returns True if successful
 */
export async function safeSetItemWithRetry(
  key: string,
  value: string,
  options?: RetryOptions
): Promise<boolean> {
  return withRetry(async () => {
    const success = safeSetItem(key, value)
    if (!success) {
      throw new Error('QuotaExceeded')
    }
    return true
  }, options).catch(() => false)
}

/**
 * Safe localStorage removeItem with error handling
 *
 * @param key - Storage key
 */
export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    logger.error('Failed to remove item from localStorage', { key, error })
  }
}

export interface StorageInfo {
  used: number
  estimated: number
  percentage: number
  isNearQuota: boolean
}

/**
 * Get current localStorage usage information
 */
export function getStorageInfo(): StorageInfo {
  let used = 0

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          // Each character is 2 bytes in UTF-16
          used += (key.length + value.length) * 2
        }
      }
    }
  } catch {
    // localStorage not available or quota exceeded
    used = ESTIMATED_QUOTA_BYTES
  }

  const percentage = used / ESTIMATED_QUOTA_BYTES
  return {
    used,
    estimated: ESTIMATED_QUOTA_BYTES,
    percentage,
    isNearQuota: percentage >= WARNING_THRESHOLD,
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if there's enough space to store data
 * @param dataSize Size of data to store in bytes
 */
export function hasEnoughSpace(dataSize: number): boolean {
  const info = getStorageInfo()
  return (info.used + dataSize) < ESTIMATED_QUOTA_BYTES
}

/**
 * Safely set item in localStorage with quota check
 * @returns true if successful, false if quota would be exceeded
 */
export function safeSetItem(key: string, value: string): boolean {
  const dataSize = (key.length + value.length) * 2

  if (!hasEnoughSpace(dataSize)) {
    return false
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    // QuotaExceededError
    if (e instanceof DOMException && (e.code === 22 || e.name === 'QuotaExceededError')) {
      return false
    }
    throw e
  }
}

/**
 * Clean up old or unused data to free space
 * @param prefixesToKeep Array of key prefixes to preserve
 */
export function cleanupStorage(prefixesToKeep: string[] = ['pathfinder-']): number {
  let freedBytes = 0

  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const shouldKeep = prefixesToKeep.some(prefix => key.startsWith(prefix))
        if (!shouldKeep) {
          const value = localStorage.getItem(key)
          if (value) {
            freedBytes += (key.length + value.length) * 2
          }
          keysToRemove.push(key)
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch {
    // Ignore errors during cleanup
  }

  return freedBytes
}

/**
 * Get storage usage by prefix
 */
export function getStorageByPrefix(): Map<string, number> {
  const usage = new Map<string, number>()

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        const size = value ? (key.length + value.length) * 2 : 0

        // Extract prefix (everything before first hyphen or underscore)
        const prefixMatch = key.match(/^([a-zA-Z]+)[-_]/)
        const prefix = prefixMatch ? prefixMatch[1] : 'other'

        const current = usage.get(prefix) || 0
        usage.set(prefix, current + size)
      }
    }
  } catch {
    // Ignore errors
  }

  return usage
}

/**
 * Monitor storage and warn if near quota
 * Call this periodically or after large writes
 */
export function monitorStorage(): StorageInfo {
  const info = getStorageInfo()

  if (info.isNearQuota && import.meta.env.DEV) {
    console.warn(
      `[Storage Warning] localStorage is ${(info.percentage * 100).toFixed(1)}% full ` +
      `(${formatBytes(info.used)} of ${formatBytes(info.estimated)})`
    )
  }

  return info
}
