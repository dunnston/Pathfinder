/**
 * Asset Class Data
 * Information and options for investment asset classes
 */

import type { AssetClass } from '@/types/dashboard';

interface AssetClassInfo {
  name: string;
  description: string;
  riskLevel: 'low' | 'moderate' | 'high';
  category: 'equity' | 'fixed_income' | 'alternative' | 'cash';
}

export const ASSET_CLASS_INFO: Record<AssetClass, AssetClassInfo> = {
  us_large_cap: {
    name: 'US Large Cap',
    description: 'Large US companies (e.g., S&P 500)',
    riskLevel: 'moderate',
    category: 'equity',
  },
  us_mid_cap: {
    name: 'US Mid Cap',
    description: 'Medium-sized US companies',
    riskLevel: 'moderate',
    category: 'equity',
  },
  us_small_cap: {
    name: 'US Small Cap',
    description: 'Smaller US companies with growth potential',
    riskLevel: 'high',
    category: 'equity',
  },
  international_developed: {
    name: 'International Developed',
    description: 'Companies in developed markets outside the US',
    riskLevel: 'moderate',
    category: 'equity',
  },
  emerging_markets: {
    name: 'Emerging Markets',
    description: 'Companies in developing economies',
    riskLevel: 'high',
    category: 'equity',
  },
  us_bonds: {
    name: 'US Bonds',
    description: 'US government and corporate bonds',
    riskLevel: 'low',
    category: 'fixed_income',
  },
  international_bonds: {
    name: 'International Bonds',
    description: 'Bonds from issuers outside the US',
    riskLevel: 'moderate',
    category: 'fixed_income',
  },
  tips: {
    name: 'TIPS',
    description: 'Treasury Inflation-Protected Securities',
    riskLevel: 'low',
    category: 'fixed_income',
  },
  real_estate: {
    name: 'Real Estate',
    description: 'REITs and real estate investments',
    riskLevel: 'moderate',
    category: 'alternative',
  },
  cash: {
    name: 'Cash',
    description: 'Money market funds, CDs, savings',
    riskLevel: 'low',
    category: 'cash',
  },
  other: {
    name: 'Other',
    description: 'Other asset classes not listed above',
    riskLevel: 'moderate',
    category: 'alternative',
  },
};

export const ASSET_CLASS_OPTIONS: { value: AssetClass; label: string }[] = [
  { value: 'us_large_cap', label: 'US Large Cap' },
  { value: 'us_mid_cap', label: 'US Mid Cap' },
  { value: 'us_small_cap', label: 'US Small Cap' },
  { value: 'international_developed', label: 'International Developed' },
  { value: 'emerging_markets', label: 'Emerging Markets' },
  { value: 'us_bonds', label: 'US Bonds' },
  { value: 'international_bonds', label: 'International Bonds' },
  { value: 'tips', label: 'TIPS' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
];

export const RISK_LEVEL_LABELS: Record<AssetClassInfo['riskLevel'], string> = {
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
};

export const CATEGORY_LABELS: Record<AssetClassInfo['category'], string> = {
  equity: 'Equity',
  fixed_income: 'Fixed Income',
  alternative: 'Alternative',
  cash: 'Cash',
};
