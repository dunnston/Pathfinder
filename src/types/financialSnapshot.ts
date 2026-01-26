/**
 * Section 5: Financial Snapshot types
 * Light financial data collection (ranges, not exact amounts)
 */

/** Current income source types */
export type IncomeSourceType =
  | 'salary'
  | 'self_employment'
  | 'rental'
  | 'pension'
  | 'social_security'
  | 'other';

/** A current income source */
export interface IncomeSource {
  type: IncomeSourceType;
  description: string;
  annualAmount: number;
  isPrimary: boolean;
}

/** Expected retirement income types */
export type RetirementIncomeType =
  | 'fers_pension'
  | 'csrs_pension'
  | 'social_security'
  | 'tsp_withdrawals'
  | 'other_pension'
  | 'rental_income'
  | 'part_time_work'
  | 'other';

/** Expected retirement income source */
export interface ExpectedRetirementIncome {
  type: RetirementIncomeType;
  estimatedAnnualAmount?: number;
  startAge?: number;
  isGuaranteed: boolean;
  notes?: string;
}

/** Investment account types */
export type AccountType =
  | 'tsp_traditional'
  | 'tsp_roth'
  | 'traditional_ira'
  | 'roth_ira'
  | '401k'
  | 'taxable_brokerage'
  | 'savings'
  | 'other';

/** Balance ranges (avoiding exact amounts) */
export type BalanceRange =
  | 'under_10k'
  | '10k_50k'
  | '50k_100k'
  | '100k_250k'
  | '250k_500k'
  | '500k_1m'
  | '1m_2m'
  | 'over_2m';

/** Summary of an investment account */
export interface AccountSummary {
  type: AccountType;
  approximateBalance: BalanceRange;
  notes?: string;
}

/** Debt types */
export type DebtType = 'mortgage' | 'car' | 'student_loan' | 'credit_card' | 'other';

/** Summary of a debt */
export interface DebtSummary {
  type: DebtType;
  approximateBalance: BalanceRange;
  yearsRemaining?: number;
  notes?: string;
}

/** Asset types */
export type AssetType = 'primary_home' | 'rental_property' | 'business' | 'vehicle' | 'other';

/** Summary of a major asset */
export interface AssetSummary {
  type: AssetType;
  approximateValue?: BalanceRange;
  notes?: string;
}

/** Emergency reserve location */
export type ReserveLocation = 'savings' | 'money_market' | 'mixed' | 'other';

/** Emergency reserves information */
export interface EmergencyReserves {
  monthsOfExpenses: number;
  location: ReserveLocation;
}

/** Life insurance types */
export type LifeInsuranceType = 'fegli' | 'private_term' | 'private_whole' | 'mixed';

/** Summary of insurance coverage */
export interface InsuranceSummary {
  hasLifeInsurance: boolean;
  lifeInsuranceType?: LifeInsuranceType;
  hasLongTermCare: boolean;
  hasDisability: boolean;
  notes?: string;
}

/** Complete financial snapshot section */
export interface FinancialSnapshot {
  incomeSourcesCurrent: IncomeSource[];
  incomeSourcesRetirement: ExpectedRetirementIncome[];
  investmentAccounts: AccountSummary[];
  debts: DebtSummary[];
  majorAssets: AssetSummary[];
  emergencyReserves: EmergencyReserves;
  insuranceCoverage: InsuranceSummary;
}
