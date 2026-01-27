/**
 * Rate Limiting Service
 * Client-side rate limiter for operations (SEC-16)
 */

interface RateLimitConfig {
  /** Maximum number of operations allowed */
  maxOperations: number
  /** Time window in milliseconds */
  windowMs: number
}

interface RateLimitState {
  operations: number[]
}

// Store rate limit states by key
const rateLimitStates = new Map<string, RateLimitState>()

/**
 * Default configurations for common operations
 */
export const RATE_LIMITS = {
  /** Form submissions */
  formSubmit: { maxOperations: 5, windowMs: 60000 }, // 5 per minute
  /** Profile exports */
  profileExport: { maxOperations: 3, windowMs: 60000 }, // 3 per minute
  /** Auto-save operations */
  autoSave: { maxOperations: 30, windowMs: 60000 }, // 30 per minute
  /** Client creation */
  clientCreate: { maxOperations: 10, windowMs: 60000 }, // 10 per minute
  /** General API-like operations */
  general: { maxOperations: 60, windowMs: 60000 }, // 60 per minute
} as const

/**
 * Check if an operation is rate limited
 * @param key Unique identifier for the operation type
 * @param config Rate limit configuration
 * @returns true if operation is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general
): boolean {
  const now = Date.now()
  const state = rateLimitStates.get(key) || { operations: [] }

  // Remove expired operations outside the window
  state.operations = state.operations.filter(
    timestamp => now - timestamp < config.windowMs
  )

  // Check if under limit
  if (state.operations.length < config.maxOperations) {
    state.operations.push(now)
    rateLimitStates.set(key, state)
    return true
  }

  return false
}

/**
 * Get remaining operations allowed
 * @param key Unique identifier for the operation type
 * @param config Rate limit configuration
 */
export function getRemainingOperations(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general
): number {
  const now = Date.now()
  const state = rateLimitStates.get(key)

  if (!state) return config.maxOperations

  const validOperations = state.operations.filter(
    timestamp => now - timestamp < config.windowMs
  )

  return Math.max(0, config.maxOperations - validOperations.length)
}

/**
 * Get time until rate limit resets (in milliseconds)
 * @param key Unique identifier for the operation type
 * @param config Rate limit configuration
 */
export function getResetTime(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general
): number {
  const state = rateLimitStates.get(key)

  if (!state || state.operations.length === 0) return 0

  const now = Date.now()
  const oldestOperation = Math.min(...state.operations)
  const resetTime = oldestOperation + config.windowMs - now

  return Math.max(0, resetTime)
}

/**
 * Clear rate limit state for a key
 */
export function clearRateLimit(key: string): void {
  rateLimitStates.delete(key)
}

/**
 * Clear all rate limit states
 */
export function clearAllRateLimits(): void {
  rateLimitStates.clear()
}

/**
 * Rate limit result with additional info
 */
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

/**
 * Check rate limit and return detailed result
 */
export function checkRateLimitDetailed(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general
): RateLimitResult {
  const allowed = checkRateLimit(key, config)
  return {
    allowed,
    remaining: getRemainingOperations(key, config),
    resetMs: allowed ? 0 : getResetTime(key, config),
  }
}

/**
 * Create a rate-limited wrapper for a function
 * @param fn Function to wrap
 * @param key Rate limit key
 * @param config Rate limit configuration
 * @param onRateLimited Callback when rate limited
 */
export function createRateLimitedFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general,
  onRateLimited?: (resetMs: number) => void
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    const result = checkRateLimitDetailed(key, config)

    if (!result.allowed) {
      onRateLimited?.(result.resetMs)
      return undefined
    }

    return fn(...args) as ReturnType<T>
  }
}

/**
 * Async rate-limited wrapper
 */
export function createAsyncRateLimitedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  key: string,
  config: RateLimitConfig = RATE_LIMITS.general,
  onRateLimited?: (resetMs: number) => void
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
    const result = checkRateLimitDetailed(key, config)

    if (!result.allowed) {
      onRateLimited?.(result.resetMs)
      return undefined
    }

    return fn(...args) as Awaited<ReturnType<T>>
  }
}
