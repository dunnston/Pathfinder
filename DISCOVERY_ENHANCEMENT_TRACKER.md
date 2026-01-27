# Discovery Enhancement Implementation Tracker

## Overview

This document tracks the implementation of three new interactive discovery sections:
1. **Values Discovery** - Identify top 5 core values and non-negotiables
2. **Financial Goals** - Define and prioritize financial objectives
3. **Statement of Financial Purpose** - Create a personal financial purpose statement

**Reference Documents:**
- `values_discovery.md` - Values Discovery specification
- `financial_goals.md` - Financial Goals specification
- `Financial_Purpose.md` - Statement of Financial Purpose specification

**Target Section Order (8 total):**
1. Basic Context
2. Retirement Vision
3. **Values Discovery** ← NEW
4. **Financial Goals** ← NEW
5. **Financial Purpose** ← NEW (requires 3 & 4)
6. Planning Preferences
7. Risk & Comfort
8. Financial Snapshot

**Key Decisions:**
- Purpose section enforces completion of Values + Goals
- Old `financialPurposeStatement` field removed from Retirement Vision

---

## Phase 1: Foundation (Types & Infrastructure)

### Types

| Task | File | Status | Notes |
|------|------|--------|-------|
| Create ValuesDiscovery types | `src/types/valuesDiscovery.ts` | ✅ Completed | ValueCategory, Pile, ValueCard, TradeoffResponse, etc. |
| Create FinancialGoals types | `src/types/financialGoals.ts` | ✅ Completed | GoalPriority, TimeHorizon, GoalFlexibility, etc. |
| Create FinancialPurpose types | `src/types/financialPurpose.ts` | ✅ Completed | PurposeDriver, TradeoffAxis, SoFPDraft, etc. |
| Update ProfileSection type | `src/types/profile.ts` | ✅ Completed | Add 3 new sections |
| Update DISCOVERY_SECTIONS | `src/types/discovery.ts` | ✅ Completed | Add 3 new section definitions with order and requiresSections |
| Export new types | `src/types/index.ts` | ✅ Completed | Export all new types |

### Data Files

| Task | File | Status | Notes |
|------|------|--------|-------|
| Create value cards data | `src/data/valueCards.ts` | ✅ Completed | 92 cards (10+ per 9 categories) with titles, descriptions, scenario prompts |
| Create goal cards data | `src/data/goalCards.ts` | ✅ Completed | 35 system goal cards by category |
| Create purpose templates | `src/data/purposeTemplates.ts` | ✅ Completed | SoFP templates, driver mappings, vision anchors |

### Store & Validation

| Task | File | Status | Notes |
|------|------|--------|-------|
| Update SectionDataMap | `src/stores/profileStore.ts` | ✅ Completed | Add 3 new section types |
| Add validation schemas | `src/services/validation.ts` | ✅ Completed | Zod schemas for new sections |

### Legacy Cleanup

| Task | File | Status | Notes |
|------|------|--------|-------|
| Remove financialPurposeStatement | `src/types/retirementVision.ts` | ✅ Completed | Remove old text field |
| Update RetirementVisionForm | `src/components/discovery/RetirementVisionForm.tsx` | ✅ Completed | Remove purpose statement input |
| Update validation schema | `src/services/validation.ts` | ✅ Completed | Remove purpose field from retirementVisionSchema |
| Update ProfileSummary.tsx | `src/pages/consumer/ProfileSummary.tsx` | ✅ Completed | Remove purpose statement display |
| Update ClientProfile.tsx | `src/pages/advisor/ClientProfile.tsx` | ✅ Completed | Remove purpose statement display |
| Update retirementVisionQuestions.ts | `src/data/retirementVisionQuestions.ts` | ✅ Completed | Remove question config |

**Phase 1 Completion:** ✅ 17/17 tasks - COMPLETE

---

## Phase 2: Values Discovery (MVP)

MVP includes: Step 1 (Broad Sort) → Step 3 (Top 10) → Step 4 (Top 5) → Summary

