/**
 * Client types for Advisor Mode
 * Manages multiple client profiles
 */

import type { ProfileSection } from './profile';

/** Client status in advisor's workflow */
export type ClientStatus =
  | 'active' // Currently working with
  | 'pending' // Not started yet
  | 'completed' // Profile complete
  | 'archived'; // No longer active

/** Section progress tracking */
export type SectionProgress = Partial<Record<ProfileSection, number>>;

/** Client metadata for advisor view */
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  profileCompletion: number; // 0-1
  sectionProgress: SectionProgress;
  advisorNotes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Filter options for client list */
export interface ClientFilters {
  status?: ClientStatus[];
  searchQuery?: string;
  tags?: string[];
}

/** Sort options for client list */
export type ClientSortField = 'name' | 'updatedAt' | 'profileCompletion' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface ClientSortOptions {
  field: ClientSortField;
  direction: SortDirection;
}

/** Input for creating a new client */
export interface CreateClientInput {
  name: string;
  email?: string;
  phone?: string;
  advisorNotes?: string;
}
