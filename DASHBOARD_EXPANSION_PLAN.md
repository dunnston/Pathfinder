# Pathfinder Dashboard Expansion Plan

## Overview

Expand Pathfinder from a financial profile builder into a comprehensive financial dashboard with task tracking, notifications, Investment Policy Statement (IPS), and settings management.

---

## Plan Maintenance Instructions

**To update this plan as work is completed:**
1. Change `- [ ]` to `- [x]` for completed items
2. Add completion date in parentheses if desired: `- [x] Task (completed 2026-01-28)`
3. Run `npm run typecheck` and `npm run lint` after each phase to verify
4. Test manually in browser before marking a phase complete

---

## Features Summary

| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | Central hub showing progress, alerts, and quick actions |
| **Task Tracking** | Track recommendations as not started/in progress/completed |
| **Notifications/Alerts** | Time-based reminders for rebalancing, reviews, action items |
| **IPS Section** | Manage accounts, target allocations, and rebalancing |
| **Settings** | Configure notification and rebalance frequencies |

---

## Phase 1: Foundation - Types & Store ✅ COMPLETE

### 1.1 Create Dashboard Types
**File:** `src/types/dashboard.ts`

- [x] Create `TaskStatus` type: `'not_started' | 'in_progress' | 'completed' | 'dismissed'`
- [x] Create `TrackedTask` interface with: id, actionId, status, startedAt, completedAt, notes
- [x] Create `AlertType` type: `'rebalance_due' | 'beneficiary_review' | 'annual_review' | 'action_reminder'`
- [x] Create `AlertFrequency` type: `'monthly' | 'quarterly' | 'semi_annually' | 'annually'`
- [x] Create `Alert` interface with: id, type, title, message, urgency, dueDate, acknowledgedAt, completedAt, frequency, nextTriggerAt
- [x] Create `AssetClass` type (us_large_cap, us_mid_cap, us_small_cap, international_developed, emerging_markets, us_bonds, international_bonds, tips, real_estate, cash, other)
- [x] Create `IPSAccount` interface with: id, name, accountType, custodian, currentBalance, asOfDate, holdings
- [x] Create `IPSHolding` interface with: id, name, assetClass, currentValue
- [x] Create `TargetAllocation` interface with: assetClass, targetPercentage
- [x] Create `InvestmentPolicyStatement` interface with: accounts, targetAllocations, rebalanceThreshold, rebalanceFrequency, lastRebalanceDate
- [x] Create `DashboardSettings` interface with: rebalanceFrequency, beneficiaryReviewFrequency, actionReminderDays, showCompletedTasks
- [x] Export all types from `src/types/index.ts`

### 1.2 Create Dashboard Store
**File:** `src/stores/dashboardStore.ts`

- [x] Create store with encrypted persistence (match profileStore pattern)
- [x] Add state: trackedTasks, alerts, alertRules, investmentPolicy, settings
- [x] Add task actions: updateTaskStatus, startTask, completeTask, dismissTask, getTaskByActionId
- [x] Add alert actions: addAlert, acknowledgeAlert, dismissAlert, completeAlert, checkAndTriggerAlerts
- [x] Add IPS actions: setInvestmentPolicy, addIPSAccount, updateIPSAccount, removeIPSAccount, updateTargetAllocations, calculateRebalanceRecommendations, recordRebalance
- [x] Add settings actions: updateSettings
- [x] Export store from `src/stores/index.ts`

### 1.3 Update Routes
**File:** `src/App.tsx`

- [x] Add route: `/consumer/dashboard` → Dashboard
- [x] Add route: `/consumer/dashboard/recommendations` → RecommendationsPage
- [x] Add route: `/consumer/dashboard/focus-areas` → FocusAreasPage
- [x] Add route: `/consumer/dashboard/ips` → IPSPage
- [x] Add route: `/consumer/dashboard/ips/accounts` → IPSAccountsPage
- [x] Add route: `/consumer/dashboard/ips/rebalance` → RebalancePage
- [x] Add route: `/consumer/dashboard/settings` → SettingsPage
- [x] Add lazy imports for all new pages

---

## Phase 2: Dashboard Layout & Navigation ✅ COMPLETE

### 2.1 Dashboard Layout Component
**File:** `src/components/layout/DashboardLayout.tsx`

- [x] Create DashboardLayout wrapper component
- [x] Add sidebar navigation for dashboard sections
- [x] Implement responsive design (collapsible on mobile)
- [x] Add section header with current section title

### 2.2 Dashboard Navigation
**File:** `src/components/dashboard/DashboardNav.tsx`

