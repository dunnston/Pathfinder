/**
 * Goal Cards for Financial Goals Module
 * System-generated goal cards grouped by internal category
 * Categories are hidden from users during selection
 */

import type { GoalCategory, FinancialGoal } from '../types/financialGoals';

/** A system goal card template (used before user selects it) */
export interface GoalCardTemplate {
  id: string;
  label: string;
  category: GoalCategory;
  description?: string;
}

/** Helper to create a goal card template */
function createGoalTemplate(
  id: string,
  label: string,
  category: GoalCategory,
  description?: string
): GoalCardTemplate {
  return { id, label, category, description };
}

/** Lifestyle category goals */
const LIFESTYLE_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'lifestyle_travel',
    'Travel internationally every year',
    'LIFESTYLE',
    'Regular international travel experiences'
  ),
  createGoalTemplate(
    'lifestyle_vacation_home',
    'Own a vacation home or second property',
    'LIFESTYLE',
    'A getaway property for relaxation or rental income'
  ),
  createGoalTemplate(
    'lifestyle_maintain_current',
    'Maintain current lifestyle in retirement',
    'LIFESTYLE',
    'Keep the same standard of living after stopping work'
  ),
  createGoalTemplate(
    'lifestyle_upgrade',
    'Upgrade lifestyle in retirement',
    'LIFESTYLE',
    'Enjoy a higher standard of living after retiring'
  ),
  createGoalTemplate(
    'lifestyle_hobbies',
    'Pursue expensive hobbies or interests',
    'LIFESTYLE',
    'Golf, sailing, collecting, or other costly interests'
  ),
];

/** Security & Protection category goals */
const SECURITY_PROTECTION_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'security_debt_free',
    'Pay off all debt',
    'SECURITY_PROTECTION',
    'Eliminate mortgages, loans, and credit card debt'
  ),
  createGoalTemplate(
    'security_emergency_fund',
    'Build emergency reserves',
    'SECURITY_PROTECTION',
    'Have 6-12 months of expenses in accessible savings'
  ),
  createGoalTemplate(
    'security_insurance',
    'Ensure proper insurance coverage',
    'SECURITY_PROTECTION',
    'Life, disability, long-term care, and property insurance'
  ),
  createGoalTemplate(
    'security_predictable_income',
    'Have predictable income in retirement',
    'SECURITY_PROTECTION',
    'Guaranteed income sources that cover basic needs'
  ),
  createGoalTemplate(
    'security_healthcare',
    'Secure quality healthcare coverage',
    'SECURITY_PROTECTION',
    'Reliable health insurance through retirement'
  ),
  createGoalTemplate(
    'security_ltc',
    'Plan for long-term care needs',
    'SECURITY_PROTECTION',
    'Be prepared for potential care costs later in life'
  ),
];

/** Family & Legacy category goals */
const FAMILY_LEGACY_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'family_education',
    'Support children\'s education',
    'FAMILY_LEGACY',
    'Pay for college, graduate school, or other education'
  ),
  createGoalTemplate(
    'family_aging_parents',
    'Care for aging parents',
    'FAMILY_LEGACY',
    'Provide financial support or care for elderly parents'
  ),
  createGoalTemplate(
    'family_inheritance',
    'Leave an inheritance',
    'FAMILY_LEGACY',
    'Pass wealth to children, grandchildren, or heirs'
  ),
  createGoalTemplate(
    'family_grandchildren',
    'Help grandchildren financially',
    'FAMILY_LEGACY',
    'Support grandchildren with education or life expenses'
  ),
  createGoalTemplate(
    'family_home',
    'Keep the family home in the family',
    'FAMILY_LEGACY',
    'Preserve the family home for future generations'
  ),
  createGoalTemplate(
    'family_experiences',
    'Create family experiences and traditions',
    'FAMILY_LEGACY',
    'Fund family vacations, reunions, and shared experiences'
  ),
];

/** Career & Growth category goals */
const CAREER_GROWTH_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'career_business',
    'Start or grow a business',
    'CAREER_GROWTH',
    'Launch a new venture or expand an existing one'
  ),
  createGoalTemplate(
    'career_education',
    'Pursue additional education or training',
    'CAREER_GROWTH',
    'Advanced degrees, certifications, or skill development'
  ),
  createGoalTemplate(
    'career_transition',
    'Make a career transition',
    'CAREER_GROWTH',
    'Change careers or industries'
  ),
  createGoalTemplate(
    'career_consulting',
    'Start a consulting or freelance practice',
    'CAREER_GROWTH',
    'Build an independent professional practice'
  ),
];

/** Retirement category goals */
const RETIREMENT_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'retirement_specific_age',
    'Retire by a specific age',
    'RETIREMENT',
    'Have the option to fully retire by a target age'
  ),
  createGoalTemplate(
    'retirement_early',
    'Retire early (before 60)',
    'RETIREMENT',
    'Achieve financial independence for early retirement'
  ),
  createGoalTemplate(
    'retirement_part_time',
    'Transition to part-time work',
    'RETIREMENT',
    'Reduce work hours before fully retiring'
  ),
  createGoalTemplate(
    'retirement_work_optional',
    'Make work completely optional',
    'RETIREMENT',
    'Work only if you want to, not because you have to'
  ),
  createGoalTemplate(
    'retirement_taxes',
    'Reduce taxes over time',
    'RETIREMENT',
    'Minimize tax burden in retirement years'
  ),
];

