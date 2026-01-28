# Suggestions Engine Implementation Plan

> **Status:** COMPLETE
> **Started:** January 2026
> **Completed:** January 28, 2026
> **Phase 1 Progress:** COMPLETE (6/6 tasks)
> **Phase 2 Progress:** COMPLETE (9/9 tasks)
> **Phase 3 Progress:** COMPLETE (7/7 tasks)
> **Phase 4 Progress:** COMPLETE (4/4 tasks)
> **Phase 5 Progress:** COMPLETE (4/4 tasks)
> **Phase 6 Progress:** COMPLETE (4/4 tasks)

## Overview

Transform the current auto-generated recommendations system into a **Guided Suggestions Engine** where:
- Software asks guided questions based on user profile
- Users perform analysis externally (calculators, advisors, tools)
- Users input answers; software generates contextual suggestions
- Users/advisors create the actual plan from accepted suggestions + custom items

---

## Key Design Decisions

1. **Domain Architecture**: 8 new suggestion domains exist **alongside** existing 9 planning domains
2. **Workflow Freedom**: Users can explore domains in **any order**
3. **Filtering Behavior**: Irrelevant domains are **dimmed but accessible**

---

## Implementation Phases

### Phase 1: Foundation

| Task | Status | File(s) |
|------|--------|---------|
| Create suggestions type definitions | Complete | `src/types/suggestions.ts` |
| Export types from index | Complete | `src/types/index.ts` |
| Create suggestions store | Complete | `src/stores/suggestionsStore.ts` |
| Create domain metadata | Complete | `src/data/suggestions/domains.ts` |
| Create filter service | Complete | `src/services/suggestionsFilter.ts` |
| Add routes in App.tsx | Complete | `src/App.tsx` |
| Create placeholder pages | Complete | `src/pages/consumer/dashboard/Suggestions*.tsx`, `PlanBuilderPage.tsx` |

### Phase 2: Questions Data

| Task | Status | File(s) |
|------|--------|---------|
| Investments questions (6 questions) | Complete | `src/data/suggestions/investmentsQuestions.ts` |
| Savings questions (7 questions) | Complete | `src/data/suggestions/savingsQuestions.ts` |
| Annuities questions (4 questions) | Complete | `src/data/suggestions/annuitiesQuestions.ts` |
| Income Plan questions (3 questions) | Complete | `src/data/suggestions/incomePlanQuestions.ts` |
| Taxes questions (4 questions) | Complete | `src/data/suggestions/taxesQuestions.ts` |
| Estate Plan questions (5 questions) | Complete | `src/data/suggestions/estatePlanQuestions.ts` |
| Insurance questions (5 questions) | Complete | `src/data/suggestions/insuranceQuestions.ts` |
| Employee Benefits questions (6 questions) | Complete | `src/data/suggestions/employeeBenefitsQuestions.ts` |
| Questions barrel export | Complete | `src/data/suggestions/index.ts` |

### Phase 3: Core Components

| Task | Status | File(s) |
|------|--------|---------|
| DomainExplorer component | Complete | `src/components/suggestions/DomainExplorer.tsx` |
| DomainCard component | Complete | `src/components/suggestions/DomainCard.tsx` |
| GuidedQuestionFlow component | Complete | `src/components/suggestions/GuidedQuestionFlow.tsx` |
| QuestionCard component | Complete | `src/components/suggestions/QuestionCard.tsx` |
| Components barrel export | Complete | `src/components/suggestions/index.ts` |
| Update SuggestionsOverviewPage | Complete | `src/pages/consumer/dashboard/SuggestionsOverviewPage.tsx` |
| Update DomainExplorationPage | Complete | `src/pages/consumer/dashboard/DomainExplorationPage.tsx` |

### Phase 4: Suggestion Generation

| Task | Status | File(s) |
|------|--------|---------|
| Suggestion templates (~50 templates) | Complete | `src/data/suggestions/suggestionTemplates.ts` |
| Suggestions engine service | Complete | `src/services/suggestionsEngine.ts` |
| SuggestionsList component | Complete | `src/components/suggestions/SuggestionsList.tsx` |
| SuggestionCard component | Complete | `src/components/suggestions/SuggestionCard.tsx` |

### Phase 5: Plan Building

| Task | Status | File(s) |
|------|--------|---------|
| CustomRecommendationForm component | Complete | `src/components/suggestions/CustomRecommendationForm.tsx` |
| PlanBuilder component | Complete | `src/components/suggestions/PlanBuilder.tsx` |
| PlanItemCard component | Complete | `src/components/suggestions/PlanItemCard.tsx` |
| PlanBuilderPage update | Complete | `src/pages/consumer/dashboard/PlanBuilderPage.tsx` |

### Phase 6: Navigation & Polish

| Task | Status | File(s) |
|------|--------|---------|
| Update DashboardNav with suggestions link | Complete | `src/components/dashboard/DashboardNav.tsx` |
| Export suggestionsStore from stores index | Complete | `src/stores/index.ts` |
| TypeScript compiles | Complete | `npm run typecheck` |
| Linting passes | Complete | `npm run lint` |

