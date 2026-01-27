/**
 * Purpose Template Engine
 * Generates SoFP drafts from user inputs without AI
 */

import type { PurposeDriver, TradeoffAnchor, SoFPDraft } from '@/types/financialPurpose';
import {
  getDriverPhrase,
  getTradeoffPhrases,
  SOFP_TEMPLATES,
} from '@/data/purposeTemplates';

interface GenerateDraftsInput {
  primaryDriver?: PurposeDriver;
  secondaryDriver?: PurposeDriver;
  tradeoffAnchors: TradeoffAnchor[];
  visionAnchors: string[];
}

/**
 * Generate SoFP drafts based on user inputs
 */
export function generateDrafts(input: GenerateDraftsInput): SoFPDraft[] {
  const { primaryDriver, secondaryDriver, tradeoffAnchors, visionAnchors } = input;

  if (!primaryDriver || visionAnchors.length === 0) {
    return [];
  }

  const drafts: SoFPDraft[] = [];
  const now = new Date().toISOString();

  // Get phrases for substitution
  const primaryDriverPhrase = getDriverPhrase(primaryDriver);
  const secondaryDriverPhrase = secondaryDriver
    ? getDriverPhrase(secondaryDriver)
    : primaryDriverPhrase;
  const visionAnchor = visionAnchors[0].toLowerCase();

  // Get strongest tradeoff for template C
  const strongestTradeoff = tradeoffAnchors.length > 0
    ? tradeoffAnchors.reduce((prev, curr) =>
        curr.strength > prev.strength ? curr : prev
      )
    : null;

  // Generate drafts from templates
  SOFP_TEMPLATES.forEach((template) => {
    let text = template.template;

    // Substitute placeholders
    text = text.replace('{primaryDriverPhrase}', primaryDriverPhrase);
    text = text.replace('{secondaryDriverPhrase}', secondaryDriverPhrase);
    text = text.replace('{visionAnchor}', visionAnchor);

    // Handle tradeoff template specifically
    if (template.id === 'template_tradeoff' && strongestTradeoff) {
      const { leanPhrase, oppositePhrase } = getTradeoffPhrases(
        strongestTradeoff.axis,
        strongestTradeoff.lean
      );
      text = text.replace('{tradeoffLean}', leanPhrase);
      text = text.replace('{tradeoffOpposite}', oppositePhrase);
    } else if (template.id === 'template_tradeoff') {
      // Skip tradeoff template if no anchors
      return;
    }

    // Clean up any remaining placeholders
    if (text.includes('{')) {
      return; // Skip incomplete templates
    }

    drafts.push({
      id: `draft_${template.id}_${Date.now()}`,
      templateId: template.id,
      text: capitalizeFirstLetter(text),
      createdAt: now,
    });
  });

  return drafts;
}

/**
 * Render a single template with provided values
 */
export function renderTemplate(
  templateId: string,
  values: {
    primaryDriverPhrase: string;
    secondaryDriverPhrase: string;
    visionAnchor: string;
    tradeoffLean?: string;
    tradeoffOpposite?: string;
  }
): string {
  const template = SOFP_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return '';

  let text = template.template;
  text = text.replace('{primaryDriverPhrase}', values.primaryDriverPhrase);
  text = text.replace('{secondaryDriverPhrase}', values.secondaryDriverPhrase);
  text = text.replace('{visionAnchor}', values.visionAnchor);

  if (values.tradeoffLean) {
    text = text.replace('{tradeoffLean}', values.tradeoffLean);
  }
  if (values.tradeoffOpposite) {
    text = text.replace('{tradeoffOpposite}', values.tradeoffOpposite);
  }

  return capitalizeFirstLetter(text);
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get display name for a template
 */
export function getTemplateName(templateId: string): string {
  const template = SOFP_TEMPLATES.find((t) => t.id === templateId);
  return template?.name ?? 'Custom';
}

/**
 * Validate a purpose statement
 */
export function validatePurposeStatement(text: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check minimum length
  if (text.length < 20) {
    errors.push('Statement is too short. Aim for at least 20 characters.');
  }

  // Check maximum length
  if (text.length > 250) {
    warnings.push('Statement is quite long. Consider keeping it under 250 characters for clarity.');
  }

  // Check if it ends with proper punctuation
  if (!/[.!?]$/.test(text.trim())) {
    warnings.push('Consider ending with proper punctuation.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Count how many of the user's top values are represented in the statement
 */
export function checkValuesRepresentation(
  statement: string,
  topValues: string[]
): {
  representedValues: string[];
  missingValues: string[];
  coverage: number;
} {
  const lowerStatement = statement.toLowerCase();
  const representedValues: string[] = [];
  const missingValues: string[] = [];

  topValues.forEach((value) => {
    // Check if value or related keywords are in the statement
    const valueWords = value.toLowerCase().split(/\s+/);
    const isRepresented = valueWords.some((word) =>
      word.length > 3 && lowerStatement.includes(word)
    );

    if (isRepresented) {
      representedValues.push(value);
    } else {
      missingValues.push(value);
    }
  });

  return {
    representedValues,
    missingValues,
    coverage: topValues.length > 0
      ? representedValues.length / topValues.length
      : 0,
  };
}