### Main Form

| Task | File | Status | Notes |
|------|------|--------|-------|
| Create main form container | `src/components/discovery/ValuesDiscoveryForm.tsx` | ✅ Completed | Wizard container with step state, intro screen |
| Add route mapping | `src/pages/consumer/DiscoverySection.tsx` | ✅ Completed | Add 'values-discovery' slug + handlers |
| Export from index | `src/components/discovery/index.ts` | ✅ Completed | Export ValuesDiscoveryForm + step components |

### Step Components

| Task | File | Status | Notes |
|------|------|--------|-------|
| Step 1: Value card sorting | `src/components/discovery/values/ValuesSortStep.tsx` | ✅ Completed | Grid with 3-pile sorting, search, filters, progress |
| Steps 3-4: Top N selection | `src/components/discovery/values/TopNSelectionStep.tsx` | ✅ Completed | Reusable for 10→5 narrowing |
| Summary screen | `src/components/discovery/values/ValuesSummary.tsx` | ✅ Completed | Top 5 + dominant category + insights |

### Derived Logic

| Task | File | Status | Notes |
|------|------|--------|-------|
| Category counting | `src/services/valuesLogic.ts` | ✅ Completed | Count categories at each phase |
| Dominant/secondary calc | `src/services/valuesLogic.ts` | ✅ Completed | With tie-breaker logic, conflict detection |

**Phase 2 Completion:** ✅ 8/8 tasks - COMPLETE

---

## Phase 3: Values Discovery (Enhanced)

Add after MVP is complete.

| Task | File | Status | Notes |
|------|------|--------|-------|
| Step 2: Unsure resolution | `src/components/discovery/values/UnsureResolutionStep.tsx` | ✅ Completed | Scenario-based prompts, one-at-a-time card resolution |
| Step 5: Tradeoff validation | `src/components/discovery/values/TradeoffValidationStep.tsx` | ✅ Completed | 3-6 category tradeoff questions based on top 5 categories |
| Step 6: Non-negotiables | `src/components/discovery/values/NonNegotiablesStep.tsx` | ✅ Completed | Select 1-3 from top 5 |
| Custom value creation | `src/components/discovery/values/CustomValueModal.tsx` | ✅ Completed | Modal for adding user-created value cards |
| Conflict flag detection | `src/services/valuesLogic.ts` | ✅ Completed | Implemented in MVP (detectConflictFlags) |
| Tradeoff scoring indices | `src/services/valuesLogic.ts` | ✅ Completed | computeTradeoffIndex for securityVsGrowth, controlVsFreedom |
| Step invalidation logic | `src/stores/profileStore.ts` | ✅ Completed | invalidateValuesDiscoveryDownstream, invalidateFinancialGoalsDownstream |

**Phase 3 Completion:** ✅ 7/7 tasks - COMPLETE

---

## Phase 4: Financial Goals (MVP)

MVP includes: Phase 1 (Free Recall) → Phase 2 (System Cards) → Phase 3 (Priority) → Phase 4 (Time Horizon) → Phase 6 (Final List)

### Main Form

| Task | File | Status | Notes |
|------|------|--------|-------|
| Create main form container | `src/components/discovery/FinancialGoalsForm.tsx` | ✅ Completed | Wizard container with phase state |
| Add route mapping | `src/pages/consumer/DiscoverySection.tsx` | ✅ Completed | Add 'financial-goals' slug |
| Export from index | `src/components/discovery/index.ts` | ✅ Completed | Export FinancialGoalsForm |

### Phase Components

| Task | File | Status | Notes |
|------|------|--------|-------|
| Phase 1: Free recall input | `src/components/discovery/goals/FreeRecallStep.tsx` | ✅ Completed | Text input loop for user goals |
| Phase 2: System goal cards | `src/components/discovery/goals/SystemGoalCards.tsx` | ✅ Completed | Select from categorized cards |
| Phase 3: Priority sorting | `src/components/discovery/goals/PrioritySortStep.tsx` | ✅ Completed | High/Medium/Low/NA buckets |
| Phase 4: Time horizons | `src/components/discovery/goals/TimeHorizonStep.tsx` | ✅ Completed | Short/Mid/Long/Ongoing |
| Phase 6: Final goals list | `src/components/discovery/goals/FinalGoalsList.tsx` | ✅ Completed | Core planning goals review |

