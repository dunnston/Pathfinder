/**
 * Alert Service
 * Functions for checking rebalance needs and generating scheduled alerts
 */

import type {
  InvestmentPolicyStatement,
  AlertRule,
  Alert,
  AlertType,
  AlertFrequency,
  AlertUrgencyLevel,
  AssetClass,
  RebalanceRecommendation,
} from '@/types/dashboard';

// ============================================================
// REBALANCE CHECKING
// ============================================================

export interface RebalanceCheckResult {
  /** Whether rebalancing is needed */
  needsRebalance: boolean;
  /** Asset classes that need attention */
  assetClassesOutOfBalance: AssetClass[];
  /** Maximum deviation from target */
  maxDeviation: number;
  /** Detailed recommendations */
  recommendations: RebalanceRecommendation[];
}

/**
 * Check if portfolio needs rebalancing
 * Compares current allocation to target allocation and returns whether rebalancing is needed
 */
export function checkRebalanceNeeded(ips: InvestmentPolicyStatement | null): RebalanceCheckResult {
  const defaultResult: RebalanceCheckResult = {
    needsRebalance: false,
    assetClassesOutOfBalance: [],
    maxDeviation: 0,
    recommendations: [],
  };

  if (!ips || ips.accounts.length === 0 || ips.targetAllocations.length === 0) {
    return defaultResult;
  }

  const { accounts, targetAllocations, rebalanceThreshold } = ips;

  // Calculate total portfolio value
  const totalValue = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  if (totalValue === 0) {
    return defaultResult;
  }

  // Aggregate holdings by asset class
  const currentByAssetClass = new Map<AssetClass, number>();
  accounts.forEach((account) => {
    account.holdings.forEach((holding) => {
      const current = currentByAssetClass.get(holding.assetClass) || 0;
      currentByAssetClass.set(holding.assetClass, current + holding.currentValue);
    });
  });

  // Calculate recommendations and check for deviations
  const recommendations: RebalanceRecommendation[] = [];
  const assetClassesOutOfBalance: AssetClass[] = [];
  let maxDeviation = 0;

  targetAllocations.forEach((target) => {
    const currentValue = currentByAssetClass.get(target.assetClass) || 0;
    const currentPercentage = (currentValue / totalValue) * 100;
    const deviation = currentPercentage - target.targetPercentage;
    const absDeviation = Math.abs(deviation);
    const deviationAmount = (deviation / 100) * totalValue;

    // Track max deviation
    if (absDeviation > maxDeviation) {
      maxDeviation = absDeviation;
    }

    // Determine action
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let actionAmount = 0;

    if (absDeviation > rebalanceThreshold) {
      assetClassesOutOfBalance.push(target.assetClass);
      if (deviation > 0) {
        action = 'sell';
        actionAmount = Math.abs(deviationAmount);
      } else {
        action = 'buy';
        actionAmount = Math.abs(deviationAmount);
      }
    }

    recommendations.push({
      assetClass: target.assetClass,
      currentPercentage: Math.round(currentPercentage * 100) / 100,
      targetPercentage: target.targetPercentage,
      deviation: Math.round(deviation * 100) / 100,
      deviationAmount: Math.round(deviationAmount * 100) / 100,
      action,
      actionAmount: Math.round(actionAmount * 100) / 100,
    });
  });

  return {
    needsRebalance: assetClassesOutOfBalance.length > 0,
    assetClassesOutOfBalance,
    maxDeviation: Math.round(maxDeviation * 100) / 100,
    recommendations,
  };
}

/**
 * Get severity level based on deviation and threshold
 */
export function getDeviationSeverity(
  deviation: number,
  threshold: number
): 'none' | 'warning' | 'critical' {
  const absDeviation = Math.abs(deviation);
  if (absDeviation <= threshold) {
    return 'none';
  }
  if (absDeviation <= threshold * 2) {
    return 'warning';
  }
  return 'critical';
}

// ============================================================
// SCHEDULED ALERT GENERATION
// ============================================================

export interface GeneratedAlert {
  type: AlertType;
  title: string;
  message: string;
  urgency: AlertUrgencyLevel;
  frequency?: AlertFrequency;
  dueDate?: string;
}

interface GenerateAlertsContext {
  ips: InvestmentPolicyStatement | null;
  existingAlerts: Alert[];
}

/**
 * Generate scheduled alerts based on rules and current state
 */
