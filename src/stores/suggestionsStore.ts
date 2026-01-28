/**
 * Suggestions Store
 * Manages suggestions engine state: domain exploration, answers, suggestions, and plan items
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SuggestionsState,
  SuggestionDomain,
  DomainExplorationState,
  DomainExplorationStatus,
  QuestionAnswer,
  Suggestion,
  SuggestionStatus,
  CustomRecommendation,
  PlanItem,
  PlanItemStatus,
} from '@/types/suggestions';
import {
  SUGGESTION_DOMAINS,
  createDefaultSuggestionsState,
  createDefaultDomainState,
} from '@/types/suggestions';
import { createEncryptedStorage } from '@/services/encryption';
import { sanitizeObject } from '@/services/sanitization';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Generate a cryptographically secure unique ID */
function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/** Get current ISO timestamp */
function now(): string {
  return new Date().toISOString();
}

// ============================================================
// STORE INTERFACE
// ============================================================

interface SuggestionsActions {
  // Domain exploration actions
  /** Start exploring a domain */
  startDomain: (domain: SuggestionDomain) => void;
  /** Mark a domain as complete */
  completeDomain: (domain: SuggestionDomain) => void;
  /** Reset a domain to not started */
  resetDomain: (domain: SuggestionDomain) => void;
  /** Update current question index for a domain */
  setCurrentQuestionIndex: (domain: SuggestionDomain, index: number) => void;
  /** Get domain exploration state */
  getDomainState: (domain: SuggestionDomain) => DomainExplorationState;

  // Answer actions
  /** Save an answer for a question */
  saveAnswer: (answer: Omit<QuestionAnswer, 'answeredAt'>) => void;
  /** Update an existing answer */
  updateAnswer: (questionId: string, updates: Partial<QuestionAnswer>) => void;
  /** Get answer for a specific question */
  getAnswer: (questionId: string) => QuestionAnswer | undefined;
  /** Get all answers for a domain */
  getDomainAnswers: (domain: SuggestionDomain) => QuestionAnswer[];
  /** Clear all answers for a domain */
  clearDomainAnswers: (domain: SuggestionDomain) => void;

  // Suggestion actions
  /** Add suggestions for a domain (replaces existing) */
  setSuggestions: (domain: SuggestionDomain, suggestions: Omit<Suggestion, 'id' | 'generatedAt'>[]) => void;
  /** Update suggestion status */
  updateSuggestionStatus: (
    suggestionId: string,
    status: SuggestionStatus,
    options?: { modifiedTitle?: string; modifiedDescription?: string; userNotes?: string }
  ) => void;
  /** Accept a suggestion */
  acceptSuggestion: (suggestionId: string, notes?: string) => void;
  /** Reject a suggestion */
  rejectSuggestion: (suggestionId: string) => void;
  /** Modify and accept a suggestion */
  modifySuggestion: (suggestionId: string, modifiedTitle: string, modifiedDescription: string) => void;
  /** Get suggestion by ID */
  getSuggestion: (suggestionId: string) => Suggestion | undefined;
  /** Get all suggestions for a domain */
  getDomainSuggestions: (domain: SuggestionDomain) => Suggestion[];
  /** Get all accepted suggestions */
  getAcceptedSuggestions: () => Suggestion[];

  // Custom recommendation actions
  /** Add a custom recommendation */
  addCustomRecommendation: (
    recommendation: Omit<CustomRecommendation, 'id' | 'createdAt'>
  ) => string;
  /** Update a custom recommendation */
  updateCustomRecommendation: (
    recommendationId: string,
    updates: Partial<Omit<CustomRecommendation, 'id' | 'createdAt'>>
  ) => void;
  /** Remove a custom recommendation */
  removeCustomRecommendation: (recommendationId: string) => void;
  /** Get all custom recommendations */
  getCustomRecommendations: () => CustomRecommendation[];
  /** Get custom recommendations for a domain */
  getDomainCustomRecommendations: (domain: SuggestionDomain) => CustomRecommendation[];

  // Plan item actions
  /** Add suggestion to plan */
  addSuggestionToPlan: (suggestionId: string) => string;
  /** Add custom recommendation to plan */
  addCustomToPlan: (customId: string) => string;
  /** Update plan item status */
  updatePlanItemStatus: (planItemId: string, status: PlanItemStatus, notes?: string) => void;
  /** Update plan item */
  updatePlanItem: (planItemId: string, updates: Partial<Omit<PlanItem, 'id' | 'addedAt'>>) => void;
  /** Remove plan item */
  removePlanItem: (planItemId: string) => void;
  /** Reorder plan items */
  reorderPlanItems: (itemIds: string[]) => void;
  /** Get all plan items */
  getPlanItems: () => PlanItem[];
  /** Get plan items by status */
  getPlanItemsByStatus: (status: PlanItemStatus) => PlanItem[];
  /** Get plan items by domain */
  getPlanItemsByDomain: (domain: SuggestionDomain) => PlanItem[];

