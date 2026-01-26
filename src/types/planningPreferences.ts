/**
 * Section 3: Planning Preferences types
 * Captures decision-making style and complexity tolerance
 */

import type { EducationPreference } from './common';

/** Tolerance level scale (1-5) */
export type ToleranceLevel = 1 | 2 | 3 | 4 | 5;

/** Comfort level with financial products */
export type ComfortLevel =
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high';

/** Desired level of advisor involvement */
export type InvolvementLevel =
  | 'diy' // Want to do it myself
  | 'guidance' // Want guidance on major decisions
  | 'collaborative' // Want to work together closely
  | 'delegated'; // Want advisor to handle most things

/** Decision-making style */
export type DecisionStyle =
  | 'analytical' // Wants all the data
  | 'intuitive' // Goes with gut feeling
  | 'consultative' // Seeks others' opinions
  | 'deliberate'; // Takes time, considers carefully

/** Core values that can be ranked */
export type ValueType =
  | 'family_security'
  | 'health_peace_of_mind'
  | 'freedom_of_time'
  | 'enjoyment_experiences'
  | 'legacy_giving'
  | 'financial_independence'
  | 'helping_others'
  | 'personal_growth';

/** A value with its ranking */
export interface ValueRanking {
  value: ValueType;
  rank: number;
}

/** Preference position on a tradeoff spectrum */
export type TradeoffPosition =
  | 'strongly_a'
  | 'lean_a'
  | 'neutral'
  | 'lean_b'
  | 'strongly_b';

/** A tradeoff choice between two options */
export interface TradeoffPreference {
  tradeoff: string;
  preference: TradeoffPosition;
  optionA: string;
  optionB: string;
}

/** Complete planning preferences section */
export interface PlanningPreferences {
  complexityTolerance: ToleranceLevel;
  financialProductComfort: ComfortLevel;
  advisorInvolvementDesire: InvolvementLevel;
  decisionMakingStyle: DecisionStyle;
  educationPreference: EducationPreference;
  valuesPriorities: ValueRanking[];
  tradeoffPreferences: TradeoffPreference[];
}
