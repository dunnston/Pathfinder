/**
 * Purpose Templates for Statement of Financial Purpose Module
 * Templates, driver phrases, and vision anchors for SoFP generation
 */

import type { PurposeDriver, TradeoffAxis } from '../types/financialPurpose';

/** Purpose driver option for selection */
export interface PurposeDriverOption {
  id: PurposeDriver;
  label: string;
  description: string;
  phrase: string;
}

/** Tradeoff question for Step 3 */
export interface TradeoffQuestion {
  id: string;
  axis: TradeoffAxis;
  question: string;
  optionA: {
    label: string;
    description: string;
  };
  optionB: {
    label: string;
    description: string;
  };
}

/** Vision anchor phrase option */
export interface VisionAnchorOption {
  id: string;
  text: string;
  category?: string;
}

/** SoFP template for draft generation */
export interface SoFPTemplate {
  id: string;
  name: string;
  template: string;
  description: string;
}

/** Purpose driver options (Step 2: What does money protect or enable?) */
export const PURPOSE_DRIVER_OPTIONS: PurposeDriverOption[] = [
  {
    id: 'PROTECT_FAMILY',
    label: 'Protecting my family',
    description: 'Ensuring those who depend on me are financially secure',
    phrase: 'protect my family and the people who depend on me',
  },
  {
    id: 'FREEDOM_OPTIONS',
    label: 'Giving me freedom and options',
    description: 'Having choices in how I spend my time and live my life',
    phrase: 'create freedom and options in how I use my time',
  },
  {
    id: 'STABILITY_PEACE',
    label: 'Creating stability and peace of mind',
    description: 'Reducing financial stress and uncertainty',
    phrase: 'build stability and peace of mind',
  },
  {
    id: 'HEALTH_QUALITY',
    label: 'Supporting health and quality of life',
    description: 'Enabling wellness, healthcare, and comfortable living',
    phrase: 'support my health and quality of life',
  },
  {
    id: 'IMPACT_GIVING',
    label: 'Helping me make an impact',
    description: 'Contributing to causes and communities I care about',
    phrase: 'make a meaningful impact on the world around me',
  },
  {
    id: 'MEANING_PURPOSE',
    label: 'Supporting meaningful work and purpose',
    description: 'Enabling work and activities that provide fulfillment',
    phrase: 'pursue meaningful work and live with purpose',
  },
  {
    id: 'CONTROL_CONFIDENCE',
    label: 'Helping me feel in control and confident',
    description: 'Understanding and managing my financial situation',
    phrase: 'feel confident and in control of my financial life',
  },
  {
    id: 'GROWTH_OPPORTUNITY',
    label: 'Building growth and opportunity',
    description: 'Expanding possibilities and creating future options',
    phrase: 'build wealth and create new opportunities',
  },
];

/** Get driver phrase by ID */
export function getDriverPhrase(driverId: PurposeDriver): string {
  const driver = PURPOSE_DRIVER_OPTIONS.find((d) => d.id === driverId);
  return driver?.phrase ?? '';
}

/** Tradeoff questions (Step 3: When choices are hard) */
export const TRADEOFF_QUESTIONS: TradeoffQuestion[] = [
  {
    id: 'security_vs_growth',
    axis: 'SECURITY_VS_GROWTH',
    question: 'When you face investment decisions, which direction do you lean?',
    optionA: {
      label: 'Stability now',
      description: 'I prefer safer, steadier outcomes even if growth is lower',
    },
    optionB: {
      label: 'More upside later',
      description: 'I prefer higher potential growth even if results vary',
    },
  },
  {
    id: 'freedom_vs_certainty',
    axis: 'FREEDOM_SOONER_VS_CERTAINTY_LATER',
    question: 'When planning for retirement, which matters more to you?',
    optionA: {
      label: 'Freedom sooner',
      description: 'I would accept more uncertainty to gain freedom earlier',
    },
    optionB: {
      label: 'More certainty later',
      description: 'I would work longer or spend less to feel more secure',
    },
  },
  {
    id: 'lifestyle_vs_buffer',
    axis: 'LIFESTYLE_NOW_VS_BUFFER_FIRST',
    question: 'When balancing saving and spending, how do you lean?',
    optionA: {
      label: 'Lifestyle today',
      description: 'I would keep lifestyle spending and accept a smaller buffer',
    },
    optionB: {
      label: 'Safety buffer first',
      description: 'I would reduce lifestyle spending to build a stronger buffer',
    },
  },
  {
    id: 'control_vs_flexibility',
    axis: 'CONTROL_STRUCTURE_VS_FLEXIBILITY',
    question: 'When it comes to financial planning, which approach fits you?',
    optionA: {
      label: 'Control and structure',
      description: 'I want a detailed plan and tight oversight to avoid surprises',
    },
    optionB: {
      label: 'Flexibility',
      description: 'I want flexibility even if outcomes are less predictable',
    },
  },
];

/** Vision anchor phrases (Step 4: What life are you building toward?) */
export const VISION_ANCHOR_OPTIONS: VisionAnchorOption[] = [
  {
    id: 'calm_low_stress',
    text: 'A calm, low-stress life with time for people I love',
    category: 'peace',
  },
  {
    id: 'work_optional_travel',
    text: 'Work optional with the freedom to travel regularly',
    category: 'freedom',
  },
  {
    id: 'stable_predictable',
    text: 'Stable income that keeps life simple and predictable',
    category: 'security',
  },
  {
    id: 'family_milestones',
    text: 'Being present for family milestones and creating shared experiences',
    category: 'family',
  },
  {
    id: 'generous_giving',
    text: 'Living generously and supporting causes that matter to us',
    category: 'giving',
  },
  {
    id: 'healthy_aging',
    text: 'Healthy aging with access to quality care and flexibility',
    category: 'health',
  },
  {
    id: 'faith_integrity',
    text: 'A life guided by faith, integrity, and stewardship',
    category: 'purpose',
  },
  {
    id: 'adventure_experience',
    text: 'A life rich with adventure, new experiences, and personal growth',
    category: 'growth',
  },
  {
    id: 'legacy_impact',
    text: 'Building a legacy that outlasts me and impacts future generations',
    category: 'legacy',
  },
  {
    id: 'financial_independence',
    text: 'Complete financial independence with no obligations to anyone',
    category: 'independence',
  },
  {
    id: 'community_connection',
    text: 'Deep community connections and meaningful relationships',
    category: 'community',
  },
  {
    id: 'creative_pursuit',
    text: 'Time and resources to pursue creative passions and interests',
    category: 'creativity',
  },
];

