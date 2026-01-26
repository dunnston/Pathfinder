/**
 * Common shared types used across the application
 */

/** Employment status for spouse or self */
export type EmploymentStatus =
  | 'employed_full_time'
  | 'employed_part_time'
  | 'self_employed'
  | 'unemployed'
  | 'retired'
  | 'homemaker'
  | 'disabled';

/** Generic education preference level */
export type EducationPreference =
  | 'minimal' // Just tell me what to do
  | 'summary' // Give me the highlights
  | 'detailed' // Explain the reasoning
  | 'comprehensive'; // I want to understand everything
