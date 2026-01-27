/**
 * Application Constants
 * SEC-23: Centralized timeout and configuration values
 *
 * All hardcoded values should be defined here for:
 * - Easy modification
 * - Consistent usage across the app
 * - Better testability
 */

// ============================================
// Session & Security Timeouts (in milliseconds)
// ============================================

/** Session timeout - 15 minutes of inactivity */
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

/** Session warning - shown 2 minutes before timeout */
export const SESSION_WARNING_MS = 2 * 60 * 1000;

/** Auto-save debounce delay - 1 second */
export const AUTO_SAVE_DEBOUNCE_MS = 1000;

/** Activity throttle - minimum time between activity resets */
export const ACTIVITY_THROTTLE_MS = 1000;

/** Toast notification display duration */
export const TOAST_DURATION_MS = 3000;

/** Animation durations */
export const ANIMATION_DURATION_MS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// ============================================
// Storage Configuration
// ============================================

/** Local storage key prefix */
export const STORAGE_KEY_PREFIX = 'pathfinder';

/** Storage keys */
export const STORAGE_KEYS = {
  profile: `${STORAGE_KEY_PREFIX}-profile`,
  user: `${STORAGE_KEY_PREFIX}-user`,
  client: (id: string): string => `${STORAGE_KEY_PREFIX}-client-${id}`,
  welcomeSeen: `${STORAGE_KEY_PREFIX}-welcome-seen`,
  encryptionKey: `${STORAGE_KEY_PREFIX}-encryption-key`,
} as const;

/** Maximum storage size warning threshold (5MB) */
export const STORAGE_WARNING_THRESHOLD_BYTES = 5 * 1024 * 1024;

/** Storage retry configuration */
export const STORAGE_RETRY = {
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 1000,
} as const;

// ============================================
// Validation Limits
// ============================================

/** String length limits (SEC-4) */
export const STRING_LIMITS = {
  name: 100,
  shortText: 200,
  mediumText: 1000,
  longText: 5000,
  email: 254,
  phone: 20,
  notes: 10000,
} as const;

/** Numeric limits */
export const NUMERIC_LIMITS = {
  age: { min: 0, max: 120 },
  retirementAge: { min: 50, max: 100 },
  yearsOfService: { min: 0, max: 50 },
  percentage: { min: 0, max: 100 },
  currency: { min: 0, max: 100_000_000 },
} as const;

// ============================================
// Rate Limiting
// ============================================

/** Rate limit configuration */
export const RATE_LIMITS = {
  /** Maximum API calls per minute */
  apiCallsPerMinute: 60,
  /** Maximum form submissions per minute */
  formSubmitsPerMinute: 10,
  /** Maximum export operations per minute */
  exportsPerMinute: 5,
} as const;

// ============================================
// UI Configuration
// ============================================

/** Breakpoints (matching Tailwind defaults) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Pagination defaults */
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

/** Modal sizes */
export const MODAL_SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
} as const;

// ============================================
// Date/Time Configuration
// ============================================

/** Default date format locale */
export const DEFAULT_LOCALE = 'en-US';

/** Date format options */
export const DATE_FORMATS = {
  short: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
  long: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
  full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
  monthYear: { year: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
  time: { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions,
  dateTime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions,
} as const;

// ============================================
// Feature Flags (can be extended for env-based config)
// ============================================

/** Feature flags */
export const FEATURES = {
  /** Enable session timeout */
  sessionTimeout: true,
  /** Enable auto-save */
  autoSave: true,
  /** Enable encryption */
  encryption: true,
  /** Enable analytics (stub for future implementation) */
  analytics: false,
  /** Enable offline support */
  offlineSupport: false,
} as const;

// ============================================
// Export type helpers
// ============================================

export type StorageKey = keyof typeof STORAGE_KEYS;
export type DateFormatKey = keyof typeof DATE_FORMATS;
export type BreakpointKey = keyof typeof BREAKPOINTS;
