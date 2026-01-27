/**
 * Profile Store
 * Manages the current financial profile state with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PartialFinancialProfile,
  ProfileStatus,
  ProfileSection,
  BasicContext,
  RetirementVision,
  PlanningPreferences,
  RiskComfort,
  FinancialSnapshot,
} from '@/types';
import { createEncryptedStorage } from '@/services/encryption';
import { sanitizeObject } from '@/services/sanitization';

// Type for section data mapping
type SectionDataMap = {
  basicContext: Partial<BasicContext>;
  retirementVision: Partial<RetirementVision>;
  planningPreferences: Partial<PlanningPreferences>;
  riskComfort: Partial<RiskComfort>;
  financialSnapshot: Partial<FinancialSnapshot>;
};

interface ProfileState {
  // Current profile being edited
  currentProfile: PartialFinancialProfile | null;
  // Whether there are unsaved changes
  hasUnsavedChanges: boolean;
  // Whether the store has been hydrated from localStorage
  _hasHydrated: boolean;
  // Current client ID for advisor mode (null for consumer mode)
  _currentClientId: string | null;
}

interface ProfileActions {
  // Initialize a new profile
  initializeProfile: (userId: string) => void;
  // Load an existing profile
  loadProfile: (profile: PartialFinancialProfile) => void;
  // Update a specific section
  updateSection: <K extends ProfileSection>(
    section: K,
    data: SectionDataMap[K]
  ) => void;
  // Update profile status
  updateStatus: (status: ProfileStatus) => void;
  // Update advisor notes
  updateAdvisorNotes: (notes: string) => void;
  // Mark changes as saved
  markSaved: () => void;
  // Clear the current profile
  clearProfile: () => void;
  // Load a client's profile from client-specific storage (advisor mode)
  loadClientProfile: (clientId: string) => void;
  // Save the current profile to client-specific storage (advisor mode)
  saveClientProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

// Generate a cryptographically secure unique ID
function generateId(): string {
  return `profile_${crypto.randomUUID()}`;
}

const initialState: ProfileState = {
  currentProfile: null,
  hasUnsavedChanges: false,
  _hasHydrated: false,
  _currentClientId: null,
};

// Helper to restore dates from stored profile
function restoreProfileDates(profile: PartialFinancialProfile): PartialFinancialProfile {
  return {
    ...profile,
    createdAt: profile.createdAt ? new Date(profile.createdAt) : new Date(),
    updatedAt: profile.updatedAt ? new Date(profile.updatedAt) : new Date(),
  };
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeProfile: (userId) =>
        set({
          currentProfile: {
            id: generateId(),
            userId,
            status: 'not_started',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          hasUnsavedChanges: false,
          _currentClientId: null, // Consumer mode
        }),

      loadProfile: (profile) =>
        set({
          currentProfile: profile,
          hasUnsavedChanges: false,
        }),

      updateSection: (section, data) =>
        set((state) => {
          if (!state.currentProfile) return state;

          // SEC-2: Sanitize data to prevent prototype pollution
          const sanitizedData = sanitizeObject(data);

          return {
            currentProfile: {
              ...state.currentProfile,
              [section]: {
                ...state.currentProfile[section],
                ...sanitizedData,
              },
              status: state.currentProfile.status === 'not_started'
                ? 'in_progress'
                : state.currentProfile.status,
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          };
        }),

      updateStatus: (status) =>
        set((state) => {
          if (!state.currentProfile) return state;

          return {
            currentProfile: {
              ...state.currentProfile,
              status,
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          };
        }),

      updateAdvisorNotes: (notes) =>
        set((state) => {
          if (!state.currentProfile) return state;

          return {
            currentProfile: {
              ...state.currentProfile,
              advisorNotes: notes,
              updatedAt: new Date(),
            },
            hasUnsavedChanges: true,
          };
        }),

      markSaved: () => set({ hasUnsavedChanges: false }),

      clearProfile: () => set(initialState),

      loadClientProfile: (clientId: string) => {
        // First, save current client's profile if there is one
        const currentState = get();
        if (currentState._currentClientId && currentState.currentProfile) {
          const storageKey = `pathfinder-client-${currentState._currentClientId}`;
          try {
            localStorage.setItem(storageKey, JSON.stringify({
              state: { currentProfile: currentState.currentProfile }
            }));
          } catch {
            // Silently fail - storage might be full
          }
        }

        // Now load the new client's profile
        const storageKey = `pathfinder-client-${clientId}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          try {
            const data = JSON.parse(stored);
            const profile = data.state?.currentProfile;
            if (profile) {
              set({
                currentProfile: restoreProfileDates(profile),
                hasUnsavedChanges: false,
                _currentClientId: clientId,
              });
              return;
            }
          } catch {
            // Fall through to initialize new profile
          }
        }

        // Initialize new profile if none exists
        set({
          currentProfile: {
            id: generateId(),
            userId: clientId,
            status: 'not_started',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          hasUnsavedChanges: false,
          _currentClientId: clientId,
        });
      },

      saveClientProfile: () => {
        const state = get();
        if (!state.currentProfile || !state._currentClientId) return;

        const storageKey = `pathfinder-client-${state._currentClientId}`;
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            state: { currentProfile: state.currentProfile }
          }));
          set({ hasUnsavedChanges: false });
        } catch {
          // Silently fail - storage might be full
        }
      },
    }),
    {
      name: 'pathfinder-profile',
      // Track when hydration completes
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
      // SEC-1: Use encrypted storage for sensitive financial data
      storage: {
        getItem: async (name) => {
          const encryptedStorage = createEncryptedStorage();
          const str = await encryptedStorage.getItem(name);
          if (!str) return null;

          try {
            const data = JSON.parse(str);
            // Restore Date objects
            if (data.state?.currentProfile) {
              const profile = data.state.currentProfile;
              if (profile.createdAt) profile.createdAt = new Date(profile.createdAt);
              if (profile.updatedAt) profile.updatedAt = new Date(profile.updatedAt);
            }
            return data;
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
