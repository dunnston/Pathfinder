🎯 OVERALL PURPOSE OF THIS SYSTEM

Transform Discovery Data into:

A Planning Posture (how this person should approach money decisions)

A ranked list of Planning Focus Areas (where effort should go)

A prioritized list of Action Recommendations (what to do next)

This system should:

Explain why recommendations exist

Respect values, goals, and constraints

Avoid optimization before priorities are clear

✅ PART 1: STRATEGY PROFILE ENGINE (PLANNING POSTURE)
Objective

Create a small number of human-readable planning traits that describe:

how cautious or aggressive the person should be

how flexible their timeline is

how complex their plan can realistically be

how emotionally sensitive they are to risk and uncertainty

These are not labels. They are decision lenses.

Inputs to Use

From Discovery:

Top Values (5)

Non-Negotiables (1–3)

Dominant Value Category

Primary and Secondary Purpose Drivers

Tradeoff Anchors

Top Financial Goals

Goal Time Horizons

Goal Flexibility Ratings

Age and Retirement Target

Strategy Dimensions to Generate

Claude should infer and assign:

1. Income Strategy Orientation

Determine whether planning should emphasize:

Stability and guarantees

Balanced growth and safety

Growth and optionality

This should be driven by:

dominance of Security vs Freedom vs Growth values

retirement proximity

tradeoff preferences involving certainty vs upside

2. Timing Sensitivity

Determine how sensitive the plan is to:

market downturns

delayed goals

income interruptions

Classify as:

High sensitivity (timing matters a lot)

Medium sensitivity

Low sensitivity (goals flexible, long horizons)

Driven by:

near-term high priority goals

rigid retirement timing

fixed financial commitments

3. Planning Flexibility

Assess how adaptable the plan can be when conditions change:

High flexibility (goals and methods can change)

Moderate flexibility

Low flexibility (structure and certainty preferred)

Driven by:

flexibility scores on goals

control-oriented values

non-negotiables count and type

4. Complexity Tolerance

Assess how much planning complexity the client can handle:

Simple and predictable preferred

Moderate complexity acceptable

Comfortable with advanced strategies

Driven by:

control values

financial confidence indicators

education and involvement preferences

5. Decision Support Needs

Determine how much guidance the client likely requires:

High guidance needed (confidence, structure, accountability)

Moderate guidance

Low guidance (self-directed, comfortable making changes)

Driven by:

control values

prior uncertainty responses

goal confidence indicators

Output

A short Strategy Profile Summary that reads like:

Planning should prioritize income stability over growth, with high sensitivity to retirement timing and limited flexibility for major income disruptions. The client prefers predictable strategies and will benefit from clear structure and ongoing guidance.

This is for:

advisors

future AI systems

explanation to clients

✅ PART 2: PLANNING FOCUS AREA PRIORITIZATION
Objective

Rank financial planning domains by importance for this person.

This answers:

Where should planning effort be concentrated first?

Core Planning Domains

Claude should assess importance for:

Retirement Income Strategy

Investment Strategy

Tax Optimization

Insurance and Risk Management

Estate and Legacy Planning

Cash Flow and Debt Management

Federal or Employer Benefits Optimization (if applicable)

Business or Career Strategy (if applicable)

Healthcare and Long-Term Care Planning

How to Determine Priority

For each domain, Claude should consider:

Values Influence

Which value categories are strongly represented:

Family → estate, insurance

Security → income, insurance, cash flow

Freedom → liquidity, investments

Contribution → tax and giving strategies

Goal Alignment

Which domains directly affect top goals:

Early retirement → income, investments, tax

College funding → cash flow, investments

Caregiving → insurance, estate, healthcare

Timing Pressure

Which domains impact near-term goals:

short-term home purchase → cash flow, debt

near retirement → income, healthcare, tax

Risk Exposure

Which domains pose the greatest threat if ignored:

underinsured → insurance priority

no estate documents → estate priority

Output

Ranked planning focus list with explanation, such as:

Retirement Income Strategy — because retirement timing is near and income stability is a non-negotiable priority.

Insurance and Risk Management — to protect family and support caregiving responsibilities.

Tax Optimization — to improve sustainability of retirement income.

Each focus area should clearly tie back to:

values

goals

risk factors

✅ PART 3: ACTION RECOMMENDATION GENERATOR
Objective

Turn priorities into clear, limited, achievable next steps.

Avoid:

long task lists

generic checklists

actions disconnected from purpose

Principles

Each action should:

support a high-priority focus area

connect to a specific goal or value

be understandable without technical jargon

Limit to:

3–7 recommended actions at a time

Action Types

Claude should generate actions in categories:

Education and Awareness

Example:

Understand pension and Social Security timing options

Used when:

confidence low

big decisions coming

Decision Preparation

Example:

Compare retirement income strategies for predictable vs variable income

Used when:

strategy selection required

Structural Setup

Example:

Establish emergency fund at target level

Used when:

financial foundation missing

Professional Review

Example:

Review estate documents to ensure guardianship and beneficiary alignment

Used when:

legal or technical complexity present

Optimization

Example:

Evaluate Roth conversion opportunities in low-income years

Used when:

foundational items already in place

Action Prioritization Rules

Claude should rank actions based on:

Dependency (what must happen before other actions)

Risk exposure (what protects against major downside)

Time sensitivity (what must be done soon)

Emotional importance (non-negotiables)

Output Structure

Each action should include:

Action title

Why this matters (tie to value and goal)

What this helps decide or improve

Whether it is:

self-guided

advisor-guided

specialist-guided

Example:

Review retirement income sources and timing
This supports your priority of predictable income and helps protect your goal of retiring by age 62. Understanding your pension, Social Security, and investment income options will guide how much risk you can afford to take.

🧠 SYSTEM-WIDE DESIGN PRINCIPLES FOR CLAUDE

In all outputs, Claude should:

Avoid financial product recommendations

Avoid precise numeric projections

Avoid legal or tax advice phrasing

Focus on:

planning direction

decision preparation

sequencing

This keeps the system safe, compliant, and broadly applicable.

🎯 STRATEGIC NOTE (VERY IMPORTANT)

This architecture does something most fintech products never do:

It separates:

decision framing

priority setting

execution planning

From:

calculators

projections

optimizers

That means when you later plug in:

federal analyzer

income planner

investment tools

They will be used in the right order, for the right reasons, instead of blindly.

That is exactly how good human planners work.

You are encoding professional judgment.