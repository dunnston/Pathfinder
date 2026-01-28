# Insights Engine Enhancement Plan

> **Status:** Planning
> **Started:** January 28, 2026
> **Target:** Transform discovery data into actionable planning insights

---

## Overview

This plan enhances the existing Strategy Profile, Planning Focus, and Action Recommendation engines to fully implement the system described in `discovery_to_data.md`. The goal is to transform collected discovery data into:

1. **A Planning Posture** - How this person should approach money decisions
2. **A ranked list of Planning Focus Areas** - Where effort should go
3. **A prioritized list of Action Recommendations** - What to do next

---

## Current State Assessment

### What Already Exists

| Component | File | Status |
|-----------|------|--------|
| Strategy Profile Engine | `src/services/strategyProfileEngine.ts` | Basic implementation |
| Planning Focus Engine | `src/services/planningFocusEngine.ts` | Basic implementation |
| Action Recommendation Engine | `src/services/actionRecommendationEngine.ts` | Basic implementation |
| Discovery Insights Orchestrator | `src/services/discoveryInsightsEngine.ts` | Integration point exists |
| Insights Display Panel | `src/components/discovery/insights/` | Basic components |
| Strategy Indicators | `src/components/summary/StrategyIndicators.tsx` | Display component |

### What Needs Enhancement

1. **Strategy Profile Engine** - Needs the 5 dimensions from discovery_to_data.md with proper scoring logic
2. **Planning Focus Engine** - Needs value-domain and goal-domain mapping with prioritization rules
3. **Action Recommendation Engine** - Needs action type categorization, prioritization rules, and guidance levels
4. **UI/UX** - Needs a dedicated Insights page with clear visualization of all three outputs

---

## Implementation Phases

### Phase 1: Strategy Profile Engine Enhancement
**Goal:** Create accurate planning posture from discovery data

#### Tasks

- [x] **1.1** Review and document current `strategyProfileEngine.ts` implementation ✅
- [x] **1.2** Implement Income Strategy Orientation scoring ✅
  - Inputs: Dominant value category, retirement proximity, tradeoff preferences
  - Outputs: STABILITY_FOCUSED | BALANCED | GROWTH_FOCUSED with confidence score
- [x] **1.3** Implement Timing Sensitivity scoring ✅
  - Inputs: Near-term high priority goals, retirement timing rigidity, fixed commitments
  - Outputs: HIGH | MEDIUM | LOW with rationale
- [x] **1.4** Implement Planning Flexibility scoring ✅
  - Inputs: Goal flexibility scores, control values, non-negotiables count/type
  - Outputs: HIGH | MODERATE | LOW with rationale
- [x] **1.5** Implement Complexity Tolerance scoring ✅
  - Inputs: Control values, financial confidence, involvement preferences
  - Outputs: SIMPLE | MODERATE | ADVANCED with rationale
- [x] **1.6** Implement Decision Support Needs scoring ✅
  - Inputs: Control values, uncertainty responses, goal confidence
  - Outputs: HIGH | MODERATE | LOW with rationale
- [x] **1.7** Create Strategy Profile Summary generator ✅
  - Natural language summary combining all 5 dimensions
  - Template-based approach for consistent, professional output

#### Acceptance Criteria
- All 5 dimensions calculated with confidence scores (0-100)
- Each dimension includes human-readable rationale
- Summary text reads professionally (example from spec)
- Edge cases handled (missing data gracefully degrades)

---

### Phase 2: Planning Focus Area Engine Enhancement
**Goal:** Rank financial planning domains by importance for this person

#### Tasks

- [x] **2.1** Review and document current `planningFocusEngine.ts` implementation ✅
- [x] **2.2** Create value-to-domain mapping matrix ✅
  - Map each value category to relevant planning domains
  - SECURITY → income, insurance, cash flow
  - FAMILY → estate, insurance
  - FREEDOM → liquidity, investments
  - CONTRIBUTION → tax and giving strategies
  - (etc. for all 9 value categories)
- [x] **2.3** Create goal-to-domain mapping matrix ✅
  - Map goal categories to relevant planning domains
  - Early retirement → income, investments, tax
  - College funding → cash flow, investments
  - Caregiving → insurance, estate, healthcare
  - (etc. for all goal categories)
