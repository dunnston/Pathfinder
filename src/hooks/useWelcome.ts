/**
 * Welcome Hook
 * SEC-27: Extracted from WelcomeModal to fix React Refresh warnings
 *
 * React Fast Refresh requires components to be in files that only export
 * components. Mixing component and hook exports causes warnings.
 */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/config/constants';

const WELCOME_SEEN_KEY = STORAGE_KEYS.welcomeSeen;

/**
 * Hook to check if welcome has been seen
 */
export function useHasSeenWelcome(): boolean {
  const [hasSeen, setHasSeen] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY);
    setHasSeen(!!seen);
  }, []);

  return hasSeen;
}

/**
 * Hook to manage welcome modal state
 */
export function useWelcomeModal(): {
  isOpen: boolean;
  markAsSeen: () => void;
  reset: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const markAsSeen = useCallback(() => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(WELCOME_SEEN_KEY);
    setIsOpen(true);
  }, []);

  return { isOpen, markAsSeen, reset };
}

/**
 * Function to reset welcome state (for testing)
 */
export function resetWelcomeState(): void {
  localStorage.removeItem(WELCOME_SEEN_KEY);
}
