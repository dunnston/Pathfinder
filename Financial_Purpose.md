Statement of Financial Purpose Module — Implementation Guide
Objective

Generate a 1–2 sentence Statement of Financial Purpose that is:

grounded in the client’s Top Values + Non-Negotiables

aligned with their retirement vision and goals

usable as a decision filter (“when we face tradeoffs, we prioritize X over Y”)

created without requiring clients to “already know their purpose”

Output

purposeThemes (structured ingredients)

sofpDrafts[] (1–3 drafts the client can edit)

finalSoFP (chosen + edited, 1–2 sentences)

optional advisorNotes (what was hard / what was excluded)

1) UX FLOW (WIZARD)
Step 0 — Intro

Explain in plain language:

“This is your ‘why’ for money. We’ll use it to guide decisions and tradeoffs.”

Show 2–3 example SoFPs (your own wording, short).

CTA: Start.

Step 1 — Confirm Inputs (pull from profile)

Pre-fill and let them confirm/edit:

Top 5 values + non-negotiables (from values module)

Retirement “good life” descriptors (from retirement vision)

Top 3 goals (from goals module, if present)

If any are missing, show:

“To write a strong purpose statement, we need your values and a few goals.”

Step 2 — “What does money protect or enable?” (choose 1–2 drivers)

Prompt:

When money is working well, what is it mainly doing for you?

Pick up to 2:

Protecting my family

Giving me freedom and options

Creating stability and peace of mind

Supporting health and quality of life

Helping me make an impact (giving/community)

Supporting meaningful work and purpose

Helping me feel in control and confident

Building growth and opportunity

(These map to your internal categories but are phrased as outcomes.)

Output: primaryDriver, secondaryDriver

Step 3 — Tradeoff Anchor (the “when choices are hard” line)

This makes the SoFP actually useful.

Prompt:

When you face tradeoffs, which direction do you want your money decisions to lean?

Show 3 quick forced choices based on their value categories:

Examples:

“Stability now” vs “More upside later”

“Freedom sooner” vs “More certainty later”

“Lifestyle today” vs “Safety buffer first”

Each answer stores a simple preference.

Output: tradeoffAnchors[]

Step 4 — Specific Vision Anchor (choose 1–2 vivid phrases)

Prompt:

Which of these feels most like the life you’re building toward?

Generate 8–12 options based on their profile (non-AI version can be templated):

Examples:

“A calm, low-stress life with time for people I love”

“Work optional with the freedom to travel regularly”

“Stable income that keeps life simple and predictable”

“Being present for family milestones and creating shared experiences”

“Living generously and supporting causes that matter to us”

“Healthy aging with access to quality care and flexibility”

“A life guided by faith, integrity, and stewardship”

Let them pick up to 2, and optionally write their own.

Output: visionAnchors[]

Step 5 — Assemble Drafts (no AI required)

Now the app creates 2–3 draft SoFPs using templates and their selected ingredients.

Template library (examples)

Template A: “True wealth is…”

True wealth for me is {visionAnchor}, supported by {primaryDriver}, so I can {topGoalOrOutcome}.

Template B: “Money’s purpose is…”

Money’s purpose in my life is to {primaryDriver} and {secondaryDriver}, so I can {visionAnchor}.

Template C: “When tradeoffs arise…”

My financial decisions should prioritize {nonNegotiableValueTheme} over {tradeoffOpposite}, so I can {visionAnchor}.

Let them:

select a favorite draft

edit it directly

see a live “length meter” (warn if over ~250 characters)

Output: sofpDrafts[], selectedDraftId

Step 6 — Refinement Questions (lightweight)

Ask 3 quick reflection prompts:

“Does this sound like you, or like what you think you should say?”

“Which core value is missing from this statement?” (choose from top 5)

“What word would make this feel more motivating?” (one word)

Allow edits again.

Output: finalSoFP

Step 7 — Couple Mode (optional, but plan for it)

If profile is “Household / Couple”:

