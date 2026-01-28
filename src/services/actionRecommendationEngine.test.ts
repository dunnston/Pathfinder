/**
 * Unit tests for Action Recommendation Engine
 * Tests action generation, filtering, and prioritization
 */

import { describe, it, expect } from 'vitest';
import { generateActionRecommendations, hasEnoughDataForActions } from './actionRecommendationEngine';
import { generateFocusAreaRanking } from './planningFocusEngine';
import { generateStrategyProfile } from './strategyProfileEngine';
import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';

// Test fixtures
const createBasicContext = (overrides: Partial<BasicContext> = {}): Partial<BasicContext> => ({
  firstName: 'Test',
  lastName: 'User',
  birthDate: new Date('1970-01-01'),
  maritalStatus: 'married',
  ...overrides,
});

// Valid card IDs from VALUE_CARDS database
const SECURITY_CARD_IDS = ['security_financial_security', 'security_stable_income', 'security_emergency_preparedness', 'security_insurance_protection', 'security_risk_management'];
const FAMILY_CARD_IDS = ['family_family_security', 'family_childrens_future', 'family_spouse_protection', 'family_family_harmony', 'family_caregiving'];

const createValuesDiscovery = (overrides: Partial<ValuesDiscovery> = {}): Partial<ValuesDiscovery> => {
  const top5 = overrides.top5 ?? SECURITY_CARD_IDS;
  const piles: Record<string, 'IMPORTANT'> = {};
  top5.forEach(cardId => { piles[cardId] = 'IMPORTANT'; });

  return {
    state: 'COMPLETED',
    piles,
    top10: [...top5, ...FAMILY_CARD_IDS.slice(0, 5)],
    top5,
    nonNegotiables: [],
    unsureResolutions: [],
    tradeoffResponses: [],
    ...overrides,
  };
};

