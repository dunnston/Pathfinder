/**
 * User Store
 * Manages current user state and mode selection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, UserPreferences } from '@/types';

interface UserState {
  // Current mode (consumer or advisor)
  mode: UserRole;
  // User preferences
  preferences: UserPreferences;
  // Whether the user has completed onboarding
  hasCompletedOnboarding: boolean;
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
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      reset: () => set(initialState),
    }),
    {
      name: 'pathfinder-user',
    }
  )
);