- [x] Create DashboardNav component
- [x] Add nav item: Overview (home icon)
- [x] Add nav item: My Profile (link to /consumer/profile)
- [x] Add nav item: Focus Areas
- [x] Add nav item: Recommendations (with pending count badge)
- [x] Add nav item: Investment Policy
- [x] Add nav item: Settings
- [x] Highlight active section based on route
- [x] Export from `src/components/dashboard/index.ts`

---

## Phase 3: Overview Page ✅ COMPLETE

### 3.1 Dashboard Overview
**File:** `src/pages/consumer/dashboard/DashboardOverview.tsx`

- [x] Create DashboardOverview page component
- [x] Add Progress Card showing profile completion % and discovery sections status
- [x] Add Active Alerts Card showing urgent items needing attention
- [x] Add Top Recommendations Card showing top 3 actions by urgency
- [x] Add Quick Actions section with links to common tasks
- [x] Connect to profileStore for completion data
- [x] Connect to dashboardStore for alerts and tasks

### 3.2 Overview Card Component
**File:** `src/components/dashboard/OverviewCard.tsx`

- [x] Create reusable OverviewCard component
- [x] Props: title, icon, children, action (optional link)
- [x] Consistent styling with existing card patterns
- [x] Added StatCard component (bonus)
- [x] Added AlertCard component (bonus)

---

## Phase 4: Task Tracking (Recommendations) ✅ COMPLETE

### 4.1 Recommendations Page
**File:** `src/pages/consumer/dashboard/RecommendationsPage.tsx`

- [x] Create RecommendationsPage component
- [x] Add three tabs/columns: Not Started | In Progress | Completed
- [x] Add filter by domain dropdown
- [x] Add filter by urgency dropdown
- [x] Add sort options (urgency, date, domain)
- [x] Connect to insights engine for ActionRecommendations
- [x] Connect to dashboardStore for TrackedTask status

### 4.2 Task Card Component
**File:** `src/components/dashboard/TaskCard.tsx`

- [x] Create TaskCard component
- [x] Display ActionRecommendation: title, description, rationale, urgency, domain
- [x] Show status badge (not started/in progress/completed)
- [x] Add "Start" button for not started tasks
- [x] Add "Complete" button for in progress tasks
- [x] Add "Dismiss" option
- [x] Show value and goal connections
- [x] Add notes field for completed tasks

### 4.3 Task List Component
**File:** `src/components/dashboard/TaskList.tsx`

- [x] Create TaskList component
- [x] Accept list of tasks and display as TaskCards
- [x] Handle empty state with helpful message
- [x] Export from `src/components/dashboard/index.ts`
- [x] Added TaskListHeader with filters (bonus)

---

## Phase 5: Focus Areas Section ✅ COMPLETE

### 5.1 Focus Areas Page
**File:** `src/pages/consumer/dashboard/FocusAreasPage.tsx`

- [x] Create FocusAreasPage component
- [x] Connect to insights engine for PlanningFocusRanking
- [x] Display all 9 domains ranked by priority
- [x] Highlight top 3 critical areas with visual distinction
- [x] Show importance badge (Critical/High/Moderate/Low)
- [x] Show value connections per domain
- [x] Show goal connections per domain
- [x] Show rationale for each domain's ranking
- [x] Show risk factors per domain (bonus)

---

## Phase 6: Notification/Alert System ✅ COMPLETE

### 6.1 Alert Service
**File:** `src/services/alertService.ts`

- [x] Create `calculateNextTriggerDate(frequency, lastTriggered)` function (inline in dashboardStore)
- [x] Create `checkRebalanceNeeded(ips)` function - compare current vs target allocations (completed 2026-01-28)
- [x] Create `generateScheduledAlerts(rules, ips, profile)` function (completed 2026-01-28)
- [x] Create `checkAndTriggerAlerts()` function for app load (in dashboardStore)
- [x] Add date calculation utilities for each frequency (inline in dashboardStore)
- [x] Create `getDeviationSeverity(deviation, threshold)` function (completed 2026-01-28)

**Note:** Alert service now extracted to dedicated `src/services/alertService.ts` for better separation of concerns.

### 6.2 Alerts Panel Component
**File:** `src/components/dashboard/AlertsPanel.tsx`

- [x] Create AlertsPanel component (implemented as AlertCard in OverviewCard.tsx)
- [x] List active alerts sorted by urgency (in DashboardOverview)
- [x] Show urgency indicators (info=blue, warning=yellow, urgent=red)
- [x] Export standalone AlertsPanel from `src/components/dashboard/index.ts` (completed 2026-01-28)

### 6.3 Alert Item Component
**File:** `src/components/dashboard/AlertItem.tsx`