**Phase 4 Completion:** ✅ 8/8 tasks - COMPLETE

---

## Phase 5: Financial Goals (Enhanced)

Add after MVP is complete.

| Task | File | Status | Notes |
|------|------|--------|-------|
| Phase 5: Flexibility test | `src/components/discovery/goals/FlexibilityTestStep.tsx` | ✅ Completed | Fixed/Flexible/Deferable for high priority goals |
| Pairwise conflict tradeoffs | `src/components/discovery/goals/GoalTradeoffs.tsx` | ✅ Completed | A vs B goal comparisons with generated pairs |
| isCorePlanningGoal logic | `src/services/goalsLogic.ts` | ✅ Completed | Auto-identify core goals, conflict detection, tradeoff wins |

**Phase 5 Completion:** ✅ 3/3 tasks - COMPLETE

---

## Phase 6: Statement of Financial Purpose (MVP)

MVP includes: Steps 0-6 (full wizard, no AI, no couple mode)

**Prerequisite Enforcement:** This section requires Values Discovery and Financial Goals to be completed. Users cannot access this section until both are done.

### Main Form

| Task | File | Status | Notes |
|------|------|--------|-------|
| Create main form container | `src/components/discovery/FinancialPurposeForm.tsx` | ✅ Completed | Wizard container with step state, progress indicator |
| Add route mapping | `src/pages/consumer/DiscoverySection.tsx` | ✅ Completed | Add 'financial-purpose' slug + handlers |
| Export from index | `src/components/discovery/index.ts` | ✅ Completed | Export FinancialPurposeForm + step components |

### Step Components

| Task | File | Status | Notes |
|------|------|--------|-------|
| Step 0: Intro | `src/components/discovery/purpose/PurposeIntro.tsx` | ✅ Completed | Explain purpose + example statements |
| Step 1: Confirm inputs | `src/components/discovery/purpose/ConfirmInputsStep.tsx` | ✅ Completed | Show values/goals prereqs with prerequisite check |
| Step 2: Purpose drivers | `src/components/discovery/purpose/PurposeDriversStep.tsx` | ✅ Completed | Select 1-2 drivers with preview |
| Step 3: Tradeoff anchors | `src/components/discovery/purpose/TradeoffAnchorStep.tsx` | ✅ Completed | 4 forced choice questions with strength slider |
| Step 4: Vision anchors | `src/components/discovery/purpose/VisionAnchorStep.tsx` | ✅ Completed | Pick 1-2 vision phrases + custom option |
| Step 5: Draft assembly | `src/components/discovery/purpose/DraftAssemblyStep.tsx` | ✅ Completed | Template-generated drafts with edit capability |
| Step 6: Refinement | `src/components/discovery/purpose/RefinementStep.tsx` | ✅ Completed | Reflection questions + final edit |
| Summary/display | `src/components/discovery/purpose/PurposeSummary.tsx` | ✅ Completed | Final SoFP + decision filters + usage tips |

### Template Engine

| Task | File | Status | Notes |
|------|------|--------|-------|
| Draft generator | `src/services/purposeTemplateEngine.ts` | ✅ Completed | Non-AI template rendering with validation |
| Driver phrase mappings | `src/data/purposeTemplates.ts` | ✅ Completed | Already done in Phase 1 |

### Prerequisite Enforcement

| Task | File | Status | Notes |
|------|------|--------|-------|
| Section access guard | `src/components/discovery/purpose/ConfirmInputsStep.tsx` | ✅ Completed | Block progress if Values/Goals incomplete |
| Completion status check | `src/components/discovery/purpose/ConfirmInputsStep.tsx` | ✅ Completed | Check section.state === 'COMPLETED' |

