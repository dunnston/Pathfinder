# Financial Decision Platform - Design Document

**Project Codename:** Pathfinder  
**Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Ryan  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Vision & Problem Statement](#vision--problem-statement)
3. [Target Market](#target-market)
4. [Product Architecture](#product-architecture)
5. [Core Concepts](#core-concepts)
6. [MVP Specification](#mvp-specification)
7. [Technical Stack](#technical-stack)
8. [Data Models](#data-models)
9. [User Flows](#user-flows)
10. [UI/UX Guidelines](#uiux-guidelines)
11. [Security & Compliance](#security--compliance)
12. [Integration Roadmap](#integration-roadmap)
13. [Development Phases](#development-phases)
14. [Success Metrics](#success-metrics)

---

## Executive Summary

Pathfinder is a guided financial decision and execution platform designed to transform how people approach financial planning. Unlike traditional tools that focus on calculators, projections, and net worth tracking, Pathfinder centers on **decision orchestration**—helping users understand which decisions matter most, providing clear recommendations with tradeoffs, and converting those decisions into actionable, prioritized tasks.

The platform serves two user modes: **Consumer Mode** for individuals managing their own financial journey, and **Advisor Mode** for financial professionals guiding multiple clients. Both modes share a unified data model and planning logic, enabling seamless collaboration.

The initial market focus is **U.S. federal employees approaching retirement**, a niche with complex benefit systems (FERS, TSP, survivor benefits, FEGLI) where mistakes are costly and irreversible. This serves as the beachhead market before expanding to general retirement planning, income strategy, business owners, and other complex planning scenarios.

---

## Vision & Problem Statement

### The Problem

Most financial tools today focus on:
- Net worth tracking
- Budgets and spending
- Investment portfolios
- Retirement projections

But they fail to address the **real problems** people face:
- **Decision paralysis**: They don't know which decisions matter most
- **Overwhelm**: Too many options without clear guidance
- **Confidence gap**: Lack of certainty in their choices
- **Follow-through failure**: Struggle with execution and coordination

### The Vision

Pathfinder functions as a **financial operating system for decision-making**:

1. **Capture** personal goals, concerns, and preferences in structured ways
2. **Surface** relevant strategies based on those inputs
3. **Present** recommendations clearly with explicit tradeoffs
4. **Convert** decisions into prioritized tasks and timelines
5. **Maintain** living plans that update as life and laws change

### What This Is Not

Pathfinder is **not primarily a calculator platform**. Calculators (pension estimates, income projections, tax analysis) are supporting tools, not the main product.

The core product is:
- Decision orchestration
- Strategy coordination
- Plan execution tracking

### Product Philosophy

> **The plan is not a document. The plan is a living workflow.**

Discovery → drives Strategy → drives Tools → drives Tasks

---

## Target Market

### Primary Market (Initial Focus)

**U.S. Federal Employees Approaching Retirement**

Why this niche:
- Complex benefit systems requiring coordination (FERS, TSP, survivor benefits, FEGLI)
- Mistakes are costly and often irreversible
- Planning requires understanding multiple interconnected decision areas
- Existing domain expertise and calculator tools already built
- Underserved by general financial planning software

### Secondary Markets (Future Expansion)

1. General retirement planning
2. Income strategy execution
3. Business owners and tax strategy
4. Other complex planning scenarios

**Federal employees are the beachhead, not the ceiling.**

---

## Product Architecture

### User Modes

#### Consumer Mode
- Individual users create their own financial profile
- Guided through structured discovery exercises
- System identifies key decisions and priorities
- Receives guided plan and task timeline
- Option to invite an advisor to collaborate

#### Advisor Mode
- Advisors manage multiple clients
- Guide clients through same discovery and planning flows
- System helps structure recommendations
- Generate plan summaries and action steps
- Ongoing monitoring and updates built into workflows

### Architecture Principle

Both modes use the **same core data model and planning logic**. The difference is in:
- Interface presentation
- Permission levels
- Multi-client management capabilities

### Sharing Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Consumer App                              │
│  ┌─────────────┐                                            │
│  │   Client    │ ──── Share Access ────┐                    │
│  │   Profile   │                       │                    │
│  └─────────────┘                       ▼                    │
│                                 ┌─────────────┐             │
│                                 │   Advisor   │             │
│                                 │    View     │             │
│                                 └─────────────┘             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Advisor App                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Client A   │  │  Client B   │  │  Client C   │         │
│  │   Profile   │  │   Profile   │  │   Profile   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│                 ┌─────────────────┐                          │
│                 │ Advisor Dashboard│                         │
│                 └─────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### The Financial Decision Profile

The central data structure capturing **who the person is, what matters to them, and what constrains them**. This is not intake—this is **decision modeling**.

The profile feeds:
- Strategy rules (which strategies to surface)
- Plan narrative (how to frame recommendations)
- Task prioritization (what to do first)

### Planning Stages

Users are classified into planning stages that determine which tools, strategies, and recommendations are relevant:

| Stage | Description | Typical Decisions |
|-------|-------------|-------------------|
| Pre-Retirement (5+ years) | Long-term strategy phase | Asset allocation, savings optimization |
| Pre-Retirement (3-5 years) | Strategy refinement phase | Pension analysis, timing decisions |
| Final Year | Execution phase | Benefit elections, income structuring |
| Post-Retirement | Maintenance phase | Distribution strategy, tax management |

### Strategy Weighting System

Behind-the-scenes indicators that influence recommendation engines:

- **Security Focus**: High/Medium/Low
- **Growth Orientation**: High/Medium/Low
- **Complexity Tolerance**: High/Medium/Low
- **Flexibility Preference**: High/Medium/Low
- **Advisor Dependence**: High/Medium/Low

### Role of AI

AI will be used **carefully and conservatively**.

**AI Will Assist With:**
- Summarizing conversations
- Extracting themes from free-text responses
- Drafting narrative explanations
- Organizing notes

**AI Will NOT:**
- Select financial strategies
- Make recommendations
- Determine eligibility
- Replace rule-based planning logic

**All strategy selection and eligibility logic will be:**
- Rules-based
- Transparent
- Auditable

This is critical for trust, compliance, and reducing hallucination risk.

---

## MVP Specification

### MVP Goal

To produce a structured **Financial Decision Profile** that captures who the person is, what matters to them, and what constraints they have, so that meaningful planning decisions can follow.

### MVP Scope: "Get Organized" Module

The MVP focuses entirely on the "Get Organized" phase—currently the most painful and time-consuming part of the advisor workflow and the most confusing part for consumers.

### MVP Sections

#### Section 1: Basic Context
**Purpose:** Anchor recommendations in real life

Fields:
- Name
- Age / birth year
- Marital status
- Spouse/partner details (if applicable)
- Kids / dependents
- Occupation
- Federal employee status
  - Agency
  - Years of service
  - FERS/CSRS classification
  - Pay grade/step
- Optional: Faith/community involvement (if relevant to planning philosophy)

**Note:** This is not CRM. Keep it minimal.

#### Section 2: Retirement Vision & Concerns
**Purpose:** Frame every later recommendation

Prompt types:
- Short responses
- Select-all-that-apply
- Tradeoff exercises

Key areas:
- Target retirement window
- What a good retirement looks like
- Top concerns about retirement
- Must-have outcomes
- Nice-to-have outcomes
- What would make them delay retirement

Tagging outputs:
- Lifestyle goals
- Health concerns
- Spouse/family security
- Work identity
- Financial fears

#### Section 3: Planning & Decision Preferences
**Purpose:** Prevent recommendation mismatch

Key prompts:
- "I prefer simple plans even if they are not perfectly optimized"
- "I'm comfortable learning new financial strategies"
- "I want professional guidance on most decisions"

Outputs:
- Complexity tolerance score
- Advisor involvement preference
- Education level needed in plan

This controls:
- How much explanation to show
- How aggressive strategies should be
- Level of detail in recommendations

#### Section 4: Risk & Income Comfort
**Purpose:** Understand retirement risk tolerance (not just investment risk)

Key prompts:
- "Would you rather have stable income or higher upside with variability?"
- "If markets were down, would you reduce spending or delay retirement?"
- Preference for guaranteed vs. flexible income
- Willingness to adjust spending or retirement timing

Outputs:
- Income stability preference score
- Market volatility response pattern
- Retirement timing flexibility

#### Section 5: Financial Snapshot (Light)
**Purpose:** Enough data to guide decisions, not replace eMoney

Collect:
- Rough investment totals by account type
- Account types (TSP, IRA, Roth, taxable)
- Debt yes/no and type (mortgage, car, student loans, credit)
- Major assets (home, rental property, business)
- Emergency reserves estimate

**DO NOT collect:**
- Full transaction-level data
- Exact balances
- Account numbers

Goal: "What tools should even be on the table?"

### MVP Deliverables

1. **Structured Client Profile** - Complete data model with all sections
2. **Tagged Priorities and Preferences** - Weighted indicators for planning logic
3. **Planning Stage Classification** - System-determined stage assignment
4. **Profile Summary View** - Human-readable summary of the complete profile

### MVP Testing Plan

- Test with self first
- Test with real clients
- Test in both advisor-guided and self-guided modes

### MVP Exclusions

**Not required for MVP:**
- Projections or calculators
- AI features
- Account syncing
- PDF uploads
- Tax return parsing
- Document vault
- AI transcription
- Task management
- Plan generation

---

## Technical Stack

### Core Technologies

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React 18+ | Modern, component-based, large ecosystem |
| Styling | Tailwind CSS | Utility-first, rapid development, consistent design |
| State Management | React Context + Zustand | Simple for MVP, scalable for growth |
| Routing | React Router v6 | Industry standard, supports nested routes |
| Forms | React Hook Form + Zod | Type-safe validation, excellent performance |
| Build Tool | Vite | Fast development, optimized builds |

### Future Considerations

| Technology | Purpose | When to Add |
|------------|---------|-------------|
| Tauri + Rust | Desktop app wrapper | Post-MVP if desktop distribution needed |
| PostgreSQL | Production database | When moving beyond local testing |
| Supabase/Firebase | Auth + Backend | When adding multi-user support |
| Stripe | Payment processing | When launching subscription model |

### Development Environment

```
/pathfinder
├── /src
│   ├── /components        # Reusable UI components
│   │   ├── /common        # Buttons, inputs, cards
│   │   ├── /discovery     # Discovery-specific components
│   │   └── /layout        # Navigation, headers, footers
│   ├── /pages             # Route-level components
│   ├── /hooks             # Custom React hooks
│   ├── /stores            # Zustand stores
│   ├── /utils             # Helper functions
│   ├── /types             # TypeScript type definitions
│   ├── /services          # API and business logic
│   └── /data              # Static data, question banks
├── /public                # Static assets
├── /docs                  # Documentation
│   └── DESIGN_DOCUMENT.md # This file
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Code Standards

- TypeScript strict mode enabled
- ESLint + Prettier for code consistency
- Component-first architecture
- Separation of concerns (UI vs business logic)
- Comprehensive type definitions for all data models

---

## Data Models

### Core Types

```typescript
// User identity
interface User {
  id: string;
  email: string;
  role: 'consumer' | 'advisor';
  createdAt: Date;
  updatedAt: Date;
}

// The central profile structure
interface FinancialProfile {
  id: string;
  userId: string;
  status: ProfileStatus;
  basicContext: BasicContext;
  retirementVision: RetirementVision;
  planningPreferences: PlanningPreferences;
  riskComfort: RiskComfort;
  financialSnapshot: FinancialSnapshot;
  systemClassifications: SystemClassifications;
  advisorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ProfileStatus = 
  | 'not_started'
  | 'in_progress' 
  | 'complete'
  | 'needs_review';
```

### Section Data Models

```typescript
// Section 1: Basic Context
interface BasicContext {
  firstName: string;
  lastName: string;
  birthDate: Date;
  maritalStatus: MaritalStatus;
  spouse?: SpouseInfo;
  dependents: Dependent[];
  occupation: string;
  federalEmployee: FederalEmployeeInfo | null;
  hobbiesInterests?: string[];
  communityInvolvement?: string;
}

type MaritalStatus = 
  | 'single' 
  | 'married' 
  | 'divorced' 
  | 'widowed' 
  | 'domestic_partnership';

interface SpouseInfo {
  firstName: string;
  birthDate: Date;
  employmentStatus: EmploymentStatus;
  hasPension: boolean;
  pensionDetails?: string;
}

interface FederalEmployeeInfo {
  agency: string;
  yearsOfService: number;
  retirementSystem: 'FERS' | 'CSRS' | 'FERS_RAE' | 'FERS_FRAE';
  payGrade: string;
  step: number;
  isLawEnforcement: boolean;
  hasMilitaryService: boolean;
  militaryServiceYears?: number;
}

interface Dependent {
  relationship: string;
  birthDate: Date;
  financiallyDependent: boolean;
}
```

```typescript
// Section 2: Retirement Vision
interface RetirementVision {
  targetRetirementAge: number | null;
  targetRetirementYear: number | null;
  retirementFlexibility: Flexibility;
  visionDescription: string;
  topConcerns: RetirementConcern[];
  mustHaveOutcomes: string[];
  niceToHaveOutcomes: string[];
  lifestylePriorities: LifestylePriority[];
  financialPurposeStatement?: string;
}

type Flexibility = 
  | 'very_flexible'    // Could adjust 3+ years
  | 'somewhat_flexible' // Could adjust 1-2 years
  | 'fixed';           // Specific date required

interface RetirementConcern {
  concern: ConcernType;
  severity: 'high' | 'medium' | 'low';
  notes?: string;
}

type ConcernType =
  | 'outliving_savings'
  | 'healthcare_costs'
  | 'spouse_security'
  | 'market_volatility'
  | 'inflation'
  | 'healthcare_coverage'
  | 'boredom_identity'
  | 'family_obligations'
  | 'unexpected_expenses'
  | 'other';

interface LifestylePriority {
  priority: string;
  rank: number;
}
```

```typescript
// Section 3: Planning Preferences
interface PlanningPreferences {
  complexityTolerance: ToleranceLevel;
  financialProductComfort: ComfortLevel;
  advisorInvolvementDesire: InvolvementLevel;
  decisionMakingStyle: DecisionStyle;
  educationPreference: EducationPreference;
  valuesPriorities: ValueRanking[];
  tradeoffPreferences: TradeoffPreference[];
}

type ToleranceLevel = 1 | 2 | 3 | 4 | 5; // 1=lowest, 5=highest

type ComfortLevel = 
  | 'very_low'
  | 'low' 
  | 'moderate'
  | 'high'
  | 'very_high';

type InvolvementLevel =
  | 'diy'              // Want to do it myself
  | 'guidance'         // Want guidance on major decisions
  | 'collaborative'    // Want to work together closely
  | 'delegated';       // Want advisor to handle most things

type DecisionStyle =
  | 'analytical'       // Wants all the data
  | 'intuitive'        // Goes with gut feeling
  | 'consultative'     // Seeks others' opinions
  | 'deliberate';      // Takes time, considers carefully

interface ValueRanking {
  value: ValueType;
  rank: number;
}

type ValueType =
  | 'family_security'
  | 'health_peace_of_mind'
  | 'freedom_of_time'
  | 'enjoyment_experiences'
  | 'legacy_giving'
  | 'financial_independence'
  | 'helping_others'
  | 'personal_growth';

interface TradeoffPreference {
  tradeoff: string;
  preference: 'strongly_a' | 'lean_a' | 'neutral' | 'lean_b' | 'strongly_b';
  optionA: string;
  optionB: string;
}
```

```typescript
// Section 4: Risk & Income Comfort
interface RiskComfort {
  investmentRiskTolerance: ToleranceLevel;
  incomeStabilityPreference: StabilityPreference;
  marketDownturnResponse: DownturnResponse;
  guaranteedIncomeImportance: ImportanceLevel;
  flexibilityVsSecurityPreference: number; // -5 to +5 scale
  spendingAdjustmentWillingness: WillingnessLevel;
  retirementTimingFlexibility: TimingFlexibility;
}

type StabilityPreference =
  | 'strong_stability'    // Must have predictable income
  | 'prefer_stability'    // Prefer stable but some flex ok
  | 'balanced'            // Mix of stable and variable
  | 'prefer_growth'       // Willing to accept variability
  | 'strong_growth';      // Maximize upside, handle volatility

type DownturnResponse =
  | 'reduce_spending'
  | 'delay_retirement'
  | 'work_part_time'
  | 'stay_the_course'
  | 'unsure';

type ImportanceLevel = 
  | 'critical'
  | 'very_important'
  | 'somewhat_important'
  | 'not_important';

type WillingnessLevel =
  | 'very_willing'
  | 'somewhat_willing'
  | 'reluctant'
  | 'unwilling';

interface TimingFlexibility {
  willingToDelay: boolean;
  maxDelayYears: number;
  willingToRetireEarly: boolean;
  conditions?: string;
}
```

```typescript
// Section 5: Financial Snapshot
interface FinancialSnapshot {
  incomeSourcesCurrent: IncomeSource[];
  incomeSourcesRetirement: ExpectedRetirementIncome[];
  investmentAccounts: AccountSummary[];
  debts: DebtSummary[];
  majorAssets: AssetSummary[];
  emergencyReserves: EmergencyReserves;
  insuranceCoverage: InsuranceSummary;
}

interface IncomeSource {
  type: 'salary' | 'self_employment' | 'rental' | 'pension' | 'social_security' | 'other';
  description: string;
  annualAmount: number;
  isPrimary: boolean;
}

interface ExpectedRetirementIncome {
  type: RetirementIncomeType;
  estimatedAnnualAmount?: number;
  startAge?: number;
  isGuaranteed: boolean;
  notes?: string;
}

type RetirementIncomeType =
  | 'fers_pension'
  | 'csrs_pension'
  | 'social_security'
  | 'tsp_withdrawals'
  | 'other_pension'
  | 'rental_income'
  | 'part_time_work'
  | 'other';

interface AccountSummary {
  type: AccountType;
  approximateBalance: BalanceRange;
  notes?: string;
}

type AccountType =
  | 'tsp_traditional'
  | 'tsp_roth'
  | 'traditional_ira'
  | 'roth_ira'
  | '401k'
  | 'taxable_brokerage'
  | 'savings'
  | 'other';

type BalanceRange =
  | 'under_10k'
  | '10k_50k'
  | '50k_100k'
  | '100k_250k'
  | '250k_500k'
  | '500k_1m'
  | '1m_2m'
  | 'over_2m';

interface DebtSummary {
  type: 'mortgage' | 'car' | 'student_loan' | 'credit_card' | 'other';
  approximateBalance: BalanceRange;
  yearsRemaining?: number;
  notes?: string;
}

interface AssetSummary {
  type: 'primary_home' | 'rental_property' | 'business' | 'vehicle' | 'other';
  approximateValue?: BalanceRange;
  notes?: string;
}

interface EmergencyReserves {
  monthsOfExpenses: number;
  location: 'savings' | 'money_market' | 'mixed' | 'other';
}

interface InsuranceSummary {
  hasLifeInsurance: boolean;
  lifeInsuranceType?: 'fegli' | 'private_term' | 'private_whole' | 'mixed';
  hasLongTermCare: boolean;
  hasDisability: boolean;
  notes?: string;
}
```

```typescript
// System-Generated Classifications
interface SystemClassifications {
  planningStage: PlanningStage;
  upcomingDecisionWindows: DecisionWindow[];
  strategyWeights: StrategyWeights;
  profileCompleteness: number; // 0-100
  lastUpdated: Date;
}

type PlanningStage =
  | 'early_career'           // 10+ years from retirement
  | 'mid_career'             // 5-10 years from retirement
  | 'pre_retirement'         // 3-5 years from retirement
  | 'final_year'             // Within 1 year of retirement
  | 'post_retirement';       // Already retired

interface DecisionWindow {
  decision: string;
  timeframe: string;
  urgency: 'immediate' | 'upcoming' | 'future';
  relatedStrategies: string[];
}

interface StrategyWeights {
  securityFocus: number;      // 0-100
  growthOrientation: number;  // 0-100
  complexityTolerance: number; // 0-100
  flexibility: number;        // 0-100
  advisorDependence: number;  // 0-100
}
```

---

## User Flows

### Discovery Wizard Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DISCOVERY WIZARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  Basic   │──▶│ Retirement│──▶│ Planning │──▶│   Risk   │ │
│  │ Context  │   │  Vision  │   │Preferences│   │ Comfort  │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│                                                      │       │
│                                                      ▼       │
│                                              ┌──────────┐   │
│                                              │ Financial│   │
│                                              │ Snapshot │   │
│                                              └──────────┘   │
│                                                      │       │
│                                                      ▼       │
│                                              ┌──────────┐   │
│                                              │ Profile  │   │
│                                              │ Summary  │   │
│                                              └──────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Section Flow Detail

Each section follows a consistent pattern:

1. **Introduction Screen** - Brief explanation of what we're exploring and why
2. **Question Screens** - 3-8 questions using various input types
3. **Review Screen** - Summary of responses with edit capability
4. **Transition** - Smooth move to next section

### Input Types by Section

| Section | Primary Input Types |
|---------|---------------------|
| Basic Context | Text fields, dropdowns, date pickers |
| Retirement Vision | Free text, multi-select, sliders |
| Planning Preferences | Card sorting, tradeoff pairs, scales |
| Risk Comfort | Scenario choices, sliders, rankings |
| Financial Snapshot | Range selectors, yes/no, categorized lists |

### Progress & State Management

- Auto-save after each question
- Progress indicator showing section completion
- Ability to jump between completed sections
- Clear indication of required vs optional fields
- Resume capability if session interrupted

---

## UI/UX Guidelines

### Design Principles

1. **Conversational, Not Clinical**
   - Discovery should feel like a thoughtful conversation
   - Avoid intake form aesthetics
   - Questions should prompt reflection

2. **One Thing at a Time**
   - Focus user attention on current question
   - Minimize cognitive load
   - Progressive disclosure of complexity

3. **Minimal Friction**
   - Smart defaults where appropriate
   - Skip logic for irrelevant questions
   - Mobile-friendly touch targets

4. **Trust Through Transparency**
   - Explain why each question matters
   - Show how responses will be used
   - Clear data handling practices

### Visual Design

**Color Palette:**
```css
/* Primary */
--color-primary: #1E40AF;      /* Trust blue */
--color-primary-light: #3B82F6;
--color-primary-dark: #1E3A8A;

/* Neutral */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-600: #4B5563;
--color-gray-900: #111827;

/* Accent */
--color-success: #059669;
--color-warning: #D97706;
--color-error: #DC2626;

/* Background */
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #F9FAFB;
```

**Typography:**
```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Scale */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

**Spacing:**
```css
/* Spacing scale */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Component Patterns

**Question Card:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Question text goes here, written in a conversational       │
│  tone that prompts reflection?                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │              [Input Component]                       │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  (Helper text explaining context or providing example)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Tradeoff Selector:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Which is more important to you?                            │
│                                                              │
│  ┌───────────────────┐       ┌───────────────────┐         │
│  │                   │       │                   │         │
│  │  Predictable      │   vs  │  Flexibility      │         │
│  │  Monthly Income   │       │  and Growth       │         │
│  │                   │       │                   │         │
│  └───────────────────┘       └───────────────────┘         │
│                                                              │
│  ◀━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━▶                     │
│  Strongly    Lean    Neutral    Lean    Strongly           │
│  Prefer A    A                  B       Prefer B           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Card Sort/Ranking:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Drag to rank what matters most to you                      │
│                                                              │
│  1. ┌─────────────────────────────────────────┐            │
│     │ ≡ Family Security                        │            │
│     └─────────────────────────────────────────┘            │
│  2. ┌─────────────────────────────────────────┐            │
│     │ ≡ Freedom of Time                        │            │
│     └─────────────────────────────────────────┘            │
│  3. ┌─────────────────────────────────────────┐            │
│     │ ≡ Health & Peace of Mind                 │            │
│     └─────────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **Desktop (1024px+):** Full wizard with side navigation
- **Tablet (768px-1023px):** Condensed wizard, stacked navigation
- **Mobile (< 768px):** Full-screen questions, bottom navigation

### Accessibility

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader optimized
- Color contrast ratios ≥ 4.5:1
- Focus states clearly visible

---

## Security & Compliance

### Data Protection

**At Rest:**
- All personal data encrypted (AES-256)
- Secure credential storage
- No client financial account credentials stored

**In Transit:**
- TLS 1.3 for all communications
- Certificate pinning for mobile apps

### Privacy Principles

1. **Minimal Collection:** Only collect what's needed for planning
2. **Purpose Limitation:** Data used only for stated purposes
3. **User Control:** Easy export and deletion
4. **Transparency:** Clear privacy policy, no surprise data uses

### Compliance Considerations

**Future Requirements (not MVP):**
- SOC 2 Type II certification (for enterprise sales)
- State privacy law compliance (CCPA, etc.)
- Financial industry regulations review

### Authentication (Future)

- Email + password with strong requirements
- Multi-factor authentication option
- Session management with secure tokens
- Rate limiting on auth endpoints

---

## Integration Roadmap

### Existing Tools to Integrate

| Tool | Description | Integration Phase |
|------|-------------|-------------------|
| Federal Benefits Analyzer | FERS/TSP calculations | Phase 2 |
| Income Planning Tools | Distribution strategies | Phase 3 |
| Letter Generator | Client communication | Phase 3 |
| eMoney | Financial projections | Phase 4 (export) |
| Riskalyze | Risk assessment | Phase 4 (optional) |
| Holistiplan | Tax analysis | Phase 4 (optional) |

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Pathfinder Core                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Financial Decision Profile              │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│              ┌─────────────┼─────────────┐                  │
│              ▼             ▼             ▼                  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  │  Strategy     │ │   Planning    │ │    Task       │    │
│  │  Engine       │ │   Narrative   │ │   Manager     │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
│              │             │             │                  │
└──────────────┼─────────────┼─────────────┼──────────────────┘
               │             │             │
    ┌──────────┼─────────────┼─────────────┼──────────────┐
    │          ▼             ▼             ▼              │
    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
    │  │  Federal    │ │   Income    │ │   Letter    │   │
    │  │  Benefits   │ │   Planner   │ │   Generator │   │
    │  │  Analyzer   │ │             │ │             │   │
    │  └─────────────┘ └─────────────┘ └─────────────┘   │
    │                                                     │
    │              Integrated Tools Layer                 │
    └─────────────────────────────────────────────────────┘
```

---

## Development Phases

### Phase 1: MVP Foundation (Current)
**Timeline:** 4-6 weeks
**Goal:** Complete "Get Organized" module

Deliverables:
- [ ] Project scaffolding (React + Tailwind + TypeScript)
- [ ] Basic Context section (complete)
- [ ] Retirement Vision section (complete)
- [ ] Planning Preferences section (complete)
- [ ] Risk & Income Comfort section (complete)
- [ ] Financial Snapshot section (complete)
- [ ] Profile summary view
- [ ] Local data persistence
- [ ] Basic advisor vs consumer mode toggle

### Phase 2: Strategy Foundation
**Timeline:** 4-6 weeks
**Goal:** Connect profiles to recommendations

Deliverables:
- [ ] Planning stage classification logic
- [ ] Strategy filtering based on profile
- [ ] Federal Benefits Analyzer integration
- [ ] Basic recommendation surfacing
- [ ] Decision window identification

### Phase 3: Plan Generation
**Timeline:** 6-8 weeks
**Goal:** Generate actionable plans

Deliverables:
- [ ] Plan narrative generator
- [ ] Task creation and management
- [ ] Timeline visualization
- [ ] Letter/document integration
- [ ] Plan export capabilities

### Phase 4: Production Readiness
**Timeline:** 6-8 weeks
**Goal:** Ready for paid subscriptions

Deliverables:
- [ ] User authentication system
- [ ] Multi-client management (advisor)
- [ ] Payment integration (Stripe)
- [ ] Client portal sharing
- [ ] Web hosting deployment
- [ ] Mobile responsiveness polish

### Phase 5: Scale & Enhance
**Timeline:** Ongoing
**Goal:** Expand capabilities

Deliverables:
- [ ] AI-assisted summarization
- [ ] External tool integrations
- [ ] Advanced analytics
- [ ] Plan monitoring automation
- [ ] Life event triggers

---

## Success Metrics

### MVP Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile Completion Rate | >80% | % of started profiles completed |
| Time to Complete | <20 min | Average time for full discovery |
| Advisor Time Savings | >30% | Compared to current process |
| Client Feedback | >4/5 | Satisfaction rating |
| Data Quality | >90% | Usable profile data percentage |

### Long-term Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users | 100+ (Y1) | Unique users per month |
| Client Conversion | >50% | Profile → Paid plan |
| Task Completion Rate | >70% | Planned tasks completed |
| Advisor Adoption | 10+ firms (Y1) | Paying advisor accounts |
| Net Promoter Score | >40 | User recommendations |

---

## Appendix A: Example Financial Decision Profile Output

```
═══════════════════════════════════════════════════════════════
                 FINANCIAL DECISION PROFILE
═══════════════════════════════════════════════════════════════

CLIENT OVERVIEW
───────────────────────────────────────────────────────────────
Name: Mark Thompson
Age: 58
Marital Status: Married
Dependents: None at home
Occupation: Federal Program Analyst (GS-13)
Federal Service: 24 years (FERS)
Spouse Employment: Part-time, no pension

Hobbies & Interests: Hiking, woodworking, volunteering at 
local food bank, travel with spouse

───────────────────────────────────────────────────────────────
RETIREMENT VISION
───────────────────────────────────────────────────────────────
Target Retirement Window: Between age 60 and 62 (flexible)

What a Good Retirement Looks Like:
More time outdoors, travel 1-2 times per year, continued 
volunteer work, less stress and rigid schedules

Top Concerns About Retirement:
• Outliving savings (HIGH)
• Health care costs (HIGH)
• Leaving spouse financially secure (HIGH)

Must-Have Outcomes:
• Stable monthly income
• Ability to handle medical expenses
• Not needing to return to full-time work

Nice-to-Have Outcomes:
• Extra travel budget
• Ability to help grandchildren with education later

───────────────────────────────────────────────────────────────
GOALS & OBJECTIVES
───────────────────────────────────────────────────────────────
Primary Goals (High Priority):
1. Retire by age 61 with stable income
2. Ensure spouse is financially secure if client dies first
3. Pay off mortgage before or shortly after retirement

Secondary Goals (Medium Priority):
1. Maintain ability to travel annually in early retirement
2. Support charitable giving during retirement

Long-Term Goals (Lower Priority):
1. Potential education support for grandchildren

───────────────────────────────────────────────────────────────
FINANCIAL PURPOSE STATEMENT
───────────────────────────────────────────────────────────────
"Money is mainly about providing stability for my family and 
giving us freedom to enjoy life without constant financial 
stress."

───────────────────────────────────────────────────────────────
VALUES & PRIORITIES
───────────────────────────────────────────────────────────────
Top Planning Priorities (Ranked):
1. Family security
2. Health and peace of mind
3. Freedom of time
4. Enjoyment and experiences
5. Legacy giving

Tradeoff Preferences:
• Prefers security over maximizing returns
• Will accept modest lifestyle limits to protect spouse
• Comfortable giving up some growth for predictability

───────────────────────────────────────────────────────────────
DECISION & COMPLEXITY PREFERENCES
───────────────────────────────────────────────────────────────
Planning Style: Prefers simple, understandable strategies 
over highly optimized but complex plans

Financial Product Comfort: Low to moderate
Prefers clear explanations and fewer moving parts

Advisor Involvement: Wants professional guidance for major 
decisions, comfortable handling routine tasks

───────────────────────────────────────────────────────────────
RISK & INCOME COMFORT
───────────────────────────────────────────────────────────────
Investment Risk Tolerance: Moderate-low

Income Stability Preference: Strong preference for guaranteed 
or predictable income covering core expenses

Market Downturn Response: Would prefer to adjust spending 
slightly rather than take major portfolio risks

Retirement Timing Flexibility: Willing to delay retirement 
up to 2 years if needed to improve long-term security

───────────────────────────────────────────────────────────────
FINANCIAL SNAPSHOT
───────────────────────────────────────────────────────────────
Primary Income Sources (Pre-Retirement):
• Federal salary (Primary)
• Spouse part-time income

Expected Retirement Income:
• FERS pension
• Social Security (estimated)
• TSP withdrawals

Investment Accounts:
• TSP: Traditional ($250k-$500k range)
• Roth IRA ($50k-$100k range)
• Taxable brokerage ($10k-$50k range)

Debt:
• Mortgage: 6 years remaining

Emergency Reserves: 3-4 months of expenses

───────────────────────────────────────────────────────────────
PLANNING STAGE CLASSIFICATION [System Generated]
───────────────────────────────────────────────────────────────
Current Stage: Pre-Retirement Strategy Phase (3-5 years out)

Upcoming Decision Windows:
• Pension election analysis
• Retirement timing modeling
• Income strategy design
• Survivor benefit evaluation

───────────────────────────────────────────────────────────────
STRATEGY WEIGHTING INDICATORS [For Planning Engine]
───────────────────────────────────────────────────────────────
Security Focus: HIGH (85/100)
Growth Orientation: MEDIUM-LOW (35/100)
Complexity Tolerance: LOW (25/100)
Flexibility: MEDIUM (50/100)
Advisor Dependence: MEDIUM-HIGH (70/100)

───────────────────────────────────────────────────────────────
ADVISOR NOTES
───────────────────────────────────────────────────────────────
• Client anxious about healthcare and long-term stability
• Strong motivation to retire earlier if income can be 
  stabilized
• Spouse should be included in survivor benefit discussion 
  early

═══════════════════════════════════════════════════════════════
```

---

## Appendix B: Question Bank (Section Samples)

### Retirement Vision Questions

**Open Response:**
1. "When you imagine yourself in retirement, what does a typical week look like?"
2. "What would you regret not doing if you delayed retirement too long?"
3. "Who are you most trying to protect financially?"

**Multi-Select (Concerns):**
"Which of these keep you up at night when you think about retirement?"
- [ ] Running out of money
- [ ] Healthcare costs getting out of control
- [ ] Leaving my spouse without enough income
- [ ] The stock market crashing
- [ ] Inflation eating away at my savings
- [ ] Losing my sense of purpose or identity
- [ ] Not being able to help family members
- [ ] Unexpected major expenses

**Slider:**
"How flexible is your retirement date?"
[Very Flexible] ━━━━━━━━━━━━━━━━━━━━ [Fixed Date]

### Planning Preference Questions

**Tradeoff Pairs:**

1. Security vs. Potential
   - A: "I'd rather have a slightly lower but guaranteed retirement income"
   - B: "I'd rather have potential for higher income even with some uncertainty"

2. Simplicity vs. Optimization
   - A: "Give me the simplest plan that works"
   - B: "I want the most optimized plan even if it's complex"

3. Independence vs. Guidance
   - A: "I want to understand everything and make my own decisions"
   - B: "I want an expert to tell me what to do"

**Value Ranking:**
"Drag to rank what matters most to you in retirement:"
- Family security
- Freedom to use time as I choose
- Health and peace of mind
- Experiences and enjoyment
- Leaving a legacy
- Continued personal growth

### Risk & Income Questions

**Scenario Choice:**
"The market drops 30% right after you retire. What would you do?"
- ( ) Significantly cut spending to avoid selling investments
- ( ) Make modest spending adjustments and wait it out
- ( ) Go back to work part-time
- ( ) Stick with my plan and ride it out
- ( ) I honestly don't know

**Scale:**
"How important is it that your core expenses are covered by guaranteed income (pension, Social Security)?"
[Not Important] ━━━━━━━━━━━━━━━━━━━━ [Absolutely Critical]

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Discovery** | The process of gathering information about a client's goals, values, situation, and preferences |
| **Financial Decision Profile** | The structured output of discovery—a comprehensive picture of who someone is financially |
| **Planning Stage** | System classification of where someone is in their planning journey |
| **Strategy Weights** | Behind-the-scenes scores that influence which recommendations are surfaced |
| **Decision Window** | A time-sensitive opportunity or requirement to make a financial decision |
| **Tradeoff** | A choice between two competing values or preferences |

---

*Document Version: 1.0*  
*Last Updated: January 2026*  
*Status: Active Development*