export function generateScheduledAlerts(
  rules: AlertRule[],
  context: GenerateAlertsContext
): GeneratedAlert[] {
  const now = new Date();
  const newAlerts: GeneratedAlert[] = [];

  rules.forEach((rule) => {
    if (!rule.enabled) return;

    // Check if we should trigger based on frequency
    const shouldTrigger = shouldTriggerAlert(rule, now);
    if (!shouldTrigger) return;

    // Check if there's already an active alert of this type
    const hasActiveAlert = context.existingAlerts.some(
      (a) => a.type === rule.type && !a.completedAt
    );
    if (hasActiveAlert) return;

    // Generate appropriate alert based on type
    const alert = generateAlertForRule(rule, context);
    if (alert) {
      newAlerts.push(alert);
    }
  });

  return newAlerts;
}

/**
 * Determine if an alert should trigger based on frequency
 */
function shouldTriggerAlert(rule: AlertRule, now: Date): boolean {
  if (!rule.lastTriggeredAt) {
    return true;
  }

  const lastTriggered = new Date(rule.lastTriggeredAt);
  const monthsSinceLastTrigger =
    (now.getTime() - lastTriggered.getTime()) / (1000 * 60 * 60 * 24 * 30);

  switch (rule.frequency) {
    case 'monthly':
      return monthsSinceLastTrigger >= 1;
    case 'quarterly':
      return monthsSinceLastTrigger >= 3;
    case 'semi_annually':
      return monthsSinceLastTrigger >= 6;
    case 'annually':
      return monthsSinceLastTrigger >= 12;
    default:
      return false;
  }
}

/**
 * Generate an alert for a specific rule
 */
function generateAlertForRule(
  rule: AlertRule,
  context: GenerateAlertsContext
): GeneratedAlert | null {
  switch (rule.type) {
    case 'rebalance_due':
      return generateRebalanceAlert(rule, context);
    case 'beneficiary_review':
      return generateBeneficiaryAlert(rule);
    case 'annual_review':
      return generateAnnualReviewAlert(rule);
    case 'action_reminder':
      return generateActionReminderAlert(rule);
    default:
      return null;
  }
}

function generateRebalanceAlert(
  rule: AlertRule,
  context: GenerateAlertsContext
): GeneratedAlert {
  const rebalanceCheck = checkRebalanceNeeded(context.ips);

  // Determine urgency based on whether rebalancing is actually needed
  let urgency: AlertUrgencyLevel = 'info';
  if (rebalanceCheck.needsRebalance) {
    urgency = rebalanceCheck.maxDeviation > 10 ? 'urgent' : 'warning';
  }

  const title = rule.customTitle || 'Portfolio Rebalance Due';
  let message = rule.customMessage || "It's time to review your portfolio allocation.";

  if (rebalanceCheck.needsRebalance) {
    message = `Your portfolio has ${rebalanceCheck.assetClassesOutOfBalance.length} asset class(es) outside your target range. Maximum deviation: ${rebalanceCheck.maxDeviation}%.`;
  }

  return {
    type: 'rebalance_due',
    title,
    message,
    urgency,
    frequency: rule.frequency,
  };
}

function generateBeneficiaryAlert(rule: AlertRule): GeneratedAlert {
  return {
    type: 'beneficiary_review',
    title: rule.customTitle || 'Beneficiary Review Due',
    message:
      rule.customMessage ||
      "Review your account beneficiaries to ensure they're up to date with your current wishes.",
    urgency: 'info',
    frequency: rule.frequency,
  };
}

function generateAnnualReviewAlert(rule: AlertRule): GeneratedAlert {
  return {
    type: 'annual_review',
    title: rule.customTitle || 'Annual Financial Review Due',
    message:
      rule.customMessage ||
      'Schedule your annual financial review to assess your progress and update your plan.',
    urgency: 'warning',
    frequency: rule.frequency,
  };
}

function generateActionReminderAlert(rule: AlertRule): GeneratedAlert {
  return {
    type: 'action_reminder',
    title: rule.customTitle || 'Action Reminder',
    message: rule.customMessage || 'You have an action item that needs attention.',
    urgency: 'info',
    frequency: rule.frequency,
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Calculate the next trigger date based on frequency
 */
export function calculateNextTriggerDate(
  frequency: AlertFrequency,
  fromDate: Date = new Date()
): Date {
  const next = new Date(fromDate);

  switch (frequency) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'semi_annually':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/**
 * Get the number of days until an alert is due
 */
export function getDaysUntilDue(dueDate: string | undefined): number | null {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Determine urgency based on days until due
 */
export function getUrgencyFromDueDate(dueDate: string | undefined): AlertUrgencyLevel {
  const daysUntil = getDaysUntilDue(dueDate);

  if (daysUntil === null) return 'info';
  if (daysUntil <= 0) return 'urgent';
  if (daysUntil <= 7) return 'warning';
  return 'info';
}
