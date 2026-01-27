/**
 * Values Discovery types
 * Card-based exercise to identify top 5 core values and non-negotiables
 */

/** Value category (internal, not shown to users) */
export type ValueCategory =
  | 'SECURITY'
  | 'FREEDOM'
  | 'FAMILY'
  | 'GROWTH'
  | 'CONTRIBUTION'
  | 'PURPOSE'
  | 'CONTROL'
  | 'HEALTH'
  | 'QUALITY_OF_LIFE';

/** Card sorting pile assignment */
export type Pile = 'IMPORTANT' | 'UNSURE' | 'NOT_IMPORTANT';

/** Module completion state */
export type ValuesDiscoveryState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/** Tradeoff question choice */
export type TradeoffChoice = 'A' | 'B' | 'NEUTRAL';

/** Tradeoff strength (1 = strong A, 3 = neutral, 5 = strong B) */
export type TradeoffStrength = 1 | 2 | 3 | 4 | 5;

/** A value card used in the sorting exercise */
export interface ValueCard {
  id: string;
  title: string;
  description: string;
  category: ValueCategory;
  scenarioPrompt: string;
  tradeoffTag?: string[];
  isCustom: boolean;
  createdByUserId?: string;
}

/** Response to a tradeoff question */
export interface TradeoffResponse {
  id: string;
  categoryA: ValueCategory;
  categoryB: ValueCategory;
  choice: TradeoffChoice;
  strength: TradeoffStrength;
  createdAt: string;
}

/** Resolution of an unsure card */
export interface UnsureResolution {
  cardId: string;
  from: 'UNSURE';
  to: 'IMPORTANT' | 'NOT_IMPORTANT' | 'UNSURE';
  answeredAt: string;
}

/** Category count for a phase */
export type CategoryCount = Record<ValueCategory, number>;

/** Derived insights from the values discovery */
export interface ValuesDiscoveryDerived {
  categoryCounts: {
    step1Important: CategoryCount;
    top10: CategoryCount;
    top5: CategoryCount;
    nonNegotiables: CategoryCount;
  };
  dominantCategory?: ValueCategory;
  secondaryCategory?: ValueCategory;
  drivingForce?: ValueCategory;
  conflictFlags?: string[];
  controlVsFreedomIndex?: number;
  securityVsGrowthIndex?: number;
}

/** Complete values discovery section */
export interface ValuesDiscovery {
  state: ValuesDiscoveryState;

  // Step 1: Broad selection results
  piles: Record<string, Pile>;
  step1CompletedAt?: string;

  // Step 2: Unsure resolution results
  unsureResolutions: UnsureResolution[];
  step2CompletedAt?: string;

  // Steps 3-4: Narrowing results
  top10: string[];
  top5: string[];
  step4CompletedAt?: string;

  // Step 5: Tradeoff validation results
  tradeoffResponses: TradeoffResponse[];
  step5CompletedAt?: string;

  // Step 6: Non-negotiables results
  nonNegotiables: string[];
  step6CompletedAt?: string;

  // Derived insights (computed on completion)
  derived?: ValuesDiscoveryDerived;

  completedAt?: string;
}
