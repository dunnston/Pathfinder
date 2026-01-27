VALUES DISCOVERY MODULE — IMPLEMENTATION GUIDE (FOR CLAUDE CODE)
Goal

Implement a “Values Discovery” wizard that helps a client identify:

Top 5 core values (from a curated list of value cards)

Top 1–3 non-negotiables (subset of the top 5)

Derived insights:

Dominant value category (Security/Freedom/Family/Growth/Contribution/Purpose/Control/Health/QualityOfLife)

Secondary category

Category distribution over time (how it changed from Step 1 → Step 4 → Non-negotiables)

Tradeoff preferences from scenario questions (Step 5)

Optional: “Driving Force” (the single most represented category among top 5 or non-negotiables)

This module must be:

Distinct from third-party tools (no copying wording or branded methods)

Decision-oriented and financial-planning relevant

Usable in advisor-guided or client self-guided mode

Stored in a structured, reusable way that later drives planning logic

1) UX FLOW (WIZARD)
Entry Point

In the profile “Get Organized” stage, add a new section:

“Values Discovery”

Button: “Start / Continue”

Show completion status: Not started / In progress / Completed

Show summary when completed: Top 5 + Non-negotiables + Driving Force

Step 0: Intro (optional but helpful)

Explain what this is:

“This helps us understand what your financial plan should protect and prioritize when tradeoffs come up.”

Estimated time: 5–8 minutes

CTA: Start

Step 1: Broad Selection (Flat list, no categories shown)
UI

Display a searchable grid/list of “value cards”

Each card shows:

Title (short)

One-line description (planning-oriented)

Client sorts each card into one of three piles (or three-state selection):

Important to me

Unsure

Not important

UX constraints

Initial list size: 60–90 cards is okay, but optimize with:

Search

“Skip for now” (defaults to Unsure)

Progress indicator: “Reviewed 32/72”

Do NOT show categories here

Output

selectedImportant: cardIds[]

selectedUnsure: cardIds[]

selectedNotImportant: cardIds[]

Step 2: Resolve “Unsure” with scenarios (one-at-a-time)

For each card in Unsure:

Present card title + description

Ask a scenario-based question (financial decision context)

Two buttons:

“Yes, this matters” → move to Important

“No, not a priority” → move to Not important

Allow “Still unsure” to keep it in Unsure if user refuses (but encourage resolution)

Output

Unsure should be minimized; allow 0–3 to remain.

Add a resolutionLog with how each unsure card was resolved.

Step 3: Narrow to Top 10

From the Important pile:

Show only Important cards

Prompt:

“From what you chose as important, select the 10 that matter most when tradeoffs come up.”

Enforce exactly 10 if there are >=10

If user has <10 Important, allow proceed but flag “insufficient selection” and skip Step 3 enforcement

Output

top10: cardIds[] (length 10)

Step 4: Forced prioritization to Final Top 5

From top10, select final top5:

Prompt:

“If you could only protect five of these for the rest of your life, which five would you choose?”

Enforce exactly 5

Output

top5: cardIds[] (length 5)

Step 5: Tradeoff Validation (scenario tradeoffs)

Goal: validate priorities and extract weights that later drive plan style.

Approach

Generate 3–6 tradeoff questions based on the categories present in top5.

Each tradeoff question is between two “drivers” (categories), framed as a decision.

UI

Each question is a forced choice:

Option A vs Option B

Optionally a 5-point slider:

Strongly A / A / Neutral / B / Strongly B

Keep it quick: max 6 questions

Output

tradeoffResponses: list of { id, categoryA, categoryB, choice, strength }

Step 6: Non-negotiables (Top 1–3)

From top5:

Prompt:

“Select up to three values you would NOT compromise, even if it required changing your plans.”

Allow 1–3; allow 0 only if user insists

Output

nonNegotiables: cardIds[] (1–3)

Completion Screen (Summary)

Show:

Top 5 (ordered)

Non-negotiables

Driving Force (dominant category)

Secondary driver

