/**
 * Discovery wizard navigation types
 */

import type { ProfileSection } from './profile';

/** Discovery section with metadata */
export interface DiscoverySection {
  id: ProfileSection;
  title: string;
  description: string;
  estimatedMinutes: number;
  order: number;
}

/** All discovery sections in order */
export const DISCOVERY_SECTIONS: DiscoverySection[] = [
  {
    id: 'basicContext',
    title: 'Basic Context',
    description: 'Tell us about yourself and your situation',
    estimatedMinutes: 5,
    order: 1,
  },
  {
    id: 'retirementVision',
    title: 'Retirement Vision',
    description: 'What does your ideal retirement look like?',
    estimatedMinutes: 8,
    order: 2,
  },
  {
    id: 'planningPreferences',
    title: 'Planning Preferences',
    description: 'How do you like to make decisions?',
    estimatedMinutes: 6,
    order: 3,
  },
  {
    id: 'riskComfort',
    title: 'Risk & Comfort',
    description: 'Understanding your comfort with risk',
    estimatedMinutes: 5,
    order: 4,
  },
  {
    id: 'financialSnapshot',
    title: 'Financial Snapshot',
    description: 'A high-level view of your finances',
    estimatedMinutes: 10,
    order: 5,
  },
];

/** Discovery progress state */
export interface DiscoveryProgress {
  currentSection: ProfileSection;
  completedSections: ProfileSection[];
  startedAt: Date;
  lastActivityAt: Date;
}

/** Navigation direction in wizard */
export type NavigationDirection = 'next' | 'previous' | 'jump';

/** Discovery navigation action */
export interface DiscoveryNavigationAction {
  direction: NavigationDirection;
  targetSection?: ProfileSection;
}

/** Section validation result */
export interface SectionValidation {
  isValid: boolean;
  errors: SectionValidationError[];
  warnings: SectionValidationWarning[];
}

export interface SectionValidationError {
  field: string;
  message: string;
}

export interface SectionValidationWarning {
  field: string;
  message: string;
}