**Phase 6 Completion:** ✅ 14/14 tasks - COMPLETE

---

## Phase 7: Integration & Polish

| Task | File | Status | Notes |
|------|------|--------|-------|
| Update navigation flow order | `src/types/discovery.ts` | ✅ Completed | Sections positioned: order 3, 4, 5 |
| Cross-module data flow | Various | ✅ Completed | DiscoverySection passes valuesData/goalsData to FinancialPurposeForm |
| Profile summary display | `src/pages/consumer/ProfileSummary.tsx` | ✅ Completed | Shows Values, Goals, Purpose sections |
| Advisor mode labels | All new forms | ✅ Completed | isAdvisorMode prop on all forms/steps |
| Mobile responsive testing | All components | ⬜ Manual Test | Verify on small screens |
| Keyboard accessibility | All components | ⬜ Manual Test | Tab navigation, ARIA |
| TypeScript check | - | ✅ Completed | `npm run typecheck` passes |
| Linting check | - | ✅ Completed | `npm run lint` passes |

**Phase 7 Completion:** ✅ 6/8 tasks (2 require manual testing)

---

## Summary

| Phase | Description | Tasks | Completed |
|-------|-------------|-------|-----------|
| Phase 1 | Foundation (Types, Data, Legacy Cleanup) | 17 | 17 ✅ |
| Phase 2 | Values Discovery MVP | 8 | 8 ✅ |
| Phase 3 | Values Discovery Enhanced | 7 | 7 ✅ |
| Phase 4 | Financial Goals MVP | 8 | 8 ✅ |
| Phase 5 | Financial Goals Enhanced | 3 | 3 ✅ |
| Phase 6 | Financial Purpose MVP | 14 | 14 ✅ |
| Phase 7 | Integration & Polish | 8 | 6 ✅ |
| **Total** | | **65** | **63** |

---

## Session Log

| Date | Session | Tasks Completed | Notes |
|------|---------|-----------------|-------|
| 2026-01-27 | Phase 1 | 17 | Foundation complete: types, data, store, validation, legacy cleanup |
| 2026-01-27 | Phase 2 | 8 | Values Discovery MVP complete: ValuesDiscoveryForm, ValuesSortStep, TopNSelectionStep, ValuesSummary, valuesLogic.ts, route mapping |
| 2026-01-27 | Phase 4 | 8 | Financial Goals MVP complete: FinancialGoalsForm, FreeRecallStep, SystemGoalCards, PrioritySortStep, TimeHorizonStep, FinalGoalsList, route mapping |
| 2026-01-27 | Phase 6 | 14 | Financial Purpose MVP complete: FinancialPurposeForm, all step components (PurposeIntro, ConfirmInputsStep, PurposeDriversStep, TradeoffAnchorStep, VisionAnchorStep, DraftAssemblyStep, RefinementStep, PurposeSummary), purposeTemplateEngine.ts, route mapping |
| 2026-01-27 | Phase 7 | 6 | Integration & Polish: ProfileSummary displays Values/Goals/Purpose sections, display helpers added, navigation flow order confirmed, cross-module data flow verified, advisor mode labels in place, typecheck/lint passing |
| 2026-01-27 | Phase 3 & 5 | 4 | Enhanced steps: TradeoffValidationStep (3-6 scenario questions), NonNegotiablesStep (select 1-3 from top 5), computeTradeoffIndex in valuesLogic.ts, FlexibilityTestStep (Fixed/Flexible/Deferable for high priority goals), updated ValuesDiscoveryForm and FinancialGoalsForm with new steps |
| 2026-01-27 | Phase 3 & 5 Complete | 5 | Final enhanced features: UnsureResolutionStep (scenario-based prompts), CustomValueModal (user-created cards), goalsLogic.ts (isCorePlanningGoal, conflict detection), GoalTradeoffs (A vs B comparisons), step invalidation logic in profileStore.ts |

---

## Legend

- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- ⏸️ Blocked

---

*Last Updated: January 2026*