Run Steps 2–4 separately for each person (5 minutes each)

Then show overlap:

shared drivers

shared anchors

conflicting tradeoff anchors

Generate:

“Shared SoFP” draft

“Individual SoFPs” drafts
Let them choose shared vs separate.

2) DATA MODEL (STORE IN PROFILE)
type PurposeDriver =
  | "PROTECT_FAMILY"
  | "FREEDOM_OPTIONS"
  | "STABILITY_PEACE"
  | "HEALTH_QUALITY"
  | "IMPACT_GIVING"
  | "MEANING_PURPOSE"
  | "CONTROL_CONFIDENCE"
  | "GROWTH_OPPORTUNITY";

type TradeoffAxis =
  | "SECURITY_VS_GROWTH"
  | "FREEDOM_SOONER_VS_CERTAINTY_LATER"
  | "LIFESTYLE_NOW_VS_BUFFER_FIRST"
  | "CONTROL_STRUCTURE_VS_FLEXIBILITY";

interface TradeoffAnchor {
  axis: TradeoffAxis;
  lean: "A" | "B" | "NEUTRAL";
  strength: 1 | 2 | 3 | 4 | 5;
}

interface SoFPDraft {
  id: string;
  templateId: string;
  text: string;
  createdAt: string;
  editedByUser?: boolean;
}

interface FinancialPurpose {
  state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

  primaryDriver?: PurposeDriver;
  secondaryDriver?: PurposeDriver;

  visionAnchors: string[]; // 0-2 user-picked phrases
  tradeoffAnchors: TradeoffAnchor[];

  drafts: SoFPDraft[];
  selectedDraftId?: string;

  finalText?: string; // 1-2 sentences
  completedAt?: string;

  // Optional diagnostics
  missingValues?: string[]; // which top values aren't reflected
  notes?: string; // advisor notes or client reflection
}

3) TEMPLATE ENGINE (NON-AI)

Implement a small template renderer that takes:

primaryDriver, secondaryDriver

visionAnchors[0]

topGoals[0] (if available)

dominantValueCategory

nonNegotiables

Mapping drivers to phrases

Example mapping:

PROTECT_FAMILY → “protect my family and the people who depend on me”

FREEDOM_OPTIONS → “create freedom and options in how I use my time”

STABILITY_PEACE → “build stability and peace of mind”
…etc.

Generate 2–3 drafts:

one “True wealth…”

one “Money’s purpose…”

one tradeoff-oriented

Then let user edit.

This avoids hallucination risk and keeps quality high.

4) HOW THIS CONNECTS TO PLANNING (IMPORTANT)

Once SoFP exists, use it as a “header” in:

plan presentation

recommendations

tradeoff explanations

Example UI block:
Statement of Financial Purpose

{finalText}

Then:
Decision filter (auto-generated from anchors)

“Leans toward: stability over upside”

“Leans toward: freedom sooner over certainty later” (if applicable)

This makes SoFP operational, not motivational wallpaper.

5) MVP SCOPE (DO THIS FIRST)
MVP (build now)

Steps 0–6

No AI

No couple mode (optional)

2–3 templates

Store final statement + drivers + anchors

Later enhancements

AI-assisted rewrite (only after you have structured inputs)

Couple merge mode

Advisor-guided recording + transcript extraction (later, security-heavy)

Auto-check: highlight which top values are represented in the SoFP

6) CONTENT YOU NEED TO WRITE (ONCE)

You need:

8–12 example SoFPs (your own)

8–12 vision anchor phrases per dominant category (or generated from profile fields)

10–15 short driver phrase mappings

12–20 tradeoff questions (templated)

Keep everything original and planning-specific.

If you want, I can do the next piece with you:

I can write:

a full starter library of templates + driver phrase mappings + 15 vision anchors, and

8–10 example SoFPs that don’t sound corny and don’t drift into therapy-speak.

Just tell me the tone you want the SoFP to feel like:

practical and grounded

inspiring but not cheesy

faith-friendly optional (or not)