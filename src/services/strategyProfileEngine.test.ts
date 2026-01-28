/**
 * Unit tests for Strategy Profile Engine
 * Tests the scoring algorithms for all 5 strategy dimensions
 */

import { describe, it, expect } from 'vitest';
import { generateStrategyProfile, hasEnoughDataForProfile } from './strategyProfileEngine';
import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';
import type { FinancialPurpose } from '@/types/financialPurpose';

// Test fixtures
const createBasicContext = (overrides: Partial<BasicContext> = {}): Partial<BasicContext> => ({
  firstName: 'Test',
  lastName: 'User',
  birthDate: new Date('1970-01-01'), // Age ~56, near retirement
  maritalStatus: 'married',
  ...overrides,
});

// Valid card IDs from VALUE_CARDS database
const SECURITY_CARD_IDS = ['security_financial_security', 'security_stable_income', 'security_emergency_preparedness', 'security_insurance_protection', 'security_risk_management'];
const FREEDOM_CARD_IDS = ['freedom_financial_independence', 'freedom_work_optional', 'freedom_flexible_schedule', 'freedom_ability_to_travel', 'freedom_location_independence'];
const GROWTH_CARD_IDS = ['growth_wealth_building', 'growth_investment_growth', 'growth_career_advancement', 'growth_income_growth', 'growth_asset_accumulation'];
const CONTROL_CARD_IDS = ['control_financial_control', 'control_budget_mastery', 'control_investment_knowledge', 'control_tax_optimization', 'control_estate_planning'];

const createValuesDiscovery = (overrides: Partial<ValuesDiscovery> = {}): Partial<ValuesDiscovery> => {
  const top5 = overrides.top5 ?? SECURITY_CARD_IDS;
  // Build piles from top5
  const piles: Record<string, 'IMPORTANT'> = {};
  top5.forEach(cardId => { piles[cardId] = 'IMPORTANT'; });

  return {
    state: 'COMPLETED',
    piles,
    top10: [...top5, ...FREEDOM_CARD_IDS.slice(0, 5)],
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
    { id: '2', label: 'Travel in retirement', category: 'LIFESTYLE', priority: 'MEDIUM', timeHorizon: 'LONG', flexibility: 'FLEXIBLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
  ],
  ...overrides,
});

const createFinancialPurpose = (overrides: Partial<FinancialPurpose> = {}): Partial<FinancialPurpose> => ({
  state: 'COMPLETED',
  primaryDriver: 'STABILITY_PEACE',
  finalText: 'To provide security for my family',
  tradeoffAnchors: [
    { axis: 'SECURITY_VS_GROWTH', lean: 'A', strength: 2 },
  ],
  ...overrides,
});

