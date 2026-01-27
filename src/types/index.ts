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

// Values Discovery types
export type {
  ValueCategory,
  Pile,
  ValuesDiscoveryState,
  TradeoffChoice,
  TradeoffStrength,
  ValueCard,
  TradeoffResponse,
  UnsureResolution,
  CategoryCount,
  ValuesDiscoveryDerived,
  ValuesDiscovery,
} from './valuesDiscovery';

// Financial Goals types
export type {
  GoalCategory,
  GoalPriority,
  GoalTimeHorizon,
  GoalFlexibility,
  FinancialGoalsState,
  GoalSource,
  FinancialGoal,
  FinancialGoalTradeoff,
  FinancialGoals,
} from './financialGoals';

// Financial Purpose types
export type {
  PurposeDriver,
  TradeoffAxis,
  FinancialPurposeState,
  TradeoffAnchor,
  SoFPDraft,
  FinancialPurpose,
} from './financialPurpose';

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

// Strategy Profile types (Discovery to Data)
export type {
  IncomeStrategyOrientation,
  TimingSensitivity,
  PlanningFlexibility,
  ComplexityTolerance,
  GuidanceLevel,
  StrategyDimension,
  StrategyProfile,
  PlanningDomain,
  PlanningDomainInfo,
  PlanningFocusArea,
  PlanningFocusRanking,
  ActionType,
  ActionGuidance,
  ActionUrgency,
  ActionRecommendation,
  ActionRecommendations,
  DiscoveryInsights,
} from './strategyProfile';

export {
  INCOME_STRATEGY_LABELS,
  TIMING_SENSITIVITY_LABELS,
  PLANNING_FLEXIBILITY_LABELS,
  COMPLEXITY_TOLERANCE_LABELS,
  GUIDANCE_LEVEL_LABELS,
  PLANNING_DOMAIN_LABELS,
  ACTION_TYPE_LABELS,
  ACTION_GUIDANCE_LABELS,
  ACTION_URGENCY_LABELS,
} from './strategyProfile';