/** SoFP templates for draft generation (Step 5) */
export const SOFP_TEMPLATES: SoFPTemplate[] = [
  {
    id: 'template_true_wealth',
    name: 'True Wealth',
    template: 'True wealth for me is {visionAnchor}, supported by {primaryDriverPhrase}, so I can {secondaryDriverPhrase}.',
    description: 'Focuses on what true wealth means to you',
  },
  {
    id: 'template_money_purpose',
    name: "Money's Purpose",
    template: "Money's purpose in my life is to {primaryDriverPhrase} and {secondaryDriverPhrase}, so I can {visionAnchor}.",
    description: 'Defines what money is for in your life',
  },
  {
    id: 'template_tradeoff',
    name: 'Decision Filter',
    template: 'My financial decisions should prioritize {tradeoffLean} over {tradeoffOpposite}, so I can {visionAnchor}.',
    description: 'Creates a clear decision-making filter',
  },
  {
    id: 'template_simple',
    name: 'Simple Statement',
    template: 'I want my money to {primaryDriverPhrase}, giving me {visionAnchor}.',
    description: 'A straightforward, simple statement',
  },
];

/** Example SoFP statements for inspiration (Step 0) */
export const EXAMPLE_SOFP_STATEMENTS: string[] = [
  'True wealth for me is a calm, low-stress life with time for people I love, supported by financial security that lets me say no to work I don\'t want.',
  'Money\'s purpose in my life is to protect my family and create freedom, so I can be present for family milestones and travel when we want.',
  'My financial decisions should prioritize stability over growth, so I can sleep well at night knowing my family is protected.',
  'I want my money to create options and flexibility, giving me the freedom to pursue meaningful work on my own terms.',
  'True wealth for me is healthy aging with access to quality care, supported by resources that let me focus on what matters most.',
];

/** Generate tradeoff lean/opposite phrases based on axis and choice */
export function getTradeoffPhrases(
  axis: TradeoffAxis,
  lean: 'A' | 'B' | 'NEUTRAL'
): { leanPhrase: string; oppositePhrase: string } {
  const phrases: Record<TradeoffAxis, { a: string; b: string }> = {
    SECURITY_VS_GROWTH: {
      a: 'stability and security',
      b: 'growth and upside potential',
    },
    FREEDOM_SOONER_VS_CERTAINTY_LATER: {
      a: 'freedom sooner',
      b: 'certainty later',
    },
    LIFESTYLE_NOW_VS_BUFFER_FIRST: {
      a: 'enjoying life today',
      b: 'building a safety buffer',
    },
    CONTROL_STRUCTURE_VS_FLEXIBILITY: {
      a: 'control and structure',
      b: 'flexibility and adaptability',
    },
  };

  const axisPhrases = phrases[axis];
  if (lean === 'A') {
    return { leanPhrase: axisPhrases.a, oppositePhrase: axisPhrases.b };
  } else if (lean === 'B') {
    return { leanPhrase: axisPhrases.b, oppositePhrase: axisPhrases.a };
  } else {
    return { leanPhrase: 'balance', oppositePhrase: 'neither extreme' };
  }
}

/** Refinement questions for Step 6 */
export const REFINEMENT_QUESTIONS = [
  {
    id: 'authenticity',
    question: 'Does this sound like you, or like what you think you should say?',
    options: ['Sounds like me', 'Needs adjustment'],
  },
  {
    id: 'missing_value',
    question: 'Which core value is missing from this statement?',
    type: 'select_from_values' as const,
  },
  {
    id: 'motivating_word',
    question: 'What one word would make this feel more motivating?',
    type: 'text_input' as const,
  },
];

/** Maximum character limit for final SoFP */
export const SOFP_MAX_LENGTH = 250;

/** Tradeoff axis display names */
export const TRADEOFF_AXIS_DISPLAY: Record<TradeoffAxis, string> = {
  SECURITY_VS_GROWTH: 'Security vs. Growth',
  FREEDOM_SOONER_VS_CERTAINTY_LATER: 'Freedom Sooner vs. Certainty Later',
  LIFESTYLE_NOW_VS_BUFFER_FIRST: 'Lifestyle Now vs. Buffer First',
  CONTROL_STRUCTURE_VS_FLEXIBILITY: 'Control vs. Flexibility',
};

/** Purpose driver display names */
export const PURPOSE_DRIVER_DISPLAY: Record<PurposeDriver, string> = {
  PROTECT_FAMILY: 'Protecting Family',
  FREEDOM_OPTIONS: 'Freedom & Options',
  STABILITY_PEACE: 'Stability & Peace',
  HEALTH_QUALITY: 'Health & Quality of Life',
  IMPACT_GIVING: 'Impact & Giving',
  MEANING_PURPOSE: 'Meaning & Purpose',
  CONTROL_CONFIDENCE: 'Control & Confidence',
  GROWTH_OPPORTUNITY: 'Growth & Opportunity',
};
