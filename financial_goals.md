🎯 Financial Goals Discovery — Interactive Card Exercise
What This Module Must Accomplish

By the end, you want:

A ranked list of Top Financial Goals

Each goal tagged with:

Priority (High / Medium / Low)

Time Horizon (Near / Mid / Long)

Flexibility (Fixed vs Adjustable)

Enough structure to:

feed income modeling

drive planning priorities

surface conflicts

But the user experience must feel:

light

visual

not like filling out a worksheet

🧭 OVERALL FLOW
Phase 1: Free Recall (User-Generated Goals)
Phase 2: Prompted Discovery (System Goal Cards)
Phase 3: Priority Sorting
Phase 4: Time Horizon Layer
Phase 5: Tradeoff & Feasibility Check
Phase 6: Final Top Goals Selection

Each phase adds structure without overwhelming them.

✅ Phase 1 — Free Recall: “What comes to mind?”
Purpose

Get what is emotionally top-of-mind before system bias kicks in.

UI

Simple input loop:

Prompt:

When you think about your future and your money, what are some things you hope to do, buy, protect, or accomplish?

User can add:

“Pay off the house”

“Travel more”

“Help kids with college”

“Not worry about money”

Each becomes a custom goal card.

You store:

{ id, label, source: "user" }


No categorization yet.

✅ Phase 2 — Prompted Discovery: System Goal Cards

Now you show system-generated cards grouped internally but not visibly grouped.

Categories (internal only)

Lifestyle

Security & Protection

Family & Legacy

Career & Growth

Retirement

Health

Major Purchases

Giving

Example Goal Cards

Retire by a specific age

Maintain current lifestyle in retirement

Travel internationally every year

Buy or upgrade a home

Pay off all debt

Build emergency reserves

Ensure proper insurance coverage

Support children’s education

Care for aging parents

Start or grow a business

Reduce taxes over time

Leave an inheritance

Fund charitable giving

Have predictable income in retirement

User instruction:

Here are some common goals people often care about.
Add any that matter to you. Skip anything that does not.

They can:

select

ignore

add more custom ones

Now you have:

emotional goals (Phase 1)

common planning goals (Phase 2)

✅ Phase 3 — Priority Sorting

Now we introduce priority without time yet.

User sorts cards into:

🔥 High Priority

⚪ Medium Priority

❄ Low Priority

🚫 Not a Focus

Prompt:

If you had to decide where your financial energy should go first, how would you sort these?

This does two things:

forces thinking about tradeoffs

prevents everything being “important”

Store:

priority: "HIGH" | "MEDIUM" | "LOW" | "NA"

✅ Phase 4 — Time Horizon Layer

Now we add timing only for High and Medium goals.

For each card in High and Medium:

Prompt:

When do you ideally want to achieve this?

Options:

Short term (0–3 years)

Mid term (3–10 years)

Long term (10+ years)

Ongoing / continuous

Store:

timeHorizon: "SHORT" | "MID" | "LONG" | "ONGOING"


This is incredibly valuable for:

cash flow

investment allocation

savings strategy

✅ Phase 5 — Flexibility & Tradeoff Test (Key Differentiator)

Now we identify which goals bend and which do not.

For each High Priority goal:

Prompt:

If achieving this required adjusting other plans, how flexible is this goal?

Options:

Non-negotiable

Important but flexible

Would delay if needed

Then show 2–3 pairwise conflicts:

Example:

If you had to choose between retiring earlier or maintaining higher income security, which would you lean toward?

Use earlier tradeoff anchors when possible to keep consistency.

Store:

flexibility: "FIXED" | "FLEXIBLE" | "DEFERABLE"


Now you can distinguish:

goals that define strategy

goals that are aspirational

✅ Phase 6 — Final Goal Set

Now you summarize:

Top Goals (used in planning)

Criteria:

HIGH priority

SHORT or MID term OR FIXED flexibility

Prompt:

These are the goals your financial plan will focus on first.
Does this feel right?

Allow:

reclassification

manual override

Store:

isCorePlanningGoal: boolean

🧠 What Makes This Different From Other Goal Tools

Most tools do:

list goals

assign dates

You are extracting:

emotional salience

financial urgency

strategic rigidity

That is exactly what planners do in their heads during meetings.

You are systematizing judgment.

🔗 How This Connects to Your Other Modules
Values → tells you why
Purpose → tells you what money is for
Goals → tells you what to act on

Then later:

Income Planner

maps to retirement + lifestyle goals

Federal Analyzer

maps to survivor benefits, retirement timing

Task Engine

maps to core planning goals first

This becomes the backbone of your orchestration platform.

🧱 Data Model (Simplified)
interface FinancialGoal {
  id: string;
  label: string;

  source: "user" | "system";

  priority: "HIGH" | "MEDIUM" | "LOW" | "NA";
  timeHorizon?: "SHORT" | "MID" | "LONG" | "ONGOING";
  flexibility?: "FIXED" | "FLEXIBLE" | "DEFERABLE";

  isCorePlanningGoal: boolean;

  category: GoalCategory; // internal only
}

🎯 MVP VERSION (What I Would Build First)

To avoid scope creep:

MVP:

Phase 1: free recall

Phase 2: system cards

Phase 3: priority sort

Phase 4: time horizon

Phase 6: final goal list

Add later:

flexibility testing

conflict tradeoffs

AI summarization

Even MVP version will already outperform most planning software.