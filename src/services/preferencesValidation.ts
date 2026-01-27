/**
 * User Preferences Validation
 * SEC-22: Validate user preferences on load to prevent corrupted state
 *
 * This service validates user preferences when they are loaded from storage,
 * ensuring that stored data is valid and resetting to defaults if necessary.
 */

import { z } from 'zod';
import type { UserPreferences, UserRole } from '@/types';
import { logger } from './logger';

// ============================================
// Validation Schemas
// ============================================

/**
 * User preferences schema
 */
const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  autoSave: z.boolean().default(true),
  showTutorials: z.boolean().default(true),
}).strict();

/**
 * User role schema
 */
const UserRoleSchema = z.enum(['consumer', 'advisor']);

/**
 * Full user state schema
 */
const UserStateSchema = z.object({
  mode: UserRoleSchema.default('consumer'),
  preferences: UserPreferencesSchema,
  hasCompletedOnboarding: z.boolean().default(false),
  _hasHydrated: z.boolean().optional(),
}).passthrough(); // Allow additional fields for future compatibility

// ============================================
// Default Values
// ============================================

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  autoSave: true,
  showTutorials: true,
};

export const DEFAULT_USER_STATE = {
  mode: 'consumer' as UserRole,
  preferences: DEFAULT_PREFERENCES,
  hasCompletedOnboarding: false,
};

// ============================================
// Validation Functions
// ============================================

/**
 * Validate and sanitize user preferences
 *
 * @param preferences - Raw preferences object from storage
 * @returns Validated preferences or defaults
 */
export function validatePreferences(
  preferences: unknown
): UserPreferences {
  try {
    const result = UserPreferencesSchema.safeParse(preferences);

    if (result.success) {
      return result.data;
    }

    logger.warn('Invalid user preferences, using defaults', {
      errors: result.error.issues.map((i) => i.message),
    });

    return DEFAULT_PREFERENCES;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Error validating preferences', err);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Validate user role
 *
 * @param mode - Raw mode value from storage
 * @returns Validated role or default
 */
export function validateUserRole(mode: unknown): UserRole {
  try {
    const result = UserRoleSchema.safeParse(mode);

    if (result.success) {
      return result.data;
    }

    logger.warn('Invalid user role, using default');
    return 'consumer';
  } catch {
    return 'consumer';
  }
}

/**
 * Validate full user state from storage
 *
 * @param state - Raw state object from storage
 * @returns Validated state with defaults applied
 */
export function validateUserState(state: unknown): typeof DEFAULT_USER_STATE {
  try {
    if (!state || typeof state !== 'object') {
      logger.warn('User state is null or not an object, using defaults');
      return DEFAULT_USER_STATE;
    }

    const result = UserStateSchema.safeParse(state);

    if (result.success) {
      return {
        mode: result.data.mode,
        preferences: result.data.preferences,
        hasCompletedOnboarding: result.data.hasCompletedOnboarding,
      };
    }

    // Partial validation - try to recover what we can
    const partialState = state as Record<string, unknown>;

    return {
      mode: validateUserRole(partialState.mode),
      preferences: validatePreferences(partialState.preferences),
      hasCompletedOnboarding:
        typeof partialState.hasCompletedOnboarding === 'boolean'
          ? partialState.hasCompletedOnboarding
          : false,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Error validating user state', err);
    return DEFAULT_USER_STATE;
  }
}

/**
 * Check if preferences have been corrupted
 *
 * @param preferences - Preferences to check
 * @returns True if preferences appear corrupted
 */
export function isCorruptedPreferences(preferences: unknown): boolean {
  if (!preferences || typeof preferences !== 'object') {
    return true;
  }

  const prefs = preferences as Record<string, unknown>;

  // Check for unexpected types
  if (prefs.theme !== undefined && typeof prefs.theme !== 'string') {
    return true;
  }

  if (prefs.autoSave !== undefined && typeof prefs.autoSave !== 'boolean') {
    return true;
  }

  if (prefs.showTutorials !== undefined && typeof prefs.showTutorials !== 'boolean') {
    return true;
  }

  return false;
}

/**
 * Migrate preferences from old schema versions
 *
 * @param preferences - Old preferences object
 * @param version - Schema version
 * @returns Migrated preferences
 */
export function migratePreferences(
  preferences: unknown,
  _version?: number
): UserPreferences {
  // Currently no migrations needed, but this provides the hook for future use
  // When migrations are needed, use version to determine which migrations to apply
  return validatePreferences(preferences);
}