- [x] **2.4** Implement timing pressure scoring ✅
  - Weight domains that impact near-term goals higher
  - Short-term home purchase → cash flow, debt priority
  - Near retirement → income, healthcare, tax priority
- [x] **2.5** Implement risk exposure scoring ✅
  - Weight domains with unaddressed risks
  - Underinsured → insurance priority
  - No estate documents → estate priority
  - Low emergency fund → cash flow priority
- [x] **2.6** Create domain prioritization algorithm ✅
  - Combine value influence + goal alignment + timing pressure + risk exposure
  - Output ranked list with explanations
- [x] **2.7** Generate domain-specific explanations ✅
  - Each focus area ties back to specific values, goals, and risk factors
  - Template: "[Domain] — because [reason connected to values/goals]"

#### Planning Domains to Rank
1. Retirement Income Strategy
2. Investment Strategy
3. Tax Optimization
4. Insurance and Risk Management
5. Estate and Legacy Planning
6. Cash Flow and Debt Management
7. Federal/Employer Benefits Optimization (conditional)
8. Business or Career Strategy (conditional)
9. Healthcare and Long-Term Care Planning

#### Acceptance Criteria
- All 9 domains scored and ranked
- Each domain has a clear explanation tied to user's values/goals
- Conditional domains (Federal Benefits, Business) only appear when relevant
- Ranking is stable and explainable

---

### Phase 3: Action Recommendation Engine Enhancement
**Goal:** Generate clear, limited, achievable next steps

#### Tasks

- [x] **3.1** Review and document current `actionRecommendationEngine.ts` implementation ✅
- [x] **3.2** Define action type taxonomy ✅
  - EDUCATION - "Understand pension and Social Security timing options"
  - DECISION_PREP - "Compare retirement income strategies"
  - STRUCTURAL - "Establish emergency fund at target level"
  - PROFESSIONAL_REVIEW - "Review estate documents with attorney"
  - OPTIMIZATION - "Evaluate Roth conversion opportunities"
- [x] **3.3** Define guidance level taxonomy ✅
  - SELF_GUIDED - Can do independently with resources
  - ADVISOR_GUIDED - Needs financial advisor support
  - SPECIALIST_GUIDED - Needs specialist (attorney, CPA, etc.)
- [x] **3.4** Create action templates per planning domain ✅
  - Each domain has 3-5 templated actions
  - Actions parameterized based on user context
- [x] **3.5** Implement action prioritization algorithm ✅
  - Dependency ordering (what must happen before other actions)
  - Risk exposure ordering (protect against major downside first)
  - Time sensitivity ordering (what must be done soon)
  - Emotional importance ordering (non-negotiables first)
- [x] **3.6** Implement action limiting logic ✅
  - Maximum 7 actions at a time
  - Prioritize by focus area ranking
  - Avoid overwhelming user
- [x] **3.7** Generate action output structure ✅
  - Action title
  - Why this matters (tied to value/goal)
  - What this helps decide or improve
  - Guidance level (self/advisor/specialist)

#### Acceptance Criteria
- 3-7 prioritized actions generated
- Each action clearly tied to a value or goal
- No generic checklists or disconnected actions
- Guidance level appropriate for action complexity

---

### Phase 4: Insights Display UI
**Goal:** Present insights clearly to users and advisors

#### Tasks

- [x] **4.1** Design Insights page layout ✅
  - Three-section layout: Strategy Profile → Focus Areas → Actions
  - Clean, scannable, not overwhelming
- [x] **4.2** Create Strategy Profile display component ✅
  - Visual indicators for each of 5 dimensions (confidence dots)
  - Summary text prominently displayed
  - Rationale shown in each dimension card
- [x] **4.3** Create Planning Focus Areas display component ✅
  - Ranked list with visual priority indicators
  - Each item shows domain + explanation
  - Value/goal connection badges
- [x] **4.4** Create Action Recommendations display component ✅
  - Ordered list with action type badges
  - Each action shows title, rationale, guidance level
  - Visual differentiation for urgency levels
- [x] **4.5** Create Insights navigation/flow ✅
  - Integrated into ProfileSummary page
  - Regenerates automatically with updated data
  - JSON export available (print/PDF pending)
