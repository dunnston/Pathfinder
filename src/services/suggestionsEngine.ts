/**
 * Suggestions Engine
 * Generates suggestions based on user answers and templates
 */

import type {
  SuggestionDomain,
  QuestionAnswer,
  Suggestion,
  SuggestionTemplate,
  SuggestionTrigger,
} from '@/types/suggestions';
import type { PartialFinancialProfile } from '@/types/profile';
import { getTemplatesByDomain } from '@/data/suggestions/suggestionTemplates';
import { evaluateAllConditions } from './suggestionsFilter';

// ============================================================
// TRIGGER EVALUATION
// ============================================================

/**
 * Evaluate a single trigger condition against answers
 */
function evaluateTrigger(trigger: SuggestionTrigger, answers: QuestionAnswer[]): boolean {
  const answer = answers.find((a) => a.questionId === trigger.questionId);

  if (!answer) return false;

  const answerValue = answer.value;

  switch (trigger.operator) {
    case 'equals':
      return answerValue === trigger.value;

    case 'not_equals':
      return answerValue !== trigger.value;

    case 'contains':
      if (Array.isArray(answerValue)) {
        return answerValue.includes(String(trigger.value));
      }
      if (typeof answerValue === 'string') {
        return answerValue.includes(String(trigger.value));
      }
      return false;

    case 'greater_than':
      if (typeof answerValue === 'number' && typeof trigger.value === 'number') {
        return answerValue > trigger.value;
      }
      return false;

    case 'less_than':
      if (typeof answerValue === 'number' && typeof trigger.value === 'number') {
        return answerValue < trigger.value;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Check if all trigger conditions are met
 */
function checkAllTriggers(triggers: SuggestionTrigger[], answers: QuestionAnswer[]): boolean {
  if (triggers.length === 0) return false; // No triggers = never generate

  return triggers.every((trigger) => evaluateTrigger(trigger, answers));
}

// ============================================================
// SUGGESTION GENERATION
// ============================================================

/**
 * Generate a suggestion from a template
 */
function generateSuggestionFromTemplate(
  template: SuggestionTemplate,
  answers: QuestionAnswer[]
): Omit<Suggestion, 'id' | 'generatedAt'> {
  // For now, use templates directly
  // In the future, we could add placeholder replacement based on answers/profile

  return {
    domain: template.domain,
    title: template.titleTemplate,
    description: template.descriptionTemplate,
    rationale: template.rationaleTemplate,
    priority: template.priority,
    actionType: template.actionType,
    sourceAnswerIds: answers
      .filter((a) => template.triggerConditions.some((t) => t.questionId === a.questionId))
      .map((a) => a.questionId),
    status: 'pending',
  };
}

/**
 * Generate suggestions for a domain based on answers
 */
export function generateSuggestionsForDomain(
  domain: SuggestionDomain,
  answers: QuestionAnswer[],
  profile?: PartialFinancialProfile | null
): Omit<Suggestion, 'id' | 'generatedAt'>[] {
  const templates = getTemplatesByDomain(domain);
  const suggestions: Omit<Suggestion, 'id' | 'generatedAt'>[] = [];

  for (const template of templates) {
    // Check if all trigger conditions are met
    const triggersMatch = checkAllTriggers(template.triggerConditions, answers);

    if (!triggersMatch) continue;

    // Check profile conditions if any
    if (template.profileConditions && template.profileConditions.length > 0) {
      const profileMatch = evaluateAllConditions(template.profileConditions, profile ?? null);
      if (!profileMatch) continue;
    }

    // Generate the suggestion
    const suggestion = generateSuggestionFromTemplate(template, answers);
    suggestions.push(suggestion);
  }

  // Sort by priority (HIGH first, then MEDIUM, then LOW)
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}

/**
 * Generate suggestions for all domains based on all answers
 */
export function generateAllSuggestions(
  domainAnswers: Record<SuggestionDomain, QuestionAnswer[]>,
  profile?: PartialFinancialProfile | null
): Record<SuggestionDomain, Omit<Suggestion, 'id' | 'generatedAt'>[]> {
  const result = {} as Record<SuggestionDomain, Omit<Suggestion, 'id' | 'generatedAt'>[]>;

  for (const [domain, answers] of Object.entries(domainAnswers)) {
    result[domain as SuggestionDomain] = generateSuggestionsForDomain(
      domain as SuggestionDomain,
      answers,
      profile
    );
  }

  return result;
}

// ============================================================
// SUGGESTION ANALYSIS
// ============================================================

/**
 * Get summary of suggestions by priority
 */
export function getSuggestionsSummary(suggestions: Suggestion[]): {
  total: number;
  byPriority: { HIGH: number; MEDIUM: number; LOW: number };
  byActionType: Record<string, number>;
  pending: number;
  accepted: number;
  rejected: number;
} {
  const byPriority = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const byActionType: Record<string, number> = {};
  let pending = 0;
  let accepted = 0;
  let rejected = 0;

  for (const suggestion of suggestions) {
    byPriority[suggestion.priority]++;
    byActionType[suggestion.actionType] = (byActionType[suggestion.actionType] || 0) + 1;

    if (suggestion.status === 'pending') pending++;
    else if (suggestion.status === 'accepted' || suggestion.status === 'modified') accepted++;
    else if (suggestion.status === 'rejected') rejected++;
  }

  return {
    total: suggestions.length,
    byPriority,
    byActionType,
    pending,
    accepted,
    rejected,
  };
}

/**
 * Get suggestions that need attention (pending high priority)
 */
export function getHighPrioritySuggestions(suggestions: Suggestion[]): Suggestion[] {
  return suggestions.filter(
    (s) => s.priority === 'HIGH' && s.status === 'pending'
  );
}
