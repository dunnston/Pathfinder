/**
 * Core Financial Profile types
 * The central data structure for the application
 */

import type { BasicContext } from './basicContext';
import type { RetirementVision } from './retirementVision';
import type { PlanningPreferences } from './planningPreferences';
import type { RiskComfort } from './riskComfort';
import type { FinancialSnapshot } from './financialSnapshot';
import type { SystemClassifications } from './systemClassifications';
import type { ValuesDiscovery } from './valuesDiscovery';
import type { FinancialGoals } from './financialGoals';
import type { FinancialPurpose } from './financialPurpose';

/** Profile completion status */
export type ProfileStatus =
  | 'not_started'
  | 'in_progress'
  | 'complete'
  | 'needs_review';

/** The central profile structure */
export interface FinancialProfile {
  id: string;
  userId: string;
  status: ProfileStatus;
  basicContext: BasicContext;
  retirementVision: RetirementVision;
  valuesDiscovery: ValuesDiscovery;
  financialGoals: FinancialGoals;
  financialPurpose: FinancialPurpose;
  planningPreferences: PlanningPreferences;
  riskComfort: RiskComfort;
  financialSnapshot: FinancialSnapshot;
  systemClassifications: SystemClassifications;
  advisorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Partial profile for in-progress profiles */
export interface PartialFinancialProfile {
  id: string;
  userId: string;
  status: ProfileStatus;
  basicContext?: Partial<BasicContext>;
  retirementVision?: Partial<RetirementVision>;
  valuesDiscovery?: Partial<ValuesDiscovery>;
  financialGoals?: Partial<FinancialGoals>;
  financialPurpose?: Partial<FinancialPurpose>;
  planningPreferences?: Partial<PlanningPreferences>;
  riskComfort?: Partial<RiskComfort>;
  financialSnapshot?: Partial<FinancialSnapshot>;
  systemClassifications?: Partial<SystemClassifications>;
  advisorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Section names for the discovery wizard */
export type ProfileSection =
  | 'basicContext'
  | 'retirementVision'
  | 'valuesDiscovery'
  | 'financialGoals'
  | 'financialPurpose'
  | 'planningPreferences'
  | 'riskComfort'
  | 'financialSnapshot';

/** Map of section completion status */
export type SectionCompletionMap = Record<ProfileSection, boolean>;
