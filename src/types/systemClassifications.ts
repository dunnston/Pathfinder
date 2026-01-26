/**
 * System-Generated Classifications types
 * Automatically calculated from profile data
 */

/** Planning stages based on retirement timeline */
export type PlanningStage =
  | 'early_career' // 10+ years from retirement
  | 'mid_career' // 5-10 years from retirement
  | 'pre_retirement' // 3-5 years from retirement
  | 'final_year' // Within 1 year of retirement
  | 'post_retirement'; // Already retired

/** Urgency level for decision windows */
export type DecisionUrgency = 'immediate' | 'upcoming' | 'future';

/** A time-sensitive decision window */
export interface DecisionWindow {
  decision: string;
  timeframe: string;
  urgency: DecisionUrgency;
  relatedStrategies: string[];
}

/** Strategy weights for recommendation engine (0-100 scale) */
export interface StrategyWeights {
  securityFocus: number;
  growthOrientation: number;
  complexityTolerance: number;
  flexibility: number;
  advisorDependence: number;
}

/** Complete system classifications */
export interface SystemClassifications {
  planningStage: PlanningStage;
  upcomingDecisionWindows: DecisionWindow[];
  strategyWeights: StrategyWeights;
  profileCompleteness: number; // 0-100
  lastUpdated: Date;
}