“What this means” (short templated summary, NOT AI required)

Example summary template:

“Your plan should emphasize {dominantCategory}, while still supporting {secondaryCategory}.”

“In tradeoffs, you leaned toward {category} over {category}.”

2) VALUE CARD CONTENT (DATA)
Categories (internal, never shown to user)

Use 9 categories:

SECURITY

FREEDOM

FAMILY

GROWTH

CONTRIBUTION

PURPOSE

CONTROL

HEALTH

QUALITY_OF_LIFE

Card object

Each card has:

id: string (uuid or stable slug)

title: string

description: string (1 line)

category: enum

scenarioPrompt: string (for Step 2)

tradeoffTag: optional string[] (helps build tradeoffs)

isCustom: boolean

createdByUserId: optional

Example card (one)

id: security_emergency_preparedness

title: Emergency preparedness

description: Having reserves and plans to handle unexpected expenses without panic.

category: SECURITY

scenarioPrompt: If an unexpected $10,000 expense happened tomorrow, would being prepared matter more to you than maximizing long-term growth?

Custom cards

Allow user to add custom values:

user provides title + short description

assign category via:

user selection OR

default “UNKNOWN” then force user to pick one

custom cards are included in sorting lists

3) DATA MODEL (STORE IN PROFILE)

Add a valuesDiscovery object to the profile.

TypeScript-ish schema
type ValueCategory =
  | "SECURITY" | "FREEDOM" | "FAMILY" | "GROWTH" | "CONTRIBUTION"
  | "PURPOSE" | "CONTROL" | "HEALTH" | "QUALITY_OF_LIFE";

type Pile = "IMPORTANT" | "UNSURE" | "NOT_IMPORTANT";

type ValuesDiscoveryState = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type TradeoffChoice = "A" | "B" | "NEUTRAL";
type TradeoffStrength = 1 | 2 | 3 | 4 | 5; // 1 strong A, 3 neutral, 5 strong B

interface TradeoffResponse {
  id: string;
  categoryA: ValueCategory;
  categoryB: ValueCategory;
  choice: TradeoffChoice;
  strength: TradeoffStrength;
  createdAt: string;
}

interface UnsureResolution {
  cardId: string;
  from: "UNSURE";
  to: "IMPORTANT" | "NOT_IMPORTANT" | "UNSURE";
  answeredAt: string;
}

interface ValuesDiscovery {
  state: ValuesDiscoveryState;

  // Step 1 results
  piles: Record<string /*cardId*/, Pile>;
  step1CompletedAt?: string;

  // Step 2 results
  unsureResolutions: UnsureResolution[];
  step2CompletedAt?: string;

  // Step 3-4 results
  top10: string[]; // ordered
  top5: string[];  // ordered
  step4CompletedAt?: string;

  // Step 5 results
  tradeoffResponses: TradeoffResponse[];
  step5CompletedAt?: string;

  // Step 6 results
  nonNegotiables: string[]; // subset of top5
  step6CompletedAt?: string;

  // Derived insights
  derived?: {
    categoryCounts: {
      step1Important: Record<ValueCategory, number>;
      top10: Record<ValueCategory, number>;
      top5: Record<ValueCategory, number>;
      nonNegotiables: Record<ValueCategory, number>;
    };
    dominantCategory?: ValueCategory;
    secondaryCategory?: ValueCategory;
    drivingForce?: ValueCategory; // can equal dominantCategory
    conflictFlags?: string[]; // e.g., ["FREEDOM_vs_SECURITY"]
    controlVsFreedomIndex?: number; // 0..100 optional
    securityVsGrowthIndex?: number;  // 0..100 optional
  };

  completedAt?: string;
}


Store this within your existing profile record.

4) DERIVED LOGIC (SCORING + INSIGHTS)
Category distribution

Compute counts at each phase:

Step1Important: from piles IMPORTANT

Top10: from top10

Top5: from top5

NonNegotiables: from nonNegotiables

Dominant & secondary

Dominant category = most represented in top5

