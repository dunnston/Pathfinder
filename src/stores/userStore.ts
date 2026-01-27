/**
 * User Store
 * Manages current user state and mode selection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, UserPreferences } from '@/types';
import { createEncryptedStorage } from '@/services/encryption';
import { sanitizeObject } from '@/services/sanitization';

interface UserState {
  // Current mode (consumer or advisor)
  mode: UserRole;
  // User preferences
  preferences: UserPreferences;
  // Whether the user has completed onboarding
  hasCompletedOnboarding: boolean;
  /** Whether the store has been hydrated from localStorage */
  _hasHydrated: boolean;
}

interface UserActions {
  // Set the current mode
  setMode: (mode: UserRole) => void;
  // Update user preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  // Mark onboarding as complete
  completeOnboarding: () => void;
  // Reset to defaults
  reset: () => void;
}

type UserStore = UserState & UserActions;

const defaultPreferences: UserPreferences = {
  theme: 'system',
  autoSave: true,
  showTutorials: true,
};

const initialState: UserState = {
  mode: 'consumer',
  preferences: defaultPreferences,
  hasCompletedOnboarding: false,
  _hasHydrated: false,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),

      updatePreferences: (newPreferences) =>
        set((state) => {
          // SEC-2: Sanitize preferences to prevent prototype pollution
          const sanitizedPreferences = sanitizeObject(newPreferences);
          return {
            preferences: { ...state.preferences, ...sanitizedPreferences },
          };
        }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      reset: () => set(initialState),
    }),
    {
      name: 'pathfinder-user',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
      // SEC-1: Use encrypted storage for user preferences
      storage: {
        getItem: async (name) => {
          const encryptedStorage = createEncryptedStorage();
          const str = await encryptedStorage.getItem(name);
          if (!str) return null;

          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          const encryptedStorage = createEncryptedStorage();
          await encryptedStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          const encryptedStorage = createEncryptedStorage();
          encryptedStorage.removeItem(name);
        },
      },
    }
  )
);
