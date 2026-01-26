/**
 * User identity and role types
 */

/** User roles in the application */
export type UserRole = 'consumer' | 'advisor';

/** Core user identity */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/** User preferences for UI and behavior */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  showTutorials: boolean;
}
