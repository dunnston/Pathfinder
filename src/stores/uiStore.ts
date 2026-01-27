/**
 * UI Store
 * Manages UI state and wizard navigation
 */

import { create } from 'zustand';
import type { ProfileSection, DiscoveryProgress } from '@/types';

/** Order of discovery sections */
export const SECTION_ORDER: ProfileSection[] = [
  'basicContext',
  'retirementVision',
  'planningPreferences',
  'riskComfort',
  'financialSnapshot',
];

/** Section metadata */
export const SECTION_INFO: Record<ProfileSection, { title: string; description: string; estimatedMinutes: number }> = {
  basicContext: {
    title: 'Basic Context',
    description: 'Personal and employment information',
    estimatedMinutes: 5,
  },
  retirementVision: {
    title: 'Retirement Vision',
    description: 'Goals, concerns, and priorities',
    estimatedMinutes: 8,
  },
  planningPreferences: {
    title: 'Planning Preferences',
    description: 'Decision-making style and values',
    estimatedMinutes: 6,
  },
  riskComfort: {
    title: 'Risk & Income Comfort',
    description: 'Risk tolerance and income preferences',
    estimatedMinutes: 5,
  },
  financialSnapshot: {
    title: 'Financial Snapshot',
    description: 'Overview of financial situation',
    estimatedMinutes: 7,
  },
};

interface UIState {
  // Discovery wizard state
  discoveryProgress: DiscoveryProgress | null;
  // Sidebar collapsed state (for advisor mode)
  sidebarCollapsed: boolean;
  // Mobile menu open state
  mobileMenuOpen: boolean;
  // Modal state
  activeModal: string | null;
  // Toast/notification queue
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIActions {
  // Discovery navigation
  startDiscovery: () => void;
  goToSection: (section: ProfileSection) => void;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
  completeSection: (section: ProfileSection) => void;
  resetDiscovery: () => void;

  // UI state
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Modal management
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

// Generate cryptographically secure notification ID
function generateNotificationId(): string {
  return `notif_${crypto.randomUUID()}`;
}

const initialState: UIState = {
  discoveryProgress: null,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeModal: null,
  notifications: [],
};

export const useUIStore = create<UIStore>()((set, get) => ({
  ...initialState,

  // Discovery navigation
  startDiscovery: () =>
    set({
      discoveryProgress: {
        currentSection: SECTION_ORDER[0],
        completedSections: [],
        startedAt: new Date(),
        lastActivityAt: new Date(),
      },
    }),

  goToSection: (section) =>
    set((state) => ({
      discoveryProgress: state.discoveryProgress
        ? {
            ...state.discoveryProgress,
            currentSection: section,
            lastActivityAt: new Date(),
          }
        : null,
    })),

  goToNextSection: () => {
    const { discoveryProgress } = get();
    if (!discoveryProgress) return;

    const currentIndex = SECTION_ORDER.indexOf(discoveryProgress.currentSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
      set({
        discoveryProgress: {
          ...discoveryProgress,
          currentSection: SECTION_ORDER[currentIndex + 1],
          lastActivityAt: new Date(),
        },
      });
    }
  },

  goToPreviousSection: () => {
    const { discoveryProgress } = get();
    if (!discoveryProgress) return;

    const currentIndex = SECTION_ORDER.indexOf(discoveryProgress.currentSection);
    if (currentIndex > 0) {
      set({
        discoveryProgress: {
          ...discoveryProgress,
          currentSection: SECTION_ORDER[currentIndex - 1],
          lastActivityAt: new Date(),
        },
      });
    }
  },

  completeSection: (section) =>
    set((state) => {
      if (!state.discoveryProgress) return state;

      const completedSections = state.discoveryProgress.completedSections.includes(section)
        ? state.discoveryProgress.completedSections
        : [...state.discoveryProgress.completedSections, section];

      return {
        discoveryProgress: {
          ...state.discoveryProgress,
          completedSections,
          lastActivityAt: new Date(),
        },
      };
    }),

  resetDiscovery: () => set({ discoveryProgress: null }),

  // UI state
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Modal management
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  // Notifications
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: generateNotificationId() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
