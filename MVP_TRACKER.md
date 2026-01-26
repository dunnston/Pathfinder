# Pathfinder MVP Implementation Plan

## Project Overview
**Goal:** Build the "Get Organized" module - a discovery wizard that produces a structured Financial Decision Profile. Includes full Advisor Mode with multi-client management and Consumer Mode for individual users.

**Current State:** Phase 9 Complete - Financial Snapshot discovery section is done. All 5 discovery sections complete!

**Key Decisions:**
- Full Advisor/Consumer mode differentiation (different UI, multi-client for advisors)
- True drag & drop with @dnd-kit for value ranking
- Git initialized as part of scaffolding
- Local persistence only (no backend) - multi-client simulated via localStorage

---

## MVP Phases & Tasks

### Phase 0: Project Scaffolding
**Status:** Complete
**Goal:** Initialize project with all required tooling and configuration

| Task | Status | Notes |
|------|--------|-------|
| Initialize Vite + React 18 + TypeScript project | Complete | Manual setup due to existing files |
| Configure Tailwind CSS with design system colors | Complete | Tailwind v4 with CSS-based config |
| Set up ESLint + Prettier | Complete | |
| Configure path aliases in tsconfig | Complete | `@/*` maps to `./src/*` |
| Create directory structure per CLAUDE.md | Complete | All folders created with .gitkeep |
| Install core dependencies | Complete | Zustand, React Router, React Hook Form, Zod, @dnd-kit |
| Create basic App.tsx shell with Router | Complete | Routes for landing, consumer, advisor |
| Initialize Git repository | Complete | |
| Create MVP_TRACKER.md in project root | Complete | This file |

**Dependencies installed:**
```
zustand
react-router-dom
react-hook-form
@hookform/resolvers
zod
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
tailwindcss (v4)
prettier
```

---

### Phase 1: Type Definitions & Core Infrastructure
**Status:** Complete
**Goal:** Define all TypeScript types and set up state management

| Task | Status | Notes |
|------|--------|-------|
| Create User types (consumer vs advisor roles) | Complete | src/types/user.ts |
| Create FinancialProfile core types | Complete | src/types/profile.ts |
| Create BasicContext types | Complete | src/types/basicContext.ts |
| Create RetirementVision types | Complete | src/types/retirementVision.ts |
| Create PlanningPreferences types | Complete | src/types/planningPreferences.ts |
| Create RiskComfort types | Complete | src/types/riskComfort.ts |
| Create FinancialSnapshot types | Complete | src/types/financialSnapshot.ts |
| Create SystemClassifications types | Complete | src/types/systemClassifications.ts |
| Create Client types for Advisor mode | Complete | src/types/client.ts |
| Set up profileStore with Zustand + persistence | Complete | src/stores/profileStore.ts |
| Set up userStore (mode, current user) | Complete | src/stores/userStore.ts |
| Set up clientStore for Advisor mode | Complete | src/stores/clientStore.ts |
| Set up uiStore for wizard navigation | Complete | src/stores/uiStore.ts |
| Configure React Router with all routes | Complete | All routes configured with placeholder pages |

---

### Phase 2: Common UI Components
**Status:** Complete
**Goal:** Build reusable components following design system

| Task | Status | Notes |
|------|--------|-------|
| Create Button variants (Primary, Secondary, Ghost) | Complete | src/components/common/Button.tsx |
| Create Input components (Text, Number, Date) | Complete | src/components/common/Input.tsx (includes TextArea) |
| Create Select/Dropdown component | Complete | src/components/common/Select.tsx |
| Create QuestionCard component | Complete | src/components/common/QuestionCard.tsx |
| Create TradeoffSelector component | Complete | src/components/common/TradeoffSelector.tsx |
| Create MultiSelect component | Complete | src/components/common/MultiSelect.tsx |
| Create RankingList component (dnd-kit) | Complete | src/components/common/RankingList.tsx |
| Create ScaleSlider component | Complete | src/components/common/ScaleSlider.tsx (includes LikertScale) |
| Create RangeSelector component | Complete | src/components/common/RangeSelector.tsx (includes FinancialRangeSelector) |
| Create ProgressIndicator component | Complete | src/components/common/ProgressIndicator.tsx (includes SimpleProgress) |
| Create SectionIntro component | Complete | src/components/common/SectionIntro.tsx |
| Create Card component | Complete | src/components/common/Card.tsx |
| Create Modal component | Complete | src/components/common/Modal.tsx

