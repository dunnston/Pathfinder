/**
 * Statement of Financial Purpose types
 * Template-driven purpose statement builder
 */

/** Purpose driver (what money does for you) */
export type PurposeDriver =
  | 'PROTECT_FAMILY'
  | 'FREEDOM_OPTIONS'
  | 'STABILITY_PEACE'
  | 'HEALTH_QUALITY'
  | 'IMPACT_GIVING'
  | 'MEANING_PURPOSE'
  | 'CONTROL_CONFIDENCE'
  | 'GROWTH_OPPORTUNITY';

/** Tradeoff axis for decision filtering */
export type TradeoffAxis =
  | 'SECURITY_VS_GROWTH'
  | 'FREEDOM_SOONER_VS_CERTAINTY_LATER'
  | 'LIFESTYLE_NOW_VS_BUFFER_FIRST'
  | 'CONTROL_STRUCTURE_VS_FLEXIBILITY';

/** Module completion state */
export type FinancialPurposeState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/** A tradeoff anchor for decision filtering */
export interface TradeoffAnchor {
  axis: TradeoffAxis;
  lean: 'A' | 'B' | 'NEUTRAL';
  strength: 1 | 2 | 3 | 4 | 5;
}

/** A draft statement of financial purpose */
export interface SoFPDraft {
  id: string;
  templateId: string;
  text: string;
  createdAt: string;
  editedByUser?: boolean;
}

/** Complete financial purpose section */
export interface FinancialPurpose {
  state: FinancialPurposeState;

  // Step 2: Primary drivers (what money does for you)
  primaryDriver?: PurposeDriver;
  secondaryDriver?: PurposeDriver;
  step2CompletedAt?: string;

  // Step 3: Tradeoff anchors (decision filter preferences)
  tradeoffAnchors: TradeoffAnchor[];
  step3CompletedAt?: string;

  // Step 4: Vision anchors (vivid life phrases)
  visionAnchors: string[];
  step4CompletedAt?: string;

  // Step 5: Draft assembly (template-generated drafts)
  drafts: SoFPDraft[];
  selectedDraftId?: string;
  step5CompletedAt?: string;

  // Step 6: Refinement (final edited statement)
  finalText?: string;
  step6CompletedAt?: string;

  // Optional diagnostics
  missingValues?: string[];
  notes?: string;

  completedAt?: string;
}
