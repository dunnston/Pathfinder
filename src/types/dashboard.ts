/**
 * Dashboard Types
 * Types for task tracking, alerts, Investment Policy Statement (IPS), and settings
 */

import type { AccountType } from './financialSnapshot';
import type { PlanningDomain } from './strategyProfile';

// ============================================================
// TASK TRACKING
// ============================================================

/** Status of a tracked task/recommendation */
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'dismissed';

/** A tracked task linked to an ActionRecommendation */
export interface TrackedTask {
  /** Unique identifier */
  id: string;
  /** Reference to the ActionRecommendation.id this task tracks */
  actionId: string;
  /** Current status of the task */
  status: TaskStatus;
  /** When the task was started (status changed to in_progress) */
  startedAt?: string;
  /** When the task was completed */
  completedAt?: string;
  /** When the task was dismissed */
  dismissedAt?: string;
  /** Optional notes from the user */
  notes?: string;
}

// ============================================================
// ALERTS & NOTIFICATIONS
// ============================================================

/** Types of alerts the system can generate */
export type AlertType =
  | 'rebalance_due'
  | 'beneficiary_review'
  | 'annual_review'
  | 'action_reminder';

/** Frequency for recurring alerts */
export type AlertFrequency = 'monthly' | 'quarterly' | 'semi_annually' | 'annually';

/** Alert urgency levels */
export type AlertUrgencyLevel = 'info' | 'warning' | 'urgent';

/** An alert/notification for the user */
export interface Alert {
  /** Unique identifier */
  id: string;
  /** Type of alert */
  type: AlertType;
  /** Alert title */
  title: string;
  /** Detailed message */
  message: string;
  /** Urgency level */
  urgency: AlertUrgencyLevel;
  /** When this alert is due (if time-based) */
  dueDate?: string;
  /** When the user acknowledged this alert */
  acknowledgedAt?: string;
  /** When the alert was completed/resolved */
  completedAt?: string;
  /** How often this alert should recur */
  frequency?: AlertFrequency;
  /** When this alert should next trigger (for recurring alerts) */
  nextTriggerAt?: string;
  /** Related domain (optional) */
  domain?: PlanningDomain;
  /** Related action ID (for action reminders) */
  actionId?: string;
  /** When this alert was created */
  createdAt: string;
}

/** Rule for generating scheduled alerts */
export interface AlertRule {
  /** Unique identifier */
  id: string;
  /** Type of alert this rule generates */
  type: AlertType;
  /** Whether this rule is enabled */
  enabled: boolean;
  /** Frequency of the alert */
  frequency: AlertFrequency;
  /** Last time an alert was generated from this rule */
  lastTriggeredAt?: string;
  /** Custom title for alerts from this rule */
  customTitle?: string;
  /** Custom message for alerts from this rule */
  customMessage?: string;
}

// ============================================================
// INVESTMENT POLICY STATEMENT (IPS)
// ============================================================

/** Asset class categories for portfolio allocation */
export type AssetClass =
  | 'us_large_cap'
  | 'us_mid_cap'
  | 'us_small_cap'
  | 'international_developed'
  | 'emerging_markets'
  | 'us_bonds'
  | 'international_bonds'
  | 'tips'
  | 'real_estate'
  | 'cash'
  | 'other';

/** A holding within an IPS account */
export interface IPSHolding {
  /** Unique identifier */
  id: string;
  /** Name of the holding (e.g., "Vanguard Total Stock Market") */
  name: string;
  /** Optional ticker symbol */
  symbol?: string;
  /** Asset class category */
  assetClass: AssetClass;
  /** Current value in dollars */
  currentValue: number;
}

/** An investment account in the IPS */
export interface IPSAccount {
  /** Unique identifier */
  id: string;
  /** Account name (e.g., "Fidelity 401k") */
  name: string;
  /** Type of account */
  accountType: AccountType;
  /** Custodian/institution name */
  custodian?: string;
  /** Current total balance */
  currentBalance: number;
  /** Date of the balance */
  asOfDate: string;
  /** Holdings within this account */
  holdings: IPSHolding[];
}

/** Target allocation for an asset class */
export interface TargetAllocation {
  /** Asset class */
  assetClass: AssetClass;
  /** Target percentage (0-100) */
  targetPercentage: number;
}