---

### Phase 3: Layout & Navigation Components
**Status:** Complete
**Goal:** Build mode-specific layouts and navigation

| Task | Status | Notes |
|------|--------|-------|
| Create ConsumerLayout component | Complete | src/components/layout/ConsumerLayout.tsx |
| Create AdvisorLayout component | Complete | src/components/layout/AdvisorLayout.tsx |
| Create AdvisorSidebar component | Complete | src/components/layout/AdvisorSidebar.tsx |
| Create Header component (mode-aware) | Complete | src/components/layout/Header.tsx (Header, ConsumerHeader, AdvisorHeader) |
| Create WizardLayout component | Complete | src/components/layout/WizardLayout.tsx |
| Create Footer component | Complete | src/components/layout/Footer.tsx (Footer, SimpleFooter) |
| Create ModeSelector component | Complete | src/components/layout/ModeSelector.tsx |
| Create ClientCard component | Complete | src/components/layout/ClientCard.tsx (ClientCard, ClientCardCompact) |
| Create ClientListView component | Complete | src/components/layout/ClientListView.tsx

---

### Phase 4: Advisor Mode Infrastructure
**Status:** Complete
**Goal:** Build multi-client management for advisors

| Task | Status | Notes |
|------|--------|-------|
| Create AdvisorDashboard page | Complete | Client overview with stats, recent clients grid |
| Create ClientList page | Complete | Uses ClientListView with filtering/sorting |
| Create AddClient flow | Complete | Form with validation, redirects to client detail |
| Create ClientDetail view | Complete | Discovery progress tracking, section links |
| Create ClientProfile view | Complete | Profile summary with export functionality |
| Create ClientDiscovery flow | Complete | Section navigation with progress tracking |
| Create client switching logic | Complete | Via clientStore getClient/setSelectedClient |
| Create advisor notes field on profiles | Complete | In AddClient and ClientDiscovery pages |
| Implement client search/filter | Complete | Via ClientListView with filters/sort |
| Create client status indicators | Complete | Profile completion %, status badges |

**Additional Changes:**
- Updated Client type to use single `name` field instead of `firstName`/`lastName`
- Added `profileCompletion`, `sectionProgress`, `advisorNotes` to Client type
- Added `DISCOVERY_SECTIONS` constant to types for consistent section data
- Updated clientStore with `getClient`, `updateSectionProgress` methods

---

### Phase 5: Discovery Section 1 - Basic Context
**Status:** Complete
**Goal:** Capture personal and employment information

| Task | Status | Notes |
|------|--------|-------|
| Create basicContextQuestions data file | Complete | src/data/basicContextQuestions.ts - includes options, labels, mode-aware text |
| Create BasicContextForm component | Complete | src/components/discovery/BasicContextForm.tsx |
| Create FederalEmployeeFields sub-component | Complete | src/components/discovery/FederalEmployeeFields.tsx |
| Create SpouseFields sub-component | Complete | src/components/discovery/SpouseFields.tsx |
| Create DependentsList sub-component | Complete | src/components/discovery/DependentsList.tsx - dynamic add/remove |
| Create BasicContextSection page | Complete | Updated src/pages/consumer/DiscoverySection.tsx |
| Add Zod validation schema | Complete | src/services/validation.ts |
| Wire up to profileStore | Complete | Both consumer and advisor flows use profileStore |
| Add mode-aware language (you vs client) | Complete | getQuestionLabel() supports isAdvisorMode flag |

**New Files Created:**
- `src/data/basicContextQuestions.ts` - Question config, options for selects, mode-aware labels
- `src/services/validation.ts` - Zod schemas for BasicContext validation
- `src/components/discovery/BasicContextForm.tsx` - Main form component
- `src/components/discovery/FederalEmployeeFields.tsx` - Federal employee conditional fields
- `src/components/discovery/SpouseFields.tsx` - Spouse/partner conditional fields
- `src/components/discovery/DependentsList.tsx` - Dynamic dependents list
- `src/components/discovery/index.ts` - Component exports

---

