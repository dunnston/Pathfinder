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
}

type ProfileStore = ProfileState & ProfileActions;

// Generate a simple unique ID
function generateId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const initialState: ProfileState = {
  currentProfile: null,
  hasUnsavedChanges: false,
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
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
        }),

      loadProfile: (profile) =>
        set({
          currentProfile: profile,
          hasUnsavedChanges: false,
        }),

      updateSection: (section, data) =>
        set((state) => {
          if (!state.currentProfile) return state;

          return {
            currentProfile: {
              ...state.currentProfile,
              [section]: {
                ...state.currentProfile[section],
                ...data,
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
    }),
    {
      name: 'pathfinder-profile',
      // Custom serialization for Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          // Restore Date objects
          if (data.state?.currentProfile) {
            const profile = data.state.currentProfile;
            if (profile.createdAt) profile.createdAt = new Date(profile.createdAt);
            if (profile.updatedAt) profile.updatedAt = new Date(profile.updatedAt);
          }
          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