Tie-breaker:

most represented in nonNegotiables

most represented in top10

if still tied, choose the one with highest “tradeoff wins” in step 5

Secondary category = 2nd most represented in top5 using same tie-breakers

Conflict flags (simple and useful)

Common conflicts:

SECURITY vs FREEDOM

SECURITY vs GROWTH

CONTROL vs FREEDOM

FAMILY vs FREEDOM (time/obligation tradeoffs)

QUALITY_OF_LIFE vs SECURITY (spending vs safety)

Rule:

If both categories appear in top5 OR one is dominant and the other appears in nonNegotiables, flag it.

Example:

dominant SECURITY, FREEDOM present in top5 → flag SECURITY_vs_FREEDOM

Tradeoff “wins”

For each tradeoff question:

If choice is A (strength 1–2), categoryA gets points

If neutral (3) no points

If B (4–5), categoryB gets points

Strength weights:

strong side adds 2 points

mild adds 1 point

Use this to compute indices:

securityVsGrowthIndex: percent leaning SECURITY across SECURITY/GROWTH tradeoffs

controlVsFreedomIndex similarly

These indices are optional but useful for future plan style.

5) TRADEOFF QUESTION GENERATION
Inputs

categories present in top5

optional categories present in top10

Generation strategy

Select 3–6 pairs based on presence:

If SECURITY and FREEDOM both present: include SECURITY vs FREEDOM

If SECURITY and GROWTH present: include SECURITY vs GROWTH

If CONTROL and FREEDOM present: include CONTROL vs FREEDOM

If FAMILY and FREEDOM present: include FAMILY vs FREEDOM

If QUALITY_OF_LIFE and SECURITY present: include QUALITY_OF_LIFE vs SECURITY

If HEALTH present with anything: include HEALTH vs {dominant} as a resource allocation question

Use templates for each pair (write original phrasing).

Example tradeoff templates

SECURITY vs FREEDOM:

A: “I’d rather work longer or spend less to feel secure.”

B: “I’d rather accept more uncertainty to gain freedom sooner.”

SECURITY vs GROWTH:

A: “I prefer safer, steadier outcomes even if growth is lower.”

B: “I prefer higher upside even if results vary.”

CONTROL vs FREEDOM:

A: “I want a detailed plan and tight oversight to avoid surprises.”

B: “I want flexibility even if outcomes are less predictable.”

QUALITY_OF_LIFE vs SECURITY:

A: “I’d reduce lifestyle spending to build a stronger safety buffer.”

B: “I’d keep lifestyle spending and accept a smaller buffer.”

FAMILY vs FREEDOM:

A: “Supporting family is worth sacrificing personal flexibility.”

B: “I need flexibility even if it limits support I can provide.”

HEALTH vs {other}:

A: “I’d prioritize health-related spending even if it slows other goals.”

B: “I’d keep health spending minimal to accelerate other goals.”

6) UI COMPONENTS / SCREENS

Implement:

ValuesDiscoveryWizard container with route/state machine

Step screens:

ValuesIntro

ValuesSortStep (Step 1)

UnsureResolutionStep (Step 2)

TopNSelectionStep (Step 3 + Step 4 reuse component)

TradeoffValidationStep (Step 5)

NonNegotiablesStep (Step 6)

ValuesSummary

Reusable components:

ValueCard (title + description)

PileSelector (3 options)

SearchAndFilterBar

ProgressIndicator

SortableSelectionGrid (for picking top10 and top5)

TradeoffQuestion component (A/B + strength)

InlineCreateCustomValue modal

Accessibility:

keyboard navigation

clear buttons

“Save and Exit” always available

7) STATE MANAGEMENT

Use a deterministic state machine:

Guard rails for steps:

Cannot do Step 3 unless Step 1 done

Cannot do Step 4 unless top10 complete

Cannot do Step 6 unless top5 complete

Allow going back and editing; if earlier step changes, invalidate downstream steps:

If Step 1 changes after completion, clear top10/top5/tradeoffs/nonNegotiables and derived