### Phase 6: Discovery Section 2 - Retirement Vision
**Status:** Complete
**Goal:** Capture retirement goals, concerns, and priorities

| Task | Status | Notes |
|------|--------|-------|
| Create retirementVisionQuestions data file | Complete | src/data/retirementVisionQuestions.ts - includes concerns, flexibility options, prompts |
| Create RetirementVisionForm component | Complete | src/components/discovery/RetirementVisionForm.tsx - main form with all fields |
| Create ConcernsSelector component | Complete | src/components/discovery/ConcernsSelector.tsx - multi-select with severity rating |
| Create LifestylePrioritiesRanking component | Complete | src/components/discovery/LifestylePrioritiesRanking.tsx - @dnd-kit drag-and-drop ranking |
| Add Zod validation schemas | Complete | Added to src/services/validation.ts |
| Wire up consumer discovery flow | Complete | Updated DiscoverySection.tsx to render RetirementVisionForm |
| Wire up advisor discovery flow | Complete | Updated ClientDiscovery.tsx to render RetirementVisionForm |
| Add mode-aware language (you vs client) | Complete | getQuestionLabel() supports isAdvisorMode flag |

**New Files Created:**
- `src/data/retirementVisionQuestions.ts` - Question config, flexibility options, concern options, lifestyle priorities, vision prompts
- `src/components/discovery/RetirementVisionForm.tsx` - Main form component with timeline, vision, concerns, outcomes, priorities sections
- `src/components/discovery/ConcernsSelector.tsx` - Multi-select for retirement concerns with severity levels
- `src/components/discovery/LifestylePrioritiesRanking.tsx` - Drag-and-drop ranking with @dnd-kit

---

### Phase 7: Discovery Section 3 - Planning Preferences
**Status:** Complete
**Goal:** Understand decision-making style and complexity tolerance

| Task | Status | Notes |
|------|--------|-------|
| Create planningPreferencesQuestions data file | Complete | src/data/planningPreferencesQuestions.ts - tradeoff pairs, value options, comfort levels |
| Create PlanningPreferencesForm component | Complete | src/components/discovery/PlanningPreferencesForm.tsx - main form with all preference fields |
| Create TradeoffExercise component | Complete | src/components/discovery/TradeoffExercise.tsx - 5-point scale A vs B choices |
| Create ValueRanking component | Complete | src/components/discovery/ValueRanking.tsx - @dnd-kit drag-and-drop ranking |
| Add Zod validation schemas | Complete | Added to src/services/validation.ts |
| Wire up consumer discovery flow | Complete | Updated DiscoverySection.tsx to render PlanningPreferencesForm |
| Wire up advisor discovery flow | Complete | Updated ClientDiscovery.tsx to render PlanningPreferencesForm |
| Add mode-aware language (you vs client) | Complete | getQuestionLabel() supports isAdvisorMode flag |

**New Files Created:**
- `src/data/planningPreferencesQuestions.ts` - Question config, complexity tolerance, comfort levels, involvement options, decision styles, tradeoff pairs, values list
- `src/components/discovery/PlanningPreferencesForm.tsx` - Main form component with complexity, decision style, values ranking, tradeoffs sections
- `src/components/discovery/TradeoffExercise.tsx` - Interactive A vs B preference selector with 5-point scale
- `src/components/discovery/ValueRanking.tsx` - Drag-and-drop value ranking with @dnd-kit

---

### Phase 8: Discovery Section 4 - Risk & Income Comfort
**Status:** Complete
**Goal:** Assess risk tolerance and income preferences

| Task | Status | Notes |
|------|--------|-------|
| Create riskComfortQuestions data file | Complete | src/data/riskComfortQuestions.ts - scenarios, scales, options, mode-aware labels |
| Create RiskComfortForm component | Complete | src/components/discovery/RiskComfortForm.tsx - main form with all risk/income fields |
| Create ScenarioChoice component | Complete | src/components/discovery/ScenarioChoice.tsx - collapsible scenario-based risk assessment |
| Create TimingFlexibilityFields component | Complete | src/components/discovery/TimingFlexibilityFields.tsx - retirement timing flexibility inputs |
| Add Zod validation schemas | Complete | Added to src/services/validation.ts |
| Wire up consumer discovery flow | Complete | Updated DiscoverySection.tsx to render RiskComfortForm |
| Wire up advisor discovery flow | Complete | Updated ClientDiscovery.tsx to render RiskComfortForm |
| Add mode-aware language (you vs client) | Complete | getQuestionLabel() and getScenarioText() support isAdvisorMode flag |

