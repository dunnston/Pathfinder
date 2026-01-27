/**
 * Sanitization Service
 * Protects against prototype pollution and other injection attacks
 *
 * Security Notes:
 * - Blocks dangerous keys like __proto__, constructor, prototype
 * - Recursively sanitizes nested objects and arrays
 * - Use before spreading user input or storing data
 */

/** Keys that could be used for prototype pollution attacks */
const DANGEROUS_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

/**
 * Check if a key is dangerous (could cause prototype pollution)
 */
export function isDangerousKey(key: string): boolean {
  return DANGEROUS_KEYS.has(key);
}

/**
 * Sanitize an object by removing dangerous keys (recursively)
 * Prevents prototype pollution attacks
 *
 * @param obj - The object to sanitize
 * @returns A new sanitized object
 */
export function sanitizeObject<T>(obj: T): T {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle non-objects (primitives)
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle Date objects (preserve them)
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }

  // Handle plain objects
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Skip dangerous keys
    if (isDangerousKey(key)) {
      console.warn(`[Security] Blocked dangerous key: ${key}`);
      continue;
    }

    // Recursively sanitize nested values
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized as T;
}

/**
 * Sanitize a string to prevent XSS attacks
 * Escapes HTML special characters
 *
 * @param str - The string to sanitize
 * @returns Sanitized string safe for HTML display
 */
export function sanitizeHtml(str: string): string {
  if (typeof str !== 'string') {
    return String(str);
  }

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate and sanitize a URL
 * Only allows http, https, and relative URLs
 *
 * @param url - The URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Only allow http and https
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Invalid URL
  }

  return '';
}

/**
 * Sanitize form data before storing
 * Combines object sanitization with string trimming
 *
 * @param data - The form data to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormInput<T extends Record<string, unknown>>(data: T): T {
  const sanitized = sanitizeObject(data);

  // Also trim all string values
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(sanitized as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Safe JSON parse that sanitizes the result
 *
 * @param json - JSON string to parse
 * @returns Parsed and sanitized object, or null if invalid
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json);
    return sanitizeObject(parsed) as T;
  } catch {
    return null;
  }
}

/**
 * Merge objects safely, preventing prototype pollution
 *
 * @param target - Target object
 * @param source - Source object to merge from
 * @returns New merged object
 */
export function safeMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const sanitizedTarget = sanitizeObject(target);
  const sanitizedSource = sanitizeObject(source);

  return {
    ...sanitizedTarget,
    ...sanitizedSource,
  } as T;
}