/** Rebalance recommendation for an asset class */
export interface RebalanceRecommendation {
  /** Asset class */
  assetClass: AssetClass;
  /** Current percentage of portfolio */
  currentPercentage: number;
  /** Target percentage */
  targetPercentage: number;
  /** Deviation from target (current - target) */
  deviation: number;
  /** Absolute deviation amount in dollars */
  deviationAmount: number;
  /** Recommended action */
  action: 'buy' | 'sell' | 'hold';
  /** Dollar amount to buy/sell */
  actionAmount: number;
}

/** Complete Investment Policy Statement */
export interface InvestmentPolicyStatement {
  /** Investment accounts */
  accounts: IPSAccount[];
  /** Target allocations by asset class */
  targetAllocations: TargetAllocation[];
  /** Threshold percentage that triggers rebalance recommendation */
  rebalanceThreshold: number;
  /** How often to check for rebalancing */
  rebalanceFrequency: AlertFrequency;
  /** Last rebalance date */
  lastRebalanceDate?: string;
  /** When IPS was last updated */
  updatedAt: string;
}

// ============================================================
// SETTINGS
// ============================================================

/** Dashboard settings for the user */
export interface DashboardSettings {
  /** How often to prompt for rebalancing review */
  rebalanceFrequency: AlertFrequency;
  /** How often to prompt for beneficiary review */
  beneficiaryReviewFrequency: AlertFrequency;
  /** Days before an action's target date to send reminder */
  actionReminderDays: number;
  /** Whether to show completed tasks in the list */
  showCompletedTasks: boolean;
  /** Whether to show dismissed tasks */
  showDismissedTasks: boolean;
}

// ============================================================
// DASHBOARD STATE
// ============================================================

/** Complete dashboard state */
export interface DashboardState {
  /** Tracked tasks linked to recommendations */
  trackedTasks: TrackedTask[];
  /** Active alerts */
  alerts: Alert[];
  /** Alert generation rules */
  alertRules: AlertRule[];
  /** Investment policy statement */
  investmentPolicy: InvestmentPolicyStatement | null;
  /** User settings */
  settings: DashboardSettings;
}

// ============================================================
// DISPLAY LABELS
// ============================================================

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  dismissed: 'Dismissed',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  rebalance_due: 'Rebalance Due',
  beneficiary_review: 'Beneficiary Review',
  annual_review: 'Annual Review',
  action_reminder: 'Action Reminder',
};

export const ALERT_FREQUENCY_LABELS: Record<AlertFrequency, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semi_annually: 'Semi-Annually',
  annually: 'Annually',
};

export const ALERT_URGENCY_LABELS: Record<AlertUrgencyLevel, string> = {
  info: 'Info',
  warning: 'Warning',
  urgent: 'Urgent',
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  us_large_cap: 'US Large Cap',
  us_mid_cap: 'US Mid Cap',
  us_small_cap: 'US Small Cap',
  international_developed: 'International Developed',
  emerging_markets: 'Emerging Markets',
  us_bonds: 'US Bonds',
  international_bonds: 'International Bonds',
  tips: 'TIPS',
  real_estate: 'Real Estate',
  cash: 'Cash',
  other: 'Other',
};

export const ASSET_CLASS_CATEGORIES: Record<AssetClass, 'equity' | 'fixed_income' | 'alternative' | 'cash'> = {
  us_large_cap: 'equity',
  us_mid_cap: 'equity',
  us_small_cap: 'equity',
  international_developed: 'equity',
  emerging_markets: 'equity',
  us_bonds: 'fixed_income',
  international_bonds: 'fixed_income',
  tips: 'fixed_income',
  real_estate: 'alternative',
  cash: 'cash',
  other: 'alternative',
};

/** Default dashboard settings */
export const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = {
  rebalanceFrequency: 'quarterly',
  beneficiaryReviewFrequency: 'annually',
  actionReminderDays: 7,
  showCompletedTasks: false,
  showDismissedTasks: false,
};

/** Default IPS values */
export const DEFAULT_REBALANCE_THRESHOLD = 5; // 5% deviation triggers rebalance