**New Files Created:**
- `src/data/riskComfortQuestions.ts` - Question config, investment risk options, stability preferences, downturn responses, scenarios with risk scoring, flexibility scale
- `src/components/discovery/RiskComfortForm.tsx` - Main form component with investment risk, income stability, market response, flexibility slider, scenarios, timing flexibility sections
- `src/components/discovery/ScenarioChoice.tsx` - Interactive scenario-based questions with collapsible panels and auto-advance
- `src/components/discovery/TimingFlexibilityFields.tsx` - Retirement timing flexibility fields (delay willingness, max delay years, early retirement, conditions)

---

### Phase 9: Discovery Section 5 - Financial Snapshot
**Status:** Complete
**Goal:** Light financial data collection (ranges, not exact amounts)

| Task | Status | Notes |
|------|--------|-------|
| Create financialSnapshotQuestions data file | Complete | src/data/financialSnapshotQuestions.ts - account types, debt types, balance ranges, income options |
| Create FinancialSnapshotForm component | Complete | src/components/discovery/FinancialSnapshotForm.tsx - main form with all sections |
| Create AccountsList component | Complete | src/components/discovery/AccountsList.tsx - add/remove investment accounts with balance ranges |
| Create IncomeSourcesList component | Complete | src/components/discovery/IncomeSourcesList.tsx - CurrentIncomeList and RetirementIncomeList |
| Create DebtAssetsList component | Complete | src/components/discovery/DebtAssetsList.tsx - DebtList and AssetList components |
| Add Zod validation schemas | Complete | Added to src/services/validation.ts |
| Wire up consumer discovery flow | Complete | Updated DiscoverySection.tsx to render FinancialSnapshotForm |
| Wire up advisor discovery flow | Complete | Updated ClientDiscovery.tsx to render FinancialSnapshotForm |

**New Files Created:**
- `src/data/financialSnapshotQuestions.ts` - Question config, income source options, account types, balance ranges, debt/asset types, insurance options
- `src/components/discovery/FinancialSnapshotForm.tsx` - Main form with current income, retirement income, investment accounts, debts, assets, emergency reserves, insurance sections
- `src/components/discovery/AccountsList.tsx` - Dynamic list for investment accounts with balance range selection and totals
- `src/components/discovery/IncomeSourcesList.tsx` - CurrentIncomeList and RetirementIncomeList with guaranteed/variable income tracking
- `src/components/discovery/DebtAssetsList.tsx` - DebtList and AssetList components with balance range selection

---

### Phase 10: Profile Summary & Classifications
**Status:** Not Started
**Goal:** Display completed profile and calculate system classifications

| Task | Status | Notes |
|------|--------|-------|
| Create planningStageClassifier service | Not Started | Determine stage from data |
| Create strategyWeightsCalculator service | Not Started | Calculate 5 weight scores |
| Create decisionWindowIdentifier service | Not Started | Surface upcoming decisions |
| Create ProfileSummaryView page | Not Started | Human-readable summary |
| Create ProfileSectionCard component | Not Started | Collapsible section display |
| Create StrategyIndicators component | Not Started | Visual weight display |
| Create DecisionWindowsList component | Not Started | |
| Create PrintableProfile component | Not Started | Clean print layout |
| Add profile export (JSON download) | Not Started | |
| Add profile completeness calculation | Not Started | 0-100% indicator |

---

### Phase 11: Polish & Integration
**Status:** Not Started
**Goal:** Final integration and testing

| Task | Status | Notes |
|------|--------|-------|
| Implement auto-save on each question | Not Started | |
| Add resume capability detection | Not Started | Check localStorage on load |
| Add welcome/onboarding flow | Not Started | First-time user experience |
| Add section-jumping from summary | Not Started | Edit completed sections |
| Responsive design verification | Not Started | Mobile, tablet, desktop |
| Keyboard navigation testing | Not Started | Full a11y |
| Add loading states | Not Started | |
| Add error boundaries | Not Started | |
| Complete manual testing checklist | Not Started | |
| TypeScript strict mode compliance | Not Started | `npm run typecheck` |
| Linting pass | Not Started | `npm run lint` |