---

## 8 Suggestion Domains

| # | Domain | Key Questions |
|---|--------|--------------|
| 1 | **Investments** | Risk alignment, diversification, overlap, fund selection, costs, cash levels |
| 2 | **Savings** | Retirement needs, expenses, coverage, current savings, annual savings, account types, emergency fund |
| 3 | **Annuities** | MYGAs, FIAs, RILAs, income annuities |
| 4 | **Income Plan** | Bucket strategy, income policy statement |
| 5 | **Taxes** | Roth conversion, over/under paying, capital gains |
| 6 | **Estate Plan** | Trust needs, will, medical directive, power of attorney |
| 7 | **Insurance** | Health, LTC, life, pension max, disability |
| 8 | **Employee Benefits** | 401k match, portable life insurance, FEGLI, survivor benefits, pension timing |

---

## Profile-Based Filtering

| Profile Field | Filters |
|---------------|---------|
| `federalEmployee` | EMPLOYEE_BENEFITS domain, FEGLI questions |
| `maritalStatus` | Spouse questions in INSURANCE, ESTATE_PLAN |
| `dependents` | Life insurance needs, estate planning |
| `birthDate` (age) | Near retirement questions, annuity relevance |
| `investmentAccounts` | Account type questions, Roth conversion |
| `riskTolerance` | Investment alignment questions |

---

## Files Created

### Types & Store
- [x] `src/types/suggestions.ts` - Comprehensive type definitions
- [x] `src/stores/suggestionsStore.ts` - State management with encrypted persistence

### Data
- [x] `src/data/suggestions/domains.ts` - Domain metadata
- [x] `src/data/suggestions/investmentsQuestions.ts` - 6 questions
- [x] `src/data/suggestions/savingsQuestions.ts` - 7 questions
- [x] `src/data/suggestions/annuitiesQuestions.ts` - 4 questions
- [x] `src/data/suggestions/incomePlanQuestions.ts` - 3 questions
- [x] `src/data/suggestions/taxesQuestions.ts` - 4 questions
- [x] `src/data/suggestions/estatePlanQuestions.ts` - 5 questions
- [x] `src/data/suggestions/insuranceQuestions.ts` - 5 questions
- [x] `src/data/suggestions/employeeBenefitsQuestions.ts` - 6 questions
- [x] `src/data/suggestions/suggestionTemplates.ts` - ~50 suggestion templates
- [x] `src/data/suggestions/index.ts` - Barrel export

### Services
- [x] `src/services/suggestionsFilter.ts` - Profile-based filtering
- [x] `src/services/suggestionsEngine.ts` - Suggestion generation logic

### Components
- [x] `src/components/suggestions/DomainExplorer.tsx` - Domain overview grid
- [x] `src/components/suggestions/DomainCard.tsx` - Single domain card
- [x] `src/components/suggestions/GuidedQuestionFlow.tsx` - Question wizard
- [x] `src/components/suggestions/QuestionCard.tsx` - Individual question with inputs
- [x] `src/components/suggestions/SuggestionCard.tsx` - Individual suggestion display
- [x] `src/components/suggestions/SuggestionsList.tsx` - List of suggestions with filtering
- [x] `src/components/suggestions/CustomRecommendationForm.tsx` - Add custom recommendations
- [x] `src/components/suggestions/PlanBuilder.tsx` - Main plan assembly interface
- [x] `src/components/suggestions/PlanItemCard.tsx` - Plan item with status management
- [x] `src/components/suggestions/index.ts` - Components barrel export

### Pages
- [x] `src/pages/consumer/dashboard/SuggestionsOverviewPage.tsx` - Main entry point
- [x] `src/pages/consumer/dashboard/DomainExplorationPage.tsx` - Domain question flow
- [x] `src/pages/consumer/dashboard/PlanBuilderPage.tsx` - Plan assembly page

### Modified Files
- [x] `src/types/index.ts` - Export suggestions types
- [x] `src/App.tsx` - Add routes for suggestions pages
- [x] `src/stores/index.ts` - Export suggestions store
- [x] `src/components/dashboard/DashboardNav.tsx` - Navigation link

---

## User Workflow

### 1. Domain Explorer
User opens Suggestions page and sees 8 domain cards with status indicators. Irrelevant domains are dimmed based on profile.

### 2. Guided Question Flow
User enters a domain and answers questions step by step. Analysis hints guide them to use external tools.

### 3. Suggestion Review
After completing questions, suggestions are generated. User can accept, reject, or modify each suggestion.

### 4. Plan Builder
Accepted suggestions and custom recommendations are organized in the plan with status tracking.

---

## Notes

- The 8 new suggestion domains exist alongside the existing 9 planning domains
- Old domains continue to power Discovery Insights
- New domains power the Suggestions Engine
- Eventually deprecate `actionRecommendationEngine.ts` and `RecommendationsPage.tsx`