describe('Strategy Profile Engine', () => {
  describe('hasEnoughDataForProfile', () => {
    it('returns true when values and basic context exist', () => {
      const result = hasEnoughDataForProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(result).toBe(true);
    });

    it('returns true when goals and basic context exist', () => {
      const result = hasEnoughDataForProfile({
        basicContext: createBasicContext(),
        financialGoals: createFinancialGoals(),
      });
      expect(result).toBe(true);
    });

    it('returns false when no basic context', () => {
      const result = hasEnoughDataForProfile({
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(result).toBe(false);
    });

    it('returns false when no values or goals', () => {
      const result = hasEnoughDataForProfile({
        basicContext: createBasicContext(),
      });
      expect(result).toBe(false);
    });
  });

  describe('generateStrategyProfile', () => {
    it('generates a complete profile with all 5 dimensions', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      expect(profile).toHaveProperty('incomeStrategy');
      expect(profile).toHaveProperty('timingSensitivity');
      expect(profile).toHaveProperty('planningFlexibility');
      expect(profile).toHaveProperty('complexityTolerance');
      expect(profile).toHaveProperty('guidanceLevel');
      expect(profile).toHaveProperty('summary');
      expect(profile).toHaveProperty('generatedAt');
    });

    it('generates appropriate values for security-focused profile', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery({
          top5: SECURITY_CARD_IDS, // Security-focused values
        }),
        financialPurpose: createFinancialPurpose({
          tradeoffAnchors: [{ axis: 'SECURITY_VS_GROWTH', lean: 'A', strength: 2 }],
        }),
      });

      // Security-focused should lean toward stability
      expect(profile.incomeStrategy.value).toBe('STABILITY_FOCUSED');
    });

    it('generates appropriate values for growth-focused profile', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext({
          birthDate: new Date('1990-01-01'), // Young, 20+ years to retirement
        }),
        valuesDiscovery: createValuesDiscovery({
          top5: GROWTH_CARD_IDS, // Growth-focused values
        }),
        financialPurpose: createFinancialPurpose({
          tradeoffAnchors: [{ axis: 'SECURITY_VS_GROWTH', lean: 'B', strength: 5 }],
        }),
      });

      // Growth-focused with long horizon
      expect(profile.incomeStrategy.value).toBe('GROWTH_FOCUSED');
    });

    it('assigns high timing sensitivity when near retirement with fixed goals', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext({
          birthDate: new Date('1965-01-01'), // ~61, very near retirement
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Retire by 63', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'SHORT', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
            { id: '2', label: 'Buy house', category: 'MAJOR_PURCHASES', priority: 'HIGH', timeHorizon: 'SHORT', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
          ],
        }),
      });

      expect(profile.timingSensitivity.value).toBe('HIGH');
    });

    it('assigns low timing sensitivity with flexible goals and long horizon', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext({
          birthDate: new Date('1990-01-01'), // Young
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Retire eventually', category: 'RETIREMENT', priority: 'MEDIUM', timeHorizon: 'LONG', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
            { id: '2', label: 'Maybe travel', category: 'LIFESTYLE', priority: 'LOW', timeHorizon: 'LONG', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
            { id: '3', label: 'Flexible savings', category: 'SECURITY_PROTECTION', priority: 'LOW', timeHorizon: 'ONGOING', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
          ],
        }),
      });

      expect(profile.timingSensitivity.value).toBe('LOW');
    });

    it('assigns low flexibility when control values are dominant', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery({
          top5: CONTROL_CARD_IDS, // Control-focused values
          nonNegotiables: CONTROL_CARD_IDS.slice(0, 3),
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Fixed goal', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
            { id: '2', label: 'Fixed goal 2', category: 'SECURITY_PROTECTION', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
            { id: '3', label: 'Fixed goal 3', category: 'FAMILY_LEGACY', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED', source: 'user', isCorePlanningGoal: true, createdAt: new Date().toISOString() },
          ],
        }),
      });

      expect(profile.planningFlexibility.value).toBe('LOW');
    });

    it('assigns high flexibility when freedom values dominate and goals are deferrable', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery({
          top5: FREEDOM_CARD_IDS, // Freedom-focused values
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Flexible goal', category: 'LIFESTYLE', priority: 'MEDIUM', timeHorizon: 'LONG', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
            { id: '2', label: 'Flexible goal 2', category: 'LIFESTYLE', priority: 'LOW', timeHorizon: 'LONG', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
            { id: '3', label: 'Flexible goal 3', category: 'LIFESTYLE', priority: 'LOW', timeHorizon: 'LONG', flexibility: 'DEFERRABLE', source: 'user', isCorePlanningGoal: false, createdAt: new Date().toISOString() },
          ],
        }),
      });

      expect(profile.planningFlexibility.value).toBe('HIGH');
    });

    it('includes rationale for each dimension', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      expect(profile.incomeStrategy.rationale).toBeTruthy();
      expect(profile.timingSensitivity.rationale).toBeTruthy();
      expect(profile.planningFlexibility.rationale).toBeTruthy();
      expect(profile.complexityTolerance.rationale).toBeTruthy();
      expect(profile.guidanceLevel.rationale).toBeTruthy();
    });

    it('generates natural language summary', () => {
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
        financialPurpose: createFinancialPurpose(),
      });

      expect(profile.summary).toBeTruthy();
      expect(profile.summary.length).toBeGreaterThan(50);
      expect(profile.summary).toContain('Planning');
    });
  });

  describe('Edge cases', () => {
    it('handles empty input gracefully', () => {
      const profile = generateStrategyProfile({});

      expect(profile).toHaveProperty('incomeStrategy');
      expect(profile.incomeStrategy.confidence).toBe('LOW');
    });

    it('handles partial values discovery', () => {
      const partialCards = SECURITY_CARD_IDS.slice(0, 2);
      const profile = generateStrategyProfile({
        basicContext: createBasicContext(),
        valuesDiscovery: {
          state: 'IN_PROGRESS',
          piles: Object.fromEntries(partialCards.map(c => [c, 'IMPORTANT' as const])),
          top10: partialCards,
          top5: partialCards,
          nonNegotiables: [],
          unsureResolutions: [],
          tradeoffResponses: [],
        },
      });

      expect(profile).toHaveProperty('incomeStrategy');
    });

    it('handles federal employee context', () => {
      const profile = generateStrategyProfile({
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
        valuesDiscovery: createValuesDiscovery({
          top5: CONTROL_CARD_IDS, // Control-focused values
        }),
      });

      // Federal employee with control values should have higher complexity tolerance
      expect(['MODERATE', 'ADVANCED']).toContain(profile.complexityTolerance.value);
    });
  });
});