---

## Route Structure

```
/                           -> Landing/Mode selection
/consumer                   -> Consumer home
/consumer/discovery         -> Discovery wizard start
/consumer/discovery/:section -> Section pages (basic-context, retirement-vision, etc.)
/consumer/profile           -> Profile summary view

/advisor                    -> Advisor dashboard
/advisor/clients            -> Client list
/advisor/clients/new        -> Add new client
/advisor/clients/:id        -> Client detail
/advisor/clients/:id/discovery/:section -> Discovery for specific client
/advisor/clients/:id/profile -> Client profile summary
```

---

## Files to Create (Summary)

### Types (`src/types/`)
- `user.ts` - User, UserRole, UserPreferences
- `profile.ts` - FinancialProfile and all section types
- `client.ts` - Client, ClientStatus (for advisor mode)
- `discovery.ts` - Discovery wizard navigation types
- `common.ts` - Shared utility types

### Stores (`src/stores/`)
- `profileStore.ts` - Profile state with persistence
- `userStore.ts` - Current user, mode selection
- `clientStore.ts` - Advisor's client list management
- `uiStore.ts` - UI/navigation state

### Components (`src/components/`)
- `common/` - Button, Input, Select, Card, Modal, QuestionCard, etc.
- `discovery/` - Section-specific components
- `layout/` - ConsumerLayout, AdvisorLayout, WizardLayout
- `advisor/` - ClientCard, ClientList, AdvisorSidebar

### Pages (`src/pages/`)
- `LandingPage.tsx` - Complete
- `consumer/ConsumerHome.tsx` - Complete (basic)
- `advisor/AdvisorDashboard.tsx` - Complete (basic)
- Additional pages to be created in later phases

### Data (`src/data/`)
- Question banks for each section
- Option lists (concerns, values, account types, etc.)

### Services (`src/services/`)
- `validation.ts` - Zod schemas
- `classification.ts` - Stage and weight calculations
- `storage.ts` - LocalStorage utilities

---

## Working Sessions Tracking

| Date | Phase | Work Completed | Next Steps |
|------|-------|----------------|------------|
| 2026-01-26 | Phase 0 | Project scaffolding complete. Vite, React, TypeScript, Tailwind v4, all dependencies installed, basic routing with landing page and placeholder pages for consumer/advisor modes. | Start Phase 1: Create TypeScript type definitions |
| 2026-01-26 | Phase 1 | All TypeScript types created (11 type files in src/types/). All Zustand stores created (userStore, profileStore, clientStore, uiStore). All routes configured with placeholder pages for consumer discovery flow and advisor client management. TypeScript and lint checks pass. | Start Phase 2: Build common UI components |
| 2026-01-26 | Phase 2 | All 13 common UI components created: Button, Card, Modal, Input (Text/Number/Date/TextArea), Select, MultiSelect, QuestionCard, SectionIntro, ProgressIndicator, TradeoffSelector, ScaleSlider, RangeSelector, RankingList (dnd-kit). All exported via index.ts. TypeScript and lint checks pass. | Start Phase 3: Layout & Navigation Components |
| 2026-01-26 | Phase 3 | All 9 layout components created: Header (3 variants), Footer (2 variants), ModeSelector, ConsumerLayout, WizardLayout, AdvisorLayout, AdvisorSidebar, ClientCard (2 variants), ClientListView. Fixed Tailwind v4 PostCSS config. TypeScript and lint checks pass. | Start Phase 4: Advisor Mode Infrastructure |
| 2026-01-26 | Phase 4 | Updated all 6 advisor pages (AdvisorDashboard, ClientList, AddClient, ClientDetail, ClientProfile, ClientDiscovery) to use new layout components. Updated Client type and clientStore. Added DISCOVERY_SECTIONS constant. TypeScript and lint checks pass. | Start Phase 5: Discovery Section 1 - Basic Context |
| 2026-01-26 | Phase 5 | Created BasicContextForm with all sub-components (FederalEmployeeFields, SpouseFields, DependentsList). Added Zod validation schemas. Created basicContextQuestions data file with mode-aware labels. Wired up consumer DiscoverySection and advisor ClientDiscovery to use form. TypeScript and lint checks pass. | Start Phase 6: Discovery Section 2 - Retirement Vision |
| 2026-01-26 | Phase 6 | Created RetirementVisionForm with sub-components (ConcernsSelector, LifestylePrioritiesRanking). Added Zod validation schemas for RetirementVision. Created retirementVisionQuestions data file with concerns, flexibility options, lifestyle priorities. Wired up consumer and advisor discovery flows. TypeScript and lint checks pass. | Start Phase 7: Discovery Section 3 - Planning Preferences |
| 2026-01-26 | Phase 7 | Created PlanningPreferencesForm with sub-components (TradeoffExercise, ValueRanking). Added Zod validation schemas for PlanningPreferences. Created planningPreferencesQuestions data file with tradeoff pairs, value options, comfort levels. Wired up consumer and advisor discovery flows. TypeScript and lint checks pass. | Start Phase 8: Discovery Section 4 - Risk & Income Comfort |
| 2026-01-26 | Phase 8 | Created RiskComfortForm with sub-components (ScenarioChoice, TimingFlexibilityFields). Added Zod validation schemas for RiskComfort. Created riskComfortQuestions data file with scenarios, risk scales, flexibility options. Wired up consumer and advisor discovery flows. TypeScript and lint checks pass. | Start Phase 9: Discovery Section 5 - Financial Snapshot |
| 2026-01-26 | Phase 9 | Created FinancialSnapshotForm with sub-components (AccountsList, IncomeSourcesList, DebtAssetsList). Added Zod validation schemas for FinancialSnapshot. Created financialSnapshotQuestions data file with account types, balance ranges, income options. Wired up consumer and advisor discovery flows. TypeScript and lint checks pass. All 5 discovery sections complete! | Start Phase 10: Profile Summary & Classifications |

