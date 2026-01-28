/**
 * Dashboard Store
 * Manages dashboard state including tasks, alerts, IPS, and settings
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DashboardState,
  TrackedTask,
  TaskStatus,
  Alert,
  AlertRule,
  AlertType,
  AlertFrequency,
  InvestmentPolicyStatement,
  IPSAccount,
  IPSHolding,
  TargetAllocation,
  DashboardSettings,
  RebalanceRecommendation,
  AssetClass,
} from '@/types/dashboard';
import { DEFAULT_DASHBOARD_SETTINGS, DEFAULT_REBALANCE_THRESHOLD } from '@/types/dashboard';
import { createEncryptedStorage } from '@/services/encryption';
import { sanitizeObject } from '@/services/sanitization';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Generate a cryptographically secure unique ID */
function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/** Get current ISO timestamp */
function now(): string {
  return new Date().toISOString();
}

// ============================================================
// STORE INTERFACE
// ============================================================

interface DashboardActions {
  // Task actions
  /** Get task by action ID */
  getTaskByActionId: (actionId: string) => TrackedTask | undefined;
  /** Update task status */
  updateTaskStatus: (taskId: string, status: TaskStatus, notes?: string) => void;
  /** Start a task (create if doesn't exist, set to in_progress) */
  startTask: (actionId: string) => void;
  /** Complete a task */
  completeTask: (taskId: string, notes?: string) => void;
  /** Dismiss a task */
  dismissTask: (taskId: string) => void;
  /** Reset a task to not_started */
  resetTask: (taskId: string) => void;

  // Alert actions
  /** Add a new alert */
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => string;
  /** Acknowledge an alert */
  acknowledgeAlert: (alertId: string) => void;
  /** Dismiss an alert (remove it) */
  dismissAlert: (alertId: string) => void;
  /** Complete an alert and schedule next if recurring */
  completeAlert: (alertId: string) => void;
  /** Check and trigger alerts based on rules */
  checkAndTriggerAlerts: () => void;
  /** Update an alert rule */
  updateAlertRule: (ruleId: string, updates: Partial<AlertRule>) => void;

  // IPS actions
  /** Set the entire investment policy */
  setInvestmentPolicy: (policy: InvestmentPolicyStatement) => void;
  /** Add an IPS account */
  addIPSAccount: (account: Omit<IPSAccount, 'id'>) => string;
  /** Update an IPS account */
  updateIPSAccount: (accountId: string, updates: Partial<Omit<IPSAccount, 'id'>>) => void;
  /** Remove an IPS account */
  removeIPSAccount: (accountId: string) => void;
  /** Add a holding to an account */
  addHolding: (accountId: string, holding: Omit<IPSHolding, 'id'>) => string;
  /** Update a holding */
  updateHolding: (accountId: string, holdingId: string, updates: Partial<Omit<IPSHolding, 'id'>>) => void;
  /** Remove a holding */
  removeHolding: (accountId: string, holdingId: string) => void;
  /** Update target allocations */
  updateTargetAllocations: (allocations: TargetAllocation[]) => void;
  /** Update rebalance threshold */
  updateRebalanceThreshold: (threshold: number) => void;
  /** Calculate rebalance recommendations */
  calculateRebalanceRecommendations: () => RebalanceRecommendation[];
  /** Record that rebalancing was done */
  recordRebalance: () => void;

  // Settings actions
  /** Update dashboard settings */
  updateSettings: (settings: Partial<DashboardSettings>) => void;

  // Utility actions
  /** Clear all dashboard data */
  clearDashboard: () => void;
  /** Check if store has hydrated */
  hasHydrated: () => boolean;
}

