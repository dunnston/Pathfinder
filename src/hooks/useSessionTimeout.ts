/**
 * Session Timeout Hook
 * Automatically clears sensitive data after a period of inactivity
 *
 * Security Notes:
 * - Default timeout is 15 minutes of inactivity
 * - Shows a warning 2 minutes before timeout
 * - Clears profile data when timeout occurs
 * - Resets timer on user interaction
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/stores';

interface UseSessionTimeoutOptions {
  /** Timeout in milliseconds (default: 15 minutes) */
  timeoutMs?: number;
  /** Warning time before timeout in milliseconds (default: 2 minutes) */
  warningMs?: number;
  /** Whether to redirect on timeout (default: true) */
  redirectOnTimeout?: boolean;
  /** Path to redirect to on timeout (default: '/') */
  redirectPath?: string;
  /** Whether the timeout is enabled (default: true) */
  enabled?: boolean;
}

interface UseSessionTimeoutReturn {
  /** Whether the warning modal should be shown */
  showWarning: boolean;
  /** Time remaining until timeout in seconds */
  timeRemaining: number;
  /** Reset the timeout timer */
  resetTimer: () => void;
  /** Dismiss the warning and reset */
  dismissWarning: () => void;
}

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const DEFAULT_WARNING = 2 * 60 * 1000; // 2 minutes

const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'mousemove',
] as const;

export function useSessionTimeout(
  options: UseSessionTimeoutOptions = {}
): UseSessionTimeoutReturn {
  const {
    timeoutMs = DEFAULT_TIMEOUT,
    warningMs = DEFAULT_WARNING,
    redirectOnTimeout = true,
    redirectPath = '/',
    enabled = true,
  } = options;

  const navigate = useNavigate();
  const { clearProfile } = useProfileStore();

  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  /**
   * Clear all timers
   */
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  /**
   * Handle session timeout
   */
  const handleTimeout = useCallback(() => {
    clearTimers();
    setShowWarning(false);

    // Clear sensitive data
    clearProfile();

    // Show message and redirect
    if (redirectOnTimeout) {
      // Use a simple alert for now - could be enhanced with a modal
      alert('Your session has expired due to inactivity. Your data has been cleared for security.');
      navigate(redirectPath);
    }
  }, [clearTimers, clearProfile, navigate, redirectOnTimeout, redirectPath]);

  /**
   * Start countdown warning
   */
  const startWarning = useCallback(() => {
    setShowWarning(true);
    setTimeRemaining(Math.floor(warningMs / 1000));

    // Start countdown
    countdownRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set final timeout
    timeoutRef.current = window.setTimeout(handleTimeout, warningMs);
  }, [warningMs, handleTimeout]);

  /**
   * Reset the timeout timer
   */
  const resetTimer = useCallback(() => {
    if (!enabled) return;

    lastActivityRef.current = Date.now();
    clearTimers();
    setShowWarning(false);

    // Set warning timer
    warningTimeoutRef.current = window.setTimeout(startWarning, timeoutMs - warningMs);
  }, [enabled, clearTimers, timeoutMs, warningMs, startWarning]);

  /**
   * Dismiss warning and reset timer
   */
  const dismissWarning = useCallback(() => {
    setShowWarning(false);
    resetTimer();
  }, [resetTimer]);

  /**
   * Handle user activity
   */
  const handleActivity = useCallback(() => {
    // Don't reset if warning is shown (user must actively dismiss it)
    if (showWarning) return;

    // Throttle - only reset if more than 1 second since last activity
    const now = Date.now();
    if (now - lastActivityRef.current > 1000) {
      resetTimer();
    }
  }, [showWarning, resetTimer]);

  /**
   * Set up activity listeners and initial timer
   */
  useEffect(() => {
    if (!enabled) return;

    // Start initial timer
    resetTimer();

    // Add activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, resetTimer, handleActivity, clearTimers]);

  return {
    showWarning,
    timeRemaining,
    resetTimer,
    dismissWarning,
  };
}

/**
 * Format seconds as mm:ss
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
