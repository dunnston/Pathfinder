/**
 * Section 1: Basic Context types
 * Captures personal and employment information
 */

import type { EmploymentStatus } from './common';

/** Marital status options */
export type MaritalStatus =
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed'
  | 'domestic_partnership';

/** Spouse/partner information */
export interface SpouseInfo {
  firstName: string;
  birthDate: Date;
  employmentStatus: EmploymentStatus;
  hasPension: boolean;
  pensionDetails?: string;
}

/** Federal retirement system classification */
export type RetirementSystem = 'FERS' | 'CSRS' | 'FERS_RAE' | 'FERS_FRAE';

/** Federal employee specific information */
export interface FederalEmployeeInfo {
  agency: string;
  yearsOfService: number;
  retirementSystem: RetirementSystem;
  payGrade: string;
  step: number;
  isLawEnforcement: boolean;
  hasMilitaryService: boolean;
  militaryServiceYears?: number;
}

/** Dependent information */
export interface Dependent {
  relationship: string;
  birthDate: Date;
  financiallyDependent: boolean;
}

/** Complete basic context section */
export interface BasicContext {
  firstName: string;
  lastName: string;
  birthDate: Date;
  maritalStatus: MaritalStatus;
  spouse?: SpouseInfo;
  dependents: Dependent[];
  occupation: string;
  federalEmployee: FederalEmployeeInfo | null;
  hobbiesInterests?: string[];
  communityInvolvement?: string;
}
