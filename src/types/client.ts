/**
 * Client types for Advisor Mode
 * Manages multiple client profiles
 */

import type { ProfileStatus } from './profile';

/** Client status in advisor's workflow */
export type ClientStatus =
  | 'active' // Currently working with
  | 'pending' // Waiting for client action
  | 'completed' // Profile complete, plan in place
  | 'archived'; // No longer active

/** Client metadata for advisor view */
export interface Client {
  id: string;
  advisorId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profileId: string;
  profileStatus: ProfileStatus;
  clientStatus: ClientStatus;
  lastContactDate?: Date;
  nextActionDate?: Date;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Summary view of client for list display */
export interface ClientListItem {
  id: string;
  firstName: string;
  lastName: string;
  profileStatus: ProfileStatus;
  clientStatus: ClientStatus;
  profileCompleteness: number;
  lastUpdated: Date;
}

/** Filter options for client list */
export interface ClientFilters {
  status?: ClientStatus[];
  profileStatus?: ProfileStatus[];
  searchQuery?: string;
  tags?: string[];
}

/** Sort options for client list */
export type ClientSortField = 'name' | 'lastUpdated' | 'profileCompleteness' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface ClientSortOptions {
  field: ClientSortField;
  direction: SortDirection;
}