Same if Step 3 changes, clear Step 4+.

Autosave:

Save after every action (pile change, selection change, tradeoff answer)

8) INTEGRATION INTO PROFILE SUMMARY

When completed, update the profile summary view to show:

“Core Values (Top 5)” list

“Non-negotiables” list

“Driving Force” (dominant category label; you can display the category name but not required)

Optionally: “In tradeoffs you leaned toward X over Y”

Also add to “Advisor Notes” auto-generated snippet:

“Values drivers: Security (dominant), Freedom (secondary). Non-negotiables include Emergency Preparedness, Family Support…”

Keep it editable.

9) TEST PLAN (VERY IMPORTANT)

Unit tests:

category counting

dominant/secondary tie-breaking

tradeoff scoring

downstream invalidation logic

Integration tests:

user completes flow from start to finish

user edits Step 1 after completion → downstream cleared

user creates custom value → appears in list and can be selected

UX tests (manual):

ensure flow takes <10 min

ensure user isn’t forced into too many selections

ensure summary is clear and not “psychological”

10) CONTENT LIST (STARTING CARDS)

Create an initial set of ~72 cards (8 per category) using your own original language.
Do NOT use third-party phrases.

You already have candidate topics; convert them into short titles + one-line descriptions + scenario prompts.

Important: keep descriptions planning-oriented and simple.

11) OUTPUT USED BY FUTURE MODULES

This module will later be used to:

weight income strategy preference

influence plan narrative tone (simple vs optimized)

prioritize decision modules (survivor benefits, healthcare, etc.)

generate tasks and education recommendations

For now, just store outputs cleanly.

Deliverable Summary

Implement:

New valuesDiscovery object on profile

Wizard UI steps 1–6 with autosave

Value card library with categories and prompts

Derived insights computation on completion

Profile summary rendering

Start with:

Step 1–4 + Summary (MVP of this module)
Then add:

Step 2 scenario resolution

Step 5 tradeoffs

Step 6 non-negotiables

List of Values to use orgainized by their hidden cateories. 

🔒 Security
Financial security


Emergency preparedness


Stable income


Predictable expenses


Insurance protection


Risk management


Debt reduction


Guaranteed income in retirement


Safe investments


Protection for dependents


Housing stability


Long term care readiness



🕊 Freedom
Financial independence


Work optional lifestyle


Flexible schedule


Ability to travel


Location independence


Early retirement option


Choice in career changes


Saying no to unwanted work


Time autonomy


Lifestyle flexibility



👨‍👩‍👧 Family
Providing for children


Supporting spouse or partner


College funding


Caring for aging parents


Family traditions and experiences


Inheritance planning


Generational stability


Family vacations


Keeping the family home


Being present for milestones



📈 Growth
Career advancement


Business ownership


Skill development


Education and training


Personal development


Trying new ventures


Building wealth


Expanding opportunities


Reinvention later in life


Lifelong learning



🤝 Contribution
Charitable giving


Supporting local community


Faith based giving


Volunteering


Funding causes they care about


Helping family financially


Mentoring others


Disaster or crisis support


Community leadership



🎯 Purpose
Meaningful work


Legacy building


Leaving a positive impact


Teaching values to children


Living according to beliefs


Stewardship of resources


Faith driven decisions


Being a good role model


Long term mission or vision



🎛 Control
Budgeting confidence


Clear financial plan


Understanding investments


Knowing where money goes


Managing tax exposure


Avoiding surprises


Organized finances


Decision making confidence


Ability to adapt plans


Planning for contingencies



❤️ Health
Access to healthcare


Medical expense protection


Preventive care


Mental well being


Stress reduction


Healthy lifestyle support


Ability to rest and recover


Coverage for major illness


Long term wellness planning



🌿 Quality of Life
Comfortable lifestyle


Enjoyment of hobbies


Travel experiences


Time with loved ones


Work life balance


Comfortable housing


Dining and entertainment


Leisure activities


Peaceful retirement


Daily enjoyment