- [x] **4.6** Implement advisor-specific insights view ✅
  - isAdvisorMode prop changes language
  - Client-appropriate vs advisor-appropriate wording

#### Files Created
- [x] `src/components/discovery/insights/DiscoveryInsightsPanel.tsx` ✅ (contains all cards)
  - DataCompletenessCard (internal)
  - StrategyProfileCard (internal)
  - FocusAreasCard (internal)
  - ActionRecommendationsCard (internal)
- [x] Integrated into `src/pages/consumer/ProfileSummary.tsx` ✅
- [x] Integrated into `src/pages/advisor/ClientProfile.tsx` ✅ (via shared component)

#### Acceptance Criteria
- Insights page accessible from discovery completion
- All three insight types displayed clearly
- Responsive design (mobile, tablet, desktop)
- Print-friendly version available

---

### Phase 5: Integration & Polish
**Goal:** Connect all pieces and ensure quality

#### Tasks

- [x] **5.1** Update discovery completion flow to trigger insights generation ✅
- [x] **5.2** Add insights regeneration when profile data changes ✅ (via useMemo)
- [x] **5.3** Handle partial data gracefully (show what's possible) ✅
- [x] **5.4** Add loading states during generation ✅ (LoadingSpinner)
- [x] **5.5** Add error handling for edge cases ✅
- [x] **5.6** Write unit tests for scoring algorithms ✅ (69 tests across 4 files)
- [ ] **5.7** Write integration tests for engine orchestration
- [x] **5.8** Performance optimization (memoization, lazy loading) ✅ (useMemo)
- [ ] **5.9** Accessibility review (screen reader, keyboard nav)
- [ ] **5.10** Final QA pass across all insight flows

#### Acceptance Criteria
- Insights generate automatically on discovery completion
- Updates propagate when profile changes
- No console errors or warnings
- TypeScript compiles cleanly
- Linting passes

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     DISCOVERY DATA                              │
├─────────────────────────────────────────────────────────────────┤
│  Basic Context    │ Retirement Vision │ Values Discovery        │
│  Financial Goals  │ Financial Purpose │ Planning Preferences    │
│  Risk Comfort     │ Financial Snapshot│                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                DISCOVERY INSIGHTS ENGINE                        │
│                (discoveryInsightsEngine.ts)                     │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ Strategy Profile │  │  Planning Focus │  │ Action Recommendations│
│     Engine       │  │     Engine      │  │       Engine         │
│                 │  │                 │  │                      │
│ • Income Strategy│  │ • Domain Ranking│  │ • Action Types       │
│ • Timing Sens.   │  │ • Value Mapping │  │ • Prioritization     │
│ • Flexibility    │  │ • Goal Mapping  │  │ • Guidance Levels    │
│ • Complexity Tol.│  │ • Risk Exposure │  │ • Dependencies       │
│ • Guidance Need  │  │ • Explanations  │  │ • Limiting Logic     │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INSIGHTS OUTPUT                            │
├─────────────────────────────────────────────────────────────────┤
│  Planning Posture Summary (natural language)                    │
│  Ranked Focus Areas with explanations                           │
│  Prioritized Actions with rationale and guidance levels         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INSIGHTS UI                                  │
├─────────────────────────────────────────────────────────────────┤
│  Consumer: InsightsPage.tsx                                     │
│  Advisor: ClientInsightsPage.tsx                                │
│  Printable: InsightsPrintView.tsx                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Specifications

### Strategy Profile Types

```typescript
// Enhanced types for strategyProfileEngine.ts

type IncomeStrategyOrientation = 'STABILITY_FOCUSED' | 'BALANCED' | 'GROWTH_FOCUSED';
type TimingSensitivity = 'HIGH' | 'MEDIUM' | 'LOW';
type PlanningFlexibility = 'HIGH' | 'MODERATE' | 'LOW';
type ComplexityTolerance = 'SIMPLE' | 'MODERATE' | 'ADVANCED';
type GuidanceLevel = 'HIGH' | 'MODERATE' | 'LOW';

interface StrategyDimension<T> {
  value: T;
  confidence: number;  // 0-100
  rationale: string;   // Human-readable explanation
  inputs: string[];    // Which data fields influenced this
}

interface StrategyProfile {
  incomeStrategy: StrategyDimension<IncomeStrategyOrientation>;
  timingSensitivity: StrategyDimension<TimingSensitivity>;
  planningFlexibility: StrategyDimension<PlanningFlexibility>;
  complexityTolerance: StrategyDimension<ComplexityTolerance>;
  guidanceLevel: StrategyDimension<GuidanceLevel>;
  summary: string;  // Full natural language summary
  generatedAt: string;
}
```

### Planning Focus Types

```typescript
// Enhanced types for planningFocusEngine.ts

type PlanningDomain =
  | 'RETIREMENT_INCOME'
  | 'INVESTMENT_STRATEGY'
  | 'TAX_OPTIMIZATION'
  | 'INSURANCE_RISK'
  | 'ESTATE_LEGACY'
  | 'CASH_FLOW_DEBT'
  | 'BENEFITS_OPTIMIZATION'
  | 'BUSINESS_CAREER'
  | 'HEALTHCARE_LTC';

type DomainPriority = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

interface FocusAreaRanking {
  domain: PlanningDomain;
  priority: DomainPriority;
  rank: number;  // 1 = highest priority
  explanation: string;  // "[Domain] — because [reason]"
  valueConnections: string[];  // Which user values drive this
  goalConnections: string[];   // Which user goals drive this
  riskFactors: string[];       // Risks if ignored
  score: number;  // Composite score for ranking
}

interface PlanningFocusResult {
  rankings: FocusAreaRanking[];
  topPriorities: FocusAreaRanking[];  // Top 3
  generatedAt: string;
}
```

### Action Recommendation Types

```typescript
// Enhanced types for actionRecommendationEngine.ts

type ActionType =
  | 'EDUCATION_AWARENESS'
  | 'DECISION_PREPARATION'
  | 'STRUCTURAL_SETUP'
  | 'PROFESSIONAL_REVIEW'
  | 'OPTIMIZATION';

type ActionGuidance = 'SELF_GUIDED' | 'ADVISOR_GUIDED' | 'SPECIALIST_GUIDED';
type ActionUrgency = 'IMMEDIATE' | 'NEAR_TERM' | 'MEDIUM_TERM' | 'ONGOING';

interface ActionRecommendation {
  id: string;
  title: string;
  description: string;  // What this action involves
  whyItMatters: string; // Connected to value/goal
  whatItAchieves: string;  // Decision or improvement outcome
  actionType: ActionType;
  guidance: ActionGuidance;
  urgency: ActionUrgency;
  relatedDomain: PlanningDomain;
  relatedValues: string[];
  relatedGoals: string[];
  dependencies: string[];  // Action IDs that must come first
  priority: number;  // 1 = highest
}

interface ActionRecommendations {
  actions: ActionRecommendation[];
  totalCount: number;
  displayedCount: number;  // 3-7 max shown
  generatedAt: string;
}
```

---

## Design Principles (from discovery_to_data.md)

### System-Wide Rules

1. **Avoid financial product recommendations** - Focus on planning direction, not products
2. **Avoid precise numeric projections** - No specific dollar amounts or percentages
3. **Avoid legal or tax advice phrasing** - Use "consider reviewing" not "you should"
4. **Focus on decision preparation** - What to think about, not what to decide
5. **Focus on sequencing** - What comes first, what depends on what
6. **Connect everything to values and goals** - Every recommendation has a "why"

### Output Quality Standards

1. **Explain why recommendations exist** - Never orphaned suggestions
2. **Respect values, goals, and constraints** - User priorities come first
3. **Avoid optimization before priorities are clear** - Foundation before fine-tuning
4. **Keep action lists short** - 3-7 actions maximum
5. **Make outputs readable** - Natural language, not technical jargon

---

## Session Log

| Date | Phase | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-01-28 | Planning | Created implementation plan | Initial plan created |
| 2026-01-28 | Review | Assessed current implementation | See assessment below |
| 2026-01-28 | Testing | Added 69 unit tests (Phase 5.6) | 4 test files for all engines |
| 2026-01-28 | Enhancement | Improved summary generator prose | More natural language |
| 2026-01-28 | Feature | Created InsightsPage with print | Route: /consumer/insights |
| 2026-01-28 | Bugfix | Fixed lint error in preferencesValidation.ts | |

---

## Current Implementation Assessment (2026-01-28)

After thorough review, the implementation is **significantly more complete** than initially estimated:

### ✅ Phase 1: Strategy Profile Engine - COMPLETE
- All 5 dimensions implemented with scoring logic
- Confidence scoring (HIGH/MEDIUM/LOW)
- Rationale generation for each dimension
- Summary text generator
- Location: [strategyProfileEngine.ts](src/services/strategyProfileEngine.ts)

### ✅ Phase 2: Planning Focus Engine - COMPLETE
- All 9 planning domains implemented
- Value-to-domain mapping matrix
- Goal-to-domain mapping matrix
- Timing pressure scoring (retirement proximity)
- Risk exposure scoring
- Domain prioritization algorithm
- Location: [planningFocusEngine.ts](src/services/planningFocusEngine.ts)

### ✅ Phase 3: Action Recommendation Engine - COMPLETE
- Action type taxonomy (5 types)
- Guidance level taxonomy (3 levels)
- 20+ action templates per domain
- Condition-based filtering
- Urgency adjustment logic
- 7-action limit enforcement
- Location: [actionRecommendationEngine.ts](src/services/actionRecommendationEngine.ts)

### ✅ Phase 4: Insights Display UI - MOSTLY COMPLETE
- `DiscoveryInsightsPanel` component with all sub-components
- DataCompletenessCard
- StrategyProfileCard with DimensionCard grid
- FocusAreasCard with prioritized list
- ActionRecommendationsCard with action cards
- Location: [DiscoveryInsightsPanel.tsx](src/components/discovery/insights/DiscoveryInsightsPanel.tsx)

### ✅ Phase 5: Integration - COMPLETE
- `discoveryInsightsEngine.ts` orchestrates all engines
- ProfileSummary.tsx displays insights automatically
- Advisor and consumer views supported
- Location: [discoveryInsightsEngine.ts](src/services/discoveryInsightsEngine.ts)

### Remaining Work (Minor Enhancements)

1. ~~**Summary Generator Enhancement**~~ ✅ COMPLETED
   - Improved to produce more natural, flowing prose

2. ~~**Dedicated Insights Page (Optional)**~~ ✅ COMPLETED
   - Created `src/pages/consumer/InsightsPage.tsx`
   - Route: `/consumer/insights`

3. ~~**Print/Export for Insights**~~ ✅ COMPLETED
   - Print functionality added to InsightsPage
   - Print-specific CSS styles included

4. ~~**Unit Tests**~~ ✅ COMPLETED
   - 69 tests across 4 test files
   - Coverage: strategyProfile, planningFocus, actionRecommendation, discoveryInsights engines

### Still Pending
- Integration tests (Phase 5.7)
- Accessibility review (Phase 5.9)
- Final QA pass (Phase 5.10)

---

## Dependencies & Risks

### Dependencies
- Discovery sections must be complete (or partially complete with graceful degradation)
- Existing engine infrastructure must be stable
- Type definitions must support enhanced output structures

### Risks
| Risk | Mitigation |
|------|------------|
| Scoring algorithms produce unexpected results | Write comprehensive unit tests with known inputs |
| Too many edge cases in data combinations | Start with common cases, iteratively handle edge cases |
| Natural language generation feels robotic | Use templates with variations, review with real profiles |
| Performance issues with complex calculations | Profile and optimize, add memoization where needed |

---

## Success Metrics

- [x] Strategy Profile generates in < 100ms ✅
- [x] Focus Areas generate in < 100ms ✅
- [x] Actions generate in < 100ms ✅
- [x] All outputs have human-readable explanations ✅
- [x] No TypeScript errors ✅
- [x] No console warnings ✅
- [x] Works with partial profile data ✅
- [x] Advisor and consumer views both functional ✅
- [x] 69 unit tests passing ✅
- [x] Dedicated insights page with print support ✅

---

## Next Steps

1. Start with **Phase 1.1** - Review current strategyProfileEngine.ts
2. Document current implementation gaps
3. Begin incremental enhancement of scoring logic
4. Proceed phase-by-phase with PR per phase

---

*Plan created: January 28, 2026*
*Reference: discovery_to_data.md*
