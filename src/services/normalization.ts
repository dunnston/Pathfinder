/**
 * Data Normalization Utilities
 * Standardizes empty values and form data before storage/submission
 */

/**
 * Normalize an optional string value.
 * - Returns undefined for null, undefined, or empty/whitespace-only strings.
 * - Returns trimmed string otherwise.
 */
export function normalizeOptionalString(value: string | undefined | null): string | undefined {
  if (value === null || value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Normalize an optional array value.
 * - Returns undefined for null, undefined, or empty arrays.
 * - Returns the array as-is if it has items.
 */
export function normalizeOptionalArray<T>(arr: T[] | undefined | null): T[] | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr;
}

/**
 * Normalize an optional number value.
 * - Returns undefined for null, undefined, or NaN.
 * - Returns the number as-is otherwise.
 */
export function normalizeOptionalNumber(value: number | undefined | null): number | undefined {
  if (value === null || value === undefined || Number.isNaN(value)) return undefined;
  return value;
}

/**
 * Normalize form data object by converting empty strings to undefined.
 * Recursively handles nested objects.
 */
export function normalizeFormData<T extends Record<string, unknown>>(data: T): T {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      normalized[key] = normalizeOptionalString(value);
    } else if (Array.isArray(value)) {
      normalized[key] = normalizeOptionalArray(value);
    } else if (value !== null && typeof value === 'object') {
      // Recursively normalize nested objects (but not Date objects)
      if (value instanceof Date) {
        normalized[key] = value;
      } else {
        normalized[key] = normalizeFormData(value as Record<string, unknown>);
      }
    } else {
      normalized[key] = value;
    }
  }

  return normalized as T;
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array).
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Get value or undefined if empty.
 * Useful for conditional rendering.
 */
export function valueOrUndefined<T>(value: T | null | undefined): T | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  return value;
}
