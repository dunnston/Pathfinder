/**
 * Central export for all types
 */

// Common types
export type { EmploymentStatus, EducationPreference } from './common';

// User types
export type { UserRole, User, UserPreferences } from './user';

// Basic Context types (Section 1)
export type {
  MaritalStatus,
  RetirementSystem,
  SpouseInfo,
  FederalEmployeeInfo,
  Dependent,
  BasicContext,
} from './basicContext';

// Retirement Vision types (Section 2)
export type {
  Flexibility,
  ConcernType,
  ConcernSeverity,
  RetirementConcern,
  LifestylePriority,
  RetirementVision,
} from './retirementVision';

// Planning Preferences types (Section 3)
export type {
  ToleranceLevel,
  ComfortLevel,
  InvolvementLevel,
  DecisionStyle,
  ValueType,
  ValueRanking,
  TradeoffPosition,
  TradeoffPreference,
  PlanningPreferences,
} from './planningPreferences';

// Risk Comfort types (Section 4)
export type {
  StabilityPreference,
  DownturnResponse,
  ImportanceLevel,
  WillingnessLevel,
  TimingFlexibility,
  RiskComfort,
} from './riskComfort';

// Financial Snapshot types (Section 5)
export type {
  IncomeSourceType,
  IncomeSource,
  RetirementIncomeType,
  ExpectedRetirementIncome,
  AccountType,
  BalanceRange,
  AccountSummary,
  DebtType,
  DebtSummary,
  AssetType,
  AssetSummary,
  ReserveLocation,
  EmergencyReserves,
  LifeInsuranceType,
  InsuranceSummary,
  FinancialSnapshot,
} from './financialSnapshot';

// System Classifications types
export type {
  PlanningStage,
  DecisionUrgency,
  DecisionWindow,
  StrategyWeights,
  SystemClassifications,
} from './systemClassifications';

// Profile types
export type {
  ProfileStatus,
  FinancialProfile,
  PartialFinancialProfile,
  ProfileSection,
  SectionCompletionMap,
} from './profile';

// Client types (Advisor Mode)
export type {
  ClientStatus,
  Client,
  ClientFilters,
  ClientSortField,
  SortDirection,
  ClientSortOptions,
  SectionProgress,
  CreateClientInput,
} from './client';

// User mode type
export type UserMode = 'consumer' | 'advisor';

// Discovery types
export type {
  DiscoverySection,
  DiscoveryProgress,
  NavigationDirection,
  DiscoveryNavigationAction,
  SectionValidation,
  SectionValidationError,
  SectionValidationWarning,
} from './discovery';

export { DISCOVERY_SECTIONS } from './discovery';