---

## Testing Checklist (Before MVP Complete)

- [ ] All TypeScript compiles without errors
- [ ] All linting passes
- [ ] Consumer flow works end-to-end (all 5 sections)
- [ ] Advisor flow works end-to-end (create client, complete profile)
- [ ] Data persists correctly in localStorage
- [ ] Can resume incomplete profiles
- [ ] Profile summary displays all data correctly
- [ ] Strategy weights calculate correctly
- [ ] Planning stage classification works
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Mode switching works without data loss

---

## Session Management Protocol

### Starting Any Session
1. **Read MVP_TRACKER.md** (this file)
2. **Check current phase status** in the tracker
3. **Review "Working Sessions Tracking"** table for context
4. **Continue from where we left off** - pick up incomplete tasks

### During Each Session
1. **Update task status** as work progresses (Not Started → In Progress → Complete)
2. **Add notes** for any blockers or decisions
3. **Log session** in the Working Sessions Tracking table

### Ending Any Session
1. **Update MVP_TRACKER.md** with current progress
2. **Document next steps** clearly
3. **Commit changes** including tracker updates

---

## Notes & Decisions

- **Local persistence only:** No backend for MVP - all data in localStorage
- **Multi-client storage:** Advisor clients stored as array in localStorage, each with unique ID
- **No auth in MVP:** Mode selection is manual, no login required
- **Design system:** Follow colors/typography from DESIGN_DOCUMENT.md UI/UX Guidelines
- **No AI features:** All logic is rules-based and transparent
- **Tailwind v4:** Using CSS-based configuration in `src/index.css` with `@theme` block

---

## Verification Plan

To verify the MVP is complete:

1. **Consumer Flow Test:**
   - Start fresh (clear localStorage)
   - Select Consumer mode
   - Complete all 5 discovery sections
   - Verify profile summary shows all data
   - Verify strategy weights calculated
   - Close browser, reopen - verify data persists

2. **Advisor Flow Test:**
   - Select Advisor mode
   - Create 2 test clients
   - Complete full profile for Client 1
   - Start profile for Client 2, leave incomplete
   - Verify dashboard shows both clients with correct status
   - Navigate between clients, verify correct data loads
   - Export Client 1 profile as JSON

3. **Technical Verification:**
   - `npm run typecheck` passes
   - `npm run lint` passes
   - `npm run build` succeeds
   - Test on mobile viewport (Chrome DevTools)
   - Test keyboard navigation through forms

---

*Last Updated: January 26, 2026*