/** Health category goals */
const HEALTH_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'health_quality_care',
    'Access quality healthcare',
    'HEALTH',
    'Afford the best doctors and treatments when needed'
  ),
  createGoalTemplate(
    'health_wellness',
    'Invest in wellness and prevention',
    'HEALTH',
    'Fund fitness, nutrition, and preventive care'
  ),
  createGoalTemplate(
    'health_mental',
    'Prioritize mental health support',
    'HEALTH',
    'Access therapy, coaching, or mental wellness resources'
  ),
];

/** Major Purchases category goals */
const MAJOR_PURCHASES_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'purchase_home',
    'Buy or upgrade a home',
    'MAJOR_PURCHASES',
    'Purchase a new home or make major improvements'
  ),
  createGoalTemplate(
    'purchase_vehicle',
    'Buy a new vehicle',
    'MAJOR_PURCHASES',
    'Purchase a car, boat, RV, or other vehicle'
  ),
  createGoalTemplate(
    'purchase_renovation',
    'Complete major home renovation',
    'MAJOR_PURCHASES',
    'Kitchen remodel, addition, or other major project'
  ),
  createGoalTemplate(
    'purchase_investment_property',
    'Buy investment property',
    'MAJOR_PURCHASES',
    'Purchase real estate for rental income'
  ),
];

/** Giving category goals */
const GIVING_GOALS: GoalCardTemplate[] = [
  createGoalTemplate(
    'giving_charitable',
    'Fund charitable giving',
    'GIVING',
    'Regular contributions to causes you care about'
  ),
  createGoalTemplate(
    'giving_foundation',
    'Establish a family foundation or fund',
    'GIVING',
    'Create a lasting philanthropic vehicle'
  ),
  createGoalTemplate(
    'giving_faith',
    'Support faith-based organizations',
    'GIVING',
    'Tithing or contributions to religious organizations'
  ),
  createGoalTemplate(
    'giving_community',
    'Give back to local community',
    'GIVING',
    'Support local charities, schools, or organizations'
  ),
];

/** All system goal card templates */
export const GOAL_CARD_TEMPLATES: GoalCardTemplate[] = [
  ...LIFESTYLE_GOALS,
  ...SECURITY_PROTECTION_GOALS,
  ...FAMILY_LEGACY_GOALS,
  ...CAREER_GROWTH_GOALS,
  ...RETIREMENT_GOALS,
  ...HEALTH_GOALS,
  ...MAJOR_PURCHASES_GOALS,
  ...GIVING_GOALS,
];

/** Get goal templates by category */
export function getGoalTemplatesByCategory(category: GoalCategory): GoalCardTemplate[] {
  return GOAL_CARD_TEMPLATES.filter((template) => template.category === category);
}

/** Get a goal template by ID */
export function getGoalTemplateById(id: string): GoalCardTemplate | undefined {
  return GOAL_CARD_TEMPLATES.find((template) => template.id === id);
}

/** Convert a template to a FinancialGoal when user selects it */
export function templateToGoal(template: GoalCardTemplate): FinancialGoal {
  return {
    id: template.id,
    label: template.label,
    source: 'system',
    priority: 'NA',
    isCorePlanningGoal: false,
    category: template.category,
    createdAt: new Date().toISOString(),
  };
}

/** Create a user-generated goal */
export function createUserGoal(
  label: string,
  category: GoalCategory = 'LIFESTYLE'
): FinancialGoal {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label,
    source: 'user',
    priority: 'NA',
    isCorePlanningGoal: false,
    category,
    createdAt: new Date().toISOString(),
  };
}

/** Category display names */
export const GOAL_CATEGORY_DISPLAY_NAMES: Record<GoalCategory, string> = {
  LIFESTYLE: 'Lifestyle',
  SECURITY_PROTECTION: 'Security & Protection',
  FAMILY_LEGACY: 'Family & Legacy',
  CAREER_GROWTH: 'Career & Growth',
  RETIREMENT: 'Retirement',
  HEALTH: 'Health',
  MAJOR_PURCHASES: 'Major Purchases',
  GIVING: 'Giving',
};

/** Priority display names and colors */
export const PRIORITY_DISPLAY = {
  HIGH: { label: 'High Priority', color: 'red', emoji: '🔥' },
  MEDIUM: { label: 'Medium Priority', color: 'yellow', emoji: '⚪' },
  LOW: { label: 'Low Priority', color: 'blue', emoji: '❄️' },
  NA: { label: 'Not a Focus', color: 'gray', emoji: '🚫' },
} as const;

/** Time horizon display names */
export const TIME_HORIZON_DISPLAY = {
  SHORT: { label: 'Short term (0-3 years)', years: '0-3' },
  MID: { label: 'Mid term (3-10 years)', years: '3-10' },
  LONG: { label: 'Long term (10+ years)', years: '10+' },
  ONGOING: { label: 'Ongoing / continuous', years: 'ongoing' },
} as const;

/** Flexibility display names */
export const FLEXIBILITY_DISPLAY = {
  FIXED: { label: 'Non-negotiable', description: 'This goal cannot be adjusted' },
  FLEXIBLE: { label: 'Important but flexible', description: 'Would adjust if needed' },
  DEFERABLE: { label: 'Would delay if needed', description: 'Can be postponed' },
} as const;
