/**
 * Environment Configuration and Validation
 * SEC-24: Build-time environment validation
 *
 * This module validates environment variables at build time and provides
 * type-safe access to configuration values.
 */

import { z } from 'zod';

// ============================================
// Environment Schema
// ============================================

/**
 * Schema for environment variables
 * Add new env vars here with appropriate defaults
 */
const envSchema = z.object({
  // Vite built-in variables
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),
  SSR: z.boolean().default(false),

  // App-specific variables (add custom vars here)
  // VITE_API_URL: z.string().url().optional(),
  // VITE_SENTRY_DSN: z.string().optional(),
  // VITE_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
});

type EnvConfig = z.infer<typeof envSchema>;

// ============================================
// Validation
// ============================================

/**
 * Parse and validate environment variables
 */
function parseEnv(): EnvConfig {
  try {
    // Get Vite's import.meta.env
    const rawEnv = {
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      SSR: import.meta.env.SSR,
      // Add custom env vars:
      // VITE_API_URL: import.meta.env.VITE_API_URL,
    };

    const result = envSchema.safeParse(rawEnv);

    if (!result.success) {
      const errors = result.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

      console.error(
        `[ENV] Invalid environment configuration:\n${errors}`
      );

      // In production, this should fail the build
      if (import.meta.env.PROD) {
        throw new Error(`Invalid environment configuration:\n${errors}`);
      }

      // In development, use defaults
      console.warn('[ENV] Using default values for invalid fields');
      return envSchema.parse({});
    }

    return result.data;
  } catch (error) {
    console.error('[ENV] Failed to parse environment:', error);
    throw error;
  }
}

// ============================================
// Exported Configuration
// ============================================

/**
 * Validated environment configuration
 * Access env vars through this object for type safety
 */
export const env: EnvConfig = parseEnv();

/**
 * Check if running in development mode
 */
export const isDev = (): boolean => env.DEV;

/**
 * Check if running in production mode
 */
export const isProd = (): boolean => env.PROD;

/**
 * Check if running in test mode
 */
export const isTest = (): boolean => env.MODE === 'test';

/**
 * Get the current environment mode
 */
export const getMode = (): string => env.MODE;

// ============================================
// Validation at Import Time
// ============================================

// Validate on module load - this will fail fast if env is misconfigured
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log(`[ENV] Running in ${env.MODE} mode`);
}