- [x] Create AlertItem component (implemented as AlertCard in OverviewCard.tsx)
- [x] Display: title, message, due date, urgency badge
- [x] Add "Acknowledge" button
- [x] Add "Complete" button (marks done and schedules next)
- [x] Add "Dismiss" button
- [x] Export standalone AlertItem from `src/components/dashboard/index.ts` (completed 2026-01-28)

### 6.4 Toast Notifications
**File:** `src/components/common/NotificationToast.tsx`

- [x] Create NotificationToast component (completed 2026-01-28)
- [x] Build on existing uiStore.notifications infrastructure (completed 2026-01-28)
- [x] Auto-dismiss with configurable duration (completed 2026-01-28)
- [x] Support types: success, error, warning, info (completed 2026-01-28)
- [x] Position in bottom-right corner (completed 2026-01-28)
- [x] Add to App.tsx layout (completed 2026-01-28)

### 6.5 Integrate Alert Checking
**File:** `src/App.tsx` or `src/hooks/useAlertCheck.ts`

- [x] Call checkAndTriggerAlerts on app load (in DashboardOverview)
- [x] Show toast for new alerts (completed 2026-01-28)

---

## Phase 7: Investment Policy Statement (IPS) ✅ COMPLETE

**Status:** All core IPS functionality implemented. Only advanced charting (recharts library) deferred.

### 7.1 Asset Classes Data
**File:** `src/data/assetClasses.ts`

- [x] Create ASSET_CLASS_INFO with name, description, riskLevel, category for each asset class
- [x] Create ASSET_CLASS_OPTIONS array for dropdowns

### 7.2 IPS Overview Page
**File:** `src/pages/consumer/dashboard/IPSPage.tsx`

- [x] Create IPSPage component
- [x] Show portfolio summary (total value, account count)
- [x] Add current allocation bar chart
- [x] Show deviation alerts if threshold exceeded (completed 2026-01-28 - DeviationAlerts component)
- [x] Add quick links: Manage Accounts, Edit Targets, View Rebalance

### 7.3 Account Management Page
**File:** `src/pages/consumer/dashboard/IPSAccountsPage.tsx`

- [x] Create IPSAccountsPage component
- [x] List all accounts with balances
- [x] Add "Add Account" button opening AccountForm modal
- [x] Add edit/delete actions per account
- [x] Show holdings count per account

### 7.4 Account Form Component
**File:** `src/components/ips/AccountForm.tsx`

- [x] Create AccountForm component (modal)
- [x] Fields: Name (required), Account Type dropdown, Custodian, Balance, As-of Date
- [x] Reuse AccountType from financialSnapshot.ts
- [x] Validation (inline, not Zod - matches existing pattern)
- [x] Save to dashboardStore

### 7.5 Account Card Component
**File:** `src/components/ips/AccountCard.tsx`

- [x] Create AccountCard component
- [x] Display: name, type, balance, custodian, holdings count
- [x] Edit and delete action buttons
- [x] Expandable holdings section

### 7.6 Holdings Entry
**File:** `src/components/ips/HoldingForm.tsx`

- [x] Create HoldingForm component
- [x] Fields: Name, Symbol (optional), Asset Class dropdown, Value
- [ ] Auto-calculate percentage of account (deferred - displayed in list)
- [x] Add to account holdings array

### 7.7 Target Allocations Page
**File:** `src/pages/consumer/dashboard/IPSAllocationsPage.tsx`

- [x] Create IPSAllocationsPage component
- [x] Slider or input per asset class for target percentage
- [x] Show current percentage next to target
- [x] Validate total equals 100%
- [x] Save targets to dashboardStore

### 7.8 Allocation Editor Component
**File:** `src/components/ips/AllocationEditor.tsx`

- [x] Create AllocationEditor component
- [x] Render row per asset class with slider and input
- [x] Show running total
- [x] Highlight when total != 100%
- [x] Added quick presets (conservative/moderate/aggressive) (bonus)

### 7.9 Allocation Chart Component
**File:** `src/components/ips/AllocationChart.tsx`

- [x] Create AllocationChart component (simple bar chart implemented inline in IPSPage.tsx)
- [x] Pie or bar chart showing current allocation (completed 2026-01-28 - recharts library)
- [x] Option to overlay target allocation (completed 2026-01-28 - showTargetOverlay prop)
- [x] Use chart library (completed 2026-01-28 - recharts added)

### 7.10 Rebalance Service
**File:** `src/services/alertService.ts` (rebalance utilities combined with alert service)

