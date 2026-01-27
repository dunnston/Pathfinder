/**
 * Telemetry & Analytics Service
 * SEC-21: Infrastructure for usage tracking and error reporting
 *
 * This is a stub implementation that provides the interface for:
 * - Event tracking
 * - Error reporting
 * - Performance metrics
 * - User analytics
 *
 * In production, this can be connected to services like:
 * - Sentry for error tracking
 * - Mixpanel/Amplitude for analytics
 * - Google Analytics for web analytics
 *
 * Privacy Note: All telemetry is opt-in and respects user preferences.
 * Financial data is NEVER included in telemetry events.
 */

import { FEATURES } from '@/config/constants';

// ============================================
// Types
// ============================================

interface TelemetryEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

interface ErrorEvent {
  error: Error;
  context?: Record<string, string | number | boolean>;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
}

type EventCategory =
  | 'navigation'
  | 'interaction'
  | 'form'
  | 'error'
  | 'performance'
  | 'lifecycle';

// ============================================
// Configuration
// ============================================

interface TelemetryConfig {
  enabled: boolean;
  debug: boolean;
  sampleRate: number;
  endpoint?: string;
}

let config: TelemetryConfig = {
  enabled: FEATURES.analytics,
  debug: import.meta.env.DEV,
  sampleRate: 1.0, // 100% of events
  endpoint: undefined,
};

// ============================================
// Internal State
// ============================================

const eventQueue: TelemetryEvent[] = [];
const MAX_QUEUE_SIZE = 100;
let sessionId: string | null = null;

// ============================================
// Public API
// ============================================

/**
 * Initialize telemetry with configuration
 */
export function initTelemetry(options?: Partial<TelemetryConfig>): void {
  config = { ...config, ...options };

  if (!config.enabled) {
    log('Telemetry is disabled');
    return;
  }

  // Generate session ID
  sessionId = generateSessionId();
  log('Telemetry initialized', { sessionId });

  // Track session start
  trackEvent('session_start', 'lifecycle');
}

/**
 * Track a custom event
 *
 * @param name - Event name (e.g., 'button_clicked', 'form_submitted')
 * @param category - Event category
 * @param properties - Additional properties (NEVER include PII or financial data)
 */
export function trackEvent(
  name: string,
  category: EventCategory,
  properties?: Record<string, string | number | boolean>
): void {
  if (!config.enabled) return;

  // Sample rate check
  if (Math.random() > config.sampleRate) return;

  const event: TelemetryEvent = {
    name,
    category,
    properties: sanitizeProperties(properties),
    timestamp: Date.now(),
  };

  queueEvent(event);
  log('Event tracked', event);
}

/**
 * Track page navigation
 *
 * @param pageName - Page identifier
 * @param referrer - Previous page
 */
export function trackPageView(pageName: string, referrer?: string): void {
  trackEvent('page_view', 'navigation', {
    page: pageName,
    ...(referrer && { referrer }),
  });
}

/**
 * Track an error
 *
 * @param error - Error object
 * @param context - Additional context
 * @param severity - Error severity level
 */
export function trackError(
  error: Error,
  context?: Record<string, string | number | boolean>,
  severity: ErrorEvent['severity'] = 'error'
): void {
  if (!config.enabled) return;

  const errorEvent: ErrorEvent = {
    error,
    context: sanitizeProperties(context),
    severity,
  };

  trackEvent('error', 'error', {
    message: error.message,
    name: error.name,
    severity,
    ...sanitizeProperties(context),
  });

  log('Error tracked', errorEvent);
}

/**
 * Track a performance metric
 *
 * @param name - Metric name
 * @param value - Metric value
 * @param unit - Unit of measurement
 */
export function trackMetric(
  name: string,
  value: number,
  unit: PerformanceMetric['unit'] = 'ms'
): void {
  if (!config.enabled) return;

  trackEvent('metric', 'performance', {
    metric_name: name,
    metric_value: value,
    metric_unit: unit,
  });

  log('Metric tracked', { name, value, unit });
}

/**
 * Track form interactions
 *
 * @param formName - Form identifier
 * @param action - Action type
 * @param fieldCount - Number of fields (optional)
 */
export function trackForm(
  formName: string,
  action: 'start' | 'complete' | 'abandon' | 'error',
  fieldCount?: number
): void {
  trackEvent(`form_${action}`, 'form', {
    form_name: formName,
    ...(fieldCount !== undefined && { field_count: fieldCount }),
  });
}

/**
 * Track user interaction
 *
 * @param element - Element identifier
 * @param action - Action type
 */
export function trackInteraction(
  element: string,
  action: 'click' | 'hover' | 'focus' | 'scroll'
): void {
  trackEvent(`${element}_${action}`, 'interaction', {
    element,
    action,
  });
}

/**
 * Measure and track time for an operation
 *
 * @param name - Operation name
 * @param operation - Async operation to measure
 */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    trackMetric(name, duration, 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    trackMetric(`${name}_error`, duration, 'ms');
    throw error;
  }
}

/**
 * Get current session ID
 */
export function getSessionId(): string | null {
  return sessionId;
}

/**
 * Flush queued events (for testing or manual send)
 */
export function flushEvents(): TelemetryEvent[] {
  const events = [...eventQueue];
  eventQueue.length = 0;
  return events;
}

/**
 * Disable telemetry (for opt-out)
 */
export function disableTelemetry(): void {
  config.enabled = false;
  eventQueue.length = 0;
  log('Telemetry disabled');
}

/**
 * Enable telemetry (for opt-in)
 */
export function enableTelemetry(): void {
  config.enabled = true;
  log('Telemetry enabled');
}

// ============================================
// Internal Helpers
// ============================================

function queueEvent(event: TelemetryEvent): void {
  eventQueue.push(event);

  // Prevent queue from growing too large
  if (eventQueue.length > MAX_QUEUE_SIZE) {
    eventQueue.shift();
  }

  // In a real implementation, this would batch and send to an endpoint
  // For now, events are just queued for debugging
}

function sanitizeProperties(
  properties?: Record<string, string | number | boolean>
): Record<string, string | number | boolean> | undefined {
  if (!properties) return undefined;

  // Filter out any potentially sensitive keys
  const sensitiveKeys = [
    'password',
    'ssn',
    'email',
    'phone',
    'address',
    'account',
    'balance',
    'income',
    'salary',
    'financial',
  ];

  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sk) => lowerKey.includes(sk));

    if (!isSensitive) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function log(message: string, data?: unknown): void {
  if (config.debug) {
    console.log(`[Telemetry] ${message}`, data ?? '');
  }
}
