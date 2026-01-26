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