- [x] Create `aggregateHoldings(accounts)` function - sum by asset class (in dashboardStore.calculateRebalanceRecommendations)
- [x] Create `calculateTotalPortfolioValue(accounts)` function (in dashboardStore.calculateRebalanceRecommendations)
- [x] Create `calculateRebalance(current, targets, threshold)` function - returns RebalanceRecommendation[] (in dashboardStore)
- [x] Create `getDeviationSeverity(deviation, threshold)` function (completed 2026-01-28 in alertService.ts)
- [x] Extract to dedicated service file for better separation (completed 2026-01-28 - alertService.ts)

### 7.11 Rebalance Page
**File:** `src/pages/consumer/dashboard/RebalancePage.tsx`

- [x] Create RebalancePage component
- [x] Table: Asset Class | Current % | Target % | Deviation | Action (Buy/Sell/Hold) | Amount
- [x] Highlight deviations exceeding threshold
- [x] Add "Mark Rebalanced" button
- [x] Recording rebalance: update lastRebalanceDate, clear alert, schedule next alert

### 7.12 Rebalance Table Component
**File:** `src/components/ips/RebalanceTable.tsx`

- [x] Create RebalanceTable component
- [x] Accept RebalanceRecommendation[] as prop
- [x] Color-code actions (green=buy, red=sell, gray=hold)
- [x] Show deviation as percentage and absolute amount

---

## Phase 8: Settings ✅ COMPLETE

### 8.1 Settings Page
**File:** `src/pages/consumer/dashboard/SettingsPage.tsx`

- [x] Create SettingsPage component
- [x] Section: Rebalance Settings (frequency, threshold)
- [x] Section: Notification Settings (beneficiary review frequency, action reminder days)
- [x] Section: Display Settings (show completed tasks toggle)
- [x] Connect to dashboardStore.settings
- [x] Added Danger Zone section for clearing data (bonus)

### 8.2 Frequency Selector Component
**File:** `src/components/settings/FrequencySelector.tsx`

- [x] Create FrequencySelector component (inline in SettingsPage.tsx)
- [x] Dropdown with: Monthly, Quarterly, Semi-Annually, Annually
- [x] Label and description props

### 8.3 Toggle Setting Component
**File:** `src/components/settings/ToggleSetting.tsx`

- [x] Create ToggleSetting component (inline in SettingsPage.tsx)
- [x] Label, description, and toggle switch
- [x] Accessible toggle implementation
- [x] Added NumberSetting component for numeric inputs (bonus)

---

## Phase 9: Integration & Polish ✅ COMPLETE

### 9.1 Update Consumer Home
**File:** `src/pages/consumer/ConsumerHome.tsx`

- [x] Add prominent link/button to Dashboard
- [x] Show mini alert count if alerts pending

### 9.2 Final Integration
- [x] Verify all routes work correctly (routes configured in App.tsx)
- [x] Test encrypted persistence (refresh page, data persists)
- [x] Test responsive design on mobile/tablet/desktop
- [x] Add loading states to all pages
- [x] Add error boundaries where appropriate (RouteErrorBoundary in App.tsx)
- [x] Verify accessibility (keyboard navigation, screen readers) (completed 2026-01-28 - added ARIA attributes to charts, RebalanceTable, and DeviationAlerts; ongoing monitoring recommended)

---

## Verification Checklist

### After Each Phase
- [x] Run `npm run typecheck` - no TypeScript errors (All phases)
- [x] Run `npm run lint` - no linting errors (All phases)
- [x] Manual browser testing of new features (All phases)
- [x] Test data persistence (refresh page)
- [x] Test responsive design

### End-to-End Test Flow
- [x] Complete discovery to generate insights
- [x] Navigate to dashboard
- [x] View recommendations and mark tasks as started/completed
- [x] Navigate to Focus Areas and verify ranking displays
- [x] Add IPS accounts and holdings
- [x] Set target allocations (verify 100% validation)
- [x] Verify rebalance recommendations calculate correctly
- [x] Mark rebalance complete and verify date updates
- [x] Configure alert frequencies in settings
- [x] Verify alerts trigger based on frequency
- [x] Dismiss/acknowledge alerts and verify behavior

---

## Critical Files Reference

| Existing File | Relevance |
|---------------|-----------|
| `src/types/strategyProfile.ts` | ActionRecommendation type to link tasks to |
| `src/types/financialSnapshot.ts` | AccountType to reuse for IPS |
| `src/stores/profileStore.ts` | Pattern for encrypted store |
| `src/stores/uiStore.ts` | Notification infrastructure to build on |
| `src/services/discoveryInsightsEngine.ts` | Generate insights for dashboard |
| `src/components/discovery/insights/DiscoveryInsightsPanel.tsx` | Display pattern for insights |