type DashboardStore = DashboardState & DashboardActions & {
  _hasHydrated: boolean;
};

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: DashboardState & { _hasHydrated: boolean } = {
  trackedTasks: [],
  alerts: [],
  alertRules: [
    {
      id: 'rule_rebalance',
      type: 'rebalance_due',
      enabled: true,
      frequency: 'quarterly',
    },
    {
      id: 'rule_beneficiary',
      type: 'beneficiary_review',
      enabled: true,
      frequency: 'annually',
    },
    {
      id: 'rule_annual_review',
      type: 'annual_review',
      enabled: true,
      frequency: 'annually',
    },
  ],
  investmentPolicy: null,
  settings: DEFAULT_DASHBOARD_SETTINGS,
  _hasHydrated: false,
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --------------------------------------------------------
      // Task Actions
      // --------------------------------------------------------

      getTaskByActionId: (actionId) => {
        return get().trackedTasks.find((t) => t.actionId === actionId);
      },

      updateTaskStatus: (taskId, status, notes) =>
        set((state) => {
          const taskIndex = state.trackedTasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;

          const task = state.trackedTasks[taskIndex];
          const updates: Partial<TrackedTask> = { status };

          if (status === 'in_progress' && !task.startedAt) {
            updates.startedAt = now();
          }
          if (status === 'completed') {
            updates.completedAt = now();
          }
          if (status === 'dismissed') {
            updates.dismissedAt = now();
          }
          if (notes !== undefined) {
            updates.notes = notes;
          }

          const updatedTasks = [...state.trackedTasks];
          updatedTasks[taskIndex] = { ...task, ...updates };

          return { trackedTasks: updatedTasks };
        }),

      startTask: (actionId) =>
        set((state) => {
          const existing = state.trackedTasks.find((t) => t.actionId === actionId);

          if (existing) {
            // Update existing task
            const taskIndex = state.trackedTasks.findIndex((t) => t.id === existing.id);
            const updatedTasks = [...state.trackedTasks];
            updatedTasks[taskIndex] = {
              ...existing,
              status: 'in_progress',
              startedAt: existing.startedAt || now(),
            };
            return { trackedTasks: updatedTasks };
          }

          // Create new task
          const newTask: TrackedTask = {
            id: generateId('task'),
            actionId,
            status: 'in_progress',
            startedAt: now(),
          };

          return { trackedTasks: [...state.trackedTasks, newTask] };
        }),

      completeTask: (taskId, notes) => {
        get().updateTaskStatus(taskId, 'completed', notes);
      },

      dismissTask: (taskId) => {
        get().updateTaskStatus(taskId, 'dismissed');
      },

      resetTask: (taskId) =>
        set((state) => {
          const taskIndex = state.trackedTasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;

          const updatedTasks = [...state.trackedTasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            status: 'not_started',
            startedAt: undefined,
            completedAt: undefined,
            dismissedAt: undefined,
          };

          return { trackedTasks: updatedTasks };
        }),

      // --------------------------------------------------------
      // Alert Actions
      // --------------------------------------------------------

      addAlert: (alertData) => {
        const id = generateId('alert');
        const sanitized = sanitizeObject(alertData);

        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...sanitized,
              id,
              createdAt: now(),
            } as Alert,
          ],
        }));

        return id;
      },

      acknowledgeAlert: (alertId) =>
        set((state) => {
          const alertIndex = state.alerts.findIndex((a) => a.id === alertId);
          if (alertIndex === -1) return state;

          const updatedAlerts = [...state.alerts];
          updatedAlerts[alertIndex] = {
            ...updatedAlerts[alertIndex],
            acknowledgedAt: now(),
          };

          return { alerts: updatedAlerts };
        }),

      dismissAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        })),

      completeAlert: (alertId) =>
        set((state) => {
          const alert = state.alerts.find((a) => a.id === alertId);
          if (!alert) return state;

          // Mark as completed
          const alertIndex = state.alerts.findIndex((a) => a.id === alertId);
          const updatedAlerts = [...state.alerts];
          updatedAlerts[alertIndex] = {
            ...alert,
            completedAt: now(),
          };

          // If recurring, update the associated rule
          if (alert.frequency) {
            const ruleIndex = state.alertRules.findIndex((r) => r.type === alert.type);
            if (ruleIndex !== -1) {
              const updatedRules = [...state.alertRules];
              updatedRules[ruleIndex] = {
                ...updatedRules[ruleIndex],
                lastTriggeredAt: now(),
              };
              return { alerts: updatedAlerts, alertRules: updatedRules };
            }
          }

          return { alerts: updatedAlerts };
        }),

      checkAndTriggerAlerts: () => {
        const state = get();
        const nowDate = new Date();
        const newAlerts: Omit<Alert, 'id' | 'createdAt'>[] = [];

        state.alertRules.forEach((rule) => {
          if (!rule.enabled) return;

          const lastTriggered = rule.lastTriggeredAt
            ? new Date(rule.lastTriggeredAt)
            : null;

          // Calculate if we should trigger based on frequency
          let shouldTrigger = false;
          if (!lastTriggered) {
            shouldTrigger = true;
          } else {
            const monthsSinceLastTrigger =
              (nowDate.getTime() - lastTriggered.getTime()) / (1000 * 60 * 60 * 24 * 30);

            switch (rule.frequency) {
              case 'monthly':
                shouldTrigger = monthsSinceLastTrigger >= 1;
                break;
              case 'quarterly':
                shouldTrigger = monthsSinceLastTrigger >= 3;
                break;
              case 'semi_annually':
                shouldTrigger = monthsSinceLastTrigger >= 6;
                break;
              case 'annually':
                shouldTrigger = monthsSinceLastTrigger >= 12;
                break;
            }
          }

          // Check if there's already an active alert of this type
          const hasActiveAlert = state.alerts.some(
            (a) => a.type === rule.type && !a.completedAt
          );

          if (shouldTrigger && !hasActiveAlert) {
            newAlerts.push({
              type: rule.type,
              title: rule.customTitle || getDefaultAlertTitle(rule.type),
              message: rule.customMessage || getDefaultAlertMessage(rule.type),
              urgency: 'warning',
              frequency: rule.frequency,
            });
          }
        });

        // Add all new alerts
        newAlerts.forEach((alert) => {
          get().addAlert(alert);
        });

        // Update lastTriggeredAt for rules that triggered
        if (newAlerts.length > 0) {
          set((state) => {
            const updatedRules = state.alertRules.map((rule) => {
              const triggered = newAlerts.some((a) => a.type === rule.type);
              if (triggered) {
                return { ...rule, lastTriggeredAt: now() };
              }
              return rule;
            });
            return { alertRules: updatedRules };
          });
        }
      },

      updateAlertRule: (ruleId, updates) =>
        set((state) => {
          const ruleIndex = state.alertRules.findIndex((r) => r.id === ruleId);
          if (ruleIndex === -1) return state;

          const sanitized = sanitizeObject(updates);
          const updatedRules = [...state.alertRules];
          updatedRules[ruleIndex] = { ...updatedRules[ruleIndex], ...sanitized };

          return { alertRules: updatedRules };
        }),

      // --------------------------------------------------------
      // IPS Actions
      // --------------------------------------------------------

      setInvestmentPolicy: (policy) =>
        set({
          investmentPolicy: sanitizeObject({
            ...policy,
            updatedAt: now(),
          }),
        }),

      addIPSAccount: (accountData) => {
        const id = generateId('account');
        const sanitized = sanitizeObject(accountData);

        set((state) => {
          const currentPolicy = state.investmentPolicy || {
            accounts: [],
            targetAllocations: [],
            rebalanceThreshold: DEFAULT_REBALANCE_THRESHOLD,
            rebalanceFrequency: 'quarterly' as AlertFrequency,
            updatedAt: now(),
          };

          return {
            investmentPolicy: {
              ...currentPolicy,
              accounts: [
                ...currentPolicy.accounts,
                { ...sanitized, id, holdings: sanitized.holdings || [] } as IPSAccount,
              ],
              updatedAt: now(),
            },
          };
        });

        return id;
      },

      updateIPSAccount: (accountId, updates) =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          const accountIndex = state.investmentPolicy.accounts.findIndex(
            (a) => a.id === accountId
          );
          if (accountIndex === -1) return state;

          const sanitized = sanitizeObject(updates);
          const updatedAccounts = [...state.investmentPolicy.accounts];
          updatedAccounts[accountIndex] = {
            ...updatedAccounts[accountIndex],
            ...sanitized,
          };

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              accounts: updatedAccounts,
              updatedAt: now(),
            },
          };
        }),

      removeIPSAccount: (accountId) =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              accounts: state.investmentPolicy.accounts.filter((a) => a.id !== accountId),
              updatedAt: now(),
            },
          };
        }),

      addHolding: (accountId, holdingData) => {
        const id = generateId('holding');
        const sanitized = sanitizeObject(holdingData);

        set((state) => {
          if (!state.investmentPolicy) return state;

          const accountIndex = state.investmentPolicy.accounts.findIndex(
            (a) => a.id === accountId
          );
          if (accountIndex === -1) return state;

          const updatedAccounts = [...state.investmentPolicy.accounts];
          updatedAccounts[accountIndex] = {
            ...updatedAccounts[accountIndex],
            holdings: [
              ...updatedAccounts[accountIndex].holdings,
              { ...sanitized, id } as IPSHolding,
            ],
          };

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              accounts: updatedAccounts,
              updatedAt: now(),
            },
          };
        });

        return id;
      },

      updateHolding: (accountId, holdingId, updates) =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          const accountIndex = state.investmentPolicy.accounts.findIndex(
            (a) => a.id === accountId
          );
          if (accountIndex === -1) return state;

          const holdingIndex = state.investmentPolicy.accounts[accountIndex].holdings.findIndex(
            (h) => h.id === holdingId
          );
          if (holdingIndex === -1) return state;

          const sanitized = sanitizeObject(updates);
          const updatedAccounts = [...state.investmentPolicy.accounts];
          const updatedHoldings = [...updatedAccounts[accountIndex].holdings];
          updatedHoldings[holdingIndex] = {
            ...updatedHoldings[holdingIndex],
            ...sanitized,
          };
          updatedAccounts[accountIndex] = {
            ...updatedAccounts[accountIndex],
            holdings: updatedHoldings,
          };

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              accounts: updatedAccounts,
              updatedAt: now(),
            },
          };
        }),

      removeHolding: (accountId, holdingId) =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          const accountIndex = state.investmentPolicy.accounts.findIndex(
            (a) => a.id === accountId
          );
          if (accountIndex === -1) return state;

          const updatedAccounts = [...state.investmentPolicy.accounts];
          updatedAccounts[accountIndex] = {
            ...updatedAccounts[accountIndex],
            holdings: updatedAccounts[accountIndex].holdings.filter(
              (h) => h.id !== holdingId
            ),
          };

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              accounts: updatedAccounts,
              updatedAt: now(),
            },
          };
        }),

      updateTargetAllocations: (allocations) =>
        set((state) => {
          const sanitized = sanitizeObject(allocations);
          const currentPolicy = state.investmentPolicy || {
            accounts: [],
            targetAllocations: [],
            rebalanceThreshold: DEFAULT_REBALANCE_THRESHOLD,
            rebalanceFrequency: 'quarterly' as AlertFrequency,
            updatedAt: now(),
          };

          return {
            investmentPolicy: {
              ...currentPolicy,
              targetAllocations: sanitized,
              updatedAt: now(),
            },
          };
        }),

      updateRebalanceThreshold: (threshold) =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              rebalanceThreshold: threshold,
              updatedAt: now(),
            },
          };
        }),

      calculateRebalanceRecommendations: () => {
        const state = get();
        if (!state.investmentPolicy) return [];

        const { accounts, targetAllocations, rebalanceThreshold } = state.investmentPolicy;

        // Calculate total portfolio value
        const totalValue = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
        if (totalValue === 0) return [];

        // Aggregate holdings by asset class
        const currentByAssetClass = new Map<AssetClass, number>();
        accounts.forEach((account) => {
          account.holdings.forEach((holding) => {
            const current = currentByAssetClass.get(holding.assetClass) || 0;
            currentByAssetClass.set(holding.assetClass, current + holding.currentValue);
          });
        });

        // Calculate recommendations
        const recommendations: RebalanceRecommendation[] = targetAllocations.map((target) => {
          const currentValue = currentByAssetClass.get(target.assetClass) || 0;
          const currentPercentage = (currentValue / totalValue) * 100;
          const deviation = currentPercentage - target.targetPercentage;
          const deviationAmount = (deviation / 100) * totalValue;

          let action: 'buy' | 'sell' | 'hold' = 'hold';
          let actionAmount = 0;

          if (Math.abs(deviation) > rebalanceThreshold) {
            if (deviation > 0) {
              action = 'sell';
              actionAmount = Math.abs(deviationAmount);
            } else {
              action = 'buy';
              actionAmount = Math.abs(deviationAmount);
            }
          }

          return {
            assetClass: target.assetClass,
            currentPercentage: Math.round(currentPercentage * 100) / 100,
            targetPercentage: target.targetPercentage,
            deviation: Math.round(deviation * 100) / 100,
            deviationAmount: Math.round(deviationAmount * 100) / 100,
            action,
            actionAmount: Math.round(actionAmount * 100) / 100,
          };
        });

        return recommendations;
      },

      recordRebalance: () =>
        set((state) => {
          if (!state.investmentPolicy) return state;

          // Complete any active rebalance alerts
          const updatedAlerts = state.alerts.map((alert) => {
            if (alert.type === 'rebalance_due' && !alert.completedAt) {
              return { ...alert, completedAt: now() };
            }
            return alert;
          });

          return {
            investmentPolicy: {
              ...state.investmentPolicy,
              lastRebalanceDate: now(),
              updatedAt: now(),
            },
            alerts: updatedAlerts,
          };
        }),

      // --------------------------------------------------------
      // Settings Actions
      // --------------------------------------------------------

      updateSettings: (settingsUpdate) =>
        set((state) => {
          const sanitized = sanitizeObject(settingsUpdate);
          const newSettings = {
            ...state.settings,
            ...sanitized,
          };

          // Sync settings frequencies to alert rules
          const updatedRules = state.alertRules.map((rule) => {
            if (rule.type === 'rebalance_due' && sanitized.rebalanceFrequency) {
              return { ...rule, frequency: sanitized.rebalanceFrequency };
            }
            if (rule.type === 'beneficiary_review' && sanitized.beneficiaryReviewFrequency) {
              return { ...rule, frequency: sanitized.beneficiaryReviewFrequency };
            }
            return rule;
          });

          return {
            settings: newSettings,
            alertRules: updatedRules,
          };
        }),

      // --------------------------------------------------------
      // Utility Actions
      // --------------------------------------------------------

      clearDashboard: () => set(initialState),

      hasHydrated: () => get()._hasHydrated,
    }),
    {
      name: 'pathfinder-dashboard',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
      // SEC-1: Use encrypted storage for sensitive financial data
      storage: {
        getItem: async (name) => {
          const encryptedStorage = createEncryptedStorage();
          const str = await encryptedStorage.getItem(name);
          if (!str) return null;

          try {
            const data = JSON.parse(str);
            return data;
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          const encryptedStorage = createEncryptedStorage();
          await encryptedStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          const encryptedStorage = createEncryptedStorage();
          encryptedStorage.removeItem(name);
        },
      },
    }
  )
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getDefaultAlertTitle(type: AlertType): string {
  switch (type) {
    case 'rebalance_due':
      return 'Portfolio Rebalance Due';
    case 'beneficiary_review':
      return 'Beneficiary Review Due';
    case 'annual_review':
      return 'Annual Financial Review Due';
    case 'action_reminder':
      return 'Action Reminder';
    default:
      return 'Alert';
  }
}

function getDefaultAlertMessage(type: AlertType): string {
  switch (type) {
    case 'rebalance_due':
      return 'It\'s time to review your portfolio allocation and rebalance if needed.';
    case 'beneficiary_review':
      return 'Review your account beneficiaries to ensure they\'re up to date.';
    case 'annual_review':
      return 'Schedule your annual financial review to assess your progress and update your plan.';
    case 'action_reminder':
      return 'You have an action item that needs attention.';
    default:
      return 'You have a pending alert.';
  }
}