  // Utility actions
  /** Clear all suggestions data */
  clearSuggestions: () => void;
  /** Check if store has hydrated */
  hasHydrated: () => boolean;
}

type SuggestionsStore = SuggestionsState & SuggestionsActions & {
  _hasHydrated: boolean;
};

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: SuggestionsState & { _hasHydrated: boolean } = {
  ...createDefaultSuggestionsState(),
  _hasHydrated: false,
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useSuggestionsStore = create<SuggestionsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --------------------------------------------------------
      // Domain Exploration Actions
      // --------------------------------------------------------

      startDomain: (domain) =>
        set((state) => {
          const domainState = state.domainStates[domain];
          if (domainState.status !== 'not_started') return state;

          return {
            domainStates: {
              ...state.domainStates,
              [domain]: {
                ...domainState,
                status: 'in_progress' as DomainExplorationStatus,
                startedAt: now(),
              },
            },
            updatedAt: now(),
          };
        }),

      completeDomain: (domain) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [domain]: {
              ...state.domainStates[domain],
              status: 'completed' as DomainExplorationStatus,
              completedAt: now(),
            },
          },
          updatedAt: now(),
        })),

      resetDomain: (domain) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [domain]: createDefaultDomainState(domain),
          },
          updatedAt: now(),
        })),

      setCurrentQuestionIndex: (domain, index) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [domain]: {
              ...state.domainStates[domain],
              currentQuestionIndex: index,
            },
          },
          updatedAt: now(),
        })),

      getDomainState: (domain) => {
        return get().domainStates[domain];
      },

      // --------------------------------------------------------
      // Answer Actions
      // --------------------------------------------------------

      saveAnswer: (answerData) =>
        set((state) => {
          const sanitized = sanitizeObject(answerData);
          const answer: QuestionAnswer = {
            ...sanitized,
            answeredAt: now(),
          };

          const domain = answer.domain;
          const domainState = state.domainStates[domain];

          // Replace existing answer for same question or add new
          const existingIndex = domainState.answers.findIndex(
            (a) => a.questionId === answer.questionId
          );

          let updatedAnswers: QuestionAnswer[];
          if (existingIndex >= 0) {
            updatedAnswers = [...domainState.answers];
            updatedAnswers[existingIndex] = answer;
          } else {
            updatedAnswers = [...domainState.answers, answer];
          }

          return {
            domainStates: {
              ...state.domainStates,
              [domain]: {
                ...domainState,
                answers: updatedAnswers,
                status: domainState.status === 'not_started' ? 'in_progress' : domainState.status,
                startedAt: domainState.startedAt || now(),
              },
            },
            updatedAt: now(),
          };
        }),

      updateAnswer: (questionId, updates) =>
        set((state) => {
          // Find which domain has this answer
          for (const domain of SUGGESTION_DOMAINS) {
            const domainState = state.domainStates[domain];
            const answerIndex = domainState.answers.findIndex(
              (a) => a.questionId === questionId
            );

            if (answerIndex >= 0) {
              const sanitized = sanitizeObject(updates);
              const updatedAnswers = [...domainState.answers];
              updatedAnswers[answerIndex] = {
                ...updatedAnswers[answerIndex],
                ...sanitized,
                answeredAt: now(),
              };

              return {
                domainStates: {
                  ...state.domainStates,
                  [domain]: {
                    ...domainState,
                    answers: updatedAnswers,
                  },
                },
                updatedAt: now(),
              };
            }
          }

          return state;
        }),

      getAnswer: (questionId) => {
        const state = get();
        for (const domain of SUGGESTION_DOMAINS) {
          const answer = state.domainStates[domain].answers.find(
            (a) => a.questionId === questionId
          );
          if (answer) return answer;
        }
        return undefined;
      },

      getDomainAnswers: (domain) => {
        return get().domainStates[domain].answers;
      },

      clearDomainAnswers: (domain) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [domain]: {
              ...state.domainStates[domain],
              answers: [],
              currentQuestionIndex: 0,
            },
          },
          updatedAt: now(),
        })),

      // --------------------------------------------------------
      // Suggestion Actions
      // --------------------------------------------------------

      setSuggestions: (domain, suggestionsData) =>
        set((state) => {
          const suggestions: Suggestion[] = suggestionsData.map((s) => ({
            ...sanitizeObject(s),
            id: generateId('sugg'),
            generatedAt: now(),
          }));

          return {
            domainStates: {
              ...state.domainStates,
              [domain]: {
                ...state.domainStates[domain],
                suggestions,
              },
            },
            updatedAt: now(),
          };
        }),

      updateSuggestionStatus: (suggestionId, status, options) =>
        set((state) => {
          for (const domain of SUGGESTION_DOMAINS) {
            const domainState = state.domainStates[domain];
            const suggestionIndex = domainState.suggestions.findIndex(
              (s) => s.id === suggestionId
            );

            if (suggestionIndex >= 0) {
              const updatedSuggestions = [...domainState.suggestions];
              updatedSuggestions[suggestionIndex] = {
                ...updatedSuggestions[suggestionIndex],
                status,
                statusChangedAt: now(),
                ...(options?.modifiedTitle && { modifiedTitle: options.modifiedTitle }),
                ...(options?.modifiedDescription && { modifiedDescription: options.modifiedDescription }),
                ...(options?.userNotes && { userNotes: options.userNotes }),
              };

              return {
                domainStates: {
                  ...state.domainStates,
                  [domain]: {
                    ...domainState,
                    suggestions: updatedSuggestions,
                  },
                },
                updatedAt: now(),
              };
            }
          }

          return state;
        }),

      acceptSuggestion: (suggestionId, notes) => {
        get().updateSuggestionStatus(suggestionId, 'accepted', { userNotes: notes });
      },

      rejectSuggestion: (suggestionId) => {
        get().updateSuggestionStatus(suggestionId, 'rejected');
      },

      modifySuggestion: (suggestionId, modifiedTitle, modifiedDescription) => {
        get().updateSuggestionStatus(suggestionId, 'modified', {
          modifiedTitle,
          modifiedDescription,
        });
      },

      getSuggestion: (suggestionId) => {
        const state = get();
        for (const domain of SUGGESTION_DOMAINS) {
          const suggestion = state.domainStates[domain].suggestions.find(
            (s) => s.id === suggestionId
          );
          if (suggestion) return suggestion;
        }
        return undefined;
      },

      getDomainSuggestions: (domain) => {
        return get().domainStates[domain].suggestions;
      },

      getAcceptedSuggestions: () => {
        const state = get();
        const accepted: Suggestion[] = [];
        for (const domain of SUGGESTION_DOMAINS) {
          const domainAccepted = state.domainStates[domain].suggestions.filter(
            (s) => s.status === 'accepted' || s.status === 'modified'
          );
          accepted.push(...domainAccepted);
        }
        return accepted;
      },

      // --------------------------------------------------------
      // Custom Recommendation Actions
      // --------------------------------------------------------

      addCustomRecommendation: (recommendationData) => {
        const id = generateId('custom');
        const sanitized = sanitizeObject(recommendationData);

        set((state) => ({
          customRecommendations: [
            ...state.customRecommendations,
            {
              ...sanitized,
              id,
              createdAt: now(),
            } as CustomRecommendation,
          ],
          updatedAt: now(),
        }));

        return id;
      },

      updateCustomRecommendation: (recommendationId, updates) =>
        set((state) => {
          const index = state.customRecommendations.findIndex(
            (r) => r.id === recommendationId
          );
          if (index === -1) return state;

          const sanitized = sanitizeObject(updates);
          const updatedRecommendations = [...state.customRecommendations];
          updatedRecommendations[index] = {
            ...updatedRecommendations[index],
            ...sanitized,
            updatedAt: now(),
          };

          return {
            customRecommendations: updatedRecommendations,
            updatedAt: now(),
          };
        }),

      removeCustomRecommendation: (recommendationId) =>
        set((state) => ({
          customRecommendations: state.customRecommendations.filter(
            (r) => r.id !== recommendationId
          ),
          // Also remove from plan if present
          planItems: state.planItems.filter(
            (p) => !(p.type === 'custom' && p.sourceId === recommendationId)
          ),
          updatedAt: now(),
        })),

      getCustomRecommendations: () => {
        return get().customRecommendations;
      },

      getDomainCustomRecommendations: (domain) => {
        return get().customRecommendations.filter((r) => r.domain === domain);
      },

      // --------------------------------------------------------
      // Plan Item Actions
      // --------------------------------------------------------

      addSuggestionToPlan: (suggestionId) => {
        const state = get();
        const suggestion = state.getSuggestion(suggestionId);
        if (!suggestion) return '';

        // Check if already in plan
        const existing = state.planItems.find(
          (p) => p.type === 'suggestion' && p.sourceId === suggestionId
        );
        if (existing) return existing.id;

        const id = generateId('plan');
        const planItem: PlanItem = {
          id,
          type: 'suggestion',
          sourceId: suggestionId,
          domain: suggestion.domain,
          title: suggestion.modifiedTitle || suggestion.title,
          description: suggestion.modifiedDescription || suggestion.description,
          priority: suggestion.priority,
          status: 'planned',
          addedAt: now(),
          order: state.planItems.length,
        };

        set((s) => ({
          planItems: [...s.planItems, planItem],
          updatedAt: now(),
        }));

        return id;
      },

      addCustomToPlan: (customId) => {
        const state = get();
        const custom = state.customRecommendations.find((r) => r.id === customId);
        if (!custom) return '';

        // Check if already in plan
        const existing = state.planItems.find(
          (p) => p.type === 'custom' && p.sourceId === customId
        );
        if (existing) return existing.id;

        const id = generateId('plan');
        const planItem: PlanItem = {
          id,
          type: 'custom',
          sourceId: customId,
          domain: custom.domain,
          title: custom.title,
          description: custom.description,
          priority: custom.priority,
          status: 'planned',
          addedAt: now(),
          order: state.planItems.length,
        };

        set((s) => ({
          planItems: [...s.planItems, planItem],
          updatedAt: now(),
        }));

        return id;
      },

      updatePlanItemStatus: (planItemId, status, notes) =>
        set((state) => {
          const index = state.planItems.findIndex((p) => p.id === planItemId);
          if (index === -1) return state;

          const updatedItems = [...state.planItems];
          const updates: Partial<PlanItem> = { status };

          if (status === 'in_progress' && !updatedItems[index].startedAt) {
            updates.startedAt = now();
          }
          if (status === 'completed') {
            updates.completedAt = now();
          }
          if (status === 'deferred') {
            updates.deferredAt = now();
          }
          if (notes !== undefined) {
            updates.notes = notes;
          }

          updatedItems[index] = { ...updatedItems[index], ...updates };

          return {
            planItems: updatedItems,
            updatedAt: now(),
          };
        }),

      updatePlanItem: (planItemId, updates) =>
        set((state) => {
          const index = state.planItems.findIndex((p) => p.id === planItemId);
          if (index === -1) return state;

          const sanitized = sanitizeObject(updates);
          const updatedItems = [...state.planItems];
          updatedItems[index] = { ...updatedItems[index], ...sanitized };

          return {
            planItems: updatedItems,
            updatedAt: now(),
          };
        }),

      removePlanItem: (planItemId) =>
        set((state) => ({
          planItems: state.planItems.filter((p) => p.id !== planItemId),
          updatedAt: now(),
        })),

      reorderPlanItems: (itemIds) =>
        set((state) => {
          const reordered = itemIds
            .map((id, index) => {
              const item = state.planItems.find((p) => p.id === id);
              return item ? { ...item, order: index } : null;
            })
            .filter((item): item is PlanItem => item !== null);

          // Add any items not in the order list at the end
          const orderedIds = new Set(itemIds);
          const remaining = state.planItems
            .filter((p) => !orderedIds.has(p.id))
            .map((p, i) => ({ ...p, order: reordered.length + i }));

          return {
            planItems: [...reordered, ...remaining],
            updatedAt: now(),
          };
        }),

      getPlanItems: () => {
        return get().planItems.sort((a, b) => a.order - b.order);
      },

      getPlanItemsByStatus: (status) => {
        return get().planItems.filter((p) => p.status === status).sort((a, b) => a.order - b.order);
      },

      getPlanItemsByDomain: (domain) => {
        return get().planItems.filter((p) => p.domain === domain).sort((a, b) => a.order - b.order);
      },

      // --------------------------------------------------------
      // Utility Actions
      // --------------------------------------------------------

      clearSuggestions: () => set({ ...createDefaultSuggestionsState(), _hasHydrated: true }),

      hasHydrated: () => get()._hasHydrated,
    }),
    {
      name: 'pathfinder-suggestions',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
      // SEC-1: Use encrypted storage for sensitive financial data
      storage: {
        getItem: async (name) => {
          const encryptedStorage = createEncryptedStorage();
          const str = await encryptedStorage.getItem(name);
          if (!str) return null;

          try {
            const data = JSON.parse(str);
            return data;
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          const encryptedStorage = createEncryptedStorage();
          await encryptedStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          const encryptedStorage = createEncryptedStorage();
          encryptedStorage.removeItem(name);
        },
      },
    }
  )
);
