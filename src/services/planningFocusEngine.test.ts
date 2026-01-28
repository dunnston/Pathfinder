/**
 * Unit tests for Planning Focus Engine
 * Tests domain scoring and prioritization algorithms
 */

import { describe, it, expect } from 'vitest';
import { generateFocusAreaRanking, hasEnoughDataForFocusAreas } from './planningFocusEngine';
import type { BasicContext } from '@/types/basicContext';
import type { ValuesDiscovery } from '@/types/valuesDiscovery';
import type { FinancialGoals } from '@/types/financialGoals';

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
    { id: '1', label: 'Retire by 62', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED' },
  ],
  ...overrides,
});

describe('Planning Focus Engine', () => {
  describe('hasEnoughDataForFocusAreas', () => {
    it('returns true with values and basic context', () => {
      const result = hasEnoughDataForFocusAreas({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(result).toBe(true);
    });

    it('returns true with goals and basic context', () => {
      const result = hasEnoughDataForFocusAreas({
        basicContext: createBasicContext(),
        financialGoals: createFinancialGoals(),
      });
      expect(result).toBe(true);
    });

    it('returns false without basic context', () => {
      const result = hasEnoughDataForFocusAreas({
        valuesDiscovery: createValuesDiscovery(),
      });
      expect(result).toBe(false);
    });
  });

  describe('generateFocusAreaRanking', () => {
    it('returns all 9 planning domains', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      expect(ranking.areas).toHaveLength(9);
      expect(ranking.areas.map(a => a.domain)).toContain('RETIREMENT_INCOME');
      expect(ranking.areas.map(a => a.domain)).toContain('INVESTMENT_STRATEGY');
      expect(ranking.areas.map(a => a.domain)).toContain('TAX_OPTIMIZATION');
      expect(ranking.areas.map(a => a.domain)).toContain('INSURANCE_RISK');
      expect(ranking.areas.map(a => a.domain)).toContain('ESTATE_LEGACY');
      expect(ranking.areas.map(a => a.domain)).toContain('CASH_FLOW_DEBT');
      expect(ranking.areas.map(a => a.domain)).toContain('BENEFITS_OPTIMIZATION');
      expect(ranking.areas.map(a => a.domain)).toContain('BUSINESS_CAREER');
      expect(ranking.areas.map(a => a.domain)).toContain('HEALTHCARE_LTC');
    });

    it('assigns priority numbers 1-9', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });

      const priorities = ranking.areas.map(a => a.priority).sort((a, b) => a - b);
      expect(priorities).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('prioritizes retirement income when near retirement', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext({
          birthDate: new Date('1965-01-01'), // ~61, very near retirement
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Retire soon', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'SHORT', flexibility: 'FIXED' },
          ],
        }),
      });

      // Retirement income should be top 3
      const retirementArea = ranking.areas.find(a => a.domain === 'RETIREMENT_INCOME');
      expect(retirementArea?.priority).toBeLessThanOrEqual(3);
    });

    it('prioritizes insurance when dependents exist', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext({
          dependents: [
            { name: 'Child', relationship: 'child', age: 10, financiallyDependent: true },
          ],
        }),
        valuesDiscovery: createValuesDiscovery({
          top5: ['family-wellbeing', 'protection', 'security', 'responsibility', 'care'],
        }),
      });

      const insuranceArea = ranking.areas.find(a => a.domain === 'INSURANCE_RISK');
      // Insurance should be ranked higher with dependents
      expect(insuranceArea?.priority).toBeLessThanOrEqual(5);
    });

    it('prioritizes benefits optimization for federal employees', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext({
          federalEmployee: {
            agency: 'DOD',
            yearsOfService: 15,
            retirementSystem: 'FERS',
            payGrade: 'GS-12',
            step: 5,
            isLawEnforcement: false,
          },
        }),
      });

      const benefitsArea = ranking.areas.find(a => a.domain === 'BENEFITS_OPTIMIZATION');
      // Benefits should be ranked higher for federal employees
      expect(benefitsArea?.priority).toBeLessThanOrEqual(5);
    });

    it('includes value connections for each area', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
      });

      // At least some areas should have value connections
      const areasWithConnections = ranking.areas.filter(a => a.valueConnections.length > 0);
      expect(areasWithConnections.length).toBeGreaterThan(0);
    });

    it('includes goal connections when goals exist', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Early retirement', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED' },
          ],
        }),
      });

      const areasWithGoals = ranking.areas.filter(a => a.goalConnections.length > 0);
      expect(areasWithGoals.length).toBeGreaterThan(0);
    });

    it('returns top 3 priorities', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery(),
        financialGoals: createFinancialGoals(),
      });

      expect(ranking.topPriorities.length).toBeLessThanOrEqual(3);
    });

    it('assigns importance levels correctly', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext({
          birthDate: new Date('1963-01-01'), // Very near retirement
        }),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Retire in 2 years', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'SHORT', flexibility: 'FIXED' },
          ],
        }),
      });

      // Top areas should have CRITICAL or HIGH importance
      const topArea = ranking.areas.find(a => a.priority === 1);
      expect(['CRITICAL', 'HIGH']).toContain(topArea?.importance);
    });
  });

  describe('Value-domain mappings', () => {
    it('maps SECURITY values to income, insurance, cash flow domains', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery({
          top5: SECURITY_CARD_IDS, // Security-focused values
        }),
      });

      // Security-focused values should boost these domains
      const incomeArea = ranking.areas.find(a => a.domain === 'RETIREMENT_INCOME');
      const insuranceArea = ranking.areas.find(a => a.domain === 'INSURANCE_RISK');
      const cashFlowArea = ranking.areas.find(a => a.domain === 'CASH_FLOW_DEBT');

      // These should all have decent priority (not at the bottom)
      expect(incomeArea?.priority).toBeLessThanOrEqual(6);
      expect(insuranceArea?.priority).toBeLessThanOrEqual(6);
      expect(cashFlowArea?.priority).toBeLessThanOrEqual(6);
    });

    it('maps FAMILY values to estate and insurance domains', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        valuesDiscovery: createValuesDiscovery({
          top5: FAMILY_CARD_IDS, // Family-focused values
        }),
      });

      const estateArea = ranking.areas.find(a => a.domain === 'ESTATE_LEGACY');
      const insuranceArea = ranking.areas.find(a => a.domain === 'INSURANCE_RISK');

      expect(estateArea?.priority).toBeLessThanOrEqual(5);
      expect(insuranceArea?.priority).toBeLessThanOrEqual(5);
    });
  });

  describe('Goal-domain mappings', () => {
    it('maps RETIREMENT goals to income, investment, tax domains', () => {
      const ranking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Early retirement', category: 'RETIREMENT', priority: 'HIGH', timeHorizon: 'MID', flexibility: 'FIXED' },
          ],
        }),
      });

      const incomeArea = ranking.areas.find(a => a.domain === 'RETIREMENT_INCOME');
      const investmentArea = ranking.areas.find(a => a.domain === 'INVESTMENT_STRATEGY');
      const taxArea = ranking.areas.find(a => a.domain === 'TAX_OPTIMIZATION');

      expect(incomeArea?.priority).toBeLessThanOrEqual(5);
      expect(investmentArea?.priority).toBeLessThanOrEqual(5);
      expect(taxArea?.priority).toBeLessThanOrEqual(6);
    });

    it('prioritizes domains based on goal time horizon', () => {
      const shortTermRanking = generateFocusAreaRanking({
        basicContext: createBasicContext(),
        financialGoals: createFinancialGoals({
          allGoals: [
            { id: '1', label: 'Buy house soon', category: 'MAJOR_PURCHASES', priority: 'HIGH', timeHorizon: 'SHORT', flexibility: 'FIXED' },
          ],
        }),
      });

      // Short-term major purchase should boost cash flow
      const cashFlowArea = shortTermRanking.areas.find(a => a.domain === 'CASH_FLOW_DEBT');
      expect(cashFlowArea?.priority).toBeLessThanOrEqual(4);
    });
  });
});
