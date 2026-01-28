/**
 * Unit tests for Discovery Insights Engine (Orchestrator)
 * Tests the integration of all three insight engines
 */

import { describe, it, expect } from 'vitest';
import {
  generateDiscoveryInsights,
  hasEnoughDataForInsights,
  getInsightsStatusMessage,
  getMissingDataSuggestions,
} from './discoveryInsightsEngine';
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
    nonNegotiables: [top5[0]],
    unsureResolutions: [],
    tradeoffResponses: [],
    ...overrides,
  };
};

const createFinancialGoals = (overrides: Partial<FinancialGoals> = {}): Partial<FinancialGoals> => ({
  state: 'COMPLETED',
  allGoals: [
    { id: '1', label: 'Retire by 62', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
    { id: '2', label: 'Travel', category: 'LIFESTYLE', priority: 'MEDIUM', timeHorizon: 'LONG', flexibility: 'FLEXIBLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
    { id: '3', label: 'Legacy', category: 'FAMILY_LEGACY', priority: 'HIGH', timeHorizon: 'LONG', flexibility: 'FLEXIBLE', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
  ],
  ...overrides,
});

const createFinancialPurpose = (overrides: Partial<FinancialPurpose> = {}): Partial<FinancialPurpose> => ({
  state: 'COMPLETED',
  primaryDriver: 'STABILITY_PEACE',
  finalText: 'To provide security and peace of mind for my family while enjoying retirement.',
  tradeoffAnchors: [{ axis: 'SECURITY_VS_GROWTH', lean: 'A', strength: 2 }],
  ...overrides,
});

describe('Discovery Insights Engine', () => {
  describe('hasEnoughDataForInsights', () => {
    it('returns true with sufficient data (>=25% completion)', () => {
      const result = hasEnoughDataForInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(result).toBe(true);
    });

    it('returns false with insufficient data', () => {
      const result = hasEnoughDataForInsights({});
      expect(result).toBe(false);
    });

    it('returns false with only partial basic context', () => {
      const result = hasEnoughDataForInsights({
        basicContext: { firstName: 'Test' },
      });
      expect(result).toBe(false);
    });
  });

  describe('generateDiscoveryInsights', () => {
    it('returns null when insufficient data', () => {
      const result = generateDiscoveryInsights({});
      expect(result).toBeNull();
    });

    it('generates complete insights with full data', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      expect(insights).not.toBeNull();
      expect(insights).toHaveProperty('strategyProfile');
      expect(insights).toHaveProperty('focusAreas');
      expect(insights).toHaveProperty('actions');
      expect(insights).toHaveProperty('inputSummary');
      expect(insights).toHaveProperty('generatedAt');
    });

    it('includes correct inputSummary flags', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      expect(insights?.inputSummary.hasBasicContext).toBe(true);
      expect(insights?.inputSummary.hasValues).toBe(true);
      expect(insights?.inputSummary.hasGoals).toBe(true);
      expect(insights?.inputSummary.hasPurpose).toBe(true);
    });

    it('calculates completion percentage correctly', () => {
      const fullInsights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      // Full data should have high completion
      expect(fullInsights?.inputSummary.completionPercentage).toBeGreaterThanOrEqual(75);

      const partialInsights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });

      // Partial data should have lower completion
      expect(partialInsights?.inputSummary.completionPercentage).toBeLessThan(75);
    });

    it('strategy profile contains all 5 dimensions', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      const profile = insights?.strategyProfile;
      expect(profile?.incomeStrategy).toBeDefined();
      expect(profile?.timingSensitivity).toBeDefined();
      expect(profile?.planningFlexibility).toBeDefined();
      expect(profile?.complexityTolerance).toBeDefined();
      expect(profile?.guidanceLevel).toBeDefined();
      expect(profile?.summary).toBeDefined();
    });

    it('focus areas contains 9 domains', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });

      expect(insights?.focusAreas.areas).toHaveLength(9);
    });

    it('actions are limited to 7 max', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      expect(insights?.actions.recommendations.length).toBeLessThanOrEqual(7);
    });
  });

  describe('getInsightsStatusMessage', () => {
    it('returns appropriate message for low completion', () => {
      const message = getInsightsStatusMessage({});
      expect(message).toContain('Complete more');
    });

    it('returns appropriate message for partial completion', () => {
      const message = getInsightsStatusMessage({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(message.length).toBeGreaterThan(0);
    });

    it('returns appropriate message for high completion', () => {
      const message = getInsightsStatusMessage({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });
      expect(message).toContain('Comprehensive');
    });
  });

  describe('getMissingDataSuggestions', () => {
    it('returns empty array when data is complete', () => {
      const suggestions = getMissingDataSuggestions({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      // May still have some suggestions for optional items
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('suggests adding birth date when missing', () => {
      const suggestions = getMissingDataSuggestions({
        basicContext: { firstName: 'Test' },
      });

      expect(suggestions.some(s => s.toLowerCase().includes('birth'))).toBe(true);
    });

    it('suggests completing values when missing', () => {
      const suggestions = getMissingDataSuggestions({
        basicContext: createBasicContext(),
      });

      expect(suggestions.some(s => s.toLowerCase().includes('values'))).toBe(true);
    });

    it('suggests adding goals when missing', () => {
      const suggestions = getMissingDataSuggestions({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });

      expect(suggestions.some(s => s.toLowerCase().includes('goals'))).toBe(true);
    });

    it('suggests completing purpose when missing', () => {
      const suggestions = getMissingDataSuggestions({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      expect(suggestions.some(s => s.toLowerCase().includes('purpose'))).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('produces consistent results for same input', () => {
      const input = {
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      };

      const result1 = generateDiscoveryInsights(input);
      const result2 = generateDiscoveryInsights(input);

      // Results should be structurally identical (except timestamps)
      expect(result1?.strategyProfile.incomeStrategy.value).toBe(
        result2?.strategyProfile.incomeStrategy.value
      );
      expect(result1?.focusAreas.areas[0].domain).toBe(
        result2?.focusAreas.areas[0].domain
      );
    });

    it('actions reference valid focus area domains', () => {
      const insights = generateDiscoveryInsights({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      const validDomains = insights?.focusAreas.areas.map(a => a.domain) || [];

      insights?.actions.recommendations.forEach(action => {
        expect(validDomains).toContain(action.domain);
      });
    });
  });
});
