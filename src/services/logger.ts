/**
 * Logger Service
 * Production-safe logging that avoids exposing sensitive data
 *
 * Security Notes:
 * - Only logs to console in development mode
 * - Sanitizes error messages to avoid exposing internal details
 * - In production, errors should be sent to an error tracking service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Check if we're in development mode
 */
const isDev = import.meta.env.DEV;

/**
 * Sanitize error messages for production
 * Removes potentially sensitive information like paths, IDs, etc.
 */
function sanitizeMessage(message: string): string {
  if (isDev) return message;

  // Remove file paths
  let sanitized = message.replace(/\/[\w\-./]+/g, '[path]');

  // Remove potential IDs
  sanitized = sanitized.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[uuid]');
  sanitized = sanitized.replace(/\b[a-f0-9]{24,}\b/gi, '[id]');

  // Remove email addresses
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');

  return sanitized;
}

/**
 * Sanitize context object for production
 * Removes sensitive fields
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context || isDev) return context;

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'authorization',
    'email',
    'phone',
    'ssn',
    'birthDate',
    'firstName',
    'lastName',
    'address',
  ];

  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
      sanitized[key] = '[redacted]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value as LogContext);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

/**
 * Logger class with production-safe logging
 */
class Logger {
  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (!isDev) return;
    console.debug(formatMessage('debug', message), context ?? '');
  }

  /**
   * Log info message (development only)
   */
  info(message: string, context?: LogContext): void {
    if (!isDev) return;
    console.info(formatMessage('info', message), context ?? '');
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    if (!isDev) return;
    console.warn(
      formatMessage('warn', sanitizeMessage(message)),
      sanitizeContext(context) ?? ''
    );
  }

  /**
   * Log error message
   * In production, this would send to an error tracking service
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const sanitizedMessage = sanitizeMessage(message);
    const sanitizedContext = sanitizeContext(context);

    if (isDev) {
      console.error(formatMessage('error', sanitizedMessage), error, sanitizedContext ?? '');
    } else {
      // In production, send to error tracking service
      // Example: Sentry, LogRocket, DataDog, etc.
      // sendToErrorTracking({ message: sanitizedMessage, error, context: sanitizedContext });

      // For now, just log a minimal error to console
      console.error(`[ERROR] ${sanitizedMessage}`);
    }
  }

  /**
   * Log security-related events
   * These are always logged (in a sanitized form) for audit purposes
   */
  security(event: string, context?: LogContext): void {
    const sanitizedContext = sanitizeContext(context);

    if (isDev) {
      console.warn(formatMessage('info', `[SECURITY] ${event}`), sanitizedContext ?? '');
    } else {
      // In production, send to security logging service
      // Example: Security Information and Event Management (SIEM)
      console.warn(`[SECURITY] ${event}`);
    }
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Log levels for conditional logging
 */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;
