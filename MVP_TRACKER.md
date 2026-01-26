# Pathfinder MVP Implementation Plan

## Project Overview
**Goal:** Build the "Get Organized" module - a discovery wizard that produces a structured Financial Decision Profile. Includes full Advisor Mode with multi-client management and Consumer Mode for individual users.

**Current State:** Phase 4 Complete - Advisor mode infrastructure is done.

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
**Status:** Not Started
**Goal:** Capture personal and employment information

| Task | Status | Notes |
|------|--------|-------|
| Create basicContextQuestions data file | Not Started | src/data/basicContextQuestions.ts |
| Create BasicContextForm component | Not Started | Form with validation |
| Create FederalEmployeeFields sub-component | Not Started | Conditional fields |
| Create SpouseFields sub-component | Not Started | Conditional fields |
| Create DependentsList sub-component | Not Started | Dynamic add/remove |
| Create BasicContextSection page | Not Started | src/pages/discovery/ |
| Add Zod validation schema | Not Started | |
| Wire up to profileStore | Not Started | |
| Add mode-aware language (you vs client) | Not Started | |

---

### Phase 6: Discovery Section 2 - Retirement Vision
**Status:** Not Started
**Goal:** Capture retirement goals, concerns, and priorities

| Task | Status | Notes |
|------|--------|-------|
| Create retirementVisionQuestions data file | Not Started | Include concerns list, prompts |
| Create VisionDescriptionPrompt component | Not Started | Open text with guidance |
| Create ConcernsSelector component | Not Started | Multi-select with severity |
| Create OutcomesList component | Not Started | Must-have vs Nice-to-have |
| Create FlexibilitySlider component | Not Started | |
| Create LifestylePrioritiesRanking component | Not Started | dnd-kit ranking |
| Create RetirementVisionSection page | Not Started | |
| Add validation and tagging logic | Not Started | Map responses to tags |
| Wire up to profileStore | Not Started | |

---

### Phase 7: Discovery Section 3 - Planning Preferences
**Status:** Not Started
**Goal:** Understand decision-making style and complexity tolerance

| Task | Status | Notes |
|------|--------|-------|
| Create planningPreferencesQuestions data file | Not Started | Tradeoff pairs, value list |
| Create TradeoffExercise component | Not Started | Series of A vs B choices |
| Create ValueRanking component | Not Started | dnd-kit drag to rank |
| Create PreferenceScale component | Not Started | Agreement scales |
| Create PlanningPreferencesSection page | Not Started | |
| Add scoring logic for complexity tolerance | Not Started | |
| Add advisor involvement preference calc | Not Started | |
| Wire up to profileStore | Not Started | |

---

### Phase 8: Discovery Section 4 - Risk & Income Comfort
**Status:** Not Started
**Goal:** Assess risk tolerance and income preferences

| Task | Status | Notes |
|------|--------|-------|
| Create riskComfortQuestions data file | Not Started | Scenarios, scales |
| Create ScenarioChoice component | Not Started | "What would you do if..." |
| Create IncomePreferenceScale component | Not Started | Stability vs growth |
| Create TimingFlexibility component | Not Started | |
| Create MarketDownturnResponse component | Not Started | |
| Create RiskComfortSection page | Not Started | |
| Add scoring for risk indicators | Not Started | |
| Wire up to profileStore | Not Started | |

---

### Phase 9: Discovery Section 5 - Financial Snapshot
**Status:** Not Started
**Goal:** Light financial data collection (ranges, not exact amounts)

| Task | Status | Notes |
|------|--------|-------|
| Create financialSnapshotQuestions data file | Not Started | Account types, debt types |
| Create AccountsList component | Not Started | Add accounts with ranges |
| Create DebtSummary component | Not Started | |
| Create AssetSummary component | Not Started | |
| Create IncomeSourcesList component | Not Started | Current + expected retirement |
| Create EmergencyReserves component | Not Started | |
| Create InsuranceSummary component | Not Started | |
| Create FinancialSnapshotSection page | Not Started | |
| Wire up to profileStore | Not Started | |

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
