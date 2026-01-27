/**
 * Date Formatting Service
 * UX-27: Localized date formats using Intl.DateTimeFormat
 *
 * This service provides consistent, localized date formatting across the app.
 * Uses the browser's Intl.DateTimeFormat for proper internationalization.
 */

import { DEFAULT_LOCALE, DATE_FORMATS, type DateFormatKey } from '@/config/constants';

/**
 * Format a date using the specified format preset
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param format - Preset format key from DATE_FORMATS
 * @param locale - Optional locale override (defaults to browser locale or DEFAULT_LOCALE)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'short') // "Jan 27, 2026"
 * formatDate('2026-01-27', 'long') // "January 27, 2026"
 * formatDate(Date.now(), 'full') // "Monday, January 27, 2026"
 */
export function formatDate(
  date: Date | string | number,
  format: DateFormatKey = 'short',
  locale?: string
): string {
  try {
    const dateObj = toDate(date);
    if (!isValidDate(dateObj)) {
      return 'Invalid date';
    }

    const options = DATE_FORMATS[format];
    const resolvedLocale = locale || getPreferredLocale();

    return new Intl.DateTimeFormat(resolvedLocale, options).format(dateObj);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date with custom options
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Optional locale override
 * @returns Formatted date string
 */
export function formatDateCustom(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions,
  locale?: string
): string {
  try {
    const dateObj = toDate(date);
    if (!isValidDate(dateObj)) {
      return 'Invalid date';
    }

    const resolvedLocale = locale || getPreferredLocale();
    return new Intl.DateTimeFormat(resolvedLocale, options).format(dateObj);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 *
 * @param date - Date to compare against now
 * @param locale - Optional locale override
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "yesterday"
 * formatRelativeTime(new Date(Date.now() + 3600000)) // "in 1 hour"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale?: string
): string {
  try {
    const dateObj = toDate(date);
    if (!isValidDate(dateObj)) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffWeek = Math.round(diffDay / 7);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    const resolvedLocale = locale || getPreferredLocale();
    const rtf = new Intl.RelativeTimeFormat(resolvedLocale, { numeric: 'auto' });

    if (Math.abs(diffSec) < 60) {
      return rtf.format(diffSec, 'second');
    } else if (Math.abs(diffMin) < 60) {
      return rtf.format(diffMin, 'minute');
    } else if (Math.abs(diffHour) < 24) {
      return rtf.format(diffHour, 'hour');
    } else if (Math.abs(diffDay) < 7) {
      return rtf.format(diffDay, 'day');
    } else if (Math.abs(diffWeek) < 4) {
      return rtf.format(diffWeek, 'week');
    } else if (Math.abs(diffMonth) < 12) {
      return rtf.format(diffMonth, 'month');
    } else {
      return rtf.format(diffYear, 'year');
    }
  } catch {
    return 'Unknown';
  }
}

/**
 * Format a date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param locale - Optional locale override
 * @returns Formatted date range string
 *
 * @example
 * formatDateRange(new Date('2026-01-01'), new Date('2026-12-31'))
 * // "Jan 1 – Dec 31, 2026"
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  locale?: string
): string {
  try {
    const start = toDate(startDate);
    const end = toDate(endDate);

    if (!isValidDate(start) || !isValidDate(end)) {
      return 'Invalid date range';
    }

    const resolvedLocale = locale || getPreferredLocale();

    // Check if DateTimeFormat.formatRange is available
    if ('formatRange' in Intl.DateTimeFormat.prototype) {
      const formatter = new Intl.DateTimeFormat(resolvedLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (formatter as any).formatRange(start, end);
    }

    // Fallback for browsers without formatRange
    const formattedStart = formatDate(start, 'short', resolvedLocale);
    const formattedEnd = formatDate(end, 'short', resolvedLocale);
    return `${formattedStart} – ${formattedEnd}`;
  } catch {
    return 'Invalid date range';
  }
}

/**
 * Format an age from a birth date
 *
 * @param birthDate - Birth date
 * @returns Age in years, or null if invalid
 *
 * @example
 * formatAge(new Date('1980-05-15')) // 45 (assuming current date is 2026)
 */
export function calculateAge(birthDate: Date | string | number): number | null {
  try {
    const birth = toDate(birthDate);
    if (!isValidDate(birth)) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 0 ? age : null;
  } catch {
    return null;
  }
}

/**
 * Format years until a future age
 *
 * @param birthDate - Birth date
 * @param targetAge - Target age
 * @returns Years until target age, or null if invalid
 *
 * @example
 * yearsUntilAge(new Date('1980-05-15'), 67) // 21 (assuming 2026)
 */
export function yearsUntilAge(
  birthDate: Date | string | number,
  targetAge: number
): number | null {
  const currentAge = calculateAge(birthDate);
  if (currentAge === null || targetAge <= 0) {
    return null;
  }
  const years = targetAge - currentAge;
  return years > 0 ? years : 0;
}

/**
 * Parse a date string in ISO format (YYYY-MM-DD) to a Date object
 *
 * @param dateString - ISO date string
 * @returns Date object, or null if invalid
 */
export function parseISODate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  // Validate format: YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return null;
  }

  const date = new Date(dateString + 'T00:00:00');
  return isValidDate(date) ? date : null;
}

/**
 * Get an ISO date string (YYYY-MM-DD) from a Date
 *
 * @param date - Date to convert
 * @returns ISO date string, or empty string if invalid
 */
export function toISODateString(date: Date | string | number): string {
  try {
    const dateObj = toDate(date);
    if (!isValidDate(dateObj)) {
      return '';
    }
    return dateObj.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

// ============================================
// Internal Helpers
// ============================================

/**
 * Convert various date inputs to a Date object
 */
function toDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'number') {
    return new Date(date);
  }
  if (typeof date === 'string') {
    // Handle ISO date strings (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Date(date + 'T00:00:00');
    }
    return new Date(date);
  }
  return new Date(NaN);
}

/**
 * Check if a Date object is valid
 */
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Get the user's preferred locale
 */
function getPreferredLocale(): string {
  // Use browser's preferred locale if available
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return DEFAULT_LOCALE;
}