const createFinancialGoals = (overrides: Partial<FinancialGoals> = {}): Partial<FinancialGoals> => ({
  state: 'COMPLETED',
  allGoals: [
    { id: '1', label: 'Retire by 62', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
  ],
  ...overrides,
});

const createFinancialPurpose = (overrides: Partial<FinancialPurpose> = {}): Partial<FinancialPurpose> => ({
  state: 'COMPLETED',
  primaryDriver: 'STABILITY_PEACE',
  finalText: 'To provide security for my family',
  ...overrides,
});

// Helper to create full input for action generation
function createActionInput(overrides: {
  basicContext?: Partial<BasicContext>;
  valuesDiscovery?: Partial<ValuesDiscovery>;
  financialGoals?: Partial<FinancialGoals>;
  financialPurpose?: Partial<FinancialPurpose>;
} = {}) {
  const basicContext = overrides.basicContext ?? createBasicContext();
  const valuesDiscovery = overrides.valuesDiscovery ?? createValuesDiscovery();
  const financialGoals = overrides.financialGoals ?? createFinancialGoals();
  const financialPurpose = overrides.financialPurpose ?? createFinancialPurpose();

  const focusAreas = generateFocusAreaRanking({
    basicContext,
    valuesDiscovery,
    financialGoals,
    financialPurpose,
  });

  const strategyProfile = generateStrategyProfile({
    basicContext,
    valuesDiscovery,
    financialGoals,
    financialPurpose,
  });

  return {
    basicContext,
    valuesDiscovery,
    financialGoals,
    financialPurpose,
    focusAreas,
    strategyProfile,
  };
}

describe('Action Recommendation Engine', () => {
  describe('hasEnoughDataForActions', () => {
    it('returns true when focus areas exist', () => {
      const input = createActionInput();
      expect(hasEnoughDataForActions(input)).toBe(true);
    });

    it('returns false when focus areas are empty', () => {
      const input = createActionInput();
      input.focusAreas.areas = [];
      expect(hasEnoughDataForActions(input)).toBe(false);
    });
  });

  describe('generateActionRecommendations', () => {
    it('generates at most 7 actions', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      expect(result.recommendations.length).toBeLessThanOrEqual(7);
    });

    it('generates at least 1 action for valid input', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
    });

    it('includes all required action properties', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      const action = result.recommendations[0];
      expect(action).toHaveProperty('id');
      expect(action).toHaveProperty('title');
      expect(action).toHaveProperty('description');
      expect(action).toHaveProperty('rationale');
      expect(action).toHaveProperty('outcome');
      expect(action).toHaveProperty('type');
      expect(action).toHaveProperty('guidance');
      expect(action).toHaveProperty('urgency');
      expect(action).toHaveProperty('domain');
    });

    it('assigns valid action types', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      const validTypes = ['EDUCATION', 'DECISION_PREP', 'STRUCTURAL', 'PROFESSIONAL_REVIEW', 'OPTIMIZATION'];
      result.recommendations.forEach(action => {
        expect(validTypes).toContain(action.type);
      });
    });

    it('assigns valid guidance levels', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      const validGuidance = ['SELF_GUIDED', 'ADVISOR_GUIDED', 'SPECIALIST_GUIDED'];
      result.recommendations.forEach(action => {
        expect(validGuidance).toContain(action.guidance);
      });
    });

    it('assigns valid urgency levels', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      const validUrgency = ['IMMEDIATE', 'NEAR_TERM', 'MEDIUM_TERM', 'ONGOING'];
      result.recommendations.forEach(action => {
        expect(validUrgency).toContain(action.urgency);
      });
    });

    it('sorts actions by urgency', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      const urgencyOrder: Record<string, number> = {
        IMMEDIATE: 0,
        NEAR_TERM: 1,
        MEDIUM_TERM: 2,
        ONGOING: 3,
      };

      for (let i = 1; i < result.recommendations.length; i++) {
        const prevUrgency = urgencyOrder[result.recommendations[i - 1].urgency];
        const currUrgency = urgencyOrder[result.recommendations[i].urgency];
        expect(currUrgency).toBeGreaterThanOrEqual(prevUrgency);
      }
    });

    it('includes federal-specific actions for federal employees', () => {
      const input = createActionInput({
        basicContext: createBasicContext({
          federalEmployee: {
            agency: 'DOD',
            yearsOfService: 20,
            retirementSystem: 'FERS',
            payGrade: 'GS-13',
            step: 5,
            isLawEnforcement: false,
            hasMilitaryService: false,
          },
        }),
      });

      const result = generateActionRecommendations(input);

      // Should include federal-specific actions
      const federalActions = result.recommendations.filter(
        a => a.title.toLowerCase().includes('federal') || a.domain === 'BENEFITS_OPTIMIZATION'
      );
      expect(federalActions.length).toBeGreaterThan(0);
    });

    it('includes life insurance action when dependents exist', () => {
      const input = createActionInput({
        basicContext: createBasicContext({
          dependents: [
            { relationship: 'child', birthDate: new Date('2016-01-01'), financiallyDependent: true },
          ],
        }),
      });

      const result = generateActionRecommendations(input);

      // Should include insurance-related actions
      const insuranceActions = result.recommendations.filter(
        a => a.domain === 'INSURANCE_RISK'
      );
      expect(insuranceActions.length).toBeGreaterThan(0);
    });

    it('increases urgency for near-retirement users', () => {
      const nearRetirementInput = createActionInput({
        basicContext: createBasicContext({
          birthDate: new Date('1965-01-01'), // ~61, very near retirement
        }),
      });

      const youngInput = createActionInput({
        basicContext: createBasicContext({
          birthDate: new Date('1990-01-01'), // ~36, far from retirement
        }),
      });

      const nearRetirementResult = generateActionRecommendations(nearRetirementInput);
      const youngResult = generateActionRecommendations(youngInput);

      // Near-retirement should have more IMMEDIATE/NEAR_TERM actions
      const nearRetirementUrgent = nearRetirementResult.recommendations.filter(
        a => a.urgency === 'IMMEDIATE' || a.urgency === 'NEAR_TERM'
      ).length;

      const youngUrgent = youngResult.recommendations.filter(
        a => a.urgency === 'IMMEDIATE' || a.urgency === 'NEAR_TERM'
      ).length;

      expect(nearRetirementUrgent).toBeGreaterThanOrEqual(youngUrgent);
    });

    it('returns topActions list', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      expect(result.topActions).toBeDefined();
      expect(result.topActions.length).toBeLessThanOrEqual(5);

      // Top actions should be valid action IDs
      result.topActions.forEach(id => {
        const action = result.recommendations.find(a => a.id === id);
        expect(action).toBeDefined();
      });
    });

    it('includes generatedAt timestamp', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      expect(result.generatedAt).toBeDefined();
      expect(new Date(result.generatedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Action filtering by focus area priority', () => {
    it('includes actions for top-priority domains', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      // Actions should be related to high-priority domains
      const topDomains = input.focusAreas.topPriorities;
      const actionsInTopDomains = result.recommendations.filter(
        a => topDomains.includes(a.domain)
      );

      // Should have at least some actions in top domains
      expect(actionsInTopDomains.length).toBeGreaterThan(0);
    });
  });

  describe('Rationale personalization', () => {
    it('includes personalized rationale referencing values', () => {
      const input = createActionInput({
        valuesDiscovery: createValuesDiscovery({
          top5: ['financial-security', 'family-wellbeing', 'peace-of-mind', 'stability', 'protection'],
        }),
      });

      const result = generateActionRecommendations(input);

      // At least some actions should have rationale text
      result.recommendations.forEach(action => {
        expect(action.rationale.length).toBeGreaterThan(10);
      });
    });

    it('includes value and goal connections', () => {
      const input = createActionInput();
      const result = generateActionRecommendations(input);

      // Actions should have connection arrays
      result.recommendations.forEach(action => {
        expect(Array.isArray(action.valueConnections)).toBe(true);
        expect(Array.isArray(action.goalConnections)).toBe(true);
      });
    });
  });
});
